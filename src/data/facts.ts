/**
 * facts.ts — the page-facing view of the project's facts.
 *
 * Nothing here is hand-written. It merges:
 *   - project-facts.ts  → the single source of truth for authored values
 *   - *-generated.json  → values produced by the scripts in Aartiq/scripts/
 *
 * Pages must import from here (or from project-facts for authored values only),
 * never from a literal.
 */

import testFactsJson from "./test-facts.generated.json";
import repoFactsJson from "./repo-facts.generated.json";
import shellTiersJson from "./shell-tiers.generated.json";
import type {
  GeneratedTestFacts,
  GeneratedRepoFacts,
  GeneratedShellTiers,
} from "./project-facts";
import { benchmarks, platforms, network } from "./project-facts";

export * from "./project-facts";

export const tests = testFactsJson as unknown as GeneratedTestFacts;
export const repoStats = repoFactsJson as unknown as GeneratedRepoFacts;

/**
 * The shell risk table, read out of the classifier that enforces it.
 *
 * `scripts/gen-shell-tiers.ts` writes shell-tiers.generated.json from
 * `aartiq-browser/src/lib/shell-command-tiers.js` — the same module the runtime
 * reads — so the numbers a page publishes are the numbers the code uses. This
 * exists because the previous tier table was hand-written, and it described
 * defaults the code had already moved away from: it said low and medium were
 * auto-approved by a startup session grant, and that medium was the default tier
 * for anything not matching a destructive pattern, which held only because the
 * classifier had no `low` tier at all.
 *
 * Import this instead of counting commands or restating a tier. `npm run
 * docs:check` fails when the generated file is stale.
 */
export const shellTiers = shellTiersJson as unknown as GeneratedShellTiers;

/**
 * Ports and bind addresses, resolved once.
 *
 * A page that says "the MCP bridge listens on 3001" is re-stating a fact that
 * already lives in `network.servers`; when the port changes it silently stops
 * being true. Import `net` instead and the sentence stays correct for free.
 */
const serverById = (id: string) => {
  const found = network.servers.find((s) => s.id === id);
  if (!found) throw new Error(`network.servers has no entry with id "${id}"`);
  return found;
};

export const net = {
  mcpBridge: serverById("mcp-bridge"),
  wifiSync: serverById("wifi-sync"),
  nativeBridge: serverById("native-bridge"),
  agentApi: serverById("agent-api"),
  backgroundService: serverById("background-service"),
  /** UDP broadcast destination — not a listener. */
  discovery: network.discovery,
  /** Next.js dev server port; development only. */
  devRenderer: network.devRenderer,
  retired: network.retiredPorts,
  /** Firewall guidance: "3004-3005". */
  syncPortRange: `${serverById("wifi-sync").port}-${network.discovery.port}`,
  /** "127.0.0.1:46203" for the loopback-only servers. */
  loopbackEndpoints: network.servers
    .filter((s) => s.defaultBindAddress === "127.0.0.1")
    .map((s) => `${s.defaultBindAddress}:${s.port}`),
  /** Servers that accept connections from any interface, by name. */
  exposedServers: network.servers.filter((s) => s.defaultBindAddress !== "127.0.0.1"),
} as const;

/** Counted from COMMAND_REGISTRY at generation time — never written by hand. */
export const commandCount = tests.commandCount;

/** Ready-made strings so no page has to assemble a number by hand. */
export const derived = {
  testSummary: `${tests.tests.passed} passed / ${tests.tests.skipped} skipped / ${tests.tests.failed} failed`,
  testSummaryWithTotal: `${tests.tests.passed} passed / ${tests.tests.skipped} skipped / ${tests.tests.failed} failed (${tests.tests.declared} declared)`,
  testEnvironment: tests.environment.label,
  testGeneratedAt: tests.generatedAt,
  suiteSummary: `${tests.suites.passed} of ${tests.suites.total} suites passing`,
  skipBreakdownTotal: tests.skipBreakdown.reduce((n, s) => n + s.count, 0),

  /** Must be printed next to any published benchmark figure. */
  benchmarkLabel: `benchmarked on v${benchmarks.benchmarkVersion}`,
  benchmarkStale:
    benchmarks.benchmarkVersion !== benchmarks.currentVersion,
} as const;

/**
 * Platforms that actually ship a downloadable artifact, counted from the list.
 * iOS is built in CI but unsigned, so it is excluded by the flag rather than by
 * remembering to keep a second number in sync.
 */
export const distributedPlatformCount = platforms.filter(
  (p) => p.distributed && p.id !== "macos-intel",
).length;
