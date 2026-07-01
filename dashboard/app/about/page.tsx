import Link from "next/link";

export const metadata = {
  title: "About · Coach Dashboard",
  description:
    "How Coach Claude works — a terminal-first triathlon coach, with a dashboard for glancing.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back nav */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-xs text-text-subtle transition-colors hover:text-text"
        >
          ← Back to dashboard
        </Link>
      </div>

      {/* Hero */}
      <section className="mb-12">
        <div className="text-xs uppercase tracking-wider text-accent">
          About
        </div>
        <h1 className="mt-2 text-3xl font-medium text-text sm:text-4xl">
          A triathlon coach in your terminal.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-text-muted">
          Coach Claude is a personal endurance coach built entirely from files
          and Claude Code. Plans, activity reviews, readiness reads, race
          strategies — all live as plain markdown in one project folder. Claude
          reads them, writes them, and coaches from them. This dashboard is
          just a window on top.
        </p>
      </section>

      {/* The idea */}
      <section className="mb-12">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          The idea
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card">
            <div className="text-sm font-medium text-text">Terminal first</div>
            <div className="mt-2 text-xs text-text-muted">
              You talk to Coach Claude in Claude Code. It reads the plan,
              pulls Strava/sleep/Garmin data, and coaches like a human would.
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-text">
              Files as memory
            </div>
            <div className="mt-2 text-xs text-text-muted">
              Every plan, review, and readiness note is a markdown file in
              git. Nothing hidden in a database. The coach's whole world is
              greppable.
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-text">
              Dashboard as glasses
            </div>
            <div className="mt-2 text-xs text-text-muted">
              This dashboard is read-only. It shows the plan, readiness,
              trends. It never edits anything — that's the coach's job.
            </div>
          </div>
        </div>
      </section>

      {/* Data flow */}
      <section className="mb-12">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          Data flow
        </div>
        <div className="card">
          <DataFlowDiagram />
          <p className="mt-6 text-xs text-text-muted">
            Data flows one way: sources → markdown files. Coach Claude reads
            the markdown, chats with you, and writes back structured updates.
            The dashboard renders whatever's currently in the files.
          </p>
        </div>
      </section>

      {/* File structure */}
      <section className="mb-12">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          File structure
        </div>
        <div className="card">
          <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-text-muted sm:text-xs">
{`strava_coach/
├── CLAUDE.md              # Coach's system prompt — voice, rules, workflows
├── athlete/
│   └── profile.md         # Zones, FTP, CSS, weight, injuries, supplements
├── plans/
│   ├── current-plan.md    # THE plan — canonical source of truth
│   └── archive/           # Past plans, moved here on race pivot
├── goals/
│   └── 2026-08-09-*.md    # Race targets, one file per event
├── log/
│   ├── reviews/           # One markdown per activity — YYYY-MM-DD-*.md
│   ├── weekly/            # Weekly retro — YYYY-WNN.md
│   ├── readiness/         # Cross-source recovery reads
│   └── garmin/            # Raw JSON pulled from Garmin Connect
└── scripts/
    └── garmin/            # Local Python — readiness pulls, workout push`}
          </pre>
        </div>
      </section>

      {/* A day in the life */}
      <section className="mb-12">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          A day in the life
        </div>
        <ol className="space-y-3">
          <TimelineStep
            step="07:00"
            title="What's my session today?"
            body="Coach reads plans/current-plan.md, checks recent log/reviews for context, then presents the session — purpose, structure, targets, watch-outs."
          />
          <TimelineStep
            step="07:15"
            title="Session happens"
            body="You train. Strava captures the ride/run/swim. Garmin captures HR, structured intervals, recovery."
          />
          <TimelineStep
            step="post"
            title="Review my activity"
            body="Coach fetches the activity from Strava MCP, pulls HR streams + laps, compares to plan, writes a markdown review to log/reviews/, updates the Strava activity title + description with a coach-voice summary and #Coach_dAIve tag."
          />
          <TimelineStep
            step="anytime"
            title="How's my recovery?"
            body="Coach pulls Garmin readiness + Eight Sleep + last few days of activity load, synthesises across sources, writes to log/readiness/, gives a decision: proceed / swap / rest."
          />
          <TimelineStep
            step="weekly"
            title="Weekly review"
            body="Coach reads the week's reviews and activities, computes volume + intensity distribution, writes log/weekly/YYYY-WNN.md, and adjusts next week's plan if needed."
          />
        </ol>
      </section>

      {/* The stack */}
      <section className="mb-12">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          The stack
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <StackRow
            label="Coach runtime"
            value="Claude Code in the terminal"
            note="The coach *is* Claude with a project CLAUDE.md system prompt"
          />
          <StackRow
            label="Activities"
            value="Strava MCP (local fork)"
            note="get-activity-details, streams, laps, update-activity"
          />
          <StackRow
            label="Sleep + HRV"
            value="Eight Sleep MCP"
            note="getSleepData for rich per-night data, getHrv for rMSSD"
          />
          <StackRow
            label="Readiness + workouts"
            value="Garmin local scripts"
            note="pull-readiness.sh · push structured workouts to Forerunner"
          />
          <StackRow
            label="Dashboard"
            value="Next.js 14 · Tailwind · Recharts"
            note="Server components, force-dynamic, reads markdown on every request"
          />
          <StackRow
            label="Storage"
            value="Markdown + JSON files"
            note="Everything in git. No database. No cloud."
          />
        </div>
      </section>

      {/* Steal this */}
      <section className="mb-12">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          Steal this
        </div>
        <div className="card">
          <p className="text-sm text-text-muted">
            The whole thing is ~1,500 lines of code plus a fat CLAUDE.md. If
            you want to build your own version:
          </p>
          <ol className="mt-4 space-y-2 text-sm text-text-muted">
            <li className="flex gap-3">
              <span className="text-accent">1.</span>
              <span>
                Start with a folder + a <code className="rounded bg-surface-elev px-1.5 py-0.5 text-[11px]">CLAUDE.md</code>{" "}
                that says what your coach knows and how it should behave.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">2.</span>
              <span>
                Add <code className="rounded bg-surface-elev px-1.5 py-0.5 text-[11px]">athlete/profile.md</code>{" "}
                with your zones, targets, constraints. This is the coach's
                mental model of you.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">3.</span>
              <span>
                Wire up the Strava MCP so Claude can read your activities.
                Optional: Eight Sleep, Garmin, whatever you already track.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">4.</span>
              <span>
                Write a plan by hand (or ask Claude to build one from a goal).
                Save to <code className="rounded bg-surface-elev px-1.5 py-0.5 text-[11px]">plans/current-plan.md</code>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">5.</span>
              <span>
                Start talking. Ask "what's my session today?" — the workflows
                in CLAUDE.md take it from there.
              </span>
            </li>
          </ol>
          <p className="mt-6 text-xs text-text-subtle">
            The dashboard is optional. Everything a coach needs to work is
            just the files.
          </p>
        </div>
      </section>

      {/* Links */}
      <section className="mb-16">
        <div className="mb-3 text-xs uppercase tracking-wider text-text-subtle">
          Links
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkPill
            href="https://claude.com/claude-code"
            label="Claude Code"
          />
          <LinkPill
            href="https://github.com/r-huijts/strava-mcp"
            label="Strava MCP"
          />
          <LinkPill
            href="https://modelcontextprotocol.io"
            label="MCP Spec"
          />
          <LinkPill
            href="https://nextjs.org"
            label="Next.js"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-xs text-text-subtle">
        Powered by{" "}
        <a
          href="https://github.com/dwedigital/claude-coach"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Claude Coach
        </a>{" "}
        · Claude is the coach ·{" "}
        <Link href="/" className="text-accent hover:underline">
          Back to dashboard
        </Link>
      </footer>
    </main>
  );
}

