"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Code2,
  Terminal,
  Database,
  FileText,
  Globe,
  Lock,
  Smartphone,
  Play,
  Pause,
  Copy,
  CheckCircle2,
  ArrowRight,
  Braces,
  ArrowUpRight,
  Server,
  Cpu,
  Zap,
  Box,
  Layers,
  Key,
  Eye,
  Shield,
  Bell
} from "lucide-react";

const ipcCategories = [
  {
    id: "browser",
    name: "Browser Control",
    icon: Globe,
    color: "from-sky-500/20 to-cyan-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
    source: "src/core/window-manager.js, src/lib/screen-vision-service.js",
    handlers: [
      { name: "get-open-tabs", returns: "Tab[]", description: "Returns all open tabs with their URLs and titles" },
      { name: "navigate-to", params: "url: string", returns: "void", description: "Navigate the active tab to the specified URL" },
      { name: "capture-browser-view-screenshot", returns: "Buffer", description: "Capture screenshot of the current browser view" },
      { name: "capture-page-html", returns: "string", description: "Get the raw HTML of the current page" },
      { name: "extract-page-content", returns: "string", description: "Extract readable text content from the page" },
      { name: "find-and-click-text", params: "text: string", returns: "boolean", description: "Resolve visible text and click it through the shared native-first OCR service" },
      { name: "perform-ocr", params: "{ useNative?, bounds?, language?, imagePath? }", returns: "OCRResult", description: "Run OCR with native providers first and Tesseract fallback" },
      { name: "ocr-capture-words", params: "displayId?: string", returns: "OCRCaptureResult", description: "Capture OCR words and lines for the display" },
      { name: "ocr-click", params: "{ target, useAi? }", returns: "OCRClickResult", description: "Resolve and click a visible target using native-first OCR" },
      { name: "ocr-screen-text", params: "displayId?: string", returns: "string", description: "Return extracted screen text for a display" },
      { name: "perform-cross-app-click", params: "{ x, y, button?, doubleClick? }", returns: "boolean", description: "Click a coordinate in another application after permission checks" },
      { name: "get-selected-text", returns: "string", description: "Get currently selected text in the browser" }
    ]
  },
  {
    id: "shell",
    name: "Shell Execution",
    icon: Terminal,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    source: "src/core/shell-executor.js, src/core/system-controls.js",
    handlers: [
      { name: "execute-shell-command", params: "{ rawCommand, preApproved, reason, riskLevel }", returns: "ShellResult", description: "Execute a shell command with security checks" },
      { name: "check-python-available", returns: "boolean", description: "Check if Python is installed" },
      { name: "set-volume", params: "level: number (0-1)", returns: "void", description: "Set system volume" },
      { name: "set-brightness", params: "level: number (0-1)", returns: "void", description: "Set display brightness" },
      { name: "open-external-app", params: "appNameOrPath: string", returns: "boolean", description: "Launch an external application" },
      { name: "open-system-settings", params: "url: string", returns: "void", description: "Open a system settings page" }
    ]
  },
  {
    id: "pdf",
    name: "Document Generation",
    icon: FileText,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    source: "src/core/pdf-generator.js, src/lib/PDFCommandParser.ts",
    handlers: [
      { name: "generate-pdf", params: "title: string, content: any", returns: "string (path)", description: "Generate a PDF document" },
      { name: "generate-pdf-with-method", params: "{ method, options }", returns: "string (path)", description: "Generate PDF using specified method (html-pdfkit, pdf-lib, etc.)" },
      { name: "generate-pptx", params: "payload: PPTXPayload", returns: "string (path)", description: "Generate PowerPoint presentation" },
      { name: "generate-docx", params: "payload: DOCXPayload", returns: "string (path)", description: "Generate Word document" },
      { name: "open-pdf", params: "filePath: string", returns: "void", description: "Open PDF in system viewer" },
      { name: "open-file", params: "fileNameOrPath: string", returns: "void", description: "Open file in default application" },
      { name: "export-chat-pdf", params: "messages: Message[]", returns: "string (path)", description: "Export chat history as PDF" }
    ]
  },
  {
    id: "automation",
    name: "Task Automation",
    icon: Zap,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    source: "src/service/scheduler.js",
    handlers: [
      { name: "automation:get-tasks", returns: "Task[]", description: "Get all scheduled tasks" },
      { name: "automation:get-task", params: "taskId: string", returns: "Task", description: "Get a specific task by ID" },
      { name: "automation:create-task", params: "taskData: TaskData", returns: "Task", description: "Create a new scheduled task" },
      { name: "automation:update-task", params: "taskId: string, updates: Partial<Task>", returns: "Task", description: "Update an existing task" },
      { name: "automation:delete-task", params: "taskId: string", returns: "void", description: "Delete a task" },
      { name: "automation:toggle-task", params: "taskId: string", returns: "Task", description: "Enable or disable a task" },
      { name: "automation:run-task", params: "taskId: string", returns: "TaskResult", description: "Execute a task immediately" },
      { name: "automation:get-logs", params: "date?: string", returns: "LogEntry[]", description: "Get task execution logs" },
      { name: "automation:get-results", params: "taskId: string", returns: "TaskResult[]", description: "Get results from task executions" }
    ]
  },
  {
    id: "sync",
    name: "Mobile Sync",
    icon: Smartphone,
    color: "from-indigo-500/20 to-violet-500/20",
    borderColor: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    source: "src/lib/WiFiSyncService.ts, src/lib/P2PFileSyncService.ts",
    handlers: [
      { name: "get-wifi-sync-uri", returns: "string", description: "Get the WiFi Sync WebSocket URI" },
      { name: "get-wifi-sync-qr", params: "cloudMode?: boolean", returns: "string (base64)", description: "Generate QR code for mobile pairing" },
      { name: "generate-high-risk-qr", params: "actionId: string", returns: "string", description: "Generate QR for high-risk approval" },
      { name: "get-wifi-sync-info", returns: "SyncInfo", description: "Get current sync connection status" },
      { name: "sync-clipboard", params: "text: string", returns: "void", description: "Sync clipboard content to mobile" },
      { name: "sync-history", params: "history: HistoryEntry[]", returns: "void", description: "Sync browsing history to mobile" },
      { name: "send-desktop-control", params: "targetDeviceId: string, action: string, args: any", returns: "ControlResult", description: "Send control command to mobile" }
    ]
  },
  {
    id: "security",
    name: "Security & Auth",
    icon: Shield,
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
    source: "src/lib/Security.ts, src/core/vault-handlers.js",
    handlers: [
      { name: "security-settings-get", returns: "SecuritySettings", description: "Get current security settings" },
      { name: "security-settings-update", params: "settings: Partial<SecuritySettings>", returns: "SecuritySettings", description: "Update security settings" },
      { name: "network-security-get", returns: "NetworkSecurity", description: "Get network security configuration" },
      { name: "network-security-update", params: "updates: Partial<NetworkSecurity>", returns: "NetworkSecurity", description: "Update network security" },
      { name: "vault-list-entries", returns: "VaultEntry[]", description: "List all password vault entries" },
      { name: "vault-save-entry", params: "payload: VaultEntryPayload", returns: "VaultEntry", description: "Save a vault entry" },
      { name: "vault-read-secret", params: "entryId: string", returns: "string", description: "Read a secret (requires confirmation)" },
      { name: "get-passwords-for-site", params: "domain: string", returns: "PasswordEntry[]", description: "Get saved passwords for a domain" }
    ]
  },
  {
    id: "ai",
    name: "AI & LLM",
    icon: Cpu,
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    source: "src/lib/AICommandParser.ts, src/lib/BrowserAI.ts",
    handlers: [
      { name: "llm-get-available-providers", returns: "LLMProvider[]", description: "Get all configured LLM providers" },
      { name: "llm-get-provider-models", params: "providerId: string, options?: { forceRefresh?: boolean }", returns: "ProviderModelCatalog", description: "Fetch the official live model catalog for a provider" },
      { name: "llm-set-active-provider", params: "providerId: string", returns: "void", description: "Set the active LLM provider" },
      { name: "llm-configure-provider", params: "providerId: string, options: ProviderOptions", returns: "void", description: "Configure an LLM provider" },
      { name: "llm-generate-chat-content", params: "messages: Message[], options?: GenerateOptions", returns: "string | Stream", description: "Generate AI response" },
      { name: "get-stored-api-keys", returns: "ApiKeyInfo[]", description: "Get stored API keys (masked)" },
      { name: "ollama-list-models", returns: "OllamaModel[]", description: "List available Ollama models" },
      { name: "ollama-import-model", params: "{ modelName, filePath }", returns: "OllamaModel", description: "Import a GGUF model to Ollama" },
      { name: "apple-intelligence-status", returns: "AppleIntelligenceStatus", description: "Check Apple Intelligence runtime readiness and unsupported reasons on macOS" },
      { name: "apple-intelligence-summary", params: "text: string", returns: "AppleSummaryResult", description: "Generate a local summary through Foundation Models when available" },
      { name: "apple-intelligence-generate-image", params: "{ prompt, outputPath?, style? }", returns: "AppleImageResult", description: "Generate a local image through Image Playground (macOS 15.1+). Returns imagePath, not base64" },
      { name: "apple-intelligence-genmoji", params: "{ prompt }", returns: "AppleGenmojiResult", description: "Generate a custom emoji from a description (macOS 15.4+). Returns genmojiPath, not base64" },
      { name: "get-ai-memory", returns: "MemoryData", description: "Get AI conversation memory" },
      { name: "save-vector-store", params: "data: VectorData", returns: "void", description: "Save vector store for RAG" }
    ]
  },
  {
    id: "system",
    name: "System & Storage",
    icon: Server,
    color: "from-gray-500/20 to-slate-500/20",
    borderColor: "border-gray-500/30",
    iconColor: "text-gray-400",
    source: "main.js, src/core/ipc-handlers.js",
    handlers: [
      { name: "get-app-version", returns: "string", description: "Get the application version" },
      { name: "get-platform", returns: "string", description: "Get the platform (win32, darwin, linux)" },
      { name: "save-persistent-data", params: "{ key: string, data: any }", returns: "boolean", description: "Save data to persistent storage" },
      { name: "load-persistent-data", params: "key: string", returns: "any", description: "Load data from persistent storage" },
      { name: "delete-persistent-data", params: "key: string", returns: "boolean", description: "Delete data from persistent storage" },
      { name: "select-local-file", params: "options?: FileOptions", returns: "string (path)", description: "Open file picker dialog" },
      { name: "scan-folder", params: "folderPath: string, types?: string[]", returns: "FileInfo[]", description: "Scan folder for files" },
      { name: "read-file-buffer", params: "filePath: string", returns: "ArrayBuffer", description: "Read file as binary buffer" },
      { name: "trigger-download", params: "url: string, suggestedFilename?: string", returns: "void", description: "Trigger a file download" }
    ]
  }
];

