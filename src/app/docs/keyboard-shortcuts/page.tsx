"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Keyboard, ArrowLeft } from "lucide-react";

// This page was previously a hand-written table of shortcuts that mostly did
// not exist. It listed Ctrl+R and Cmd+R (no reload accelerator is registered),
// Alt+Left and Alt+Right (no such handler), Ctrl+Tab (not registered), and
// Cmd+L as "focus address bar" (it is bound to Focus AI Prompt). Four of its
// rows had "keys" that were not key combinations at all: "AI Command",
// "Brightness", "Schedule", "Daily Weekly". It cited
// src/lib/KeyboardShortcutService.ts, which is not a file.
//
// The table below is transcribed from shortcutDefinitions in
// src/lib/constants.ts. It is a transcription rather than an import because
// this site and the Electron app are separate repositories with separate build
// pipelines; the constants file is not on this site's module graph. A test in
// the app repository asserts that this list still matches the source, so a
// changed accelerator fails CI rather than silently going stale here.
//
// Electron accelerator syntax is kept verbatim rather than prettified into
// symbols, because "CommandOrControl+Shift+S" is what the code says and
// converting it to glyphs is how two copies drift apart.
const SHORTCUTS = [
  // Browser
  ["Browser", "New Tab", "CommandOrControl+T"],
  ["Browser", "New Incognito Tab", "CommandOrControl+Shift+N"],
  ["Browser", "Close Tab", "CommandOrControl+W"],
  ["Browser", "Next Tab", "CommandOrControl+]"],
  ["Browser", "Previous Tab", "CommandOrControl+["],
  ["Browser", "Toggle Sidebar", "CommandOrControl+Shift+S"],
  ["Browser", "Open Settings", "CommandOrControl+,"],
  ["Browser", "Open History", "CommandOrControl+Y"],
  ["Browser", "Cycle Theme", "CommandOrControl+Shift+T"],
  ["Browser", "Zoom In", "CommandOrControl+="],
  ["Browser", "Zoom In (+)", "CommandOrControl+Plus"],
  ["Browser", "Zoom Out", "CommandOrControl+-"],
  ["Browser", "Reset Zoom", "CommandOrControl+0"],

  // AI
  ["AI", "Command Center", "CommandOrControl+K"],
  ["AI", "Focus AI Prompt", "CommandOrControl+L"],
  ["AI", "Toggle Autonomous Mode", "CommandOrControl+Shift+A"],
  ["AI", "Abort Current Action", "Escape"],
  ["AI", "Focus AI Sidebar", "CommandOrControl+/"],
  ["AI", "Open AI Chat", "CommandOrControl+Alt+C"],
  ["AI", "Focus AI Chat Input", "CommandOrControl+Shift+C"],
  ["AI", "Toggle AI Assist", "CommandOrControl+Alt+A"],
  ["AI", "Toggle AI Overview", "CommandOrControl+Alt+O"],
  ["AI", "Toggle Spotlight Search", "CommandOrControl+Shift+Space"],
  ["AI", "Global Spotlight Search", "Alt+Space"],
  ["AI", "Pop Search", "CommandOrControl+Shift+S"],
  ["AI", "Global Search", "CommandOrControl+Alt+G"],

  // Panels
  ["Panels", "Open Workspace Dashboard", "CommandOrControl+Alt+W"],
  ["Panels", "Open Media Studio", "CommandOrControl+Alt+M"],
  ["Panels", "Open PDF Workspace", "CommandOrControl+Alt+P"],
  ["Panels", "Open Presenton", "CommandOrControl+Alt+L"],
  ["Panels", "Open Password Manager", "CommandOrControl+Alt+K"],
  ["Panels", "Open Clipboard Manager", "CommandOrControl+Alt+V"],
  ["Panels", "Open Downloads", "CommandOrControl+Shift+J"],
  ["Panels", "Open Documentation", "CommandOrControl+Shift+/"],
  ["Panels", "Open Unified Cart", "CommandOrControl+Alt+U"],
  ["Panels", "Open Camera Studio", "CommandOrControl+Alt+I"],
  ["Panels", "Open Extensions", "CommandOrControl+Alt+E"],
  ["Panels", "Open Vault & Autofill", "CommandOrControl+Alt+B"],
] as const;

const CATEGORY_META: Record<string, string> = {
  Browser: "Tabs, history, zoom and theme.",
  AI: "The AI sidebar, command center and spotlight.",
  Panels: "Opening the app's panels.",
};

