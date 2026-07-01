import path from "node:path";

/**
 * Absolute path to the coach mechanic directory (contains athlete/, plans/, log/).
 * Set COACH_PROJECT_PATH in dashboard/.env.local — required.
 *
 * If running the dashboard from within the monorepo alongside coach/,
 * this is typically ../coach relative to dashboard/.
 */
export const COACH_PROJECT_PATH =
  process.env.COACH_PROJECT_PATH || path.resolve(process.cwd(), "../coach");

export const PLAN_PATH = path.join(COACH_PROJECT_PATH, "plans/current-plan.md");
export const REVIEWS_DIR = path.join(COACH_PROJECT_PATH, "log/reviews");
export const READINESS_DIR = path.join(COACH_PROJECT_PATH, "log/readiness");
export const GARMIN_DIR = path.join(COACH_PROJECT_PATH, "log/garmin");
export const RENPHO_DIR = path.join(COACH_PROJECT_PATH, "log/renpho");
export const GOALS_DIR = path.join(COACH_PROJECT_PATH, "goals");
export const PROFILE_PATH = path.join(COACH_PROJECT_PATH, "athlete/profile.md");

export const DATA_DIR = path.join(process.cwd(), "data");
export const ACTIVITIES_JSON = path.join(DATA_DIR, "activities.json");
export const EIGHT_SLEEP_JSON = path.join(DATA_DIR, "eight-sleep.json");
export const STRAVA_TOKENS_JSON = path.join(DATA_DIR, "strava-tokens.json");
