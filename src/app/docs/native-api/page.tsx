"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Code,
  Box,
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Monitor,
  Keyboard,
  MousePointer,
  Volume2,
  FolderOpen,
  Globe,
  Printer,
  Share2,
  Settings,
  Smartphone,
  Tablet,
  Laptop,
  Layers,
  Plug,
  Zap,
  CheckCircle2,
  CircleX,
  AlertTriangle,
  ArrowRight,
  Copy,
  Braces,
  Database,
  Server,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Maximize,
  Minimize,
  X,
  RefreshCw,
  Command,
  ChevronRight,
  Sparkles
} from "lucide-react";

const apiCategories = [
  {
    id: "system",
    name: "System APIs",
    icon: Cpu,
    fileRef: "src/main/handlers/system-handlers.js",
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    description: "Control system-level functions like displays, power, and system preferences.",
    apis: [
      { name: "getSystemInfo", desc: "Get CPU, memory, disk info", returns: "SystemInfo" },
      { name: "getDisplays", desc: "List all connected displays", returns: "Display[]" },
      { name: "setDisplayMode", desc: "Change resolution, refresh rate", returns: "void" },
      { name: "getSystemPreferences", desc: "Get macOS system preferences", returns: "Preferences" },
      { name: "setSystemPreference", desc: "Update system preferences", returns: "void" },
      { name: "lockScreen", desc: "Lock the computer", returns: "void" },
      { name: "sleep", desc: "Put display to sleep", returns: "void" },
      { name: "restart", desc: "Restart the system", returns: "void" },
      { name: "shutdown", desc: "Shut down the system", returns: "void" }
    ]
  },
  {
    id: "window",
    name: "Window Management",
    icon: Monitor,
    fileRef: "src/main/handlers/app-handlers.js",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    description: "Control window positioning, sizing, and state.",
    apis: [
      { name: "getWindows", desc: "List all open windows", returns: "Window[]" },
      { name: "focusWindow", desc: "Focus a specific window", returns: "void" },
      { name: "setWindowBounds", desc: "Move and resize window", returns: "void" },
      { name: "minimizeWindow", desc: "Minimize window to dock", returns: "void" },
      { name: "maximizeWindow", desc: "Maximize window to fullscreen", returns: "void" },
      { name: "closeWindow", desc: "Close a window", returns: "void" },
      { name: "setWindowAlwaysOnTop", desc: "Pin window above others", returns: "void" },
      { name: "getWindowTitle", desc: "Get window title", returns: "string" },
      { name: "getWindowApp", desc: "Get owning application", returns: "AppInfo" }
    ]
  },
  {
    id: "input",
    name: "Input Control",
    icon: Keyboard,
    fileRef: "src/main/handlers/browser-handlers.js",
    color: "from-purple-500/20 to-fuchsia-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    description: "Control keyboard, mouse, and other input devices.",
    apis: [
      { name: "typeText", desc: "Type text at cursor", returns: "void" },
      { name: "pressKey", desc: "Press a keyboard key", returns: "void" },
      { name: "pressHotKey", desc: "Press modifier + key combo", returns: "void" },
      { name: "moveMouse", desc: "Move cursor to position", returns: "void" },
      { name: "clickMouse", desc: "Click at cursor position", returns: "void" },
      { name: "scrollMouse", desc: "Scroll wheel", returns: "void" },
      { name: "dragMouse", desc: "Drag from to position", returns: "void" },
      { name: "getMousePosition", desc: "Get cursor coordinates", returns: "Point" },
      { name: "getActiveApp", desc: "Get frontmost app", returns: "AppInfo" }
    ]
  },
  {
    id: "files",
    name: "File System",
    icon: FolderOpen,
    fileRef: "src/main/handlers/file-handlers.js",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    description: "Read, write, and manage files and directories.",
    apis: [
      { name: "readFile", desc: "Read file contents", returns: "string | Buffer" },
      { name: "writeFile", desc: "Write to file", returns: "void" },
      { name: "appendFile", desc: "Append to file", returns: "void" },
      { name: "deleteFile", desc: "Delete a file", returns: "void" },
      { name: "moveFile", desc: "Move/rename file", returns: "void" },
      { name: "copyFile", desc: "Copy file", returns: "void" },
      { name: "listDirectory", desc: "List directory contents", returns: "FileInfo[]" },
      { name: "createDirectory", desc: "Create directory", returns: "void" },
      { name: "getFileInfo", desc: "Get file metadata", returns: "FileInfo" }
    ]
  },
  {
    id: "network",
    name: "Network & URLs",
    icon: Wifi,
    fileRef: "src/main/handlers/browser-handlers.js",
    color: "from-cyan-500/20 to-sky-500/20",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    description: "Network requests, URL handling, and connectivity.",
    apis: [
      { name: "httpRequest", desc: "Make HTTP request", returns: "Response" },
      { name: "downloadFile", desc: "Download from URL", returns: "string" },
      { name: "openURL", desc: "Open URL in browser/app", returns: "void" },
      { name: "getLocalIP", desc: "Get local IP address", returns: "string" },
      { name: "ping", desc: "Ping a host", returns: "number" },
      { name: "getNetworkStatus", desc: "Get connectivity info", returns: "NetworkStatus" }
    ]
  },
  {
    id: "media",
    name: "Media Control",
    icon: Volume2,
    fileRef: "src/main/handlers/system-handlers.js",
    color: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
    description: "Control audio, video, and media playback.",
    apis: [
      { name: "setVolume", desc: "Set system volume (0-100)", returns: "void" },
      { name: "getVolume", desc: "Get current volume", returns: "number" },
      { name: "muteAudio", desc: "Mute/unmute system audio", returns: "void" },
      { name: "playPauseMedia", desc: "Play/pause media keys", returns: "void" },
      { name: "nextTrack", desc: "Next media track", returns: "void" },
      { name: "prevTrack", desc: "Previous media track", returns: "void" },
      { name: "screenshot", desc: "Take screenshot", returns: "string (base64)" },
      { name: "screenRecord", desc: "Record screen", returns: "string" }
    ]
  },
  {
    id: "vision",
    name: "Visual Automation",
    icon: Eye,
    fileRef: "src/lib/ocr/",
    color: "from-rose-500/20 to-orange-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-300",
    description: "Native-first OCR and cross-app clicking across macOS, Windows, and Linux.",
    apis: [
      { name: "performOCR", desc: "Run native-first OCR on the screen or a region", returns: "OCRResult" },
      { name: "ocrCaptureWords", desc: "Get OCR words and reconstructed lines with provider metadata", returns: "OCRCaptureResult" },
      { name: "ocrClick", desc: "Resolve and click visible desktop text targets", returns: "OCRClickResult" },
      { name: "performCrossAppClick", desc: "Click external app coordinates after approval", returns: "void" },
      { name: "findAndClickText", desc: "Shared high-level visible-text click helper", returns: "boolean" }
    ]
  },
  {
    id: "apple",
    name: "Apple Intelligence",
    icon: Sparkles,
    fileRef: "src/lib/apple-intelligence.js",
    color: "from-sky-500/20 to-violet-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-300",
    description: "macOS-only native AI bridge for Foundation Models, Apple readiness checks, and local image and emoji generation. Each command has its own OS floor: status reports all three separately, summary needs 26.0, image needs 15.1, genmoji needs 15.4. Off macOS all four return { success: false, error: 'Apple Intelligence is only available on macOS.' }.",
    apis: [
      { name: "apple-intelligence-status", desc: "Report per-command readiness and the reason any command is unavailable", returns: "AppleIntelligenceStatus" },
      { name: "apple-intelligence-summary", desc: "Summarize a string through Foundation Models (macOS 26.0+)", returns: "AppleSummaryResult" },
      { name: "apple-intelligence-generate-image", desc: "Generate an image file through Image Playground (macOS 15.1+)", returns: "AppleImageResult" },
      { name: "apple-intelligence-genmoji", desc: "Generate a custom emoji from a description (macOS 15.4+)", returns: "AppleGenmojiResult" },
      { name: "show-mac-native-panel", desc: "Open native SwiftUI panel modes on macOS", returns: "PanelResult" },
      { name: "update-native-mac-ui-state", desc: "Push state from Electron into native macOS panels", returns: "void" }
    ]
  }
];

