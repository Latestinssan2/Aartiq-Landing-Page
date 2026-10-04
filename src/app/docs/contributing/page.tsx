"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Github,
  GitBranch,
  Code2,
  TestTube,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Book,
  Users,
  Hammer,
  Shield,
  Star,
  GitPullRequest,
  AlertCircle,
  Terminal,
  Laptop,
  Bug,
  Lightbulb
} from "lucide-react";

const contributionAreas = [
  {
    title: "Bug Reports",
    icon: Bug,
    description: "Report issues with reproduction steps",
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
    tasks: [
      "Search existing issues before creating new ones",
      "Include version number and platform",
      "Provide steps to reproduce",
      "Attach relevant logs and screenshots"
    ],
    link: "https://github.com/Latestinssan/Aartiq/issues"
  },
  {
    title: "Feature Requests",
    icon: Lightbulb,
    description: "Suggest new capabilities",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    tasks: [
      "Describe the use case and problem",
      "Suggest how the feature should work",
      "Consider backward compatibility",
      "Discuss with maintainers first"
    ],
    link: "https://github.com/Latestinssan/Aartiq/discussions"
  },
  {
    title: "Code Contributions",
    icon: Code2,
    description: "Submit pull requests",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    tasks: [
      "Fork the repository",
      "Create a feature branch",
      "Follow code style guidelines",
      "Add tests for new features"
    ],
    link: "https://github.com/Latestinssan/Aartiq/pulls"
  },
  {
    title: "Documentation",
    icon: Book,
    description: "Improve docs and examples",
    color: "from-sky-500/20 to-cyan-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
    tasks: [
      "Fix typos and clarify unclear sections",
      "Add examples and tutorials",
      "Translate to other languages",
      "Update outdated information"
    ],
    link: "https://github.com/Latestinssan/Aartiq/tree/main/Landing_Page"
  }
];

const setupSteps = [
  {
    step: 1,
    title: "Fork the Repository",
    description: "Create your own copy of the project on GitHub",
    command: "gh repo fork Latestinssan/Aartiq",
    icon: GitBranch
  },
  {
    step: 2,
    title: "Clone Your Fork",
    description: "Download the code to your local machine",
    command: "git clone https://github.com/YOUR_USERNAME/Aartiq.git",
    icon: Terminal
  },
  {
    step: 3,
    title: "Install Dependencies",
    description: "Install all required packages for development",
    command: "cd aartiq-browser && npm install",
    icon: Laptop
  },
  {
    step: 4,
    title: "Start Development Server",
    description: "Run the app in development mode",
    command: "npm run dev",
    icon: Code2
  }
];

const codeStyleRules = [
  { category: "JavaScript/TypeScript", rules: [
    "Use 2 spaces for indentation",
    "Prefer const over let",
    "Use async/await over raw promises",
    "Follow existing naming conventions",
    "Add JSDoc comments for public APIs"
  ]},
  { category: "React Components", rules: [
    "Use functional components with hooks",
    "Keep components under 300 lines",
    "Extract custom hooks for logic",
    "Use named exports for utilities",
    "Colocate styles with components"
  ]},
  { category: "Commit Messages", rules: [
    "Use imperative mood (add, fix, update)",
    "Keep subject line under 50 chars",
    "Reference issues with #number",
    "Explain 'why' not 'what'",
    "Use conventional commits format"
  ]}
];

const pullRequestChecklist = [
  "My code follows the project's style guidelines",
  "I have performed a self-review of my code",
  "I have commented complex parts of my code",
  "My changes generate no new warnings or errors",
  "I have added tests that prove my fix/feature works",
  "I have updated documentation where necessary",
  "My PR targets the correct branch (main for fixes)",
  "I have linked the related issue in my PR description"
];

