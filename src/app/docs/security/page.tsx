"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, 
  Eye, 
  Lock, 
  AlertTriangle,
  CheckCircle2,
  CircleX,
  Smartphone,
  Terminal,
  Key,
  Scan,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Layers,
  UserCheck,
  Bug,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  LockKeyhole,
  Server,
  FileKey
} from "lucide-react";

import { tests, derived, ci, security, net, version } from "@/data/facts";

/** Per-suite declared counts, keyed by suite name (extension stripped). */
const suiteTotal = (...names: string[]) =>
  names.reduce((n, name) => {
    const s = tests.perSuite.find((x) => x.suite === name);
    return n + (s ? s.declared : 0);
  }, 0);

const osSandboxTests = suiteTotal(
  "sandbox-security",
  "windows-job-sandbox",
  "linux-bwrap-sandbox",
);
const approvalTicketTests = suiteTotal("approval-ticket-security");

/** Windows CI job, resolved by OS rather than by re-typing its counts. */
const windowsJob = ci.perJob.find((j) => j.os.startsWith("windows")) ?? {
  passed: 0,
  skipped: 0,
  failed: 0,
  declared: 0,
};

/**
 * Presentation only — names, badges, and colours. Every word of substance
 * (approval method, auto-approve default, examples, and the limitation) comes
 * from `security.riskTiers`, so the four tiers cannot be described one way here
 * and another way in the README.
 */
