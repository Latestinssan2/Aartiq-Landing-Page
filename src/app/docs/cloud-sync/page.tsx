"use client";

import { net } from "@/data/facts";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Cloud,
  Wifi,
  Smartphone,
  Shield,
  Lock,
  Key,
  CheckCircle2,
  AlertTriangle,
  Download,
  Clipboard,
  Monitor,
  Terminal
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
      "clipboard-sync",
      "clipboard-sync-request",
      "execute-command",
      "desktop-control"
    ],
    requirements: [
      "Same local network (WiFi)",
      "Desktop app running",
      "Mobile app installed"
    ],
    howItWorks: [
      `Desktop broadcasts a discovery beacon on UDP port ${net.discovery.port} to the broadcast address 255.255.255.255 (the socket itself binds an ephemeral port)`,
      "Mobile listens on that port for the beacon",
      `WebSocket connection established on port ${net.wifiSync.port}`,
      "Pairing code checked during the handshake, then the six message types above are available"
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
      "Security.encrypt",
      "Security.decrypt",
      "setSyncPassphrase",
      "queuePendingData"
    ],
    requirements: [
      "Internet connection",
      "Cloud account linked",
      "Sync enabled in settings"
    ],
    howItWorks: [
      "Data encrypted client-side with your sync passphrase",
      "Uploaded to secure cloud storage",
      "Other devices pull and decrypt updates",
      "Offline changes sync when online"
    ]
  }
];

/**
 * These are the three values of the `TrustLevel` union in
 * src/lib/WiFiSyncService.ts, transcribed. The page previously showed a
 * Read Only / Standard / Trusted ladder with a permission list per rung, which
 * the service never had: a trust level decides whether a *known* device may
 * auto-connect, not what that device is permitted to do. Everything a
 * connected device can send is listed once, under `syncItems` below, because
 * it does not vary by trust level.
 */
const permissionLevels = [
  {
    name: "Trusted",
    level: 1,
    icon: Shield,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    description:
      "Known device, allowed to auto-connect. This is what the Trust toggle in Settings sets, and it is the default for a device you have trusted.",
    permissions: [
      "clipboard-sync",
      "execute-command",
      "desktop-control"
    ]
  },
  {
    name: "Ask once",
    level: 2,
    icon: CheckCircle2,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    description:
      "Default for a device seen for the first time. You approve each connection instead of it reconnecting on its own.",
    permissions: [
      "clipboard-sync",
      "execute-command",
      "desktop-control"
    ]
  },
  {
    name: "Blocked",
    level: 3,
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    description:
      "Declared by the service and enforced at the handshake, which refuses a blocked device. The Settings toggle does not currently offer it — use Remove instead.",
    permissions: []
  }
];

/**
 * The message types WiFiSyncService.ts actually handles, transcribed from its
 * switch. The previous table published a per-item ceiling for each of these
 * (~1MB clipboard, ~10 tabs, ~100 tasks, ~500 history entries, a 100MB file
 * transfer) and a file-transfer row for a message type that does not exist.
 * The service sets no size limit and transfers no files, so those numbers are
 * gone rather than restated.
 */
const syncItems = [
  { name: "Clipboard", icon: Clipboard, description: "Push the desktop clipboard to the paired device", size: "clipboard-sync" },
  { name: "Clipboard request", icon: Clipboard, description: "Ask the paired device for its clipboard", size: "clipboard-sync-request" },
  { name: "Desktop control", icon: Monitor, description: "Drive the desktop from the paired device", size: "desktop-control" },
  { name: "Command execution", icon: Terminal, description: "Run a command on the desktop", size: "execute-command" },
  { name: "Presence", icon: Wifi, description: "Keep-alive between the paired devices", size: "ping" },
  { name: "Handshake", icon: Key, description: "Device identity and pairing code exchange", size: "handshake" }
];

/**
 * Each entry is a control the code implements, or an explicit statement that
 * it does not have one. The previous list claimed a physical QR approval gate,
 * a 60-second pairing expiry and an audit trail; none of those exist. The
 * pairing code and the encryption are real, so they stay.
 */
const securityFeatures = [
  {
    title: "Pairing code",
    description: "A six-digit code is generated per session and checked during the handshake; a device presenting the wrong code is refused",
    icon: Key,
    source: "src/lib/WiFiSyncService.ts"
  },
  {
    title: "Short-lived access tokens",
    description: "Pairing issues short-lived access tokens and refresh tokens bound to client device fingerprint; sync messages require an active token",
    icon: Key,
    source: "src/lib/WiFiSyncService.ts"
  },
  {
    title: "Known devices & revocation",
    description: "Paired devices are tracked and can be unshared or revoked immediately, invalidating tokens and closing connections",
    icon: Shield,
    source: "src/lib/WiFiSyncService.ts"
  },
  {
    title: "Blocked devices & rate limiting",
    description: "Blocked devices are refused at the handshake, and repeated failed attempts trigger lockout",
    icon: AlertTriangle,
    source: "src/lib/WiFiSyncService.ts"
  },
  {
    title: "End-to-end encryption",
    description: "End-to-end encryption covers the cloud path: data is encrypted client-side with your sync passphrase before upload, and decrypted on the device that pulls it. The local WiFi WebSocket is not additionally encrypted by this layer",
    icon: Lock,
    source: "src/lib/crypto-utils.ts"
  },
  {
    title: "What is not here",
    description: "No per-device audit log. Sync messages are written to the developer console and are not retained as a record you can review",
    icon: AlertTriangle
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
            <Key size={32} className="mx-auto mb-4 text-amber-400" />
            <h3 className="text-3xl font-black text-amber-400">6-digit</h3>
            <p className="text-sm text-white/50">Pairing Code</p>
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
