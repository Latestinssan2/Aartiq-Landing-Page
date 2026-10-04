"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Apple,
  Mic,
  Volume2,
  Keyboard,
  Terminal,
  Calendar,
  AppWindow,
  Camera,
  Search,
  FileText,
  MessageSquare,
  Share2,
  Settings,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Bot,
  Command,
  Cpu,
  Smartphone,
  Globe,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { net } from "../../../data/facts";

/**
 * The bridge's port and bind address are read from the SSOT rather than written
 * here. `npm run docs:check` rejects the literals, and it is right to: a page
 * that spells the port out stops being true the day the port changes.
 */
const BRIDGE = net.nativeBridge;
const LOOPBACK = `${BRIDGE.defaultBindAddress}:${BRIDGE.port}`;

/** The Raycast HTTP port, which no longer exists but is still named in reviews. */
const RAYCAST_RETIRED_PORT = net.retired.find((r) => r.name === "Raycast HTTP API")?.port;

const features = [
  {
    id: "apple-intelligence",
    name: "Apple Intelligence",
    icon: Sparkles,
    fileRef: "src/lib/native-panels/",
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    description: "Apple's on-device models, reached through a helper binary Aartiq compiles from src/lib/apple-intelligence.swift. Each command has its own OS floor — they are not interchangeable.",
    requirements: [
      "macOS 15.4 or later for Genmoji",
      "macOS 15.1 or later for Image Playground",
      "macOS 26.0 or later for text summarization",
      "Apple Silicon or M-series chip",
      "Apple Intelligence enabled in Settings"
    ],
    features: [
      { name: "Text Summarization", desc: "Summarize text locally through Foundation Models", os: "macOS 26.0+" },
      { name: "Image Generation", desc: "Create an image from a natural language prompt via Image Playground", os: "macOS 15.1+" },
      { name: "Genmoji", desc: "Create a custom emoji from a description", os: "macOS 15.4+" }
    ],
    examples: [
      { title: "Summarize Article", prompt: "Summarize this article in 3 bullet points", command: "Summarize: {content}" },
      { title: "Generate Image", prompt: "Create an image of a futuristic city at sunset", command: "Generate Image: {prompt}" },
      { title: "Create Genmoji", prompt: "Create a genmoji of a robot chef", command: "Genmoji: {description}" }
    ]
  },
  {
    id: "siri-integration",
    name: "Siri Integration",
    icon: Mic,
    fileRef: "src/lib/native-panels/AppIntents.swift",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    description: "Twenty App Intents registered from the native panel, reachable by voice from anywhere on your Mac. Fifteen reach a route the macOS bridge actually serves. Five do not, and are listed as such rather than removed, because the intent is compiled into the shipped app either way.",
    bridgeNote: `Every intent reaches the app over the token-authenticated bridge on ${LOOPBACK}. It binds loopback only, so no other machine on the network can drive these actions.`,
    phrases: [
      { phrase: "Ask Aartiq [prompt]", desc: "Sends the prompt and speaks the reply", works: true },
      { phrase: "Refine Aartiq's response to be [instruction]", desc: "Sends a refinement instruction", works: true },
      { phrase: "Regenerate Aartiq's response", desc: "Re-runs the last turn", works: true },
      { phrase: "What did Aartiq say?", desc: "Reads the latest response", works: true },
      { phrase: "List my conversations in Aartiq", desc: "Lists recent chats", works: true },
      { phrase: "Open my [conversation] in Aartiq", desc: "Loads a named chat", works: true },
      { phrase: "New chat in Aartiq", desc: "Starts a fresh conversation", works: true },
      { phrase: "Reset Aartiq chat", desc: "Clears the current context", works: true },
      { phrase: "Search [query] with Aartiq", desc: "Sends the query as a prompt", works: true },
      { phrase: "Switch Aartiq model to [model]", desc: "Changes the active model", works: true },
      { phrase: "What can you do with Aartiq", desc: "Answers from a fixed description", works: true },
      { phrase: "Run [command] in Aartiq", desc: "Queues the command as a prompt. It is not executed by the intent, and it does not bypass approval.", works: true, queuesOnly: true },
      { phrase: "Create a [format] about [topic] in Aartiq", desc: "Queues a document request. No file is produced by the intent itself.", works: true, queuesOnly: true },
      { phrase: "Schedule [task] [time] in Aartiq", desc: "Queues a scheduling request. The task is not registered by the intent itself.", works: true, queuesOnly: true }
    ],
    broken: [
      { phrase: "Summarize this page with Aartiq", desc: "The intent POSTs to /native-mac-ui/summarize-page. No such route is served, so it reports failure." },
      { phrase: "Take screenshot with Aartiq", desc: "The intent POSTs to /native-mac-ui/screenshot. No such route is served." },
      { phrase: "Set volume to [level] in Aartiq", desc: "The intent POSTs to /native-mac-ui/volume. No such route is served." },
      { phrase: "Open [app] with Aartiq", desc: "The intent POSTs to /native-mac-ui/open-app. No such route is served." },
      { phrase: "Read clipboard in Aartiq", desc: "The intent GETs /native-mac-ui/clipboard. No such route is served." }
    ],
    workflows: [
      "Siri resolves the phrase to the matching App Intent",
      `The intent posts to the loopback bridge on port ${BRIDGE.port} with the per-process token`,
      "Aartiq performs the action or queues a prompt in the chat",
      "Siri speaks the returned string as the reply"
    ]
  },
  {
    id: "apple-shortcuts",
    name: "Apple Shortcuts",
    icon: Command,
    fileRef: "src/lib/SiriShortcutsIntegration.js",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    description: "Aartiq registers the aartiq:// URL scheme, so a Shortcuts workflow can trigger an action with an Open URL step. Only macOS delivers the link to a running app — see Dispatch below.",
    urlScheme: "aartiq://",
    dispatch: "macOS only. On Windows and Linux the scheme is registered with the OS but the app does not yet read the incoming URL, so a link opens Aartiq and is discarded. The per-platform action tables on the Windows and Linux pages are marked accordingly.",
    actions: [
      {
        name: "Chat Message",
        url: "aartiq://chat",
        params: [{ name: "message", required: true, desc: "The message to send to AI" }],
        example: "aartiq://chat?message=Tell%20me%20a%20joke",
        effect: "Opens the chat and submits the message."
      },
      {
        name: "Search",
        url: "aartiq://search",
        params: [{ name: "query", required: true, desc: "Search query" }],
        example: "aartiq://search?query=latest%20AI%20news",
        effect: "Opens a Google results tab for the query. This is a plain web search, not an AI-generated answer."
      },
      {
        name: "Navigate",
        url: "aartiq://navigate",
        params: [{ name: "url", required: true, desc: "URL to open" }],
        example: "aartiq://navigate?url=https%3A%2F%2Fexample.com",
        effect: "Navigates the active tab. Restricted to http and https."
      },
      {
        name: "Set Volume",
        url: "aartiq://volume",
        params: [{ name: "level", required: true, desc: "Volume level (0-100)" }],
        example: "aartiq://volume?level=50",
        effect: "Sets the system output volume. Values outside 0-100 are clamped."
      },
      {
        name: "Ask AI",
        url: "aartiq://ask-ai",
        params: [{ name: "prompt", required: true, desc: "Question for the assistant" }],
        example: "aartiq://ask-ai?prompt=Explain%20quantum%20computing",
        effect: "Opens the chat and submits the prompt. Same handler as chat."
      },
      {
        name: "Run Command",
        url: "aartiq://run-command",
        params: [{ name: "command", required: true, desc: "Command to hand to the assistant" }],
        example: "aartiq://run-command?command=ls%20-la",
        effect: "Queues the command as a prompt in the chat. Aartiq does not execute it from the link. Execution still goes through the normal approval flow, and there is no parameter that skips that approval.",
        planned: true
      },
      {
        name: "Create PDF",
        url: "aartiq://create-pdf",
        params: [
          { name: "content", required: true, desc: "Content for the document" },
          { name: "title", required: false, desc: "Document title" }
        ],
        example: "aartiq://create-pdf?content=Hello%20World&title=My%20Document",
        effect: "Queues a document request in the chat. No file is produced by the link alone.",
        planned: true
      },
      {
        name: "Schedule Task",
        url: "aartiq://schedule",
        params: [
          { name: "task", required: true, desc: "Task description" },
          { name: "cron", required: true, desc: "Five-field cron expression, for example 0 8 * * *" }
        ],
        example: "aartiq://schedule?task=Generate%20report&cron=0%208%20*%20*%20*",
        effect: "Queues a scheduling request in the chat. The link does not register the task itself.",
        planned: true
      },
      {
        name: "Open App",
        url: "aartiq://open-app",
        params: [{ name: "appName", required: true, desc: "Application name" }],
        example: "aartiq://open-app?appName=Safari",
        effect: "Launches the named application. Being hardened: the current implementation builds a shell string from this parameter, so it is not yet safe to expose from a link.",
        planned: true
      }
    ],
    notAvailable: [
      { name: "Capture Screenshot", reason: "aartiq://screenshot is mapped to a renderer channel that has no listener. Screenshot capture exists in the app but is not reachable from the URL." },
      { name: "Switch AI Model", reason: "aartiq://set-model is mapped to a renderer channel that has no listener." },
      { name: "Create Document", reason: "aartiq://create-doc is mapped to a renderer channel that has no listener; the format and topic parameters are read by nothing." }
    ],
    setup: [
      "Open Shortcuts app on your Mac",
      "Create a new shortcut",
      "Add 'Open URL' action",
      "Enter aartiq:// URL with parameters",
      "Save and customize the shortcut"
    ]
  },
  {
    id: "voice-control",
    name: "Voice Control",
    icon: Volume2,
    fileRef: "src/lib/apple-script-bridge.js",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    description: "Use macOS dictation for voice input and text-to-speech for AI responses.",
    features: [
      {
        name: "Dictation Input",
        desc: "Speak naturally and have your words converted to text",
        usage: "cmd+d to activate macOS dictation"
      },
      {
        name: "Text-to-Speech",
        desc: "Hear AI responses spoken aloud",
        usage: "Add ?speak=true to any URL action"
      },
      {
        name: "Voice Selection",
        desc: "Choose from default macOS voices",
        usage: "Configure in Settings > Accessibility > Speech"
      },
      {
        name: "Speech Rate",
        desc: "Adjust speaking speed",
        usage: "Set rate in System Preferences"
      },
      {
        name: "Continuous Voice",
        desc: "Keep voice mode open for multiple exchanges",
        usage: "Use voice-chat URL action",
        available: false,
        note: "aartiq://voice-chat opens the chat view and does not begin listening."
      }
    ],
    commands: [
      { action: "Dictation", trigger: "Command+D", usage: "macOS system dictation, not an Aartiq binding" },
      { action: "Stop Listening", trigger: "Escape", usage: "Abort Current Action, per src/lib/constants.ts" },
      { action: "Voice Response", trigger: "?speak=true", usage: "Speak the AI response" },
      { action: "Select Voice", trigger: "?voice=Samantha", usage: "Choose voice" }
    ],
    phraseNote: "The triggers Aartiq itself matches are listed below. They are the strings in macOSSpeechRecognitionCommands in src/lib/voice-input-handler.js — not the phrase this page used to claim."
  },
  {
    id: "voice-phrases",
    name: "Recognised Voice Phrases",
    icon: Mic,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    description: "Speech is matched against these prefixes; the remainder of the utterance becomes the message. Speech that matches none of them is treated as a plain chat message and sent to the model, so the microphone is worth muting when it is not wanted.",
    triggers: [
      { trigger: "hey comet", action: "chat" },
      { trigger: "comet ai", action: "chat" },
      { trigger: "ask comet", action: "chat" },
      { trigger: "aartiq search", action: "search" },
      { trigger: "comet find", action: "search" },
      { trigger: "comet create", action: "create" },
      { trigger: "comet make", action: "create" },
      { trigger: "comet schedule", action: "schedule" },
      { trigger: "comet remind", action: "schedule" }
    ],
    wakeWord: "There is no wake word. Aartiq listens while the listen request is open and does not gate on a spoken name."
  },
  {
    id: "raycast-integration",
    name: "Raycast Integration",
    icon: Command,
    fileRef: null,
    color: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
    description: "Extend Raycast with Aartiq commands. Access AI features directly from the Raycast command bar.",
    extensions: [
      {
        name: "AI Chat",
        desc: "Quickly send a message to Aartiq",
        trigger: "ai {message}",
        icon: Bot
      },
      {
        name: "Search",
        desc: "Perform AI-powered web search",
        trigger: "search {query}",
        icon: Search
      },
      {
        name: "Create PDF",
        desc: "Generate a new PDF document",
        trigger: "pdf {title}",
        icon: FileText
      },
      {
        name: "Screenshot",
        desc: "Take a screenshot through Raycast",
        trigger: "screenshot",
        icon: Camera
      },
      {
        name: "Volume Control",
        desc: "Quickly adjust volume",
        trigger: "volume {0-100}",
        icon: Volume2
      },
      {
        name: "Open App",
        desc: "Launch applications",
        trigger: "open {app name}",
        icon: AppWindow
      },
      {
        name: "Schedule Task",
        desc: "Quickly schedule automation",
        trigger: "schedule {task} at {time}",
        icon: Calendar
      },
      {
        name: "Terminal",
        desc: "Run shell commands",
        trigger: "run {command}",
        icon: Terminal
      }
    ],
    status: "not-published",
    statusNote: `The Raycast extension is not published and not usable today. Its manifest declares a single command, Search Tabs, and that command calls a local HTTP endpoint on port ${RAYCAST_RETIRED_PORT} which no longer exists in Aartiq — the handler layer behind it was moved onto the token-authenticated ${BRIDGE.port} bridge, and nothing was rewired. The command list above is the handler layer in src/lib/raycast-integration.js, which is real but only reachable from inside the app. Install and permission steps are therefore not listed: there is nothing to download. Tracked in aartiq-browser/docs-audit/feature-triage.md as raycast.extension and raycast.commands.`
  }
];

