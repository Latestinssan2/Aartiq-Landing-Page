"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Link as LinkIcon,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Copy,
  Terminal,
  Code,
  Lock,
  XCircle,
  MinusCircle,
} from "lucide-react";

// This page previously described a deep-link system that does not exist.
//
// It presented `aartiq://` and a web origin as two ways to reach in-app routes
// (/chat, /automation, /settings, /docs/...), which is not how the handler
// works: there is no route table, no router push, and no path dispatch. The
// handler recognises a fixed list of command names and forwards each to one
// IPC channel. Anything unrecognised is dropped.
//
// It also claimed parameters that are never read (?tab=, ?theme=, ?lang=), a
// Flutter handler in JavaScript and Objective-C syntax, Firebase Dynamic Links
// (a retired Google service), Universal/App Links association files for a
// domain the app does not verify, an iOS Info.plist snippet for a
// non-existent iOS app, and Windows Jump List support.
//
// Every row below is transcribed from the handler. The status column is the
// point of the page: a command that reaches a live listener and a command whose
// only effect is a send() into nothing are not the same thing, and the previous
// page could not tell them apart.

type Status = "works" | "prepares" | "dead";

const STATUS_META: Record<Status, { label: string; icon: typeof CheckCircle2; className: string }> = {
  works: {
    label: "Reaches the app",
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  },
  prepares: {
    label: "Types a request into chat, does not run it",
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  },
  dead: {
    label: "Nothing happens",
    icon: XCircle,
    className: "border-rose-500/30 bg-rose-500/5 text-rose-300",
  },
};

interface Command {
  command: string;
  params: string;
  effect: string;
  status: Status;
}

const COMMANDS: Command[] = [
  {
    command: "chat",
    params: "message | prompt | query",
    effect:
      "Opens the AI sidebar and sends the text to ai-chat-input-text, which fills the chat composer. The text is not submitted.",
    status: "works",
  },
  {
    command: "ask-ai",
    params: "message | prompt | query",
    effect: "Identical to chat.",
    status: "works",
  },
  {
    command: "voice-chat",
    params: "(none)",
    effect: "Opens the AI sidebar. Does not start voice input.",
    status: "works",
  },
  {
    command: "navigate",
    params: "url",
    effect:
      "Sends navigate-to-url. A bare host is prefixed with https://. This is one of the few sends that a renderer channel actually listens for.",
    status: "works",
  },
  {
    command: "search",
    params: "query | prompt",
    effect:
      "Opens a new tab on https://www.google.com/search?q=... The engine is hardcoded; there is no setting for it.",
    status: "works",
  },
  {
    command: "volume",
    params: "level (0-100)",
    effect:
      "Runs osascript to set the output volume. macOS only, and it bypasses the approval gate — it is a raw shell call in the main process.",
    status: "works",
  },
  {
    command: "open-app",
    params: "appName",
    effect: "Runs open -a with the name. macOS only, and also a raw shell call.",
    status: "works",
  },
  {
    command: "create-pdf",
    params: "title, content",
    effect:
      "Opens chat and types: Create a PDF titled \"<title>\" with this content: ... Returns success. No PDF is created and nothing is generated.",
    status: "prepares",
  },
  {
    command: "create-doc",
    params: "title, content",
    effect:
      "The string create-doc does not appear in the action handler at all. It is in the command map, pointing at the ai:create-pdf channel, but there is no branch for it, so the handler answers \"Unknown or unsupported action: create-doc\" and the channel send goes nowhere. It does not share a branch with create-pdf.",
    status: "dead",
  },
  {
    command: "run-command",
    params: "command",
    effect:
      "Opens chat and types: Run this shell command: <command>. Returns success with the message \"Prepared shell command request\". No process is started. Note that the command text arrives as chat input, so it is not an execution path and is not subject to shell approval gating.",
    status: "prepares",
  },
  {
    command: "schedule",
    params: "task, cron | schedule",
    effect:
      "Opens chat and types: Schedule this task: <task>. Returns success. No automation is created and the cron string is never parsed.",
    status: "prepares",
  },
  {
    command: "screenshot",
    params: "(none)",
    effect:
      "Routed to executeShortcutAction, which has no branch for it, so it returns \"Unknown or unsupported action\". The channel it is then sent to has no listener.",
    status: "dead",
  },
  {
    command: "set-model",
    params: "(none)",
    effect: "Same as screenshot: no branch, no listener.",
    status: "dead",
  },
  {
    command: "browse",
    params: "(none)",
    effect:
      "Not in the action list at all, so the only thing that happens is a send on a channel with no listener.",
    status: "dead",
  },
  {
    command: "ocr",
    params: "(none)",
    effect: "Same as browse.",
    status: "dead",
  },
  {
    command: "pdf",
    params: "(none)",
    effect: "Same as browse.",
    status: "dead",
  },
  {
    command: "automation",
    params: "(none)",
    effect: "Same as browse.",
    status: "dead",
  },
  {
    command: "settings",
    params: "(none)",
    effect: "Same as browse.",
    status: "dead",
  },
  {
    command: "index",
    params: "(none)",
    effect: "Same as browse. It is also the fallback for an unrecognised command name.",
    status: "dead",
  },
];

