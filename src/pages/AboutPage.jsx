import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Target, Zap, ChevronRight } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';

const VALUES = [
  {
    icon: Trophy,
    title: 'EXCELLENCE',
    desc: 'Every tournament runs at the highest competitive standard — verified teams, fair brackets, transparent results.',
  },
  {
    icon: Users,
    title: 'COMMUNITY',
    desc: "Zenith exists for Pakistan's players. From Karachi to Peshawar, every squad gets an equal shot.",
  },
  {
    icon: Target,
    title: 'INTEGRITY',
    desc: 'All registrations are admin-verified. Every decision is documented. Fair play starts with honest administration.',
  },
  {
    icon: Zap,
    title: 'INNOVATION',
    desc: 'Real-time dashboards, automated group assignments, and live streaming integration — built for modern esports.',
  },
];

const STATIC_MILESTONES = [
  { year: '2021', event: 'Established on 6th June, 2021.' },
  { year: '2022', event: 'PUBG Mobile Championship Series (January, 2022)' },
  { year: '2022', event: 'Firebird Championship (March 2022)' },
  { year: '2022', event: 'The Grind (April 2022)' },
  { year: '2022', event: 'Pakistan National Series (May 2022)' },
  { year: '2023', event: 'Madmax Season 3 (February, 2023)' },
  { year: '2026', event: 'Zenith Revival (February, 2026)' },
  { year: '2026', event: 'Zenith Showdown Season 1 (March 2026)' },
];

