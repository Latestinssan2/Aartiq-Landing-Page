"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
  Bot,
  Database,
  Lock,
  ShieldCheck,
  Fingerprint,
  QrCode,
  ListTree,
  Command,
  Boxes,
  Apple,
  Search,
  FileText,
  Settings2,
  Cpu,
  History,
  ShieldAlert,
  Layers,
  FileDown,
  Image as ImageIcon,
  Blocks,
  Globe,
  Scale,
} from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { net } from "@/data/facts";

/**
 * Every claim below is tied to a source file and line in the Aartiq browser
 * repo (aartiq-browser/src/...). No claim is marketing; if a behaviour is
 * limited or default-off, that is stated next to it.
 */

type Ref = string;

interface Feature {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  refs: Ref[];
}

const groups: { category: string; id: string; intro: string; items: Feature[] }[] = [
  {
    category: "Permission Management & Human-in-the-Loop",
    id: "permissions",
    intro:
      "Aartiq gates every side-effecting action through a risk-tiered permission store, a capability controller with single-use tickets, an OS-native approval dialog (Touch ID / Windows Hello), and an optional QR + PIN mobile approval for high-risk commands. The defaults are deny-by-default and fail-closed.",
    items: [
      {
        name: "Risk-tiered shell gating",
        description:
          "checkShellPermission() classifies commands as low / medium / high / critical. critical is always denied at the gate; high/medium/low are denied unless a matching PermissionStore grant exists. With no PermissionStore configured the command is denied (fail-closed).",
        icon: ShieldAlert,
        color: "from-rose-500 to-pink-400",
        refs: ["src/core/command-validator.js:77-133", "src/core/command-validator.js:87-89"],
      },
      {
        name: "Customizable approval policy",
        description:
          "Per-command and per-action allowlists (autoApprovedCommands / autoApprovedActions), plus toggles autoApproveLowRisk / autoApproveMidRisk (both default false). High-risk actions are never globally auto-run. Users manage this in the Permission Settings UI and the Directory Allowlist editor.",
        icon: Settings2,
        color: "from-slate-500 to-slate-400",
        refs: [
          "src/lib/permission-store.js:24-33",
          "src/components/PermissionSettings.tsx:476-512",
          "src/components/PermissionSettings.tsx:889-1029",
        ],
      },
      {
        name: "Directory allowlist",
        description:
          "File access is restricted to an allowlist where each entry has an access level (read vs read-write) and a recursive flag. Paths are canonicalized with fs.realpathSync before checking, so symlink traversal is blocked. An empty allowlist denies everything.",
        icon: Lock,
        color: "from-purple-500 to-violet-400",
        refs: ["src/core/directory-allowlist.js:60-134", "src/lib/permission-store.js:8-16"],
      },
      {
        name: "Capability-scoped execution",
        description:
          "Each action is registered with an approval tier (never / first-time-per-session / always). 'always' cannot be overridden by the permission store. Approvals use single-use tickets bound to the exact input hash, with a 5-minute TTL and timingSafeEqual integrity checks.",
        icon: Layers,
        color: "from-sky-500 to-indigo-500",
        refs: [
          "src/core/capability-controller.js:29-100",
          "src/core/approval-ticket-manager.js:139-278",
          "src/lib/approval-gate.js:53-147",
        ],
      },
      {
        name: "QR + PIN mobile approval",
        description:
          "High-risk commands generate a 6-digit PIN (100000 + rand%900000) and a per-request token encoded into a aartiq://approve deep link rendered as a QR. The paired mobile app returns the PIN; the desktop only enables Approve when both mobileApproved and pinVerified are true. The QR is single-use.",
        icon: QrCode,
        color: "from-emerald-500 to-teal-400",
        refs: [
          "src/main/handlers/sync-handlers.js:40-48",
          "src/main/handlers/utils.js:377-387",
          "src/components/ai/ClickPermissionModal.tsx:247-302",
        ],
      },
      {
        name: "Biometric approval (Touch ID / Windows Hello)",
        description:
          "Native approval dialogs: macOS shows 'Approve with Touch ID', Windows runs a PowerShell dialog, Linux a bash dialog. Biometric is gated by requireBiometricPerSession (default true) and requireBiometricEveryTime (default false). macOS Touch ID is also invoked directly from the native Swift panels via LAContext.",
        icon: Fingerprint,
        color: "from-amber-500 to-orange-400",
        refs: [
          "src/main/handlers/native-approval-manager.js:22-98",
          "src/components/ai/useAIActionSecurityManager.tsx:120-153",
          "src/lib/native-panels/ViewModel.swift:255-275",
        ],
      },
    ],
  },
  {
    category: "Cross-Session Memory & Preference Learning",
    id: "memory",
    intro:
      "Aartiq can remember past conversations (RAG vector store on disk) and learn user preferences from chat. Both are OFF by default and can be disabled. There are two storage layers: an IPC/persisted layer (authoritative) and a legacy localStorage layer used by some sidebar widgets.",
    items: [
      {
        name: "Cross-session RAG memory",
        description:
          "Conversations, page content, web-search results, OCR and SecureDOM reads are embedded and stored in vector-store.json under Electron userData, reloaded on startup, and injected as a [RAG MEMORY] block into each chat. Gated by enableCrossSessionMemory (default false).",
        icon: Database,
        color: "from-indigo-500 to-blue-400",
        refs: [
          "src/main/handlers/memory-handlers.js:25-41",
          "src/lib/BrowserAI.ts:103-149",
          "src/store/useAppStore.ts:179,913",
        ],
      },
      {
        name: "Preference learning",
        description:
          "When enabled, the model can emit SAVE_PREFERENCE:key:value in its reply; Aartiq parses it and stores it in userData/ai-user-preferences.json. Learned preferences are re-injected into the system prompt. Default off. Examples from the prompt: response_style:concise, language:simple_english.",
        icon: Bot,
        color: "from-purple-500 to-pink-400",
        refs: [
          "src/store/useAppStore.ts:177,911",
          "src/components/ai/AIConstants.ts:408-410",
          "src/components/AIChatSidebar.tsx:1911-1923",
          "src/main/handlers/ai-handlers.js:186-212",
        ],
      },
      {
        name: "Memory management UI",
        description:
          "AiMemoryManagerSection lets you edit/delete individual learned preferences and clear the vector memory. The sidebar MemoryWidget adds search over stored preferences and a clear-data action. PrivacyControls exposes Disable Memory and Disable Preference Learning toggles.",
        icon: Settings2,
        color: "from-sky-500 to-cyan-400",
        refs: [
          "src/components/ai/AiMemoryManagerSection.tsx:38-203",
          "src/components/sidebar/widgets/MemoryWidget.tsx:54-197",
          "src/components/sidebar/PrivacyControls.tsx:37-63",
        ],
      },
      {
        name: "Session resume",
        description:
          "SessionResumeWidget reads browser history (last 3) and stored automation runs to offer 'Pick up where you left off' and 'Restore automations' cards that re-launch an AI task. It uses history + automation-run history, not the vector store directly.",
        icon: History,
        color: "from-teal-500 to-emerald-400",
        refs: [
          "src/components/sidebar/widgets/home/SessionResumeWidget.tsx:15-70",
          "src/lib/homeIntelligence.ts:340-374",
        ],
      },
    ],
  },
  {
    category: "Action Chain & Approval UI",
    id: "action-chain",
    intro:
      "AI tasks are executed one command at a time, with a live action chain and a pre-execution plan that shows risk levels and asks the user to Approve / Deny / Modify.",
    items: [
      {
        name: "Live action chain timeline",
        description:
          "ActionChainTimeline renders steps with status pending / running / done / error / skipped, a completed/total badge, and per-step timestamps. SessionTimelineWidget mirrors this live in the sidebar with a progress bar.",
        icon: ListTree,
        color: "from-blue-500 to-cyan-400",
        refs: [
          "src/components/ai/ActionChainTimeline.tsx:7-15,97-286",
          "src/components/sidebar/widgets/SessionTimelineWidget.tsx:49-95",
        ],
      },
      {
        name: "Pre-execution plan + risk verdict",
        description:
          "AutomationPlanApproval shows the full plan before running: each operation with its risk (low/medium/high/critical), a policy verdict (allow / requires approval / denied by policy), directories and URLs accessed, and Approve / Deny / Modify buttons. critical operations are blocked by policy.",
        icon: ShieldCheck,
        color: "from-emerald-500 to-teal-400",
        refs: [
          "src/components/AutomationPlanApproval.tsx:11-47",
          "src/components/AutomationPlanApproval.tsx:180-404",
        ],
      },
      {
        name: "Step-by-step queue with per-step approval",
        description:
          "AIChatSidebar.processNextCommand runs the queue one command at a time, marking each awaiting_permission before a human approves. Critical-risk commands are auto-failed. Risk drives the label: high = Touch ID + approval, medium = approval required, low = automatic.",
        icon: Command,
        color: "from-amber-500 to-orange-400",
        refs: [
          "src/components/AIChatSidebar.tsx:2170-2204,5884",
          "src/components/AICommandQueue.tsx:27,184,233-237",
        ],
      },
      {
        name: "Approval waiting + guardrails",
        description:
          "ApprovalWaiter blocks execution until the human approves or a 5-minute timeout fires. Guardrails prompt-injection detection fails closed (quarantine), and the SecurityPipeline returns requiresApproval before any side-effecting action. ApprovalGate binds approval to the input hash (one-time, unexpired).",
        icon: ShieldAlert,
        color: "from-rose-500 to-pink-400",
        refs: [
          "src/lib/approval-waiter.ts:1-108",
          "src/lib/guardrails/prompt-injection.ts:18-316",
          "src/lib/guardrails/index.ts:95-146",
        ],
      },
    ],
  },
  {
    category: "AI Command System",
    id: "ai-commands",
    intro:
      "AI output is parsed into structured commands. The parser is JSON-first, then HTML-comment, then bracket tags. There is no RUN_SHELL verb; the shell command is SHELL_COMMAND and is rated HIGH risk and never auto-executes.",
    items: [
      {
        name: "JSON-first command parser",
        description:
          "AICommandParser tries JSON (```json blocks and bare {commands:[...]}), then <!-- AI_COMMANDS_START -->...<!-- AI_COMMANDS_END -->, then [TYPE]:value bracket tags. Duplicate-free and masked inside code/inline/<think:6124c78e> blocks. See /docs/ai-commands for the full verb list.",
        icon: Command,
        color: "from-sky-500 to-indigo-500",
        refs: [
          "src/lib/AICommandParser.ts:374-513",
          "src/lib/AICommandParser.ts:62-138",
        ],
      },
      {
        name: "Canonical verbs",
        description:
          "NAVIGATE, SHELL_COMMAND, CLICK_ELEMENT, FIND_AND_CLICK, FILL_FORM, MULTI_FILL_FORM, CLICK_AT, SCROLL_TO, SEARCH/WEB_SEARCH, READ_PAGE_CONTENT, OCR_SCREEN, LIST_OPEN_TABS, CREATE_FILE_JSON/GENERATE_PDF, OPEN_APP, SCHEDULE_TASK, RECORD_WORKFLOW/PLAY_WORKFLOW, PLUGIN_COMMAND, and SETTINGS_*/BOOKMARKS_*/HISTORY_*/SKILLS_* commands.",
        icon: ListTree,
        color: "from-violet-500 to-purple-400",
        refs: ["src/lib/AICommandParser.ts:62-135"],
      },
      {
        name: "Shell validation + sandbox",
        description:
          "A parsed SHELL_COMMAND value is validated by SecurityValidator (destructive-pattern / blocked-list), risk-classified by ai-action-security (HIGH, never auto-execute), gated by checkShellPermission, then run inside the fail-closed OS sandbox.",
        icon: ShieldAlert,
        color: "from-rose-500 to-red-400",
        refs: [
          "src/lib/SecurityValidator.js:2,164-178,316-346",
          "src/lib/ai-action-security.ts:520-544",
          "src/main/handlers/utils.js:111-118,244-264",
        ],
      },
      {
        name: "Recorded workflow replay",
        description:
          "RECORD_WORKFLOW / PLAY_WORKFLOW replay recorded DOM actions via action-replay: 3 retries with backoff and element re-matching (exact / similar / fuzzy) across page-state changes. This is separate from the live AI command queue.",
        icon: History,
        color: "from-teal-500 to-emerald-400",
        refs: ["src/lib/action-replay.ts:7-133,202-227"],
      },
    ],
  },
  {
    category: "Aartiq Skills",
    id: "skills",
    intro:
      "Skills are two things: (1) Markdown prompt files in public/skills/*.md loaded on demand, and (2) a capability catalog (SkillRegistry) that matches the user's message to relevant skills so the system prompt is not bloated. See /docs/skills for the full list and the agent API.",
    items: [
      {
        name: "Markdown prompt skills",
        description:
          "SkillLoader is a singleton that reads public/skills/<name>.md (built-in + userData override), strips YAML-ish frontmatter and 'Aartiq runtime note' blocks, and caches. Built-ins include research, analysis, finance, documents, browsing, automation, mcp, apple-intelligence, tab-intelligence, image-generation, scheduling, security, settings, xlsx, pptx, pdf, docx.",
        icon: Boxes,
        color: "from-indigo-500 to-blue-400",
        refs: ["src/lib/SkillLoader.ts:9-140", "src/lib/SkillRegistry.ts:15-29"],
      },
      {
        name: "On-demand skill matching",
        description:
          "SkillRegistry.matchSkills tests each skill's regex patterns against the message and always injects 'security' for credential terms and 'automation' for shell terms. listAllSkills / getSkillSummary drive the UI chip list shown by CollapsibleSkillMessage.",
        icon: Search,
        color: "from-sky-500 to-cyan-400",
        refs: [
          "src/lib/SkillRegistry.ts:1-64",
          "src/components/ai/CollapsibleSkillMessage.tsx:4-68",
        ],
      },
      {
        name: "Agent API (MCP + HTTP tools)",
        description:
          `The agent API exposes a ToolRegistry over MCP (stdio) and HTTP (POST /api/<method>). Every call runs a fail-closed pipeline: verb gate -> tab lock -> handler -> untrusted-output injection scan. 36 tools across 11 categories. Providers are model-agnostic (LM Studio / Ollama / OpenClaw), bound to ${net.agentApi.defaultBindAddress} by default with defaultTrust 'limited'.`,
        icon: Cpu,
        color: "from-emerald-500 to-teal-400",
        refs: [
          "src/lib/agent-api/registry.ts:1-89",
          "src/lib/agent-api/server.ts:1-126",
          "src/lib/agent-api/providers.ts:19-80",
        ],
      },
      {
        name: "Read the page you are already on",
        description:
          "page_find searches one open page with no network request and no other tab touched, matching accessible names, values, hrefs and roles to return refs that click_ref / fill_ref accept, or scanning rendered prose for context snippets. A search sends the user's query to a third party and returns somebody else's page; when the answer is on screen, that is the wrong trade.",
        icon: Search,
        color: "from-cyan-500 to-sky-400",
        refs: [
          "src/lib/agent-api/tools.ts:143-199",
          "tests/agent-api-bridge-tools.test.js",
        ],
      },
      {
        name: "Filling a form is not submitting one",
        description:
          "fill_form (verb 'input') fills and never submits; form_submit (verb 'sideEffecting') goes through the approval gate. Two tools rather than one tool with a submit flag, so the side effect cannot be reached by passing a parameter. Refs bind to a data-aartiq-ax stamp on actionable nodes, so a stale ref fails loudly instead of addressing a different element after the page shifts.",
        icon: ShieldCheck,
        color: "from-amber-500 to-orange-400",
        refs: [
          "src/lib/agent-api/tools.ts:267-320",
          "tests/page-scripts-forms.test.js",
          "tests/snapshot-ref-binding.test.js",
        ],
      },
      {
        name: "Search that admits where it got the result",
        description:
          "Tavily is the recommended single key (1,000 free credits/month, no card); SerpAPI and Brave also work. With no key, search still runs by scraping a search engine's HTML — rate-limited, slower, fragile, and with no publication dates — and says so rather than presenting it as equivalent. search_providers reports which provider is live, whether it scrapes, and whether it has a news index. news_search returns real dates; web_search does not.",
        icon: Globe,
        color: "from-violet-500 to-purple-400",
        refs: [
          "src/lib/web-search-service.js:162-192",
          "src/lib/agent-api/tools.ts:200-266",
          "tests/web-search-service.test.js",
        ],
      },
      {
        name: "Research that checks whether sources agree",
        description:
          "A bounded plan -> search -> fetch -> extract -> cross-verify -> rank -> generate job, with dependencies injected so it tests without network access. Claims are keyed on subject|verb so '450 million dollars' and '450 million euros' stay one claim with two conflicting figures. Corroboration needs >=2 distinct domains re-derived from each claim's URL, so subdomains cannot fake independence. A last source is named only when timestamps are reliable; otherwise it reports unknown with the reason attached. Known limit: only numeric claims with a named subject are extracted, so the coverage percentage is numeric agreement specifically and disputed qualitative findings never reach the panel.",
        icon: Scale,
        color: "from-rose-500 to-pink-400",
        refs: [
          "src/lib/research-pipeline.ts:474-678",
          "src/lib/researchState.ts:153-201",
          "tests/research-pipeline.test.js",
          "tests/research-progress-plumbing.test.js",
        ],
      },
    ],
  },
  {
    category: "Native macOS Panels & Apple Integration",
    id: "native",
    intro:
      "On macOS, Aartiq can render detached native SwiftUI panels (compiled from src/lib/native-panels/*.swift) instead of the Electron UI, communicating over the same /native-mac-ui HTTP bridge. These run only on macOS and only when the relevant *Mode preference is 'swiftui'.",
    items: [
      {
        name: "Native SwiftUI AI sidebar",
        description:
          "SidebarPanelView is a native SwiftUI chat surface (its own message bubbles + prompt composer + session chips) that can replace the Electron sidebar when sidebarMode === 'swiftui'. The Swift files are compiled by swiftc and spawned as a detached binary from the main process.",
        icon: Apple,
        color: "from-slate-400 to-slate-200",
        refs: [
          "src/lib/native-panels/SidebarView.swift:3-238",
          "src/lib/macos-native-panels.js:7-196",
          "src/main.js:1184,2092-2093",
        ],
      },
      {
        name: "Command Center & settings panels",
        description:
          "CommandCenterPanelView launches any native panel from one place; NativeSettingsPanelView bridges native toggles (sidebar/actionChain/utility/permission mode: swiftui vs electron) to the Electron settings window.",
        icon: Settings2,
        color: "from-zinc-400 to-zinc-200",
        refs: [
          "src/lib/native-panels/CommandCenterView.swift:3-19",
          "src/lib/native-panels/SettingsView.swift:3-218",
        ],
      },
      {
        name: "Apple Intelligence",
        description:
          "AppleIntelligencePanelView uses on-device FoundationModels (LanguageModelSession) for Summary / Analyze / Rewrite / Extract / Writing Tools, Image Playground for image generation, and Genmoji. Summary is gated on the FoundationModels runtime (macOS 15+). A helper binary (Aartiq-AppleIntelligence) exposes the same to the React UI.",
        icon: ImageIcon,
        color: "from-violet-500 to-fuchsia-400",
        refs: [
          "src/lib/native-panels/AppleIntelligencePanelView.swift:3-294,362-402",
          "src/lib/apple-intelligence.swift:253-289",
        ],
      },
      {
        name: "Siri & Shortcuts",
        description:
          "AppIntents.swift (AartiqShortcutsProvider) exposes intents such as 'Ask Aartiq', Search web, Summarize page, Capture screenshot, Open app, Schedule task, Read clipboard, Create document. Shortcuts/Siri drive the live browser over HTTP with an X-Aartiq-Native-Token header. JS bridge: SiriShortcutsIntegration.js.",
        icon: Command,
        color: "from-blue-500 to-indigo-400",
        refs: ["src/lib/native-panels/AppIntents.swift:532-823", "src/lib/SiriShortcutsIntegration.js:132,267"],
      },
    ],
  },
  {
    category: "Built-in Ad Blocker",
    id: "adblocker",
    intro:
      "Aartiq ships a built-in network-level ad + tracker blocker (no extension required). It is OFF by default and only active after a ~5s deferred init; it protects the default session only and uses the prebuilt ads+tracking filter list (no custom-filter UI).",
    items: [
      {
        name: "ElectronBlocker (ads + tracking)",
        description:
          "main.js initializes @ghostery/adblocker-electron via ElectronBlocker.fromPrebuiltAdsAndTracking(fetch) and applies it to session.defaultSession. Toggling enableAdblocker in Settings calls toggle-adblocker; if the blocker isn't initialized yet, the toggle is a no-op.",
        icon: Blocks,
        color: "from-orange-500 to-amber-400",
        refs: [
          "main.js:2694,3688-3692,4011-4027",
          "src/store/useAppStore.ts:311-313,544-551",
          "src/components/SettingsPanel.tsx:668-684",
        ],
      },
    ],
  },
  {
    category: "Session Logs & Export",
    id: "logs",
    intro:
      "Aartiq keeps an audit log of AI actions in five buckets (pdf / action / shell / ocr / dom), persisted to localStorage, and can export them as structured JSON or plain text.",
    items: [
      {
        name: "What the logs contain",
        description:
          "Each entry has timestamp, success, output/error. Shell logs add command + permissionRequired + permissionGranted + executionTime. OCR logs add label + textLength + source. DOM logs add resultsCount + injectionDetected + filter stats (pii/scripts/styles/nav/ads removed). PDF logs add command + filePath.",
        icon: FileText,
        color: "from-cyan-500 to-blue-400",
        refs: ["src/lib/ActionLogsStore.ts:11-65"],
      },
      {
        name: "Export (JSON + text)",
        description:
          "exportAsJSON() emits { type:'AARTIQ_AI_ACTION_LOGS', version:'1.0', summary, logs } with counts per bucket. exportAsText() renders a human-readable list. From the chat UI these are written to disk via export-chat-txt / export-chat-pdf (default file names aartiq-chat-<ts>.txt / .pdf).",
        icon: FileDown,
        color: "from-teal-500 to-emerald-400",
        refs: [
          "src/lib/ActionLogsStore.ts:308-405",
          "src/components/AIChatSidebar.tsx:6051-6054",
          "src/main/handlers/file-handlers.js:428-472",
        ],
      },
    ],
  },
  {
    category: "Web Search & OCR Results (Expandable)",
    id: "results",
    intro:
      "Web search and OCR/screenshot output are rendered through a single expandable component (CollapsibleOCRMessage) so long results don't flood the chat until expanded.",
    items: [
      {
        name: "Collapsible results",
        description:
          "CollapsibleOCRMessage shows a label (e.g. 'Search Results' for WEB_SEARCH_RESULTS, 'SCREENSHOT_ANALYSIS' for OCR) with a truncated 100-char preview when collapsed and a scrollable body (max-h-400px) with clickable URL/file links when expanded. Web search output is stored with ocrLabel 'WEB_SEARCH_RESULTS'.",
        icon: Search,
        color: "from-sky-500 to-cyan-400",
        refs: [
          "src/components/ai/CollapsibleOCRMessage.tsx:17,112-153",
          "src/components/AIChatSidebar.tsx:2850,2893-2895,7223",
        ],
      },
    ],
  },
];