// Only these parameter names are read anywhere in the handler. Everything else
// in a query string is parsed into `params` and then ignored, which is how the
// previous page came to claim ?theme= and ?lang= support.
const PARAMS_READ = [
  ["message / prompt / query", "chat, ask-ai, search"],
  ["url", "navigate"],
  ["content, title", "create-pdf"],
  ["command", "run-command"],
  ["task, cron / schedule", "schedule"],
  ["level", "volume"],
  ["appName", "open-app"],
  ["speak", "sent on a channel with no listener — see below"],
];

const SCHEMES = [
  {
    scheme: "aartiq://",
    purpose: "Command links, also used by Raycast and macOS Shortcuts",
    handled: "Yes, on macOS",
    note: "main.js:open-url accepts aartiq:// and comet://. comet:// is handled at runtime but is not in package.json, so nothing registers it.",
  },
  {
    scheme: "aartiq-browser://",
    purpose: "OAuth callback",
    handled: "Yes, on macOS",
    note: "The whole URL is forwarded to the renderer on the auth-callback channel, which preload.js subscribes to.",
  },
  {
    scheme: "http:// and https://",
    purpose: "Default-browser registration",
    handled: "Yes, on macOS",
    note: "Forwarded to add-new-tab, so a link opened through the protocol client loads as a browser tab.",
  },
];

const REMOVED = [
  "In-app route table. There is no /chat, /automation, /settings, /docs or /pdf-viewer routing target. The handler matches command names, not paths, and ignores anything it does not recognise.",
  "?tab=, ?theme=, ?lang= parameters. They are parsed and then never read.",
  "The Flutter example, which was JavaScript and Objective-C syntax presented as Dart, called a DeepLinkHandler class that does not exist, and used navigator.pushNamed on a context that was never in scope.",
  "Firebase Dynamic Links, a Google service retired in 2025 and not present in the codebase.",
  "apple-app-site-association and assetlinks.json for a domain. Nothing in the app fetches or verifies either file.",
  "An iOS Info.plist snippet. There is no iOS app; the mobile client is Flutter on Android and iOS, and its scheme handling is not this snippet.",
  "Windows Jump List and App Links. Neither is implemented.",
  "The web origin as a way to open in-app routes. A web link either loads a real page in a tab or, if the origin does not serve one, nothing.",
];

