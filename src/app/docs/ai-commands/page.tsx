"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { commandCount } from "@/data/facts";
import { 
  Bot, 
  FileText, 
  Terminal, 
  Globe,
  MousePointer,
  Volume2,
  Calendar,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Code2,
  ArrowRight,
  Shield,
  Image,
  Hash,
  Layout,
  Maximize2,
  Smartphone,
  History
} from "lucide-react";

const commandCategories = [
  {
    id: "navigation",
    name: "Navigation",
    icon: Globe,
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    source: "src/lib/browser-navigation-service.js"
  },
  {
    id: "browser",
    name: "Browser Control",
    icon: Globe,
    color: "from-sky-500/20 to-cyan-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
    source: "src/core/window-manager.js, src/components/BrowserViewContainer.tsx"
  },
  {
    id: "pdf",
    name: "PDF & Files",
    icon: FileText,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    source: "src/lib/PDFCommandParser.ts, src/core/pdf-generator.js"
  },
  {
    id: "shell",
    name: "Shell Commands",
    icon: Terminal,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    source: "src/lib/ShellCommandParser.ts, src/core/shell-executor.js"
  },
  {
    id: "system",
    name: "System Control",
    icon: Volume2,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    source: "src/core/system-controls.js"
  },
  {
    id: "ocr",
    name: "Visual Intelligence",
    icon: Image,
    color: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
    source: "src/lib/tesseract-service.js, src/lib/screen-vision-service.js"
  },
  {
    id: "automation",
    name: "Automation",
    icon: Calendar,
    color: "from-cyan-500/20 to-sky-500/20",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    id: "scheduling",
    name: "Scheduling",
    icon: Calendar,
    color: "from-indigo-500/20 to-violet-500/20",
    borderColor: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    source: "src/service/scheduler.js"
  },
  {
    id: "media",
    name: "Media & Generation",
    icon: Image,
    color: "from-fuchsia-500/20 to-pink-500/20",
    borderColor: "border-fuchsia-500/30",
    iconColor: "text-fuchsia-400",
    source: "src/components/AIChatSidebar.tsx"
  },
  {
    id: "bookmarks",
    name: "Bookmarks & History",
    icon: History,
    color: "from-teal-500/20 to-emerald-500/20",
    borderColor: "border-teal-500/30",
    iconColor: "text-teal-400",
    source: "src/components/AIChatSidebar.tsx"
  },
  {
    id: "skills",
    name: "Skills & Settings",
    icon: Bot,
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    iconColor: "text-violet-400",
    source: "src/lib/SkillRegistry.ts"
  },
  {
    id: "meta",
    name: "Meta Commands",
    icon: Bot,
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: Maximize2,
    color: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
    source: "src/lib/plugin-manager.js, src/lib/plugin-sdk.js"
  }
];

