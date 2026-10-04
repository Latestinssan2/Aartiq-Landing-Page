"use client";

import { net } from "@/data/facts";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Boxes, 
  Search, 
  Cpu, 
  ArrowRight,
  FileText,
  Bot,
  ExternalLink
} from "lucide-react";

const GH = 'https://github.com/Latestinssan/Aartiq/blob/main';

function refUrl(ref: string): string | null {
  const idx = ref.indexOf(':');
  if (idx <= 0) return null;
  const file = ref.slice(0, idx).trim();
  const lineSpec = ref.slice(idx + 1).trim();
  if (!/^(src|public|aartiq-mcp|scripts|tests|Audit\sReport|release_notes)\//.test(file)) return null;
  const first = lineSpec.split(',')[0].trim();
  const lines = first.split('-');
  const anchor = lines.length > 1 ? `#L${lines[0]}-L${lines[1]}` : `#L${lines[0]}`;
  return `${GH}/${file}${anchor}`;
}

const sections = [
  {
    id: "what",
    title: "What a 'skill' is",
    icon: Boxes,
    body: "In Aartiq, 'skills' refer to two distinct but related mechanisms. Both are documented here so the terminology is unambiguous.",
    points: [
      {
        h: "Markdown prompt skills",
        p: "A skill is a Markdown file in public/skills/<name>.md that holds instructions the AI loads on demand. SkillLoader is a singleton that reads built-in files (app bundle), a userData override, and falls back to inline instructions for some formats (e.g. pdf, docx) when no file is present. It strips YAML-ish frontmatter and 'Aartiq runtime note' blocks and caches the result.",
        refs: ["src/lib/SkillLoader.ts:9-140"],
      },
      {
        h: "Capability catalog (SkillRegistry)",
        p: "A skill is also a metadata descriptor — id, label, description, icon, and a regex 'patterns' field — used for on-demand matching so the system prompt is not bloated with every skill's content on every request. matchSkills tests each skill's patterns against the user's message and always injects 'security' for credential terms and 'automation' for shell terms.",
        refs: ["src/lib/SkillRegistry.ts:1-64"],
      },
    ],
  },
  {
    id: "builtin",
    title: "Built-in skill catalog",
    icon: Bot,
    body: "The catalog is defined in SkillRegistry.ts. These are the skills the model can discover and load; the Markdown bodies live in public/skills/.",
    table: {
      head: ["Skill id", "What it is for"],
      rows: [
        ["research", "Web research / deep reading"],
        ["analysis", "Data and content analysis"],
        ["finance", "Financial documents and calculations"],
        ["documents", "Document generation and editing"],
        ["browsing", "Page navigation and interaction"],
        ["automation", "Shell / scheduling / workflow automation (always injected for shell terms)"],
        ["mcp", "Model Context Protocol tool use"],
        ["apple-intelligence", "macOS Apple Intelligence features"],
        ["tab-intelligence", "Reasoning over open tabs"],
        ["image-generation", "Image creation"],
        ["scheduling", "Background task scheduling"],
        ["security", "Credential / safe-handling guidance (always injected for credential terms)"],
        ["settings", "App configuration help"],
        ["xlsx / pptx / pdf / docx", "Spreadsheet / slide / PDF / Word generation"],
      ],
    },
    refs: ["src/lib/SkillRegistry.ts:15-29", "public/skills/ (research.md, analysis.md, finance.md, documents.md, browsing.md, automation.md, mcp.md, apple-intelligence.md, tab-intelligence.md, image-generation.md, scheduling.md, security.md, settings.md, xlsx.md, pptx.md, pdf.md, docx.md)"],
  },
  {
    id: "loading",
    title: "How skills are loaded at runtime",
    icon: Search,
    body: "The chat interface parses user requests like 'load/use/activate <skill>', picks matching skills via matchSkills, and fetches their Markdown via window.electronAPI.loadSkill(skillId), which routes to SkillLoader.load. Loaded skill ids are shown to the user in a collapsible 'N skills loaded' chip (CollapsibleSkillMessage).",
    points: [
      { h: "User trigger", p: "AIChatSidebar parses 'load/use/activate <skill>' and resolves via matchSkills.", refs: ["src/components/AIChatSidebar.tsx:91,1686-1712"] },
      { h: "UI display", p: "CollapsibleSkillMessage renders loaded skill ids as chips; returns null when none are loaded.", refs: ["src/components/ai/CollapsibleSkillMessage.tsx:4-68"] },
    ],
  },
  {
    id: "agent-api",
    title: "Agent API: MCP + HTTP tools",
    icon: Cpu,
    body: "Separate from prompt skills, the agent API exposes executable tools over two transports from one codebase. This is what external agents / MCP clients use to drive Aartiq.",
    points: [
      {
        h: "ToolRegistry (security pipeline)",
        p: "Every tool call runs a fail-closed pipeline: verb gate -> tab lock -> handler -> untrusted-output injection scan. A rejected gate returns an error result, never the action. Untrusted tool output is scanned for prompt-injection and quarantined if unsafe.",
        refs: ["src/lib/agent-api/registry.ts:1-89"],
      },
      {
        h: "Transports",
        p: "HTTP: POST /api/<method> with an x-agent-id header (GET /health returns tool count). MCP: ListTools / CallTool over stdio via the MCP SDK. Both are started if enabled.",
        refs: ["src/lib/agent-api/server.ts:1-126"],
      },
      {
        h: "Providers",
        p: `Model-agnostic config: LM Studio (http://127.0.0.1:1234/v1), Ollama (http://127.0.0.1:11434/v1), and OpenClaw (http://127.0.0.1:18789). The agent API binds to ${net.agentApi.defaultBindAddress} by default (${net.agentApi.bindsAllInterfacesWhen || "never"} is the only path to external reach) with defaultTrust 'limited'.`,
        refs: ["src/lib/agent-api/providers.ts:19-80"],
      },
      {
        h: "Tool surface",
        p: "28 tools across 9 categories, registered in ALL_TOOLS. Security (4): security_scan, security_audit, security_killswitch, trust_list. Agents (4): agent_register, agent_list, agent_revoke, tab_handoff. Snapshots (4): snapshot, click_ref, fill_ref, type_ref. Forms (3): autofill_match, vault_list, vault_unlock. Extensions (4): extension_list, extension_install_webstore, extension_import_chrome, extension_analyze. Theme (2): theme_resolve, ui_mode_set. Navigation (2): navigate, get_page_text. Tabs (3): list_tabs, new_tab, close_tab. System (2): browser_status, open_panel.",
        refs: ["src/lib/agent-api/tools.ts:22-197"],
      },
    ],
  },
  {
    id: "planner",
    title: "Planning agents (note: not skill-driven)",
    icon: FileText,
    body: "The planner and agent registry are a separate agent-loop mechanism. The Planner breaks a goal into a structured Plan and re-plans every N steps; agent-registry tracks connected agents, their trust level, and tab locks. Neither imports SkillRegistry or SkillLoader — planning is orthogonal to the prompt-skill system.",
    points: [
      { h: "Planner", p: "planningInterval default 3, maxStepsPerPlan 10; completion scored on steps executed, answer length, and domain match (>=0.8 = high confidence).", refs: ["src/lib/agent/planner.ts:3-142"] },
      { h: "Agent registry", p: "Agents connect with default trust 'limited'; authorize() denies actions the trust level cannot perform; lockTab reserves a tab.", refs: ["src/lib/agent/agent-registry.ts:1-79"] },
      { h: "Agent types", p: "AgentRole = 'planner' | 'navigator'; AgentState = idle | planning | executing | evaluating | finished | error.", refs: ["src/lib/agent/types.ts:1-9"] },
    ],
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-20">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Boxes size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">Skills</span>
        </div>
        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Aartiq <span className="text-white/20">Skills</span>
        </h1>
        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Aartiq has two skill mechanisms — on-demand Markdown prompt skills and a capability catalog — plus a
          separate agent API that exposes tools over MCP and HTTP. Every claim below cites the source file and line.
        </p>
      </motion.section>

      {sections.map((s) => (
        <motion.section
          key={s.id}
          id={s.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="scroll-mt-24"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-sky-400">
              <s.icon size={22} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">{s.title}</h2>
          </div>

          <p className="mb-8 max-w-3xl text-base font-medium leading-relaxed text-white/50">{s.body}</p>

          {s.points?.map((pt) => (
            <div key={pt.h} className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h4 className="mb-2 text-lg font-bold text-white">{pt.h}</h4>
              <p className="text-sm leading-relaxed text-white/60">{pt.p}</p>
              <div className="mt-4 space-y-1 border-t border-white/5 pt-3">
                {pt.refs.map((r) => {
                  const url = refUrl(r);
                  return url ? (
                    <a key={r} href={url} target="_blank" rel="noopener noreferrer" className="block text-[11px] font-mono text-sky-400/70 transition hover:text-sky-300 hover:underline">
                      {r} <ExternalLink size={10} className="inline" />
                    </a>
                  ) : (
                    <code key={r} className="block text-[11px] font-mono text-sky-400/70">{r}</code>
                  );
                })}
              </div>
            </div>
          ))}

          {s.table && (
            <div className="overflow-hidden rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-white/40">
                  <tr>
                    {s.table.head.map((h) => (
                      <th key={h} className="px-5 py-3 font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-white/5 align-top">
                      <td className="px-5 py-3 font-mono text-xs text-sky-300">{row[0]}</td>
                      <td className="px-5 py-3 text-white/60">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {s.refs && (
            <div className="mt-6 space-y-1">
              {s.refs.map((r) => {
                const url = refUrl(r);
                return url ? (
                  <a key={r} href={url} target="_blank" rel="noopener noreferrer" className="block text-[11px] font-mono text-sky-400/70 transition hover:text-sky-300 hover:underline">
                    {r} <ExternalLink size={10} className="inline" />
                  </a>
                ) : (
                  <code key={r} className="block text-[11px] font-mono text-sky-400/70">{r}</code>
                );
              })}
            </div>
          )}
        </motion.section>
      ))}

      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <h3 className="mb-3 text-xl font-black uppercase tracking-tight">Related</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/docs/ai-commands" className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300">
            AI Commands <ArrowRight size={14} />
          </Link>
          <Link href="/docs/security" className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300">
            Security Model <ArrowRight size={14} />
          </Link>
          <Link href="/features" className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300">
            Feature Reference <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