const dataModels = [
  {
    name: "Task",
    description: "Represents a scheduled automation task",
    fields: [
      { name: "id", type: "string", description: "Unique identifier" },
      { name: "name", type: "string", description: "Human-readable task name" },
      { name: "type", type: "TaskType", description: "pdf | scrape | prompt | workflow" },
      { name: "trigger", type: "Trigger", description: "Scheduling configuration" },
      { name: "config", type: "TaskConfig", description: "Task-specific configuration" },
      { name: "enabled", type: "boolean", description: "Whether the task is active" },
      { name: "priority", type: "Priority", description: "high | normal | low" },
      { name: "model", type: "string", description: "AI model to use" },
      { name: "outputDir", type: "string", description: "Output directory path" },
      { name: "notifyOnComplete", type: "boolean", description: "Send notification on completion" },
      { name: "lastRun", type: "Date?", description: "Last execution time" },
      { name: "nextRun", type: "Date?", description: "Next scheduled execution" },
      { name: "runCount", type: "number", description: "Total execution count" },
      { name: "lastStatus", type: "string?", description: "success | failed | running" },
      { name: "lastError", type: "string?", description: "Last error message" }
    ]
  },
  {
    name: "Trigger",
    description: "Defines when a task should execute",
    fields: [
      { name: "type", type: "TriggerType", description: "cron | once | interval" },
      { name: "schedule", type: "string?", description: "Cron expression (for type=cron)" },
      { name: "datetime", type: "string?", description: "ISO datetime (for type=once)" },
      { name: "intervalMs", type: "number?", description: "Interval in milliseconds (for type=interval)" },
      { name: "timezone", type: "string?", description: "Timezone (default: UTC)" }
    ]
  },
  {
    name: "TaskConfig",
    description: "Configuration for different task types",
    fields: [
      { name: "prompt", type: "string?", description: "AI prompt to execute" },
      { name: "pdfOptions", type: "PDFOptions?", description: "PDF generation options" },
      { name: "scrapeUrls", type: "string[]?", description: "URLs to scrape" },
      { name: "workflowSteps", type: "WorkflowStep[]?", description: "Multi-step workflow definition" },
      { name: "emailRecipients", type: "string[]?", description: "Email addresses to notify" }
    ]
  },
  {
    name: "ShellResult",
    description: "Result of a shell command execution",
    fields: [
      { name: "success", type: "boolean", description: "Whether the command succeeded" },
      { name: "stdout", type: "string", description: "Standard output" },
      { name: "stderr", type: "string", description: "Standard error" },
      { name: "exitCode", type: "number", description: "Process exit code" },
      { name: "duration", type: "number", description: "Execution time in ms" }
    ]
  },
  {
    name: "AppleIntelligenceStatus",
    description: "Runtime availability and readiness information for Apple Intelligence on macOS",
    fields: [
      { name: "success", type: "boolean", description: "Whether the status check completed successfully" },
      { name: "osVersion", type: "string?", description: "Detected macOS runtime version string" },
      { name: "summaryAvailable", type: "boolean?", description: "Whether Foundation Models summary generation passed readiness checks" },
      { name: "summaryReason", type: "string?", description: "Why summaries are unavailable or blocked" },
      { name: "imageAvailable", type: "boolean?", description: "Whether Apple image generation is available right now" },
      { name: "imageReason", type: "string?", description: "Why Apple image generation is unavailable" },
      { name: "genmojiAvailable", type: "boolean?", description: "Whether Genmoji is available right now (macOS 15.4+)" },
      { name: "genmojiReason", type: "string?", description: "Why Genmoji is unavailable" }
    ]
  }
];