const TIER_STYLE = {
  low: {
    name: "Low Risk",
    badge: "Opt-in auto-approve",
    icon: ShieldCheck,
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  medium: {
    name: "Medium Risk",
    badge: "Asked every time",
    icon: ShieldAlert,
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  high: {
    name: "High Risk",
    badge: "Explicit confirmation",
    icon: ShieldAlert,
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
  },
  critical: {
    name: "Critical Risk",
    badge: "Never auto-approved",
    icon: ShieldOff,
    color: "text-rose-400",
    border: "border-rose-500/30",
    bg: "bg-rose-500/5",
  },
} as const;

const securityLayers = [
  {
    name: "Visual Sandbox",
    icon: Eye,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    level: 1,
    description: "The AI perceives web pages as sanitized extractions of the rendered page — DOM text through the accessibility snapshot and the DOM-extraction pipeline, plus screenshots + OCR for image commands — never raw, unprocessed HTML. This significantly reduces DOM-based manipulation attacks, but it is a mitigation, not an absolute guarantee.",
    howItWorks: [
      "Most commands read the page as text: navigation, search and page reads go through the accessibility snapshot and the DOM-extraction pipeline (src/lib/web-extractor.js, Readability-based), with extraction after load at src/lib/mcp-browser-server.js:1395-1435. Screenshots (Electron webContents.capturePage — src/main/handlers/browser-handlers.js) and Tesseract.js OCR (src/lib/tesseract-service.js) serve the image commands (OCR_SCREEN and vision reads). The AI never runs inside the page's JavaScript realm.",
      "SecureDOMReader (src/components/ai/SecureDOMReader.ts) provides a text fallback path. It blocks script/style/iframe/object/embed/form/input/button tags and nav/footer/header/modal/overlay/ads classes before text extraction.",
      "PII redaction: emails, phone numbers, card numbers, bearer tokens, session IDs, and password/api-key assignments are replaced with [REDACTED] placeholders before content reaches the model.",
      "SecureDOMParser (src/lib/Security.ts) runs the extracted content against shell-primitive, encoding, and injection pattern groups, decodes base64/hex payloads, and rewrites dangerous matches to [BLOCKED: LAYER].",
      "AI Fortress masks API keys and secrets before content reaches the LLM (src/lib/Security.ts, src/components/AIChatSidebar.tsx).",
      "The AI context is explicitly built as read-only: the model cannot modify the DOM; interaction is limited to approved click/fill commands (FIND_AND_CLICK / CLICK_ELEMENT).",
      "Source files: src/lib/Security.ts, src/lib/html-sanitizer.js, src/components/ai/SecureDOMReader.ts"
    ],
    benefits: [
      "Significantly reduces prompt-injection via DOM manipulation — hidden, scripted, or style-obfuscated content is stripped before it reaches the model",
      "Page JavaScript cannot directly invoke the AI's execution layer (Electron context isolation + no DOM-write access); scripts are stripped from AI-visible content",
      "Hidden elements and blocked tags/classes never appear in AI-visible content",
      "Malicious scripts, event handlers (on*=), javascript:, data:, vbscript:, iframe/embed/object are removed from the AI's reading path"
    ],
    notGuaranteed: [
      "Visual and sanitized extraction reduces the attack surface for certain DOM-based prompt injection techniques; it does NOT prevent prompt injection entirely.",
      "OCR processes visible text on rendered pages, but visible text can itself contain adversarial instructions. OCR does not distinguish legitimate content from attacker-injected instructions.",
      "Visual layout analysis and OCR cannot guarantee semantic immunity against jailbreaks or instruction overrides rendered into the viewport."
    ],
    diagram: {
      browser: "Chrome / WebView",
      capture: "Screenshot Capture",
      process: "OCR Processing",
      ai: "AI Model",
      flow: ["browser", "capture", "process", "ai"]
    }
  },
  {
    name: "Syntactic Firewall",
    icon: Terminal,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    level: 2,
    description: "Every command is analyzed for dangerous patterns before execution.",
    howItWorks: [
      "Commands are scanned for destructive shell primitives and blocked commands (rm, sudo, su, passwd, chgrp, dd if=, mkfs, fork-bomb, command substitution)",
      "Encoded payloads and obfuscation (hex, base64, HTML entities) are decoded via extractBase64Strings and re-checked against injection patterns",
      "Jailbreak patterns ('ignore all previous instructions', etc.) are blocked before content reaches the model",
      "Network-triggering commands (curl, wget) are flagged, and the OS sandbox denies network by default",
      "This layer is explicitly documented as a fast first-pass reject — not sufficient on its own (SecurityValidator.js header)",
      "Source files: src/lib/SecurityValidator.js, src/lib/Security.ts, src/core/command-validator.js"
    ],
    patterns: {
      blocked: [
        { pattern: "rm -rf /", description: "Recursive delete of root" },
        { pattern: "sudo", description: "Blocked command (privilege escalation)" },
        { pattern: "dd if=", description: "Direct disk write" },
        { pattern: ":(){ :|:& };:", description: "Fork bomb" },
        { pattern: "$( ... )", description: "Command substitution" },
        { pattern: "\\x.. hex / chmod 777", description: "Encoded payload / permissive mode" },
        { pattern: "curl / wget", description: "Network download (flagged; sandbox denies net)" }
      ],
      monitored: [
        { pattern: "rm ", description: "File deletion (requires approval)" },
        { pattern: "chmod / chown", description: "Permission change (requires approval)" },
        { pattern: "kill / shutdown / mount", description: "Process/system change (requires approval)" }
      ]
    },
    benefits: [
      "Stops known attack patterns at the gate",
      "Prevents accidental destructive commands",
      "Provides logging for security audits",
      "Custom rules can be added by administrators"
    ],
    notGuaranteed: [
      "The Syntactic Firewall is a fast first-pass heuristic, NOT a fundamental security boundary.",
      "Regexes and token inspection can be bypassed by creative command construction, aliasing, encoding variations, or multi-step execution chains.",
      "SecurityValidator.js does not guarantee that non-blocked commands are safe — the OS sandbox (Seatbelt / bubblewrap / AppContainer) and human approval are the primary security boundaries."
    ]
  },
  {
    name: "Human-in-the-Loop",
    icon: UserCheck,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    level: 3,
    description: "Critical actions require explicit human approval before execution.",
    approvalTiers: [
      {
        name: "Low Risk",
        risk: "Auto / Shift+Tab",
        description: "Read-only actions, navigation, volume changes. Auto-run only if autoApproveLowRisk is enabled (default false); otherwise a quick approval.",
        examples: ["Taking screenshots", "Navigating to URLs", "Adjusting volume"]
      },
      {
        name: "Medium Risk",
        risk: "Approval dialog",
        description: "Actions that modify browser state or open apps. The dialog offers Allow Once / Always Allow / Deny (labels at src/components/ai/ClickPermissionModal.tsx:294-302); a shell command in this band instead routes through the shell permission bridge (src/core/shell-permission-bridge.js) and the choice persists via the permission store.",
        examples: ["Filling forms", "Clicking buttons", "Opening applications"]
      },
      {
        name: "High Risk",
        risk: "QR + PIN (paired mobile)",
        description: "The desktop dialog cannot be approved without the paired mobile scanning the QR and returning the 6-digit PIN — mobileApproved && pinVerified gate the Approve button — src/components/ai/ClickPermissionModal.tsx:235-302. The QR carries a single-use token. High-risk MCP tool calls take the same QR route (src/lib/mcp-browser-server.js:158).",
        examples: ["Shell command execution", "External app automation", "File modifications"]
      },
      {
        name: "Critical Risk",
        risk: "Never approved",
        description: "Always denied by checkShellPermission (src/core/command-validator.js:87-90); what follows is a plain Allow / Deny prompt (src/main/handlers/utils.js:222-229), not a ticket. No capability assigns 'critical' except remote-origin shell escalation (medium→high, high→critical — src/main/handlers/sync-handlers.js:231-238).",
        examples: ["Destructive / irreversible operations", "Privilege escalation"]
      }
    ],
    howItWorks: [
      "AI generates a command; the parser assigns a risk field (default medium).",
      "checkShellPermission() classifies low/medium/high/critical and checks the PermissionStore allowlist; with no store it denies (fail-closed) — src/core/command-validator.js:77-133.",
      "Low risk: auto-runs only if autoApproveLowRisk is on (default off); otherwise a lightweight approval.",
      "QR + 6-digit PIN covers remote shell commands and high-risk actions: power actions from a paired device — src/main/handlers/sync-handlers.js; desktop AI-initiated high-risk actions, where the desktop generates a QR encoding aartiq://approve?id=<token>&pin=<6-digit> and the paired mobile must return the PIN (the Approve button stays disabled until mobileApproved && pinVerified) — src/components/ai/ClickPermissionModal.tsx:235-302; high-risk MCP tool calls — src/lib/mcp-browser-server.js:157-168; and remote-origin shell execution, which is registered with origin policy { local: 'never', remote: 'always' } and strictly requires single-use, input-hash-bound ticket redemption before execution — src/main/handlers/sync-handlers.js:231-270.",
      "Native platform approval dialog: dialog buttons are accurately labeled ['Deny', 'Approve'], removing misleading Touch ID text from standard message boxes. Real native biometric verification is implemented: macOS LocalAuthentication (LAPolicy.deviceOwnerAuthentication Touch ID or Mac password), Windows Hello (UserConsentVerifier / WebAuthn), and Linux polkit (BiometricAuthManager). The requireBiometricPerSession / requireBiometricEveryTime flags are strictly enforced and fail closed (deny) if unsupported or cancelled — src/main/handlers/native-approval-manager.js.",
      "Master PIN (PBKDF2-SHA256 with 100,000 rounds) is stored securely in Native OS Keychains (Apple Keychain, Windows Credential Manager DPAPI, Linux Secret Service) with a 5-attempt lockout, providing hardware-backed credential protection for remote and high-risk approvals — src/lib/MasterPINService.ts.",
      "The renderer only enables Approve when both mobileApproved and pinVerified are true (or the biometric verification succeeds) — src/components/ai/ClickPermissionModal.tsx:247-302.",
      "Critical risk is denied at the gate — checkShellPermission returns false for critical, src/core/command-validator.js:87-90 — and a human decision at that point is a plain Allow / Deny through the shell permission bridge (src/main/handlers/utils.js:222-229), not a ticket. Single-use, input-hash-bound tickets cover MCP high-risk tool calls and approve-style capability actions — src/core/capability-controller.js:29-100, src/core/approval-ticket-manager.js:139-278, src/lib/approval-gate.js:53-147.",
      "Command only executes after explicit approval; timeouts and missing renderers resolve to deny — src/core/shell-permission-bridge.js:42-71.",
      "Permission writes that arrive over the native macOS / CLI bridge are routed through src/lib/native-bridge-permission-routes.js into the same PermissionStore the gate reads, so a grant made over the bridge reaches checkShellPermission without a restart, an invalid access level fails closed, and the write is appended to the audit trail",
      "Source files: src/core/command-validator.js, src/lib/permission-store.js, src/main/handlers/sync-handlers.js, src/main/handlers/utils.js, src/main/handlers/native-approval-manager.js, src/components/ai/ClickPermissionModal.tsx, src/core/capability-controller.js, src/lib/MasterPINService.ts"
    ],
    benefits: [
      "No automated execution of destructive commands",
      "QR approval ensures physical presence",
      "Mobile app confirms identity via Dual-Gate Permission Relay (Master PIN + Android Screen Lock)",
      "Real native biometric verification (Touch ID / Windows Hello / polkit)",
      "Master PIN stored securely in Native OS Keychains"
    ]
  },
  {
    name: "Directory Allowlist",
    icon: Lock,
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    level: 4,
    description: "AI file access is restricted to explicitly approved directories with fine-grained read/write permissions. This is a policy layer; the enforcement boundary is the OS sandbox.",
    howItWorks: [
      "Each directory in the allowlist specifies an access level (Read Only or Read & Write) and recursive flag (src/lib/permission-store.js)",
      "Default allowlist is narrowed to a single dedicated app workspace directory (~/.aartiq/sandbox-workspace) plus /tmp. No personal profile folders (home, Desktop, Documents, Downloads) are granted by default.",
      "Sensitive path deny list: ~/.ssh, ~/.gnupg, ~/.aws, ~/.config/gcloud, ~/.azure, ~/.kube, browser profiles, password managers, keychains, shell history, and .env files are unconditionally denied, even if a user allows their parent directory.",
      "Path canonicalization resolves symlinks via fs.realpathSync before checking against allowlists and deny lists — symlink traversal is strictly blocked (src/core/directory-allowlist.js)",
      "Deny rules are enforced in OS-level sandbox profiles too: Seatbelt deny rules on macOS, bubblewrap tmpfs mask mounts on Linux, and AppContainer ACLs on Windows.",
      "Just-in-time permission prompts request approval before accessing new directories, defaulting to read-only with the full resolved path shown.",
      "Batched multi-directory approval allows granting access to multiple paths at once",
      "File management operations (move, copy, open, print) are routed around the shell sandbox",
      "Read/write separation: a read grant must never allow deleting/overwriting — enforced in isPathAllowed() for both read and write operations",
      "Source files: src/core/directory-allowlist.js, src/lib/permission-store.js, src/core/sandbox.js, src/main/handlers/permission-handlers.js"
    ],
    benefits: [
      "Scopes AI file access to an explicit allowlist — any path outside it is denied with a structured reason",
      "Default access narrowed to dedicated app workspace (~/.aartiq/sandbox-workspace) + temp directory, protecting personal files",
      "Sensitive credential directories (~/.ssh, ~/.aws, keychains, .env) strictly denied across both app logic and OS sandbox profiles",
      "Symlink traversal attacks are blocked via realpath resolution",
      "Read-only entries never receive write access — enforced in the sandbox profile (macOS/Linux) and by isPathAllowed() on all platforms",
      "Audit trail of all directory access grants with timestamps (aartiq-audit.jsonl)"
    ],
    notGuaranteed: [
      "TOCTOU races: the path is checked at validation time; the filesystem may change before the operation executes",
      "Hard links: a hard link inside the allowlist to a file outside it bypasses path-based checks",
      "Bind mounts / mount namespaces: an attacker with mount privileges can remap filesystem views",
      "Permission changes after authorization: a granted path may later have its permissions widened",
      "Filesystem namespaces: Linux mount namespaces can present different filesystem hierarchies",
      "Helper processes: a sandboxed command that spawns an allowed helper (e.g. python) may escape the allowlist",
      "Alternate APIs: some operations (archive extraction, memory-mapped files, certain IPC) may bypass the checked path",
      "Platform-specific filesystem semantics: Windows reparse points, macOS firmlinks, etc. may behave differently",
      "The real enforcement boundary is the OS sandbox (Seatbelt / bubblewrap / AppContainer), not the allowlist check alone"
    ]
  },
  {
    name: "OS-Level Sandboxing",
    icon: ShieldOff,
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
    level: 5,
    description: "Shell commands execute inside platform-specific OS sandboxes that enforce process, filesystem, and network boundaries. Execution is FAIL-CLOSED: if the sandbox cannot be built and verified, the command is never run — there is no automatic fallback to unsandboxed execution.",
    howItWorks: [
      "macOS: Seatbelt (sandbox-exec) with a closed-by-default profile — (deny file-read*) and (deny file-write*) then re-allow only system paths + allowlisted directories + workspace, (deny network*), (deny system-socket) to block AF_UNIX IPC, (deny signal) confined to self/children, (deny file-map-executable) mirroring the exec allowlist, and (deny file-write-mount file-write-umount)",
      "The Seatbelt profile is written to a temp file and validated with a pre-flight `sandbox-exec -f <profile> /usr/bin/true` run; if the profile fails to compile, the command is rejected (SANDBOX_POLICY_INVALID)",
      "Linux: bubblewrap (bwrap) with unshared pid/net/ipc/uts/user/cgroup namespaces, a new session (--new-session), read-only system mounts (/usr, /bin, /sbin, /lib, /lib64, /etc), private /tmp, and --unshare-net",
      "bubblewrap gets an extra capability pre-flight: `--version` succeeds even when user namespaces are disabled, so we run a real `--unshare-pid/net/ipc/uts/user/cgroup /bin/true` probe and fail closed if the namespaces we require cannot be created (common in locked-down containers and some CI runners)",
      "Windows: AppContainer (src/core/win-job-runner.ps1) — the target process is created SUSPENDED with the SECURITY_CAPABILITIES proc-thread attribute on CreateProcessW (the documented LaunchAppContainer pattern — CreateProcessAsUserW does not support this attribute), so the kernel builds the container token at process start with ZERO capabilities: no network, no device, no user-handle access, enforced from the very first instruction; the process is assigned to a Job Object and verified via IsProcessInJob before resuming; limits (KILL_ON_JOB_CLOSE, active-process cap, job memory, die-on-unhandled-exception) are applied and verified before the target runs a single instruction. The separate useAppContainer:false restricted-token path deletes dangerous privileges and applies a Low mandatory-integrity label (S-1-16-4096)",
      "Windows filesystem isolation is at the OS layer: the AppContainer package SID is granted ACL access ONLY to allowlisted directories, the sandbox workspace, and the resolved executable (icacls). Anything not allowlisted stays DENIED. Grants are revoked and the AppContainer profile deleted after each run",
      "Windows network isolation is at the OS layer: the AppContainer carries ZERO capabilities, so it cannot initiate network connections at all; TEMP/TMP/LOCALAPPDATA are rerouted into the per-run profile folder",
      "All platforms: environment is sanitized — only allowlisted variables (PATH, HOME, USER, LANG, LC_ALL, TMPDIR, SHELL, TERM, etc.) pass through; API keys and tokens never reach the sandboxed process (buildSafeEnv)",
      "Every result carries an explicit `isolation` object ({ filesystem, network, process }) so callers cannot mistake process containment for filesystem/network isolation: macOS, Linux, and Windows all report {true, true, true} when the platform sandbox is active, and any setup failure or unsandboxed run reports all false. No single boolean 'sandboxed' is trusted on its own",
      "Network inside the sandbox is denied by default on all platforms: macOS (deny network*), Linux (--unshare-net), and Windows (zero AppContainer capabilities). Per-domain network allowlisting is NOT supported on any platform — requesting it fails closed",
      "macOS residual (not eliminated): Seatbelt profiles start from (allow default), so not every IPC class is denied-by-default — Mach IPC remains usable (required for node/python/shell), and Apple Events cannot be filtered by current sandbox-exec (operation not exposed), so a sandboxed command could still ask another app to act on its behalf",
      "Source files: src/core/sandbox-executor.js, src/core/win-job-runner.ps1, src/core/directory-allowlist.js"
    ],
    benefits: [
      "Defense in depth: even if the regex blocklist is bypassed, the OS sandbox still confines what the command can read, write, execute, and reach on the network",
      "On all three platforms the OS sandbox prevents writes outside the workspace + allowlisted write directories — on Windows this is enforced by OS ACL grants on the AppContainer package SID",
      "Credential leakage via ambient environment variables is prevented by the env allowlist",
      "Network exfiltration is blocked by default-deny networking inside the sandbox (macOS/Linux/Windows), not by firewall rules"
    ],
    notGuaranteed: [
      `On Windows before v${version.semver} the Job Object confined processes only; AppContainer (v${version.semver}) adds OS-layer filesystem (package-SID ACL grants) and network (zero capabilities) isolation. The Windows runtime matrix runs in CI on windows-latest and is currently ${ci.latestRun.conclusion} — the full three-sandbox Jest matrix on Windows (${windowsJob.passed} passing, ${windowsJob.skipped} platform-skipped of ${windowsJob.declared}) completes green, and every runtime containment test (suspended AppContainer start, verified job assignment, grandchild containment, secret isolation, OS-enforced ACL allowlist denial, KILL_ON_JOB_CLOSE) returns a verified sandbox result. The documentation claims the process is created suspended with SECURITY_CAPABILITIES on CreateProcessW, then the Job Object is assigned and verified via IsProcessInJob before resuming. This is the right design — you should verify the actual PowerShell/C++/Node implementation (src/core/win-job-runner.ps1) rather than trusting the documentation alone.`,
      "A sandbox confines what a command can do. It does not make a malicious command safe, and it does not decide what the AI asks for. Human approval is a social control, not a cryptographic one; a coerced or careless approval still executes.",
      "Seatbelt and bubblewrap constrain the process, not the data it is handed. If you allowlist a directory that contains secrets, the sandboxed command can read them. Allowlists are trust boundaries you draw — only as good as where you draw them.",
      "These guarantees apply to code executed through executeSandboxed(). The Electron main process, the renderer, native modules, and helper apps are NOT inside the sandbox. Sandboxing reduces blast radius; it is not a substitute for least-privilege OS accounts, patched dependencies, or simply not running untrusted code.",
      "Fail-closed means we refuse to run rather than run uncontained. It does not mean every malicious input is harmless — a command that is allowed by policy and approved by a human runs, inside the sandbox, with whatever access the policy grants."
    ]
  },
  {
    name: "Capability-Scoped Execution",
    icon: ShieldCheck,
    color: "from-sky-500/20 to-indigo-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
    level: 6,
    description: "Actions must be explicitly registered with a named handler and approval tier. Unregistered actions are rejected.",
    howItWorks: [
      "Each allowed action is registered with the CapabilityController",
      "Approval tiers: never (auto-approved), first-time-per-session, always (explicit confirm)",
      "Ticket-based authorization ensures single-use approval for high-risk actions",
      "Unregistered actions don't exist as callable surfaces — prompt injection cannot invoke them",
      "Source files: src/core/capability-controller.js, src/core/command-validator.js"
    ],
    benefits: [
      "Removes dangerous primitives from the attack surface entirely",
      "Prompt injection cannot invoke an action through the capability interface unless that action is registered and authorized",
      "Ticket system prevents replay attacks on approved actions",
      "Granular control over what the AI can and cannot do"
    ]
  }
];

const threatScenarios = [
  {
    threat: "Prompt Injection via Hidden Text",
    scenario: "A malicious webpage hides prompt injection instructions in invisible text",
    defense: "Visual Sandbox strips hidden DOM elements and scripts before the AI sees content. OCR captures only visible, rendered text. This significantly reduces DOM-based prompt injection but does not prevent visible-text injection — adversarial instructions rendered on the page can still reach the model.",
    layer: "Visual Sandbox"
  },
  {
    threat: "Malicious JavaScript Redirect",
    scenario: "A webpage uses JavaScript to redirect the AI to a phishing site",
    defense: "The AI sees sanitized extractions of the rendered page — DOM text or screenshots/OCR — never live page JavaScript, and extracted text passes the injection scan before it reaches the model.",
    layer: "Visual Sandbox"
  },
  {
    threat: "Social Engineering via Commands",
    scenario: "An attacker tricks the AI into running 'rm -rf /'",
    defense: "The Syntactic Firewall attempts to block known dangerous shell patterns (rm -rf /, sudo, fork bombs, command substitution) before execution. It is a fast first-pass filter — creative command construction can bypass it. The OS sandbox and approval gates are the real boundaries.",
    layer: "Syntactic Firewall"
  },
  {
    threat: "Context Injection via Context Switching",
    scenario: "A webpage contains instructions that attempt to override AI behavior",
    defense: "User-provided content is filtered for known injection patterns before reaching the AI context. Pattern-based filtering is not foolproof; novel jailbreaks can evade it.",
    layer: "Syntactic Firewall"
  },
  {
    threat: "Unauthorized Shell Execution",
    scenario: "AI executes a destructive shell command",
    defense: "Human-in-the-Loop requires explicit approval for all shell commands. High-risk commands require QR approval via the paired mobile device.",
    layer: "HITL"
  },
  {
    threat: "Remote Code Execution",
    scenario: "AI is tricked into downloading and running malicious code",
    defense: "Shell commands triggering downloads (curl, wget) are blocked by the firewall. The OS sandbox denies network by default. Any shell execution requires human approval.",
    layer: "HITL + Firewall"
  },
  {
    threat: "Symlink Traversal Attack",
    scenario: "Attacker creates a symlink in an allowed directory pointing to /etc/passwd or other sensitive files",
    defense: "Path canonicalization resolves symlinks via fs.realpath() before checking against the allowlist. This catches standard symlink traversal. It does not protect against TOCTOU races, hard links, bind mounts, or filesystem namespace tricks — the OS sandbox is the enforcement boundary.",
    layer: "Directory Allowlist"
  },
  {
    threat: "Credential Leakage via Environment Variables",
    scenario: "AI executes a command that inherits the parent process's environment with API keys and tokens",
    defense: "OS-level sandboxing strips all ambient environment variables. Only explicitly allowlisted non-credential variables are passed to child processes.",
    layer: "OS-Level Sandboxing"
  },
  {
    threat: "Network Exfiltration via Shell",
    scenario: "AI is tricked into executing curl to upload sensitive data to an attacker's server",
    defense: "The sandbox denies network by default: macOS Seatbelt emits (deny network*), Linux bubblewrap runs with --unshare-net, Windows AppContainer carries zero capabilities. curl/wget is additionally flagged by the command validator, and all shell execution requires human approval. Per-domain allowlisting is not supported on any platform.",
    layer: "OS-Level Sandboxing"
  },
  {
    threat: "Unauthorized API Invocation",
    scenario: "Prompt injection attempts to invoke an unregistered shell command or system action",
    defense: "Capability-Scoped Execution rejects unregistered actions entirely. If there's no registered run_shell_command action, prompt injection cannot invoke one through the capability interface unless that action is registered and authorized.",
    layer: "Capability-Scoped"
  }
];

const permissionLevels = [
  { name: "Screen Reading", description: "Required for AI to see page content", required: true },
  { name: "Shell Execution", description: "Required for terminal commands", highRisk: true },
  { name: "App Launching", description: "Required for opening applications", mediumRisk: true },
  { name: "File System Access", description: "Required for PDF generation and downloads", required: true },
  { name: "Network Access", description: "Required for web browsing and API calls", required: true },
  { name: "Clipboard Access", description: "Required for copy/paste functionality", mediumRisk: true },
  { name: "Directory Allowlist", description: "Controls which directories AI can access", highRisk: true },
  { name: "OS-Level Sandboxing", description: "Enforces filesystem and network boundaries", required: true }
];

const encryptionDetails = {
  algorithm: "AES-256-GCM",
  keyDerivation: "PBKDF2-SHA256",
  iterations: 600000,
  saltLength: 16,
  ivLength: 12,
  description: "All sensitive data at rest is encrypted using AES-256-GCM with authenticated encryption and PBKDF2 key derivation.",
  implementation: {
    browser: "Web Crypto API (crypto.subtle)",
    node: "Node.js crypto module",
    features: [
      "Authenticated encryption (GCM mode) — tampered ciphertext is rejected",
      "Random salt + IV per encryption operation",
      "PBKDF2 key derivation with 600,000 iterations (OWASP 2023+)",
      "No silent fallback — encryption requires a passphrase or throws",
      "encodeLocalOnly() as an explicit escape hatch for non-sensitive data"
    ]
  },
  useCases: [
    { data: "Sync credentials", method: "Encrypted with user passphrase" },
    { data: "API keys", method: "AES-256-GCM with derived key" },
    { data: "Chat history", method: "End-to-end encrypted sync" },
    { data: "File transfers", method: "P2P encrypted relay" },
    { data: "Vault passwords", method: "Field-level encryption with keychain" },
    { data: "Legacy data", method: "Proactive migration to E2EE2: format" }
  ]
};

const apiKeyProtection = {
  description: "API keys are protected through multiple layers of security.",
  mechanisms: [
    {
      name: "Key Redaction",
      description: "API keys are automatically masked in logs and console output",
      pattern: /Bearer|token|api[_-]?key|secret/i,
      replacement: "[REDACTED]"
    },
    {
      name: "Secure Storage",
      description: "Keys stored in encrypted electron-store with OS keychain integration",
      location: "~/.config/aartiq-browser/secure/"
    },
    {
      name: "Environment Isolation",
      description: "Keys are never exposed to renderer process without explicit access",
      method: "Context isolation + preload bridge"
    },
    {
      name: "Auto-Masking",
      description: "AI prompts are scrubbed for API keys before processing",
      patterns: ["sk-... (OpenAI)", "AIza... (Google)", "anthropic-... (Anthropic)", "gsk_... (Groq)"]
    }
  ],
  tokenGeneration: {
    method: "crypto.getRandomValues()",
    entropy: "256-bit CSPRNG",
    length: "6-digit PIN / 8-char alphanumeric",
    purpose: "Session tokens, pairing codes, QR verification"
  }
};

export default function SecurityPage() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Shield size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Security Model
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Defense-in-Depth <span className="text-white/20">Security</span>
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Aartiq uses a defense-in-depth model with six layers: visual sandbox, syntactic firewall, human-in-the-loop authorization, directory allowlist, OS-level sandboxing, and capability-scoped execution — but only two of them are enforcement boundaries (the sandbox and approval, applied by the OS); the other four reduce blast radius without being boundaries. Source implementations: src/lib/Security.ts, src/lib/SecurityValidator.js, src/core/command-validator.js, src/core/directory-allowlist.js, src/core/sandbox-executor.js
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm leading-relaxed text-white/40">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-sky-400/70">Philosophy</p>
          <p>
            We did not set out to build a fortress. We set out to build a browser that can act on your
            behalf without becoming a liability — so that when the model is wrong, the damage stops at a
            boundary it cannot cross. Every layer below is a deliberate &ldquo;no&rdquo;: no raw page HTML in the
            model&apos;s context, no unverified command, no unsandboxed fallback, no silent yes. Security here is
            not a toggle you flip; it is the shape of the thing. The claims on this page are stated plainly,
            with their limits, because a security claim you cannot disprove is not a claim — it is a wish.
          </p>
        </div>

          {/* Security Stats */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 text-center">
            <ShieldCheck size={32} className="mx-auto mb-4 text-sky-400" />
            <h3 className="text-3xl font-black text-sky-400">6</h3>
            <p className="text-sm text-white/50">Security Layers</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <Layers size={32} className="mx-auto mb-4 text-emerald-400" />
            <h3 className="text-3xl font-black text-emerald-400">2</h3>
            <p className="text-sm text-white/50">Enforcement Boundaries (OS-applied), of six layers</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <Key size={32} className="mx-auto mb-4 text-amber-400" />
            <h3 className="text-3xl font-black text-amber-400">600K</h3>
            <p className="text-sm text-white/50">PBKDF2 Key-Derivation Iterations</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-sm leading-relaxed text-white/40">
          <p>
            The regex blocklist in SecurityValidator.js is documented as a <em>fast first-pass reject layer only</em> —
            not the primary defense. Primary enforcement continues through the remaining layers: the risk-tiered permission store
            (checkShellPermission), the capability controller's ticket-based approval (capability-controller.js), and
            the fail-closed OS sandbox (sandbox-executor.js). The six-layer model cited below reflects this defense-in-depth design.
          </p>
        </div>
      </motion.section>

      {/* Security Layers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Architecture
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            The Six <span className="text-white/20">Layers</span>
          </h2>
        </div>

        <div className="relative space-y-8">
          {/* Connection Lines */}
          <div className="absolute left-20 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500/50 via-amber-500/50 to-emerald-500/50 hidden lg:block" />

          {securityLayers.map((layer, i) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Level Indicator */}
              <div className="absolute -left-4 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-black text-white shadow-lg lg:-left-16 lg:top-0">
                {layer.level}
              </div>

              <div className={`rounded-[2rem] border ${layer.borderColor} bg-gradient-to-br ${layer.color} p-10`}>
                <div className="mb-8 flex items-start gap-6">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/5 ${layer.iconColor} shadow-lg`}>
                    <layer.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-wider">{layer.name}</h3>
                    <p className="mt-2 text-white/60">{layer.description}</p>
                  </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-2">
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white/40">
                      <CheckCircle2 size={16} className={layer.iconColor} /> How It Works
                    </h4>
                    <ul className="space-y-3">
                      {layer.howItWorks.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                          <span className={`mt-1 h-1.5 w-1.5 rounded-full ${layer.iconColor.replace('text-', 'bg-')}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white/40">
                      <Shield size={16} className={layer.iconColor} /> Benefits
                    </h4>
                    <ul className="space-y-3">
                      {layer.benefits.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                          <span className={`mt-1 h-1.5 w-1.5 rounded-full ${layer.iconColor.replace('text-', 'bg-')}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pattern examples for Syntactic Firewall */}
                {layer.patterns && (
                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                      <h5 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-red-400">
                        <CircleX size={16} /> Blocked Patterns
                      </h5>
                      <div className="space-y-2">
                        {layer.patterns.blocked.map((p) => (
                          <div key={p.pattern} className="flex items-center justify-between">
                            <code className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-300">{p.pattern}</code>
                            <span className="text-xs text-white/40">{p.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                      <h5 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-amber-400">
                        <AlertTriangle size={16} /> Monitored Patterns
                      </h5>
                      <div className="space-y-2">
                        {layer.patterns.monitored.map((p) => (
                          <div key={p.pattern} className="flex items-center justify-between">
                            <code className="rounded bg-amber-500/10 px-2 py-1 text-xs text-amber-300">{p.pattern}</code>
                            <span className="text-xs text-white/40">{p.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Tiers for HITL — AI browser actions; shell commands use security.riskTiers below */}
                {layer.approvalTiers && (
                  <div className="mt-8">
                    <h4 className="mb-6 text-sm font-black uppercase tracking-wider text-white/40">Approval — AI browser actions</h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {layer.approvalTiers.map((tier) => (
                        <div key={tier.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <h5 className="font-bold text-white">{tier.name}</h5>
                            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-black uppercase text-white/40">
                              {tier.risk}
                            </span>
                          </div>
                          <p className="mb-4 text-xs text-white/40">{tier.description}</p>
                          <div className="space-y-1">
                            {tier.examples.map((ex) => (
                              <p key={ex} className="text-xs text-white/30">• {ex}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limits the OS sandbox does not cover */}
                {layer.notGuaranteed && (
                  <div className="mt-8 rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
                    <h5 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-rose-400">
                      <ShieldOff size={16} /> What this does NOT guarantee
                    </h5>
                    <ul className="space-y-3">
                      {layer.notGuaranteed.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Threat Scenarios */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Threat Model
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Threat <span className="text-white/20">Scenarios</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            See how each security layer protects against common attack vectors.
          </p>
        </div>

        <div className="space-y-4">
          {threatScenarios.map((threat, i) => (
            <motion.div
              key={threat.threat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-8 lg:grid-cols-[1fr_2fr_1fr]"
            >
              <div>
                <AlertTriangle size={20} className="mb-3 text-amber-400" />
                <h4 className="font-bold text-white">{threat.threat}</h4>
                <p className="mt-2 text-xs text-white/40">{threat.scenario}</p>
              </div>
              <div className="border-x border-white/5 px-6">
                <ShieldCheck size={20} className="mb-3 text-emerald-400" />
                <h4 className="font-bold text-white">Defense</h4>
                <p className="mt-2 text-sm text-white/60">{threat.defense}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-sky-500/10 px-4 py-2 text-xs font-black uppercase text-sky-400">
                  {threat.layer}
                </span>
              </div>
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
        </div>

        <div className="space-y-4">
          {permissionLevels.map((perm, i) => (
            <motion.div
              key={perm.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="flex items-center gap-4">
                {perm.highRisk ? (
                  <ShieldAlert size={20} className="text-red-400" />
                ) : perm.mediumRisk ? (
                  <ShieldAlert size={20} className="text-amber-400" />
                ) : (
                  <ShieldCheck size={20} className="text-sky-400" />
                )}
                <div>
                  <h4 className="font-bold text-white">{perm.name}</h4>
                  <p className="text-sm text-white/40">{perm.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {perm.highRisk && (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase text-red-400">
                    High Risk
                  </span>
                )}
                {perm.mediumRisk && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase text-amber-400">
                    Medium Risk
                  </span>
                )}
                {perm.required && (
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-[10px] font-black uppercase text-sky-400">
                    Required
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-400" />
            <h4 className="font-bold text-white">What an "Allow Always" answer stores</h4>
          </div>
          <ul className="space-y-2 text-sm text-white/50">
            <li>
              • An exact match on the full normalised command line the user was shown — not a prefix and
              not the binary alone, so a command that reads differently next time no longer matches.
            </li>
            <li>
              • Every grant carries a 30-day lifetime; the gate sweeps it with an audit-log entry and the
              dialog asks again (src/lib/approval-gate.js, pinned by tests/allow-always-lifetime.test.js).
            </li>
            <li>
              • Only binaries in the classifier's table are offered Allow Always at all — anything the
              classifier has never seen is offered Allow Once only, because a grant for an undescribed
              command is a promise about behaviour rather than about text.
            </li>
          </ul>
        </div>
      </motion.section>

      {/* Risk Levels */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Risk Assessment
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Shell <span className="text-white/20">Risk Tiers</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Shell commands are classified into one of four risk tiers by the permission-store classifier (regenerated into src/data/shell-tiers.generated.json by scripts/gen-shell-tiers.ts) before they reach the permission gate. Higher tiers require stronger, more explicit approval. Browser actions follow their own approval table above.
          </p>
        </div>

        <div className="space-y-4">
          {security.riskTiers.map((tier, i) => {
            const style = TIER_STYLE[tier.id];
            const Icon = style.icon;
            return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col gap-6 rounded-2xl border ${style.border} ${style.bg} p-8 lg:flex-row lg:items-center lg:justify-between`}
            >
              <div className="flex items-start gap-4">
                <Icon size={24} className={`mt-1 shrink-0 ${style.color}`} />
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white">{style.name}</h4>
                    <span className={`rounded-full ${style.bg} px-3 py-1 text-[10px] font-black uppercase tracking-wider ${style.color}`}>
                      {style.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/40">{tier.autoApprove}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tier.examples.map((ex) => (
                      <code key={ex} className="rounded bg-black/30 px-2 py-1 text-xs text-white/50">{ex}</code>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-white/35">
                    <span className="font-black uppercase tracking-wider text-white/25">Known limit: </span>
                    {tier.limit}
                  </p>
                </div>
              </div>
              <div className="max-w-sm lg:text-right">
                <p className="text-xs font-black uppercase tracking-wider text-white/30">Approval</p>
                <p className="mt-1 text-sm text-white/60">{tier.approvalMethod}</p>
              </div>
            </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Mobile Approval Process */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Remote &amp; Power Actions
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            QR Code <span className="text-white/20">Approval</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            The QR flow is used for power actions, desktop AI-initiated high-risk actions, high-risk MCP
            tool calls, and remote-origin shell commands. A remote shell request never executes directly:
            the capability controller forces approval for it — registered as local "never" / remote
            "always", with a hard rule that remote origin can never resolve to "never" — and issues a
            single-use ticket whose PIN is never sent over the network: it lives only on the ticket and
            in a QR the desktop renders on its own screen. The phone reads the PIN by scanning that QR,
            the desktop dialog for such a ticket only displays it and can deny, and the command runs only
            after that ticket comes back with its per-ticket PIN and the command's input hash verifies
            (src/main/handlers/sync-handlers.js; guarded by aartiq-browser/tests/remote-shell-approval.test.js).
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
            <Smartphone size={40} className="mb-6 text-sky-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Mobile App Approval</h3>
            <p className="mb-8 text-white/50">
              Power actions (shutdown, restart, sleep, lock), desktop AI-initiated high-risk actions, and
              remote-origin shell commands all require confirmation via the paired mobile app (QR + PIN);
              a remote shell executes only after its single-use ticket is approved with the per-ticket PIN.
            </p>
            
            <div className="space-y-6">
              {[
                { step: 1, title: "Action Triggered", desc: "AI attempts high-risk command" },
                { step: 2, title: "QR Displayed", desc: "Desktop shows unique QR code" },
                { step: 3, title: "Scan & Verify", desc: "Mobile app scans QR" },
                { step: 4, title: "PIN Confirmation", desc: "Enter 6-digit verification code" },
                { step: 5, title: "Command Executed", desc: "Action proceeds after approval" }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sm font-black text-sky-400">
                    {item.step}
                  </span>
                  <div>
                    <h5 className="font-bold text-white">{item.title}</h5>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
            <Scan size={40} className="mb-6 text-sky-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Security Guarantees</h3>
            
            <ul className="space-y-4">
              {[
                "QR codes are single-use only",
                "Each QR code is cryptographically unique",
                "PIN codes are generated per-session",
                "Mobile must be paired via secure handshake",
                "Failed attempts are logged with timestamps",
                "All approvals are logged with timestamps"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                  <span className="text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Remote Device Security */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Remote Access
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Remote Device <span className="text-white/20">Security</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Commands originating from a paired mobile device receive the same validation as local commands — plus additional scrutiny because the origin is remote.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
            <Smartphone size={40} className="mb-6 text-sky-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Elevated Risk for Remote Origin</h3>
            <p className="mb-6 text-white/50">
              WiFi Sync commands from paired mobile devices pass through the exact same validation and permission checks
              as local commands. One action goes further: a remote-origin <code>shell-command</code> has its risk tier
              bumped by one level before it reaches the capability controller.
            </p>
            <ul className="space-y-3">
              {[
                "shell-command only: low → medium",
                "shell-command only: medium → high",
                "shell-command only: high → critical (denied at the policy gate, then a plain Allow/Deny prompt)",
                "shutdown / restart / sleep / lock additionally require a QR + PIN approval regardless of risk tier",
                "Other remote actions (send-prompt, get-clipboard, update-setting) run the same local validation but do NOT receive the tier bump",
                "Note: no registry ever assigns the critical tier outside this remote shell path, so 'critical is never auto-approved' is true but describes a mostly-unused label — see the source (src/main/handlers/sync-handlers.js)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                  <span className="text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
            <Shield size={40} className="mb-6 text-emerald-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">High-Risk Remote Actions</h3>
            <p className="mb-6 text-white/50">
              Power actions and shell commands from a remote device require QR/PIN approval before execution, matching the on-device high-risk flow.
            </p>
            <ul className="space-y-3">
              {[
                "Shutdown, restart, sleep, and lock require QR/PIN approval",
                "Remote shell commands are validated by SecurityValidator, routed through the capability controller, and executed via execFile (no shell interpretation)",
                `The agent API and native bridge bind to ${net.agentApi.defaultBindAddress} only; the ${net.mcpBridge.name} (port ${net.mcpBridge.port}) also binds to ${net.mcpBridge.defaultBindAddress} by default and needs an explicit setting to listen beyond loopback`,
                "The three HTTP bridges — the MCP bridge, the agent API and the native bridge — wrap every route in a session-token check (checkLocalRequest — src/lib/local-server-auth.js:270-318, applied at src/lib/mcp-browser-server.js:1595, src/lib/agent-api/server.ts:102 and main.js:1317): a client that has not been given the token is refused rather than connected, the token does not expire while Aartiq runs, and it persists in ~/.aartiq-token, ~/.aartiq-mcp-token or ~/.aartiq-agent-token (mode 0600), so a client configured once keeps working across restarts. The other two listeners authenticate differently: the WiFi sync WebSocket upgrade refuses foreign Origins and Host headers that do not name this machine, and every sync action — handshake, unpair, clipboard, remote control — requires the trusted device's short-lived access token (src/lib/WiFiSyncService.ts); the PDF sync listener requires its token on every file endpoint, compared in constant time (src/service/pdf-sync.js)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                  <span className="text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Network Listeners */}
      <motion.section
        id="network-listeners"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.47 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Listeners
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Network <span className="text-white/20">Listeners</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Every socket the application opens, and what actually protects it.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Port</th>
                  <th className="px-6 py-4">Default bind address</th>
                  <th className="px-6 py-4">Reachable from LAN when</th>
                  <th className="px-6 py-4">Authentication</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {net.servers.map((s) => (
                  <tr key={s.id} className="align-top border-b border-white/5 last:border-b-0">
                    <td className="px-6 py-4 font-medium text-white/70">{s.name}</td>
                    <td className="px-6 py-4 font-mono text-sky-400">{s.port}</td>
                    <td className="px-6 py-4 font-mono text-xs text-white/50">{s.defaultBindAddress}</td>
                    <td className="max-w-xs px-6 py-4 text-xs text-white/40">
                      {s.bindsAllInterfacesWhen ??
                        "never — the host is a literal in the source, not a switch anyone can flip"}
                    </td>
                    <td className="max-w-md px-6 py-4 text-xs text-white/50">{s.auth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-sm text-white/40">
          One of these binds all interfaces by default —{" "}
          {net.servers
            .filter((s) => s.defaultBindAddress.startsWith("all"))
            .map((s) => `${s.name} (${s.port})`)
            .join(", ")}
          — and only the host environment variable narrows the bind. If you run Aartiq on a shared or
          untrusted network, that is the part to think about first.
        </p>

        <div className="mt-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white/70">
            Documented, but not listeners
          </h3>
          <ul className="space-y-2 text-sm text-white/50">
            {net.retired.map((p) => (
              <li key={p.port}>
                • Port {p.port} ({p.name}) — {p.status}
              </li>
            ))}
            <li>
              • Port {net.discovery.port} — {net.discovery.status}
            </li>
            <li>
              • Port {net.devRenderer.port} — {net.devRenderer.purpose}
            </li>
          </ul>
        </div>
      </motion.section>

      {/* Encryption Details */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Encryption
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            E2E <span className="text-white/20">Encryption</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-purple-500/20 bg-purple-500/5 p-10">
            <LockKeyhole size={40} className="mb-6 text-purple-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">AES-256-GCM</h3>
            <p className="mb-6 text-white/50">
              {encryptionDetails.description}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-sm text-white/60">Algorithm</span>
                <code className="text-sm font-mono text-purple-400">{encryptionDetails.algorithm}</code>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-sm text-white/60">Key Derivation</span>
                <code className="text-sm font-mono text-purple-400">{encryptionDetails.keyDerivation}</code>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-sm text-white/60">Iterations</span>
                <code className="text-sm font-mono text-purple-400">{encryptionDetails.iterations.toLocaleString('en-US')}</code>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-sm text-white/60">IV Length</span>
                <code className="text-sm font-mono text-purple-400">{encryptionDetails.ivLength} bytes</code>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
            <Server size={40} className="mb-6 text-sky-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Implementation</h3>
            
            <div className="mb-6 space-y-3">
              {encryptionDetails.implementation.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-white/60">{feature}</span>
                </div>
              ))}
            </div>

            <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white/40">Use Cases</h4>
            <div className="space-y-3">
              {encryptionDetails.useCases.map((useCase, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <span className="text-sm text-white/60">{useCase.data}</span>
                  <span className="text-xs text-white/40">{useCase.method}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
              <p className="text-xs text-purple-300">Source: src/lib/crypto-utils.ts</p>
            </div>
          </div>
        </div>

        {/* Vault Migration */}
        <div className="mt-8 rounded-[2rem] border border-sky-500/20 bg-sky-500/5 p-10">
          <FileKey size={40} className="mb-6 text-sky-400" />
          <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Vault Migration</h3>
          <p className="mb-6 text-white/50">
            Legacy vault entries are automatically detected and re-encrypted to the modern E2EE2 format — the older formats used weaker key derivation.
          </p>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                format: "LCL:",
                desc: "Plaintext base64 — no encryption, no salt",
                status: "Legacy"
              },
              {
                format: "E2EE:",
                desc: "PBKDF2 100K iterations, no salt",
                status: "Legacy"
              },
              {
                format: "E2EE2:",
                desc: "PBKDF2 600K iterations, per-entry random salt + IV",
                status: "Current"
              }
            ].map((v) => (
              <div key={v.format} className="rounded-xl bg-black/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <code className="font-mono text-sky-300">{v.format}</code>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    v.status === "Current"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-xs text-white/40">{v.desc}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-3">
            {[
              "Atomic vault writes — backup before migration, rollback on failure",
              "Proactive migration re-encrypts LCL: and E2EE: entries to E2EE2: on demand",
              "Migration requires biometric / native verification before re-encryption begins"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                <span className="text-white/60">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* API Key Protection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            API Key Storage
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            API Key <span className="text-white/20">Protection</span>
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {apiKeyProtection.mechanisms.slice(0, 2).map((mechanism, i) => (
              <div key={i} className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8">
                <FileKey size={32} className="mb-4 text-amber-400" />
                <h3 className="mb-3 text-lg font-black uppercase tracking-wider">{mechanism.name}</h3>
                <p className="text-sm text-white/50">{mechanism.description}</p>
                {mechanism.pattern && (
                  <div className="mt-4 rounded-lg bg-white/5 p-3">
                    <code className="text-xs font-mono text-amber-300">{mechanism.pattern.source}</code>
                    <span className="ml-2 text-xs text-white/40">→ {mechanism.replacement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {apiKeyProtection.mechanisms.slice(2, 4).map((mechanism, i) => (
              <div key={i} className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
                <Lock size={32} className="mb-4 text-sky-400" />
                <h3 className="mb-3 text-lg font-black uppercase tracking-wider">{mechanism.name}</h3>
                <p className="text-sm text-white/50">{mechanism.description}</p>
                {mechanism.patterns && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mechanism.patterns.map((pattern, j) => (
                      <code key={j} className="rounded bg-white/5 px-2 py-1 text-xs text-white/40">
                        {pattern}
                      </code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8">
            <FileKey size={32} className="mb-4 text-amber-400" />
            <h3 className="mb-3 text-lg font-black uppercase tracking-wider">Source Files</h3>
            <p className="text-sm text-white/50">src/lib/firebaseConfigStorage.ts, src/lib/shared-keychain.js</p>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8">
            <Key size={32} className="mb-4 text-emerald-400" />
            <h3 className="mb-4 text-lg font-black uppercase tracking-wider">Token Generation</h3>
            <div className="grid gap-6 lg:grid-cols-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white/30">Method</p>
                <code className="mt-2 block text-sm font-mono text-emerald-400">
                  crypto.getRandomValues()
                </code>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white/30">Entropy</p>
                <code className="mt-2 block text-sm font-mono text-emerald-400">
                  256-bit CSPRNG
                </code>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white/30">Uses</p>
                <p className="mt-2 text-sm text-white/60">
                  Session tokens, pairing codes, QR verification
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Capability-Scoped Execution */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Capability Model
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Capability-<span className="text-white/20">Scoped</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Instead of trying to detect dangerous requests via regex, the system constrains what actions the AI can invoke at all — each with its own approval policy.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/5 p-10">
            <Shield size={40} className="mb-6 text-sky-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Register</h3>
          <p className="mb-6 text-white/50">
                Each allowed action is explicitly registered with a named handler and an approval tier. If an action isn't registered, it doesn't exist as a callable surface. The controller is wired into both the main process (<code className="text-sky-300">main.js</code>) and the command executor (<code className="text-sky-300">command-executor.js</code>).
              </p>
              <div className="rounded-xl bg-black/20 p-4 font-mono text-sm">
                <div className="text-sky-400">registerAction({'{'}</div>
                <div className="ml-4 text-white/60">name: "click_element",</div>
                <div className="ml-4 text-white/60">requiresApproval: "first-time-per-session"</div>
                <div className="text-sky-400">{'}'})</div>
              </div>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-10">
            <UserCheck size={40} className="mb-6 text-amber-400" />
            <h3 className="mb-4 text-xl font-black uppercase tracking-wider">Execute</h3>
            <p className="mb-6 text-white/50">
              Execution is gated by the controller. Unregistered actions are rejected outright. Registered actions are allowed or queued for approval based on their tier.
            </p>
            <div className="space-y-3">
              {[
                { tier: "never", desc: "Approved automatically (read-only)" },
                { tier: "first-time-per-session", desc: "Approved once per session" },
                { tier: "always", desc: "Requires explicit confirmation each time" }
              ].map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <code className="text-xs font-mono text-amber-300">{tier.tier}</code>
                  <span className="text-xs text-white/40">{tier.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck size={24} className="mt-1 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-2">Why this matters</h4>
              <p className="text-sm text-white/60">
                Regex-based threat detection can be bypassed — obfuscation, synonyms, and encoding all defeat pattern matching. 
                A capability-scoped model doesn't try to detect danger in text; it removes the dangerous primitive from the 
                 attack surface entirely. If there's no registered <code className="text-emerald-300">run_shell_command</code> action, 
                 prompt injection cannot invoke one through the capability interface unless that action is registered and authorized.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Security Test Coverage */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Verification
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
Security <span className="text-white/20">Test Coverage</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/40">
            Every layer above is backed by automated regression tests. The suite is dispatched via GitHub Actions CI (
            <code className="text-sky-300">.github/workflows/jest.yml</code>) on demand (latest green run:{" "}
            <a
              href={ci.latestRun.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              #{ci.latestRun.runNumber}
            </a>
            ). It is not triggered on every push.
          </p>
          <a
            href={ci.latestRun.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <ShieldCheck size={16} />
            Full aartiq-browser suite + three sandbox runtimes — {ci.latestRun.conclusion} (
            {ci.jobs.defined}/{ci.jobs.defined} jobs)
            <ArrowUpRight size={16} />
          </a>
         </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
              <Bug size={32} className="mx-auto mb-4 text-emerald-400" />
              <h3 className="text-3xl font-black text-emerald-400">{tests.tests.declared}</h3>
              <p className="text-sm text-white/50">
                Total declared tests ({derived.testSummary} on {derived.testEnvironment}, generated{" "}
                {derived.testGeneratedAt.slice(0, 10)})
              </p>
            </div>
            <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/5 p-8 text-center">
              <ShieldOff size={32} className="mx-auto mb-4 text-rose-400" />
              <h3 className="text-3xl font-black text-rose-400">{osSandboxTests}</h3>
              <p className="text-sm text-white/50">OS-sandbox tests (fail-closed + adversarial)</p>
            </div>
            <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/5 p-8 text-center">
              <ShieldCheck size={32} className="mx-auto mb-4 text-sky-400" />
              <h3 className="text-3xl font-black text-sky-400">{approvalTicketTests}</h3>
              <p className="text-sm text-white/50">Approval-ticket regression tests</p>
            </div>
            <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8 text-center">
              <Layers size={32} className="mx-auto mb-4 text-amber-400" />
              <h3 className="text-3xl font-black text-amber-400">{security.layers.length}</h3>
              <p className="text-sm text-white/50">Security layers under test</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white/70">
                <FileText size={16} className="text-emerald-400" /> sandbox-security.test.js
              </h4>
              <p className="text-sm text-white/50">
                macOS Seatbelt fail-closed + real OS-enforcement (read/write denied outside the allowlist, /tmp allowed,
                network bind denied, AF_UNIX socket denied, cross-process signal denied, self-signal allowed, symlink-escape
                denied, child processes contained), plus Linux bubblewrap, Windows AppContainer contract tests and
                command-tokenizer/env-sanitization checks.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white/70">
                <FileText size={16} className="text-emerald-400" /> windows-job-sandbox.test.js
              </h4>
              <p className="text-sm text-white/50">
                JS contract (isolation flags, fail-closed network/allowlist policy) passes everywhere; the
                runtime matrix — suspended AppContainer start, OS-enforced ACL allowlist, verified job basis,
                grandchild containment, secret isolation, and KILL_ON_JOB_CLOSE — runs on Windows CI
                (windows-latest), where run #{ci.latestRun.runNumber} reported {windowsJob.passed} passing
                and {windowsJob.failed} failed of {windowsJob.declared}, every containment test returning a
                verified sandbox result. The design and source were also reviewed independently:{" "}
                <a
                  href="https://github.com/Latestinssan/Aartiq/blob/main/Audit%20Report/2026-09-13_Windows_AppContainer_Sandbox_Audit/SECURITY_AUDIT.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-300 underline decoration-dotted hover:text-emerald-200"
                >
                  Windows AppContainer Sandbox Audit (2026-09-13)
                </a>
                .
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white/70">
                <FileText size={16} className="text-emerald-400" /> linux-bwrap-sandbox.test.js
              </h4>
              <p className="text-sm text-white/50">
                JS contract (unshare flags, --bind vs --ro-bind, fail-closed when bwrap is missing or
                present-but-incapable of creating namespaces) runs everywhere; the runtime matrix
                (no read/write outside allowlist, private /tmp, network denied, symlink-escape denied)
                runs on Linux hosts where bwrap is installed.
              </p>
            </div>
          </div>

         <div className="mt-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
           <h4 className="mb-4 flex items-center gap-2 text-lg font-black uppercase tracking-wider text-white/70">
             <FileText size={18} className="text-emerald-400" /> approval-ticket-security.test.js
           </h4>
           <p className="mb-4 text-sm text-white/50">
             A dedicated regression suite for the ticket-based approval + capability-controller system. It locks in the fixes for the audit findings and fails if any invariant regresses.
           </p>
           <div className="grid gap-3 sm:grid-cols-2">
             {[
               "Red 1 — redeemTicket verifies the params/context hash (tamper → 'tampered')",
               "Red 2 — persistent grant cannot override an 'always' approval",
               "Red 3 — 'first-time-per-session' never becomes a persistent grant",
               "Red 4 — call-shape hashing agrees on context at register + verify",
               "Red 5 / Orange 6 — missing params fail constraints; 'optional' allows absence",
               "Orange 7/8 — registration gated to a ticket; pattern validates the action",
               "Orange 9 — regex patterns length-limited against catastrophic backtracking",
               "Orange 10 — unknown ticket IDs are rejected",
               "Yellow 11 — tickets bound to capabilityVersion; replaceAction invalidates them",
               "Yellow 12 — returned ticket params are defensive clones",
               "Arch — approval produces a pure AuthorizationDecision; the executor consumes it and never reconstructs authorization",
               "Arch — a v1 ticket is rejected (never executed) after the action is replaced with v2",
             ].map((item, i) => (
               <div key={i} className="flex items-start gap-2 rounded-lg bg-white/5 p-3 text-xs text-white/60">
                 <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                 <span>{item}</span>
               </div>
             ))}
           </div>
           <p className="mt-4 text-xs text-white/30">
             Source: <code className="font-mono">aartiq-browser/tests/approval-ticket-security.test.js</code>
           </p>
         </div>
      </motion.section>
    </div>
  );
}
