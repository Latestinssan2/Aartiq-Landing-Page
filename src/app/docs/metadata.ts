import type { Metadata } from "next";
import { APP_INFO } from "@/lib/version";

const baseUrl = "https://aartiq.ponsrischool.in";

export const docsMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `Documentation | Aartiq Browser`,
    template: `%s | Aartiq Docs`,
  },
  description: `Complete documentation for Aartiq Browser - An open-source browser with built-in AI assistant and OS automation, built by Latestinssan.`,
  keywords: [
    "Aartiq", 
    "Aartiq Docs", 
    "Aartiq by Latestinssan", 
    "Aartiq India",
    "AI Browser Documentation",
    "Autonomous Browser Guide",
    "aarti browser"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const docsPages: Record<string, { title: string; description: string; keywords: string[] }> = {
  "": {
    title: "Documentation Home",
    description: "Complete documentation index for Aartiq",
    keywords: ["Aartiq", "documentation", "guides", "reference"],
  },
  "getting-started": {
    title: "Getting Started",
    description: "Installation guide for Aartiq on Windows, macOS, Linux, and Android",
    keywords: ["installation", "setup", "download", "Windows", "macOS", "Linux", "Android"],
  },
  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    description: "Complete list of keyboard shortcuts for docs search, browser control, AI approvals, and navigation",
    keywords: ["keyboard", "shortcuts", "hotkeys", "docs search", "Cmd+K", "Ctrl+K"],
  },
  overview: {
    title: "Overview",
    description: "Architecture overview, features, and technology stack of Aartiq",
    keywords: ["overview", "architecture", "features", "technology stack"],
  },
  components: {
    title: "Components",
    description: "React component library and UI component documentation",
    keywords: ["components", "UI", "React", "interface"],
  },
  changelog: {
    title: "Changelog",
    description: "Version history and release notes for Aartiq",
    keywords: ["changelog", "releases", "version", "updates"],
  },
  "cloud-sync": {
    title: "Cloud Sync",
    description: "End-to-end encrypted cross-device synchronization and WiFi P2P pairing",
    keywords: ["sync", "cloud", "encryption", "E2EE", "WiFi", "mobile"],
  },
  "ai-commands": {
    title: "AI Commands",
    description: "Canonical JSON-first AI command reference for Aartiq, including scheduling, OCR, automation, and plugin commands",
    keywords: ["AI commands", "JSON", "automation", "OCR", "scheduling", "shell", "plugins"],
  },
  "skills": {
    title: "Skills",
    description: "Aartiq skills: on-demand Markdown prompt skills, the capability catalog, and the MCP/HTTP agent API",
    keywords: ["skills", "prompt skills", "SkillRegistry", "SkillLoader", "MCP", "agent API", "tools"],
  },
  security: {
    title: "Security Model",
    description: "Six-layer security architecture, E2EE encryption, permissions, and privacy features",
    keywords: ["security", "encryption", "E2EE", "privacy", "AES-256", "RSA"],
  },
  automation: {
    title: "Automation",
    description: "Background task scheduling, cron expressions, task queue, and sleep/wake recovery",
    keywords: ["automation", "scheduling", "cron", "background", "tasks"],
  },
  "native-api": {
    title: "Native API",
    description: "Native APIs for desktop automation, Apple Intelligence, native-first OCR, cross-app clicks, and system integration",
    keywords: ["API", "automation", "Apple Intelligence", "OCR", "cross-app", "desktop control"],
  },
  "deep-links": {
    title: "Deep Links",
    description: "URL scheme support (comet-browser://) for launching browser and executing commands",
    keywords: ["deep links", "URL scheme", "comet-browser", "protocol"],
  },
  plugins: {
    title: "Plugins",
    description: "Native plugin architecture, plugin SDK, lifecycle management, and event hooks",
    keywords: ["plugins", "extensions", "SDK", "hooks"],
  },
  extensions: {
    title: "Extensions",
    description: "Browser extension system for adding custom functionality",
    keywords: ["extensions", "browser", "addons"],
  },
  "api-reference": {
    title: "API Reference",
    description: "Complete IPC handlers, preload APIs, OCR handlers, automation endpoints, and Electron main process modules",
    keywords: ["API", "IPC", "preload", "Electron", "OCR", "automation", "reference"],
  },
  troubleshooting: {
    title: "Troubleshooting",
    description: "Common issues and solutions for installation, permissions, AI, and sync",
    keywords: ["troubleshooting", "issues", "problems", "solutions", "errors"],
  },
  contributing: {
    title: "Contributing",
    description: "How to contribute to Aartiq, coding standards, and development setup",
    keywords: ["contributing", "development", "open source", "GitHub"],
  },
};

export function generateDocMetadata(pageSlug: string): Metadata {
  const pageInfo = docsPages[pageSlug] || docsPages[""];
  
  return {
    title: pageInfo.title,
    description: pageInfo.description,
    keywords: pageInfo.keywords,
    openGraph: {
      title: `${pageInfo.title} | ${APP_INFO.name} Docs`,
      description: pageInfo.description,
      url: `${baseUrl}/docs/${pageSlug}`,
      siteName: `${APP_INFO.name} Documentation`,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: `${pageInfo.title} | ${APP_INFO.name}`,
      description: pageInfo.description,
    },
  };
}
