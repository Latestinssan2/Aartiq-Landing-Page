/**
 * The home page must survive a GitHub API rate-limit response.
 *
 * GitHub answers an unauthenticated request over the 60/hour per-IP limit with
 * HTTP 403 and a JSON error body:
 *
 *   { "message": "API rate limit exceeded for <ip>. ...", "status": "403" }
 *
 * Because that body is valid JSON, `res.json()` resolves and `.catch()` never
 * fires, so the error object was stored in state as if it were a release. The
 * hero then read `tag_name` off it and the whole page threw.
 *
 * The version label is inside JSX, so it cannot be imported. This test lifts the
 * real expression out of the shipped source and runs it, which means it fails if
 * the source stops being the thing that runs.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isGitHubRelease } from "../src/lib/github-release.ts";

const SRC = join(import.meta.dirname, "..", "src", "app", "page.tsx");

/** GitHub's real rate-limit body. The address is from RFC 5737's example range. */
const RATE_LIMIT_403 = {
  message:
    "API rate limit exceeded for 203.0.113.42. (But here's the good news: " +
    "Authenticated requests get a higher rate limit. Check out the documentation " +
    "for more details.)",
  documentation_url:
    "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting",
  status: "403",
};

const VALID_RELEASE = {
  tag_name: "v0.3.8-beta.1",
  assets: [{ name: "Aartiq-0.3.8.AppImage", browser_download_url: "https://example.com/a.AppImage" }],
};

/**
 * Pulls the version-label expression out of the shipped page source and returns
 * a callable of the same three values the component has in scope.
 */
function loadShippedVersionLabel(): (
  r: unknown,
  version: string | null,
  channel: string | null,
  guard: (value: unknown) => boolean,
) => string {
  const source = readFileSync(SRC, "utf8");
  const line = source.split("\n").find((l) => l.includes("latestRelease.tag_name"));
  assert.ok(line, "expected the home page to render a version label from latestRelease");

  const start = line.indexOf("{");
  const end = line.lastIndexOf("}");
  assert.ok(start !== -1 && end > start, `could not isolate the expression in: ${line.trim()}`);

  const expression = line.slice(start + 1, end);
  // `isGitHubRelease` is imported by the page, so it is in scope there too.
  // eslint-disable-next-line no-new-func
  return new Function("latestRelease", "version", "channel", "isGitHubRelease", `return (${expression});`) as (
    r: unknown,
    v: string | null,
    c: string | null,
    guard: (value: unknown) => boolean,
  ) => string;
}

test("isGitHubRelease rejects a rate-limit body", () => {
  assert.equal(isGitHubRelease(RATE_LIMIT_403), false);
});

test("isGitHubRelease accepts a real release", () => {
  assert.equal(isGitHubRelease(VALID_RELEASE), true);
  assert.equal(isGitHubRelease({ tag_name: "v1.0.0", assets: [] }), true);
});

test("isGitHubRelease rejects things that are not objects at all", () => {
  for (const value of [null, undefined, 0, "", "v1.0.0", [], true, { message: "nope" }, { tag_name: "", assets: [] }]) {
    assert.equal(isGitHubRelease(value), false, `should not accept ${JSON.stringify(value)}`);
  }
});

test("a rate-limited GitHub response does not take down the home page", () => {
  const label = loadShippedVersionLabel();
  // Must not throw. Before the fix this threw
  // TypeError: Cannot read properties of undefined (reading 'replace').
  const text = label(RATE_LIMIT_403, "0.3.7", "stable", isGitHubRelease);
  assert.equal(typeof text, "string");
  assert.ok(text.length > 0, "expected some version text, not an empty string");
});

test("a rate-limited response falls back to the version the build knows", () => {
  const label = loadShippedVersionLabel();
  assert.equal(label(RATE_LIMIT_403, "0.3.7", "stable", isGitHubRelease), "v0.3.7 stable");
});

test("a real release still renders its tag", () => {
  const label = loadShippedVersionLabel();
  assert.equal(label(VALID_RELEASE, "0.3.7", "stable", isGitHubRelease), "v0.3.8-beta.1");
});

test("a release object is not required to have assets to render a version", () => {
  // A genuine release with no uploads is `{tag_name, assets: []}` and must render.
  const label = loadShippedVersionLabel();
  assert.equal(label({ tag_name: "v9.9.9", assets: [] }, "0.3.7", "stable", isGitHubRelease), "v9.9.9");
});

test("no browser code fetches api.github.com directly", () => {
  // Every visitor's browser hitting api.github.com unauthenticated is what
  // exhausts the shared per-IP limit in the first place.
  const offenders: string[] = [];

  for (const rel of ["app/page.tsx", "app/downloads/page.tsx", "app/docs/contributing/page.tsx"]) {
    const text = readFileSync(join(import.meta.dirname, "..", "src", rel), "utf8");
    if (text.includes("https://api.github.com")) offenders.push(rel);
  }

  assert.deepEqual(
    offenders,
    [],
    "these pages call api.github.com from the browser, so the 60/hour per-IP limit is spent per visitor:\n" +
      offenders.map((o) => `  ${o}`).join("\n"),
  );
});