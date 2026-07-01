import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SyncResult {
  ok: boolean;
  output: string;
  durationMs: number;
  error?: string;
}

const TIMEOUT_MS = 90_000;

let inFlight: Promise<SyncResult> | null = null;

function runSync(): Promise<SyncResult> {
  const start = Date.now();
  const script = path.join(process.cwd(), "scripts/sync-all.sh");

  return new Promise((resolve) => {
    const child = spawn("bash", [script], {
      cwd: process.cwd(),
      env: process.env,
    });

    let output = "";
    child.stdout.on("data", (d) => (output += d.toString()));
    child.stderr.on("data", (d) => (output += d.toString()));

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 2000);
      resolve({
        ok: false,
        output,
        durationMs: Date.now() - start,
        error: `Timed out after ${TIMEOUT_MS / 1000}s — check terminal logs`,
      });
    }, TIMEOUT_MS);

    child.on("exit", (code) => {
      clearTimeout(timer);
      const durationMs = Date.now() - start;
      if (code === 0) {
        resolve({ ok: true, output, durationMs });
      } else {
        const lastLine =
          output.trim().split("\n").slice(-1)[0] || `exit code ${code}`;
        resolve({ ok: false, output, durationMs, error: lastLine });
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        output,
        durationMs: Date.now() - start,
        error: err.message,
      });
    });
  });
}

export async function POST() {
  if (inFlight) {
    return NextResponse.json(
      { ok: false, error: "Sync already in progress" },
      { status: 409 },
    );
  }

  inFlight = runSync();
  try {
    const result = await inFlight;
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } finally {
    inFlight = null;
  }
}
