"use client";

import { net } from "@/data/facts";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Cloud,
  CloudOff,
  Wifi,
  Smartphone,
  Shield,
  Lock,
  Key,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Server,
  Database,
  UserCheck,
  Eye,
  Bell,
  Download,
  Upload,
  Link2,
  Zap,
  Timer,
  FileText,
  Clipboard,
  History
} from "lucide-react";

const syncTypes = [
  {
    id: "wifi",
    name: "WiFi P2P Sync",
    icon: Wifi,
    color: "from-sky-500/20 to-cyan-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
    description: "Direct local network connection between devices. Fast, private, no internet required.",
    source: "src/lib/WiFiSyncService.ts",
    features: [
      "Real-time clipboard sync",
      "File transfer up to 100MB",
      "Desktop control from mobile",
      "Push notifications"
    ],
    requirements: [
      "Same local network (WiFi)",
      "Desktop app running",
      "Mobile app installed"
    ],
    howItWorks: [
      `Desktop broadcasts a discovery signal on UDP port ${net.discovery.port} (a broadcast destination — the socket itself binds an ephemeral port)`,
      "Mobile scans local network via mDNS",
      `WebSocket connection established on port ${net.wifiSync.port}`,
      "Bi-directional sync begins"
    ]
  },
  {
    id: "cloud",
    name: "Cloud Sync",
    icon: Cloud,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    description: "Cloud-based sync for cross-network access. Works anywhere with internet.",
    source: "src/lib/CloudSyncService.ts, src/lib/FirebaseSyncService.ts",
    features: [
      "Access from anywhere",
      "End-to-end encrypted",
      "Automatic conflict resolution",
      "Cross-device history"
    ],
    requirements: [
      "Internet connection",
      "Cloud account linked",
      "Sync enabled in settings"
    ],
    howItWorks: [
      "Data encrypted client-side",
      "Uploaded to secure cloud storage",
      "Other devices pull updates",
      "Offline changes sync when online"
    ]
  }
];

const permissionLevels = [
  {
    name: "Read Only",
    level: 1,
    icon: Eye,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    description: "View data only, no modifications",
    permissions: [
      "View clipboard content",
      "View open tabs",
      "View task list"
    ]
  },
  {
    name: "Standard",
    level: 2,
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    description: "Full sync access, can trigger actions",
    permissions: [
      "Clipboard read/write",
      "Trigger scheduled tasks",
      "Approve low-risk commands",
      "View/manage files"
    ]
  },
  {
    name: "Trusted",
    level: 3,
    icon: Shield,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    description: "Unrestricted access, approve any action",
    permissions: [
      "All Standard permissions",
      "Approve high-risk commands",
      "Run shell commands",
      "Access system settings"
    ]
  }
];

const syncItems = [
  { name: "Clipboard", icon: Clipboard, description: "Sync clipboard content bidirectionally", size: "~1MB limit" },
  { name: "Open Tabs", icon: FileText, description: "Sync currently open browser tabs", size: "~10 tabs" },
  { name: "Task List", icon: Bell, description: "View and manage scheduled tasks", size: "~100 tasks" },
  { name: "Downloads", icon: Download, description: "Access download history and files", size: "Reference only" },
  { name: "History", icon: History, description: "Sync browsing history", size: "~500 entries" },
  { name: "Files", icon: Database, description: "Transfer files between devices", size: "Up to 100MB" }
];

const securityFeatures = [
  {
    title: "Pairing Verification",
    description: "6-digit code verification ensures only authorized devices can connect",
    icon: Key,
    source: "src/lib/crypto-utils.ts, src/lib/shared-keychain.js"
  },
  {
    title: "QR Code Approval",
    description: "High-risk actions require physical QR scan confirmation",
    icon: CheckCircle2
  },
  {
    title: "Trust Levels",
    description: "Granular permissions control what each device can access",
    icon: Shield
  },
  {
    title: "Connection Timeout",
    description: "Unpaired connections auto-expire after 60 seconds",
    icon: Timer
  },
  {
    title: "End-to-End Encryption",
    description: "All data encrypted before transmission (Cloud Sync)",
    icon: Lock
  },
  {
    title: "Activity Logging",
    description: "All sync actions logged for audit trail",
    icon: History
  }
];

