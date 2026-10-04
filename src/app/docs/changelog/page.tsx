"use client";

import { motion } from "framer-motion";
import { releases } from "@/lib/release-notes";
import { APP_INFO } from "@/lib/version";
import { useVersion } from "@/lib/useVersion";
import { 
  Rocket, 
  Bug, 
  Wrench, 
  BookOpen, 
  Shield, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Tag
} from "lucide-react";

export default function ChangelogPage() {
  const channelColors = {
    alpha: "bg-sky-500/20 text-sky-400",
    beta: "bg-amber-500/20 text-amber-400",
    stable: "bg-emerald-500/20 text-emerald-400"
  };

  const changeIcons = {
    new: Rocket,
    fix: Bug,
    change: Wrench,
    docs: BookOpen,
    security: Shield
  };

  return (
    <div className="space-y-24">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-5 py-2">
          <Tag size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
            Changelog
          </span>
        </div>
        
        <h1 className="mb-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl lg:text-8xl">
          Changelog
        </h1>
        
        <p className="mx-auto mb-12 max-w-3xl text-xl font-medium leading-relaxed text-white/50">
          Release history for Aartiq. Source data: src/lib/release-notes.ts, GitHub releases
        </p>
      </motion.section>

      {releases.map((release, index) => {
        const isLatest = index === 0;
        const hasChanges = release.changes.new || release.changes.fix || 
                          release.changes.change || release.changes.docs || 
                          release.changes.security;

        return (
          <motion.section
            key={release.version}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative ${isLatest ? '' : 'opacity-60'}`}
          >
            {isLatest && (
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500/50 to-transparent rounded-full" />
            )}
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black uppercase tracking-wider">
                  v{release.version}
                </h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${channelColors[release.channel]}`}>
                  {release.channel}
                </span>
                {isLatest && (
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase">
                    Latest
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 mb-12 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{release.date}</span>
              </div>
              {release.codename && (
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  <span>{release.codename}</span>
                </div>
              )}
            </div>

            {hasChanges ? (
              <div className="space-y-8">
                {release.changes.new && release.changes.new.length > 0 && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-emerald-400 mb-4">
                      <Rocket size={20} /> New Features
                    </h3>
                    <ul className="space-y-3">
                      {release.changes.new.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.changes.fix && release.changes.fix.length > 0 && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-red-400 mb-4">
                      <Bug size={20} /> Bug Fixes
                    </h3>
                    <ul className="space-y-3">
                      {release.changes.fix.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.changes.change && release.changes.change.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-amber-400 mb-4">
                      <Wrench size={20} /> Changes
                    </h3>
                    <ul className="space-y-3">
                      {release.changes.change.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.changes.docs && release.changes.docs.length > 0 && (
                  <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-sky-400 mb-4">
                      <BookOpen size={20} /> Documentation
                    </h3>
                    <ul className="space-y-3">
                      {release.changes.docs.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.changes.security && release.changes.security.length > 0 && (
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-purple-400 mb-4">
                      <Shield size={20} /> Security
                    </h3>
                    <ul className="space-y-3">
                      {release.changes.security.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.superseded?.map((note) => (
                  <div
                    key={note.notedOn}
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"
                  >
                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-amber-400 mb-1">
                      <AlertTriangle size={20} /> Since corrected
                    </h3>
                    <p className="mb-4 text-xs text-white/40">
                      Noted {note.notedOn}
                      {note.changedIn ? ` · behaviour changed in ${note.changedIn}` : ''}. The
                      entries above are left as they were written for this release.
                    </p>
                    <ul className="space-y-3">
                      {note.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 italic">Initial release</p>
            )}
          </motion.section>
        );
      })}
    </div>
  );
}