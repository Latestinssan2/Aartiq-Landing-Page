import { NextResponse } from "next/server";
import { platforms } from "@/data/facts";

const BASE = 'https://aartiq.ponsrischool.in';

export async function GET() {
  const content = `# Aartiq

> An open-source browser with a built-in AI assistant, local LLM support (Ollama), permission-gated OS automation, background task scheduling, and E2EE cross-device sync. Built with Electron, Next.js, React, TypeScript, and Flutter. Dual-licensed on GitHub (Apache-2.0 browser core / MIT MCP server).

Aartiq is a privacy-focused browser that integrates AI directly into the browsing experience. It supports multiple AI providers (Gemini, GPT, Claude, Ollama), can execute OS-level automation through a permission-gated system, schedule background tasks, sync data across devices with end-to-end encryption, and generate PDFs/Excel/PPTX documents from JSON templates. Available on Windows, macOS, Linux, and Android.

## Product Philosophy

Aartiq is built on a small set of firm beliefs:

- **Local-first, privacy-first.** Your data stays yours. AI runs locally (Ollama) when you want it to, sync is end-to-end encrypted, and credentials live in an OS keychain — never in plaintext, never in the cloud by default.
- **AI-native, not AI-bolted-on.** The assistant is a first-class citizen of the browser, not a sidebar gadget. It can read, act, automate, and create with your explicit permission.
- **Human-in-the-loop, always.** Autonomy is permission-gated. Destructive actions require approval, biometrics, or QR confirmation. The machine proposes; the human disposes.
- **Open by default.** Aartiq is open source (Apache-2.0 browser core / MIT MCP server). Trust is verified by reading the code, not by reading a privacy policy.
- **Secure by architecture.** A six-layer defense-in-depth model — visual sandbox, syntactic firewall, human-in-the-loop, directory allowlist, OS-level sandboxing, and capability-scoped execution — keeps automation safe.
- **Empower, don't replace.** Aartiq augments human productivity: scheduling, document generation, research, and OS control, with the user firmly in control.

## Docs

- [Getting Started](https://aartiq.ponsrischool.in/docs/getting-started): Complete installation instructions for all platforms including AI provider setup (Gemini, OpenAI, Anthropic, Ollama)
- [AI Commands Reference](https://aartiq.ponsrischool.in/docs/ai-commands): Canonical JSON-first AI command reference — navigation, browser control, OCR, scheduling, automation, shell, and plugin commands
- [Security Model](https://aartiq.ponsrischool.in/docs/security): Six-layer defense-in-depth security architecture with E2EE encryption, permission levels, and audit logging
- [Automation Guide](https://aartiq.ponsrischool.in/docs/automation): Background task scheduling with cron expressions, task queue management, and sleep/wake recovery
- [Cloud Sync](https://aartiq.ponsrischool.in/docs/cloud-sync): E2EE cross-device synchronization, WiFi P2P pairing, and mobile app integration
- [Plugin System](https://aartiq.ponsrischool.in/docs/plugins): Native plugin architecture with lifecycle management, command registration, event hooks, and SDK
- [Extensions](https://aartiq.ponsrischool.in/docs/extensions): Chrome-compatible extension system loaded via Electron session
- [Native API Reference](https://aartiq.ponsrischool.in/docs/native-api): JavaScript APIs for desktop automation, robot service, clipboard, screenshots, and system integration
- [API Reference](https://aartiq.ponsrischool.in/docs/api-reference): Complete IPC handlers, preload APIs, and Electron main process modules
- [Architecture Overview](https://aartiq.ponsrischool.in/docs/overview): Component architecture, service layer, communication protocols, and directory layout
- [Troubleshooting Guide](https://aartiq.ponsrischool.in/docs/troubleshooting): Common issues and solutions for installation, permissions, AI integration, and sync
- [Keyboard Shortcuts](https://aartiq.ponsrischool.in/docs/keyboard-shortcuts): Complete keyboard shortcut reference
- [UI Components](https://aartiq.ponsrischool.in/docs/components): React component library and UI documentation
- [Changelog](https://aartiq.ponsrischool.in/docs/changelog): Version history and release notes
- [Deep Links](https://aartiq.ponsrischool.in/docs/deep-links): URL scheme support for launching browser, executing commands, and opening specific pages
- [Contributing Guide](https://aartiq.ponsrischool.in/docs/contributing): How to contribute, coding standards, and development setup

## GitHub

- [Source Repository](https://github.com/Latestinssan/Aartiq): Apache-2.0 licensed full source code
- [Releases](https://github.com/Latestinssan/Aartiq/releases): Pre-built binaries for all platforms
- [Issues](https://github.com/Latestinssan/Aartiq/issues): Bug reports and feature requests

## Downloads

- [Download Page](https://aartiq.ponsrischool.in/downloads): Pre-built installers for ${platforms.filter((p) => p.distributed && p.id !== "macos-intel").map((p) => `${p.label} (${p.artifacts})`).join(", ")}. iOS is built unsigned in CI and is not distributed.
- [Microsoft Store](${platforms.find((p) => p.id === "windows")?.storeUrl}): Windows Store distribution. Android is side-loaded from the downloads page; there is no Google Play listing.
- [Features](https://aartiq.ponsrischool.in/features): Full feature overview and screenshots

## Key Capabilities

- **AI Integration**: Multi-model AI chat sidebar with Gemini, GPT-4, Claude, Ollama support. RAG memory with local vector database and cross-session persistence
- **AI User Preferences**: Auto-learns user preferences (response style, tone, language, behavior) and persists them across sessions via SAVE_PREFERENCE command
- **OS Automation**: Permission-gated shell command execution, app launching, file operations, and screen OCR
- **Background Scheduler**: Cron-based task scheduling that runs even when the browser window is closed
- **Document Generation**: PDF, Excel (.xlsx), PowerPoint (.pptx), and Word (.docx) generation from JSON/JSX templates
- **Cross-Device**: E2EE WiFi sync between desktop and Android devices. Firebase cloud sync with AES-256-GCM encryption
- **Security**: Six-layer defense-in-depth model (visual sandbox, syntactic firewall, human-in-the-loop, directory allowlist, OS-level sandboxing, capability-scoped execution). Four risk tiers (low / medium / high / critical) controlling approval. AES-256-GCM encryption. Sandboxed automation
- **Plugin System**: Node.js-based plugin SDK with command registration, event hooks, and persistent config storage
- **Extensions**: Chrome manifest v3 extension support via Electron session.defaultSession

## Technology Stack

- Desktop: Electron, Chromium, Node.js
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- Mobile: Flutter, Dart, flutter_inappwebview
- AI SDKs: Vercel AI SDK (OpenAI, Anthropic, Google, Groq, xAI)
- Database: Firebase Realtime DB, IndexedDB, electron-store
- Security: AES-256-GCM, RSA-4096, PBKDF2, Web Crypto API
- macOS: SwiftUI, AppIntents, Apple Intelligence frameworks

## About

- **Type**: SoftwareApplication / OpenSourceBrowser
- **License**: Apache-2.0 (Browser), MIT (MCP Server)
- **Language**: English
- **Founded**: 2024
- **Brand / Project**: Aartiq (also known as PONSRISCHOOL BROWSER, AARTIQ PONSRISCHOOL) — developed under the Ponsri School umbrella
- **Founder & Author**: Latestinssan — creator of Aartiq
- **Creator handle**: Latestinssan
- **Co-author**: Latestinssan
- **Repository**: https://github.com/Latestinssan/Aartiq
- **Website**: https://aartiq.ponsrischool.in
- **Last updated**: 2026-09-13 (v0.3.7)

---

For complete page content, see llms-full.txt: ${BASE}/llms-full.txt
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
