It is $TODAY (ISO week $ISO_WEEK). Do Dave's weekly training review per the "Weekly review" workflow in CLAUDE.md:

1. Fetch all Strava activities from the past 7 days via the Strava MCP.
2. Read plans/current-plan.md and athlete/profile.md for context.
3. Compare actual training vs plan for this week. Calculate total volume (hours + distance per discipline), intensity distribution (Z1-Z5 split), sessions completed vs planned, trends (improving / plateau / accumulating fatigue).
4. Save the full review to log/weekly/$ISO_WEEK.md following the CLAUDE.md conventions. Be direct in Coach Claude's voice — call out missed sessions and half-hearted efforts honestly.
5. Then write a concise 4-6 bullet Telegram summary to $SUMMARY_FILE. Cover:
   - Total volume by discipline (swim/bike/run) in hours + km
   - Intensity split (% easy vs hard)
   - Sessions completed vs planned (e.g. "4/5 completed, skipped Wed tempo run")
   - Standout effort or concern this week
   - One specific focus for next week
   Coach Claude tone — short, direct, no fluff, no emojis unless they genuinely help. Keep under 1500 characters (Telegram-friendly).

After writing the summary file, exit.