export default function AboutPage() {
  const { tournaments } = useTournaments();
  const [activeYear, setActiveYear] = useState(null);

  const sortedTournaments = [...tournaments].sort((a, b) => {
    const da = new Date(a.start_date || a.created_at);
    const db = new Date(b.start_date || b.created_at);
    return da - db;
  });

  const dynamicMilestones = [...STATIC_MILESTONES];
  sortedTournaments.forEach((t) => {
    const d = new Date(t.start_date || t.created_at);
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    dynamicMilestones.push({ year: year.toString(), event: `${t.title} (${month} ${year})` });
  });

  const grouped = {};
  dynamicMilestones.forEach((m) => {
    if (!grouped[m.year]) grouped[m.year] = [];
    grouped[m.year].push(m.event);
  });
  const years = Object.keys(grouped);
  const selectedYear = activeYear || years[years.length - 1];

  return (
    <div className="min-h-screen bg-[#0a0a0a] animate-page-enter overflow-x-hidden">

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section className="relative pt-36 pb-28 border-b border-white/[0.05] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#dbb462]/[0.05] blur-[160px] pointer-events-none z-0" />
        {/* Watermark logo */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-[0.015] pointer-events-none select-none">
          <img src="/logo.png" alt="" className="w-[40vw] max-w-[500px] h-auto object-contain" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 lg:px-16 relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-[2px] bg-[#dbb462]" />
            <span className="font-teko text-[13px] tracking-[0.3em] text-[#dbb462] uppercase">
              Our Journey
            </span>
          </div>

          <h1 className="font-bebas uppercase leading-[0.85] tracking-tight select-none">
            <span className="block text-[clamp(4rem,10vw,8rem)] text-[#f2f2f2] leading-none">BEYOND THE</span>
            <span className="block text-[clamp(4rem,10vw,8rem)] zenith-gradient-text leading-none">COMPETITION</span>
          </h1>

          <p className="font-teko text-[#d1c5b3] text-[18px] opacity-45 max-w-2xl mt-8 tracking-[0.07em] leading-relaxed uppercase">
            Zenith Esports is Pakistan's premier platform for competitive PUBG Mobile.
            We build the environment where every squad has a fair chance to build their legacy.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MISSION
          ══════════════════════════════════════ */}
      <section className="border-b border-white/[0.05] relative z-10">
        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">

            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-[2px] bg-[#dbb462]" />
                <span className="font-teko text-[13px] tracking-[0.3em] text-[#dbb462] uppercase">
                  Mission Briefing
                </span>
              </div>
              <h2 className="font-bebas uppercase leading-[0.85] tracking-tight">
                <span className="block text-[clamp(3rem,7vw,5.5rem)] text-[#f2f2f2] leading-none">FAIR PLAY.</span>
                <span className="block text-[clamp(3rem,7vw,5.5rem)] zenith-gradient-text leading-none">PURE SKILL.</span>
              </h2>
              <div className="mt-8 space-y-5 border-l border-white/[0.06] pl-6">
                <p className="font-teko text-[17px] text-[#d1c5b3] opacity-50 tracking-[0.07em] leading-relaxed uppercase">
                  We believe the future of Pakistani esports depends on a reliable foundation.
                  Competitive gaming requires more than high skill — it needs an arena built on trust.
                </p>
                <p className="font-teko text-[17px] text-[#d1c5b3] opacity-50 tracking-[0.07em] leading-relaxed uppercase">
                  Founded in 2021, we've consistently focused on technical quality. We don't just host
                  matches; we provide a professional ecosystem where hard work meets opportunity.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden border border-white/[0.06] bg-[#0e0e0e]">
              <div className="absolute top-0 left-0 right-0 h-[2px] zenith-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <div className="aspect-square flex items-center justify-center p-16">
                <img
                  src="/logo.png"
                  alt="Zenith"
                  className="w-full h-full object-contain grayscale opacity-15 transition-all duration-[2s] group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CORE VALUES
          ══════════════════════════════════════ */}
      <section className="border-b border-white/[0.05] relative z-10">
        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-[2px] bg-[#dbb462]" />
            <h2 className="font-bebas text-[2.25rem] text-[#f2f2f2] tracking-[0.12em] uppercase leading-none">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.04]">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#0a0a0a] p-8 lg:p-10 group relative overflow-hidden hover:bg-[#0d0d0d] transition-colors"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] zenith-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-[#dbb462]/30 transition-colors mt-1">
                    <Icon size={18} className="text-[#dbb462] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-2xl text-[#f2f2f2] tracking-wider uppercase mb-3 leading-none">
                      {title}
                    </h3>
                    <p className="font-teko text-[16px] text-[#d1c5b3] opacity-45 tracking-[0.06em] leading-relaxed uppercase">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          THE CHRONICLE — Interactive Timeline
          ══════════════════════════════════════ */}
      <section className="border-b border-white/[0.05] relative z-10 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-[2px] bg-[#dbb462]" />
            <h2 className="font-bebas text-[2.25rem] zenith-gradient-text tracking-[0.12em] uppercase leading-none">
              The Chronicle
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">

            {/* Year selector */}
            <div className="lg:col-span-3">
              <div className="flex flex-row lg:flex-col gap-[1px] bg-white/[0.04] overflow-x-auto lg:overflow-visible no-scrollbar">
                {years.map((yr) => {
                  const isActive = yr === selectedYear;
                  return (
                    <button
                      key={yr}
                      onClick={() => setActiveYear(yr)}
                      className={`relative text-left px-6 py-5 transition-all duration-300 group flex-shrink-0 ${
                        isActive
                          ? 'bg-[#dbb462]/[0.06] border-l-2 border-[#dbb462]'
                          : 'bg-[#0a0a0a] border-l-2 border-transparent hover:bg-[#0d0d0d]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className={`font-bebas text-4xl tracking-tight leading-none transition-colors ${
                          isActive ? 'text-[#dbb462]' : 'text-[#f2f2f2] opacity-30 group-hover:opacity-60'
                        }`}>
                          {yr}
                        </span>
                        <span className={`font-teko text-[11px] tracking-[0.2em] uppercase transition-all ${
                          isActive ? 'text-[#dbb462] opacity-70' : 'text-[#d1c5b3] opacity-0 group-hover:opacity-30'
                        }`}>
                          {grouped[yr].length}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Events panel */}
            <div className="lg:col-span-9 lg:pl-14">
              <div className="mb-8">
                <span className="font-bebas text-[7rem] leading-none text-white/[0.03] select-none">
                  {selectedYear}
                </span>
              </div>

              <div className="flex flex-col gap-[1px] bg-white/[0.04]">
                {grouped[selectedYear]?.map((evt, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0a0a0a] flex items-center gap-6 px-7 py-5 group relative hover:bg-[#0d0d0d] transition-colors overflow-hidden"
                    style={{ animation: `fadeIn 0.35s ease-out ${idx * 60}ms both` }}
                  >
                    <div className="absolute bottom-0 left-0 h-[1px] w-0 zenith-gradient group-hover:w-full transition-all duration-500" />
                    <span className="font-bebas text-2xl text-[#dbb462] opacity-20 w-8 flex-shrink-0 group-hover:opacity-50 transition-opacity">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-teko text-[17px] text-[#d1c5b3] opacity-55 tracking-[0.06em] uppercase flex-1 group-hover:opacity-90 transition-opacity leading-relaxed">
                      {evt}
                    </p>
                    <div className="w-2 h-2 border border-[#dbb462]/20 flex-shrink-0 group-hover:bg-[#dbb462] group-hover:border-[#dbb462] transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
          ══════════════════════════════════════ */}
      <section className="relative z-10">
        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28">
          <div className="border border-white/[0.05] p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] zenith-gradient" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#dbb462]/[0.04] blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              <div>
                <span className="font-teko text-[13px] tracking-[0.3em] text-[#dbb462] uppercase block mb-6">
                  Ready to Compete?
                </span>
                <h2 className="font-bebas uppercase leading-[0.85]">
                  <span className="block text-[clamp(3rem,6vw,4.5rem)] text-[#f2f2f2]">JOIN ZENITH</span>
                  <span className="block text-[clamp(3rem,6vw,4.5rem)] zenith-gradient-text">ESPORTS</span>
                </h2>
                <p className="font-teko text-[17px] text-[#d1c5b3] opacity-45 max-w-md mt-4 tracking-[0.07em] uppercase">
                  Every professional team started somewhere. Register today and take your first step into competitive gaming.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <Link
                  to="/auth"
                  className="btn-obsidian-primary font-bebas text-[20px] px-10 py-5 tracking-[0.15em] uppercase inline-flex items-center gap-3"
                >
                  REGISTER NOW <ChevronRight size={18} />
                </Link>
                <Link
                  to="/tournaments"
                  className="btn-obsidian-ghost font-bebas text-[20px] px-10 py-5 tracking-[0.15em] uppercase"
                >
                  VIEW EVENTS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