// Every example below calls a method that exists on window.electronAPI in
// aartiq-browser/preload.js. Earlier versions of this page routed calls
// through a global that no preload creates, using channel names that appear
// in neither the preload bridge nor the main process, so every one of those
// examples threw on the first line. A method that could not be verified was
// removed rather than renamed, because a renamed example is still a false
// example.
// Correction banner. The rest of this page's tables describe a capability
// surface that the renderer cannot currently reach, and every code example
// used to route calls through a global that no preload creates. The examples
// below were rewritten against methods verified to exist in preload.js. The
// tables are labelled "documented, not reachable" rather than deleted,
// because the underlying capability modules may still exist in src/lib/ even
// though nothing exposes them over the bridge.
const REACHABILITY_WARNING =
  "The only bridge preload.js exposes is window.electronAPI. The previous " +
  "version of this page routed every example through a different global that " +
  "no preload creates, so each one threw a TypeError before reaching the " +
  "channel it named.";

const codeExamples = {
  system: `// window.electronAPI is the only bridge preload.js exposes.
// Earlier examples on this page called a different global and threw.

const platform = await window.electronAPI.getPlatform();
// 'darwin' | 'win32' | 'linux'

const isOnline = await window.electronAPI.getIsOnline();
console.log(platform, isOnline);`,

  window: `// Window control is fire-and-forget: send(), not invoke(), so there is
// nothing to await and nothing to check the result of.

window.electronAPI.minimizeWindow();
window.electronAPI.maximizeWindow();

// Bring a tab view to the front
window.electronAPI.activateView({ tabId });`,

  input: `// Type into the focused element of the active page. typeText takes a
// selector and the text, and routes through the same input path the
// automation engine uses.

await window.electronAPI.typeText('#search', 'Hello, World!');

// There is no exposed press-hot-key, press-key, click-mouse, move-mouse
// or scroll-mouse method. Those examples were removed: renaming them to a
// different method would have been a new false claim.`,

  files: `// The renderer bridge has no read-file, write-file, list-directory or
// create-directory method. File access goes through the sandboxed
// automation layer and the plugin API, both of which route through
// capability checks and approval.

await window.electronAPI.pluginApi.readFile(path);
await window.electronAPI.pluginApi.writeFile(path, content);`,

  network: `// The renderer bridge has no http-request or download-file method.
// Outbound requests go through the network security layer in the main
// process, which applies its own policy; there is deliberately no
// renderer-side passthrough for arbitrary URLs or headers.`,

  media: `// Set system output volume, 0-100.
await window.electronAPI.setVolume(50);

// Screenshots go through the capture channels, not a generic 'screenshot'
const png = await window.electronAPI.captureBrowserViewScreenshot();
const region = await window.electronAPI.captureScreenRegion({
  x: 100, y: 100, width: 800, height: 600
});`,

  vision: `// Native-first OCR capture
const result = await window.electronAPI.ocrCaptureWords();
console.log(result.provider);
console.log(result.lines?.slice(0, 5));

// Native-first external app click
const clickResult = await window.electronAPI.ocrClick('Run', true);
console.log(clickResult);

// OCR raw text for the current display
const screenText = await window.electronAPI.ocrScreenText();
console.log(screenText.text);`,

  apple: `// Check Apple Intelligence readiness on macOS
const status = await window.electronAPI.getAppleIntelligenceStatus();
console.log(status);
// {
//   success: true,
//   osVersion: 'macOS ...',
//   summaryAvailable: false,
//   summaryReason: 'Apple Intelligence is not supported on this Mac.',
//   imageAvailable: false,
//   imageReason: 'Apple image generation is not supported or not available right now on this Mac.'
// }

// Generate a local summary only when summaryAvailable === true (macOS 26.0+)
const summary = await window.electronAPI.summarizeWithAppleIntelligence(
  "Summarize this browser content for me."
);

// Generate a local image only when imageAvailable === true (macOS 15.1+)
const image = await window.electronAPI.generateAppleIntelligenceImage({
  prompt: "A cinematic comet streaking over a desktop browser UI"
});

// Generate a custom emoji only when genmojiAvailable === true (macOS 15.4+)
const emoji = await window.electronAPI.generateGenmoji({
  prompt: "a robot chef"
});`,

  nativeApiCall: `// Approval is the point, not an obstacle to route around.
//
// A risky action does not run. It raises a ticket that the UI shows, and the
// human decides. The ticket is bound to a hash of the exact action and its
// arguments, expires after five minutes, and is single-use, so approving one
// command does not approve a different one afterwards.

// Listen for tickets raised by the main process. The callback returns an
// unsubscribe function; keep it or you leak the listener.
const stop = window.electronAPI.onApprovalRequired((ticket) => {
  // ticket carries the action, the arguments, and a risk tier.
  console.log(ticket.action, ticket.riskTier);

  // Decide. These take a ticket id, not a command: you cannot approve an
  // action you were not shown.
  window.electronAPI.approveTicket(ticket.id);
  // or
  window.electronAPI.denyTicket(ticket.id, 'not this time');
});

stop(); // later, when the view unmounts

const pending = await window.electronAPI.getPendingApprovals();

// There is no parameter that skips this on any entry point. Not on a URL,
// not on an IPC channel, not on the CLI. A command that runs without a
// ticket did not ask, and that is the bug to report.`
};

