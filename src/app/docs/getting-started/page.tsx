"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Download, 
  Monitor, 
  Smartphone,
  Terminal,
  Globe,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Box,
  Cpu,
  Lock,
  Wifi,
  Settings,
  Zap
} from "lucide-react";

const steps = [
  {
    id: "download",
    title: "Download Aartiq",
    description: "Get the installer for your platform",
    icon: Download,
    fileRef: "aartiq-browser/scripts/, GitHub Releases",
    content: {
      platforms: [
        { name: "Windows", arch: "x64", format: ".exe", icon: Monitor },
        { name: "Windows (Microsoft Store)", arch: "x64", format: "Store", icon: Monitor },
        { name: "macOS Apple Silicon", arch: "ARM64", format: ".dmg", icon: Monitor },
        { name: "macOS Intel", arch: "x64", format: ".dmg", icon: Monitor },
        { name: "Linux", arch: "x64", format: ".AppImage", icon: Terminal },
        { name: "Android", arch: "ARM64", format: ".apk", icon: Smartphone },
      ],
      instructions: "Download from the official releases page and choose the correct macOS build for Apple Silicon or Intel.",
      alternative: "You can also build from source if you prefer."
    }
  },
  {
    id: "install",
    title: "Install the Application",
    description: "Run the installer and follow the prompts",
    icon: Box,
    fileRef: "aartiq-browser/main.js, aartiq-browser/package.json",
    content: {
      windows: {
        steps: [
          "Double-click the downloaded .exe file",
          "Click 'Yes' when prompted by User Account Control",
          "Follow the installation wizard",
          "Launch Aartiq from the Start Menu or Desktop shortcut"
        ],
        note: "The installer will automatically create a desktop shortcut."
      },
      macos: {
        steps: [
          "Open the downloaded .dmg file",
          "Drag Aartiq to the Applications folder",
          "If prompted, click 'Open' to confirm",
          "Launch Aartiq from Launchpad or Spotlight"
        ],
        note: "You may need to allow the app in System Preferences > Security & Privacy."
      },
      linux: {
        steps: [
          "Make the AppImage executable: chmod +x Aartiq.Browser-x.x.x.AppImage",
          "Run the AppImage: ./Aartiq.Browser-x.x.x.AppImage"
        ],
        note: "AppImage requires FUSE to run properly on some distributions. No .deb package is published."
      },
      android: {
        steps: [
          "Enable 'Install from unknown sources' in Settings",
          "Open the downloaded .apk file",
          "Tap 'Install' when prompted",
          "Launch Aartiq from your app drawer"
        ],
        note: "For iOS, the app is available via TestFlight beta."
      }
    }
  },
  {
    id: "setup",
    title: "Initial Setup",
    description: "Configure your AI provider and permissions",
    icon: Settings,
    fileRef: "src/lib/Security.ts, src/lib/AIChatSidebar.tsx",
    content: {
      steps: [
        { title: "Welcome Screen", desc: "You'll see the welcome/setup screen. Select your preferred theme." },
        { title: "AI Provider Configuration", desc: "Add a cloud API key or choose a native/local path such as Ollama or Apple Intelligence on macOS." },
        { title: "Permission Grant", desc: "Grant screen reading and shell execution permissions when prompted." },
        { title: "Timezone Detection", desc: "The app auto-detects your timezone for scheduling features." }
      ],
      providers: [
        { name: "Google Gemini", key: "GOOGLE_API_KEY", url: "https://aistudio.google.com/app/apikey", kind: "Cloud", notes: "Supports live official model catalog refresh in settings." },
        { name: "OpenAI GPT", key: "OPENAI_API_KEY", url: "https://platform.openai.com/api-keys", kind: "Cloud", notes: "Supports live official model catalog refresh in settings." },
        { name: "Anthropic Claude", key: "ANTHROPIC_API_KEY", url: "https://console.anthropic.com/settings/keys", kind: "Cloud", notes: "Supports live official model catalog refresh in settings." },
        { name: "Groq", key: "GROQ_API_KEY", url: "https://console.groq.com/keys", kind: "Cloud", notes: "Supports live official model catalog refresh in settings." },
        { name: "xAI Grok", key: "XAI_API_KEY", url: "https://console.x.ai/", kind: "Cloud", notes: "Supports live official model catalog refresh in settings." },
        { name: "Ollama (Local)", key: "No API key needed", url: "https://ollama.com", kind: "Local", notes: "Best for full local privacy." },
        { name: "Apple Intelligence (macOS)", key: "No API key needed", url: "https://developer.apple.com/apple-intelligence/", kind: "Native", notes: "macOS-only native path. Availability depends on supported hardware and Apple Intelligence being enabled." }
      ]
    }
  },
  {
    id: "mobile",
    title: "Connect Mobile App (Optional)",
    description: "Control your desktop from your phone",
    icon: Smartphone,
    fileRef: "src/lib/WiFiSyncService.ts, flutter_browser_app/",
    content: {
      description: "The mobile app allows you to control your desktop, approve high-risk actions, and receive notifications.",
      features: [
        "Remote desktop control via WiFi P2P",
        "QR code scanning for secure authorization",
        "Push notifications for completed tasks",
        "View and manage scheduled automations",
        "PDF viewer with sync support"
      ],
      setup: [
        "Download the Aartiq mobile app from the Play Store",
        "Open Settings > Sync in the desktop app",
        "Scan the QR code displayed on desktop",
        "Enter the 6-digit verification code",
        "You're connected!"
      ]
    }
  },
  {
    id: "verify",
    title: "Verify Installation",
    description: "Test that everything is working",
    icon: CheckCircle2,
    fileRef: "src/core/command-executor.js, src/lib/AdvancedDocumentEngine.ts",
    content: {
      checks: [
        { item: "Browser Launch", desc: "Aartiq opens without errors" },
        { item: "AI Connection", desc: "You can send messages to the AI" },
        { item: "Screenshot Capture", desc: "AI can take and analyze screenshots" },
        { item: "PDF Generation", desc: "AI can generate PDF documents" },
        { item: "Shell Commands", desc: "Permission prompts appear for shell commands" }
      ],
      testCommand: "Try asking the AI: 'Take a screenshot and describe what you see'"
    }
  }
];

