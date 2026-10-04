import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";
import { net } from "@/data/facts";

export const metadata: Metadata = {
  title: "Privacy Policy",
    description: "Privacy Policy for Aartiq - AI-Integrated Browser. Learn how we handle your data, what we collect, and your rights.",
  alternates: {
    canonical: "https://aartiq.ponsrischool.in/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#03040b] text-white font-outfit">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-12 lg:py-20">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-sky-400"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <Shield size={24} className="text-sky-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
              <p className="mt-1 text-sm text-white/40">Last updated: July 13, 2026</p>
            </div>
          </div>
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-white/50">
            Aartiq is an open-source browser with a built-in AI assistant. This policy explains what data we
            handle, how it is processed, and your rights. Because Aartiq runs locally on your machine,
            most data never leaves your device.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {/* 1. Overview */}
          <section>
            <h2 id="overview" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Eye size={22} className="text-sky-400" />
              1. Overview
            </h2>
            <div className="glass-card p-8 space-y-4 text-white/60 leading-relaxed">
              <p>
                Aartiq is built with a <strong className="text-white/80">local-first architecture</strong>.
                The application runs entirely on your local machine. Your browsing data, AI conversations,
                file operations, and automation commands stay on your device unless you explicitly choose to
                sync or share them.
              </p>
              <p>
                We do <strong className="text-white/80">not</strong> operate servers that collect your personal data.
                We do <strong className="text-white/80">not</strong> sell, rent, or share your data with third parties
                for advertising or analytics purposes.
              </p>
            </div>
          </section>

          {/* 2. Data We Do NOT Collect */}
          <section>
            <h2 id="no-collection" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Lock size={22} className="text-green-400" />
              2. Data We Do NOT Collect
            </h2>
            <div className="glass-card p-8">
              <ul className="space-y-3 text-white/60 leading-relaxed">
                {[
                  "Browsing history — stays on your device only",
                  "AI chat conversations — processed locally or via your own API keys",
                  "Passwords and credentials — never transmitted to us",
                  "File contents — PDFs, documents, and generated files stay local",
                  "Shell commands and automation logs — stored locally in the audit log",
                  "Browser tab data — URLs, page content, and form data",
                  "Biometric data — used only for local permission approval, never stored",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Data That Stays Local */}
          <section>
            <h2 id="local-data" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Database size={22} className="text-purple-400" />
              3. Data That Stays on Your Device
            </h2>
            <div className="glass-card p-8 space-y-4 text-white/60 leading-relaxed">
              <p>The following data is stored locally on your machine and is <strong className="text-white/80">never uploaded to Aartiq servers</strong>:</p>
              <ul className="space-y-3 mt-4">
                {[
                  "Browser tabs, history, and bookmarks",
                  "AI chat history and RAG memory vectors",
                  "Permission approvals and audit logs",
                  "Generated PDFs, Excel, and PowerPoint files",
                  "Local LLM models (via Ollama)",
                  "MCP server configurations",
                  "Sync encryption keys (end-to-end encrypted)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4. Optional Cloud Sync */}
          <section>
            <h2 id="cloud-sync" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Globe size={22} className="text-blue-400" />
              4. Optional Cloud Sync (Firebase)
            </h2>
            <div className="glass-card p-8 space-y-4 text-white/60 leading-relaxed">
              <p>
                If you enable Cloud Sync, your data is synchronized across your devices via
                <strong className="text-white/80"> Firebase (Google)</strong> with end-to-end encryption (E2EE).
                This means:
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  "Data is encrypted on your device before being sent to Firebase",
                  "Only you hold the encryption keys — we cannot read your synced data",
                  "Sync is optional and disabled by default",
                  "You can disable sync and delete your cloud data at any time",
                  "Firebase operates under Google's privacy policy",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 5. AI API Keys */}
          <section>
            <h2 id="api-keys" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Lock size={22} className="text-amber-400" />
              5. AI API Keys
            </h2>
            <div className="glass-card p-8 space-y-4 text-white/60 leading-relaxed">
              <p>
                Aartiq supports AI providers like OpenAI, Anthropic, Google, Groq, and xAI. When you
                configure API keys:
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  "API keys are stored locally in your Electron app's secure storage",
                  "Keys are sent directly from your device to the AI provider's API — Aartiq never sees or relays them",
                  "We have no access to your API keys or the conversations sent through them",
                  "You can remove API keys at any time from Settings",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 6. MCP Servers */}
          <section>
            <h2 id="mcp-servers" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Shield size={22} className="text-cyan-400" />
              6. MCP Servers &amp; Third-Party Integrations
            </h2>
            <div className="glass-card p-8 space-y-4 text-white/60 leading-relaxed">
              <p>
                Aartiq implements the Model Context Protocol in two directions: it <strong className="text-white/80">exposes a local
                MCP server</strong> (aartiq-mcp) so Claude Desktop and other agents can drive the browser, and it can
                <strong className="text-white/80"> register approved external MCP servers</strong> (SSE/stdio) as tool providers.
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  `The agent API and the native bridge listen on ${net.agentApi.defaultBindAddress} only. The MCP SSE bridge (mcp-browser-server.js:1620) listens on every interface and offers no restrict switch.`,
                  "You choose which MCP servers to connect to and what tools to approve",
                  "Every tool call runs the fail-closed security pipeline (verb gate, tab lock, handler, prompt-injection scan)",
                  "High-risk tools require explicit confirmation before they execute, unless you have already granted that permission",
                  "We are not responsible for the data practices of external MCP servers you connect manually",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 7. Open Source */}
          <section>
            <h2 id="open-source" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Globe size={22} className="text-emerald-400" />
              7. Open Source &amp; Transparency
            </h2>
            <div className="glass-card p-8 space-y-4 text-white/60 leading-relaxed">
              <p>
                Aartiq™ is fully open source under the <strong className="text-white/80">Apache License 2.0</strong> (browser core)
                with the MCP server <strong className="text-white/80">MIT-licensed</strong>.
                You can audit every line of code to verify our privacy claims:
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  "Source code: github.com/Latestinssan/Aartiq",
                  "All data handling logic is auditable in the source",
                  "Community contributions and security reviews are welcome",
                  "No telemetry or analytics tracking code exists in the codebase",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 8. Changes */}
          <section>
            <h2 id="changes" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Database size={22} className="text-orange-400" />
              8. Changes to This Policy
            </h2>
            <div className="glass-card p-8 text-white/60 leading-relaxed space-y-4">
              <p>
                We may update this privacy policy from time to time. Changes will be posted on this page
                with an updated &quot;Last updated&quot; date. Since Aartiq is open source, any changes to data
                handling will be visible in the code repository.
              </p>
            </div>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 id="contact" className="mb-6 flex items-center gap-3 text-2xl font-black">
              <Mail size={22} className="text-pink-400" />
              9. Contact
            </h2>
            <div className="glass-card p-8 text-white/60 leading-relaxed space-y-4">
              <p>
                If you have questions about this privacy policy or Aartiq&apos;s data practices, reach out:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />
                  Email: <a href="mailto:support@ponsrischool.in" className="text-sky-400 hover:underline">support@ponsrischool.in</a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />
                  GitHub: <a href="https://github.com/Latestinssan/Aartiq/issues" target="_blank" className="text-sky-400 hover:underline">github.com/Latestinssan/Aartiq/issues</a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