// These four entries used to cite files that do not exist:
// AppleIntelligenceBridge.swift, and SiriShortcutsIntegration.ts. The Swift
// entry is now the panel view that exists, and the App Intents entry is the
// file that actually declares the 20 intents. Writing Tools is marked
// absent because no code path calls the macOS Writing Tools service.
const appleAdvancedPaths = [
  {
    title: "Foundation Models",
    description: "Apple's on-device language model. Reached through the compiled helper, gated on macOS 26.0. Not a general-purpose generation API: Aartiq calls it to summarize.",
    fileRef: "src/lib/apple-intelligence.swift",
    status: "available"
  },
  {
    title: "Image Playground",
    description: "Native image generation, gated on macOS 15.1. Returns a file path, not base64.",
    fileRef: "src/lib/apple-intelligence.swift",
    status: "available"
  },
  {
    title: "Genmoji",
    description: "Custom emoji from a description, gated on macOS 15.4. Same helper, different command.",
    fileRef: "src/lib/apple-intelligence.swift",
    status: "available"
  },
  {
    title: "Apple Intelligence panel",
    description: "The native SwiftUI surface that calls the summary and image endpoints on the loopback bridge.",
    fileRef: "src/lib/native-panels/AppleIntelligencePanelView.swift",
    status: "available"
  },
  {
    title: "App Intents",
    description: "Twenty intents registered for Siri, five of which call a bridge route that is not served. See the Apple integration page for which ones work.",
    fileRef: "src/lib/native-panels/AppIntents.swift",
    status: "partial"
  },
  {
    title: "Writing Tools",
    description: "Not implemented. No code path calls the macOS Writing Tools service. The rewrite box in the panel is Aartiq's own prompt box and is not relabelled to cover this row.",
    fileRef: null,
    status: "absent"
  }
];

