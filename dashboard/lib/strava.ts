import axios from "axios";
import fs from "node:fs";
import { ACTIVITIES_JSON, STRAVA_TOKENS_JSON } from "./paths";

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  start_date_local: string;
  distance: number; // m
  moving_time: number; // s
  elapsed_time: number; // s
  total_elevation_gain: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_speed?: number;
  average_watts?: number;
  device_watts?: boolean;
  suffer_score?: number;
}

interface TokenSet {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

function loadTokens(): TokenSet {
  if (fs.existsSync(STRAVA_TOKENS_JSON)) {
    return JSON.parse(fs.readFileSync(STRAVA_TOKENS_JSON, "utf8"));
  }
  const refresh = process.env.STRAVA_REFRESH_TOKEN;
  if (!refresh) throw new Error("STRAVA_REFRESH_TOKEN missing in .env.local");
  return { access_token: "", refresh_token: refresh, expires_at: 0 };
}

function saveTokens(t: TokenSet) {
  fs.mkdirSync(STRAVA_TOKENS_JSON.replace(/\/[^/]+$/, ""), { recursive: true });
  fs.writeFileSync(STRAVA_TOKENS_JSON, JSON.stringify(t, null, 2));
}

async function getAccessToken(): Promise<string> {
  const tokens = loadTokens();
  const now = Math.floor(Date.now() / 1000);
  if (tokens.access_token && tokens.expires_at > now + 60) {
    return tokens.access_token;
  }
  const { data } = await axios.post("https://www.strava.com/oauth/token", {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: tokens.refresh_token,
    grant_type: "refresh_token",
  });
  const next: TokenSet = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
  };
  saveTokens(next);
  return next.access_token;
}

export async function fetchRecentActivities(days = 90): Promise<StravaActivity[]> {
  const token = await getAccessToken();
  const after = Math.floor(Date.now() / 1000) - days * 86400;
  const all: StravaActivity[] = [];
  let page = 1;
  while (true) {
    const { data } = await axios.get<StravaActivity[]>(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { after, per_page: 100, page },
      },
    );
    if (data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return all;
}

export function loadActivities(): StravaActivity[] {
  if (!fs.existsSync(ACTIVITIES_JSON)) return [];
  return JSON.parse(fs.readFileSync(ACTIVITIES_JSON, "utf8"));
}
