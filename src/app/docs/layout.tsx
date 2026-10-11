"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
  Github,
  ArrowRight,
  Bot,
  Shield,
  Zap,
  Terminal,
  Cloud,
  CloudOff,
  Code2,
  AlertTriangle,
  Settings,
  Smartphone,
  FileText,
  Search,
  Lock,
  Layers,
  Package,
  Puzzle,
  Server,
  LayoutGrid,
  History,
  Command,
  Keyboard,
  Apple,
  Monitor,
  TestTube,
  Boxes
} from "lucide-react";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { APP_INFO } from "@/lib/version";
import { useVersion } from "@/lib/useVersion";
import { SearchModal } from "@/components/docs/SearchModal";

const SITE_URL = 'https://aartiq.ponsrischool.in';

interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: Zap,
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    href: "/docs/keyboard-shortcuts",
    icon: Keyboard,
  },
  {
    id: "overview",
    title: "Overview",
    href: "/docs/overview",
    icon: BookOpen,
  },
  {
    id: "components",
    title: "Components",
    href: "/docs/components",
    icon: LayoutGrid,
  },
  {
    id: "changelog",
    title: "Changelog",
    href: "/docs/changelog",
    icon: History,
  },
  {
    id: "cloud-sync",
    title: "Cloud Sync",
    href: "/docs/cloud-sync",
    icon: Cloud,
  },
  {
    id: "ai-commands",
    title: "AI Commands",
    href: "/docs/ai-commands",
    icon: Bot,
  },
  {
    id: "skills",
    title: "Skills",
    href: "/docs/skills",
    icon: Boxes,
  },

  {
    id: "security",
    title: "Security Model",
    href: "/docs/security",
    icon: Shield,
  },
  {
    id: "automation",
    title: "Automation",
    href: "/docs/automation",
    icon: Terminal,
  },
  {
    id: "native-api",
    title: "Native API",
    href: "/docs/native-api",
    icon: Server,
  },
  {
    id: "apple-integration",
    title: "Apple Integration",
    href: "/docs/apple-integration",
    icon: Apple,
  },
  {
    id: "windows-integration",
    title: "Windows Integration",
    href: "/docs/windows-integration",
    icon: Monitor,
  },
  {
    id: "linux-integration",
    title: "Linux Integration",
    href: "/docs/linux-integration",
    icon: Command,
  },
  {
    id: "deep-links",
    title: "Deep Links",
    href: "/docs/deep-links",
    icon: Code2,
  },
  {
    id: "plugins",
    title: "Plugins",
    href: "/docs/plugins",
    icon: Puzzle,
  },
  {
    id: "extensions",
    title: "Extensions",
    href: "/docs/extensions",
    icon: Package,
  },
  {
    id: "api-reference",
    title: "API Reference",
    href: "/docs/api-reference",
    icon: Code2,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    icon: AlertTriangle,
  },
  {
    id: "testing",
    title: "Testing & Test Series",
    href: "/docs/testing",
    icon: TestTube,
  },
  {
    id: "contributing",
    title: "Contributing",
    href: "/docs/contributing",
    icon: Github,
  },
];