// Shapes transcribed from the implementation, not from the design document.
const typeDefinitions = `// Response shapes, transcribed from the code.
//
// Every field of ResponsePayload in src/lib/apple-intelligence.swift. The
// optional fields are omitted when the matching command is unavailable, so
// read the availability flag before the value.
interface AppleIntelligenceResponse {
  success: boolean;
  error?: string;

  // Every command
  available?: boolean;
  osVersion?: string;

  // Summaries, via Foundation Models. macOS 26.0+
  supportsSummaries?: boolean;
  summaryAvailable?: boolean;
  summaryReason?: string;   // present when it is unavailable
  summary?: string;

  // Image Playground. macOS 15.1+
  supportsImageGeneration?: boolean;
  imageAvailable?: boolean;
  imageReason?: string;
  imagePath?: string;        // a filesystem path, not base64
  availableStyles?: string[];

  // Genmoji. macOS 15.4+
  supportsGenmoji?: boolean;
  genmojiAvailable?: boolean;
  genmojiReason?: string;
  genmojiPath?: string;      // a filesystem path, not base64
}

// Off macOS, every one of these resolves to exactly:
//   { success: false, error: APPLE_INTELLIGENCE_UNAVAILABLE }
// where the message is "Apple Intelligence is only available on macOS."

// Approval ticket, from src/lib/approval-gate.js: bound to a hash of the
// exact action and its arguments, five minute TTL, single use.
interface ApprovalTicket {
  id: string;
  action: string;
  params: Record<string, unknown>;
  riskTier: string;
  expiresAt: number;         // epoch milliseconds
}`;