const CODE = {
  handler: `// main.js — the whole deep-link surface
app.on('open-url', async (event, url) => {
  event.preventDefault();
  let target = getTopWindow();
  if (!target) {
    await createWindow();
    target = mainWindow;
  }
  if (!target || target.isDestroyed()) return;

  const parsed = new URL(url);
  const pathname = parsed.pathname.replace(/^\\/+/, '');
  const params = Object.fromEntries(parsed.searchParams);

  if (url.startsWith('aartiq-browser://')) {
    target.webContents.send('auth-callback', url);
  } else if (url.startsWith('http://') || url.startsWith('https://')) {
    target.webContents.send('add-new-tab', url);
  } else if (url.startsWith('aartiq://') || url.startsWith('comet://')) {
    const command = parsed.hostname || pathname || params.command || 'index';

    const commandMap = {
      'chat': 'open-ai-chat',
      'search': 'ai:search',
      'navigate': 'navigate-to-url',
      'create-pdf': 'ai:create-pdf',
      'create-doc': 'ai:create-pdf',
      'run-command': 'shell:execute',
      'open-app': 'system:open-app',
      'screenshot': 'system:screenshot',
      'volume': 'system:set-volume',
      'schedule': 'ai:schedule',
      'ask-ai': 'ai:ask-speaking',
      'voice-chat': 'ai:voice-chat',
      'set-model': 'ai:set-model',
      'browse': 'open-quick-browse',
      'ocr': 'trigger-screen-ocr',
      'pdf': 'open-pdf-creator',
      'automation': 'open-automation-panel',
      'settings': 'open-settings',
      'index': 'open-main',
    };

    const siriActions = ['chat', 'search', 'navigate', 'create-pdf', 'create-doc',
      'run-command', 'open-app', 'screenshot', 'volume', 'schedule', 'ask-ai',
      'voice-chat', 'set-model'];
    if (siriActions.includes(command)) {
      executeShortcutAction(command, params);
      if (params.speak === 'true') {
        target.webContents.once('did-finish-load', () => {
          target.webContents.send('ai:request-speak-response', params);
        });
      }
    }

    // Sent unconditionally. Of these nineteen channel names only
    // navigate-to-url has a renderer listener; the rest are discarded.
    target.webContents.send(commandMap[command] || command, params);
  }

  if (target.isMinimized()) target.restore();
  target.focus();
});`,

  prepares: `// SiriShortcutsIntegration.js — what the "prepares" rows actually do
if (normalizedAction === 'run-command') {
  const command = \`\${params.command || ''}\`.trim();
  if (mainWindow && command) {
    mainWindow.webContents.send('execute-shortcut', 'open-ai-chat');
    mainWindow.webContents.send(
      'ai-chat-input-text',
      \`Run this shell command: \${command}\`
    );
    return { success: true, message: 'Prepared shell command request' };
  }
}

if (normalizedAction === 'schedule') {
  const task = \`\${params.task || ''}\`.trim();
  const schedule = \`\${params.cron || params.schedule || ''}\`.trim();
  if (mainWindow && task) {
    const scheduleText = schedule ? \` Run it at: \${schedule}.\` : '';
    mainWindow.webContents.send('execute-shortcut', 'open-ai-chat');
    mainWindow.webContents.send(
      'ai-chat-input-text',
      \`Schedule this task: \${task}.\${scheduleText}\`
    );
    return { success: true, message: 'Prepared scheduling request' };
  }
}`,
};

const CODE_TABS = [
  { id: "handler" as const, label: "The handler" },
  { id: "prepares" as const, label: "What \"prepares\" means" },
];

