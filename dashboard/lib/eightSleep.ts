import axios, { AxiosInstance } from "axios";
import fs from "node:fs";
import { EIGHT_SLEEP_JSON } from "./paths";

// Mirrors the auth flow used by 8sleep-mcp
const AUTH_URL = "https://auth-api.8slp.net/v1/tokens";
const API_BASE = "https://client-api.8slp.net/v1";

interface AuthResp {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  userId: string;
}

let cachedClient: AxiosInstance | null = null;
let cachedUserId: string | null = null;
let cachedExpiry = 0;

async function getClient(): Promise<{ client: AxiosInstance; userId: string }> {
  const now = Date.now();
  if (cachedClient && cachedUserId && cachedExpiry > now + 60_000) {
    return { client: cachedClient, userId: cachedUserId };
  }
  const payload = {
    grant_type: "password",
    client_id: process.env.EIGHT_SLEEP_CLIENT_ID,
    client_secret: process.env.EIGHT_SLEEP_CLIENT_SECRET,
    username: process.env.EIGHT_SLEEP_EMAIL,
    password: process.env.EIGHT_SLEEP_PASSWORD,
  };
  const { data } = await axios.post<AuthResp>(AUTH_URL, payload);
  const userId = process.env.EIGHT_SLEEP_USER_ID || data.userId;
  cachedClient = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  cachedUserId = userId;
  cachedExpiry = now + data.expires_in * 1000;
  return { client: cachedClient, userId };
}

export interface ESDailySummary {
  date: string; // YYYY-MM-DD
  hrv: number | null;
  restingHr: number | null;
  sleepDurationMin: number | null;
  score: number | null;
}

// /users/{id}/trends response — based on 8sleep-mcp implementation
interface TrendsResp {
  days?: Array<{
    day: string;
    score?: number;
    sleepDuration?: number;
    sessions?: Array<{
      timeseries?: {
        rmssd?: Array<[string, number]>;
        heartRate?: Array<[string, number]>;
      };
    }>;
  }>;
}

export async function fetchESRange(
  startDate: string,
  endDate: string,
): Promise<ESDailySummary[]> {
  const { client, userId } = await getClient();
  const { data } = await client.get<TrendsResp>(`/users/${userId}/trends`, {
    params: {
      tz: "Europe/London",
      from: startDate,
      to: endDate,
      "include-main": "false",
      "include-all-sessions": "true",
      "model-version": "v2",
    },
  });
  return (data.days || []).map((d) => {
    const date = d.day;
    const rmssdAll: number[] = [];
    const hrAll: number[] = [];
    for (const s of d.sessions || []) {
      for (const [, v] of s.timeseries?.rmssd || []) {
        if (typeof v === "number") rmssdAll.push(v);
      }
      for (const [, v] of s.timeseries?.heartRate || []) {
        if (typeof v === "number" && v > 30) hrAll.push(v);
      }
    }
    const hrv = rmssdAll.length
      ? Math.round(rmssdAll.reduce((a, b) => a + b, 0) / rmssdAll.length)
      : null;
    const restingHr = hrAll.length ? Math.min(...hrAll) : null;
    return {
      date,
      hrv,
      restingHr,
      sleepDurationMin: d.sleepDuration
        ? Math.round(d.sleepDuration / 60)
        : null,
      score: d.score ?? null,
    };
  });
}

export function loadES(): ESDailySummary[] {
  if (!fs.existsSync(EIGHT_SLEEP_JSON)) return [];
  return JSON.parse(fs.readFileSync(EIGHT_SLEEP_JSON, "utf8"));
}
