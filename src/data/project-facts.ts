/**
 * project-facts.ts — THE single source of truth for Aartiq published facts.
 *
 * Rules for this file:
 *  1. Every value here was verified against source, a live test run, or the GitHub API.
 *     If a value cannot be verified, it is absent or carries TODO(verify) — never guessed.
 *  2. No other file in this repo may hard-code any value defined here. `npm run docs:check`
 *     (Aartiq/scripts/check-docs.ts) fails the build if one does.
 *  3. Test counts and command counts are GENERATED, not typed. See test-facts.generated.json.
 *  4. This file is the only place these facts are written by hand.
 *
 * Audit that produced these values: Aartiq/aartiq-browser/docs-audit/consistency-report.md
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** How much a layer actually enforces, as opposed to describes. */
export type LayerStrength =
  /** The OS itself confines the process. Not bypassable from inside the app. */
  | "enforcement boundary"
  /** Enforced by app logic that a compromised renderer can influence. */
  | "policy layer"
  /** Text/regex inspection. Bypassable by construction — catches the obvious cases. */
  | "heuristic/first-pass"
  /** Reduces exposure or impact without gating the action. */
  | "mitigation";

export type RiskTierId = "low" | "medium" | "high" | "critical";

export interface SecurityLayer {
  id: string;
  name: string;
  /** One line. */
  description: string;
  strength: LayerStrength;
  /** Where to read the implementation. */
  source: string;
}

export interface RiskTier {
  id: RiskTierId;
  /** What the user actually experiences. */
  approvalMethod: string;
  /** Whether it can run without asking. */
  autoApprove: string;
  /** Real identifiers from the source, not invented. */
  examples: string[];
  /** The limitation that stops this row from reading as a guarantee. */
  limit: string;
}

export interface NetworkServer {
  id: string;
  name: string;
  /** `number` = fixed default; string = overridable via the named env var. */
  port: number | string;
  portIsEnvOverridable: boolean;
  defaultBindAddress: string;
  /** Exactly what makes it bind all interfaces. `null` = there is no such switch. */
  bindsAllInterfacesWhen: string | null;
  auth: string;
  /** Whether the docs previously claimed localhost binding. */
  note?: string;
}

/**
 * Shape of src/data/shell-tiers.generated.json, written by
 * scripts/gen-shell-tiers.ts from aartiq-browser/src/lib/shell-command-tiers.js.
 *
 * The published tier table is this file's contents, not a hand-typed copy. See
 * `security.shellTiers` for how it is used.
 */
export interface GeneratedShellTiers {
  generatedAt: string;
  /** Repo-relative path of the module this was read from. */
  source: string;
  tiers: Record<string, string>;
  capabilities: Record<string, string>;
  /** The rules the table declares. Asserted in tests, not only published. */
  invariants: string[];
  autoApprove: {
    setting: string;
    defaultValue: boolean;
    legacyAlias: string;
    /** Which tiers the setting covers. */
    tiers: string[];
    appliesTo: string;
    doesNotApply: string;
  };
  alwaysGrant: {
    scope: string;
    note: string;
    neverEligible: string[];
  };
  blockedCommands: string[];
  counts: {
    commandsInTable: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
    blocked: number;
  };
  entries: Array<{ binary: string; tier: string; caps: string[]; note?: string }>;
  /** Real commands classified at generation time, so the numbers are observed. */
  probes: Array<{
    command: string;
    tier: string;
    reason: string;
    knownBinary: boolean;
    alwaysGrantEligible: boolean;
  }>;
}

