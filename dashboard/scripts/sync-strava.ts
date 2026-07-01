import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import fs from "node:fs";
import path from "node:path";
import { fetchRecentActivities } from "../lib/strava";
import { ACTIVITIES_JSON } from "../lib/paths";

async function main() {
  const acts = await fetchRecentActivities(120);
  fs.mkdirSync(path.dirname(ACTIVITIES_JSON), { recursive: true });
  fs.writeFileSync(ACTIVITIES_JSON, JSON.stringify(acts, null, 2));
  console.log(`Saved ${acts.length} activities to ${ACTIVITIES_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
