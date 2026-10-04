import { version } from "@/data/project-facts";

/**
 * Version facts used as the offline fallback by /api/version.
 *
 * These are never written here. They come from the single source of truth, which
 * is itself verified against `aartiq-browser/package.json` and the GitHub releases
 * API by scripts/gen-repo-facts.ts and scripts/gen-test-facts.ts.
 *
 * Historically this function read `../aartiq-browser/package.json` and, when that
 * directory was absent (the landing site is deployed from its own repository),
 * silently fell back to the *landing site's* package.json — reporting its own
 * version instead of the browser's. Deriving from the SSOT removes that path.
 */
export function getVersionFromPackage(): {
  version: string;
  codename: string;
  releaseDate: string;
  channel: string;
} {
  return {
    version: version.semver,
    codename: version.codename,
    releaseDate: version.releaseDate,
    channel: version.status,
  };
}