const settingsReference: { group: string; rows: { key: string; def: string; what: string; src: string }[] }[] = [
  {
    group: "AI & Intelligence",
    rows: [
      { key: "enableAIAssist", def: "false", what: "Master switch for the AI assistant", src: "useAppStore.ts:103,417" },
      { key: "aiProvider", def: "'ollama'", what: "Active LLM provider", src: "useAppStore.ts:108,432" },
      { key: "enableAiOverview", def: "false", what: "One-glance summaries on page load", src: "useAppStore.ts:149,441" },
      { key: "askForAiPermission", def: "true", what: "Prompt before AI actions", src: "useAppStore.ts:153,897" },
      { key: "aiSafetyMode", def: "true", what: "AI asks confirmation before critical actions", src: "useAppStore.ts:173,907" },
      { key: "enableAiPreferenceLearning", def: "false", what: "AI learns preferences via SAVE_PREFERENCE", src: "useAppStore.ts:177,911" },
      { key: "enableCrossSessionMemory", def: "false", what: "RAG memory across sessions", src: "useAppStore.ts:179,913" },
      { key: "localLlmMode", def: "'normal'", what: "light | normal | heavy", src: "useAppStore.ts:143,437" },
      { key: "mcpServerPort", def: String(net.mcpBridge.port), what: "Local MCP server port", src: "useAppStore.ts:159,444" },
    ],
  },
  {
    group: "Security & Permissions",
    rows: [
      { key: "autoApproveLowRisk", def: "false", what: "Auto-run low-risk actions", src: "permission-store.js:25" },
      { key: "autoApproveMidRisk", def: "false", what: "Auto-run medium-risk actions", src: "permission-store.js:26" },
      { key: "requireDeviceUnlockForManualApproval", def: "true", what: "OS unlock after manual shell approval", src: "permission-store.js:27" },
      { key: "requireDeviceUnlockForVaultAccess", def: "true", what: "OS unlock before revealing credentials", src: "permission-store.js:28" },
      { key: "requireBiometricPerSession", def: "true", what: "Touch ID / Hello once per session", src: "permission-store.js:29" },
      { key: "requireBiometricEveryTime", def: "false", what: "Biometric for EVERY low-risk action", src: "PermissionSettings.tsx:90" },
      { key: "firewallLevel", def: "'standard'", what: "standard | strict | paranoid", src: "useAppStore.ts:292,501" },
    ],
  },
  {
    group: "Privacy",
    rows: [
      { key: "disableMemory", def: "false", what: "Stop AI remembering conversations", src: "sidebar/types.ts:73" },
      { key: "disablePreferenceLearning", def: "false", what: "Stop AI learning preferences", src: "sidebar/types.ts:74" },
      { key: "disableTabIntelligence", def: "false", what: "Stop AI analyzing open tabs", src: "sidebar/types.ts:75" },
      { key: "disableAnimations", def: "false", what: "Turn off AI status animations/glow", src: "sidebar/types.ts:76" },
    ],
  },
  {
    group: "Appearance & Theme",
    rows: [
      { key: "theme", def: "'system'", what: "system | dark | light | vibrant | custom | minimal", src: "useAppStore.ts:183,457" },
      { key: "customThemePrimary", def: "'#ff6b6b'", what: "Custom theme primary color", src: "useAppStore.ts:184,458" },
      { key: "customThemeSecondary", def: "'#22d3ee'", what: "Custom theme secondary color", src: "useAppStore.ts:185,459" },
      { key: "browserTabLayout", def: "'top'", what: "top | left | right | both", src: "useAppStore.ts:189,460" },
      { key: "browserAccentPreset", def: "'minimal'", what: "minimal | brave | ocean | mint | rose | mono", src: "useAppStore.ts:190,461" },
      { key: "minimalAnimations", def: "true", what: "Animations master toggle (store)", src: "useAppStore.ts:197,464" },
      { key: "themeOpacity", def: "100", what: "Interface opacity (20-100)", src: "useAppStore.ts:330,568" },
      { key: "themeBlur", def: "20", what: "Backdrop blur (0-60)", src: "useAppStore.ts:331,569" },
    ],
  },
  {
    group: "AI Visual (glow) effects",
    rows: [
      { key: "aiVisual.enabled", def: "true", what: "Master switch for AI visual effects", src: "sidebar/types.ts:65" },
      { key: "aiVisual.glowMode", def: "'subtle'", what: "off | subtle | dynamic", src: "sidebar/types.ts:66" },
      { key: "aiVisual.color", def: "'#38bdf8'", what: "Glow color", src: "sidebar/types.ts:67" },
      { key: "aiVisual.intensity", def: "0.5", what: "Glow strength", src: "sidebar/types.ts:68" },
      { key: "aiVisual.animationSpeed", def: "1", what: "Animation speed multiplier", src: "sidebar/types.ts:69" },
    ],
  },
  {
    group: "Browsing & Native UI",
    rows: [
      { key: "enableAdblocker", def: "false", what: "Built-in ads + tracker blocker", src: "useAppStore.ts:312,545" },
      { key: "selectedEngine", def: "'google'", what: "Default search engine", src: "useAppStore.ts:261,527" },
      { key: "selectedLanguage", def: "'en'", what: "UI / content language", src: "useAppStore.ts:296,504" },
      { key: "macNativeSidebarMode", def: "'electron'", what: "electron | swiftui (native Swift sidebar)", src: "useAppStore.ts:222,485" },
      { key: "macNativeActionChainMode", def: "'electron'", what: "electron | swiftui (native action chain)", src: "useAppStore.ts:223,486" },
      { key: "macNativeUtilityPanelMode", def: "'electron'", what: "electron | swiftui (native utility panel)", src: "useAppStore.ts:224,487" },
      { key: "macNativePermissionMode", def: "'electron'", what: "electron | swiftui (native permission UI)", src: "useAppStore.ts:225,488" },
    ],
  },
  {
    group: "Sidebar widgets",
    rows: [
      { key: "enabledWidgets", def: "all 7", what: "current-context, ai-suggestions, workspace-intelligence, session-resume, automation-monitor, memory-insights, ai-timeline", src: "sidebar/types.ts:46-62" },
      { key: "collapsedWidgets", def: "memory-insights, ai-timeline", what: "Widgets collapsed by default", src: "sidebar/types.ts:59" },
      { key: "sidebarMode", def: "'full'", what: "full | compact | hidden", src: "sidebar/types.ts:61" },
    ],
  },
  {
    group: "Performance & Misc",
    rows: [
      { key: "performanceMode", def: "'normal'", what: "normal | performance", src: "useAppStore.ts:49,574" },
      { key: "performanceModeSettings", def: "{5 tabs, 2048MB, audio}", what: "maxActiveTabs / maxRam / keepAudioTabsActive", src: "useAppStore.ts:50-54,575-579" },
      { key: "enableAmbientMusic", def: "false", what: "Background ambient music", src: "useAppStore.ts:252,466" },
      { key: "backendStrategy", def: "'firebase'", what: "firebase | mysql", src: "useAppStore.ts:284,540" },
      { key: "isGuestMode", def: "false", what: "Guest mode (no account)", src: "useAppStore.ts:95,412" },
    ],
  },
];

