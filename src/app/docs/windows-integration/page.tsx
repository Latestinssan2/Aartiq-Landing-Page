"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Monitor,
  Mic,
  Volume2,
  Terminal,
  AppWindow,
  Camera,
  Search,
  FileText,
  MessageSquare,
  Settings,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Bot,
  Command,
  Cpu,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Link2,
} from "lucide-react";

const CodeBlock = ({ code, language = "bash" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-slate-900/80 border border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button onClick={copyToClipboard} className="p-1.5 rounded-lg hover:bg-slate-700/50">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-slate-200 leading-relaxed">{code}</code>
      </pre>
    </div>
  );
};

type Reach = "works" | "unwired" | "dead-channel";

const REACH_META: Record<Reach, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  works: {
    label: "Does the work",
    icon: CheckCircle2,
    tone: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  },
  unwired: {
    label: "Code exists, nothing reaches it",
    icon: AlertTriangle,
    tone: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  },
  "dead-channel": {
    label: "Sends on a channel with no listener",
    icon: XCircle,
    tone: "border-rose-500/30 bg-rose-500/5 text-rose-300",
  },
};

// Every action in the actionHandlers table in src/lib/windows-integration.js.
// The previous version of this page cited src/lib/platform/WindowsIntegration.ts,
// which is not a file in this repository, and described each of these as a
// working Windows shortcut.
//
// The three reach values are the whole story of this page:
//
//   dead-channel : the handler sends on an IPC channel that no renderer
//                  subscribes to, so the send returns and nothing happens.
//   works        : the handler reaches a real system API instead.
//   unwired      : the code is correct and the channel matches, but nothing
//                  outside the app can invoke it. That is the case for every
//                  action on this page, because the OS never delivers the URL.
const windowsActions = [
  {
    name: "Open App",
    action: "open-app",
    reach: "works" as Reach,
    params: "appName, appPath",
    description:
      "Calls shell.openPath. With appPath it opens exactly that path. With appName it guesses C:\\Program Files\\<name>\\<name>.exe and then C:\\Program Files (x86)\\<name>\\<name>.exe, and returns success even if neither exists. There is no args parameter.",
  },
  {
    name: "Set Volume",
    action: "volume",
    reach: "works" as Reach,
    params: "level (0-100)",
    description:
      "Runs a PowerShell script that drives the CoreAudio IAudioEndpointVolume COM interface. The level is clamped to 0-100 and defaults to 50 when absent or unparseable.",
  },
  {
    name: "Voice",
    action: "voice",
    reach: "works" as Reach,
    params: "command (listen | speak), text, rate, volume, voice",
    description:
      "command=listen runs a single System.Speech recognition with a two-second silence timeout and returns whatever it heard. It is one-shot, not continuous. command=speak speaks the text parameter.",
  },
  {
    name: "Copilot",
    action: "copilot",
    reach: "works" as Reach,
    params: "(none read)",
    description:
      "Opens the Copilot application by shell.openPath, falling back to copilot.microsoft.com in the browser. That is the whole implementation. It does not send a prompt anywhere and does not read the prompt parameter the old page documented.",
  },
  {
    name: "AI Chat",
    action: "chat",
    reach: "dead-channel" as Reach,
    params: "message",
    description: "Sends the message on ai:chat-message. Nothing subscribes to that channel.",
  },
  {
    name: "Navigate",
    action: "navigate",
    reach: "dead-channel" as Reach,
    params: "url",
    description: "Sends browser:navigate. Nothing subscribes to that channel.",
  },
  {
    name: "Smart Search",
    action: "search",
    reach: "dead-channel" as Reach,
    params: "query",
    description: "Sends ai:search. Nothing subscribes to that channel.",
  },
  {
    name: "Create PDF",
    action: "create-pdf",
    reach: "dead-channel" as Reach,
    params: "content, title, template",
    description:
      "Sends ai:create-pdf. Nothing subscribes to that channel, and template is forwarded without ever being interpreted.",
  },
  {
    name: "Run Command",
    action: "run-command",
    reach: "dead-channel" as Reach,
    params: "command, confirm",
    description:
      "Refuses unless confirm is exactly the string \"true\", then sends the command on shell:execute. Nothing subscribes to that channel, so nothing executes. Note that confirm is a required gate here, not a convenience that skips a prompt.",
  },
  {
    name: "Screenshot",
    action: "screenshot",
    reach: "dead-channel" as Reach,
    params: "(none read)",
    description:
      "Sends system:screenshot. Nothing subscribes to that channel. The mode and save parameters the old page documented are not read.",
  },
  {
    name: "Schedule Task",
    action: "schedule",
    reach: "dead-channel" as Reach,
    params: "task, cron, model",
    description:
      "Sends ai:schedule. Nothing subscribes to that channel. There is no action parameter; the old page listed action: pdf, search, chat, scrape, which is not read anywhere.",
  },
  {
    name: "Ask & Speak",
    action: "ask-ai",
    reach: "dead-channel" as Reach,
    params: "prompt, model, speak",
    description: "Sends ai:ask-speaking. Nothing subscribes to that channel.",
  },
];

