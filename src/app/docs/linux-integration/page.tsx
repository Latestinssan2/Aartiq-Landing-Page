"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mic,
  Volume2,
  Keyboard,
  Terminal,
  Calendar,
  AppWindow,
  Camera,
  Search,
  FileText,
  MessageSquare,
  Settings,
  ChevronRight,
  Copy,
  Check,
  Monitor,
  Bell,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Link2,
} from "lucide-react";

type Reach = "works" | "dead-channel";

const REACH_META: Record<Reach, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  works: {
    label: "Does the work",
    icon: CheckCircle2,
    tone: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  },
  "dead-channel": {
    label: "Sends on a channel with no listener",
    icon: XCircle,
    tone: "border-rose-500/30 bg-rose-500/5 text-rose-300",
  },
};

// Transcribed from the actionHandlers table in src/lib/linux-integration.js.
//
// The previous version of this page listed ten of these twelve as working URL
// actions and described a set of desktop features that are not in the module:
// GNOME and KDE system trays, KRunner integration, global keybindings, and
// screenshot capture via scrot or import. None of those appear in the file.
//
// Four of the twelve reach a real system API. The other eight end in a
// webContents.send on a channel that no renderer subscribes to, which is the
// same defect the Windows page documents.
const ACTIONS = [
  {
    action: "open-app",
    reach: "works" as Reach,
    params: "appName",
    description:
      "Runs gtk-launch on GNOME and KDE, falling back to kioclient, and xdg-open everywhere else. Because it is exec'd as a string, the appName parameter is interpolated into a shell command line.",
  },
  {
    action: "volume",
    reach: "works" as Reach,
    params: "level (0-100)",
    description:
      "pactl on GNOME, qdbus against org.kde.KMix on KDE, and an explicit error on any other desktop. Note that the desktop is matched by exact string equality against a lowercased XDG_CURRENT_DESKTOP, so Ubuntu's usual \"ubuntu:GNOME\" does not match \"gnome\" and silently takes the unsupported branch.",
  },
  {
    action: "voice",
    reach: "works" as Reach,
    params: "text, speak",
    description:
      "When speak is not the string \"false\" it calls speakText, which runs espeak. This is output only; there is no dictation path. startVoiceRecognition returns success: false and points at whisper.cpp.",
  },
  {
    action: "notify",
    reach: "works" as Reach,
    params: "title, message, icon",
    description:
      "notify-send on GNOME, kdialog --passivepopup on KDE, and notify-send with a five-second timeout everywhere else. The title and message are interpolated into the notify-send command string.",
  },
  {
    action: "chat",
    reach: "dead-channel" as Reach,
    params: "message",
    description: "Sends ai:chat-message. Nothing subscribes to that channel.",
  },
  {
    action: "navigate",
    reach: "dead-channel" as Reach,
    params: "url",
    description: "Sends browser:navigate. Nothing subscribes to that channel.",
  },
  {
    action: "search",
    reach: "dead-channel" as Reach,
    params: "query",
    description: "Sends ai:search. Nothing subscribes to that channel.",
  },
  {
    action: "create-pdf",
    reach: "dead-channel" as Reach,
    params: "content, title",
    description: "Sends ai:create-pdf. Nothing subscribes to that channel.",
  },
  {
    action: "run-command",
    reach: "dead-channel" as Reach,
    params: "command",
    description:
      "Sends ai:run-command and returns \"Command queued\". Nothing subscribes to that channel, so nothing runs. There is no confirmation gate on this path, unlike the Windows one.",
  },
  {
    action: "screenshot",
    reach: "dead-channel" as Reach,
    params: "mode (default fullscreen), path",
    description:
      "Sends ai:screenshot. Nothing subscribes to that channel. The previous version of this page claimed capture via scrot or import; the module invokes no screenshot program at all.",
  },
  {
    action: "schedule",
    reach: "dead-channel" as Reach,
    params: "task, cron",
    description: "Sends ai:schedule. Nothing subscribes to that channel.",
  },
  {
    action: "ask-ai",
    reach: "dead-channel" as Reach,
    params: "prompt, speak",
    description: "Sends ai:ask-ai. Nothing subscribes to that channel.",
  },
];