function TimelineStep({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="w-16 shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
        {step}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-text">{title}</div>
        <div className="mt-1 text-xs text-text-muted">{body}</div>
      </div>
    </li>
  );
}

function StackRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wider text-text-subtle">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-text">{value}</div>
      <div className="mt-1 text-[11px] text-text-muted">{note}</div>
    </div>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {label} ↗
    </a>
  );
}

function DataFlowDiagram() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-faint)" />
        </marker>
      </defs>

      {/* Sources column */}
      <SourceBox x={20} y={30} label="Strava" sub="rides · runs · swims" />
      <SourceBox x={20} y={110} label="Eight Sleep" sub="sleep · HRV" />
      <SourceBox
        x={20}
        y={190}
        label="Garmin"
        sub="readiness · HR · workouts"
      />

      {/* Arrows sources → coach */}
      <FlowArrow x1={170} y1={55} x2={280} y2={135} />
      <FlowArrow x1={170} y1={135} x2={280} y2={150} />
      <FlowArrow x1={170} y1={215} x2={280} y2={165} />

      {/* Coach node */}
      <rect
        x="280"
        y="115"
        width="160"
        height="70"
        rx="14"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
      />
      <text
        x="360"
        y="145"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--accent)"
      >
        Coach Claude
      </text>
      <text
        x="360"
        y="164"
        textAnchor="middle"
        fontSize="10"
        fill="var(--accent)"
      >
        Claude Code
      </text>

      {/* Arrow coach → files */}
      <FlowArrow x1={440} y1={150} x2={550} y2={150} />

      {/* Files node */}
      <rect
        x="550"
        y="30"
        width="150"
        height="240"
        rx="14"
        fill="var(--surface-elev)"
        stroke="var(--border-strong)"
      />
      <text
        x="625"
        y="55"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--text)"
      >
        Markdown files
      </text>
      <FileLine y={80} label="plans/current-plan.md" />
      <FileLine y={100} label="athlete/profile.md" />
      <FileLine y={120} label="goals/*.md" />
      <FileLine y={140} label="log/reviews/*.md" />
      <FileLine y={160} label="log/weekly/*.md" />
      <FileLine y={180} label="log/readiness/*.md" />
      <FileLine y={200} label="log/garmin/*.json" />

      {/* Files → dashboard */}
      <FlowArrow x1={625} y1={230} x2={625} y2={275} />
      <text
        x="625"
        y="290"
        textAnchor="middle"
        fontSize="10"
        fill="var(--text-subtle)"
      >
        this dashboard (read-only)
      </text>
    </svg>
  );
}

function SourceBox({
  x,
  y,
  label,
  sub,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="150"
        height="50"
        rx="10"
        fill="var(--surface-elev)"
        stroke="var(--border-strong)"
      />
      <text
        x={x + 75}
        y={y + 22}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="var(--text)"
      >
        {label}
      </text>
      <text
        x={x + 75}
        y={y + 38}
        textAnchor="middle"
        fontSize="9"
        fill="var(--text-subtle)"
      >
        {sub}
      </text>
    </g>
  );
}

function FlowArrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--text-faint)"
      strokeWidth="1.5"
      markerEnd="url(#arrow)"
    />
  );
}

function FileLine({ y, label }: { y: number; label: string }) {
  return (
    <text
      x={565}
      y={y}
      fontSize="9"
      fontFamily="monospace"
      fill="var(--text-muted)"
    >
      {label}
    </text>
  );
}
