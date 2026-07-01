# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "garminconnect>=0.2.19",
# ]
# ///
"""
Push structured workouts to Garmin Connect.

Reads a JSON file describing one or more workouts in a simple schema,
converts each to Garmin's internal workout DTO, and creates them via the
unofficial `garminconnect` library. Created workouts appear in Garmin
Connect's Workouts library and sync to the watch on next check-in.

Schema (simple, human-authorable):

    {
      "workouts": [
        {
          "name": "Swim — W2 Mon Catch + Pull",
          "sport": "swim",            // swim | run | bike
          "notes": "Lane-friendly: fingertip drag, catch-up, pull buoy",
          "steps": [
            {"kind": "warmup",   "distance_m": 200, "description": "Easy free"},
            {"kind": "repeat",   "reps": 3, "children": [
                {"kind": "active",   "distance_m": 50, "description": "Fingertip drag"},
                {"kind": "recovery", "time_s": 10,     "description": "Rest (on 1:10)"}
            ]},
            ...
            {"kind": "cooldown", "distance_m": 100, "description": "Easy"}
          ]
        }
      ]
    }

Fields accepted on each step (pick what applies to the sport):
  - distance_m         (int)  — used for swim + bike/run distance-based steps
  - time_s             (int)  — used for time-based steps + rests
  - description        (str)
  - target             (optional) — not wired yet; watch shows "no target"

Usage:
    garmin_push.py path/to/workouts.json

Credentials:
    Expects GARMIN_EMAIL and GARMIN_PASSWORD in the environment. The shell
    wrapper script sources ~/.claude/channels/garmin/.env.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from garminconnect import Garmin, GarminConnectAuthenticationError


TOKEN_DIR = Path.home() / ".claude" / "channels" / "garmin" / "tokens"


# ---------------------------------------------------------------------------
# Garmin enum mappings (from Garmin Connect internal API)
# ---------------------------------------------------------------------------

SPORT_TYPES = {
    "run":  {"sportTypeId": 1, "sportTypeKey": "running"},
    "bike": {"sportTypeId": 2, "sportTypeKey": "cycling"},
    "swim": {"sportTypeId": 4, "sportTypeKey": "swimming"},
}

STEP_TYPES = {
    "warmup":   {"stepTypeId": 1, "stepTypeKey": "warmup"},
    "active":   {"stepTypeId": 3, "stepTypeKey": "interval"},
    "recovery": {"stepTypeId": 4, "stepTypeKey": "recovery"},
    "rest":     {"stepTypeId": 5, "stepTypeKey": "rest"},
    "cooldown": {"stepTypeId": 2, "stepTypeKey": "cooldown"},
}

END_CONDITION_DISTANCE = {"conditionTypeId": 3, "conditionTypeKey": "distance"}
END_CONDITION_TIME     = {"conditionTypeId": 2, "conditionTypeKey": "time"}
END_CONDITION_LAP      = {"conditionTypeId": 1, "conditionTypeKey": "lap.button"}

NO_TARGET = {"workoutTargetTypeId": 1, "workoutTargetTypeKey": "no.target"}


# ---------------------------------------------------------------------------
# Build Garmin workout DTO from simple schema
# ---------------------------------------------------------------------------

def _end_condition(step: dict) -> tuple[dict, float | None]:
    if "distance_m" in step:
        return END_CONDITION_DISTANCE, float(step["distance_m"])
    if "time_s" in step:
        return END_CONDITION_TIME, float(step["time_s"])
    return END_CONDITION_LAP, None


def _executable_step(step: dict, step_order: list[int]) -> dict:
    step_order[0] += 1
    end_cond, end_val = _end_condition(step)
    kind = step.get("kind", "active")
    return {
        "type": "ExecutableStepDTO",
        "stepId": None,
        "stepOrder": step_order[0],
        "childStepId": None,
        "description": step.get("description"),
        "stepType": STEP_TYPES.get(kind, STEP_TYPES["active"]),
        "endCondition": end_cond,
        "endConditionValue": end_val,
        "endConditionCompare": None,
        "endConditionZone": None,
        "targetType": NO_TARGET,
        "targetValueOne": None,
        "targetValueTwo": None,
        "targetValueUnit": None,
    }


def _repeat_group(step: dict, step_order: list[int]) -> dict:
    step_order[0] += 1
    group_order = step_order[0]
    children: list[dict] = []
    for child in step.get("children", []):
        if child.get("kind") == "repeat":
            children.append(_repeat_group(child, step_order))
        else:
            children.append(_executable_step(child, step_order))
    return {
        "type": "RepeatGroupDTO",
        "stepId": None,
        "stepOrder": group_order,
        "childStepId": None,
        "numberOfIterations": int(step.get("reps", 1)),
        "smartRepeat": False,
        "endConditionValue": None,
        "workoutSteps": children,
        "stepType": {"stepTypeId": 6, "stepTypeKey": "repeat"},
    }


def build_workout_dto(workout: dict) -> dict:
    sport = workout["sport"].lower()
    if sport not in SPORT_TYPES:
        raise ValueError(f"Unsupported sport: {sport}")
    sport_type = SPORT_TYPES[sport]

    step_order = [0]
    steps: list[dict] = []
    for step in workout.get("steps", []):
        if step.get("kind") == "repeat":
            steps.append(_repeat_group(step, step_order))
        else:
            steps.append(_executable_step(step, step_order))

    return {
        "workoutName": workout["name"],
        "description": workout.get("notes", ""),
        "sportType": sport_type,
        "subSportType": None,
        "estimatedDurationInSecs": 0,
        "estimatedDistanceInMeters": 0,
        "workoutSegments": [
            {
                "segmentOrder": 1,
                "sportType": sport_type,
                "workoutSteps": steps,
            }
        ],
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: garmin_push.py path/to/workouts.json", file=sys.stderr)
        return 2

    path = Path(argv[1])
    if not path.exists():
        print(f"ERROR: {path} not found", file=sys.stderr)
        return 2

    payload = json.loads(path.read_text())
    workouts = payload.get("workouts") or []
    if not workouts:
        print("ERROR: no workouts in payload (expected 'workouts' array)", file=sys.stderr)
        return 2

    email = os.environ.get("GARMIN_EMAIL", "").strip() or None
    password = os.environ.get("GARMIN_PASSWORD", "").strip() or None

    TOKEN_DIR.mkdir(parents=True, exist_ok=True)
    client = Garmin(email, password)
    try:
        client.login(str(TOKEN_DIR))
    except GarminConnectAuthenticationError:
        if not email or not password:
            print(
                "ERROR: no valid cached tokens and GARMIN_EMAIL / GARMIN_PASSWORD not set",
                file=sys.stderr,
            )
            return 2
        raise

    created: list[tuple[str, int]] = []
    for w in workouts:
        dto = build_workout_dto(w)
        print(f"  → {w['name']} ({w['sport']})")
        resp = client.upload_workout(dto)
        workout_id = None
        if isinstance(resp, dict):
            workout_id = resp.get("workoutId") or resp.get("workoutKey")
        created.append((w["name"], workout_id))

    print("\nCreated workouts:")
    for name, wid in created:
        print(f"  {wid or '??'}\t{name}")

    print(f"\n{len(created)} workouts pushed. They'll sync to your watch on next Garmin Connect check-in.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
