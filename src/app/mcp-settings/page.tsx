"use client";

import { net } from "@/data/facts";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Cpu,
  Bot,
  Cable,
  MessageSquare,
  Shield,
  Globe,
  Terminal,
  FileText,
  Layers,
  Bookmark,
  Lock,
  Calendar,
  Play,
  Settings,
  Info,
  Server,
  KeyRound,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  PanelTop,
  type LucideIcon,
} from 'lucide-react';

const GH = 'https://github.com/Latestinssan/Aartiq/blob/main';

interface SourceRef {
  label: string;
  url: string;
}

interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  refs: SourceRef[];
}

const categories: Category[] = [
  {
    name: 'Panel Control',
    icon: PanelTop,
    color: 'bg-sky-500',
    description: 'Open any browser panel on demand — settings (per-section), bookmarks, history, downloads, clipboard, permissions, sync, and command center.',
    refs: [{ label: 'aartiq-mcp/server/index.js:19-76', url: `${GH}/aartiq-mcp/server/index.js#L19-L76` }],
  },
  {
    name: 'AI Sidebar Control',
    icon: Bot,
    color: 'bg-emerald-500',
    description: 'Open and drive the AI sidebar, which is the path to full capabilities: PDF generation, navigation, research, and tool execution.',
    refs: [{ label: 'aartiq-mcp/server/index.js:77-98', url: `${GH}/aartiq-mcp/server/index.js#L77-L98` }],
  },
  {
    name: 'AI Chat (Sidebar-Powered)',
    icon: MessageSquare,
    color: 'bg-purple-500',
    description: 'send_ai_prompt routes through the real sidebar so MCP clients get RAG, web search, document generation, and live browser actions — not a stubbed chat.',
    refs: [{ label: 'aartiq-mcp/server/index.js:99-132', url: `${GH}/aartiq-mcp/server/index.js#L99-L132` }],
  },
  {
    name: 'Settings Control',
    icon: Settings,
    color: 'bg-amber-500',
    description: 'Read and modify any browser setting — profile, appearance, search, API keys, privacy, permissions, shortcuts, history, automation, sync, extensions, plugins, MCP, about, updates, performance, system, admin.',
    refs: [{ label: 'aartiq-mcp/server/index.js:133-252', url: `${GH}/aartiq-mcp/server/index.js#L133-L252` }],
  },
  {
    name: 'Bookmarks & History',
    icon: Bookmark,
    color: 'bg-rose-500',
    description: 'Add, list, and remove bookmarks; browse and clear browsing history through the vault.',
    refs: [{ label: 'aartiq-mcp/server/index.js:253-304', url: `${GH}/aartiq-mcp/server/index.js#L253-L304` }],
  },
  {
    name: 'Permission & Security',
    icon: Shield,
    color: 'bg-emerald-500',
    description: 'List, grant, and revoke permissions; read and update security settings and firewall levels.',
    refs: [{ label: 'aartiq-mcp/server/index.js:305-374', url: `${GH}/aartiq-mcp/server/index.js#L305-L374` }],
  },
  {
    name: 'Automation & Scheduling',
    icon: Calendar,
    color: 'bg-indigo-500',
    description: 'Create, list, toggle, delete, and run scheduled tasks — cron-based automation driven by the agent.',
    refs: [{ label: 'aartiq-mcp/server/index.js:375-455', url: `${GH}/aartiq-mcp/server/index.js#L375-L455` }],
  },
  {
    name: 'Browser Control',
    icon: Globe,
    color: 'bg-blue-500',
    description: 'Full browser control: navigation, tabs, page reading, form filling, screenshots — with the same fail-closed sandboxing as direct commands.',
    refs: [{ label: 'aartiq-mcp/server/index.js:456-562', url: `${GH}/aartiq-mcp/server/index.js#L456-L562` }],
  },
  {
    name: 'Video & Media',
    icon: Play,
    color: 'bg-red-500',
    description: 'Search and play YouTube videos inline, plus media and system media control.',
    refs: [{ label: 'aartiq-mcp/server/index.js:563-590', url: `${GH}/aartiq-mcp/server/index.js#L563-L590` }],
  },
  {
    name: 'System & Clipboard',
    icon: Terminal,
    color: 'bg-orange-500',
    description: 'Clipboard, volume, brightness, and system automation routed through the permission-gated shell.',
    refs: [{ label: 'aartiq-mcp/server/index.js:591-647', url: `${GH}/aartiq-mcp/server/index.js#L591-L647` }],
  },
  {
    name: 'App Info & Knowledge',
    icon: Info,
    color: 'bg-cyan-500',
    description: 'explain_feature, list_all_features, and get_security_overview tools give clients an auditable map of the surface they are driving.',
    refs: [{ label: 'aartiq-mcp/server/index.js:648-891', url: `${GH}/aartiq-mcp/server/index.js#L648-L891` }],
  },
];

