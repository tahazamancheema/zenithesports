import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Target, Zap, ChevronRight } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import StaticBackground from '../components/ui/StaticBackground';

const VALUES = [
  {
    icon: Trophy,
    title: 'EXCELLENCE',
    desc: 'We hold every tournament to the highest competitive standards — fair brackets, verified teams, and transparent results.',
  },
  {
    icon: Users,
    title: 'COMMUNITY',
    desc: 'Zenith exists for Pakistan\'s players. From Karachi to Peshawar, every team gets an equal shot at glory.',
  },
  {
    icon: Target,
    title: 'INTEGRITY',
    desc: 'All registrations are admin-verified. Every decision is documented. We believe fair play starts with honest administration.',
  },
  {
    icon: Zap,
    title: 'INNOVATION',
    desc: 'Built on modern technology — real-time dashboards, automated group assignments, and live streaming integration.',
  },
];

const STATIC_MILESTONES = [
  { year: '2021', event: 'Established on 6th June, 2021.' },
  { year: '2022', event: 'Event 1: PUBG Mobile Championship Series (January, 2022)' },
  { year: '2022', event: 'Event 2: Firebird Championship (March 2022)' },
  { year: '2022', event: 'Event 3: The Grind (April 2022)' },
  { year: '2022', event: 'Event 4: Pakistan National Series (May 2022)' },
  { year: '2023', event: 'Event 5: Madmax Season 3 (Feburary, 2023)' },
  { year: '2026', event: 'Event 6: Zenith Revival (Feburary, 2026)' },
  { year: '2026', event: 'Event 7: Zenith Showdown Season 1 (March 2026)' },
];