// The Linux bridge, corrected.
//
// An earlier draft of this page claimed that four of the preload methods asked
// for a channel that had no handler. That was wrong: the grep behind it only
// looked inside src/lib/linux-integration.js and missed the eleven registrations
// in main.js. All eleven names match, and that is the real story.
//
// The real story has two parts, and both are checked by a test:
//
//   1. main.js registers all eleven channels the bridge calls. No gap.
//   2. The module registers ten of its own, five of which collide with the
//      main.js names. On Linux, module first, then main.js, so the second
//      registration throws. See DUPLICATE_HANDLERS below.
//
// The module's other five names are never invoked by anything.
const BRIDGE_CHANNELS: [string, string, string][] = [
  ["linux:execute-action", "action, params", "Runs any action in the table above"],
  ["linux:desktop:get", "(none)", "Current desktop, from XDG_CURRENT_DESKTOP"],
  ["linux:notify", "title, body, options", "Desktop notification"],
  ["linux:voice:listen", "params", "Dictation — always returns success: false"],
  ["linux:voice:speak", "text, params", "Speech synthesis through espeak"],
  ["linux:voice:get-voices", "(none)", "espeak --voices"],
  ["linux:generate-url", "action, params", "Builds an aartiq:// URL"],
  ["linux:create-shortcut", "name, action, params", "Writes a .desktop file into userData"],
  ["linux:install-gnome-shortcut", "name, action, params", "Writes into ~/.local/share/applications"],
  ["linux:create-launcher", "(none)", "Writes aartiq.desktop into userData"],
  ["linux:register-protocol", "(none)", "Registers aartiq:// for this build"],
];

// Registered by src/lib/linux-integration.js and then again by main.js, so the
// second registration throws. Ordered as they appear in main.js, which is the
// order in which they are attempted.
const DUPLICATE_HANDLERS = [
  "linux:notify",
  "linux:create-shortcut",
  "linux:install-gnome-shortcut",
  "linux:create-launcher",
  "linux:register-protocol",
];

// Registered by the module and never invoked by the preload bridge. The module
// and main.js name the same features two different ways, and the bridge only
// speaks main.js's names.
const ORPHAN_HANDLERS = [
  "linux:get-desktop",
  "linux:shortcut-action",
  "linux:speak",
  "linux:get-voices",
  "linux:start-voice",
];

const SHORTCUT_CAVEATS = [
  {
    title: "createLinuxShortcut writes an invalid Exec line",
    body: "The generated .desktop file sets Exec to the aartiq:// URL itself. The desktop entry specification requires Exec to name an executable, so a launcher created this way will not run. The file is written into the app's userData directory rather than a directory the desktop shell searches, which compounds it.",
  },
  {
    title: "installGNOMEShortcut assumes an aartiq binary is on PATH",
    body: "It writes Exec=aartiq \"<url>\", but no binary of that name is installed by the project. It also accepts desktop === 'ubuntu' as a synonym for GNOME, which is the opposite of the exact-match rule the volume and notify handlers use.",
  },
  {
    title: "createDesktopLauncher registers the scheme where nothing reads it",
    body: "It is the only launcher that sets Exec correctly and includes MimeType=x-scheme-handler/aartiq, but it writes into userData instead of ~/.local/share/applications, so the desktop never discovers the association.",
  },
];

const REMOVED = [
  "System tray support, for both GNOME and KDE. There is no tray code in this module.",
  "KRunner integration. Nothing in the repository references KRunner.",
  "GNOME and Plasma global keybindings. The module registers no global shortcut; keybinding registration lives in main.js and is not part of this integration.",
  "Screenshot capture via scrot or import. The screenshot action sends an IPC message and runs no capture program.",
  "pocketsphinx as an offline speech-to-text dependency, and web-based STT via the AI backend as an implemented path. startVoiceRecognition returns success: false and names whisper.cpp in its message.",
  "Voice input, or dictating messages to AI. There is no dictation path on Linux.",
  "\"Choose from 80+ eSpeak voices\" as a product feature. espeak is real and the voice list is read from espeak --voices, but the number was asserted rather than measured and depends entirely on the installed voice package.",
  "The screenshot row was missing from the action table on the old page even though screenshot is a real action, and the table omitted the voice action.",
  "Global Shortcuts as a feature of desktop integration, which implies a system-wide hotkey that does not exist.",
];