interface ArchCard {
  icon: LucideIcon;
  title: string;
  color: string;
  body: string;
  points: { text: string; refs: SourceRef[] }[];
}

const architecture: ArchCard[] = [
  {
    icon: Server,
    title: 'MCP stdio server (aartiq-mcp)',
    color: 'text-emerald-400',
    body: 'A standalone, MIT-licensed MCP server bundle (aartiq-mcp/) that any MCP client can launch via stdio. It exposes 64 tools across 11 categories and bridges into the running Aartiq browser over a local HTTP bridge.',
    points: [
      { text: 'ListTools / CallTool request handlers over the MCP SDK.', refs: [{ label: 'server/index.js:1185-1192', url: `${GH}/aartiq-mcp/server/index.js#L1185-L1192` }] },
      { text: 'Tool dispatch through handleToolCall.', refs: [{ label: 'server/index.js:892', url: `${GH}/aartiq-mcp/server/index.js#L892` }] },
      { text: `Bridge host comes from AARTIQ_BRIDGE_PORT, default ${net.nativeBridge.port}.`, refs: [{ label: 'server/index.js:11-12', url: `${GH}/aartiq-mcp/server/index.js#L11-L12` }] },
    ],
  },
  {
    icon: Cable,
    title: 'Loopback HTTP bridge',
    color: 'text-sky-400',
    body: 'The stdio server never talks to the browser directly. A BridgeClient forwards each tool call over plain HTTP to the browser process, which alone holds the real capabilities.',
    points: [
      { text: `Default host ${net.nativeBridge.defaultBindAddress}, default port ${net.nativeBridge.port} — loopback only. BridgeClient talks to the native bridge; the agent API moved to ${net.agentApi.port}, so the two no longer share a port.`, refs: [{ label: 'server/bridge-client.js:3-4', url: `${GH}/aartiq-mcp/server/bridge-client.js#L3-L4` }] },
      { text: 'BridgeClient class with per-request timeout and AI response polling.', refs: [{ label: 'server/bridge-client.js:9', url: `${GH}/aartiq-mcp/server/bridge-client.js#L9-L12` }] },
    ],
  },
  {
    icon: Lock,
    title: 'Agent API ToolRegistry',
    color: 'text-rose-400',
    body: 'Inside the browser, the agent-api ToolRegistry is the single enforcement point for every tool call over both MCP and HTTP transports.',
    points: [
      { text: 'Fail-closed pipeline: verb gate → tab lock → handler → untrusted-output injection scan. A rejected gate returns an error result, never the action.', refs: [{ label: 'src/lib/agent-api/registry.ts:1-89', url: `${GH}/aartiq-browser/src/lib/agent-api/registry.ts#L1-L89` }] },
      { text: 'Verbs are gated by origin with approval when required.', refs: [{ label: 'registry.ts:43-57', url: `${GH}/aartiq-browser/src/lib/agent-api/registry.ts#L43-L57` }] },
      { text: 'Only one agent may hold a tab at a time (per-tab lock).', refs: [{ label: 'src/lib/agent/tab-lock.ts:25-66', url: `${GH}/aartiq-browser/src/lib/agent/tab-lock.ts#L25-L66` }] },
    ],
  },
  {
    icon: Code2,
    title: 'In-app MCP server + external registry',
    color: 'text-amber-400',
    body: 'The browser also exposes its own tools to MCP clients internally and can register approved external MCP servers (SSE/stdio) as tool providers.',
    points: [
      { text: `The app knowledge stores that the browser exposes tools via an MCP server (port ${net.mcpBridge.port}).`, refs: [{ label: 'aartiq-mcp/server/index.js:700-703', url: `${GH}/aartiq-mcp/server/index.js#L700-L703` }] },
      { text: 'External MCP servers connect via SSE or stdio through the registry.', refs: [{ label: 'src/lib/mcp-server-registry.js:2-31', url: `${GH}/aartiq-browser/src/lib/mcp-server-registry.js#L2-L31` }] },
      { text: 'In-app MCP server start(port) entry.', refs: [{ label: 'src/lib/mcp-browser-server.js:1455', url: `${GH}/aartiq-browser/src/lib/mcp-browser-server.js#L1455` }] },
    ],
  },
];