const featureById = (id: string) => {
  const found = features.find((f) => f.id === id);
  if (!found) throw new Error(`apple-integration: no feature block with id "${id}"`);
  return found;
};

const appleIntelligence = featureById("apple-intelligence");
const siri = featureById("siri-integration");

const codeExamples = {
  appleIntelligence: `// window.electronAPI is the only bridge preload.js exposes.
// window.electron does not exist, and these examples used to call it.
// All four commands refuse off macOS with
// { success: false, error: 'Apple Intelligence is only available on macOS.' }

// What this machine can do. Each command has its own OS floor, so check
// before calling: summaryAvailable is separate from imageAvailable and
// genmojiAvailable.
const status = await window.electronAPI.getAppleIntelligenceStatus();
// {
//   success: true,
//   osVersion: 'Version 26.0 (Build 25A354)',
//   available: true,                 // Foundation Models, i.e. summaries
//   supportsSummaries: true,
//   summaryAvailable: true,
//   imageAvailable: true,
//   genmojiAvailable: true,
//   availableStyles: ['illustration', 'line-art', ...]
// }
// Each unavailable command also carries a *_Reason string, e.g.
// summaryReason: 'Summaries require macOS 26 with Foundation Models.'

// Summarize. Takes a bare string, not an object, and returns summary.
const summary = await window.electronAPI.summarizeWithAppleIntelligence(
  'Long article content here...'
);
console.log(summary.summary);        // summaryAvailable requires macOS 26.0+

// Generate an image. Returns a file path, not base64.
const image = await window.electronAPI.generateAppleIntelligenceImage({
  prompt: 'A futuristic city at sunset',
  style: 'illustration'             // optional; defaults to illustration
});
console.log(image.imagePath);        // imageAvailable requires macOS 15.1+

// Generate a custom emoji. Same payload shape.
const emoji = await window.electronAPI.generateGenmoji({
  prompt: 'a robot chef'
});
console.log(emoji.genmojiPath);      // genmojiAvailable requires macOS 15.4+`,

  siriPhrases: `// Siri phrases registered in src/lib/native-panels/AppIntents.swift
//
// Reaches a bridge route the app actually serves:
//   "Ask Aartiq [prompt]"                            // "Tell", "Query" too
//   "Refine Aartiq response"                         // "Make ... [instruction]"
//   "Regenerate Aartiq response"                     // "Try again in Aartiq"
//   "What did Aartiq say?"
//   "List my conversations in Aartiq"
//   "Open my [conversation] in Aartiq"
//   "New chat in Aartiq"
//   "Reset Aartiq chat"
//   "Search web with Aartiq for [query]"
//   "Switch Aartiq model to [model]"
//   "What can you do with Aartiq"
//
// Reaches a route, but only queues a prompt rather than doing the thing:
//   "Run [command] in Aartiq"          -> sendPrompt("Run this shell command: ...")
//   "Create a [format] about [topic]"  -> sendPrompt("Generate a ... document about: ...")
//   "Schedule [task] [time]"           -> sendPrompt("Schedule this task: ...")
//
// Resolves to an intent that calls a route the bridge does not serve,
// so Siri reports failure:
//   "Summarize this page with Aartiq"   -> /native-mac-ui/summarize-page
//   "Take screenshot with Aartiq"       -> /native-mac-ui/screenshot
//   "Set volume to [level] in Aartiq"   -> /native-mac-ui/volume
//   "Open [app] with Aartiq"            -> /native-mac-ui/open-app
//   "Read clipboard in Aartiq"          -> /native-mac-ui/clipboard
//
// There is no wake word. Dictation hands the transcript to Aartiq, which
// matches it against its own prefixes and otherwise sends it to the model.`,

  urlScheme: `# Apple Shortcuts URL Schemes (macOS)
//
// Verified working. Each of these changes app state on its own.

// Chat message
aartiq://chat?message=Hello%20AI

// Search (opens a Google results tab)
aartiq://search?query=latest%20tech%20news

// Navigate (http and https only)
aartiq://navigate?url=https%3A%2F%2Fexample.com

// Set volume (clamped to 0-100)
aartiq://volume?level=75

//
// Queues a prompt in the chat; the link itself performs no action.
// There is no parameter that skips approval on a shell command.

aartiq://run-command?command=ls%20-la
aartiq://create-pdf?content=Report%20content&title=My%20Report
aartiq://schedule?task=Daily%20brief&cron=0%208%20*%20*%20*

//
// Not dispatched. Listed so they are not mistaken for working links.
// Each maps to a renderer channel that has no listener.

aartiq://screenshot
aartiq://set-model?model=GPT-4
aartiq://create-doc?format=xlsx&topic=Stock%20Market%20Analysis`,

  voiceControl: `// window.electronAPI is the only bridge preload.js exposes.
// window.electron does not exist, and these examples used to call it.

async function listen() {
  const result = await window.electronAPI.voice.listen({ timeout: 10000 });
  // result is the transcript. Aartiq matches it against its own trigger
  // prefixes; unmatched speech is submitted to the model as a chat message.
  return result;
}

async function speak(text) {
  await window.electronAPI.voice.speak(text, { rate: 180, voice: 'Samantha' });
}

async function voices() {
  return await window.electronAPI.siri.getVoices();
  // ['Alex', 'Ava', 'Fred', 'Grace', 'Samantha', ...]
}`,

  raycast: `# The Raycast extension is not published and not usable today.
# Its manifest declares one command (Search Tabs) and that command calls
# http://127.0.0.1:9877/raycast, a port Aartiq no longer listens on.
# Nothing below works; it is kept as a record of the intended command surface.
# See aartiq-browser/docs-audit/feature-triage.md (raycast.extension).

/ai Tell me a joke
/search latest AI news
/pdf Daily Report
/screenshot
/volume 75
/open Safari
/schedule Generate report at 8am
/run ls -la`,
};

