"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronRight,
  Terminal,
  Globe,
  Wifi,
  Smartphone,
  Bot,
  FileText,
  Lock,
  RefreshCw,
  Bug,
  Wrench,
  Lightbulb,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const categories = [
  { id: "general", name: "General Issues", icon: HelpCircle, color: "from-sky-500/20 to-cyan-500/20" },
  { id: "ai", name: "AI & Commands", icon: Bot, color: "from-purple-500/20 to-pink-500/20" },
  { id: "browser", name: "Browser Issues", icon: Globe, color: "from-amber-500/20 to-orange-500/20" },
  { id: "sync", name: "Mobile Sync", icon: Smartphone, color: "from-emerald-500/20 to-teal-500/20" },
  { id: "pdf", name: "PDF Generation", icon: FileText, color: "from-red-500/20 to-rose-500/20" },
  { id: "security", name: "Security & Permissions", icon: Lock, color: "from-indigo-500/20 to-violet-500/20" }
];

const faqs = [
  {
    category: "general",
    question: "How do I update Aartiq?",
    answer: "Updates are downloaded automatically in the background. When an update is ready, you'll see a notification. You can also check for updates manually via Settings > About > Check for Updates. On macOS, you may need to approve the update in System Preferences > Security & Privacy.",
    solutions: [
      "Enable automatic updates in Settings > General > Auto-update",
      "Restart the app after downloading an update",
      "If stuck, manually download from the releases page"
    ]
  },
  {
    category: "general",
    question: "Why is the app using so much memory?",
    answer: "Aartiq uses additional memory for AI model loading and browser view rendering. The app typically uses 200-500MB during normal use. High memory usage may occur when processing large documents or running multiple AI models.",
    solutions: [
      "Close unused tabs to reduce memory",
      "Use lighter AI models (Gemini Flash instead of Pro)",
      "Disable unused extensions",
      "Restart the app periodically"
    ]
  },
  {
    category: "general",
    question: "How do I reset the app to defaults?",
    answer: "To reset all settings to defaults, go to Settings > General > Reset Settings. This will clear all preferences but won't delete your data or files. For a complete reset, uninstall and reinstall the app.",
    solutions: [
      "Settings > General > Reset Settings",
      "Delete user data at ~/Library/Application Support/Aartiq/ (macOS)",
      "%APPDATA%/Aartiq/ (Windows)",
      "~/.config/Aartiq/ (Linux)"
    ]
  },
  {
    category: "ai",
    question: "Why isn't the AI responding?",
    answer: "The AI may not respond due to API issues, rate limits, or network problems. Check that your API key is valid and you have available quota. Also verify your internet connection.",
    solutions: [
      "Verify API key in Settings > AI Providers",
      "Check for rate limit errors in console",
      "Try a different AI provider",
      "Restart the app",
      "Check network/firewall settings"
    ]
  },
  {
    category: "ai",
    question: "How do I change the AI model?",
    answer: "Go to Settings > AI Providers and select your preferred provider (Gemini, OpenAI, Claude, or Ollama). You can also specify the model variant for each provider. For local models, install and configure Ollama.",
    solutions: [
      "Settings > AI Providers > Select Provider",
      "Use Refresh in AI settings to fetch the latest official provider model catalog",
      "For Ollama: Install models via ollama.com",
      "Import custom GGUF models via Settings > Ollama > Import",
      "Test model availability with a simple prompt"
    ]
  },
  {
    category: "ai",
    question: "Apple Intelligence says it is not supported or not available",
    answer: "Aartiq now performs a GUI-based readiness check before using Apple Intelligence. If the UI says Apple Intelligence is unsupported, disabled, or not ready, the native Apple frameworks are not available for Aartiq on that Mac right now.",
    solutions: [
      "Check that you are on a supported Mac and macOS version",
      "Enable Apple Intelligence in macOS settings if your device supports it",
      "Open Settings > AI Providers > Apple Intelligence Lab and press Refresh",
      "Use Gemini, OpenAI, Claude, Groq, xAI, or Ollama as fallback providers"
    ]
  },
  {
    category: "ai",
    question: "Apple Intelligence summary still fails even when the Mac supports it",
    answer: "Apple's frameworks can report partial availability while generation is still blocked by runtime state. Aartiq now runs a stronger readiness check, but a Mac may still fail if the Apple model is still preparing or the OS has not enabled the feature fully for third-party apps.",
    solutions: [
      "Wait a few minutes and refresh Apple Intelligence status again",
      "Restart Aartiq after enabling Apple Intelligence in macOS settings",
      "Try the built-in Apple Intelligence Lab before relying on it in a workflow",
      "Use a cloud provider or Ollama until Apple's local runtime becomes ready"
    ]
  },
  {
    category: "ai",
    question: "The AI is generating wrong commands. How do I fix this?",
    answer: "Ensure you're using clear, specific prompts. The AI uses JSON format commands by default. If it's generating malformed commands, try rephrasing your request or provide an example.",
    solutions: [
      "Be specific about what you want",
      "Use the JSON command format explicitly",
      "Check the command in the approval dialog",
      "Report recurring issues with example prompts"
    ]
  },
  {
    category: "browser",
    question: "Websites aren't loading properly",
    answer: "This could be due to JavaScript issues, cookies, or website-specific problems. Try clearing the site data or using a fresh tab.",
    solutions: [
      "Clear site data: Settings > Privacy > Clear Site Data",
      "Disable extensions temporarily",
      "Try incognito mode",
      "Check if the site works in another browser"
    ]
  },
  {
    category: "browser",
    question: "How do I enable/disable JavaScript?",
    answer: "JavaScript can be toggled per-site via the site info panel or globally in Settings > Content > JavaScript. Note that most modern websites require JavaScript to function.",
    solutions: [
      "Click the lock icon > Site Settings > JavaScript",
      "Settings > Content > JavaScript toggle",
      "Use per-site exceptions for trusted sites"
    ]
  },
  {
    category: "browser",
    question: "Extensions aren't working",
    answer: "Extensions may need permission updates or may be incompatible with the current version. Check extension settings and try reinstalling problematic extensions.",
    solutions: [
      "Settings > Extensions > Check for errors",
      "Reinstall the problematic extension",
      "Disable all extensions, then enable one by one",
      "Check extension compatibility with app version"
    ]
  },
  {
    category: "sync",
    question: "Mobile app can't connect to desktop",
    answer: "Both devices must be on the same network. Check that WiFi Sync is enabled on desktop (Settings > Sync) and the mobile app has permission to access local network.",
    solutions: [
      "Ensure both devices are on same WiFi network",
      "Check firewall allows local network connections",
      "Restart WiFi on both devices",
      "Disable VPN on mobile device",
      "Try using the IP address directly"
    ]
  },
  {
    category: "sync",
    question: "QR code scanning fails on mobile",
    answer: "Ensure the camera has permission in the mobile app. Hold the phone steady and ensure good lighting. Each approval shows a fresh QR; the ticket it carries is single-use, and an open approval dialog auto-denies after 60 seconds — start a new approval to get a fresh code.",
    solutions: [
      "Grant camera permission to Aartiq app",
      "Clean the camera lens",
      "Increase screen brightness on desktop",
      "Wait for QR to refresh and try again",
      "Enter the 6-digit code manually as fallback"
    ]
  },
  {
    category: "sync",
    question: "Clipboard sync isn't working",
    answer: "Clipboard sync requires both devices to be connected. Check that sync is enabled in Settings > Sync > Clipboard. There's a 2-second polling interval.",
    solutions: [
      "Enable clipboard sync in Settings > Sync",
      "Reconnect the mobile device",
      "Toggle clipboard sync off and on, then copy the content again",
      "Restart both apps"
    ]
  },
  {
    category: "pdf",
    question: "PDF generation is slow",
    answer: "Complex PDFs with charts, tables, and images take longer. The AI processing time depends on content complexity and chosen model.",
    solutions: [
      "Use simpler templates (minimalist instead of professional)",
      "Reduce content volume per document",
      "Use a faster AI model",
      "Generate PDFs when system is less loaded"
    ]
  },
  {
    category: "pdf",
    question: "PDF content looks wrong/misaligned",
    answer: "PDF rendering depends on the template and content structure. Complex tables and nested content may not render perfectly in all templates.",
    solutions: [
      "Try a different template",
      "Simplify the content structure",
      "Use the HTML-to-PDF method for complex layouts",
      "Report specific rendering issues with examples"
    ]
  },
  {
    category: "pdf",
    question: "PDF won't open on mobile after sync",
    answer: "Generated documents land in ~/Documents/Aartiq (the default output folder). To move one to a paired device, use the file-sync relay for images, PDFs and documents — both devices must be on the same network while the transfer completes.",
    solutions: [
      "Use the file-sync relay on the paired device and select the PDF",
      "Keep both devices on the same WiFi until the transfer finishes",
      "Reopen the file list in the mobile app to refresh it",
      "Check the file size against available storage on the device"
    ]
  },
  {
    category: "security",
    question: "How do I revoke shell command permissions?",
    answer: "Go to Settings > Security > Auto-Run Commands and set to 'Ask Every Time'. You can also view and clear the allowed commands list.",
    solutions: [
      "Settings > Security > Auto-Run Commands",
      "Clear allowed commands list",
      "Set individual command risk levels",
      "Use QR approval for all shell commands"
    ]
  },
  {
    category: "security",
    question: "I accidentally approved a dangerous command",
    answer: "Immediately check your system for any changes. If you ran a destructive command, you may need to restore from backup. Report the issue so we can improve command detection.",
    solutions: [
      "Check system for unintended changes",
      "Restore from Time Machine/backup if needed",
      "Report the exact command that was executed",
      "Enable stricter approval requirements"
    ]
  },
  {
    category: "security",
    question: "The AI is trying to access restricted commands",
    answer: "This is blocked by the Syntactic Firewall. The blocked patterns (rm -rf, sudo, etc.) are never executed regardless of how they're phrased.",
    solutions: [
      "This is expected security behavior",
      "Use safer alternatives (move to trash instead of rm)",
      "If legitimate need, use direct shell access instead",
      "Report false positives for pattern adjustment"
    ]
  }
];