// Every example below calls window.electronAPI, the only bridge preload.js
// exposes. Earlier versions of these examples named a global that no preload
// creates, so each one threw before doing anything. Channels that map to no
// preload method were removed rather than renamed.
const codeExamples = {
  basicTask: `// Create a scheduled task.
const task = await window.electronAPI.scheduleTask({
  name: 'Daily Sales Report',
  type: 'pdf',
  trigger: {
    type: 'cron',
    schedule: '0 8 * * *',  // five fields: min hour dom mon dow
    timezone: 'America/New_York'
  },
  config: {
    prompt: 'Generate a daily sales report based on the CRM data'
  },
  notifyOnComplete: true
});`,

  shellExecution: `// Request a shell command. You do not get to assert that it runs.
//
// The handler routes through the capability controller first. An action that
// is not pre-authorised comes back as a ticket rather than as output:
//   { success: false, error: 'Approval required',
//     needsApproval: true, ticketId, metadata }
const result = await window.electronAPI.executeShellCommand({
  rawCommand: 'ls -la ~/Documents',
  reason: 'User requested directory listing'
});

if (result.needsApproval) {
  // Show the ticket to the human. Do not approve it on their behalf.
  showApprovalDialog(result.ticketId, result.metadata);
} else if (result.success) {
  console.log('Output:', result.stdout);
} else {
  console.error('Error:', result.stderr);
}

// There is no preApproved flag documented here on purpose: it is an internal
// field, and a flag a caller can set to skip human approval is a flag that
// would eventually be set by something other than a human.`,

  browserControl: `// Capture the active view
const screenshot = await window.electronAPI.captureBrowserViewScreenshot();

// Find visible text and click it
const clicked = await window.electronAPI.findAndClickText('Submit Form');

// Native-first OCR capture
const ocr = await window.electronAPI.ocrCaptureWords();
console.log('OCR provider:', ocr.provider);

// Resolve and click a desktop target outside the app
const crossApp = await window.electronAPI.ocrClick('Run', true);
console.log(crossApp);

// Navigate. This one is send(), not invoke(), so it does not resolve.
window.electronAPI.navigateTo('https://example.com');

// Get all open tabs
const tabs = await window.electronAPI.getOpenTabs();
console.log(\`Open tabs: \${tabs.length}\`);`,

  mobileSync: `// Get WiFi sync info
const syncInfo = await window.electronAPI.getWifiSyncInfo();
console.log('Connected:', syncInfo.connected);
console.log('Mobile:', syncInfo.mobileDevice);

// Generate QR for pairing
const qrData = await window.electronAPI.getWifiSyncQr();
document.getElementById('qr').src = \`data:image/png;base64,\${qrData}\`;`,

  aiGeneration: `// Generate content with AI
const response = await window.electronAPI.generateChatContent([
  { role: 'user', content: 'Summarize the top 5 tech news from today' }
], {
  model: 'gemini-2.0-flash',
  temperature: 0.7,
  maxTokens: 1000
});

// Fetch the latest official provider catalog
const openAIModels = await window.electronAPI.getProviderModels('openai', {
  forceRefresh: true
});
console.log('Recommended OpenAI model:', openAIModels.recommended?.id);

// Preflight Apple Intelligence before using it on macOS. Each command has its
// own OS floor, and each reports its own reason when unavailable.
const appleStatus = await window.electronAPI.getAppleIntelligenceStatus();

if (appleStatus.summaryAvailable) {          // macOS 26.0+
  const summary = await window.electronAPI.summarizeWithAppleIntelligence(
    'Summarize the active page for me.'
  );
  console.log(summary.summary);                // the field is .summary
}

if (appleStatus.imageAvailable) {             // macOS 15.1+
  const image = await window.electronAPI.generateAppleIntelligenceImage({
    prompt: 'A cinematic comet over a desktop browser'
  });
  console.log(image.imagePath);                // a path, not base64
}

if (appleStatus.genmojiAvailable) {           // macOS 15.4+
  const emoji = await window.electronAPI.generateGenmoji({
    prompt: 'a robot chef'
  });
  console.log(emoji.genmojiPath);
}`
};

