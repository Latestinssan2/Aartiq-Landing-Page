"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { 
  Monitor, 
  Smartphone, 
  Terminal, 
  Download, 
  Github, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { auth } from "@/lib/firebase";
import { APP_INFO } from "@/lib/version";
import { version } from "@/data/facts";
import { GitHubRelease, getReleaseDownloadLinks } from "@/lib/github-release";

export default function DownloadsPage() {
  const [user, setUser] = useState<any>(null);
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
    fetch("https://api.github.com/repos/Latestinssan/Aartiq/releases/latest")
      .then(res => res.json())
      .then(data => setLatestRelease(data));
  }, []);

  const downloadLinks = useMemo(() => {
    return getReleaseDownloadLinks(latestRelease).map((item) => ({
      ...item,
      icon: item.platform === "windows"
        ? Monitor
        : item.platform === "linux"
          ? Terminal
          : Smartphone,
    }));
  }, [latestRelease]);

  return (
    <div className="min-h-screen bg-[#03040b] text-white font-outfit">
      <Navbar onOpenAuth={() => {}} user={user} />
      
      <main className="pt-32 pb-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
                <Download size={14} /> Ecosystem Deployment
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter sm:text-8xl leading-none">
                Deploy <br /> <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Everywhere.</span>
              </h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-400 mb-2">Stable Build Pipeline</p>
              <h4 className="text-2xl font-black">{latestRelease?.tag_name || `${version.tag} Stable`}</h4>
              <p className="text-xs font-bold text-white/20 uppercase tracking-widest mt-1">Apple Silicon and Intel builds stay in sync with GitHub releases</p>
            </div>
          </motion.div>
        </section>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-5">
          {downloadLinks.length > 0 ? downloadLinks.map((item, i) => (
             <motion.a
               key={item.label}
               href={item.link}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="group relative flex flex-col justify-between rounded-[60px] border border-white/5 bg-white/[0.02] p-12 h-96 transition-all hover:bg-white/[0.05] hover:-translate-y-3 shadow-2xl"
             >
               <div>
                  <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white/5 text-white/40 ring-1 ring-white/10 transition-colors group-hover:bg-sky-500/10 group-hover:text-sky-400 group-hover:ring-sky-500/30">
                    <item.icon size={36} />
                  </div>
                  <h3 className="mb-4 text-2xl font-black uppercase tracking-widest">{item.label}</h3>
                  <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">{item.arch}</p>
                  <p className="mt-4 text-[10px] text-white/10 font-medium truncate max-w-full italic">{item.file}</p>
               </div>

               <div className="flex items-center justify-between mt-auto">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Verified Origin</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-white/10">{item.arch}</span>
                 </div>
                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 opacity-40 transition-all group-hover:opacity-100 group-hover:bg-sky-500 group-hover:text-black">
                   <Download size={24} />
                 </div>
               </div>
             </motion.a>
          )) : (
            [1,2,3,4].map((i) => (
               <div key={i} className="animate-pulse h-96 rounded-[60px] bg-white/5 border border-white/10" />
            ))
          )}
        </div>

        {/* CLOUD CONNECT */}
        <section className="mt-40 rounded-[60px] border border-white/5 bg-gradient-to-br from-[#0a0c14]/60 to-[#03040b] p-12 lg:p-24 overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div>
               <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 sm:text-7xl leading-none">Remote <br /> <span className="text-white/20">Control.</span></h2>
                <p className="text-xl font-medium text-white/40 leading-relaxed max-w-xl mb-12">Install the mobile companion to authorize shell commands, schedule tasks, and view live automation PDF reports from anywhere in the world.</p>

                 <div className="mb-6">
                   <div dangerouslySetInnerHTML={{
                     __html: `<ms-store-badge
                       productid="9nd6wg2rp7cm"
                       productname="Aartiq"
                       window-mode="direct"
                       theme="dark"
                       size="large"
                       language="en-gb"
                       animation="on">
                     </ms-store-badge>`
                   }} />
                 </div>

                <p className="max-w-xl text-sm font-medium leading-relaxed text-white/40">
                  The Android companion ships as an <span className="font-bold text-white/60">.apk</span> you side-load from the
                  downloads page above &mdash; there is no Google Play listing. The iOS build is produced unsigned by CI and is
                  not distributed.
                </p>
             </div>
             
             <div className="relative aspect-video rounded-[3rem] border border-white/10 bg-[#06080f] shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,transparent_70%)] group-hover:opacity-100 opacity-50 transition-opacity" />
                <div className="p-12 h-full flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="h-4 w-4 rounded-full bg-red-500" />
                    <div className="h-4 w-4 rounded-full bg-amber-500" />
                    <div className="h-4 w-4 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-6">
                    <div className="h-6 w-3/4 rounded-full bg-white/5 ring-1 ring-white/10" />
                    <div className="h-6 w-1/2 rounded-full bg-white/5 ring-1 ring-white/10" />
                    <div className="h-32 w-full rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 flex items-center justify-center">
                        <Zap size={40} className="text-sky-400/20" />
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </section>
      </main>
    </div>
  );
}
