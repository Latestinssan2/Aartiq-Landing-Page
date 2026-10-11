import { NextResponse } from "next/server";
import { net, platforms, security, shellTiers, commandCount, project, version } from "@/data/facts";

const BASE = 'https://aartiq.ponsrischool.in';

export async function GET() {
  const content = `# Aartiq — Full Documentation

> An open-source browser with a built-in AI assistant, local LLM support, permission-gated OS automation, background task scheduling, and E2EE cross-device sync.

## Table of Contents

1. Overview
2. Installation
3. AI Commands (Complete Reference)
4. Security Model
5. Automation & Scheduling
6. Cloud Sync
7. Plugin System
8. Extensions
9. Native API
10. Technology Stack
11. Troubleshooting

---

## 1. Overview

Aartiq is a privacy-focused browser that integrates AI directly into the browsing experience. It consists of three main components connected via WebSocket and IPC:

- **aartiq-browser**: Electron desktop app (main.js, Next.js UI on dev port ${net.devRenderer.port}, Background Service)
- **flutter_browser_app**: Flutter mobile companion (WiFi sync, remote desktop, push notifications)
- **Aartiq-Landing-Page**: documentation and marketing site (Next.js, separate repository)

### Communication Protocols
- HTTP (Next.js): Port ${net.devRenderer.port} (development UI only — not started in a packaged build)
- WebSocket: Port ${net.wifiSync.port} (Desktop-mobile sync)
- UDP: Port ${net.discovery.port} (Device discovery — a broadcast destination, not a listener)
- HTTP (Nexus bridge): retired — no such listener exists (network.retiredPorts)

### Key Services
- Security.ts / SecurityValidator.js — Command validation, risk levels, injection detection
- AIChatSidebar.tsx — Main AI chat interface
- AICommandParser.ts — Parses AI output into executable commands
- file-handlers.js — PDF/XLSX/PPTX/DOCX generation
- Plugin Manager — Dynamic Node.js plugin loading with SDK
- Tesseract Service — OCR via Tesseract.js

---

## 2. Installation

### macOS
\`\`\`
Download Aartiq-x.x.x.dmg from https://aartiq.ponsrischool.in/downloads
Open the DMG and drag Aartiq to Applications
\`\`\`

### Windows
\`\`\`
Download Aartiq-Setup-x.x.x.exe or Aartiq-x.x.x.msix from the downloads page
Run the installer
# Or install from the Microsoft Store: ${platforms.find((p) => p.id === "windows")?.storeUrl}
\`\`\`

### Linux
\`\`\`
Download Aartiq-x.x.x.AppImage
chmod +x Aartiq-*.AppImage && ./Aartiq-*.AppImage
# No .deb package is produced by any build workflow.
\`\`\`

### Android
Download Aartiq-x.x.x.apk from the downloads page and side-load it. There is no Google Play listing.

### AI Provider Setup
After installation, configure at least one AI provider in Settings:
- **Google Gemini**: Get API key from aistudio.google.com
- **OpenAI**: Get API key from platform.openai.com
- **Anthropic Claude**: Get API key from console.anthropic.com
- **Ollama (Local)**: Install Ollama from ollama.ai, pull a model (e.g., \`ollama pull deepseek-r1\`)

---

## 3. AI Commands (Complete Reference)

All AI commands use a structured JSON format:
\`\`\`json
{
  "command": "COMMAND_NAME",
  "params": { "key": "value" }
}
\`\`\`

The supported set is the ${commandCount}-command \`COMMAND_REGISTRY\` in
\`aartiq-browser/src/lib/AICommandParser.ts\`. Parameter details and examples for
every command are on ${BASE}/docs/ai-commands.

### Navigation
- \`NAVIGATE\` — Go to a specific URL
- \`SEARCH\` — Search using the default engine
- \`WEB_SEARCH\` — Real-time web search with RAG
- \`SEARCH_RESULTS\` — Get search result URLs directly (no tab opened)
- \`RELOAD\` — Refresh the active browser tab
- \`GO_BACK\` — Go back in browser history
- \`GO_FORWARD\` — Go forward in browser history

### Page Interaction
- \`READ_PAGE_CONTENT\` — Read DOM text from the active tab (fast)
- \`LIST_OPEN_TABS\` — List all open browser tabs
- \`SWITCH_TAB\` — Switch to a tab by ID or index
- \`CLOSE_TAB\` — Close a specific tab by ID
- \`CLICK_ELEMENT\` — Click a web element by selector
- \`FIND_AND_CLICK\` — Find text on screen and click it
- \`CLICK_AT\` — Click at screen coordinates (x, y)
- \`FILL_FORM\` — Fill a form field by selector with a value
- \`MULTI_FILL_FORM\` — Fill multiple form fields atomically from a JSON map
- \`DOM_SEARCH\` — Search within the current page DOM
- \`DOM_READ_FILTERED\` — Read DOM with filtering and an injection check
- \`SCROLL_TO\` — Scroll to a DOM element
- \`SCREENSHOT_AND_ANALYZE\` — See the page using Vision/OCR
- \`DEEP_RESEARCH\` — Deep research with iterative search, source ranking and coverage analysis
- \`ORGANIZE_TABS\` — Use AI to group all open tabs
- \`GROUP_TABS\` — Group open tabs by AI, domain, priority or recency
- \`OPEN_VIEW\` — Switch browser workspace views
- \`ANALYSE_TABS\` — Analyse all open tabs and return one consolidated analysis
- \`ANALYZE_TABS\` — US-spelling variant of ANALYSE_TABS
- \`SUMMARIZE_TABS\` — Summarize content from one or more open tabs
- \`READ_TAB_CONTENT\` — Read the content of one specific open tab
- \`COMPARE_TABS\` — Compare content across multiple open tabs
- \`FIND_INFORMATION_IN_TABS\` — Search open tabs for specific information
- \`CREATE_TAB_RESEARCH_CONTEXT\` — Build a research context from the open tabs

### File & Document Commands
- \`CREATE_PDF_JSON\` — Generate a structured, multi-page PDF (preferred)
- \`CREATE_FILE_JSON\` — Create PDF/PPTX/DOCX from structured JSON
- \`GENERATE_PDF\` — Create a PDF from markdown (fallback)
- \`GENERATE_DIAGRAM\` — Create charts and diagrams with Mermaid.js

### OS Automation
- \`SHELL_COMMAND\` — Execute a terminal command (permission-gated)
- \`SET_VOLUME\` — Set system audio volume
- \`SET_BRIGHTNESS\` — Set screen brightness level
- \`OPEN_APP\` — Launch a desktop application
- \`ENABLE_CLI\` — Enable the Aartiq CLI terminal tool
- \`SET_THEME\` — Switch between dark and light mode
- \`WAIT\` — Pause execution for a duration (ms)
- \`STATUS\` — Show a custom processing indicator to the user

### Screen & OCR Commands
- \`OCR_SCREEN\` — OCR screen or region content (native OS OCR first, image OCR as fallback)

### Scheduling & Automation Commands
- \`SCHEDULE_TASK\` — Schedule a recurring automation task (JSON format)
- \`OPEN_SCHEDULING_MODAL\` — Open the scheduling modal, optionally pre-filled
- \`LIST_AUTOMATIONS\` — List all scheduled automation tasks
- \`DELETE_AUTOMATION\` — Delete an automation using its ID
- \`RECORD_WORKFLOW\` — Start or stop workflow recording
- \`PLAY_WORKFLOW\` — Replay a previously recorded workflow
- \`OPEN_AUTOMATION_SETTINGS\` — Open the automation settings panel
- \`OPEN_MCP_SETTINGS\` — Open the MCP servers settings panel

### Bookmarks & History
- \`LIST_BOOKMARKS\` — List browser bookmarks
- \`ADD_BOOKMARK\` — Add a bookmark
- \`REMOVE_BOOKMARK\` — Remove a bookmark by URL
- \`CLEAR_BOOKMARKS\` — Remove all browser bookmarks
- \`LIST_HISTORY\` — List and search browsing history
- \`CLEAR_HISTORY\` — Clear all browser history

### Skills & Settings
- \`LIST_SKILLS\` — List all available skill guides
- \`LOAD_SKILL\` — Load a specific skill guide into context
- \`SETTINGS_QUERY\` — Read current settings for a category
- \`SETTINGS_UPDATE\` — Request a settings change (requires user approval)
- \`OPEN_SETTINGS_PANEL\` — Open a settings panel for the user
- \`SET_CHAT_STYLE\` — Customize chat font size, glow mode and preset

### Media & Generation
- \`GENERATE_IMAGE\` — Generate an AI image from a prompt
- \`APPLE_INTELLIGENCE_IMAGE\` — Generate an image with Apple Intelligence (macOS)
- \`APPLE_INTELLIGENCE_SUMMARY\` — Summarize text with Apple Intelligence (macOS)
- \`PLAY_VIDEO\` — Play a YouTube video inline in chat
- \`SEARCH_VIDEO\` — Search YouTube and auto-play the top result

### AI & Reasoning Commands
- \`THINK\` — Show AI reasoning steps
- \`PLAN\` — Show future execution steps
- \`EXPLAIN_CAPABILITIES\` — List all available AI features

### Integrations
- \`PLUGIN_COMMAND\` — Execute a plugin-defined command

---

## 4. Security Model

Aartiq uses a six-layer defense-in-depth model:

1. Visual sandbox and SecureDOM
2. Syntactic firewall (regex first-pass reject)
3. Human-in-the-loop approval
4. Directory allowlist
5. OS-level sandboxing (Seatbelt on macOS, bubblewrap on Linux, AppContainer + Job Object on Windows)
6. Capability-scoped execution

### Risk tiers

Each capability carries a risk label that determines approval behaviour. Rendered from the single source of truth, not typed here:

${security.riskTiers
  .map(
    (t, i) =>
      `${i + 1}. **${t.id}**: ${t.approvalMethod} Auto-approve: ${t.autoApprove}` +
      (t.examples.length ? ` Examples: ${t.examples.join(", ")}.` : "") +
      `\n   Limit: ${t.limit}`,
  )
  .join("\n")}

The shell classifier assigns ${shellTiers.counts.commandsInTable} table entries: ${shellTiers.counts.low} low, ${shellTiers.counts.medium} medium, ${shellTiers.counts.high} high, with ${shellTiers.counts.blocked} commands blocked outright. Shell auto-approval exists only behind the \`${shellTiers.autoApprove.setting}\` setting, which defaults to ${shellTiers.autoApprove.defaultValue ? "on" : "off"}. ${shellTiers.alwaysGrant.note}

${shellTiers.invariants.map((r) => `- ${r}`).join("\n")}

### Security Features
- AES-256-GCM encryption for data at rest
- E2EE for cross-device sync
- Optional biometric authentication on MCP tool calls (macOS Touch ID, Windows Hello); off by default
- Input validation and injection detection via SecurityValidator.js
- Command audit logging
- All OS automation commands are permission-gated and logged

### Known limits
- The regex layer is a fast first-pass reject, not the primary defense.
- Only OS sandboxing and capability scoping are enforcement boundaries; the other layers are policy or heuristic.
- The CRX3 verifier does not implement Chrome's publisher-key allowlisting: a package signed with an attacker-generated key verifies as that key's own extension id — sideloading their own extension, never hijacking an existing one.
- installFromWebStore additionally binds the Web Store download URL's declared id (…x=id%3D<32-char id>…) to the verified package's crx_id, so a URL promising one extension can only install that exact extension — substitution by any other validly signed package fails closed.

---

## 5. Automation & Scheduling

The background task scheduler runs independently of the browser window.

### Cron Expression Format
\`\`\`
* * * * *
│ │ │ │ │
│ │ │ │ └── Day of week (0-7, 0=Sun)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)
\`\`\`

### Example Automations
- Daily news briefing: \`0 8 * * *\` → NAVIGATE to news sites, READ_PAGE_CONTENT, summarize
- Weekly report: \`0 9 * * 1\` → CREATE_PDF_JSON with weekly metrics
- Regular backups: \`0 */6 * * *\` → Sync bookmarks and config

---

## 6. Cloud Sync

### WiFi P2P Sync
- Direct device-to-device sync over local network
- Uses WebSocket (port ${net.wifiSync.port}) and UDP discovery (port ${net.discovery.port})
- Zero-configuration pairing via QR code

### Firebase Cloud Sync
- Encrypted cloud backup of settings, bookmarks, history
- E2EE with per-user encryption keys
- Real-time push notifications to mobile devices

---

## 7. Plugin System

Plugins are Node.js modules loaded from ~/Library/Application Support/Aartiq/plugins/ (macOS).

### Plugin Structure
\`\`\`
my-plugin/
├── manifest.json    # Plugin metadata
└── index.js         # Entry point (exports Plugin instance)
\`\`\`

### Plugin SDK API
\`\`\`
class Plugin {
  async onLoad()     // Plugin loaded
  async onUnload()   // Plugin unloaded
  async onEnable()   // Enabled by user
  async onDisable()  // Disabled by user
  registerCommand(spec)  // {id, name, handler, params}
  registerHook(event, handler)  // Listen to events
}

class PluginContext {
  log(message, level)
  fetch(url, options)
  store(key, value)    // Persist config
  executeCommand(cmdId, params)
  emitHook(event, data)
  readFile(path)
  writeFile(path, content)
}
\`\`\`

### IPC API
- plugins:list — List installed plugins
- plugins:install — Install from file/directory
- plugins:uninstall — Remove plugin
- plugins:enable / plugins:disable — Toggle plugin
- plugins:execute-command — Run a plugin command
- plugins:get-dir — Get plugins directory path

---

## 8. Extensions

Aartiq supports Chrome-compatible extensions (Manifest V3) via Electron's session.defaultSession.loadExtension().

### IPC API
- toggleExtension(id) — Enable/disable an extension (returns {success, enabled})
- getExtensions() — List all loaded extensions
- uninstallExtension(id) — Remove extension
- openExtensionDir() — Open extensions folder in Finder/Explorer

Extensions directory: ~/Library/Application Support/Aartiq/extensions/ (macOS)

---

## 9. Native API (Desktop Automation)

### Robot Service
- \`robot.getMousePosition()\` — Get current cursor position
- \`robot.moveMouse(x, y)\` — Move cursor to coordinates
- \`robot.clickMouse()\` — Perform mouse click
- \`robot.typeString(text)\` — Type text at current cursor
- \`robot.keyTap(key)\` — Simulate key press
- \`robot.screenCapture(x, y, w, h)\` — Capture screen region

### Clipboard
- \`clipboard.readText()\` — Get clipboard text
- \`clipboard.writeText(text)\` — Set clipboard text
- \`clipboard.readImage()\` — Get clipboard image
- \`clipboard.writeImage(path)\` — Set clipboard image from file

### System
- \`shell.openPath(path)\` — Open file/folder in default app
- \`shell.openExternal(url)\` — Open URL in default browser
- \`screen.getPrimaryDisplay()\` — Get display info
- \`screen.getAllDisplays()\` — Get all displays

---

## 10. Technology Stack

### Desktop (aartiq-browser/)
- Electron (Chromium + Node.js)
- Next.js 16 (React 19, TypeScript)
- Tailwind CSS, Framer Motion
- Firebase SDK (Auth, Realtime DB, Analytics)
- Tesseract.js (OCR)
- electron-store (persistent config)

### Mobile (flutter_browser_app/)
- Flutter, Dart
- flutter_inappwebview
- Firebase Auth, Realtime DB
- WebRTC (P2P communication)
- local_notifications

### AI/ML
- Vercel AI SDK (providers: OpenAI, Anthropic, Google, Groq, xAI)
- Ollama (local LLM inference)
- Tesseract.js (OCR)
- TensorFlow.js (client-side ML)

### Security
- AES-256-GCM (data encryption)
- RSA-4096 (key exchange)
- PBKDF2 (key derivation)
- Web Crypto API (browser crypto)

### macOS Native
- SwiftUI panels (Sidebar, Settings, Command Center)
- AppIntents framework (Siri Shortcuts)
- Apple Intelligence (macOS 15+)

---

## 11. Troubleshooting

### Common Issues

**App won't start**: Check if another instance is running. Delete ~/Library/Application Support/Aartiq/ and restart.

**AI provider not responding**: Verify API key in Settings → AI Providers. Check rate limits and quota.

**Sync not working**: Ensure both devices are on the same network. Check firewall settings for ports ${net.syncPortRange}.

**Plugins not loading**: Verify manifest.json exists in the plugin folder. Check the console for error messages.

**OCR not working**: Ensure screen recording permission is granted in System Settings → Privacy & Security.

---

## About

- **Site**: Aartiq (https://aartiq.ponsrischool.in)
- **Type**: Open Source AI-Integrated Browser (SoftwareApplication)
- **License**: Apache-2.0 (Browser), MIT (MCP Server)
- **Language**: English
- **Founded**: 2024
- **Authors**: Latestinssan
- **Repository**: https://github.com/Latestinssan/Aartiq
- **Last updated**: ${project.lastUpdated} (v${version.semver} "${version.codename}", ${version.releaseDate})
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