const troubleshootingTips = [
  { icon: RefreshCw, title: "Restart First", desc: "Most issues are resolved by restarting the app." },
  { icon: Search, title: "Check Logs", desc: "View logs via Help > Show Logs or check ~/.config/aartiq-browser/logs/." },
  { icon: Wrench, title: "Safe Mode", desc: "Hold Shift while launching to start in safe mode with extensions disabled." },
  { icon: Bug, title: "Report Bugs", desc: "Report persistent issues on GitHub with logs from ~/.config/aartiq-browser/logs/." }
];

export default function TroubleshootingPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = !activeCategory || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <HelpCircle size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Troubleshooting
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Troubleshooting
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Common issues, errors, and debug locations. Key files: main.js (Electron main process), preload.js (context bridge), src/lib/Security.ts (command validation), src/core/shell-executor.js (shell execution).
        </p>

        {/* Search */}
        <div className="mt-12">
          <div className="relative max-w-xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search for issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 px-14 py-4 text-white placeholder:text-white/30 focus:border-sky-500/50 focus:outline-none"
            />
          </div>
        </div>
      </motion.section>

      {/* Quick Tips */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            First Steps
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Quick <span className="text-white/20">Tips</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {troubleshootingTips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
            >
              <tip.icon size={32} className="mb-4 text-sky-400" />
              <h3 className="mb-2 font-bold text-white">{tip.title}</h3>
              <p className="text-sm text-white/50">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Category Filter */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Browse by Topic
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            FAQ <span className="text-white/20">Categories</span>
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              !activeCategory
                ? "bg-white text-black"
                : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
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

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
              <Search size={48} className="mx-auto mb-4 text-white/20" />
              <h3 className="mb-2 text-xl font-bold text-white">No results found</h3>
              <p className="text-white/50">Try a different search term or category</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const cat = categories.find(c => c.id === faq.category);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all ${
                    expandedFaq === i ? 'border-sky-500/30' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          cat ? `bg-gradient-to-br ${cat.color}` : 'bg-white/10'
                        }`}>
                          {cat && <cat.icon size={16} className="text-white" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                          <p className="mt-2 line-clamp-2 text-sm text-white/50">{faq.answer}</p>
                        </div>
                      </div>
                      {expandedFaq === i ? (
                        <ChevronDown size={20} className="mt-2 shrink-0 text-white/40" />
                      ) : (
                        <ChevronRight size={20} className="mt-2 shrink-0 text-white/40" />
                      )}
                    </div>
                  </button>

                  {expandedFaq === i && (
                    <div className="border-t border-white/5 px-6 pb-6 pt-4">
                      <p className="mb-4 text-sm leading-relaxed text-white/70">{faq.answer}</p>
                      
                      {faq.solutions && faq.solutions.length > 0 && (
                        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-400">
                            <CheckCircle2 size={16} /> Suggested Solutions
                          </h4>
                          <ul className="space-y-2">
                            {faq.solutions.map((solution, j) => (
                              <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                                <ChevronRight size={14} className="mt-1 shrink-0 text-emerald-400" />
                                {solution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </motion.section>

      {/* Error Codes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Reference
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Common Error <span className="text-white/20">Codes</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { code: "E_API_KEY", desc: "Invalid or missing API key", fix: "Check Settings > AI Providers" },
            { code: "E_RATE_LIMIT", desc: "API rate limit exceeded", fix: "Wait and retry, or upgrade plan" },
            { code: "E_NETWORK", desc: "Network connectivity issue", fix: "Check internet connection" },
            { code: "E_PERMISSION", desc: "Permission denied", fix: "Grant required permissions" },
            { code: "E_SYNC_FAIL", desc: "Sync operation failed", fix: "Reconnect mobile device" },
            { code: "E_PDF_GEN", desc: "PDF generation failed", fix: "Check template and content" }
          ].map((error) => (
            <div key={error.code} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between">
                <code className="rounded bg-red-500/10 px-3 py-1.5 font-mono text-sm text-red-400">
                  {error.code}
                </code>
              </div>
              <p className="mb-2 text-sm text-white/60">{error.desc}</p>
              <p className="text-xs text-emerald-400">{error.fix}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* File Locations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Reference
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Debug <span className="text-white/20">Locations</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="mb-2 font-bold text-white">App Logs</h4>
            <code className="text-xs text-sky-400">~/.config/aartiq-browser/logs/</code>
            <p className="mt-2 text-xs text-white/40">Application logs, error traces, and debug output</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="mb-2 font-bold text-white">Configuration</h4>
            <code className="text-xs text-sky-400">~/.config/aartiq-browser/config.json</code>
            <p className="mt-2 text-xs text-white/40">User settings, preferences, and API key references</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="mb-2 font-bold text-white">Main Process</h4>
            <code className="text-xs text-sky-400">aartiq-browser/main.js</code>
            <p className="mt-2 text-xs text-white/40">Electron main process: IPC handler registration, crash reporting via crashReporter</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="mb-2 font-bold text-white">Context Bridge</h4>
            <code className="text-xs text-sky-400">aartiq-browser/preload.js</code>
            <p className="mt-2 text-xs text-white/40">Preload script: contextBridge.exposeInMainWorld for secure IPC exposure</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="mb-2 font-bold text-white">Command Execution</h4>
            <code className="text-xs text-sky-400">src/core/shell-executor.js</code>
            <p className="mt-2 text-xs text-white/40">Shell command execution with risk level validation</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="mb-2 font-bold text-white">Security Validator</h4>
            <code className="text-xs text-sky-400">src/lib/Security.ts</code>
            <p className="mt-2 text-xs text-white/40">Command validation, shell sanitization, XSS prevention, URL validation</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}