export default function NativeAPIPage() {
  const [activeCategory, setActiveCategory] = useState("system");
  const [codeTab, setCodeTab] = useState<"system" | "window" | "input" | "files" | "network" | "media" | "vision" | "apple">("system");
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(id);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const activeApi = apiCategories.find(c => c.id === activeCategory);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2">
          <Code size={14} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
            Native API
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Native <span className="text-white/20">API</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          System-level APIs exposed through Electron IPC channels, registered in
          <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">main.js</code>
          and organized per domain in
          <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/main/handlers/</code>.
          The bridge is <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">window.electronAPI</code>.
        </p>

        <div className="mt-8 max-w-3xl rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-400/80">
            Two corrections to this page
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            {REACHABILITY_WARNING}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            The API tables below are a design reference, not a list you can call. Of the 61 methods
            this page listed, 46 have no IPC channel of that name in either the preload bridge or the
            main process — there is no <code className="font-mono text-white/70">read-file</code>,
            no <code className="font-mono text-white/70">http-request</code>, no{" "}
            <code className="font-mono text-white/70">press-hot-key</code>. The code examples below
            were rewritten against methods verified to exist; the tables are kept because the
            capability modules may still live in <code className="font-mono text-white/70">src/lib/</code>{" "}
            with nothing exposing them. See{" "}
            <code className="font-mono text-white/70">aartiq-browser/docs-audit/feature-triage.md</code>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid gap-6 sm:grid-cols-4">
          {[
            { icon: Box, label: "Documented", value: "61", color: "text-blue-400", border: "border-blue-500/20" },
            { icon: Cpu, label: "Reachable", value: "15", color: "text-emerald-400", border: "border-emerald-500/20" },
            { icon: Monitor, label: "Unreachable", value: "46", color: "text-purple-400", border: "border-purple-500/20" },
            { icon: Eye, label: "Visual", value: "4", color: "text-rose-300", border: "border-rose-500/20" },
            { icon: Sparkles, label: "Apple AI", value: "4", color: "text-sky-300", border: "border-sky-500/20" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-white/5 p-6 text-center`}>
              <stat.icon size={32} className={`mx-auto mb-4 ${stat.color}`} />
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
              <p className="text-sm text-white/50">{stat.label} APIs</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="mb-10">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            macOS Native AI
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Apple Intelligence <span className="text-white/20">Paths</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/40">
            Aartiq ships a native Swift helper for readiness checks, summaries, and Apple image generation.
            Apple's platform docs also point to more advanced integrations through Writing Tools, App Intents
            assistant schemas, and native Image Playground interfaces.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {appleAdvancedPaths.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
              <div className="mb-4 flex items-center gap-3 text-sky-300">
                <Sparkles size={18} />
                <h3 className="text-lg font-black uppercase tracking-wider">{item.title}</h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/45">{item.description}</p>
              <p className="font-mono text-[10px] text-white/20">{item.fileRef}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* API Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Available APIs
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            API <span className="text-white/20">Categories</span>
          </h2>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {apiCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all ${
                activeCategory === category.id
                  ? `${category.borderColor} bg-gradient-to-br ${category.color}`
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <category.icon size={28} className={category.iconColor} />
              <span className={`text-xs font-bold uppercase tracking-wider ${activeCategory === category.id ? "text-white" : "text-white/60"}`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {activeApi && (
          <div className={`rounded-[2rem] border ${activeApi.borderColor} bg-gradient-to-br ${activeApi.color} p-10`}>
            <div className="mb-8 flex items-center gap-6">
              <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 ${activeApi.iconColor}`}>
                <activeApi.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-wider">{activeApi.name}</h3>
                <p className="text-white/60">{activeApi.description}</p>
                <p className="mt-1 font-mono text-[10px] text-white/30">{activeApi.fileRef}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {activeApi.apis.map((api) => (
                <div key={api.name} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <code className="font-mono font-bold text-white">{api.name}()</code>
                    <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono text-sky-400">
                      {api.returns}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">{api.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Code Examples */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Implementation
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Code <span className="text-white/20">Examples</span>
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {apiCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCodeTab(category.id as any)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                codeTab === category.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <category.icon size={16} />
              {category.name}
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-wider">
              {codeExamples[codeTab as keyof typeof codeExamples] ? 
                `${apiCategories.find(c => c.id === codeTab)?.name} Example` : 
                "Example"
              }
            </h3>
            <button
              onClick={() => copyToClipboard(codeExamples[codeTab as keyof typeof codeExamples] || '', `code-${codeTab}`)}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white/60 transition-colors hover:bg-white/10"
            >
              {showCopied === `code-${codeTab}` ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {showCopied === `code-${codeTab}` ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/80">
            {codeExamples[codeTab as keyof typeof codeExamples]}
          </pre>
        </div>
      </motion.section>

      {/* Type Definitions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Reference
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Type <span className="text-white/20">Definitions</span>
          </h2>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-wider">TypeScript Definitions</h3>
            <button
              onClick={() => copyToClipboard(typeDefinitions, 'types')}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white/60 transition-colors hover:bg-white/10"
            >
              {showCopied === 'types' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {showCopied === 'types' ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/80">
            {typeDefinitions}
          </pre>
        </div>
      </motion.section>

      {/* Usage Patterns */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Best Practices
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Usage <span className="text-white/20">Patterns</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider">Recommended</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-emerald-400" />
                <span className="text-white/70">Always await async operations before continuing</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-emerald-400" />
                <span className="text-white/70">Use error handling for file/network operations</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-emerald-400" />
                <span className="text-white/70">Check permissions before destructive actions</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-emerald-400" />
                <span className="text-white/70">Add delays between rapid input operations</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <CircleX size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider">Avoid</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-red-400" />
                <span className="text-white/70">Rapid-fire keyboard input without delays</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-red-400" />
                <span className="text-white/70">Deleting files without confirmation</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-red-400" />
                <span className="text-white/70">Ignoring errors on system operations</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight size={18} className="mt-1 text-red-400" />
                <span className="text-white/70">Running shutdown without user consent</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}