// Conflicts are computed rather than hand-listed, so the notice cannot fall out
// of date with the table above it.
const conflicts = (() => {
  const byAccelerator = new Map<string, string[]>();
  for (const [, label, accelerator] of SHORTCUTS) {
    byAccelerator.set(accelerator, [...(byAccelerator.get(accelerator) || []), label]);
  }
  return [...byAccelerator.entries()]
    .filter(([, labels]) => labels.length > 1)
    .map(([accelerator, labels]) => ({ accelerator, labels }));
})();

const REMOVED_CLAIMS = [
  "Ctrl/Cmd+R reload — no reload accelerator is registered. Reload is a menu action.",
  "Alt+Left and Alt+Right back/forward — no such handler exists.",
  "Ctrl+Tab next tab — next and previous tab are Cmd+] and Cmd+[.",
  "Cmd+L focus address bar — Cmd+L is bound to Focus AI Prompt.",
  'Rows whose "keys" were not combinations: "AI Command", "Brightness", "Schedule", "Daily Weekly", "6-digit". Volume and brightness are set through the assistant or a panel, not by a key.',
];

export default function KeyboardShortcutsPage() {
  const categories = Object.keys(CATEGORY_META);

  return (
    <div className="space-y-24">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Keyboard size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Reference
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Keyboard <span className="text-white/20">Shortcuts</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          {SHORTCUTS.length} registered accelerators, transcribed from{" "}
          <code className="rounded bg-white/5 px-2 py-1 font-mono text-base">
            shortcutDefinitions
          </code>{" "}
          in{" "}
          <code className="rounded bg-white/5 px-2 py-1 font-mono text-base">
            src/lib/constants.ts
          </code>
          . Electron accelerator syntax is shown as written:{" "}
          <code className="rounded bg-white/5 px-2 py-1 font-mono text-base">
            CommandOrControl
          </code>{" "}
          means Cmd on macOS and Ctrl elsewhere, and{" "}
          <code className="rounded bg-white/5 px-2 py-1 font-mono text-base">+Plus</code> is the
          numpad plus, distinct from the literal{" "}
          <code className="rounded bg-white/5 px-2 py-1 font-mono text-base">=</code> bound to zoom.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/docs/getting-started"
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Docs
          </Link>
        </div>
      </motion.section>

      {conflicts.length > 0 && (
        <section className="rounded-[2rem] border border-amber-500/25 bg-amber-500/[0.04] p-8">
          <h2 className="text-xl font-black uppercase tracking-wider text-amber-400/80">
            Accelerators bound twice
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            The source table assigns the same accelerator to more than one action, so whichever
            registers last takes the key. That is a defect in{" "}
            <code className="font-mono text-white/70">src/lib/constants.ts</code> rather than a
            documentation problem, so it is reported here instead of resolved by guessing.
          </p>
          <ul className="mt-4 space-y-2">
            {conflicts.map((c) => (
              <li key={c.accelerator} className="text-sm text-white/60">
                <code className="font-mono text-amber-300/80">{c.accelerator}</code> —{" "}
                {c.labels.join(", ")}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-8 md:grid-cols-2">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-black uppercase tracking-wider">{category}</h2>
              <p className="mt-1 text-sm text-white/35">{CATEGORY_META[category]}</p>
            </div>

            <div className="space-y-3">
              {SHORTCUTS.filter((s) => s[0] === category).map(([, label, accelerator]) => (
                <div
                  key={`${accelerator}-${label}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-sm text-white/60">{label}</span>
                  <kbd className="shrink-0 rounded bg-white/10 px-2 py-1 font-mono text-xs text-white/80">
                    {accelerator}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
        <h2 className="text-xl font-black uppercase tracking-wider">Approval keys</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          Approvals are keyboard-reachable, which is worth stating precisely because the previous
          version of this page listed <code className="font-mono text-white/70">Shift+Tab</code>{" "}
          twice as a generic &ldquo;approve medium-risk action&rdquo; shortcut. It is not that. While
          the click-permission modal is open,{" "}
          <code className="font-mono text-white/70">Shift+Tab</code> invokes the same handler as that
          modal&apos;s <em>Allow Once</em> button, and where a batch is selected it approves the
          selection. It is scoped to that modal and its own permission checks. It is not a
          general-purpose approve key and it does not apply to shell commands, which are approved
          through the approval ticket dialog. High-risk actions are approved from that dialog or the
          mobile app, not by a key combination.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
        <h2 className="text-xl font-black uppercase tracking-wider">
          Claims removed from this page
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-white/50">
          {REMOVED_CLAIMS.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="text-white/20">—</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
