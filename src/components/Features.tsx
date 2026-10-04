"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cloud, Repeat, Bot, Globe, Database, Terminal, Sparkles, ExternalLink, Layers, Lock, Fingerprint } from "lucide-react";

const features = [
  {
    name: "AI Agent",
    description: "Multi-step tasks with RAG memory, thinking panels, and chain-of-thought reasoning — `src/lib/BrowserAI.ts`, `src/lib/AICommandParser.ts`.",
    icon: Bot,
    color: "text-blue-400"
  },
  {
    name: "JSON PDF Generation",
    description: "Structured multi-page document generation with icons, table of contents, and detail level control — `src/lib/AdvancedDocumentEngine.ts`.",
    icon: Sparkles,
    color: "text-purple-400"
  },
  {
    name: "Screenshot & OCR",
    description: "Visual analysis via Tesseract.js OCR, Claude/Gemini vision models, and screenshot capture — `src/lib/tesseract-service.js`, `src/components/ai/SecureDOMReader.ts`.",
    icon: ShieldCheck,
    color: "text-green-400"
  },
  {
    name: "Six-Layer Security",
    description: "Visual sandbox (OCR-only view), syntactic firewall, and human-in-the-loop authorization — `src/lib/Security.ts`, `src/lib/SecurityValidator.js`.",
    icon: Layers,
    color: "text-cyan-400"
  },
  {
    name: "Error-Proof Browser",
    description: "Resilient navigation with automatic retry handling for network failures, SSL errors, and page crashes — `main.js`, `src/service/ipc-service.js`.",
    icon: ExternalLink,
    color: "text-amber-400"
  },
  {
    name: "Low-Spec Optimized",
    description: "Runs on Intel i5-U with 8GB RAM, no GPU required — `package.json`.",
    icon: Zap,
    color: "text-yellow-400"
  },
  {
    name: "Multi-Platform",
    description: "Windows, macOS, Linux, Android. Native panels via Swift on macOS — `electron-builder.yml`, `flutter_browser_app/`, `src/lib/native-panels/`.",
    icon: Globe,
    color: "text-pink-400"
  },
  {
    name: "Local LLM Support",
    description: "Ollama integration for fully private local inference with no cloud dependency — `src/service/ollama-manager.js`, `src/service/model-selector.js`.",
    icon: Database,
    color: "text-indigo-400"
  },
  {
    name: "Master PIN & OS Keychain",
    description: "PBKDF2-SHA256 (100,000 rounds) Master PIN secured in Native OS Keychains (Apple Keychain, Windows DPAPI, Linux Secret Service) with 5-attempt lockout — `src/lib/MasterPINService.ts`.",
    icon: Lock,
    color: "text-emerald-400"
  },
  {
    name: "Dual-Gate Biometrics",
    description: "Permission relay binding Master PIN and mobile device lock (Android Screen Lock / biometrics) for remote and high-risk action gating — `src/lib/PermissionRelayService.ts`.",
    icon: Fingerprint,
    color: "text-cyan-400"
  },
  {
    name: "Unified Sessions",
    description: "Unified aggregator synchronizing live tabs, history, automation tasks, permissions, and sync snapshots across desktop and mobile — `src/lib/UnifiedSessionManager.ts`.",
    icon: Repeat,
    color: "text-violet-400"
  },
  {
    name: "OS-Level Sandboxing",
    description: "macOS Seatbelt, Linux bubblewrap, and Windows AppContainer + Job Objects with fail-closed directory and network confinement — `src/core/sandbox-executor.js`.",
    icon: ShieldCheck,
    color: "text-red-400"
  },
];

const Features = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, i) => (
        <motion.div
          key={feature.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          className="glass-card p-8 group cursor-pointer hover:border-[#00ffff]/30 transition-all border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent"
        >
          <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#00ffff]/10 transition-colors`}>
            <feature.icon
              className={`h-6 w-6 text-white/40 group-hover:text-[#00ffff] transition-colors`}
              aria-hidden="true"
            />
          </div>
          <dt className="text-xs font-black uppercase tracking-widest text-white mb-3">
            {feature.name}
          </dt>
          <dd className="text-[10px] font-bold uppercase tracking-tight text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">
            {feature.description}
          </dd>
        </motion.div>
      ))}
    </div>
  );
};

export default Features;