export default function AppleIntegrationPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-24 bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Apple size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Apple Integration
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Apple <span className="text-white/20">Integration</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          macOS-specific integration layer bridging Aartiq with Apple Intelligence, Siri, Shortcuts,
          and Voice Control. The bridges live in
          <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/SiriShortcutsIntegration.js</code>
          and
          <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/apple-script-bridge.js</code>,
          with the Apple Intelligence helper in
          <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/apple-intelligence.swift</code>
          and native SwiftUI panels in
          <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/native-panels/</code>.
          Every command listed below states the platform and OS version it actually needs.
        </p>
      </motion.section>

      {/* Feature Cards Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`group block rounded-[40px] border ${feature.borderColor} bg-gradient-to-br ${feature.color} p-10 transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}
                onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/5 ${feature.iconColor} shadow-lg`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="mb-4 text-xl font-black uppercase tracking-wider">{feature.name}</h3>
                <p className="mb-4 text-sm font-medium leading-relaxed text-white/50">{feature.description}</p>
                {feature.fileRef && (
                  <p className="font-mono text-[10px] text-white/20">{feature.fileRef}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Apple Intelligence */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            macOS Native AI
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Apple <span className="text-white/20">Intelligence</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/40">
            Aartiq integrates with Apple's on-device AI capabilities on supported Macs.
            The native Swift bridge handles readiness checks, summarization, and image generation.
            Source: <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/native-panels/AppleIntelligenceBridge.swift</code>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <h3 className="mb-6 text-xl font-black uppercase tracking-wider">Requirements</h3>
            <ul className="space-y-3">
              {appleIntelligence.requirements?.map((req, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/50">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <h3 className="mb-6 text-xl font-black uppercase tracking-wider">Available Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {appleIntelligence.features?.map((f, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <ChevronRight size={14} className="mt-0.5 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white">
                      {f.name}
                      {"os" in f && f.os ? (
                        <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">{f.os}</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-white/40">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-wider">Code Example</h3>
            <button
              onClick={() => copyCode(codeExamples.appleIntelligence, "ai-code")}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white/60 transition-colors hover:bg-white/10"
            >
              {copiedCode === "ai-code" ? (
                <><Check size={14} className="text-emerald-400" /> Copied!</>
              ) : (
                <><Copy size={14} /> Copy</>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/80">
            <code>{codeExamples.appleIntelligence}</code>
          </pre>
        </div>
      </motion.section>

      {/* Siri Integration */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Voice Commands
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Siri <span className="text-white/20">Integration</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/40">
            App Intents bridge allowing Siri to trigger Aartiq actions. Twenty intents are defined in
            <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/native-panels/AppIntents.swift</code>.
            {siri.bridgeNote}
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 mb-6">
          <h3 className="mb-6 text-xl font-black uppercase tracking-wider">Available Siri Phrases</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {siri.phrases?.map((phrase, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <Mic size={16} className="mt-0.5 text-purple-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">&ldquo;{phrase.phrase}&rdquo;</p>
                  <p className="text-xs text-white/40">{phrase.desc}</p>
                  {phrase.queuesOnly ? (
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-amber-400/70">queues a prompt only</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/[0.03] p-8 mb-6">
          <h3 className="mb-2 text-xl font-black uppercase tracking-wider text-red-300/80">
            Registered but non-functional
          </h3>
          <p className="mb-6 text-sm text-white/40">
            These phrases resolve to an intent, and the intent calls a bridge route that is not served. Siri
            reports a failure rather than doing the thing.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {siri.broken?.map((phrase, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-black/20 p-4">
                <AlertCircle size={16} className="mt-0.5 text-red-400/70 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white/70">&ldquo;{phrase.phrase}&rdquo;</p>
                  <p className="text-xs text-white/40">{phrase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h3 className="mb-6 text-xl font-black uppercase tracking-wider">How It Works</h3>
          <div className="flex flex-wrap items-center gap-3">
            {siri.workflows?.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-sm font-black text-purple-400">
                  {i + 1}
                </div>
                <span className="text-sm text-white/50">{step}</span>
                {i < siri.workflows!.length - 1 && (
                  <ChevronRight size={16} className="text-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-wider">Siri Phrases Reference</h3>
            <button
              onClick={() => copyCode(codeExamples.siriPhrases, "siri-code")}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white/60 transition-colors hover:bg-white/10"
            >
              {copiedCode === "siri-code" ? (
                <><Check size={14} className="text-emerald-400" /> Copied!</>
              ) : (
                <><Copy size={14} /> Copy</>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-black/40 p-6 font-mono text-sm text-white/80">
            <code>{codeExamples.siriPhrases}</code>
          </pre>
        </div>
      </motion.section>

      {/* Apple Shortcuts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            URL Scheme
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Apple <span className="text-white/20">Shortcuts</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/40">
            The aartiq:// URL scheme enables integration with Apple Shortcuts. Route definitions
            are in
            <code className="mx-1 rounded bg-white/5 px-2 py-0.5 font-mono text-sm">src/lib/SiriShortcutsIntegration.ts</code>.
            Build automation workflows combining Aartiq with other apps.
          </p>
        </div>

      </motion.section>
    </div>
  );
}
