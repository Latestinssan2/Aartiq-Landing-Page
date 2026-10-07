"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useVersion } from "@/lib/useVersion";
import { benchmarks, derived, network, version, project } from "@/data/facts";
import { 
  Bot, 
  ShieldCheck, 
  Zap, 
  Globe,
  Database,
  Terminal,
  Smartphone,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock,
  Eye,
  FileText,
  Timer,
  Workflow,
  Heart,
  Brain,
  Bookmark,
  AlertTriangle,
  Scale,
  Quote,
  Sparkles
} from "lucide-react";

const keyFeatures = [
  {
    icon: Bot,
    title: "AI Agent",
    description: "Multi-step tasks with chain-of-thought reasoning, RAG memory, and real-time action tracking.",
    fileRef: "src/lib/AIAgent.ts",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
    href: "/docs/ai-commands"
  },
  {
    icon: ShieldCheck,
    title: "Six-Layer Security",
    description: "Visual sandbox, syntactic firewall, and human-in-the-loop authorization prevent unauthorized actions.",
    fileRef: "src/lib/Security.ts",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    href: "/docs/security"
  },
  {
    icon: Terminal,
    title: "Shell Commands",
    description: "Execute terminal commands with explicit permission gating and cross-device authorization.",
    fileRef: "src/core/command-executor.js",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-400",
    href: "/docs/ai-commands#shell"
  },
  {
    icon: FileText,
    title: "PDF Generation",
    description: "Generate structured multi-page PDFs with icons, tables, branding, and screenshot embedding.",
    fileRef: "src/lib/AdvancedDocumentEngine.ts",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-400",
    href: "/docs/ai-commands#pdf"
  },
  {
    icon: Timer,
    title: "Background Scheduling",
    description: "Schedule tasks to run automatically, even when the browser is closed. Works as a system service.",
    fileRef: "src/service/",
    color: "from-indigo-500/20 to-violet-500/20",
    borderColor: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    href: "/docs/automation"
  },
  {
    icon: Smartphone,
    title: "Mobile Control",
    description: "Control your desktop from your phone. Approve high-risk actions via QR code scanning.",
    fileRef: "src/lib/WiFiSyncService.ts",
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/20",
    iconColor: "text-pink-400",
    href: "/docs/getting-started#mobile"
  },
  {
    icon: Cpu,
    title: "Live Model Catalogs",
    description: "Refresh official provider model lists for Gemini, OpenAI, Claude, Groq, and xAI directly inside settings.",
    fileRef: "src/lib/",
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/20",
    iconColor: "text-cyan-300",
    href: "/docs/api-reference#ai"
  },
  {
    icon: Heart,
    title: "Preference Auto-Learning",
    description: "AI detects and remembers user preferences — response style, tone, language, and behavior — across sessions without manual configuration.",
    fileRef: "src/lib/",
    color: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-500/20",
    iconColor: "text-rose-400",
    href: "/docs/ai-commands"
  },
  {
    icon: Brain,
    title: "Cross-Session RAG",
    description: "Past conversations are automatically ingested into vector memory and available as RAG context in future sessions for continuity.",
    fileRef: "src/lib/AIAgent.ts",
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/20",
    iconColor: "text-violet-400",
    href: "/docs/ai-commands"
  },
  {
    icon: Bookmark,
    title: "SAVE_PREFERENCE",
    description: "AI persists user preferences via the SAVE_PREFERENCE command, enabling personalized interactions without manual setup.",
    fileRef: "src/lib/AICommandParser.ts",
    color: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-400",
    href: "/docs/ai-commands"
  },
];

const architectureLayers = [
  {
    name: "User Interface Layer",
    description: "Electron shell with native menus, SwiftUI sidebar on macOS, Flutter mobile app",
    components: ["Next.js Frontend", "SwiftUI macOS UI", "Flutter Mobile App"],
    color: "bg-sky-500"
  },
  {
    name: "AI Orchestration Layer",
    description: "Multi-model support (Gemini, Claude, OpenAI, Groq, xAI, Ollama, Apple Intelligence utilities) with RAG memory and thinking panels",
    components: ["AI Chat Sidebar", "Thinking Panel", "Command Parser", "RAG Memory"],
    color: "bg-purple-500"
  },
  {
    name: "Automation Engine",
    description: "Task scheduling, shell command execution, browser automation, and screenshot capture",
    components: ["Scheduler Service", "Shell Executor", "Browser Controller", "OCR Service"],
    color: "bg-emerald-500"
  },
  {
    name: "Security Layer",
    description: "Six layers: visual sandbox, syntactic firewall, human-in-the-loop, directory allowlist, OS sandboxing, capability-scoped execution",
    components: ["Permission Store", "PII Scrubber", "Injection Detector", "QR Auth"],
    color: "bg-amber-500"
  },
  {
    name: "Platform Integration",
    description: "Cross-platform support for Windows, macOS, Linux, Android with native APIs",
    components: ["Electron Main Process", "Flutter Bridge", "Firebase Sync", "WiFi P2P"],
    color: "bg-rose-500"
  },
];