const commands = [
  // Navigation Commands
  {
    name: "NAVIGATE",
    category: "navigation",
    description: "Navigate to a specific URL. Supports HTTP, HTTPS, and file:// URLs.",
    format: "Bracket/JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "url", type: "string", required: true, description: "Target URL" }
    ],
    example: {
      json: `[NAVIGATE: https://github.com/Latestinssan/Aartiq]`,
      natural: "Go to the Aartiq GitHub repository"
    }
  },
  {
    name: "SEARCH",
    category: "navigation",
    description: "Perform a web search using the default search engine.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "Search query" }
    ],
    example: {
      json: `[SEARCH: latest AI news]`,
      natural: "Search for the latest AI news"
    }
  },
  {
    name: "WEB_SEARCH",
    category: "navigation",
    description: "Perform a real-time web search with RAG (Retrieval Augmented Generation) for up-to-date information.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "Search query for real-time data" }
    ],
    example: {
      json: `[WEB_SEARCH: today's stock prices]`,
      natural: "What's the current stock price of Apple?"
    }
  },
  {
    name: "RELOAD",
    category: "navigation",
    description: "Refresh the current browser tab.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[RELOAD]`,
      natural: "Refresh this page"
    }
  },
  {
    name: "GO_BACK",
    category: "navigation",
    description: "Navigate back in browser history.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[GO_BACK]`,
      natural: "Go back to the previous page"
    }
  },
  {
    name: "GO_FORWARD",
    category: "navigation",
    description: "Navigate forward in browser history.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[GO_FORWARD]`,
      natural: "Go forward to the next page"
    }
  },

  // Browser Commands
  {
    name: "READ_PAGE_CONTENT",
    category: "browser",
    description: "Extract and read text content from the active browser tab.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[READ_PAGE_CONTENT]`,
      natural: "Read the content of this page"
    }
  },
  {
    name: "LIST_OPEN_TABS",
    category: "browser",
    description: "List all currently open browser tabs with their titles and URLs.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[LIST_OPEN_TABS]`,
      natural: "Show me all open tabs"
    }
  },
  // PDF Commands
  {
    name: "CREATE_PDF_JSON",
    category: "pdf",
    description: "Generate a structured, multi-page PDF document with advanced formatting options. PREFERRED method.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "title", type: "string", required: true, description: "Document title" },
      { name: "template", type: "string", required: false, description: "Template name (professional, executive, academic, minimalist, dark)" },
      { name: "content", type: "array", required: true, description: "Array of page objects" },
      { name: "branding", type: "object", required: false, description: "Header, footer, logo options" },
      { name: "include_toc", type: "boolean", required: false, description: "Generate table of contents" }
    ],
    example: {
      json: `{
  "command": "CREATE_PDF_JSON",
  "title": "Q4 Financial Report",
  "template": "executive",
  "include_toc": true,
  "content": [
    {"type": "header", "text": "Executive Summary"},
    {"type": "text", "content": "This quarter showed remarkable growth..."},
    {"type": "table", "headers": ["Metric", "Value", "Change"], "rows": [["Revenue", "$2.4M", "+15%"]]}
  ]
}`,
      natural: "Generate an executive summary PDF with a table of contents"
    }
  },
  {
    name: "CREATE_FILE_JSON",
    category: "pdf",
    description: "Create various file formats (PDF, PPTX, DOCX) using structured JSON. Supports rich media slides.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "format", type: "string", required: true, description: "File format: pdf, pptx, or docx" },
      { name: "title", type: "string", required: true, description: "Document title" },
      { name: "slides", type: "array", required: true, description: "Array of slide/page objects" }
    ],
    example: {
      json: `{
  "command": "CREATE_FILE_JSON",
  "format": "pptx",
  "title": "Q4 Presentation",
  "slides": [
    {"title": "Overview", "content": "Key metrics and achievements"},
    {"title": "Revenue", "chart": "bar", "data": [10, 20, 30]}
  ]
}`,
      natural: "Create a PowerPoint presentation for Q4"
    }
  },
  // Shell Commands
  {
    name: "SHELL_COMMAND",
    category: "shell",
    description: "Execute terminal commands on the host operating system. With the default settings every command waits for an explicit approval before it runs.",
    format: "JSON",
    riskLevel: "High",
    requiresApproval: true,
    approvalType: "QR + PIN (high) / Allow Once, Always Allow, Deny",
    parameters: [
      { name: "command", type: "string", required: true, description: "The shell command to execute" },
      { name: "shell", type: "string", required: false, description: "Shell type: bash, zsh, powershell, cmd" }
    ],
    safetyFeatures: [
      "Syntactic firewall filters dangerous patterns before anything runs (SecurityValidator.js)",
      "Every command line is classified into one of four risk tiers and checked by checkShellPermission against the permission store — with no store configured the gate denies (fail-closed), src/core/command-validator.js:78",
      "The approval dialog offers Allow Once / Always Allow / Deny; Shift+Tab is the keyboard shortcut for Allow Once (ClickPermissionModal.tsx:306)",
      "An Always Allow answer is keyed on the full normalised command line and carries a 30-day lifetime, after which the gate asks again (docs-audit/issues/allow-always-granularity.md)",
      "High-risk commands require QR + PIN from a paired mobile (ClickPermissionModal.tsx)",
      "Executed inside the fail-closed OS sandbox — Seatbelt / bubblewrap / AppContainer (sandbox-executor.js)",
      "Every run is logged for audit (ActionLogsStore.ts)"
    ],
    example: {
      json: `{
  "commands": [
    { "type": "SHELL_COMMAND", "value": "system_profiler SPNetworkDataType" }
  ]
}`,
      natural: "Show me my network information"
    },
    safeCommands: [
      "system_profiler", "ifconfig", "ipconfig", "netstat", "ping",
      "git status", "ls", "pwd", "df"
    ],
    blockedCommands: [
      "rm -rf", "sudo", "dd", "mkfs", ":(){:|:&};:", ">/dev/sda"
    ]
  },

  // System Commands
  {
    name: "SET_VOLUME",
    category: "system",
    description: "Adjust the system volume level.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "level", type: "number", required: true, description: "Volume level 0-100" }
    ],
    example: {
      json: `[SET_VOLUME: 50]`,
      natural: "Set volume to 50%"
    }
  },
  {
    name: "SET_BRIGHTNESS",
    category: "system",
    description: "Adjust the display brightness level.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "level", type: "number", required: true, description: "Brightness level 0-100" }
    ],
    example: {
      json: `[SET_BRIGHTNESS: 75]`,
      natural: "Increase brightness to 75%"
    }
  },
  {
    name: "OPEN_APP",
    category: "system",
    description: "Launch an application on the host system.",
    format: "Bracket",
    riskLevel: "Medium",
    requiresApproval: true,
    approvalType: "Allow Once / Always Allow / Deny (Shift+Tab = Allow Once)",
    parameters: [
      { name: "app", type: "string", required: true, description: "Application name or bundle ID" },
      { name: "url", type: "string", required: false, description: "URL or deep link to open" }
    ],
    example: {
      json: `[OPEN_APP: Calculator]`,
      natural: "Open the Calculator app"
    }
  },

  // OCR Commands
  {
    name: "OCR_SCREEN",
    category: "ocr",
    description: "Capture the screen or a region and extract text. Aartiq uses native OS OCR and accessibility providers first, with image OCR as a fallback path.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "region", type: "object", required: false, description: "Region to capture: {x, y, width, height}" }
    ],
    example: {
      json: `{
  "command": "OCR_SCREEN",
  "region": {"x": 0, "y": 0, "width": 1920, "height": 1080}
}`,
      natural: "Read the text on my screen"
    }
  },


  // Automation Commands
  {
    name: "LIST_AUTOMATIONS",
    category: "automation",
    description: "List all scheduled automation tasks with their status and schedules.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[LIST_AUTOMATIONS]`,
      natural: "Show all my scheduled automations"
    }
  },
  {
    name: "DELETE_AUTOMATION",
    category: "automation",
    description: "Delete an automation task using its ID.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: true,
    parameters: [
      { name: "taskId", type: "string", required: true, description: "ID of the automation to delete" }
    ],
    example: {
      json: `[DELETE_AUTOMATION: task-123]`,
      natural: "Delete the automation with ID task-123"
    }
  },
  // Scheduling Commands
  {
    name: "SCHEDULE_TASK",
    category: "scheduling",
    description: "Schedule a recurring automation task that runs through the background service even when the browser is closed.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "schedule", type: "string", required: true, description: "Cron expression" },
      { name: "type", type: "string", required: true, description: "Task type: pdf-generate, scrape, prompt, workflow" },
      { name: "name", type: "string", required: true, description: "Task name" }
    ],
    schedulePresets: [
      { name: "daily", expression: "0 8 * * *", description: "Every day at 8 AM" },
      { name: "hourly", expression: "0 * * * *", description: "Every hour" },
      { name: "weekdays", expression: "0 9 * * 1-5", description: "Monday to Friday at 9 AM" },
      { name: "weekly", expression: "0 10 * * 1", description: "Every Monday at 10 AM" }
    ],
    example: {
      json: `{
  "command": "SCHEDULE_TASK",
  "params": {
    "schedule": "0 8 * * *",
    "type": "pdf-generate",
    "name": "Daily Report"
  }
}`,
      natural: "Schedule a daily news summary at 8 AM"
    }
  },

  // Meta Commands
  {
    name: "THINK",
    category: "meta",
    description: "Expose the model's reasoning or intermediate thinking to the user for complex tasks.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "reasoning", type: "string", required: true, description: "The AI's thought process" }
    ],
    example: {
      json: `{
  "command": "THINK",
  "params": {
    "reasoning": "Calculating the optimal approach by comparing multiple search results..."
  }
}`,
      natural: "Let me think through this problem step by step"
    }
  },
  {
    name: "PLAN",
    category: "meta",
    description: "Show the intended execution steps for a multi-step task before or during execution.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "steps", type: "string", required: true, description: "List of planned steps" }
    ],
    example: {
      json: `{
  "command": "PLAN",
  "params": {
    "steps": "Step 1: Search, Step 2: Read results, Step 3: Generate summary"
  }
}`,
      natural: "Here's my plan to complete this task"
    }
  },

  // Integration Commands
  {
    name: "PLUGIN_COMMAND",
    category: "integrations",
    description: "Execute a command defined by a plugin. Format: pluginId.commandName | params.",
    format: "Bracket",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [
      { name: "pluginCommand", type: "string", required: true, description: "Plugin ID and command name" },
      { name: "params", type: "object", required: false, description: "Command parameters as JSON" }
    ],
    example: {
      json: `[PLUGIN_COMMAND: weather.get-forecast | {"city": "San Francisco"}]`,
      natural: "Get the weather forecast for San Francisco"
    }
  },

  // Browser Automation Commands (remaining)
  {
    name: "CLICK_ELEMENT",
    category: "browser",
    description: "Click on a visible DOM element using visual intelligence (OCR + coordinate mapping).",
    format: "JSON/Bracket",
    riskLevel: "Medium",
    requiresApproval: true,
    approvalType: "Allow Once / Always Allow / Deny (Shift+Tab = Allow Once)",
    parameters: [
      { name: "text", type: "string", required: true, description: "Text of the element to click" },
      { name: "matchType", type: "string", required: false, description: "exact, contains, startsWith" },
      { name: "index", type: "number", required: false, description: "Index if multiple matches" }
    ],
    example: {
      json: `{
  "command": "CLICK_ELEMENT",
  "text": "Submit",
  "matchType": "contains",
  "index": 0
}`,
      natural: "Click the login button"
    }
  },
  {
    name: "FIND_AND_CLICK",
    category: "browser",
    description: "Find text on the current page and click nearby elements. Uses OCR for text detection.",
    format: "JSON/Bracket",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [
      { name: "findText", type: "string", required: true, description: "Text to search for" },
      { name: "clickText", type: "string", required: false, description: "Text of element to click near found text" }
    ],
    example: {
      json: `[FIND_AND_CLICK: Settings | Open]`,
      natural: "Find the word Settings and click Open next to it"
    }
  },
  {
    name: "FILL_FORM",
    category: "browser",
    description: "Fill in form fields identified by label, placeholder, or name.",
    format: "JSON/Bracket",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [
      { name: "fields", type: "array", required: true, description: "Array of field objects" },
      { name: "fields[].label", type: "string", required: false, description: "Field label text" },
      { name: "fields[].name", type: "string", required: false, description: "Input name attribute" },
      { name: "fields[].value", type: "string", required: true, description: "Value to enter" }
    ],
    example: {
      json: `{
  "command": "FILL_FORM",
  "fields": [
    {"label": "Email", "value": "user@example.com"},
    {"label": "Password", "value": "secret123"}
  ]
}`,
      natural: "Fill in the login form with email and password"
    }
  },

  // Additional Browser Commands
  {
    name: "MULTI_FILL_FORM",
    category: "browser",
    description: "Fill multiple form fields atomically from a JSON field map. Uses dom-engine v2 with AX-tree resolution and cascading fallbacks.",
    format: "JSON",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [
      { name: "fields", type: "object", required: true, description: "JSON map of {selector: value} pairs" }
    ],
    example: {
      json: `{
  "command": "MULTI_FILL_FORM",
  "fields": {
    "#email": "user@example.com",
    "#password": "secret123",
    "input[name=phone]": "555-1234"
  }
}`,
      natural: "Fill in the entire registration form at once"
    }
  },
  {
    name: "DOM_SEARCH",
    category: "browser",
    description: "Search within the current page DOM for elements matching a selector, text, or attribute. Returns matching elements with metadata.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "CSS selector, text content, or attribute to search for" },
      { name: "maxResults", type: "number", required: false, description: "Maximum number of results to return" }
    ],
    example: {
      json: `{
  "command": "DOM_SEARCH",
  "query": "button[type=submit]",
  "maxResults": 5
}`,
      natural: "Find all submit buttons on this page"
    }
  },
  {
    name: "SWITCH_TAB",
    category: "browser",
    description: "Switch to a specific browser tab by ID or index.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "tabId", type: "string", required: true, description: "Tab ID or index to switch to" }
    ],
    example: {
      json: `[SWITCH_TAB: 2]`,
      natural: "Switch to the third tab"
    }
  },
  {
    name: "CLOSE_TAB",
    category: "browser",
    description: "Close a specific browser tab by ID.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "tabId", type: "string", required: true, description: "Tab ID to close" }
    ],
    example: {
      json: `[CLOSE_TAB: tab-3]`,
      natural: "Close the third tab"
    }
  },
  {
    name: "SCROLL_TO",
    category: "browser",
    description: "Scroll to a DOM element on the current page.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "selector", type: "string", required: true, description: "CSS selector of element to scroll to" }
    ],
    example: {
      json: `{
  "command": "SCROLL_TO",
  "selector": "#footer"
}`,
      natural: "Scroll down to the footer"
    }
  },
  {
    name: "CLICK_AT",
    category: "browser",
    description: "Click at specific screen coordinates (x, y).",
    format: "JSON",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [
      { name: "x", type: "number", required: true, description: "X coordinate" },
      { name: "y", type: "number", required: true, description: "Y coordinate" }
    ],
    example: {
      json: `{
  "command": "CLICK_AT",
  "x": 500,
  "y": 300
}`,
      natural: "Click at position 500, 300 on screen"
    }
  },
  {
    name: "SCREENSHOT_AND_ANALYZE",
    category: "browser",
    description: "Capture a screenshot of the current page and analyze its visual content using Vision/OCR.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "command": "SCREENSHOT_AND_ANALYZE"
}`,
      natural: "Take a screenshot and tell me what you see"
    }
  },
  {
    name: "DEEP_RESEARCH",
    category: "browser",
    description: "Perform deep iterative research with source ranking and coverage analysis across multiple search queries.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "Research topic or question" },
      { name: "depth", type: "number", required: false, description: "Research depth (1-5, default 3)" }
    ],
    example: {
      json: `{
  "command": "DEEP_RESEARCH",
  "query": "latest advances in quantum computing 2026",
  "depth": 4
}`,
      natural: "Do deep research on quantum computing advances"
    }
  },
  {
    name: "ORGANIZE_TABS",
    category: "browser",
    description: "Use AI to intelligently group all open tabs by topic or domain.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "command": "ORGANIZE_TABS"
}`,
      natural: "Organize my tabs into groups"
    }
  },

  // Additional System Commands
  {
    name: "ENABLE_CLI",
    category: "system",
    description: "Automatically enable the Aartiq CLI terminal tool for command-line browser control.",
    format: "JSON",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [],
    example: {
      json: `{
  "command": "ENABLE_CLI"
}`,
      natural: "Enable the CLI tool"
    }
  },

  // Additional PDF/Document Commands
  {
    name: "GENERATE_PDF",
    category: "pdf",
    description: "Create a PDF from markdown content (legacy fallback). For structured documents, prefer CREATE_PDF_JSON.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "content", type: "string", required: true, description: "Markdown content to convert to PDF" },
      { name: "filename", type: "string", required: false, description: "Output filename" }
    ],
    example: {
      json: `{
  "command": "GENERATE_PDF",
  "content": "# My Report\\n\\nThis is the content...",
  "filename": "report.pdf"
}`,
      natural: "Create a PDF from this markdown"
    }
  },
  {
    name: "GENERATE_DIAGRAM",
    category: "pdf",
    description: "Create charts and diagrams using Mermaid.js syntax.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "type", type: "string", required: true, description: "Diagram type: flowchart, sequence, gantt, pie, etc." },
      { name: "content", type: "string", required: true, description: "Mermaid diagram definition" }
    ],
    example: {
      json: `{
  "command": "GENERATE_DIAGRAM",
  "type": "flowchart",
  "content": "graph TD; A-->B; B-->C; C-->D;"
}`,
      natural: "Create a flowchart diagram"
    }
  },

  // Media & Generation Commands
  {
    name: "GENERATE_IMAGE",
    category: "media",
    description: "Generate an AI image with a detailed text prompt.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "prompt", type: "string", required: true, description: "Detailed image description" },
      { name: "style", type: "string", required: false, description: "Image style (e.g., photorealistic, anime, oil painting)" }
    ],
    example: {
      json: `{
  "command": "GENERATE_IMAGE",
  "prompt": "A futuristic city skyline at sunset with flying cars",
  "style": "photorealistic"
}`,
      natural: "Generate an image of a futuristic city"
    }
  },
  {
    name: "APPLE_INTELLIGENCE_IMAGE",
    category: "media",
    description: "Generate an image using Apple Intelligence local models (macOS only).",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "prompt", type: "string", required: true, description: "Image description" }
    ],
    example: {
      json: `{
  "command": "APPLE_INTELLIGENCE_IMAGE",
  "prompt": "A watercolor painting of mountains"
}`,
      natural: "Use Apple Intelligence to generate a mountain painting"
    }
  },
  {
    name: "APPLE_INTELLIGENCE_SUMMARY",
    category: "media",
    description: "Summarize text using Apple Intelligence local models (macOS only).",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "text", type: "string", required: true, description: "Text to summarize" }
    ],
    example: {
      json: `{
  "command": "APPLE_INTELLIGENCE_SUMMARY",
  "text": "Long article text here..."
}`,
      natural: "Summarize this article using Apple Intelligence"
    }
  },
  {
    name: "PLAY_VIDEO",
    category: "media",
    description: "Play a YouTube video inline in the chat interface.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "url", type: "string", required: true, description: "YouTube video URL" }
    ],
    example: {
      json: `{
  "command": "PLAY_VIDEO",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}`,
      natural: "Play this YouTube video"
    }
  },
  {
    name: "SEARCH_VIDEO",
    category: "media",
    description: "Search YouTube and auto-play the top result.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "YouTube search query" }
    ],
    example: {
      json: `{
  "command": "SEARCH_VIDEO",
  "query": "how to train a dragon full movie"
}`,
      natural: "Find and play a YouTube video about dragons"
    }
  },

  // Bookmarks & History Commands
  {
    name: "LIST_BOOKMARKS",
    category: "bookmarks",
    description: "List all saved browser bookmarks.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[LIST_BOOKMARKS]`,
      natural: "Show me all my bookmarks"
    }
  },
  {
    name: "ADD_BOOKMARK",
    category: "bookmarks",
    description: "Add a bookmark for the current page or a specific URL.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "url", type: "string", required: true, description: "URL to bookmark" },
      { name: "title", type: "string", required: false, description: "Bookmark title" }
    ],
    example: {
      json: `{
  "command": "ADD_BOOKMARK",
  "url": "https://github.com/Latestinssan/Aartiq",
  "title": "Aartiq Repository"
}`,
      natural: "Bookmark this page"
    }
  },
  {
    name: "REMOVE_BOOKMARK",
    category: "bookmarks",
    description: "Remove a bookmark by URL.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: true,
    parameters: [
      { name: "url", type: "string", required: true, description: "URL to remove from bookmarks" }
    ],
    example: {
      json: `{
  "command": "REMOVE_BOOKMARK",
  "url": "https://example.com"
}`,
      natural: "Remove this bookmark"
    }
  },
  {
    name: "CLEAR_BOOKMARKS",
    category: "bookmarks",
    description: "Remove all bookmarks.",
    format: "Bracket",
    riskLevel: "High",
    requiresApproval: true,
    parameters: [],
    example: {
      json: `[CLEAR_BOOKMARKS]`,
      natural: "Clear all my bookmarks"
    }
  },
  {
    name: "LIST_HISTORY",
    category: "bookmarks",
    description: "List or search browsing history.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: false, description: "Search filter for history" },
      { name: "limit", type: "number", required: false, description: "Maximum entries to return" }
    ],
    example: {
      json: `{
  "command": "LIST_HISTORY",
  "query": "github",
  "limit": 10
}`,
      natural: "Show my recent browsing history"
    }
  },
  {
    name: "CLEAR_HISTORY",
    category: "bookmarks",
    description: "Clear all browsing history.",
    format: "Bracket",
    riskLevel: "High",
    requiresApproval: true,
    parameters: [],
    example: {
      json: `[CLEAR_HISTORY]`,
      natural: "Clear my browsing history"
    }
  },

  // Skills & Settings Commands
  {
    name: "LIST_SKILLS",
    category: "skills",
    description: "List all available skill guides that can be loaded for domain-specific knowledge.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[LIST_SKILLS]`,
      natural: "What skills are available?"
    }
  },
  {
    name: "LOAD_SKILL",
    category: "skills",
    description: "Load a specific skill guide into context for domain-specific knowledge and workflows.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "skillId", type: "string", required: true, description: "Skill ID to load (e.g., settings, automation, pdf)" }
    ],
    example: {
      json: `{
  "command": "LOAD_SKILL",
  "skillId": "settings"
}`,
      natural: "Load the settings skill"
    }
  },
  {
    name: "SETTINGS_QUERY",
    category: "skills",
    description: "Read current settings for a specific category.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "category", type: "string", required: true, description: "Settings category (e.g., llm, appearance, security)" }
    ],
    example: {
      json: `{
  "command": "SETTINGS_QUERY",
  "category": "llm"
}`,
      natural: "Show my current LLM settings"
    }
  },
  {
    name: "SETTINGS_UPDATE",
    category: "skills",
    description: "Request a settings change. Changes are applied after user confirmation.",
    format: "JSON",
    riskLevel: "Medium",
    requiresApproval: true,
    parameters: [
      { name: "category", type: "string", required: true, description: "Settings category" },
      { name: "key", type: "string", required: true, description: "Setting key to change" },
      { name: "value", type: "any", required: true, description: "New value" }
    ],
    example: {
      json: `{
  "command": "SETTINGS_UPDATE",
  "category": "appearance",
  "key": "theme",
  "value": "dark"
}`,
      natural: "Change the theme to dark mode"
    }
  },
  {
    name: "OPEN_SETTINGS_PANEL",
    category: "skills",
    description: "Open a specific settings panel in the UI.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "panel", type: "string", required: true, description: "Panel to open (e.g., llm, automation, mcp)" }
    ],
    example: {
      json: `{
  "command": "OPEN_SETTINGS_PANEL",
  "panel": "mcp"
}`,
      natural: "Open the MCP settings"
    }
  },

  // Additional Meta Commands
  {
    name: "EXPLAIN_CAPABILITIES",
    category: "meta",
    description: "List all available AI features and capabilities of Aartiq.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "command": "EXPLAIN_CAPABILITIES"
}`,
      natural: "What can you do?"
    }
  },

  // COMMAND_REGISTRY coverage — every command in src/lib/AICommandParser.ts has a card.
  // Navigation
  {
    name: "SEARCH_RESULTS",
    category: "navigation",
    description: "Fetch Google search result URLs directly, without opening a tab.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "Search query" },
      { name: "count", type: "number", required: false, description: "Maximum results to return" }
    ],
    example: {
      json: `{
  "type": "SEARCH_RESULTS",
  "query": "latest AI news",
  "count": 5
}`,
      natural: "Give me the top results for the latest AI news"
    }
  },
  // Browser / tab intelligence
  {
    name: "OPEN_VIEW",
    category: "browser",
    description: "Switch between browser workspace views.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "view", type: "string", required: true, description: "View to switch to, e.g. coding" }
    ],
    example: {
      json: `[OPEN_VIEW: coding]`,
      natural: "Switch to the coding view"
    }
  },
  {
    name: "DOM_READ_FILTERED",
    category: "browser",
    description: "Read DOM text with an optional filter term, screened through the injection check before it is returned.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "term", type: "string", required: false, description: "Optional filter to narrow the read" }
    ],
    example: {
      json: `[DOM_READ_FILTERED: pricing table]`,
      natural: "Read the pricing table from this page"
    }
  },
  {
    name: "ANALYSE_TABS",
    category: "browser",
    description: "Analyse all open tabs — list them, read their content, and return one consolidated analysis.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "type": "ANALYSE_TABS"
}`,
      natural: "Analyse everything I have open"
    }
  },
  {
    name: "ANALYZE_TABS",
    category: "browser",
    description: "US-spelling variant — the parser normalizes it to ANALYSE_TABS and runs the same analysis.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "type": "ANALYZE_TABS"
}`,
      natural: "Analyze my open tabs"
    }
  },
  {
    name: "SUMMARIZE_TABS",
    category: "browser",
    description: "Summarize content from one or more open tabs — the parser normalizes it to the ANALYSE_TABS flow.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "type": "SUMMARIZE_TABS"
}`,
      natural: "Summarize my open tabs"
    }
  },
  {
    name: "READ_TAB_CONTENT",
    category: "browser",
    description: "Read the content of one specific open tab.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "tabId", type: "string", required: true, description: "Tab id (see LIST_OPEN_TABS)" }
    ],
    example: {
      json: `{
  "type": "READ_TAB_CONTENT",
  "tabId": "tab-1"
}`,
      natural: "Read what is on my first tab"
    }
  },
  {
    name: "COMPARE_TABS",
    category: "browser",
    description: "Compare content across multiple open tabs.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "tabIds", type: "array", required: true, description: "Tab ids to compare" }
    ],
    example: {
      json: `{
  "type": "COMPARE_TABS",
  "tabIds": ["tab-1", "tab-2"]
}`,
      natural: "Compare my first two tabs"
    }
  },
  {
    name: "FIND_INFORMATION_IN_TABS",
    category: "browser",
    description: "Search open tabs for specific information.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "query", type: "string", required: true, description: "What to look for" }
    ],
    example: {
      json: `{
  "type": "FIND_INFORMATION_IN_TABS",
  "query": "pricing"
}`,
      natural: "Find the pricing page across my tabs"
    }
  },
  {
    name: "CREATE_TAB_RESEARCH_CONTEXT",
    category: "browser",
    description: "Create a research context from the currently open tabs.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `{
  "type": "CREATE_TAB_RESEARCH_CONTEXT"
}`,
      natural: "Turn my open tabs into a research context"
    }
  },
  {
    name: "GROUP_TABS",
    category: "browser",
    description: "Group open tabs by strategy: ai, domain, priority, or recency.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "strategy", type: "string", required: false, description: "Grouping strategy (default ai)" }
    ],
    example: {
      json: `{
  "type": "GROUP_TABS",
  "strategy": "ai"
}`,
      natural: "Group my tabs by topic"
    }
  },
  // Automation
  {
    name: "RECORD_WORKFLOW",
    category: "automation",
    description: "Start or stop workflow recording — actions taken while recording are captured as a replayable step list.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "action", type: "string", required: true, description: "start or stop" }
    ],
    example: {
      json: `[RECORD_WORKFLOW: start]`,
      natural: "Start recording what I do"
    }
  },
  {
    name: "PLAY_WORKFLOW",
    category: "automation",
    description: "Replay a previously recorded workflow, step by step.",
    format: "Bracket",
    riskLevel: "Medium",
    requiresApproval: true,
    approvalType: "Allow Once / Always Allow / Deny",
    parameters: [
      { name: "name", type: "string", required: true, description: "Workflow name" }
    ],
    example: {
      json: `[PLAY_WORKFLOW: my-workflow]`,
      natural: "Replay my login workflow"
    }
  },
  {
    name: "OPEN_AUTOMATION_SETTINGS",
    category: "automation",
    description: "Open the automation settings panel.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[OPEN_AUTOMATION_SETTINGS]`,
      natural: "Open the automation settings"
    }
  },
  // Scheduling
  {
    name: "OPEN_SCHEDULING_MODAL",
    category: "scheduling",
    description: "Open the scheduling modal, optionally pre-filled from a pipe-separated cron | type | name | description string.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "prefill", type: "string", required: false, description: "cron | type | name | description" }
    ],
    example: {
      json: `[OPEN_SCHEDULING_MODAL: 0 8 * * *|pdf-generate|Daily Report|Generate PDF]`,
      natural: "Open the scheduler for a daily report"
    }
  },
  // Meta
  {
    name: "WAIT",
    category: "meta",
    description: "Pause execution for a duration in milliseconds.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "ms", type: "number", required: true, description: "Milliseconds to pause" }
    ],
    example: {
      json: `[WAIT: 2000]`,
      natural: "Wait two seconds before continuing"
    }
  },
  {
    name: "STATUS",
    category: "meta",
    description: "Show a custom processing indicator to the user.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "text", type: "string", required: true, description: "Status text to display" }
    ],
    example: {
      json: `{
  "type": "STATUS",
  "text": "Searching..."
}`,
      natural: "Show that you are searching"
    }
  },
  // Skills & Settings
  {
    name: "OPEN_MCP_SETTINGS",
    category: "skills",
    description: "Open the MCP servers settings panel.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [],
    example: {
      json: `[OPEN_MCP_SETTINGS]`,
      natural: "Open the MCP settings"
    }
  },
  {
    name: "SET_THEME",
    category: "skills",
    description: "Switch between dark and light mode.",
    format: "Bracket",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "theme", type: "string", required: true, description: "dark or light" }
    ],
    example: {
      json: `[SET_THEME: dark]`,
      natural: "Switch to dark mode"
    }
  },
  {
    name: "SET_CHAT_STYLE",
    category: "skills",
    description: "Customize chat font size, glow mode and preset.",
    format: "JSON",
    riskLevel: "Low",
    requiresApproval: false,
    parameters: [
      { name: "fontSize", type: "number", required: false, description: "Chat font size" },
      { name: "glowMode", type: "string", required: false, description: "Glow style, e.g. gradient" },
      { name: "glowPreset", type: "string", required: false, description: "Glow color preset, e.g. sunset-fire" }
    ],
    example: {
      json: `{
  "type": "SET_CHAT_STYLE",
  "fontSize": 14,
  "glowMode": "gradient",
  "glowPreset": "sunset-fire"
}`,
      natural: "Make the chat text a bit bigger with a sunset glow"
    }
  },
];

