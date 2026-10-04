import { version } from "@/data/project-facts";

export const APP_INFO = {
  name: 'Aartiq',
  fullName: 'Aartiq',
  tagline: 'Navigate, automate, and control your workflow',
  description: 'Aartiq is an open-source Electron browser with built-in AI assistant, background task scheduling, and OS-level automation. Built by Latestinssan.',
  authors: ['Latestinssan'],
  website: 'https://aartiq.ponsrischool.in',
  docs: 'https://aartiq.ponsrischool.in/docs',
  github: 'https://github.com/Latestinssan/Aartiq',
  releases: 'https://github.com/Latestinssan/Aartiq/releases',
  supportEmail: 'support@ponsrischool.in',
};

/**
 * Re-exported from the single source of truth so this module cannot drift from
 * project-facts.ts. It used to repeat the version, release date, codename, and
 * channel as its own literals.
 */
export const APP_VERSION = {
  version: version.semver,
  codename: version.codename,
  releaseDate: version.releaseDate,
  channel: version.status,
};
