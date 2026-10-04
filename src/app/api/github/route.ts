import { NextResponse } from 'next/server';
import { isGitHubRelease, type GitHubRelease } from '@/lib/github-release';

/**
 * One cached snapshot of the public repository, for the browser to read.
 *
 * Why this exists: the pages used to call api.github.com themselves. That is
 * unauthenticated, so every visitor's browser spent from the same 60-requests-
 * per-hour-per-IP budget, and once it was gone GitHub answered 403 with a JSON
 * error body that parsed successfully and was therefore stored as if it were
 * data. The home page then read `tag_name` off the error object and threw, so a
 * rate limit on a statistics badge took down the whole page.
 *
 * Fetching here instead means the limit is spent once per revalidation window
 * rather than once per visitor, and `next.revalidate` lets every visitor share
 * one upstream response.
 *
 * A failure upstream is not an error here. The route answers with nulls, because
 * a missing star count is not worth failing a page render over.
 */

const REPO = 'Latestinssan/Aartiq';
const HEADERS = { Accept: 'application/vnd.github+json' };

export interface GitHubStats {
  stars: number;
  forks: number;
  open_issues: number;
  contributors: number;
  pull_requests: number;
}

export interface GitHubSnapshot {
  release: GitHubRelease | null;
  stats: GitHubStats;
  /** Set when an upstream call was refused or failed, so the client can say so. */
  degraded: boolean;
}

const EMPTY_STATS: GitHubStats = {
  stars: 0,
  forks: 0,
  open_issues: 0,
  contributors: 0,
  pull_requests: 0,
};

/** Returns null for any non-2xx response instead of parsing the error body. */
async function getJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function count(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export async function GET() {
  const [release, repo, contributors, pullRequests] = await Promise.all([
    getJson(`https://api.github.com/repos/${REPO}/releases/latest`),
    getJson(`https://api.github.com/repos/${REPO}`),
    getJson(`https://api.github.com/repos/${REPO}/contributors?per_page=100`),
    getJson(`https://api.github.com/search/issues?q=repo:${REPO}+is:pr`),
  ]);

  const repoRecord = (repo && typeof repo === 'object' ? repo : {}) as Record<string, unknown>;
  const searchRecord = (pullRequests && typeof pullRequests === 'object' ? pullRequests : {}) as Record<string, unknown>;

  const snapshot: GitHubSnapshot = {
    release: isGitHubRelease(release) ? release : null,
    stats: {
      stars: count(repoRecord.stargazers_count),
      forks: count(repoRecord.forks_count),
      open_issues: count(repoRecord.open_issues_count),
      contributors: Array.isArray(contributors) ? contributors.length : 0,
      pull_requests: count(searchRecord.total_count),
    },
    degraded: release === null,
  };

  return NextResponse.json(snapshot, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      // Shared for five minutes, matching the upstream revalidation window, so a
      // visitor does not spend the site's own budget either.
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}