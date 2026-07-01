# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "garminconnect>=0.2.19",
# ]
# ///
"""
Pull recovery / readiness data from Garmin Connect.

Outputs JSON to stdout. Use --save to also persist per-day JSON to
log/garmin/YYYY-MM-DD.json.

Auth:
    Reads GARMIN_EMAIL / GARMIN_PASSWORD from env on first run, then caches
    session tokens in ~/.claude/channels/garmin/tokens/ so later runs skip
    the login round-trip (and avoid Garmin's aggressive login rate limits).

Usage:
    uv run scripts/garmin/garmin_pull.py                    # today
    uv run scripts/garmin/garmin_pull.py --date 2026-04-20  # specific date
    uv run scripts/garmin/garmin_pull.py --last 7           # last 7 days
    uv run scripts/garmin/garmin_pull.py --last 7 --save    # also write to log/garmin/
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Callable

from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)


TOKEN_DIR = Path.home() / ".claude" / "channels" / "garmin" / "tokens"
LOG_DIR = Path(__file__).resolve().parents[2] / "log" / "garmin"


def get_client() -> Garmin:
    """Resume a cached session if possible, otherwise login with creds.

    Garmin.login(tokenstore) loads cached tokens if present, else falls back
    to credentials login and auto-dumps tokens to the tokenstore path.
    """
    TOKEN_DIR.mkdir(parents=True, exist_ok=True)
    email = os.environ.get("GARMIN_EMAIL", "").strip() or None
    password = os.environ.get("GARMIN_PASSWORD", "").strip() or None
    client = Garmin(email, password)
    try:
        client.login(str(TOKEN_DIR))
    except GarminConnectAuthenticationError:
        if not email or not password:
            sys.stderr.write(
                "ERROR: no valid cached tokens and GARMIN_EMAIL / GARMIN_PASSWORD not set\n"
            )
            sys.exit(2)
        raise
    return client


def safe(fn: Callable[[], Any]) -> Any:
    try:
        return fn()
    except GarminConnectTooManyRequestsError as exc:
        return {"_error": f"rate_limited: {exc}"}
    except Exception as exc:
        return {"_error": f"{type(exc).__name__}: {exc}"}


def pull_day(client: Garmin, d: str) -> dict:
    return {
        "date": d,
        "sleep": safe(lambda: client.get_sleep_data(d)),
        "hrv": safe(lambda: client.get_hrv_data(d)),
        "stats": safe(lambda: client.get_stats(d)),
        "rhr": safe(lambda: client.get_rhr_day(d)),
        "training_readiness": safe(lambda: client.get_training_readiness(d)),
        "body_battery": safe(lambda: client.get_body_battery(d, d)),
    }


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Pull Garmin recovery data.")
    p.add_argument("--date", default=date.today().isoformat(),
                   help="End date YYYY-MM-DD (default: today)")
    p.add_argument("--last", type=int, default=1,
                   help="Number of days to pull, ending on --date (default: 1)")
    p.add_argument("--save", action="store_true",
                   help="Also write per-day JSON to log/garmin/")
    return p.parse_args()


def main() -> int:
    args = parse_args()

    try:
        end = date.fromisoformat(args.date)
    except ValueError:
        sys.stderr.write(f"ERROR: --date must be YYYY-MM-DD, got {args.date!r}\n")
        return 2

    n = max(1, args.last)
    days = [(end - timedelta(days=i)).isoformat() for i in range(n - 1, -1, -1)]

    client = get_client()
    payload = {"days": [pull_day(client, d) for d in days]}
    print(json.dumps(payload, indent=2, default=str))

    if args.save:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        for day in payload["days"]:
            (LOG_DIR / f"{day['date']}.json").write_text(
                json.dumps(day, indent=2, default=str)
            )
        sys.stderr.write(f"Saved {len(days)} file(s) to {LOG_DIR}\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