const BRIDGE_CHANNELS = [
  ["windows:execute-action", "action, params", "Runs any action above"],
  ["windows:copilot:open", "(none)", "Opens Copilot"],
  ["windows:voice:listen", "params", "One-shot dictation"],
  ["windows:voice:speak", "text, params", "Speech synthesis"],
  ["windows:voice:get-voices", "(none)", "Installed SAPI voices"],
  ["windows:generate-url", "action, params", "Builds an aartiq:// URL"],
  ["windows:create-shortcut", "name, action, params", "Writes a .url file into userData"],
  ["windows:get-shortcuts-list", "(none)", "A hardcoded list of twelve entries"],
  ["windows:register-protocol", "(none)", "Registers aartiq:// for this build"],
];

// Names in the handler that do not appear in actionHandlers, so passing them
// returns "Unknown action". Three of the twelve entries the get-shortcuts-list
// handler returns are in this set.
const MISMATCHED_SHORTCUT_IDS = [
  { listed: "voice-chat", actual: "voice" },
  { listed: "ask-and-speak", actual: "ask-ai" },
  { listed: "set-volume", actual: "volume" },
];

const REMOVED = [
  "The source path src/lib/platform/WindowsIntegration.ts. There is no src/lib/platform directory. The module is src/lib/windows-integration.js.",
  "aartiq:// as a way to reach the app from another Windows program. The scheme is registered, but the only handler is app.on('open-url'), which Electron emits on macOS only, and there is no second-instance handler or argv parsing. A Windows protocol activation starts a second process and is discarded.",
  "The Power Automate section and the POST http://localhost:3000/api/commands endpoint. No such endpoint exists and port 3000 has never been a listener in this project.",
  "Microsoft Copilot as a second assistant. There is no dual chat, no compare mode, no aartiq://dual-chat and no aartiq://compare. The Copilot action launches the Copilot app.",
  "Ctrl+Shift+C, Ctrl+D, Ctrl+Shift+P, Ctrl+Alt+E, Ctrl+Alt+R, Ctrl+Alt+T and Ctrl+Alt+D. None of these accelerators is registered anywhere in the project.",
  "The Copilot:explain, Copilot:refactor, Copilot:tests and Copilot:doc actions. None exists.",
  "The \"Hey Aartiq\" wake word and all twelve voice phrases. There is no wake word, no hotword detection and no continuous listening in this codebase; the string does not appear.",
  "Install-Module SpeechRecognition and Start-SpeechRecognition. No PowerShell module is installed or required. The app shells out to System.Speech, which is part of .NET.",
  "The VoiceAttack snippet mixing PowerShell comments with a VBScript body, an undefined {Hwnd} placeholder, and a do-nothing Sleep loop.",
  "The configuration keys voice.enabled, voice.wakeWord, voice.voice, voice.rate, copilot.enabled, copilot.defaultMode, automate.httpPort and automate.authToken. No configuration file reads any of them.",
  "Windows 12, which does not exist as a release. The page had used it as a search example.",
];

const REGISTRY = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\aartiq]
@="URL:Aartiq Protocol"
"URL Protocol"=""

[HKEY_CLASSES_ROOT\\aartiq\\DefaultIcon]
@="C:\\Program Files\\Aartiq\\aartiq.exe,0"

