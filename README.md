# Aartiq Landing Page

**Production URL:** https://aartiq.ponsrischool.in

This directory contains the public marketing site and documentation for Aartiq.

## Current Release

- Version: `0.3.8`
- Codename: `Palisade`
- Channel: `stable`
- Release date: `2026-10-04`

These values live once in `src/data/project-facts.ts` (`version`); this README
mirrors them, and `Aartiq/scripts/check-docs.ts` fails if a page hard-codes a
different tracked version.

## Purpose

The landing page is the public-facing source of truth for:

- Product overview and downloads
- Documentation under `/docs/*`
- AI/LLM crawlability assets such as `llms.txt`, `sitemap.xml`, and `robots.txt`
- Search metadata and documentation indexing

## Structure

```text
Aartiq-Landing-Page/
├── public/
│   ├── LLM.md
│   ├── robots.txt
│   └── .well-known/ai-plugin.json
├── src/
│   ├── app/
│   │   ├── docs/
│   │   ├── api/
│   │   ├── llms.txt/
│   │   └── sitemap.ts
│   ├── components/
│   ├── data/
│   └── lib/
├── AI-GUIDE.md
└── README.md
```

## Documentation Pages

These pages should stay aligned with `AI-GUIDE.md`:

- `/docs/getting-started`
- `/docs/keyboard-shortcuts`
- `/docs/overview`
- `/docs/components`
- `/docs/changelog`
- `/docs/cloud-sync`
- `/docs/ai-commands`
- `/docs/skills`
- `/docs/security`
- `/docs/automation`
- `/docs/native-api`
- `/docs/apple-integration`
- `/docs/windows-integration`
- `/docs/linux-integration`
- `/docs/deep-links`
- `/docs/plugins`
- `/docs/extensions`
- `/docs/api-reference`
- `/docs/troubleshooting`
- `/docs/testing`
- `/docs/contributing`

## AI Command Documentation Rules

- Public docs should treat structured JSON as the primary command format.
- `/docs/ai-commands`, `src/lib/search-index.ts`, and `src/app/llms.txt/route.ts` should stay in sync.
- The supported set is the `COMMAND_REGISTRY` in
  `aartiq-browser/src/lib/AICommandParser.ts`; the full reference with parameters
  and examples lives at `/docs/ai-commands`.

## Maintenance Checklist

When landing-page docs change, also review:

- `src/lib/version.ts`
- `src/lib/search-index.ts`
- `public/LLM.md`
- `src/app/llms.txt/route.ts`
- `src/app/sitemap.ts`
- `src/app/docs/metadata.ts`

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