interface SecurityItem {
  icon: LucideIcon;
  title: string;
  color: string;
  text: string;
  refs: SourceRef[];
}

const securityModel: SecurityItem[] = [
  {
    icon: Globe,
    title: 'Loopback by default',
    color: 'text-amber-400',
    text: `All three HTTP listeners bind to loopback by default. The agent API uses ${net.agentApi.defaultBindAddress} and exposes every interface only when remote is explicitly turned on; the MCP SSE bridge resolves its bind host through resolveBindHost() (mcp-browser-server.js:1678-1681) and listens on 127.0.0.1 unless the security_mcpBridgeRemote setting is turned on (main.js:9161, default off). Beyond those three, the WiFi sync service binds all interfaces on purpose so the phone can reach it over the LAN (AARTIQ_WIFI_SYNC_HOST narrows the bind), with Host and Origin checked at the WebSocket upgrade and every sync action carrying the device's access token; the PDF sync service binds loopback and requires a token on every file endpoint. The README states both plainly.`,
    refs: [
      { label: 'bridge-client.js:3-4', url: `${GH}/aartiq-mcp/server/bridge-client.js#L3-L4` },
      { label: 'src/lib/agent-api/providers.ts:22,78', url: `${GH}/aartiq-browser/src/lib/agent-api/providers.ts#L22-L78` },
      { label: 'src/lib/mcp-browser-server.js:1678-1681', url: `${GH}/aartiq-browser/src/lib/mcp-browser-server.js#L1678-L1681` },
      { label: 'main.js:9161', url: `${GH}/aartiq-browser/main.js#L9161` },
    ],
  },
  {
    icon: Shield,
    title: 'Fail-closed pipeline',
    color: 'text-rose-400',
    text: 'Every tool call runs the verb gate, tab lock, handler, and prompt-injection scan before returning. Untrusted tool output is scanned and quarantined when unsafe — content is never trusted by default.',
    refs: [{ label: 'src/lib/agent-api/registry.ts:1-89', url: `${GH}/aartiq-browser/src/lib/agent-api/registry.ts#L1-L89` }],
  },
  {
    icon: Lock,
    title: 'Per-agent tab locks',
    color: 'text-amber-400',
    text: 'Two agents can never drive the same tab: TabLockManager refuses a second agent unless the lock has expired or been handed off.',
    refs: [{ label: 'src/lib/agent/tab-lock.ts:54-66', url: `${GH}/aartiq-browser/src/lib/agent/tab-lock.ts#L54-L66` }],
  },
  {
    icon: KeyRound,
    title: 'Approval-gated tools',
    color: 'text-sky-400',
    text: 'Tools are risk-classified; high-risk actions require the native permission approval UI before they execute (biometric where enabled). Default agent trust is "limited".',
    refs: [
      { label: 'src/lib/agent-api/providers.ts:29', url: `${GH}/aartiq-browser/src/lib/agent-api/providers.ts#L29` },
      { label: 'src/lib/mcp-browser-server.js:316-340', url: `${GH}/aartiq-browser/src/lib/mcp-browser-server.js#L316-L340` },
    ],
  },
];

const setupSteps = [
  {
    title: 'Use the .mcpb bundle or npm package',
    text: 'aartiq-mcp ships as a Claude Desktop extension bundle (.mcpb) and an npm package (aartiq-mcp-server, v2.0.0, MIT). Entry point: node server/index.js.',
    refs: [
      { label: 'aartiq-mcp/package.json', url: `${GH}/aartiq-mcp/package.json` },
      { label: 'aartiq-mcp/manifest.json', url: `${GH}/aartiq-mcp/manifest.json` },
    ],
  },
  {
    title: 'Launch Aartiq with the MCP bridge enabled',
    text: `The browser listens for bridge calls on ${net.nativeBridge.defaultBindAddress}:${net.nativeBridge.port} while running. Configuration happens in the desktop app (Settings → MCP) — this website does not proxy tokens or run OAuth for you.`,
    refs: [
      { label: 'server/bridge-client.js:3-4', url: `${GH}/aartiq-mcp/server/bridge-client.js#L3-L4` },
      { label: 'src/lib/agent-api/providers.ts:19-29', url: `${GH}/aartiq-browser/src/lib/agent-api/providers.ts#L19-L29` },
    ],
  },
  {
    title: 'Connect from Claude Desktop or any MCP client',
    text: `Point your client at the stdio entry point. Every request to the bridge needs the session token, and the Host and Origin are checked as well, so a client that has not been given the token is refused rather than connected. Works on macOS and Windows; requires Node.js ≥ 18. The token is regenerated on each Aartiq start, so run Auto-Configure again after a restart.`,
    refs: [
      { label: 'server/index.js:1203', url: `${GH}/aartiq-mcp/server/index.js#L1203` },
      { label: 'aartiq-mcp/manifest.json', url: `${GH}/aartiq-mcp/manifest.json` },
    ],
  },
];