export default function CloudSyncPage() {
  const [activeSyncType, setActiveSyncType] = useState<"wifi" | "cloud">("wifi");

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Cloud size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Cloud & Sync
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          <span className="text-white/20">Architecture</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Device synchronization system supporting WiFi P2P and cloud-based sync. Source: src/lib/WiFiSyncService.ts, src/lib/CloudSyncService.ts, src/lib/P2PFileSyncService.ts, src/lib/SyncMethodManager.ts
        </p>

        {/* Quick Stats */}
        <div className="mt-12 grid gap-6 sm:grid-cols-4">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 text-center">
            <Wifi size={32} className="mx-auto mb-4 text-sky-400" />
            <h3 className="text-3xl font-black text-sky-400">Local</h3>
            <p className="text-sm text-white/50">WiFi P2P</p>
          </div>
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 text-center">
            <Cloud size={32} className="mx-auto mb-4 text-purple-400" />
            <h3 className="text-3xl font-black text-purple-400">Cloud</h3>
            <p className="text-sm text-white/50">Anywhere Access</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <Shield size={32} className="mx-auto mb-4 text-emerald-400" />
            <h3 className="text-3xl font-black text-emerald-400">E2E</h3>
            <p className="text-sm text-white/50">Encrypted</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <Timer size={32} className="mx-auto mb-4 text-amber-400" />
            <h3 className="text-3xl font-black text-amber-400">60s</h3>
            <p className="text-sm text-white/50">Pairing Timeout</p>
          </div>
        </div>
      </motion.section>

      {/* Sync Types */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Sync Types
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Sync <span className="text-white/20">Types</span>
          </h2>
        </div>

        <div className="mb-8 flex gap-4">
          {([
            { id: "wifi", label: "WiFi P2P", icon: Wifi },
            { id: "cloud", label: "Cloud Sync", icon: Cloud }
          ] as const).map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveSyncType(type.id)}
              className={`flex items-center gap-3 rounded-full px-8 py-4 text-sm font-black uppercase tracking-wider transition-all ${
                activeSyncType === type.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <type.icon size={18} />
              {type.label}
            </button>
          ))}
        </div>

        {activeSyncType === "wifi" && (
          <div className="space-y-8">
            <div className={`rounded-[2rem] border ${syncTypes[0].borderColor} bg-gradient-to-br ${syncTypes[0].color} p-10`}>
              <div className="mb-8 flex items-center gap-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 ${syncTypes[0].iconColor}`}>
                  {React.createElement(syncTypes[0].icon, { size: 32 })}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-wider">{syncTypes[0].name}</h3>
                  <p className="text-white/60">{syncTypes[0].description}</p>
                </div>
              </div>

              <div className="grid gap-10 lg:grid-cols-3">
                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">Features</h4>
                  <ul className="space-y-3">
                    {syncTypes[0].features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${syncTypes[0].iconColor.replace('text-', 'text-')}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">Requirements</h4>
                  <ul className="space-y-3">
                    {syncTypes[0].requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">How It Works</h4>
                  <ol className="space-y-3">
                    {syncTypes[0].howItWorks.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${syncTypes[0].iconColor.replace('text-', 'bg-')}/20 ${syncTypes[0].iconColor}`}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
                <p className="text-xs text-sky-300">Source: {syncTypes[0].source}</p>
              </div>
            </div>
          </div>
        )}

        {activeSyncType === "cloud" && (
          <div className="space-y-8">
            <div className={`rounded-[2rem] border ${syncTypes[1].borderColor} bg-gradient-to-br ${syncTypes[1].color} p-10`}>
              <div className="mb-8 flex items-center gap-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 ${syncTypes[1].iconColor}`}>
                  {React.createElement(syncTypes[1].icon, { size: 32 })}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-wider">{syncTypes[1].name}</h3>
                  <p className="text-white/60">{syncTypes[1].description}</p>
                </div>
              </div>

              <div className="grid gap-10 lg:grid-cols-3">
                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">Features</h4>
                  <ul className="space-y-3">
                    {syncTypes[1].features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${syncTypes[1].iconColor.replace('text-', 'text-')}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">Requirements</h4>
                  <ul className="space-y-3">
                    {syncTypes[1].requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">How It Works</h4>
                  <ol className="space-y-3">
                    {syncTypes[1].howItWorks.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${syncTypes[1].iconColor.replace('text-', 'bg-')}/20 ${syncTypes[1].iconColor}`}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                <p className="text-xs text-purple-300">Source: {syncTypes[1].source}</p>
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* Sync Items */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Sync Data
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Sync <span className="text-white/20">Items</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {syncItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <item.icon size={24} />
              </div>
              <h3 className="mb-2 font-bold text-white">{item.name}</h3>
              <p className="mb-3 text-sm text-white/50">{item.description}</p>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase text-white/40">
                {item.size}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Permission Levels */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Permissions
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Permission <span className="text-white/20">Levels</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Control what each connected device can access with configurable permission levels.
          </p>
        </div>

        <div className="space-y-4">
          {permissionLevels.map((level, i) => (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border ${level.bgColor.replace('/10', '/20')} bg-gradient-to-r from-transparent to-transparent p-8`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${level.bgColor} ${level.color}`}>
                    <level.icon size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black uppercase tracking-wider">{level.name}</h3>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase text-white/40">
                        Level {level.level}
                      </span>
                    </div>
                    <p className="mt-1 text-white/50">{level.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white/20">{level.level}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {level.permissions.map((perm) => (
                  <span key={perm} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/60">
                    {perm}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Security
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Security <span className="text-white/20">Features</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-8"
            >
              <feature.icon size={32} className="mb-4 text-emerald-400" />
              <h3 className="mb-2 font-bold text-white">{feature.title}</h3>
              <p className="text-sm text-white/50">{feature.description}</p>
              {feature.source && (
                <p className="mt-2 text-xs text-emerald-400/60 font-mono">{feature.source}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Setup Guide */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Setup Guide
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Connect <span className="text-white/20">Devices</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 p-10">
            <Smartphone size={40} className="mb-6 text-sky-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Mobile Setup</h3>
            <ol className="space-y-4">
              {[
                "Download Aartiq from Play Store",
                "Open Settings > Sync on desktop",
                "Tap 'Scan QR Code' in mobile app",
                "Point camera at desktop QR code",
                "Enter 6-digit verification code",
                "Select permission level"
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sm font-black text-sky-400">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-white/60">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-10">
            <Cloud size={40} className="mb-6 text-purple-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Cloud Setup</h3>
            <ol className="space-y-4">
              {[
                "Open Settings > Cloud Sync",
                "Sign in with Google or email",
                "Enable desired sync items",
                "Link additional devices with same account",
                "Data syncs automatically"
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-sm font-black text-purple-400">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-white/60">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.section>
    </div>
  );
}