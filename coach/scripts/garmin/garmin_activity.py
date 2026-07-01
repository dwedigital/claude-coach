# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "garminconnect>=0.2.19",
# ]
# ///
"""
Pull Garmin Connect activity data for session reviews.

Two modes:
    1. List mode (default): returns activities matching --date (default today)
       with id, sport, name, start time, duration, distance. Use this to find
       the Garmin activity ID that corresponds to a Strava activity.
    2. Detail mode (--id): returns the full structured payload for one activity
       including typed splits (WARMUP / INTERVAL_ACTIVE / RECOVERY / COOLDOWN),
       HR time-in-zones, and plain splits. This is what the cross-check
       against Strava laps uses to separate prescribed structure from what
       was actually swum/run/ridden.

Auth:
    Same as garmin_pull.py — reads GARMIN_EMAIL / GARMIN_PASSWORD from env on
    first run, caches tokens in ~/.claude/channels/garmin/tokens/ for reuse.

Usage:
    uv run scripts/garmin/garmin_activity.py                         # today's activities
    uv run scripts/garmin/garmin_activity.py --date 2026-04-20       # that date
    uv run scripts/garmin/garmin_activity.py --id 18221842604        # full detail
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date
from pathlib import Path
from typing import Any, Callable

from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)


TOKEN_DIR = Path.home() / ".claude" / "channels" / "garmin" / "tokens"


def get_client() -> Garmin:
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


def list_for_date(client: Garmin, d: str) -> list[dict]:
    """Activities with startTimeLocal beginning with d (YYYY-MM-DD)."""
    raw = safe(lambda: client.get_activities_by_date(d, d)) or []
    if isinstance(raw, dict) and "_error" in raw:
        return [raw]
    out = []
    for a in raw:
        out.append({
            "id": a.get("activityId"),
            "name": a.get("activityName"),
            "sport": (a.get("activityType") or {}).get("typeKey"),
            "start_local": a.get("startTimeLocal"),
            "duration_s": a.get("duration"),
            "distance_m": a.get("distance"),
        })
    return out


def detail(client: Garmin, activity_id: int) -> dict:
    return {
        "id": activity_id,
        "summary": safe(lambda: client.get_activity(activity_id)),
        "details": safe(lambda: client.get_activity_details(activity_id)),
        "typed_splits": safe(lambda: client.get_activity_typed_splits(activity_id)),
        "splits": safe(lambda: client.get_activity_splits(activity_id)),
        "hr_in_timezones": safe(lambda: client.get_activity_hr_in_timezones(activity_id)),
    }


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Pull Garmin activity data.")
    p.add_argument("--date", default=date.today().isoformat(),
                   help="Date YYYY-MM-DD for list mode (default: today)")
    p.add_argument("--id", type=int, default=None,
                   help="Activity ID — returns full detail instead of a list")
    return p.parse_args()


def main() -> int:
    args = parse_args()

    client = get_client()

    if args.id is not None:
        payload: Any = detail(client, args.id)
    else:
        try:
            date.fromisoformat(args.date)
        except ValueError:
            sys.stderr.write(f"ERROR: --date must be YYYY-MM-DD, got {args.date!r}\n")
            return 2
        payload = {"date": args.date, "activities": list_for_date(client, args.date)}

    print(json.dumps(payload, indent=2, default=str))
    return 0


if __name__ == "__main__":
    sys.exit(main())
