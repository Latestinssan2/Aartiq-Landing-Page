import { NextResponse } from "next/server";
import { net, platforms, security, shellTiers } from "@/data/facts";

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
- **Landing_Page**: Documentation site (Next.js)

### Communication Protocols
- HTTP (Next.js): Port ${net.devRenderer.port} (development UI only — not started in a packaged build)
- WebSocket: Port ${net.wifiSync.port} (Desktop-mobile sync)
- UDP: Port ${net.discovery.port} (Device discovery — a broadcast destination, not a listener)
- HTTP (Nexus bridge): retired — no such listener exists (network.retiredPorts)

### Key Services
- Security.ts / SecurityValidator.js — Command validation, risk levels, injection detection
- AIChatSidebar.tsx — Main AI chat interface
- AICommandParser.ts — Parses AI output into executable commands
- AdvancedDocumentEngine.ts — PDF/XLSX/PPTX generation
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

### Navigation Commands
- \`NAVIGATE\`: { url: string } — Navigate to URL
- \`SEARCH\`: { query: string } — Search using default search engine
- \`WEB_SEARCH\`: { query: string } — Web search and return results
- \`RELOAD\`: {} — Reload current page
- \`GO_BACK\`: {} — Go back in history
- \`GO_FORWARD\`: {} — Go forward in history

### Page Interaction
- \`READ_PAGE_CONTENT\`: {} — Extract and return page text content
- \`LIST_OPEN_TABS\`: {} — List all open tabs
- \`CLICK_ELEMENT\`: { selector: string } — Click element by CSS selector
- \`FIND_AND_CLICK\`: { text: string } — Find and click element containing text
- \`FILL_FORM\`: { selector: string, value: string } — Fill a form field

### File & Document Commands
- \`CREATE_PDF_JSON\`: { title: string, content: any } — Generate PDF from JSON
- \`CREATE_DOCX\`: { title: string, content: any } — Generate Word document
- \`CREATE_XLSX\`: { title: string, rows: any[] } — Generate Excel spreadsheet
- \`CREATE_PPTX\`: { title: string, slides: any[] } — Generate PowerPoint
- \`CREATE_FILE_JSON\`: { path: string, content: string } — Write file to disk

### OS Automation
- \`SHELL_COMMAND\`: { command: string } — Execute shell command (requires permission)
- \`SET_VOLUME\`: { level: number } — Set system volume (0-100)
- \`SET_BRIGHTNESS\`: { level: number } — Set display brightness (0-100)
- \`OPEN_APP\`: { name: string, path?: string } — Launch an application

### Screen & OCR Commands
- \`OCR_SCREEN\`: {} — OCR the visible screen content
- \`OCR_COORDINATES\`: { x: number, y: number, width: number, height: number } — OCR a screen region
- \`CLICK_APP_ELEMENT\`: { text: string } — Click an OS-native UI element containing text

### Scheduling Commands
- \`SCHEDULE_TASK\`: { cron: string, command: string, params?: object } — Schedule a recurring task
- \`LIST_AUTOMATIONS\`: {} — List all scheduled automations
- \`DELETE_AUTOMATION\`: { taskId: string } — Delete a scheduled task

### AI & Reasoning Commands
- \`THINK\`: { prompt: string } — Deep reasoning step
- \`PLAN\`: { goal: string } — Generate multi-step plan
- \`PLUGIN_COMMAND\`: { plugin: string, command: string, params?: object } — Execute a plugin command

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
- The CRX3 signature-verifier test suite is skipped until its header parsing is fixed, and is counted as skipped rather than passing.

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
- **Last updated**: 2026-07-20
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