const codeSnippets = {
  windows: "Aartiq.Browser.Setup.x.x.x.exe",
  macosArm64: "Aartiq-x.x.x-arm64.dmg",
  macosX64: "Aartiq-x.x-x64.dmg",
  linux: "Aartiq.Browser-x.x.x.AppImage",
  build: `git clone https://github.com/Latestinssan/Aartiq.git
cd Aartiq/aartiq-browser
npm install
npm run dev`,
  flutter: `cd flutter_browser_app
flutter pub get
flutter run`
};

export default function GettingStartedPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<"windows" | "macos" | "linux">("windows");

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        id="introduction"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Zap size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Getting Started
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Installation <span className="text-white/20">Guide</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Installation guide covering all supported platforms and initial configuration.
          Source references: aartiq-browser/main.js, aartiq-browser/scripts/, src/lib/Security.ts
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="/downloads"
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-sky-400"
          >
            <Download size={18} /> Download Latest
          </a>
          <Link
            href="/docs/overview"
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-wider text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            View Overview
          </Link>
        </div>
      </motion.section>

      {/* Step Navigation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Step by Step
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Follow the <span className="text-white/20">Process</span>
          </h2>
        </div>

        <div className="mb-12 flex flex-wrap gap-3">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`group flex items-center gap-3 rounded-full px-6 py-4 text-sm font-black uppercase tracking-wider transition-all ${
                activeStep === i
                  ? "bg-sky-500 text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                activeStep === i ? "bg-black/20" : "bg-white/10"
              }`}>
                {i + 1}
              </span>
              <span className="hidden sm:inline">{step.title}</span>
              <ChevronRight size={16} className={`transition-transform ${activeStep === i ? "rotate-90" : "group-hover:translate-x-1"}`} />
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 lg:p-16">
          <div className="mb-10 flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-sky-500/10 text-sky-400 shadow-lg">
              {steps[activeStep].icon && React.createElement(steps[activeStep].icon, { size: 40 })}
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-wider">{steps[activeStep].title}</h3>
              <p className="mt-2 text-white/40">{steps[activeStep].description}</p>
              {(steps[activeStep] as any).fileRef && (
                <p className="mt-1 font-mono text-[10px] text-white/20">{(steps[activeStep] as any).fileRef}</p>
              )}
            </div>
          </div>

          {/* Step 1: Download */}
          {activeStep === 0 && (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {(steps[0].content.platforms ?? []).map((platform) => (
                  platform.name.includes("Microsoft Store") ? null : (
                    <a
                      key={platform.name}
                      href="/downloads"
                      className="group flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 text-center transition-all hover:border-sky-500/30 hover:bg-sky-500/5"
                    >
                      <platform.icon size={40} className="mb-6 text-white/40 group-hover:text-sky-400 transition-colors" />
                      <h4 className="mb-2 text-lg font-black uppercase tracking-wider">{platform.name}</h4>
                      <p className="text-xs text-white/30">{platform.arch} {platform.format}</p>
                    </a>
                  )
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <div dangerouslySetInnerHTML={{
                  __html: `<ms-store-badge
                    productid="9nd6wg2rp7cm"
                    productname="Aartiq"
                    window-mode="direct"
                    theme="dark"
                    size="large"
                    language="en-gb"
                    animation="on">
                  </ms-store-badge>`
                }} />
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="mb-4 text-sm font-medium text-white/60">{steps[0].content.instructions}</p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <Terminal size={14} />
                  <code className="rounded bg-white/5 px-2 py-1">Alternative: Build from source</code>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Install */}
          {activeStep === 1 && (
            <div className="space-y-8">
              {/* Platform Tabs */}
              <div className="flex gap-3">
                {(["windows", "macos", "linux"] as const).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                      selectedPlatform === platform
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {/* Platform Instructions */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
                <div className="mb-8 flex items-center gap-4">
                  <CheckCircle2 size={24} className="text-sky-400" />
                  <h4 className="text-xl font-black uppercase tracking-wider">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Installation
                  </h4>
                </div>
                
                <ol className="space-y-4">
                  {(steps[1].content as any)[selectedPlatform].steps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sm font-black text-sky-400">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-white/60">{step}</span>
                    </li>
                  ))}
                </ol>

                {(steps[1].content as any)[selectedPlatform].note && (
                  <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm text-amber-400/80">
                      <strong>Note:</strong> {(steps[1].content as any)[selectedPlatform].note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Setup */}
          {activeStep === 2 && (
            <div className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h4 className="mb-6 text-xl font-black uppercase tracking-wider">Setup Steps</h4>
                  <div className="space-y-4">
                    {(steps[2].content as any).steps.map((step: any, i: number) => (
                      <div key={i} className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sm font-black text-sky-400">
                          {i + 1}
                        </span>
                        <div>
                          <h5 className="mb-1 font-bold text-white">{step.title}</h5>
                          <p className="text-sm text-white/40">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-6 text-xl font-black uppercase tracking-wider">AI Provider Setup</h4>
                  <div className="space-y-4">
                    {(steps[2].content as any).providers.map((provider: any) => (
                      <div key={provider.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h5 className="font-bold text-white">{provider.name}</h5>
                          <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/40">
                            {(provider.kind || (provider.name.includes("Ollama") ? "Local" : "Cloud"))}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Lock size={12} />
                            <code className="rounded bg-white/5 px-2 py-1">{provider.key}</code>
                          </div>
                          {provider.notes && (
                            <p className="text-xs leading-relaxed text-white/35">{provider.notes}</p>
                          )}
                          {!provider.name.includes("Ollama") && (
                            <a
                              href={provider.url}
                              target="_blank"
                              className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300"
                            >
                              Get API Key <ArrowRight size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Mobile */}
          {activeStep === 3 && (
            <div className="space-y-8">
              <p className="text-lg font-medium text-white/50">
                {(steps[3].content as any).description}
              </p>

              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h4 className="mb-6 text-xl font-black uppercase tracking-wider">Mobile App Features</h4>
                  <ul className="space-y-3">
                    {((steps[3].content as any).features as string[]).map((feature, i) => (
                      <li key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <CheckCircle2 size={18} className="text-sky-400" />
                        <span className="text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-6 text-xl font-black uppercase tracking-wider">Connection Steps</h4>
                  <ol className="space-y-4">
                    {((steps[3].content as any).setup as string[]).map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sm font-black text-sky-400">
                          {i + 1}
                        </span>
                        <span className="pt-1 text-white/60">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
                <Wifi size={24} className="text-sky-400" />
                <p className="text-sm text-white/60">
                  <strong className="text-white">WiFi P2P:</strong> Your mobile device connects directly to your desktop 
                  over the local network. No internet required for local control.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Verify */}
          {activeStep === 4 && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {(steps[4].content as any).checks.map((check: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                    <div>
                      <h5 className="font-bold text-white">{check.item}</h5>
                      <p className="text-sm text-white/40">{check.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8">
                <div className="mb-4 flex items-center gap-4">
                  <Cpu size={24} className="text-sky-400" />
                  <h4 className="text-xl font-black uppercase tracking-wider">Test Command</h4>
                </div>
                <p className="mb-4 text-white/60">
                  Try this command in the AI chat to verify everything is working:
                </p>
                <code className="block rounded-xl bg-black/40 p-6 text-center font-mono text-lg text-sky-400">
                  "Take a screenshot and describe what you see"
                </code>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Build from Source */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            For Developers
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Build from <span className="text-white/20">Source</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Source code is at <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-sm">aartiq-browser/</code> for the desktop app and <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-sm">flutter_browser_app/</code> for the mobile companion.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <div className="mb-6 flex items-center gap-4">
              <Terminal size={24} className="text-sky-400" />
              <h4 className="text-xl font-black uppercase tracking-wider">Desktop App</h4>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/60">
              {codeSnippets.build}
            </pre>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <div className="mb-6 flex items-center gap-4">
              <Smartphone size={24} className="text-sky-400" />
              <h4 className="text-xl font-black uppercase tracking-wider">Mobile App</h4>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/60">
              {codeSnippets.flutter}
            </pre>
          </div>
        </div>
      </motion.section>
    </div>
  );
}