export default function AboutPage() {
  const { tournaments } = useTournaments();
  const [activeYear, setActiveYear] = useState(null);

  // Build dynamic milestones from tournaments in the database
  // Sort tournaments by start_date ascending so they appear in chronological order
  const sortedTournaments = [...tournaments].sort((a, b) => {
    const da = new Date(a.start_date || a.created_at);
    const db = new Date(b.start_date || b.created_at);
    return da - db;
  });

  const dynamicMilestones = [...STATIC_MILESTONES];
  sortedTournaments.forEach((t, idx) => {
    const d = new Date(t.start_date || t.created_at);
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    dynamicMilestones.push({
      year: year.toString(),
      event: `Event ${8 + idx}: ${t.title} (${month} ${year})`,
    });
  });

  // Group milestones by year
  const grouped = {};
  dynamicMilestones.forEach((m) => {
    if (!grouped[m.year]) grouped[m.year] = [];
    grouped[m.year].push(m.event);
  });
  const years = Object.keys(grouped);

  // Default to last year (most recent)
  const selectedYear = activeYear || years[years.length - 1];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 animate-page-enter overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative py-48 px-6 lg:px-16 bg-[#0e0e0e] border-b border-white/5 overflow-hidden">
        <StaticBackground variant="mesh" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
           <img src="/logo.png" alt="" className="w-full max-w-4xl h-auto object-contain" />
        </div>
        <div className="relative z-10 container mx-auto max-w-7xl text-left">
          <div className="flex items-center justify-start gap-4 mb-8">
            <div className="w-12 h-[2px] bg-[#dbb462]" />
            <span className="font-teko text-[#dbb462] text-[18px] md:text-[20px] tracking-[0.2em] font-medium uppercase">OUR JOURNEY</span>
          </div>
          <h1 className="font-bebas text-7xl md:text-[140px] tracking-tight mb-8 select-none leading-[0.9] md:leading-[0.8] uppercase">
            BEYOND THE<br />
            <span className="zenith-gradient-text pr-2">COMPETITION</span>
          </h1>
          <p className="font-body text-[#d1c5b3] text-lg md:text-2xl opacity-40 max-w-2xl leading-relaxed">
            Zenith Esports is Pakistan's premier platform for competitive PUBG Mobile. We build the environment where every squad has a fair chance to build their legacy.
          </p>
        </div>
      </section>

      {/* ── OUR MISSION ── */}
      <section className="py-24 md:py-40 px-6 lg:px-16 container mx-auto max-w-7xl relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#dbb462]/5 blur-[100px] md:blur-[160px] rounded-full pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
          <div className="text-left">
            <span className="font-teko text-[18px] font-medium tracking-[0.2em] text-[#dbb462] block mb-6 uppercase">Mission Briefing</span>
            <h2 className="font-bebas text-6xl md:text-9xl tracking-tight mb-8 leading-[0.9] md:leading-[0.85] uppercase">
              FAIR PLAY.<br />
              <span className="zenith-gradient-text pr-2">PURE SKILL.</span>
            </h2>
            <div className="space-y-6 md:space-y-8 font-body text-[#d1c5b3] opacity-40 text-lg md:text-xl leading-relaxed">
              <p>We believe the future of Pakistani esports depends on a reliable foundation. Competitive gaming requires more than just high skill—it requires an arena built on trust and transparency.</p>
              <p>Founded in 2021, we have consistently focused on technical quality. We don't just host matches; we provide a professional ecosystem where hard work meets opportunity.</p>
            </div>
          </div>
          <div className="relative group overflow-hidden border border-white/5 bg-[#111]">
             <div className="absolute inset-0 bg-[#dbb462]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative aspect-video md:aspect-square flex items-center justify-center p-12 md:p-20">
                <img src="/logo.png" alt="Zenith" className="w-1/2 md:w-full h-auto md:h-full object-contain grayscale opacity-20 filter transition-all duration-[2s] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" />
             </div>
          </div>
        </div>
      </section>

      {/* ── THE CHRONICLE — Interactive Timeline ── */}
      <section className="py-28 md:py-40 bg-[#0e0e0e] border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10 px-6 lg:px-16">
          {/* Header */}
          <div className="mb-16 md:mb-24">
            <span className="font-teko text-[18px] font-medium tracking-[0.2em] text-[#dbb462] block mb-4 uppercase">Operational History</span>
            <h2 className="font-bebas text-7xl md:text-9xl tracking-tight uppercase leading-none zenith-gradient-text pr-2">THE CHRONICLE</h2>
          </div>

          {/* Interactive Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">
            
            {/* Year Selector (Left) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="flex lg:flex-col gap-2">
                {years.map((yr, i) => {
                  const isActive = yr === selectedYear;
                  return (
                    <button
                      key={yr + i}
                      onClick={() => setActiveYear(yr)}
                      className={`
                        relative text-left px-6 py-5 transition-all duration-400 group/yr
                        ${isActive
                          ? 'bg-[#dbb462]/[0.06] border border-[#dbb462]/30'
                          : 'bg-transparent border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.02]'
                        }
                      `}
                    >
                      {/* Active indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#dbb462] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                      
                      <div className="flex items-center justify-between">
                        <span className={`font-bebas text-4xl md:text-5xl tracking-tight transition-colors duration-300 ${isActive ? 'text-[#dbb462]' : 'text-[#f2f2f2] opacity-30 group-hover/yr:opacity-60'}`}>
                          {yr}
                        </span>
                        <span className={`font-teko text-[13px] tracking-[0.2em] uppercase transition-all duration-300 ${isActive ? 'text-[#dbb462] opacity-80' : 'text-[#d1c5b3] opacity-0 group-hover/yr:opacity-30'}`}>
                          {grouped[yr].length} {grouped[yr].length === 1 ? 'EVENT' : 'EVENTS'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Panel (Right) */}
            <div className="lg:col-span-8 xl:col-span-9 lg:pl-12 xl:pl-16">
              {/* Year display */}
              <div className="mb-10 flex items-end gap-6">
                <span className="font-bebas text-[120px] md:text-[180px] leading-none text-white/[0.04] select-none">{selectedYear}</span>
              </div>

              {/* Events List */}
              <div className="space-y-0">
                {grouped[selectedYear]?.map((evt, idx) => (
                  <div
                    key={idx}
                    className="group relative border-b border-white/[0.04] last:border-b-0"
                    style={{ animation: `fadeIn 0.4s ease-out ${idx * 80}ms both` }}
                  >
                    <div className="flex gap-6 py-8 items-start">
                      {/* Index number */}
                      <span className="font-bebas text-3xl text-[#dbb462] opacity-30 leading-none pt-1 min-w-[40px]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      
                      {/* Event content */}
                      <div className="flex-1">
                        <p className="font-body text-xl md:text-2xl text-[#d1c5b3] leading-relaxed group-hover:text-[#f2f2f2] transition-colors duration-300">
                          {evt}
                        </p>
                      </div>

                      {/* Dot indicator */}
                      <div className="w-3 h-3 border border-[#dbb462]/30 mt-2.5 group-hover:bg-[#dbb462] group-hover:border-[#dbb462] transition-all duration-300 shrink-0" />
                    </div>

                    {/* Gold line that slides in on hover */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#dbb462]/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-32 px-6 lg:px-16 text-center bg-[#0a0a0a] relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="font-agency font-bold text-6xl md:text-8xl tracking-tight mb-6 leading-none uppercase">
            Join Zenith<br />
            <span className="zenith-gradient-text pr-2">Esports</span>
          </h2>
          <p className="font-body text-[#d1c5b3] text-xl opacity-60 mb-12 leading-relaxed">
            Every professional team started somewhere. Register today and take your first step into competitive gaming.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/auth" className="bg-[#dbb462] hover:bg-[#e9c16e] text-[#111] font-agency font-bold text-2xl px-12 py-4 uppercase transition-colors">
              Register Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