const sectionGroups = [
  {
    title: "Introduction",
    items: navigation.filter(item => 
      ["getting-started", "keyboard-shortcuts", "overview", "components", "changelog"].includes(item.id)
    ),
  },
  {
    title: "Cloud & Sync",
    items: navigation.filter(item => 
      ["cloud-sync"].includes(item.id)
    ),
  },
   {
    title: "Core Features",
    items: navigation.filter(item => 
      ["ai-commands", "skills", "security", "automation"].includes(item.id)
    ),
  },
  {
    title: "Extensibility",
    items: navigation.filter(item => 
      ["native-api", "deep-links", "plugins", "extensions"].includes(item.id)
    ),
  },
  {
    title: "Reference",
    items: navigation.filter(item => 
      ["api-reference", "troubleshooting", "testing", "contributing"].includes(item.id)
    ),
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { version } = useVersion();

  const breadcrumbItems = [
    { name: "Aartiq", url: `${SITE_URL}/` },
    { name: "Docs", url: `${SITE_URL}/docs` },
  ];
  const currentNavItem = navigation.find((item) => item.href === pathname);
  if (currentNavItem) {
    breadcrumbItems.push({ name: currentNavItem.title, url: `${SITE_URL}${currentNavItem.href}` });
  }

  useEffect(() => {
    return auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.scrollY + 100;
      
      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        const id = section.getAttribute("id");
        
        if (scrollPos >= top && scrollPos < top + height && id) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": item.url,
            })),
          }),
        }}
      />
      <div className="min-h-screen bg-[#03040b] text-white font-outfit">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-[#03040b]/95 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image 
                  src="/icon.png" 
                  alt="Aartiq"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Aartiq™</span>
            </Link>
            <span className="hidden text-[10px] font-black uppercase tracking-[0.4em] text-sky-400/60 sm:block">
              Documentation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="group hidden h-9 w-64 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-xs text-white/30 transition hover:border-sky-500/50 hover:bg-white/10 hover:text-white/60 md:flex"
            >
              <Search size={16} className="transition group-hover:text-sky-400" />
              <span className="flex-1 text-left">Search docs...</span>
              <kbd className="flex items-center gap-0.5 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/30">
                <Command size={10} />K
              </kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              <Search size={20} />
            </button>
            <a
              href="/docs/keyboard-shortcuts"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
              title="Keyboard Shortcuts"
            >
              <Keyboard size={20} />
            </a>
            <a
              href="https://github.com/Latestinssan/Aartiq"
              target="_blank"
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white/60 transition hover:bg-white/10 hover:text-white sm:flex"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href="/downloads"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-sky-400 hover:text-white"
            >
              Download <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-16 bottom-0 z-50 w-80 overflow-y-auto border-r border-white/5 bg-[#03040b] p-6 lg:hidden"
            >
              <SidebarContent 
                pathname={pathname} 
                sectionGroups={sectionGroups}
                activeSection={activeSection}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-80 lg:shrink-0 lg:fixed lg:top-16 lg:bottom-0 lg:overflow-y-auto lg:border-r lg:border-white/5 lg:bg-[#03040b]">
          <div className="sticky top-0 p-8">
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
              <div className="relative h-5 w-5 overflow-hidden">
                <Image 
                  src="/icon.png" 
                  alt="Aartiq"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400/60">Version</p>
                <a href={APP_INFO.releases} target="_blank" className="text-sm font-black text-white hover:text-sky-400 transition">
                  v{version || '...'}
                </a>
              </div>
            </div>
            <SidebarContent 
              pathname={pathname} 
              sectionGroups={sectionGroups}
              activeSection={activeSection}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80">
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-12 lg:py-20">
            {children}
          </div>
        </main>

        {/* Right TOC (Table of Contents) - Desktop Only */}
        <PageToc key={pathname} />
      </div>
    </div>
    </>
  );
}

/**
 * PageToc — the "On this page" outline, derived from the real headings of the
 * current page. The previous hard-coded anchors (#introduction, #installation,
 * #configuration, #first-steps) only existed on some pages and were dead links
 * everywhere else, so the outline is now built from `main`'s h2/h3 elements at
 * runtime: headings without an id get a slugged id so the anchor link works.
 * The aside renders nothing when a page has no headings.
 */
function PageToc() {
  const [items, setItems] = useState<{ id: string; text: string; level: 2 | 3 }[]>([]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const used = new Set<string>();
    const entries: { id: string; text: string; level: 2 | 3 }[] = [];
    const slugify = (text: string, index: number) => {
      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || `section-${index + 1}`;
      let id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      return id;
    };
    main.querySelectorAll("h2, h3").forEach((heading, index) => {
      const text = (heading.textContent || "").trim();
      if (!text) return;
      const existing = heading.id && heading.id.trim();
      const id = existing || slugify(text, index);
      if (!existing) heading.id = id;
      used.add(id);
      entries.push({ id, text, level: heading.tagName === "H3" ? 3 : 2 });
    });
    setItems(entries);
  }, []);

  if (items.length === 0) return null;
  return (
    <aside className="hidden xl:block xl:w-64 xl:shrink-0 xl:fixed xl:top-16 xl:right-0 xl:bottom-0 xl:overflow-y-auto xl:border-l xl:border-white/5 xl:bg-[#03040b] xl:p-8">
      <p className="mb-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
        On this page
      </p>
      <nav className="space-y-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-xs font-medium text-white/40 transition hover:text-sky-400 ${
              item.level === 3 ? "pl-3 text-white/30" : ""
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function SidebarContent({ 
  pathname, 
  sectionGroups, 
  activeSection 
}: { 
  pathname: string; 
  sectionGroups: { title: string; items: NavItem[] }[];
  activeSection: string;
}) {
  return (
    <nav className="space-y-8">
      {sectionGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            {group.title}
          </p>
          <ul className="space-y-2">
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/docs" && pathname.startsWith(item.href));
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <item.icon size={16} className={isActive ? "text-sky-400" : ""} />
                    {item.title}
                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="border-t border-white/5 pt-8">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
          Resources
        </p>
        <ul className="space-y-2">
          <li>
            <a
              href="https://github.com/Latestinssan/Aartiq/releases"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition"
            >
              <ExternalLink size={16} /> Releases
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Latestinssan/Aartiq/issues"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition"
            >
              <ExternalLink size={16} /> Issue Tracker
            </a>
          </li>
          <li>
            <Link
              href="/docs/contributing"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition"
            >
              <Github size={16} /> Contributing Guide
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