const commandStatus = {
  Low: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Medium: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  High: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" }
};

export default function AICommandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<typeof commands[0] | null>(null);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const filteredCommands = selectedCategory 
    ? commands.filter(cmd => cmd.category === selectedCategory)
    : commands;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const selectedCatData = selectedCategory ? commandCategories.find(c => c.id === selectedCategory) : null;

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Bot size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Command Reference · {commandCount} Commands
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Command <span className="text-white/20">Reference</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Aartiq turns AI output into structured commands before anything runs. The parser is
          <strong className="text-white/70"> JSON-first</strong>, then HTML-comment, then bracket tags. The shell
          verb is <code className="font-mono text-sky-400/80">SHELL_COMMAND</code> (there is no
          <code className="font-mono text-rose-400/80"> RUN_SHELL</code>); every shell command line is
          classified into <strong className="text-rose-400/80">four risk tiers</strong> and has to pass
          <code className="font-mono text-sky-400/80"> checkShellPermission</code>. With the default
          settings, nothing runs until the approval dialog is answered — one command at a time.
        </p>

        <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 text-sm leading-relaxed text-white/60">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-sky-400/80">How commands are parsed</p>
          <ul className="space-y-2">
            <li><span className="font-bold text-white/80">1. JSON (tried first)</span> — <code className="font-mono text-sky-400/70">```json</code> blocks and bare <code className="font-mono text-sky-400/70">{'{ "commands": [...] }'}</code> / <code className="font-mono text-sky-400/70">{'{ "type": ..., "value": ... }'}</code> objects, parsed with a balanced-brace scanner.</li>
            <li><span className="font-bold text-white/80">2. HTML comment</span> — <code className="font-mono text-sky-400/70">&lt;!-- AI_COMMANDS_START --&gt; ... &lt;!-- AI_COMMANDS_END --&gt;</code> containing <code className="font-mono text-sky-400/70">[TYPE]:value</code> lines.</li>
            <li><span className="font-bold text-white/80">3. Bracket tags</span> — <code className="font-mono text-sky-400/70">[NAVIGATE: https://example.com]</code>, <code className="font-mono text-sky-400/70">[FILL_FORM: #email | user@example.com]</code>, <code className="font-mono text-sky-400/70">[CLICK_ELEMENT: #submit | click submit]</code>.</li>
            <li>Text inside code blocks, inline code, <code className="font-mono text-sky-400/70">&lt;think&gt;</code> blocks, and markdown tables is masked so it is not re-parsed. A command may carry a <code className="font-mono text-sky-400/70">risk</code> field and <code className="font-mono text-sky-400/70">reason</code>; default risk is <code className="font-mono text-sky-400/70">medium</code>.</li>
          </ul>
          <p className="mt-3 text-[11px] font-mono text-sky-400/70">Source: src/lib/AICommandParser.ts:374-513, src/lib/AICommandParser.ts:62-138, src/components/ai/AIConstants.ts:96-108</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/docs/native-api"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Native API
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/docs/api-reference"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            API Reference
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Risk Level Legend */}
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <p className="text-xs font-black uppercase tracking-wider text-white/30">Risk:</p>
          {Object.entries(commandStatus).map(([level, styles]) => (
            <div key={level} className={`flex items-center gap-2 rounded-full border px-4 py-2 ${styles.bg}`}>
              <div className={`h-2 w-2 rounded-full ${styles.color.replace('text-', 'bg-')}`} />
              <span className={`text-xs font-black uppercase ${styles.color}`}>{level}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Category Filter */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              !selectedCategory
                ? "bg-white text-black"
                : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All Commands
          </button>
          {commandCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <cat.icon size={16} className={selectedCategory === cat.id ? "" : cat.iconColor} />
              <span className="hidden sm:inline">{cat.name}</span>
            </button>
          ))}
        </div>

        {selectedCatData?.source && (
          <div className="mb-6">
            <code className="rounded bg-white/5 px-3 py-1.5 text-xs font-mono text-white/40">
              Source: {selectedCatData.source}
            </code>
          </div>
        )}
      </motion.section>

      {/* Commands Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCommands.map((cmd, i) => (
            <motion.div
              key={cmd.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedCommand(cmd)}
              className={`group cursor-pointer rounded-[2rem] border p-8 transition-all hover:scale-[1.01] ${
                commandCategories.find(c => c.id === cmd.category)?.borderColor || "border-white/5"
              } bg-gradient-to-br ${
                commandCategories.find(c => c.id === cmd.category)?.color || "from-white/5 to-transparent"
              }`}
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${
                    commandCategories.find(c => c.id === cmd.category)?.iconColor || "text-white"
                  }`}>
                    {cmd.name.includes("PDF") ? <FileText size={24} /> :
                     cmd.name.includes("SHELL") ? <Terminal size={24} /> :
                     cmd.name.includes("NAVIGATE") ? <Globe size={24} /> :
                     cmd.name.includes("OCR") ? <Image size={24} /> :
                     cmd.name.includes("SCHEDULE") ? <Calendar size={24} /> :
                     cmd.name.includes("CLICK") ? <MousePointer size={24} /> :
                     cmd.name.includes("VOLUME") || cmd.name.includes("BRIGHTNESS") ? <Volume2 size={24} /> :
                     <Code2 size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black uppercase tracking-wider">{cmd.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-white/30">{cmd.format} Format</p>
                  </div>
                </div>
                <div className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${
                  commandStatus[cmd.riskLevel as keyof typeof commandStatus].bg
                } ${commandStatus[cmd.riskLevel as keyof typeof commandStatus].color}`}>
                  {cmd.riskLevel} Risk
                </div>
              </div>

              <p className="mb-6 text-sm font-medium leading-relaxed text-white/60">{cmd.description}</p>

              {cmd.parameters && (
                <div className="mb-6">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    Parameters ({cmd.parameters.filter(p => p.required).length} required)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cmd.parameters.slice(0, 4).map((param) => (
                      <code
                        key={param.name}
                        className={`rounded-lg px-3 py-1 text-xs font-mono ${
                          param.required 
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                            : "bg-white/5 text-white/40 border border-white/5"
                        }`}
                      >
                        {param.name}
                      </code>
                    ))}
                    {cmd.parameters.length > 4 && (
                      <span className="px-3 py-1 text-xs text-white/30">
                        +{cmd.parameters.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {cmd.requiresApproval ? (
                    <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5">
                      <Shield size={12} className="text-red-400" />
                      <span className="text-[10px] font-bold uppercase text-red-400">
                        Requires Approval
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase text-emerald-400">
                        Instant
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight size={18} className="text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Command Detail Modal */}
      {selectedCommand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedCommand(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0a0c14] p-10 shadow-2xl"
          >
            <button
              onClick={() => setSelectedCommand(null)}
              className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>

            <div className="mb-8 flex items-start gap-6">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/5 ${
                commandCategories.find(c => c.id === selectedCommand.category)?.iconColor || "text-white"
              }`}>
                <Code2 size={32} />
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black uppercase tracking-wider">{selectedCommand.name}</h2>
                  <div className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${
                    commandStatus[selectedCommand.riskLevel as keyof typeof commandStatus].bg
                  } ${commandStatus[selectedCommand.riskLevel as keyof typeof commandStatus].color}`}>
                    {selectedCommand.riskLevel} Risk
                  </div>
                </div>
                <p className="mt-2 text-white/50">{selectedCommand.description}</p>
                {"approvalType" in selectedCommand && selectedCommand.approvalType && (
                  <p className="mt-2 text-xs text-white/40">
                    Approval:{" "}
                    <span className="font-bold text-white/60">{selectedCommand.approvalType}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Parameters */}
            {selectedCommand.parameters && (
              <div className="mb-10">
                <h3 className="mb-6 text-lg font-black uppercase tracking-wider">Parameters</h3>
                <div className="space-y-3">
                  {selectedCommand.parameters.map((param) => (
                    <div key={param.name} className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <code className="rounded bg-sky-500/10 px-2 py-0.5 text-sm font-mono text-sky-400">{param.name}</code>
                          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase text-white/30">{param.type}</span>
                          {param.required && (
                            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-red-400">Required</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-white/40">{param.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example */}
            <div className="mb-10">
              <h3 className="mb-6 text-lg font-black uppercase tracking-wider">Example</h3>
              <div className="relative">
                <button
                  onClick={() => handleCopy(selectedCommand.example.json, selectedCommand.name)}
                  className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  {copiedExample === selectedCommand.name ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copiedExample === selectedCommand.name ? "Copied!" : "Copy"}
                </button>
                <pre className="overflow-x-auto rounded-xl bg-black/60 p-6 pt-12 font-mono text-sm text-white/80">
                  {selectedCommand.example.json}
                </pre>
              </div>
              <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <p className="text-sm text-white/60">
                  <strong className="text-sky-400">Natural Language:</strong> "{selectedCommand.example.natural}"
                </p>
              </div>
            </div>

            {/* Safety Features */}
            {selectedCommand.safetyFeatures && (
              <div className="mb-10">
                <h3 className="mb-6 text-lg font-black uppercase tracking-wider">Safety Features</h3>
                <ul className="space-y-3">
                  {selectedCommand.safetyFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <Shield size={18} className="text-sky-400" />
                      <span className="text-sm text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safe/Blocked Commands */}
            {selectedCommand.safeCommands && (
              <div className="mb-10 grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-emerald-400">Allowed Commands</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommand.safeCommands.map((cmd) => (
                      <code key={cmd} className="rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                        {cmd}
                      </code>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-red-400">Blocked Patterns</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommand.blockedCommands.map((cmd) => (
                      <code key={cmd} className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">
                        {cmd}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Presets */}
            {selectedCommand.schedulePresets && (
              <div className="mb-10">
                <h3 className="mb-6 text-lg font-black uppercase tracking-wider">Schedule Presets</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedCommand.schedulePresets.map((preset) => (
                    <div key={preset.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div>
                        <p className="font-bold text-white">{preset.name}</p>
                        <p className="text-xs text-white/40">{preset.description}</p>
                      </div>
                      <code className="rounded bg-white/5 px-2 py-1 text-xs text-white/60">{preset.expression}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Quick Reference */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
          <h2 className="mb-8 text-2xl font-black uppercase tracking-wider">Quick Command Reference</h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {commands.slice(0, 15).map((cmd) => (
              <div key={cmd.name} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <code className="text-sm font-mono text-sky-400">{cmd.name}</code>
                {cmd.requiresApproval && (
                  <Shield size={12} className="ml-auto text-red-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}