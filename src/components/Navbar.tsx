"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { APP_INFO, APP_VERSION } from "@/lib/version";
import { useVersion } from "@/lib/useVersion";
import { Github } from "lucide-react";

export const Navbar = ({ onOpenAuth, user }: { onOpenAuth: () => void, user: any }) => {
  const pathname = usePathname();
  const { version } = useVersion();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "GitHub", href: APP_INFO.github, external: true },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <nav className="fixed left-0 top-0 z-[60] w-full bg-transparent py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex h-10 w-10 items-center justify-center">
              <Image 
               src="/logo-transparent.png" 
               alt={`${APP_INFO.name} Logo`}
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black uppercase tracking-tighter leading-none">{APP_INFO.name}™</span>
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] font-black text-sky-400">
              {/*
                `useVersion()` starts empty and fills in from /api/version after
                hydration. The previous fallback was the literal '0.3.0', so the
                badge showed a version that had been superseded for months on the
                first paint of every page. Fall back to the SSOT instead — it is
                what /api/version returns anyway, so there is no hydration flash.
              */}
                v{version || APP_VERSION.version}
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-sky-400/60">
              Open Source AI-Integrated Browser
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 transition hover:text-sky-400"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition ${pathname === item.href ? "text-sky-400" : "text-white/40 hover:text-sky-400"}`}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={APP_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <Github size={16} />
            Star
          </a>
          <Link 
             href="/docs"
             className="hidden rounded-full bg-sky-500 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-sky-400 sm:block"
          >
            Docs
          </Link>
        </div>
      </div>
    </nav>
  );
};