export default function FeaturesPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  return (
    <div className="min-h-screen bg-[#03040b] text-white font-outfit">
      <Navbar onOpenAuth={() => {}} user={user} />

      <main className="pt-32 pb-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
              <Layers size={14} /> Feature Reference
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter sm:text-7xl leading-none mb-8">
              What Aartiq <br /> <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Actually Does</span>
            </h1>
            <p className="text-lg font-medium text-white/40 leading-relaxed max-w-2xl">
              This page documents Aartiq&apos;s features against the source code. Every section cites the
              file and line it is implemented in. Where a feature is off by default, limited, or platform-specific,
              that is stated explicitly. No marketing language.
            </p>
          </motion.div>
        </section>

        {/* Table of contents */}
        <nav className="mb-24 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">On this page</p>
          <div className="flex flex-wrap gap-3">
            {groups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/50 transition hover:border-sky-500/40 hover:text-sky-400"
              >
                {g.category}
              </a>
            ))}
            <a
              href="#settings"
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/50 transition hover:border-sky-500/40 hover:text-sky-400"
            >
              Settings Reference
            </a>
            <a
              href="#security"
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/50 transition hover:border-sky-500/40 hover:text-sky-400"
            >
              Security Model
            </a>
          </div>
        </nav>

        <div className="space-y-28">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <div className="flex items-center gap-6 mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">{group.category}</h2>
                <div className="h-[1px] w-full bg-white/5" />
              </div>
              <p className="mb-12 max-w-3xl text-base font-medium leading-relaxed text-white/40">{group.intro}</p>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((feature, i) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
                  >
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <feature.icon size={30} className="text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-white">{feature.name}</h3>
                    <p className="text-sm font-medium leading-relaxed text-white/50">{feature.description}</p>
                    <div className="mt-6 space-y-1 border-t border-white/5 pt-4">
                      {feature.refs.map((r) => (
                        <code key={r} className="block text-[11px] font-mono text-sky-400/70">{r}</code>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Settings reference */}
        <section id="settings" className="scroll-mt-28 mt-28">
          <div className="flex items-center gap-6 mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">Settings Reference</h2>
            <div className="h-[1px] w-full bg-white/5" />
          </div>
          <p className="mb-12 max-w-3xl text-base font-medium leading-relaxed text-white/40">
            Every user-facing setting, its default value, what it does, and where it is defined. Defaults are read
            directly from source. &quot;Off by default&quot; flags mean the behaviour only activates once you enable it.
          </p>

          <div className="space-y-12">
            {settingsReference.map((block) => (
              <div key={block.group}>
                <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{block.group}</h3>
                <div className="overflow-hidden rounded-2xl border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-white/40">
                      <tr>
                        <th className="px-5 py-3 font-bold uppercase tracking-wider">Key</th>
                        <th className="px-5 py-3 font-bold uppercase tracking-wider">Default</th>
                        <th className="px-5 py-3 font-bold uppercase tracking-wider">What it does</th>
                        <th className="px-5 py-3 font-bold uppercase tracking-wider">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row.key} className="border-t border-white/5 align-top">
                          <td className="px-5 py-3 font-mono text-xs text-sky-300">{row.key}</td>
                          <td className="px-5 py-3 font-mono text-xs text-white/60">{row.def}</td>
                          <td className="px-5 py-3 text-white/60">{row.what}</td>
                          <td className="px-5 py-3 font-mono text-[11px] text-white/40">{row.src}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security summary */}
        <section id="security" className="scroll-mt-28 mt-28 rounded-[60px] border border-white/5 bg-white/[0.02] p-12 lg:p-20">
          <div className="absolute" />
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Security Model</h2>
          <p className="max-w-2xl text-lg font-medium text-white/50 leading-relaxed mb-10">
            Aartiq uses a six-layer defense-in-depth model: visual sandbox, syntactic firewall, human-in-the-loop,
            directory allowlist, OS-level sandboxing, and capability-scoped execution. The HITL layer (permission
            gating, QR + PIN, biometric, single-use tickets, fail-closed) is documented in detail on the Security page.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Visual Sandbox", "src/lib/Security.ts"],
              ["Syntactic Firewall", "src/lib/SecurityValidator.js"],
              ["Human-in-the-Loop", "src/core/command-validator.js"],
              ["Directory Allowlist", "src/core/directory-allowlist.js"],
              ["OS Sandbox (fail-closed)", "src/core/sandbox-executor.js"],
              ["Capability Scope", "src/core/capability-controller.js"],
            ].map(([name, src]) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="font-bold text-white">{name}</p>
                <code className="text-[11px] font-mono text-sky-400/70">{src}</code>
              </div>
            ))}
          </div>
          <a
            href="/docs/security"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.3em] text-black transition hover:bg-sky-400 hover:text-white"
          >
            Read the Security Model <ShieldCheck size={14} />
          </a>
        </section>

        {/* CTA */}
        <section className="mt-28 rounded-[60px] border border-white/5 bg-white/[0.02] p-12 lg:p-24 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/[0.03] blur-[100px] rounded-full" />
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none sm:text-5xl">Sources are in the code</h2>
          <p className="text-lg font-medium text-white/40 mb-12 max-w-xl mx-auto">
            Every claim on this page links to a file and line in the Aartiq browser repository. Read it yourself.
          </p>
          <a
            href="/downloads"
            className="rounded-full bg-white px-10 py-5 text-xs font-black uppercase tracking-[0.3em] text-black transition hover:bg-sky-400 hover:text-white"
          >
            Download Aartiq
          </a>
        </section>
      </main>
    </div>
  );
}