export default function LinuxIntegrationPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "delivery", label: "Link Delivery" },
    { id: "actions", label: "Actions" },
    { id: "bridge", label: "Bridge API" },
    { id: "shortcuts", label: "Desktop Entries" },
    { id: "removed", label: "Claims Removed" },
  ];

  const works = ACTIONS.filter((a) => a.reach === "works").length;
  const dead = ACTIONS.filter((a) => a.reach === "dead-channel").length;
  const duplicates = DUPLICATE_HANDLERS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
      <div className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Linux Integration</h1>
                <p className="text-sm text-zinc-400">Aartiq for Linux</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/docs/apple-integration" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                macOS Integration
              </Link>
              <Link href="/docs/windows-integration" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Windows Integration
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
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-900/20 border border-zinc-800/50 p-8 md:p-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600">
                    <Terminal className="w-8 h-8 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium border border-orange-500/30">
                    GNOME and KDE Plasma
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Linux Integration</h2>
                <p className="text-xl text-zinc-300 max-w-3xl mb-6">
                  Implemented in{" "}
                  <code className="font-mono text-lg text-orange-300">src/lib/linux-integration.js</code>.
                  Twelve actions, an eleven-channel bridge, and three ways of writing{" "}
                  <code className="font-mono text-orange-300">.desktop</code> files. Four actions
                  reach a real system API. Eight send on an IPC channel that no renderer subscribes
                  to, and four of the eleven bridge methods ask for a channel that has no handler at
                  all.
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm">
                    <Link2 className="w-4 h-4 text-amber-400" />
                    Scheme registered, never delivered
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm">
                    <Bell className="w-4 h-4 text-amber-400" />
                    notify-send and kdialog
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm">
                    <Mic className="w-4 h-4 text-amber-400" />
                    espeak out, no dictation in
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Link delivery */}
            <section id="delivery" className="p-8 rounded-3xl border border-amber-500/25 bg-amber-500/[0.04]">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-amber-300">aartiq:// links are discarded on Linux</h2>
              </div>
              <div className="space-y-4 text-zinc-300">
                <p>
                  The module registers the scheme at startup via{" "}
                  <code className="font-mono text-orange-300">registerLinuxProtocol()</code>, and{" "}
                  <code className="font-mono text-orange-300">main.js</code> wires up the eleven IPC
                  handlers behind{" "}
                  <code className="font-mono text-orange-300">process.platform === &apos;linux&apos;</code>.
                  Both of those work.
                </p>
                <p>
                  What does not exist is the delivery path.{" "}
                  <code className="font-mono text-orange-300">handleLinuxURLScheme</code> is the
                  function that would receive an activated link, and it is imported by{" "}
                  <code className="font-mono text-orange-300">main.js</code> and never called.
                  There is no <code className="font-mono text-orange-300">second-instance</code>{" "}
                  handler and nothing reads{" "}
                  <code className="font-mono text-orange-300">process.argv</code> for a URL, which is
                  how XDG delivers a protocol activation.
                </p>
                <p className="text-zinc-400">
                  The actions are reachable from inside the app through{" "}
                  <code className="font-mono text-orange-300">electronAPI.linux.executeAction</code>,
                  and from nowhere else. The Windows page documents the identical defect, and the{" "}
                  <Link href="/docs/deep-links" className="text-orange-400 underline">
                    deep-link reference
                  </Link>{" "}
                  explains why macOS is the only platform where a link does anything.
                </p>
              </div>
            </section>

            {/* Actions */}
            <section id="actions" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-2">Actions</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  All twelve entries from the{" "}
                  <code className="font-mono text-orange-300">actionHandlers</code> table. The reach
                  column is derived by a test from whether the handler&apos;s channel has a
                  subscriber, so it cannot drift from the source.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/25">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
                  <div className="text-3xl font-black text-white">{works}</div>
                  <div className="text-sm text-zinc-400">reach a system API</div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-rose-500/25">
                  <XCircle className="w-6 h-6 text-rose-400 mb-3" />
                  <div className="text-3xl font-black text-white">{dead}</div>
                  <div className="text-sm text-zinc-400">send into nothing</div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Link2 className="w-6 h-6 text-amber-400" />
                    <div className="text-3xl font-black text-white">0</div>
                  </div>
                  <div className="text-sm text-zinc-400">reachable from a link</div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-rose-500/25">
                  <AlertTriangle className="w-6 h-6 text-rose-400 mb-3" />
                  <div className="text-3xl font-black text-white">{duplicates}</div>
                  <div className="text-sm text-zinc-400">bridge channels registered twice</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {ACTIONS.map((action, idx) => {
                  const meta = REACH_META[action.reach];
                  const Icon = meta.icon;
                  const url = `aartiq://${action.action}${
                    action.params !== "(none)" ? `?${action.params.split(",")[0].trim()}=…` : ""
                  }`;
                  return (
                    <motion.div
                      key={action.action}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-700/50"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <code className="font-mono text-orange-300 text-sm">{url}</code>
                        <button
                          onClick={() => copyToClipboard(`aartiq://${action.action}`, `action-${action.action}`)}
                          className="shrink-0 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                          {copied === `action-${action.action}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-zinc-500" />
                          )}
                        </button>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3 ${meta.tone}`}
                      >
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>

                      <p className="text-zinc-400 text-sm">{action.description}</p>

                      <div className="mt-3 text-xs">
                        <span className="text-zinc-500 uppercase tracking-wider font-semibold">
                          Parameters read
                        </span>
                        <code className="block mt-1 font-mono text-zinc-300">{action.params}</code>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Bridge */}
            <section id="bridge" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-2">Bridge API</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  The preload bridge calls {BRIDGE_CHANNELS.length} channels and{" "}
                  <code className="font-mono text-orange-300">main.js</code> registers{" "}
                  {BRIDGE_CHANNELS.length}, so every method has a handler and every name matches. The
                  Windows bridge, likewise, matches on all nine of its names. That part is wired
                  correctly. What follows is not.
                </p>
              </motion.div>

              <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/30">
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Channel</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Arguments</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Handler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRIDGE_CHANNELS.map(([channel, args, effect]) => (
                      <tr key={channel} className="border-b border-slate-700/30 last:border-0">
                        <td className="px-4 py-3 font-mono text-orange-300">{channel}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{args}</td>
                        <td className="px-4 py-3">
                          {DUPLICATE_HANDLERS.includes(channel) ? (
                            <span className="text-amber-300">
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              {effect} — registered twice
                            </span>
                          ) : (
                            <span className="text-slate-300">{effect}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* The duplicate registration */}
              <div className="p-6 rounded-2xl bg-rose-500/[0.05] border border-rose-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <h3 className="text-xl font-bold text-rose-300">
                    On Linux, main.js registers five channels a second time
                  </h3>
                </div>

                <div className="space-y-4 text-zinc-300">
                  <p>
                    The module registers these ten channels in{" "}
                    <code className="font-mono text-orange-300">setupLinuxIPCHandlers()</code>.{" "}
                    <code className="font-mono text-orange-300">main.js</code> calls that at line
                    752, inside its <code className="font-mono text-orange-300">platform === &apos;linux&apos;</code>{" "}
                    guard, and then registers eleven{" "}
                    <code className="font-mono text-orange-300">linux:</code> channels of its own
                    starting at line 757. Five names appear in both lists.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
                    <div className="p-4 rounded-xl bg-black/30 border border-zinc-700/50">
                      <div className="text-zinc-500 mb-2 text-xs uppercase tracking-wider">
                        Registered twice
                      </div>
                      {DUPLICATE_HANDLERS.map((channel) => (
                        <div key={channel} className="text-rose-300 py-0.5">
                          {channel}
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl bg-black/30 border border-zinc-700/50">
                      <div className="text-zinc-500 mb-2 text-xs uppercase tracking-wider">
                        Registered once, never invoked
                      </div>
                      {ORPHAN_HANDLERS.map((channel) => (
                        <div key={channel} className="text-zinc-400 py-0.5">
                          {channel}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p>
                    Electron&apos;s{" "}
                    <code className="font-mono text-orange-300">ipcMain.handle</code> throws{" "}
                    <code className="font-mono text-orange-300">
                      Attempted to register a second handler
                    </code>{" "}
                    for a channel that already has one. Because the module runs first, the throw
                    comes from the second registration —{" "}
                    <code className="font-mono text-orange-300">main.js:781</code>, the{" "}
                    <code className="font-mono text-orange-300">linux:notify</code> line. It is not
                    wrapped in a{" "}
                    <code className="font-mono text-orange-300">try</code>, so main.js stops
                    executing there and the four registrations after it never happen either.
                  </p>

                  <p className="text-zinc-400">
                    This is why the defect is invisible: it is guarded by{" "}
                    <code className="font-mono text-orange-300">process.platform === &apos;linux&apos;</code>{" "}
                    and nothing in this repository registers any of these channels on macOS or
                    Windows, so both of those platforms are unaffected. Nothing in this page was
                    verified by running it on Linux; the claim is read off the two registration
                    sites and Electron&apos;s implementation, and a test asserts that the overlap
                    is exactly the five channels listed above.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-orange-400" />
                  Calling an action from inside the app
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Subject to the caveat above, this is the path that works. It goes through the
                  preload bridge, so it inherits the same dead-channel problem for the eight actions
                  that only send.
                </p>
                <pre className="p-4 overflow-x-auto rounded-xl bg-black/40">
                  <code className="text-sm font-mono text-slate-200 leading-relaxed">{`// The one path that works on Linux
await window.electronAPI.linux.executeAction('notify', {
  title: 'Build finished',
  message: 'The app is ready',
});
// -> { success: true }  and a real notification appears

await window.electronAPI.linux.executeAction('chat', { message: 'hello' });
// -> { success: true, message: 'Message sent to AI' }  …and nothing happens

// Synthesis works; dictation does not.
await window.electronAPI.linux.voice.speak('Done');
await window.electronAPI.linux.voice.listen();
// -> { success: false, message: '... whisper.cpp ...' }`}</code>
                </pre>
              </div>
            </section>

            {/* Desktop entries */}
            <section id="shortcuts" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-2">Desktop entries</h2>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  Three bridge methods write{" "}
                  <code className="font-mono text-orange-300">.desktop</code> files. Each has a
                  problem that stops the file it writes from doing anything, which is worth knowing
                  before treating this as a working feature.
                </p>
              </motion.div>

              <div className="grid gap-4 md:grid-cols-3">
                {SHORTCUT_CAVEATS.map((c) => (
                  <div key={c.title} className="p-5 rounded-2xl bg-zinc-900/60 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mb-3" />
                    <h3 className="font-semibold text-white mb-2 text-sm">{c.title}</h3>
                    <p className="text-zinc-400 text-sm">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Removed claims */}
            <section id="removed" className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/50">
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
                className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-900/20 border border-zinc-800/50"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-orange-400" />
                  Quick Reference
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Does something</h3>
                    <div className="space-y-2">
                      {ACTIONS.filter((a) => a.reach === "works").map((a) => (
                        <div key={a.action} className="flex items-center gap-2 font-mono text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-emerald-400">aartiq://{a.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Sends into nothing</h3>
                    <div className="space-y-2">
                      {ACTIONS.filter((a) => a.reach === "dead-channel").map((a) => (
                        <div key={a.action} className="flex items-center gap-2 font-mono text-sm">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="text-rose-300">aartiq://{a.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap gap-4">
                  <Link
                    href="/docs/windows-integration"
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <AppWindow size={16} /> Windows Integration
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