[HKEY_CLASSES_ROOT\\aartiq\\shell\\open\\command]
@="\\"C:\\Program Files\\Aartiq\\aartiq.exe\\" \\"%1\\""`;

export default function WindowsIntegrationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "reach", label: "What Actually Works" },
    { id: "actions", label: "Actions" },
    { id: "bridge", label: "Bridge API" },
    { id: "voice", label: "Voice" },
    { id: "setup", label: "Protocol Registration" },
  ];

  const counts = {
    works: windowsActions.filter((a) => a.reach === "works").length,
    dead: windowsActions.filter((a) => a.reach === "dead-channel").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
      <div className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Windows Integration</h1>
                <p className="text-sm text-zinc-400">Aartiq for Windows</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/docs/apple-integration" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                macOS Integration
              </Link>
              <Link href="/docs/deep-links" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Deep Links
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`flex-shrink-0 ${sidebarOpen ? "w-64" : "w-16"}`}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Collapse</span>}
            </button>

            {sidebarOpen && (
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            )}
          </motion.aside>

          <main className="flex-1 min-w-0 space-y-16">
            {/* Overview */}
            <section id="overview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/20 border border-zinc-800/50 p-8 md:p-12"
              >
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
                      <Monitor className="w-8 h-8 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30">
                      Windows 10 / 11
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Windows Integration</h2>
                  <p className="text-xl text-zinc-300 max-w-3xl mb-6">
                    Implemented in{" "}
                    <code className="font-mono text-lg text-blue-300">src/lib/windows-integration.js</code>.
                    It defines twelve actions, a PowerShell and System.Speech layer for volume and
                    voice, and a nine-method bridge. This page previously described a Windows
                    shortcut system that does not exist. The honest version is shorter: the code is
                    largely there, the IPC bridge is wired up and reachable, but nothing on Windows
                    can invoke it from outside the app.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm">
                      <Link2 className="w-4 h-4 text-amber-400" />
                      Scheme registered, never delivered
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm">
                      <Mic className="w-4 h-4 text-amber-400" />
                      One-shot dictation
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      PowerShell via CoreAudio
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* The reach problem */}
            <section className="p-8 rounded-3xl border border-amber-500/25 bg-amber-500/[0.04]">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-amber-300">
                  Nothing on Windows can invoke any of these actions
                </h2>
              </div>
              <div className="space-y-4 text-zinc-300">
                <p>
                  At startup, on Windows only, the app calls{" "}
                  <code className="font-mono text-blue-300">registerWindowsProtocol()</code>, which
                  registers <code className="font-mono text-blue-300">aartiq://</code> as a protocol
                  handler. When Windows activates that protocol it launches a second copy of the
                  executable with the URL as an argument.
                </p>
                <p>
                  The module has a function that would handle exactly that —{" "}
                  <code className="font-mono text-blue-300">handleURLSchemeEvent</code> — and{" "}
                  <code className="font-mono text-blue-300">handleWindowsShortcutAction</code>,
                  which is what it calls. Both are imported by{" "}
                  <code className="font-mono text-blue-300">main.js</code> and neither is ever
                  called. There is no{" "}
                  <code className="font-mono text-blue-300">second-instance</code> handler, no{" "}
                  <code className="font-mono text-blue-300">requestSingleInstanceLock</code>, and
                  no code that reads{" "}
                  <code className="font-mono text-blue-300">process.argv</code> for a URL.
                </p>
                <p>
                  So the twelve actions are reachable from inside the app, through{" "}
                  <code className="font-mono text-blue-300">electronAPI.windows.*</code>, and from
                  nowhere else. A Windows protocol activation opens a second instance of the app and
                  the URL is discarded.
                </p>
                <p className="text-zinc-400">
                  The same is true of the Linux page, and for the same reason. On macOS the{" "}
                  <code className="font-mono text-blue-300">open-url</code> event does fire, which is
                  why the{" "}
                  <Link href="/docs/deep-links" className="text-blue-400 underline">
                    deep-link reference
                  </Link>{" "}
                  has working entries and this one does not.
                </p>
              </div>
            </section>

            {/* What actually works */}
            <section id="reach">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-2">What actually works</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  Of the twelve actions, {counts.works} reach a real system API and {counts.dead} end
                  in a <code className="font-mono text-blue-300">webContents.send</code> on a
                  channel that no renderer subscribes to. The channel name is the only thing that
                  would have connected them, and it is not connected.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-emerald-500/25">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {counts.works} reach a system API
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    open-app, volume, voice and copilot. These shell out or call Electron&apos;s{" "}
                    <code className="font-mono">shell</code> module directly rather than relying on a
                    renderer channel, so they work even though nothing outside the app can trigger
                    them.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-rose-500/25">
                  <XCircle className="w-8 h-8 text-rose-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {counts.dead} send into nothing
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    chat, navigate, search, create-pdf, run-command, screenshot, schedule and ask-ai
                    all report success. None of the eight channel names has a subscriber anywhere
                    in the renderer.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-amber-500/25">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">0 reachable from Windows</h3>
                  <p className="text-zinc-400 text-sm">
                    All twelve, including the four that work, because the OS never delivers the URL
                    that would call them. Fixing the channels without fixing delivery would not
                    change what a user can do.
                  </p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section id="actions">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Actions</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  Transcribed from the <code className="font-mono text-blue-300">actionHandlers</code>{" "}
                  table in{" "}
                  <code className="font-mono text-blue-300">src/lib/windows-integration.js</code>. The
                  reach column is derived from whether the handler sends on a channel a renderer
                  subscribes to, which is checked by a test rather than by reading this page.
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                {windowsActions.map((action, idx) => {
                  const meta = REACH_META[action.reach];
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={action.action}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-700/50"
                    >
                      <div className="flex items-center justify-between mb-3 gap-3">
                        <h3 className="text-lg font-semibold text-white">{action.name}</h3>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider shrink-0 ${meta.tone}`}
                        >
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </div>

                      <code className="block text-sm font-mono text-blue-300 bg-zinc-800/50 px-2 py-1.5 rounded-lg mb-3 overflow-x-auto">
                        aartiq://{action.action}
                      </code>

                      <p className="text-zinc-400 text-sm mb-3">{action.description}</p>

                      <div className="text-xs">
                        <span className="text-zinc-500 uppercase tracking-wider font-semibold">
                          Parameters read
                        </span>
                        <code className="block mt-1 font-mono text-zinc-300">{action.params}</code>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Command className="w-5 h-5 text-blue-400" />
                  Calling an action from inside the app
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  This is the only path that works today. It goes through the preload bridge, so it
                  is subject to the same channel problem for the eight actions that only send.
                </p>
                <CodeBlock
                  language="javascript"
                  code={`// preload.js exposes the whole Windows surface under electronAPI.windows
const result = await window.electronAPI.windows.executeAction('volume', { level: 40 });
// -> { success: true, volume: 40 }

// generateUrl builds a link without opening it
const url = await window.electronAPI.windows.generateUrl('chat', { message: 'hello' });
// -> "aartiq://chat?message=hello"

// Nothing on Windows can invoke these from outside the app.
await window.electronAPI.windows.executeAction('chat', { message: 'hello' });
// -> { success: true, message: 'Message sent to AI' }  …and nothing happens`}
                />
              </div>
            </section>

            {/* Bridge API */}
            <section id="bridge">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Bridge API</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  The Windows handlers and the preload methods that call them agree on all nine
                  channel names, which is unusual for this codebase — the Linux bridge does not have
                  that property. These are the real method names.
                </p>
              </motion.div>

              <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/30">
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Channel</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Arguments</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRIDGE_CHANNELS.map(([channel, args, effect]) => (
                      <tr key={channel} className="border-b border-slate-700/30 last:border-0">
                        <td className="px-4 py-3 font-mono text-blue-400">{channel}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{args}</td>
                        <td className="px-4 py-3 text-slate-300">{effect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-6 rounded-2xl bg-amber-500/[0.04] border border-amber-500/25">
                <h3 className="text-lg font-semibold text-amber-300 mb-3">
                  Three shortcut ids in the built-in list do not exist
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  <code className="font-mono text-blue-300">windows:get-shortcuts-list</code> returns
                  a hardcoded array of twelve entries. Three of its ids are not keys in the{" "}
                  <code className="font-mono text-blue-300">actionHandlers</code> table, so passing
                  them straight back returns{" "}
                  <code className="font-mono text-blue-300">Unknown action</code>.
                </p>
                <div className="space-y-2">
                  {MISMATCHED_SHORTCUT_IDS.map((m) => (
                    <div key={m.listed} className="flex items-center gap-3 text-sm font-mono">
                      <span className="text-rose-300 line-through">{m.listed}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                      <span className="text-emerald-300">{m.actual}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Voice */}
            <section id="voice">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Voice</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  There is no wake word. The previous version of this page listed twelve "Hey
                  Aartiq" phrases and told the reader to install a PowerShell speech module; the
                  string{" "}
                  <code className="font-mono text-blue-300">Hey Aartiq</code> does not appear anywhere
                  in this repository, and no module is installed. What exists is a single
                  recognition attempt through .NET&apos;s System.Speech.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <Search className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Recognition</h3>
                  </div>
                  <p className="text-zinc-400 mb-4">
                    One <code className="font-mono text-blue-300">Recognize()</code> call with a
                    two-second silence timeout, run through PowerShell. It returns one utterance or
                    an empty string. There is no grammar, no keyword list and no continuous mode.
                  </p>
                  <CodeBlock
                    language="powershell"
                    code={`Add-Type -AssemblyName System.Speech
$recognizer = New-Object System.Speech.Recognition.SpeechRecognitionEngine
$recognizer.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
$recognizer.InitialSilenceTimeout = [TimeSpan]::FromSeconds(2)
$recognizer.SetInputToDefaultAudioDevice()
$result = $recognizer.Recognize()
if ($result) { $result.Text } else { '' }`}
                  />
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Synthesis</h3>
                  </div>
                  <p className="text-zinc-400 mb-4">
                    SpeechSynthesizer over System.Speech. Rate, volume and voice are passed as
                    parameters to a param block rather than interpolated into the script source,
                    which is why arbitrary text can be spoken safely.
                  </p>
                  <CodeBlock
                    language="powershell"
                    code={`Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = $Rate
$synth.Volume = $Vol
if ($VoiceName) { $synth.SelectVoice($VoiceName) }
$synth.Speak($TextToSpeak)`}
                  />
                  <p className="text-zinc-500 text-xs mt-3">
                    If the voice query fails, the module returns a hardcoded list of Microsoft David,
                    Zira and Hortense. Those are not read from the system.
                  </p>
                </div>
              </div>
            </section>

            {/* Setup */}
            <section id="setup">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Protocol registration</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  The app registers <code className="font-mono text-blue-300">aartiq://</code> for
                  itself at startup, so a manual registry entry is only needed to work around that.
                  Read the caveat above before expecting a link to do anything.
                </p>
              </motion.div>

              <CodeBlock code={REGISTRY} />

              <p className="text-zinc-500 text-xs mt-3">
                Single backslashes in the key paths, and a single level of quoting around the
                executable. The previous version of this page doubled every backslash, which is only
                correct inside a language string literal and not in a .reg file.
              </p>
            </section>

            {/* Removed claims */}
            <section className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">Claims removed from this page</h2>
              <ul className="space-y-3 text-sm text-zinc-400">
                {REMOVED.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="text-zinc-600">—</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Quick reference */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/20 border border-zinc-800/50"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-blue-400" />
                  Quick Reference
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Does something</h3>
                    <div className="space-y-2 font-mono text-sm">
                      {windowsActions
                        .filter((a) => a.reach === "works")
                        .map((a) => (
                          <div key={a.action} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-emerald-400">aartiq://{a.action}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Sends into nothing</h3>
                    <div className="space-y-2 font-mono text-sm">
                      {windowsActions
                        .filter((a) => a.reach === "dead-channel")
                        .map((a) => (
                          <div key={a.action} className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span className="text-rose-300">aartiq://{a.action}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap gap-4">
                  <Link
                    href="/docs/linux-integration"
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <AppWindow size={16} /> Linux Integration
                  </Link>
                  <Link
                    href="/docs/deep-links"
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <FileText size={16} /> Deep Links
                  </Link>
                  <Link
                    href="/docs/getting-started"
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <MessageSquare size={16} /> Back to Docs
                  </Link>
                </div>
              </motion.div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}