export default function MCPSettingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5">
            <Cpu size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Model Context Protocol</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-6xl">
            Aartiq <span className="text-white/20">MCP &amp; Agent API</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/50">
            Aartiq ships a real, implemented MCP server (<span className="text-emerald-400">aartiq-mcp</span>, MIT) that drives the
            browser from Claude Desktop and any MCP client — 64 tools across 11 categories — plus an Agent API that exposes the same
            surface over HTTP. Every tool call runs a fail-closed security pipeline and everything binds to the loopback interface.
            This page documents the implemented system; each claim links to the exact source lines on GitHub.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`${GH}/aartiq-mcp/server/index.js`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition hover:bg-emerald-400"
            >
              <FileText size={16} /> MCP server source
              <ArrowUpRight size={16} />
            </a>
            <Link
              href="/docs/skills#agent-api"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              Agent API docs <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.section>

        {/* Tool categories */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-20">
          <h2 className="mb-2 flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
            <Layers size={24} className="text-emerald-400" /> What clients can control
          </h2>
          <p className="mb-8 text-white/50">
            11 tool categories, all defined in one file — <code className="text-emerald-300">aartiq-mcp/server/index.js</code>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-500/30">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${cat.color} text-white`}>
                  <cat.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{cat.description}</p>
                <div className="mt-4 flex flex-col gap-1.5">
                  {cat.refs.map((ref) => (
                    <a
                      key={ref.label}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      <Code2 size={12} /> {ref.label} <ExternalLink size={11} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Architecture */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-20">
          <h2 className="mb-2 flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
            <Server size={24} className="text-emerald-400" /> How it works
          </h2>
          <p className="mb-8 text-white/50">The implemented transport chain, from MCP client to sandboxed tool execution.</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {architecture.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <card.icon size={22} className={card.color} />
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{card.body}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((point) => (
                    <li key={point.refs[0].label} className="text-sm text-white/70">
                      {point.text}
                      <a
                        href={point.refs[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        <Code2 size={11} /> {point.refs[0].label} <ExternalLink size={10} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Security model */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-20">
          <h2 className="mb-2 flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
            <Shield size={24} className="text-emerald-400" /> Security model
          </h2>
          <p className="mb-8 text-white/50">MCP and the agent API are not a backdoor — they share the browser&apos;s security pipeline.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {securityModel.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <item.icon size={22} className={item.color} />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{item.text}</p>
                <div className="mt-4 flex flex-col gap-1.5">
                  {item.refs.map((ref) => (
                    <a
                      key={ref.label}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      <Code2 size={11} /> {ref.label} <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Setup */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-20">
          <h2 className="mb-2 flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
            <KeyRound size={24} className="text-emerald-400" /> Setup
          </h2>
          <p className="mb-8 text-white/50">How Aartiq actually connects — the working path, not a mock.</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {setupSteps.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-black text-emerald-400">
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{step.text}</p>
                <div className="mt-4 flex flex-col gap-1.5">
                  {step.refs.map((ref) => (
                    <a
                      key={ref.label}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      <Code2 size={11} /> {ref.label} <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 p-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <h3 className="text-lg font-semibold">What ships vs. what this site links to</h3>
                <p className="mt-2 max-w-3xl leading-relaxed text-white/50">
                  The MCP surface you see on this page is the one that ships: the tool list, the bridge, the security pipeline, and the
                  approvals are all in the open-source repository and enforceable in CI. Aartiq does not proxy third-party OAuth servers
                  (Gmail, Slack, etc.) through this website — those exist as real, approved external MCP servers you register in the
                  desktop app, and the registry is in the source above. See the {' '}
                  <Link href="/docs/security" className="text-emerald-400 hover:text-emerald-300">security docs</Link> and the{' '}
                  <Link href="/docs/skills#agent-api" className="text-emerald-400 hover:text-emerald-300">Agent API docs</Link> for the full model.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}