const supportedProviders = [
  { name: "Google Gemini", type: "Cloud", status: "Live Catalogs", icon: "G" },
  { name: "OpenAI GPT", type: "Cloud", status: "Live Catalogs", icon: "O" },
  { name: "Anthropic Claude", type: "Cloud", status: "Supported", icon: "A" },
  { name: "Groq", type: "Cloud", status: "Fastest", icon: "G" },
  { name: "xAI Grok", type: "Cloud", status: "Live Catalogs", icon: "X" },
  { name: "Ollama", type: "Local", status: "Private", icon: "O" },
  { name: "Apple Intelligence", type: "Native macOS", status: "Preview", icon: "A" },
];

export default function OverviewPage() {
  const { version } = useVersion();
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <div className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Documentation v{version || '...'}
          </span>
        </div>
        
        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl lg:text-8xl">
          What is <br />
          <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Aartiq?
          </span>
        </h1>

        {/* The brand tagline is carried by the Project Philosophy heading further
            down — it is deliberately not repeated under the H1. */}
        
        <p className="mx-auto mb-12 max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Aartiq is an open-source Electron application that integrates large 
          language models with native OS APIs for permission-gated automation. 
          Source: main.js, preload.js, src/lib/, src/core/
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/getting-started"
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-sky-400 hover:text-white"
          >
            Get Started <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/docs/ai-commands"
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            AI Commands <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.section>

      {/* Key Features Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-sky-400">
            Core Features
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Module <span className="text-white/20">Reference</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={feature.href}
                className={`group block rounded-[40px] border ${feature.borderColor} bg-gradient-to-br ${feature.color} p-10 transition-all hover:scale-[1.02] hover:shadow-2xl`}
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/5 ${feature.iconColor} shadow-lg`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="mb-4 text-xl font-black uppercase tracking-wider">{feature.title}</h3>
                <p className="mb-4 text-sm font-medium leading-relaxed text-white/50">{feature.description}</p>
                <p className="mb-6 font-mono text-[10px] text-white/20">{feature.fileRef}</p>
                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${feature.iconColor} opacity-0 transition-opacity group-hover:opacity-100`}>
                  Learn More <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Architecture Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-sky-400">
            Architecture
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            System <span className="text-white/20">Design</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Aartiq uses a layered architecture that separates concerns while maintaining 
            tight integration between AI intelligence and platform capabilities.
          </p>
        </div>

        <div className="space-y-4">
          {architectureLayers.map((layer, i) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
              
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${layer.color}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                      Layer {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-black uppercase tracking-wider">{layer.name}</h3>
                  <p className="text-sm font-medium text-white/40">{layer.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {layer.components.map((component) => (
                    <span
                      key={component}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/40"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI Providers Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-sky-400">
            AI Integration
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Multi-Model <span className="text-white/20">Support</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Choose the right model for your task. Use cloud APIs for power or run 
            locally for complete privacy.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportedProviders.map((provider, i) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center justify-between rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-lg font-black text-white/60">
                  {provider.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white">{provider.name}</h4>
                  <p className="text-xs text-white/30">{provider.type}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                provider.status === "Recommended" 
                  ? "bg-sky-500/20 text-sky-400"
                  : provider.status === "Private"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/10 text-white/40"
              }`}>
                {provider.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Performance Benchmarks */}
      <motion.section
        id="performance-benchmarks"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-sky-400">
            Performance Benchmarks
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Performance <span className="text-white/20">Data</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Benchmarks measured on physical hardware using the methodology described below. Results may vary depending on hardware, operating system version, and installed extensions.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/40">
            Figures below were <strong className="text-sky-300">{derived.benchmarkLabel}</strong>, not on the
            current release (v{benchmarks.currentVersion}). {benchmarks.provenance}
          </p>
        </div>

        {/* Device */}
        <div className="mb-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h3 className="mb-6 text-sm font-black uppercase tracking-[0.3em] text-white/40">Test Environment</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Device", value: `${benchmarks.hardware.machine} (${benchmarks.hardware.model})` },
              { label: "Chip", value: `Apple ${benchmarks.hardware.chip} — ${benchmarks.hardware.cores} cores` },
              { label: "RAM", value: `${benchmarks.hardware.memoryGb} GB` },
              { label: "OS", value: `${benchmarks.hardware.os} (${benchmarks.hardware.osBuild})` },
              { label: "App Version", value: benchmarks.benchmarkVersion },
              { label: "Date", value: benchmarks.date },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                <span className="text-xs text-white/40">{item.label}</span>
                <code className="text-xs font-mono text-sky-300">{item.value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Time */}
        <div className="mb-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6">
          <p className="mb-3 text-sm font-medium text-white/50">
            Measures the elapsed time from launching the application to the first visible application window. This is not a measurement of full renderer initialization, AI service readiness, or feature availability. Aartiq displays the Chromium window immediately while background services (AI providers, MCP bridge, sync, OCR, etc.) continue initializing asynchronously.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60">Cold Start (Window Visible)</p>
            <p className="text-5xl font-black text-emerald-400">{benchmarks.results[0].value.replace("s", "")}<span className="text-2xl">s</span></p>
            <p className="mt-2 text-xs text-white/40">Process start → First visible window</p>
            <p className="mt-1 text-[10px] text-white/20">{derived.benchmarkLabel}</p>
          </div>
          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/5 p-8 text-center">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400/60">Warm Start</p>
            <p className="text-5xl font-black text-sky-400">{benchmarks.results[1].value.replace("s", "")}<span className="text-2xl">s</span></p>
            <p className="mt-2 text-xs text-white/40">From OS file cache (second launch)</p>
          </div>
          <div className="rounded-[2rem] border border-purple-500/20 bg-purple-500/5 p-8 text-center">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/60">Memory (Main)</p>
            <p className="text-5xl font-black text-purple-400">{benchmarks.details.find((d) => d.metric === "Main Process RSS")?.value.split(" ")[0]}<span className="text-2xl">MB</span></p>
            <p className="mt-2 text-xs text-white/40">RSS at steady state ({benchmarks.hardware.memoryGb} GB total)</p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mt-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h3 className="mb-6 text-sm font-black uppercase tracking-[0.3em] text-white/40">Detailed Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-xs font-black uppercase tracking-wider text-white/40">Metric</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-wider text-white/40">Value</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-wider text-white/40">Notes</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white/60">
                {[
                  ...benchmarks.details,
                  {
                    metric: "Active Ports",
                    value: network.servers.map((s) => s.port).filter((p, i, a) => a.indexOf(p) === i).join(", "),
                    notes: network.servers.map((s) => s.id).join(", "),
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 font-medium text-white/70">{row.metric}</td>
                    <td className="py-3"><code className="rounded bg-white/5 px-2 py-1 text-xs font-mono text-sky-300">{row.value}</code></td>
                    <td className="py-3 text-xs text-white/40">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Measure it yourself */}
        <div className="mt-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8">
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-amber-400/60">
            Measure It Yourself
          </h3>
          <p className="mb-4 text-sm text-white/50">
            These are not the commands that produced the table above — no such script was
            committed, which is what the provenance note says. They are the equivalent
            measurements you can run on your own machine to compare your numbers against
            ours:
          </p>
          <div className="rounded-xl bg-black/40 p-4 font-mono text-xs text-white/60">
            <p className="text-white/30"># Kill any running instance</p>
            <p className="text-emerald-400">{`pkill -f "Aartiq" && sleep 4`}</p>
            <p className="mt-2 text-white/30"># Measure cold launch</p>
            <p className="text-emerald-400">{`START=$(python3 -c "import time; print(time.time())")`}</p>
            <p className="text-emerald-400">{`open -a Aartiq`}</p>
            <p className="text-emerald-400">{`for i in $(seq 1 40); do sleep 0.1; VISIBLE=$(osascript -e 'tell application "System Events" to tell process "Aartiq" to get visible' 2>/dev/null); if [ "$VISIBLE" = "true" ]; then echo "Window visible"; break; fi; done`}</p>
            <p className="mt-2 text-white/30"># Measure memory</p>
            <p className="text-emerald-400">{`sleep 3 && ps -p $(pgrep -f "Aartiq.app/Contents/MacOS/Aartiq") -o rss=,vsz=,%cpu=,%mem=`}</p>
          </div>
        </div>
      </motion.section>

      {/* Project Philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 lg:p-16 text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
          <Quote size={14} /> Project Philosophy
        </div>
        <h2 className="mb-8 text-4xl font-black uppercase tracking-tighter sm:text-5xl">
          For The <span className="text-white/20">Questions That Matter.</span>
        </h2>
        <p className="mx-auto max-w-3xl text-xl font-bold leading-relaxed text-white/80">
          The most important question isn't what you ask AI. It's what AI asks you before it acts.
        </p>
        <blockquote className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-relaxed text-white/40">
          "Aartiq™ exists because one unasked question taught me that the questions we don't ask matter most."
        </blockquote>
        <p className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-relaxed text-white/40">
          That idea became the foundation of Aartiq's permission-first design: before any non-trivial action,
          the AI explains its plan, asks for your approval, and only then executes it.
        </p>
      </motion.section>

      {/* Project Status */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/[0.03] p-10 lg:p-16"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
          <AlertTriangle size={14} /> 🚧 Project Status
        </div>
        <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter sm:text-5xl">
          Aartiq™ is in <span className="text-amber-400">AI-assisted development.</span>
        </h2>
        <div className="space-y-5 text-base font-medium leading-relaxed text-white/40">
          <p>
            Aartiq is a solo project in active AI-assisted development: AI agents handle day-to-day issue triage, analysis, and fix preparation,
            and a human reviews and approves every change to security, permissions, user data, or releases before it ships. The repository stays
            public, existing releases stay available, and bug reports go to GitHub issues, triaged in the order things break.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8">
            <blockquote className="text-lg font-bold leading-relaxed text-white/70">
              "What happened to my private diary should never happen to a computer system."
            </blockquote>
            <p className="mt-4 text-sm text-white/40">Aartiq was built on one belief.</p>
          </div>
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8">
            <blockquote className="text-lg font-bold leading-relaxed text-white/70">
              "Aartiq exists because one unasked question taught me that the questions we don't ask matter most."
            </blockquote>
            <p className="mt-4 text-sm text-white/40">This is not the end of the journey.</p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-purple-500/20 bg-purple-500/5 p-8 text-center">
          <p className="text-xl font-black uppercase tracking-tighter text-white sm:text-2xl">
            {project.origin.oneCm}
          </p>
          <p className="mt-6 text-base font-bold text-white/60">
            Thank you for your patience and support. <span className="text-rose-400">❤️</span>
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">— Latestinssan</p>
        </div>
      </motion.section>

      {/* License */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 lg:p-16"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
          <Scale size={14} /> Legal
        </div>
        <h2 className="mb-8 text-4xl font-black uppercase tracking-tighter sm:text-5xl">License</h2>

        <div className="overflow-hidden rounded-[2rem] border border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Component</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">License</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-white/60">
              <tr className="border-b border-white/5">
                <td className="px-6 py-4">Aartiq Browser (desktop, mobile, all core code)</td>
                <td className="px-6 py-4"><span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">Apache License 2.0</span></td>
              </tr>
              <tr>
                <td className="px-6 py-4">Aartiq MCP Server (aartiq-mcp/)</td>
                <td className="px-6 py-4"><span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-sky-400">MIT License</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm font-medium leading-relaxed text-white/40">
          The MCP server is MIT-licensed for maximum compatibility with Claude Desktop and other MCP clients.
          All other components remain Apache 2.0.
        </p>
        <p className="mt-6 rounded-[1.5rem] border border-amber-500/10 bg-amber-500/[0.03] p-6 text-sm font-medium leading-relaxed text-white/40">
          "Aartiq™ is a trademark of <span className="text-white/70">Latestinssan</span>.
          While our source code is freely available under the Apache 2.0 License, this license does not grant
          permission to use the trade name, logos, or branding of Aartiq. Any modified distributions of this
          browser must be rebranded under a completely different name."
        </p>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-white/30">
          © 2026 Aartiq™. All rights reserved.
        </p>
      </motion.section>
    </div>
  );
}