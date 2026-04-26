import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Target, Zap, MessageCircle, Youtube, ChevronRight } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import StaticBackground from '../components/ui/StaticBackground';

const TEAM_MEMBERS = [
  {
    name: 'BEYOND ZENITH',
    role: 'FOUNDER & DIRECTOR',
    bio: 'Visionary behind Zenith Esports — building Pakistan\'s most competitive and fair PUBG Mobile platform.',
    initial: 'BZ',
  },
];

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

const MILESTONES = [
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
  const { currentTournament } = useTournaments();
  const scrollRef = React.useRef(null);

  // Dynamic Event 8 mapping
  let dynamicMilestones = [...MILESTONES];
  if (currentTournament) {
    const d = new Date(currentTournament.start_date || currentTournament.created_at);
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    dynamicMilestones.push({
      year: year.toString(),
      event: `Event 8: ${currentTournament.title} (Coming Soon - ${month} ${year})`
    });
  } else {
    dynamicMilestones.push({
      year: '2026',
      event: 'Event 8: Coming Soon (April 2026)'
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 animate-page-enter overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative py-48 px-6 lg:px-16 bg-[#0e0e0e] border-b border-white/5 overflow-hidden">
        <StaticBackground variant="mesh" />
        
        {/* Logo Backdrop */}
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
              <p>
                We believe the future of Pakistani esports depends on a reliable foundation. Competitive gaming requires more than just high skill—it requires an arena built on trust and transparency.
              </p>
              <p>
                Founded in 2021, we have consistently focused on technical quality. We don't just host matches; we provide a professional ecosystem where hard work meets opportunity.
              </p>
              <div className="pt-8 border-t border-white/5">
                 <p className="font-bebas text-3xl tracking-tight text-white uppercase mb-1">PART OF BEYOND ZENITH</p>
                 <p className="font-teko text-[16px] tracking-widest text-[#dbb462] uppercase font-bold">Performance & Operations Unit</p>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden border border-white/5 bg-[#111]">
             <div className="absolute inset-0 bg-[#dbb462]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative aspect-video md:aspect-square flex items-center justify-center p-12 md:p-20">
                <img 
                  src="/logo.png" 
                  alt="Zenith" 
                  className="w-1/2 md:w-full h-auto md:h-full object-contain grayscale opacity-20 filter transition-all duration-[2s] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
             </div>
          </div>
        </div>
      </section>

      {/* ── THE CHRONICLE (HORIZONTAL TIMELINE) ── */}
      <section className="py-40 bg-[#0e0e0e] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/30 to-transparent" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 px-6 lg:px-16 mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="font-teko text-[18px] font-medium tracking-[0.2em] text-[#dbb462] block mb-4 uppercase">Operational History</span>
              <h2 className="font-bebas text-7xl md:text-9xl tracking-tight uppercase leading-none zenith-gradient-text pr-2">THE CHRONICLE</h2>
            </div>
            <div className="flex items-center gap-4 text-[#dbb462]/40 font-teko text-sm tracking-[0.3em] uppercase">
              <span>Shift to reveal legacy</span>
              <div className="w-12 h-px bg-[#dbb462]/20" />
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto pb-20 px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2))] snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-x"
        >
          {dynamicMilestones.map((m, i) => (
            <div 
              key={i} 
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[400px] snap-center group"
            >
              <div className="bg-[#111] border border-white/5 p-12 h-full hover:border-[#dbb462]/40 transition-all duration-500 relative overflow-hidden">
                {/* Background Scanline Animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#dbb462]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-full h-1 bg-[#dbb462] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                
                <div className="relative z-10">
                  <span className="font-bebas text-6xl text-[#dbb462] block mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                    {m.year}
                  </span>
                  <div className="w-12 h-[1px] bg-[#dbb462]/20 mb-6" />
                  <p className="font-body text-xl text-[#d1c5b3] opacity-50 group-hover:opacity-100 leading-relaxed transition-all duration-500 italic">
                    "{m.event}"
                  </p>
                </div>

                {/* Tactical Corner Accents */}
                <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-[#dbb462]/20 group-hover:border-[#dbb462]/60 transition-colors" />
              </div>
            </div>
          ))}
          {/* Spacer for end scroll */}
          <div className="min-w-[200px] h-1" />
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-48 px-6 lg:px-16 text-center bg-[#0a0a0a] relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="font-bebas text-7xl md:text-[140px] tracking-tight mb-10 leading-[0.8] uppercase">
            BUILD YOUR<br />
            <span className="zenith-gradient-text pr-2">LEGACY</span>
          </h2>
          <p className="font-body text-[#d1c5b3] text-xl opacity-40 mb-16 leading-relaxed">
            Every professional squad started somewhere. Join our circuit today and take your first step toward world-class competition.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              to="/auth"
              className="btn-obsidian-primary font-bebas text-3xl px-16 py-6 tracking-widest uppercase"
            >
              ACCESS THE CIRCUIT
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
