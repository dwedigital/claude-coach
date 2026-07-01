# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "renpho-api>=0.1.0",
# ]
# ///
"""
Pull body-composition data from Renpho (via unofficial reverse-engineered API).

Outputs JSON to stdout. Use --save to persist per-day JSON to
log/renpho/YYYY-MM-DD.json.

Auth:
    Reads RENPHO_EMAIL / RENPHO_PASSWORD from env. Requires a LEGACY Renpho
    account (renpho.qnclouds.com), not the newer Renpho Health app.

Usage:
    uv run scripts/renpho/pull-weight.py                    # latest reading
    uv run scripts/renpho/pull-weight.py --last 30          # last 30 readings
    uv run scripts/renpho/pull-weight.py --last 30 --save   # also persist per-day JSON
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = REPO_ROOT / "log" / "renpho"


def die(msg: str, code: int = 1) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def to_iso(ts) -> str | None:
    if ts is None:
        return None
    try:
        return datetime.fromtimestamp(int(ts), tz=timezone.utc).isoformat()
    except (TypeError, ValueError):
        return str(ts)


def num(m: dict, key: str) -> float | None:
    v = m.get(key)
    try:
        return round(float(v), 2) if v is not None else None
    except (TypeError, ValueError):
        return None


def normalise(m: dict) -> dict:
    """Flatten a Renpho measurement into fields we care about (using actual API field names)."""
    ts = m.get("timeStamp") or m.get("time_stamp") or m.get("created_at")
    return {
        "timestamp": to_iso(ts),
        "local_time": m.get("localCreatedAt"),
        "scale": m.get("scaleName"),
        "weight_kg": num(m, "weight"),
        "bmi": num(m, "bmi"),
        "body_fat_pct": num(m, "bodyfat"),
        "water_pct": num(m, "water"),
        "muscle_pct": num(m, "muscle"),
        "bone_pct": num(m, "bone"),
        "bmr_kcal": num(m, "bmr"),
        "visceral_fat_level": num(m, "visfat"),
        "subcutaneous_fat_pct": num(m, "subfat"),
        "protein_pct": num(m, "protein"),
        "body_age": num(m, "bodyage"),
        "lean_body_mass_kg": num(m, "sinew"),
        "fat_free_weight_kg": num(m, "fatFreeWeight"),
        "heart_rate_bpm": num(m, "heartRate"),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--last", type=int, default=1, help="Number of most recent readings to pull (default 1)")
    ap.add_argument("--save", action="store_true", help="Also write per-day JSON files under log/renpho/")
    ap.add_argument("--raw", action="store_true", help="Print raw Renpho payload instead of normalised")
    args = ap.parse_args()

    email = os.environ.get("RENPHO_EMAIL")
    password = os.environ.get("RENPHO_PASSWORD")
    if not email or not password:
        die("RENPHO_EMAIL / RENPHO_PASSWORD not set in env")

    try:
        from renpho import RenphoClient, RenphoAPIError  # type: ignore
    except ImportError as e:
        die(f"renpho-api not installed: {e}")

    client = RenphoClient(email, password)
    try:
        client.login()
    except RenphoAPIError as e:
        die(f"Renpho login failed: {e}")

    try:
        measurements = list(client.get_all_measurements() or [])
    except Exception as e:
        die(f"Failed to fetch measurements: {e}")

    def sort_key(m: dict) -> int:
        ts = m.get("timeStamp") or m.get("time_stamp") or 0
        try:
            return int(ts)
        except (TypeError, ValueError):
            return 0

    measurements.sort(key=sort_key, reverse=True)
    slice_ = measurements[: args.last]

    if args.raw:
        print(json.dumps(slice_, indent=2, default=str))
    else:
        out = [normalise(m) for m in slice_]
        print(json.dumps(out, indent=2))

    if args.save:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        by_day: dict[str, list[dict]] = {}
        for m in slice_:
            n = normalise(m)
            if not n["timestamp"]:
                continue
            day = n["timestamp"][:10]
            by_day.setdefault(day, []).append(n)
        for day, readings in by_day.items():
            out_path = LOG_DIR / f"{day}.json"
            payload = {
                "date": day,
                "source": "renpho",
                "pulled_at": datetime.now(tz=timezone.utc).isoformat(),
                "readings": readings,
            }
            out_path.write_text(json.dumps(payload, indent=2))
            print(f"  wrote {out_path.relative_to(REPO_ROOT)}", file=sys.stderr)


if __name__ == "__main__":
    main()