export interface GeneratedTestFacts {
  generatedAt: string;
  environment: {
    os: string;
    platform: string;
    arch: string;
    node: string;
    /** Human label used in prose, e.g. "macOS (local)". */
    label: string;
  };
  suites: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  tests: {
    declared: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  skipBreakdown: {
    reason: string;
    count: number;
    detail: string;
  }[];
  perSuite: {
    suite: string;
    passed: number;
    skipped: number;
    failed: number;
    declared: number;
  }[];
  commandCount: number;
  commandCountSource: string;
}

export interface GeneratedRepoFacts {
  generatedAt: string;
  /** True when read live from the GitHub API. */
  live: boolean;
  fullName: string;
  stars: number;
  forks: number;
  contributors: number;
  createdAt: string;
  pushedAt: string;
  visibility: string;
  /** Set when the live fetch failed and the cached values were used. */
  staleSince?: string;
}

// ---------------------------------------------------------------------------
// Version & release
// ---------------------------------------------------------------------------

export const version = {
  /** aartiq-browser/package.json "version" */
  semver: "0.3.7",
  /** GitHub release tag_name for the latest published release. */
  tag: "v0.3.7",
  /** releases/latest .published_at */
  releaseDate: "2026-09-13",
  /** Not prerelease, not draft, CI green. */
  status: "stable" as const,
  /**
   * Release codename. Two different values were live at once before this
   * ("AppContainer" in version.ts, "Nebula" in version-server.ts); v0.3.7 is the
   * AppContainer release, and it is the one every page should show.
   */
  codename: "AppContainer",
  repository: "https://github.com/Latestinssan/Aartiq",
  releaseNotes: "release_notes/v0.3.7.md",
};

// ---------------------------------------------------------------------------
// Project status — ONE canonical statement
// ---------------------------------------------------------------------------

export const project = {
  lastUpdated: "2026-09-13",
  /**
   * Rendered verbatim wherever project status is shown. Do not paraphrase it
   * per page — that is how the docs drifted apart in the first place.
   */
  status: {
    headline: "Maintenance phase — AI-assisted, human-governed.",
    statement:
      "Aartiq is in an AI-assisted maintenance phase. AI agents may help review and " +
      "organise issues, analyse bugs, improve documentation, and prepare proposed fixes. " +
      "AI assistance does not replace human responsibility: anything touching security, " +
      "permissions, user data, releases, or project direction is reviewed, approved, and " +
      "owned by a human. New feature work is paused while that happens.",
    /** What is explicitly NOT true, so no page implies otherwise. */
    notAbandoned: "The project is not abandoned or discontinued.",
  },
  /** Why the project exists, in the founder's terms. Shown once per page at most. */
  origin: {
    name: "Aartiq",
    tagline: "For The Questions That Matter",
    oneCm:
      'Aartiq is just 1 CM away from the future. The "1 CM" is a personal reminder that ' +
      "respecting a boundary often begins with asking before crossing it.",
  },
} as const;

// ---------------------------------------------------------------------------
// Security — six layers
// ---------------------------------------------------------------------------

const SECURITY_LAYERS: SecurityLayer[] = [
    {
      id: "visual-sandbox",
      name: "Visual Sandbox & SecureDOM",
      description:
        "Renders and extracts pages visually, so raw page HTML is never handed to the model as an instruction channel.",
      strength: "heuristic/first-pass",
      source: "src/lib/Security.ts",
    },
    {
      id: "syntactic-firewall",
      name: "Syntactic Firewall",
      description:
        "Regex blocklist over commands and model output. Its own header says it is not the primary defence, because text filters are bypassable by construction.",
      strength: "heuristic/first-pass",
      source: "src/lib/SecurityValidator.js",
    },
    {
      id: "human-in-the-loop",
      name: "Human-in-the-Loop Approval",
      description:
        "Actions are described and offered for approval before they run, so the user decides rather than the model.",
      strength: "policy layer",
      source: "src/core/capability-controller.js, src/core/shell-permission-bridge.js",
    },
    {
      id: "directory-allowlist",
      name: "Directory Allowlist",
      description:
        "Scopes file access to approved directories. This is a policy layer; the boundary that actually confines writes is the OS sandbox below.",
      strength: "policy layer",
      source: "src/core/directory-allowlist.js",
    },
    {
      id: "os-sandbox",
      name: "OS-Level Sandboxing",
      description:
        "Seatbelt (macOS), bubblewrap (Linux), AppContainer + Job Object (Windows). Fail-closed: setup failure means the command does not run.",
      strength: "enforcement boundary",
      source: "src/core/sandbox-executor.js",
    },
    {
      id: "capability-scoped",
      name: "Capability-Scoped Execution",
      description:
        "Actions run only through registered capabilities with single-use approval tickets, never as arbitrary system calls.",
      strength: "enforcement boundary",
      source: "src/core/capability-controller.js, src/core/approval-ticket-manager.js",
    },
];

export const security = {
  layers: SECURITY_LAYERS,
  /**
   * Lead-in prose. The layer count is read from the array, so the sentence can
   * never claim a different number than the rows printed under it.
   */
  layerSummary:
    `The model has ${SECURITY_LAYERS.length} layers. Only ` +
    `${SECURITY_LAYERS.filter((l) => l.strength === "enforcement boundary").length} ` +
    "of them are enforcement boundaries in the strict sense — controls the OS applies that " +
    "application code cannot bypass. The rest are policy and first-pass checks, and are " +
    "labelled as such rather than presented as equally strong.",

  /**
   * Verified against src/lib/shell-command-tiers.js, src/core/command-validator.js,
   * src/lib/permission-store.js and tests/shell-command-tiers.test.js.
   *
   * The per-command numbers behind these rows are generated from the classifier
   * itself — see `security.shellTiers` — so a tier change in code shows up as a
   * failing `npm run docs:check` rather than as a page that is quietly wrong.
   *
   * Read the `limit` column. Two of these rows are weaker than "approval
   * required" suggests.
   *
   * What changed and why the old text had to go: this table used to say low and
   * medium were "auto-approved by default" via a session grant created at startup,
   * and that `medium` was the default tier for anything not matching a destructive
   * pattern. Both described an earlier state. Startup no longer creates any grant,
   * and the classifier does have a `low` tier.
   */
  riskTiers: [
    {
      id: "low",
      approvalMethod:
        "Asked every time, unless you turn on autoApproveLowRiskShell. With it off — the default — a low-risk command shows the same dialog as any other.",
      autoApprove:
        "Only behind the opt-in autoApproveLowRiskShell setting, which defaults to off. Nothing is granted at startup.",
      examples: ["ls", "cat", "pwd", "find", "grep", "echo", "NAVIGATE"],
      limit:
        "The setting covers the whole low tier rather than named commands, so turning it on is a decision about a category. It is also independent of the MCP tool path: shell commands read autoApproveLowRiskShell from the permission store, MCP tool calls read a separate security_autoApproveLowRisk key, both default to off, and enabling one does not enable the other.",
    },
    {
      id: "medium",
      approvalMethod:
        "Asked every time. autoApproveMidRisk does not reach shell commands — it still applies to MCP tool actions, which is a separate question.",
      autoApprove: "No. There is no setting that auto-approves a medium shell command.",
      examples: ["cp", "mv", "mkdir", "touch", "npm", "git", "node", "python", "curl", "wget", "osascript"],
      limit:
        'An unrecognised command lands here rather than in low, so this tier also means "we have never heard of it". "Allow Always" is withheld for network-capable and script-capable binaries, but a local write like cp or mkdir can still take an exact-match permanent grant.',
    },
    {
      id: "high",
      approvalMethod:
        "Asked every time, then offered as Allow Once / Always / Deny.",
      autoApprove:
        "Only if a grant exists for that exact command line, or a SHELL_HIGH / SHELL_ALL grant was made deliberately.",
      examples: ["chmod", "find . -delete", "kill", "dd", "mount", "iptables", "shutdown"],
      limit:
        'A permanent grant is never offered for a destructive command, so the Always button is absent here and Allow Once is the strongest answer available. `chmod` sits in this tier because it matches a destructive pattern, not because it is privileged in the usual sense — it was already high and moving it down would have weakened a default.',
    },
    {
      id: "critical",
      approvalMethod:
        "Denied at the policy gate unconditionally, then offered to the user as an interactive Allow / Deny prompt.",
      autoApprove:
        "Never. Refused before the grant store and the auto-approve settings are consulted, and unreachable from every one of them.",
      examples: [],
      limit:
        "No command in the tier table is assigned this tier. It is only synthesised at runtime for commands arriving from a remote device. Remote-origin shell execution strictly requires single-use, input-hash-bound QR+PIN ticket redemption.",
    },
  ] satisfies RiskTier[],

  /**
   * TODO(verify) — the figures "22 gated / 9 monitoring-only IPC channels" could not be
   * verified and do NOT appear in docs-audit/action-inventory.md. That file contains no
   * count of either kind, and its wildcard rows (`clipboard-*`, `window-*`, `store-*`)
   * make an exact IPC-channel count underivable from it. Do not publish these numbers.
   */
  monitoringOnlyChannels: {
    status: "TODO(verify)" as const,
    claimedGated: 22,
    claimedMonitoringOnly: 9,
    verified: false,
    /** What action-inventory.md actually contains, re-read 2026-10-03. */
    actual: [
      "§2a lists 24 command types under 'No Permission Gate — Executes Immediately'.",
      "§2b lists 7 command types under 'Has Permission Dialog (requestActionPermission())'.",
      "The single 'Monitoring-only' row is SecureDOMParser.analyze() — a renderer function, not an IPC channel.",
    ],
    resolution:
      "Either re-derive the counts from IPC registration in preload.js, or drop the figures. They are not used on any page.",
  },

  /**
   * Two defaults are live at the same time. Stating both is the honest description;
   * collapsing them would misreport what the app enforces.
   */
  defaultAllowlist: {
    summary:
      "The narrow default and the legacy broad default are both still in the tree, and they disagree.",
    current: {
      where: "src/core/directory-allowlist.js:24-43",
      grants:
        "Only the Aartiq app-data directory and the temp directory, recursive, read-write.",
      note: "A test explicitly asserts the home directory is NOT included (tests/directory-allowlist.test.js:217-220).",
    },
    legacy: {
      where: "src/lib/permission-store.js:8-16",
      grants:
        "Recursive read-write across the entire home directory, plus read on /Applications and /System/Applications.",
      note:
        "permission-store.js is the module getAllowedDirectories() actually calls, so this broad seed is still the one that takes effect.",
    },
    commandPolicy: {
      where: "config/command-policy.json",
      blocks: "25 commands, including wget and curl, plus 36 blocked patterns. Counted from the file.",
      requiresApproval:
        "44 entries, and they are prefix patterns rather than bare binaries — `npm install` and `pip install` are listed, bare `npm` and `pip` are not, and the container entries are `docker run` / `docker exec` / `docker compose`. systemctl, service, launchctl, diskutil and crontab are listed. Counted from the file.",
      legacyFallback:
        "src/lib/command-validator.js:45-52 — blocks only 7 commands and requires approval for none. Used only if the policy file fails to load.",
    },
  },

  /** What the model does NOT promise. Keep these; do not summarise them away. */
  knownLimits: [
    "Runtime sandbox tests execute only on their own OS. There is no single job that exercises Seatbelt, bubblewrap, and AppContainer at once.",
    "OS-automation tests skip wherever the native tooling is absent (xdotool/xte on Linux, cliclick on macOS).",
    "The CRX3 signature-verifier suite is skipped because verifyCrx() hangs on a Node 24 / OpenSSL header parse. It is counted as skipped, never as passing, until the verifier is fixed.",
    "SecurityValidator.js does not guarantee that non-blocked commands are safe — it is a fast first-pass reject layer.",
    "Visual extraction reduces the DOM-based prompt-injection surface. It does not prevent prompt injection, and it cannot give semantic immunity against instructions rendered into the viewport.",
    "Seatbelt profiles start from (allow default), so not every IPC class is denied by default; Mach IPC stays usable because node/python/shell require it.",
    "Apple Events cannot be filtered by the current sandbox-exec — the operation is not exposed — so a sandboxed command could still ask another app to act on its behalf.",
    "The WiFi sync server (3004) binds every network interface on purpose — the phone reaches it over the LAN — so the LAN exposure itself is the limit: the upgrade now refuses foreign Origins and Host headers that do not name this machine, every sync action (unpair included) requires the device's short-lived access token, and AARTIQ_WIFI_SYNC_HOST narrows the bind when that exposure is not wanted. The background task service (3999) and the PDF sync server bound 0.0.0.0 with a wildcard CORS header until the bind default became 127.0.0.1, with AARTIQ_SERVICE_HOST as the explicit opt-in and no CORS allow-origin header sent at all. See network.servers.",
    "The session tokens for the MCP bridge, the Agent API and the native bridge persist in mode-0600 files in your home directory (~/.aartiq-mcp-token, ~/.aartiq-agent-token, ~/.aartiq-token), so a client configured once keeps working across restarts — but remote mode is still not a finished design: there is no per-client credential to revoke, no pairing UI, and the binds are not operator-named.",
    '"Allow Always" is keyed on the full normalised command line, which is narrower than before but is still text matching, and a permanent grant has no lifetime. See aartiq-browser/docs-audit/issues/allow-always-granularity.md.',
    "A permanent grant requires a binary that appears in the classifier's table. One that does not — including anything we have never seen — is offered Allow Once only, because a grant that repeats a command nobody can describe is a promise about behaviour rather than about the text. Local writes such as cp, mv, mkdir and touch are in the table and keep exact-match permanent grants.",
    "The native bridge and the Agent API both defaulted to port 46203, so if both started one failed to bind and the error was logged and swallowed — not visible from outside. The Agent API now defaults to 46204 and the native bridge keeps 46203, so the two no longer collide.",
  ],
} as const;

// ---------------------------------------------------------------------------
// Network — every listener, verified in source
// ---------------------------------------------------------------------------

export const network = {
  servers: [
    {
      id: "mcp-bridge",
      name: "MCP browser bridge",
      port: 3001,
      portIsEnvOverridable: true, // MCP_SERVER_PORT
      defaultBindAddress: "127.0.0.1",
      bindsAllInterfacesWhen:
        "the security_mcpBridgeRemote setting is exactly true (defaults to false; no UI control sets it)",
      auth: "A token required on every route including SSE, read-or-created in ~/.aartiq-mcp-token (mode 0600) so a configured client survives restarts. Host must be the loopback host and this listener's own port; any browser Origin must be on an allow-list of the app's own origins.",
      note: "The token is generated by the server and persisted in ~/.aartiq-mcp-token (delete the file and restart to rotate), so a Claude Desktop config written earlier keeps working across restarts. New configs pass the token to mcp-remote as an Authorization header fed from the config's env block, so it never enters the argument list; configs written before that still carry it as a URL query parameter until Auto-Configure is re-run.",
    },
    {
      id: "wifi-sync",
      name: "WiFi sync (desktop ↔ mobile)",
      port: 3004,
      portIsEnvOverridable: false,
      defaultBindAddress: "all interfaces (0.0.0.0 / ::)",
      bindsAllInterfacesWhen:
        "the phone reaches this over the LAN, so all interfaces is the default; `AARTIQ_WIFI_SYNC_HOST` narrows the bind to an address you name (127.0.0.1 closes it to this machine)",
      auth: "Short-lived 15-minute access tokens and 7-day refresh tokens bound to device ID. Every sync action — unpair included — requires an active, unexpired token, with brute-force lockout. The WebSocket upgrade itself refuses foreign Origins and Host headers that do not name this machine (DNS rebinding).",
      note: "All sync messages require an authenticated session token; the pairing code gates the handshake, and Host and Origin are checked at the upgrade with the same rules the HTTP listeners use. Brute-force protection locks out failed attempts after 5 tries for 15 minutes.",
    },
    {
      id: "native-bridge",
      name: "Native macOS / CLI bridge",
      port: 46203,
      portIsEnvOverridable: true, // AARTIQ_NATIVE_MAC_UI_PORT
      defaultBindAddress: "127.0.0.1",
      bindsAllInterfacesWhen: null, // host is a hard-coded literal
      auth: "A token required on every route, read from ~/.aartiq-token (mode 0600), plus the same Host and Origin checks.",
      note: "The agent API used to share this port, which could leave the bridge with a swallowed EADDRINUSE; the agent API now defaults to 46204, so the two are distinct.",
    },
    {
      id: "agent-api",
      name: "Agent API tool server",
      port: 46204,
      portIsEnvOverridable: false,
      defaultBindAddress: "127.0.0.1",
      bindsAllInterfacesWhen: "config.remote === true (defaults to false; no UI, env var, or IPC path sets it)",
      auth: "A token required on every HTTP route, read-or-created in ~/.aartiq-agent-token (mode 0600) so an agent configured once keeps working across restarts, plus the same Host and Origin checks. An unknown x-agent-id is still auto-registered, but as a limited-trust agent — it no longer stands in for authentication.",
      note: "Moved off 46203 when the native bridge collision was resolved; aartiq-mcp's BridgeClient targets the native bridge, not this server.",
    },
    {
      id: "background-service",
      name: "Background task service (separate Electron app)",
      port: 3999,
      portIsEnvOverridable: false,
      defaultBindAddress: "127.0.0.1",
      bindsAllInterfacesWhen: "AARTIQ_SERVICE_HOST is set to a routable address (defaults to 127.0.0.1; no switch in the app)",
      auth: "Authentication token required on all file endpoints (Bearer, X-Aartiq-Token, or ?token=) compared in constant time against the service token (options.authToken, AARTIQ_PDF_SYNC_TOKEN, or a generated per-process token), plus Host header validation against DNS rebinding.",
      note: "Started by `npm run service`, not by the browser app itself, so it is outside the browser process's own listener gate; all file endpoints require the token and validate the Host header against DNS rebinding. Serves ~/Documents/Aartiq/public with no Access-Control-Allow-Origin header, so a page on another origin cannot read its responses; the bind default changed from 0.0.0.0 with wildcard CORS to 127.0.0.1 with none, and AARTIQ_SERVICE_HOST opts back in. Tracked in aartiq-browser/docs-audit/issues/pdf-sync-bind-address.md.",
    },
  ] satisfies NetworkServer[],

  /** Ports that appear in docs but have no implementation in the tree. */
  retiredPorts: [
    { port: 9922, name: "Nexus bridge", status: "Not present. A dead variable remains in main.js." },
    { port: 9877, name: "Raycast HTTP API", status: "Not present. Port constant is declared and never read." },
    { port: 9876, name: "Flutter bridge", status: "Implemented and correctly token-gated, but never instantiated." },
  ],

  discovery: {
    port: 3005,
    status:
      "UDP broadcast destination, not a listener. The discovery socket binds an ephemeral port.",
  },
  /**
   * Development-only port: `next dev -p 3003` in aartiq-browser/package.json.
   * A packaged build loads the renderer directly (main.js:3623), so this is not
   * a listener on a user's machine — it is listed separately from `servers`.
   */
  devRenderer: {
    port: 3003,
    purpose: "Next.js dev server. Development only — never started in a packaged build.",
  },
} as const;

// ---------------------------------------------------------------------------
// CI
// ---------------------------------------------------------------------------

export const ci = {
  workflow: ".github/workflows/jest.yml",
  /**
   * Workflow inventory, read from `.github/workflows/*.yml`.
   *
   * check-docs.ts counts the files on disk and fails if this number is wrong, so
   * adding or removing a workflow forces the SSOT (and therefore AGENTS.md) to be
   * updated. The count is 13: docs-gate.yml exists only on the ci/docs-gate
   * branch and has not landed on main, so it is not counted here.
   */
  workflows: {
    count: 13,
    manualOnly: 11,
    tagPush: 1,
    pushToMain: 1,
    pullRequest: 0,
    note:
      "release.yml fires on version tag push, sync-component-docs.yml fires on push to main, and the remaining eleven are workflow_dispatch. docs-gate.yml lives on the ci/docs-gate branch and does not run on main.",
  },
  /**
   * jest.yml declares only `workflow_dispatch`. There is no `push:` and no
   * `pull_request:` key, so this suite does not run on every commit.
   */
  trigger: {
    type: "on-demand" as const,
    events: ["workflow_dispatch"],
    detail:
      "Manual dispatch only. There is no push or pull_request trigger, so a green run is not evidence about the latest commit.",
  },
  jobs: {
    defined: 4,
    detail:
      "All four jobs were green on the run above. Dispatch inputs can reduce this to 3 (skip-full-suite) or 1 (windows-test-pattern), so this is a default-dispatch count rather than an invariant.",
    timeout: "30 minutes on the full-suite job; the three sandbox jobs have no timeout configured.",
    nodeVersion: "24",
  },
  latestRun: {
    id: 34769503518,
    runNumber: 52,
    url: "https://github.com/Latestinssan/Aartiq/actions/runs/34769503518",
    event: "workflow_dispatch",
    headSha: "acc703ae",
    date: "2026-09-13",
    conclusion: "success",
  },
  /** Per-job jest summary lines, read from the run's job logs. */
  perJob: [
    { name: "Run Jest (aartiq-browser)", os: "ubuntu-latest", passed: 537, skipped: 40, failed: 0, declared: 577 },
    { name: "Run Jest (Windows AppContainer sandbox runtime)", os: "windows-latest", passed: 61, skipped: 30, failed: 0, declared: 91 },
    { name: "Run Jest (macOS Seatbelt sandbox runtime)", os: "macos-latest", passed: 104, skipped: 0, failed: 0, declared: 104 },
    { name: "Run Jest (Linux bubblewrap sandbox runtime)", os: "ubuntu-latest", passed: 57, skipped: 21, failed: 0, declared: 78 },
  ],
  /**
   * The same commit yields different pass/skip splits per platform, which is why
   * every published count carries its environment.
   *
   * This must not restate a current count. The per-job figures above belong to
   * run 34769503518 at acc703ae, and the local macOS suite has grown well past
   * the 577 tests that commit declared — so a second set of numbers here reads
   * as a present-tense claim and contradicts the generated line beside it. Point
   * at the generated number instead of repeating one that has expired.
   */
  platformVarianceNote:
    "The per-job figures above belong to that run and commit, not to the current tree, " +
    "which has grown since — for a current figure use the generated macOS line above. " +
    "The same commit yields a different pass/skip split per platform, which is why every " +
    "published count carries its environment.",
} as const;

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

export const benchmarks = {
  currentVersion: version.semver, // checked by check-docs.ts rule (c)
  benchmarkVersion: "0.3.4",
  date: "2026-07-20",
  hardware: {
    machine: "MacBook Pro",
    /** EveryMac model identifier for the machine the figures came from. */
    model: "Mac16,8",
    chip: "M4 Pro",
    cores: 12,
    memoryGb: 24,
    os: "macOS 26.5",
    osBuild: "25F71",
  },
  results: [
    { metric: "First visible window", value: "0.32s" },
    { metric: "Warm start", value: "0.31s" },
    { metric: "Idle CPU after initialization", value: "<1%" },
  ],
  /**
   * The full "Detailed Results" table. Kept here rather than in the page so that
   * every published figure sits next to `provenance` — none of these numbers has
   * a script or a raw output file behind it in either repository.
   * The active-port row is deliberately absent: it is rendered from
   * `network.servers` so it cannot drift from the network facts.
   */
  details: [
    { metric: "Cold Start (Window Visible)", value: "0.32s", notes: "Average of 3 runs, ±0.00s" },
    { metric: "Warm Start (Window Visible)", value: "0.31s", notes: "From OS file cache" },
    { metric: "Main Process RSS", value: "430 MB", notes: "Stabilizes to ~610 MB after tab activity" },
    {
      metric: "Total RSS (all processes)",
      value: "1,712 MB",
      notes: "Electron main, renderer, GPU, utility, and helper processes",
    },
    { metric: "CPU (at launch)", value: "14.7%", notes: "During initial window creation and first paint" },
    { metric: "CPU (idle after init)", value: "< 1%", notes: "After background services finish loading" },
    { metric: "Memory (main, % of 24 GB)", value: "~1.7%", notes: "—" },
    { metric: "Memory (total, % of 24 GB)", value: "~7.1%", notes: "Including all Chromium subprocesses" },
    { metric: "App Bundle Size", value: "1.2 GB", notes: "Frameworks: 276 MB, Resources: 958 MB" },
  ],
  provenance:
    "TODO(verify) — no benchmark script, raw output file, or instrumentation exists in either repository. These figures cannot currently be reproduced or checked. A published page also claimed the benchmark scripts were included in the repository; that claim was false and has been removed.",
  caveat:
    "Startup means time to first visible window, not complete service initialisation. Results vary by hardware, operating system, and configuration.",
} as const;

// ---------------------------------------------------------------------------
// Repo
// ---------------------------------------------------------------------------

export const repo = {
  fullName: "Latestinssan/Aartiq",
  /**
   * Numbers come from repo-facts.generated.json, refreshed by
   * `npm run docs:repo-facts`. Cached fallback keeps the build working offline.
   * If the numbers cannot be fetched, pages show no count rather than a stale one.
   */
  fetchedAtBuildTime: true,
  cacheFallbackPath: "repo-facts.generated.json",
} as const;

// ---------------------------------------------------------------------------
// Platforms & providers
// ---------------------------------------------------------------------------

/**
 * Verified against the build configuration and the release workflows — not against
 * marketing copy.
 *
 * - Windows: `win.target` is `["nsis", "appx"]`, and `.github/workflows/windows-msix.yml:147`
 *   renames the electron-builder output `*.appx` -> `*.msix` before upload, so both
 *   extensions are genuinely published. The Microsoft Store product ID is taken from
 *   the README badge, four release notes and three release-workflow templates, and it
 *   matches `productid` in the store badge on the downloads page.
 * - macOS: `mac.target` is `["dmg", "zip"]`; CI builds both arm64 and x64.
 * - Linux: `linux.target` is `["AppImage"]` ONLY. No `.deb` is produced by any workflow,
 *   so no page may offer one. (Claims of a `.deb` were removed in this pass.)
 * - Android: release APKs are built by flutter_distributor / `flutter build apk`.
 * - iOS: `flutter build ios --release --no-codesign`, zipped to `ios_no_sign.ipa` and
 *   uploaded as a CI artifact. Never published to a store or a release.
 */
export const platforms = [
  {
    id: "windows",
    label: "Windows",
    artifacts: ".exe, .appx/.msix",
    distributed: true,
    store: "Microsoft Store",
    storeUrl: "https://apps.microsoft.com/detail/9nd6wg2rp7cm",
  },
  { id: "macos", label: "macOS — Apple Silicon", artifacts: ".dmg, .zip", distributed: true },
  { id: "macos-intel", label: "macOS — Intel", artifacts: ".dmg, .zip", distributed: true },
  { id: "linux", label: "Linux", artifacts: ".AppImage", distributed: true },
  { id: "android", label: "Android", artifacts: ".apk", distributed: true, note: "Side-loaded from the downloads page. There is no Google Play listing." },
  { id: "ios", label: "iOS", artifacts: "built unsigned in CI, not distributed", distributed: false, note: "No App Store or AltStore listing exists." },
];

/**
 * Verified against the provider factory and settings UI.
 * `note` is required wherever support is weaker than the name implies, so no page
 * can accidentally upgrade a routed-through-something-else provider to first-class.
 */
export const providers = [
  { id: "gemini", label: "Google Gemini", firstClass: true },
  { id: "openai", label: "OpenAI", firstClass: true },
  { id: "anthropic", label: "Anthropic Claude", firstClass: true },
  { id: "groq", label: "Groq", firstClass: true },
  { id: "ollama", label: "Ollama (local)", firstClass: true },
  { id: "apple-intelligence", label: "Apple Intelligence (macOS)", firstClass: true },
  {
    id: "xai",
    label: "xAI",
    firstClass: false,
    note: "Reachable through the OpenAI-compatible provider. No dedicated provider class, and it is absent from the provider-id union.",
  },
  {
    id: "azure",
    label: "Azure OpenAI",
    firstClass: false,
    note: "Reachable through the OpenAI-compatible provider. No dedicated provider class.",
  },
  {
    id: "lmstudio",
    label: "LM Studio (local)",
    firstClass: false,
    note: "Available to the agent bridge only. There is no UI for selecting it as a chat provider.",
  },
  {
    id: "openclaw",
    label: "OpenClaw (local agent bridge)",
    firstClass: false,
    note: "Local agent runner. Its output is treated as untrusted.",
  },
] as const;

/** Present in the provider factory but absent from every UI provider list. */
export const providersUndocumented = ["deepseek", "openrouter", "cerebras", "llama"] as const;

// ---------------------------------------------------------------------------
// Legal — one copy
// ---------------------------------------------------------------------------

export const legal = {
  /**
   * RESOLVED 2026-10-04 — see aartiq-browser/docs-audit/licence-decision.md.
   * The root LICENSE, aartiq-browser/LICENSE.txt and the package manifest all
   * carry Apache-2.0 now, so the Windows NSIS installer shows the same licence
   * as the repository. What used to be an open conflict is published as a
   * resolution; check-docs rule (j) fails if the copies or this flag diverge.
   */
  licenseConflict: {
    resolved: true,
    rootLicense: "Apache-2.0 (LICENSE)",
    browserLicenseFile:
      "aartiq-browser/LICENSE.txt — Apache-2.0, byte-identical to the root (was a restrictive EULA; replaced 2026-10-04)",
    mcpLicense: "MIT (aartiq-mcp/LICENSE)",
    landingPageLicense: "none — no LICENSE file, package.json is private",
    evidence: [
      "The decision, and the full text of the EULA it replaced, are recorded in aartiq-browser/docs-audit/licence-decision.md.",
      "aartiq-browser/LICENSE.txt is byte-identical to the repository root LICENSE, and package.json build.nsis.license still points at it, so the Windows installer displays Apache-2.0.",
      'aartiq-browser/package.json declares "license": "Apache-2.0", which is what npm and gh api read.',
      "tests/licence-audit-rename.test.js pins the shipped files; docs:check rule (j) keeps the installer file, the manifest field and this flag in agreement.",
    ],
  },
  table: [
    { component: "Aartiq Browser — desktop, mobile, and core code", license: "Apache-2.0", licenseFile: "LICENSE + aartiq-browser/LICENSE.txt", status: "verified" as const },
    { component: "Aartiq MCP Server — aartiq-mcp/", license: "MIT", licenseFile: "aartiq-mcp/LICENSE", status: "verified" as const },
    { component: "Landing page / documentation site", license: "Unlicensed (private repository)", licenseFile: "none", status: "verified" as const },
  ],
  trademark: {
    mark: "Aartiq™",
    owner: "Latestinssan",
    paragraph:
      "Aartiq™ is a trademark of Latestinssan. The open-source licence permits use, modification, and redistribution of the source code. It does not grant permission to use the Aartiq name, logo, trademarks, or visual identity. Modified distributions must be rebranded under a different name and must not present themselves as official Aartiq releases.",
  },
} as const;

// ---------------------------------------------------------------------------
// Skills — terminology glossary
// ---------------------------------------------------------------------------

/**
 * The product uses these words in several files with different meanings. This is the
 * only definition; wording elsewhere must match it or be corrected.
 */
export const skills = {
  glossary: [
    {
      term: "Capability",
      definition:
        "A registered action the model may invoke. Capabilities are the only way to affect the system — there is no unrestricted access to system primitives.",
    },
    {
      term: "Approval ticket",
      definition:
        "A single-use, time-limited token that authorises one capability execution and is consumed on use.",
    },
    {
      term: "Skill",
      definition:
        "A named, loadable instruction bundle that shapes how the assistant approaches a class of task. Distinct from a capability: a skill changes behaviour, a capability changes the system.",
    },
    {
      term: "Risk tier",
      definition:
        "An advisory label (low / medium / high / critical) attached to a capability or derived for a command. It is not itself an enforcement boundary — see security.riskTiers.",
    },
    {
      term: "Enforcement boundary",
      definition:
        "A control the OS applies, which application code cannot bypass. Only OS sandboxing and capability scoping qualify.",
    },
    {
      term: "Fail-closed",
      definition:
        "If a control cannot be established or verified, the action does not run. There is no fallback path that runs it anyway.",
    },
    {
      term: "Monitoring-only",
      definition:
        "Code that observes and reports but does not block. It never gates an action, and should never be counted as if it did.",
    },
    {
      term: "Agent API",
      definition:
        "The HTTP and MCP transports that expose the capability registry to external agents. Both pass every call through the security pipeline.",
    },
    {
      term: "Local-first",
      definition:
        "User data stays on the device. Local models keep request content local; sync is end-to-end encrypted; credentials live in the OS keychain.",
    },
  ] as const,
};

// NOTE: generated test counts, repo counts, and the derived strings built from
// them deliberately live in `facts.ts`, not here. Keeping this module free of
// imports means both the Next.js app and the plain-node scripts in
// `Aartiq/scripts/` can import it directly — Node's TypeScript support requires
// explicit import attributes for JSON, which a bundler-style bare JSON import
// (needed by Next) would break. This file stays the only place hand-written
// facts are declared; `facts.ts` only merges in generated data.
