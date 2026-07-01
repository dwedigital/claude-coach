import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import fs from "node:fs";
import path from "node:path";
import { fetchESRange } from "../lib/eightSleep";
import { EIGHT_SLEEP_JSON } from "../lib/paths";

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const end = new Date();
  const start = new Date(end.getTime() - 60 * 86_400_000);
  const summaries = await fetchESRange(fmt(start), fmt(end));
  fs.mkdirSync(path.dirname(EIGHT_SLEEP_JSON), { recursive: true });
  fs.writeFileSync(EIGHT_SLEEP_JSON, JSON.stringify(summaries, null, 2));
  console.log(`Saved ${summaries.length} ES days to ${EIGHT_SLEEP_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