export default function APIReferencePage() {
  const [activeCategory, setActiveCategory] = useState("browser");
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const [codeTab, setCodeTab] = useState<"task" | "shell" | "browser" | "sync" | "ai">("task");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(id);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const activeCat = ipcCategories.find(c => c.id === activeCategory);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Code2 size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            API Reference
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Developer <span className="text-white/20">API</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          IPC handler reference for Aartiq. Main process handlers in main.js, src/main/handlers/, preload.js
        </p>
      </motion.section>

      {/* IPC Handlers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Inter-Process Communication
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            IPC <span className="text-white/20">Handlers</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            The bridge is <code className="rounded bg-white/5 px-2 py-1 text-sky-400">window.electronAPI</code>,
            the single global <code className="rounded bg-white/5 px-2 py-1">contextBridge</code> exposes in{" "}
            <code className="rounded bg-white/5 px-2 py-1 text-sky-400">preload.js</code>. Each channel is
            reached through a named method on it, not through a generic invoke.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/35">
            Correction: an earlier version of this page stated a{" "}
            <code className="rounded bg-white/5 px-2 py-1">window.electron</code> global. No preload
            creates it, so every example written against it threw a TypeError on its first line. The
            examples above were rewritten against methods verified to exist.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {ipcCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Handler List */}
        {activeCat && (
          <div className={`rounded-[2rem] border ${activeCat.borderColor} bg-gradient-to-br ${activeCat.color} p-8`}>
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 ${activeCat.iconColor}`}>
                  <activeCat.icon size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-wider">{activeCat.name}</h3>
                  <p className="text-sm text-white/50">{activeCat.handlers.length} handlers</p>
                </div>
              </div>
              {activeCat.source && (
                <code className="rounded bg-white/5 px-3 py-1.5 text-xs font-mono text-white/40">
                  Source: {activeCat.source}
                </code>
              )}
            </div>

            <div className="space-y-3">
              {activeCat.handlers.map((handler) => (
                <div
                  key={handler.name}
                  className="rounded-xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <code className="rounded bg-sky-500/20 px-3 py-1.5 font-mono text-sm text-sky-400">
                        {handler.name}
                      </code>
                      {handler.params && (
                        <span className="text-xs text-white/40">({handler.params})</span>
                      )}
                    </div>
                    <span className="rounded bg-white/5 px-3 py-1 text-[10px] font-black uppercase text-white/40">
                      → {handler.returns}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">{handler.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Data Models */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Type Definitions
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Data <span className="text-white/20">Models</span>
          </h2>
        </div>

        <div className="space-y-6">
          {dataModels.map((model) => (
            <div key={model.name} className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-wider">{model.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{model.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(`interface ${model.name} {\n${model.fields.map(f => `  ${f.name}: ${f.type};`).join('\n')}\n}`, `model-${model.name}`)}
                  className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {showCopied === `model-${model.name}` ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 text-left text-xs font-black uppercase tracking-wider text-white/40">Field</th>
                      <th className="py-3 text-left text-xs font-black uppercase tracking-wider text-white/40">Type</th>
                      <th className="py-3 text-left text-xs font-black uppercase tracking-wider text-white/40">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.fields.map((field) => (
                      <tr key={field.name} className="border-b border-white/5">
                        <td className="py-3 font-mono text-sm text-sky-400">{field.name}</td>
                        <td className="py-3">
                          <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/60">{field.type}</code>
                        </td>
                        <td className="py-3 text-sm text-white/50">{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Code Examples */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Usage Examples
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Code <span className="text-white/20">Snippets</span>
          </h2>
        </div>

        {/* Code Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {([
            { id: "task", label: "Task Creation", icon: Zap },
            { id: "shell", label: "Shell Execution", icon: Terminal },
            { id: "browser", label: "Browser Control", icon: Globe },
            { id: "sync", label: "Mobile Sync", icon: Smartphone },
            { id: "ai", label: "AI Generation", icon: Cpu }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCodeTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                codeTab === tab.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Blocks */}
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-wider">
              {codeExamples[codeTab as keyof typeof codeExamples] && 
                Object.keys(codeExamples).find(k => k === codeTab)}
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

      {/* Best Practices */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Guidelines
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Error <span className="text-white/20">Handling</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-10">
            <CheckCircle2 size={40} className="mb-6 text-emerald-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Best Practices</h3>
            <ul className="space-y-4">
              {[
                "Always check the return value for success/error properties",
                "Wrap IPC calls in try-catch for network failures",
                "Use the status code to determine error type",
                "Implement retry logic for transient failures",
                "Log errors for debugging but don't expose to users"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-500/10 to-rose-500/10 p-10">
            <Shield size={40} className="mb-6 text-red-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Security Notes</h3>
            <ul className="space-y-4">
              {[
                "Shell commands require risk level and reason",
                "High-risk actions need mobile approval via QR",
                "Never expose raw command strings to users",
                "Validate all inputs before passing to IPC",
                "Rate limit sensitive operations"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <Shield size={16} className="mt-0.5 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}