export default function DeepLinksPage() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const [codeTab, setCodeTab] = useState<"handler" | "prepares">("handler");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const shown = filter === "all" ? COMMANDS : COMMANDS.filter((c) => c.status === filter);
  const counts = {
    all: COMMANDS.length,
    works: COMMANDS.filter((c) => c.status === "works").length,
    prepares: COMMANDS.filter((c) => c.status === "prepares").length,
    dead: COMMANDS.filter((c) => c.status === "dead").length,
  };

  return (
    <div className="space-y-24">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <LinkIcon size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            URL Protocol Reference
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          URL Protocol <span className="text-white/20">Reference</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Three schemes are registered as protocol clients. All of them reach the app through a
          single <code className="font-mono text-base text-white/70">open-url</code> handler in{" "}
          <code className="font-mono text-base text-white/70">main.js</code>, which recognises{" "}
          {COMMANDS.length} command names and forwards each to one IPC channel. Seven of those
          commands reach the app. Three type a request into the chat without carrying it out. Nine
          do nothing at all.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[2rem] border border-rose-500/25 bg-rose-500/[0.04] p-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle size={22} className="text-rose-400" />
          <h2 className="text-xl font-black uppercase tracking-wider text-rose-300">
            Delivery is macOS only
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-white/60">
          The schemes are registered on every platform, but the handler is an{" "}
          <code className="font-mono text-white/80">app.on(&apos;open-url&apos;)</code> event, which
          Electron only emits on macOS. Windows and Linux deliver a protocol activation as an argv
          element on a second process launch, and this app registers neither{" "}
          <code className="font-mono text-white/80">requestSingleInstanceLock</code> nor a{" "}
          <code className="font-mono text-white/80">second-instance</code> handler, and never reads
          <code className="font-mono text-white/80">process.argv</code> for a URL. On those platforms
          the link opens the app and is discarded.
        </p>
      </motion.section>

      <section className="space-y-8">
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            URL Schemes
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Registered <span className="text-white/20">Schemes</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {SCHEMES.map((s) => (
            <div
              key={s.scheme}
              className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-sky-400">
                  <Globe size={22} />
                </div>
                <code className="text-sm text-white/80">{s.scheme}</code>
              </div>
              <p className="mb-3 text-sm font-bold text-white/70">{s.purpose}</p>
              <p className="text-sm text-white/45">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Command Reference
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            <span className="text-white/20">aartiq://</span> Commands
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {(
            [
              ["all", "All"],
              ["works", "Reaches the app"],
              ["prepares", "Prepares only"],
              ["dead", "Nothing happens"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                filter === id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {label}
              <span className="opacity-50">{counts[id]}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {shown.map((c) => {
            const meta = STATUS_META[c.status];
            const Icon = meta.icon;
            return (
              <div
                key={c.command}
                className={`rounded-2xl border p-6 ${meta.className.replace(/text-\S+/, "bg-transparent")}`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <code className="font-mono text-base text-white">aartiq://{c.command}</code>
                  {c.params !== "(none)" ? (
                    <code className="font-mono text-xs text-white/40">?{c.params}</code>
                  ) : null}
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${meta.className}`}
                  >
                    <Icon size={12} />
                    {meta.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{c.effect}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Query Parameters
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Parameters <span className="text-white/20">Actually Read</span>
          </h2>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-white/30">
                <th className="pb-3">Parameter</th>
                <th className="pb-3">Read by</th>
              </tr>
            </thead>
            <tbody>
              {PARAMS_READ.map(([param, by]) => (
                <tr key={param} className="border-b border-white/5 last:border-0">
                  <td className="py-3 font-mono text-white/70">{param}</td>
                  <td className="py-3 text-white/50">{by}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-6 text-sm leading-relaxed text-white/45">
            Every other key in the query string is parsed into the params object and then ignored.
            There is no theme, language, settings-tab or file parameter, and adding one will not do
            anything.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Implementation
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            The <span className="text-white/20">Code</span>
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {CODE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCodeTab(tab.id)}
              className={`rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                codeTab === tab.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider">
              <Code size={18} className="text-white/40" />
              {codeTab === "handler" ? "main.js — open-url" : "SiriShortcutsIntegration.js"}
            </h3>
            <button
              onClick={() => copy(CODE[codeTab], `code-${codeTab}`)}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white/60 transition-colors hover:bg-white/10"
            >
              {copied === `code-${codeTab}` ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Copy size={16} />
              )}
              {copied === `code-${codeTab}` ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/80">
            {CODE[codeTab]}
          </pre>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/[0.04] p-8">
          <CheckCircle2 size={28} className="mb-4 text-emerald-400" />
          <h3 className="mb-3 font-black uppercase tracking-wider text-emerald-300">
            Reaches the app
          </h3>
          <p className="text-sm leading-relaxed text-white/55">
            chat, ask-ai, voice-chat, navigate, search, volume, open-app. chat, ask-ai,
            create-pdf, run-command and schedule go through the ai-chat-input-text
            channel, which the preload does subscribe to.
          </p>
        </div>

        <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/[0.04] p-8">
          <AlertTriangle size={28} className="mb-4 text-amber-400" />
          <h3 className="mb-3 font-black uppercase tracking-wider text-amber-300">
            Returns success without doing the work
          </h3>
          <p className="text-sm leading-relaxed text-white/55">
            create-pdf, run-command and schedule. Each returns{" "}
            <code className="font-mono text-white/70">success: true</code> while only having typed
            a sentence into the chat composer. A caller that checks the return value will believe
            a PDF was created or a task was scheduled.
          </p>
        </div>

        <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] p-8">
          <XCircle size={28} className="mb-4 text-rose-400" />
          <h3 className="mb-3 font-black uppercase tracking-wider text-rose-300">
            Nothing happens
          </h3>
          <p className="text-sm leading-relaxed text-white/55">
            browse, ocr, pdf, automation, settings, index, screenshot, set-model and
            create-doc have no branch in the action handler — create-doc despite being
            pointed at the create-pdf channel, and screenshot and set-model despite both
            being in the action list. All nine end in a send on a channel with no listener.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Edge Cases
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Worth <span className="text-white/20">Knowing</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <Terminal size={24} className="mb-4 text-white/50" />
            <h3 className="mb-3 font-black uppercase tracking-wider">Unrecognised commands</h3>
            <p className="text-sm leading-relaxed text-white/55">
              The command is read from{" "}
              <code className="font-mono text-white/70">parsed.hostname || pathname</code>, with{" "}
              <code className="font-mono text-white/70">index</code> as the fallback. An unknown
              command falls back to index and then sends the raw command name as the channel, so
              the failure is silent.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <Smartphone size={24} className="mb-4 text-white/50" />
            <h3 className="mb-3 font-black uppercase tracking-wider">
              aartiq://approve is handled elsewhere
            </h3>
            <p className="text-sm leading-relaxed text-white/55">
              High-risk MCP tool calls render a QR code containing{" "}
              <code className="font-mono text-white/70">aartiq://approve?id=…&amp;pin=…</code>. That
              URL is meant to be opened on the phone, and the Flutter app is what consumes it. On
              the desktop the same URL matches the command branch above and is discarded. The token
              and PIN are verified over HTTP by the MCP server, not by the deep-link handler.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <Lock size={24} className="mb-4 text-white/50" />
            <h3 className="mb-3 font-black uppercase tracking-wider">
              volume and open-app skip the approval gate
            </h3>
            <p className="text-sm leading-relaxed text-white/55">
              Both call <code className="font-mono text-white/70">execPromise</code> directly from
              the main process with an interpolated argument. They are not routed through the
              capability controller that gates{" "}
              <code className="font-mono text-white/70">execute-shell-command</code>. They are also
              the only two commands that cannot work off macOS.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <MinusCircle size={24} className="mb-4 text-white/50" />
            <h3 className="mb-3 font-black uppercase tracking-wider">?speak=true does nothing</h3>
            <p className="text-sm leading-relaxed text-white/55">
              It queues a send on{" "}
              <code className="font-mono text-white/70">ai:request-speak-response</code> behind{" "}
              <code className="font-mono text-white/70">did-finish-load</code>. No listener for that
              channel exists anywhere in the codebase, so the reply is never spoken.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
        <h2 className="text-xl font-black uppercase tracking-wider">Claims removed from this page</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/50">
          {REMOVED.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="text-white/20">—</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/docs/api-reference"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          API Reference <ArrowRight size={16} />
        </Link>
        <Link
          href="/docs/getting-started"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <Monitor size={16} /> Back to Docs
        </Link>
      </div>
    </div>
  );
}