export default function ContributingPage() {
  const [githubStats, setGithubStats] = useState({ stars: 0, pull_requests: 0, contributors: 0 });

  useEffect(() => {
    // Read the cached server snapshot rather than calling api.github.com from the
    // browser. This page already survived a failed fetch by showing zeroes, but
    // each of those calls spent from the shared 60/hour per-IP budget.
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.stats) return;
        setGithubStats({
          stars: data.stats.stars,
          contributors: data.stats.contributors,
          pull_requests: data.stats.pull_requests
        });
      })
      .catch(err => console.error("Stats fetch failed:", err));
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Users size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Contributing Guide
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl">
          Contributing Guide
        </h1>

        <p className="max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Guidelines for contributing to Aartiq. Source code, tests, build config, and code signing documentation.
        </p>

        {/* Stats */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 text-center">
            <Star size={32} className="mx-auto mb-4 text-sky-400" />
            <h3 className="text-3xl font-black text-sky-400">{githubStats.stars}</h3>
            <p className="text-sm text-white/50">GitHub Stars</p>
          </div>
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 text-center">
            <GitPullRequest size={32} className="mx-auto mb-4 text-purple-400" />
            <h3 className="text-3xl font-black text-purple-400">{githubStats.pull_requests}</h3>
            <p className="text-sm text-white/50">Pull Requests</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <Users size={32} className="mx-auto mb-4 text-emerald-400" />
            <h3 className="text-3xl font-black text-emerald-400">{githubStats.contributors}</h3>
            <p className="text-sm text-white/50">Contributors</p>
          </div>
        </div>
      </motion.section>

      {/* Contributors */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Recognition
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Contributors
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { name: "Shashank Shekhar", role: "Microsoft Store Advisor · UI/UX Feedback", desc: "Guided Microsoft Store submission, flagged macOS UI on Windows, suggested ad-blocker and Zen-inspired design.", initials: "SS", gradient: "from-sky-500/20 to-violet-500/20", link: "https://github.com/theshekhr" },
            { name: "eddzsh", role: "Security Architecture · Approval System Design", desc: "Designed the ticket-based approval system. Hash verification, pre-registered call shapes, pattern-based approval.", initials: "ed", gradient: "from-green-500/20 to-emerald-500/20", link: "https://www.reddit.com/user/eddzsh" },
            { name: "Dxrkaa", role: "First Issue Reporter · Early Adopter", desc: "Opened the first community bug report. Helped identify and fix a critical Windows launch regression.", initials: "Dx", gradient: "from-orange-500/20 to-red-500/20", link: "https://github.com/Latestinssan/Aartiq/issues/6" },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 hover:-translate-y-1 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${c.gradient} text-sm font-bold text-white/60`}>{c.initials}</div>
                <div>
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-sky-400 transition-colors">{c.name}</a>
                  <p className="text-[11px] text-white/30">{c.role}</p>
                </div>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Ways to Contribute */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Get Involved
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            How to <span className="text-white/20">Contribute</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {contributionAreas.map((area, i) => (
            <motion.a
              key={area.title}
              href={area.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group rounded-[2rem] border ${area.borderColor} bg-gradient-to-br ${area.color} p-10 transition-all hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 ${area.iconColor} transition-transform group-hover:scale-110`}>
                  <area.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-wider">{area.title}</h3>
                  <p className="text-sm text-white/50">{area.description}</p>
                </div>
                <ExternalLink size={20} className="ml-auto text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>

              <ul className="space-y-2">
                {area.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                    {task}
                  </li>
                ))}
              </ul>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Development Setup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            For Developers
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Development <span className="text-white/20">Setup</span>
          </h2>
        </div>

        {/* Setup Steps */}
        <div className="mb-12 space-y-4">
          {setupSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-lg font-black text-sky-400">
                {step.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <step.icon size={20} className="text-white/40" />
                  <h3 className="font-bold text-white">{step.title}</h3>
                </div>
                <p className="mt-1 text-sm text-white/50">{step.description}</p>
              </div>
              <code className="hidden rounded-lg bg-black/40 px-4 py-2 font-mono text-sm text-sky-400 lg:block">
                {step.command}
              </code>
            </motion.div>
          ))}
        </div>

        {/* Project Structure */}
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-10">
          <h3 className="mb-6 text-xl font-black uppercase tracking-wider">Project Structure</h3>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-black/20 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Hammer size={16} className="text-sky-400" />
                <h4 className="font-bold text-white">aartiq-browser/</h4>
              </div>
              <p className="text-sm text-white/50">Electron desktop application with AI integration</p>
              <ul className="mt-3 space-y-1 text-xs text-white/40">
                <li>• main.js - Main process</li>
                <li>• preload.js - Preload scripts</li>
                <li>• src/components/ - React UI</li>
                <li>• src/lib/ - Core services</li>
                <li>• src/service/ - Background services</li>
                <li>• package.json - Build config & dependencies</li>
                <li>• CODE_SIGNING.md - Code signing docs</li>
                <li>• tests/ - Test suite</li>
              </ul>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Laptop size={16} className="text-purple-400" />
                <h4 className="font-bold text-white">flutter_browser_app/</h4>
              </div>
              <p className="text-sm text-white/50">Flutter mobile app for desktop control</p>
              <ul className="mt-3 space-y-1 text-xs text-white/40">
                <li>• lib/main.dart - App entry</li>
                <li>• lib/pages/ - UI screens</li>
                <li>• lib/sync_service.dart - WiFi sync</li>
                <li>• lib/pages/ - Desktop control</li>
              </ul>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Book size={16} className="text-emerald-400" />
                <h4 className="font-bold text-white">Landing_Page/</h4>
              </div>
              <p className="text-sm text-white/50">Marketing website and documentation</p>
              <ul className="mt-3 space-y-1 text-xs text-white/40">
                <li>• src/app/docs/ - Documentation</li>
                <li>• src/components/ - UI components</li>
                <li>• src/lib/firebase.ts - Auth</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Code Style */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Standards
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Code <span className="text-white/20">Style</span>
          </h2>
        </div>

        <div className="space-y-6">
          {codeStyleRules.map((rule, i) => (
            <motion.div
              key={rule.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
            >
              <h3 className="mb-6 text-xl font-black uppercase tracking-wider">{rule.category}</h3>
              <ul className="space-y-3">
                {rule.rules.map((r, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sky-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pull Request Checklist */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Before Submitting
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            PR <span className="text-white/20">Checklist</span>
          </h2>
        </div>

        <div className="rounded-[2rem] border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-10">
          <div className="mb-8 flex items-center gap-4">
            <TestTube size={40} className="text-sky-400" />
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider">Before Opening a Pull Request</h3>
              <p className="text-sm text-white/50">Ensure your changes meet these requirements</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {pullRequestChecklist.map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">
                  {i + 1}
                </div>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-4">
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <h4 className="font-bold text-amber-400">Important Note</h4>
                <p className="mt-1 text-sm text-white/60">
                  Large pull requests may take longer to review. Consider breaking large changes into 
                  smaller, focused PRs. This makes review easier and allows for faster merging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Security */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-16">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Responsible Disclosure
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
            Security <span className="text-white/20">Issues</span>
          </h2>
        </div>

        <div className="rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-500/10 to-rose-500/10 p-10">
          <div className="mb-8 flex items-center gap-4">
            <Shield size={40} className="text-red-400" />
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider">Found a Security Vulnerability?</h3>
              <p className="text-sm text-white/50">Please report it responsibly via our security channel</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 font-bold text-white">What to Report</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Detailed description of the vulnerability</li>
                <li>• Steps to reproduce the issue</li>
                <li>• Potential impact assessment</li>
                <li>• Suggested remediation (if any)</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">What We Promise</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Acknowledge within 48 hours</li>
                <li>• Keep you updated on progress</li>
                <li>• Credit in security advisories</li>
                <li>• Fair recognition for valid reports</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="mailto:support@ponsrischool.in"
              className="inline-flex items-center gap-3 rounded-full bg-red-500/20 px-8 py-4 text-sm font-bold text-red-400 transition hover:bg-red-500/30"
            >
              <AlertCircle size={18} />
              Report Security Issue
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
