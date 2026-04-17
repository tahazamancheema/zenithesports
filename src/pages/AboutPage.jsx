import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Target, Zap, MessageCircle, Youtube } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import InteractiveBackground from '../components/ui/InteractiveBackground';
import GeometryBackground from '../components/ui/GeometryBackground';

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
    <div className="min-h-screen bg-[#131313] pt-20 animate-page-enter">

      {/* ── HERO ── */}
      <section className="relative py-28 px-6 md:px-12 overflow-hidden bg-[#1b1b1b]">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80&fm=webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] via-[#1b1b1b]/50 to-transparent" />
        <InteractiveBackground />
        <div className="relative z-10 max-w-4xl">
          <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">
            WHO WE ARE
          </span>
          <h1 className="font-agency text-7xl md:text-9xl font-black italic tracking-tighter leading-none mb-6 text-[#e2e2e2]">
            ABOUT<br /><span className="zenith-gradient-text">ZENITH ESPORTS</span>
          </h1>
          <p className="text-[#d1c5b3] text-xl opacity-70 max-w-2xl leading-relaxed">
            We are Pakistan's premier PUBG Mobile esports organization — built from the ground up for Pakistani players, by Pakistani players. Our mission is simple: give every talented team a fair shot at championship glory.
          </p>
        </div>
      </section>


      {/* ── OUR STORY ── */}
      <section className="py-24 px-6 md:px-12 bg-[#131313]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">OUR STORY</span>
            <h2 className="font-agency text-5xl font-black italic tracking-tighter mb-6">
              BORN FROM PAKISTAN'S COMPETITIVE SPIRIT
            </h2>
            <p className="text-[#d1c5b3] opacity-60 leading-relaxed text-base mb-6">
              <strong className="font-bold text-[#e2e2e2]">Zenith Esports</strong> was founded with one goal — to create a structured, professional esports ecosystem for Pakistan's rapidly growing PUBG Mobile community. Before <strong className="font-bold text-[#e2e2e2]">Zenith Esports</strong>, talented teams had no reliable platform to compete, get recognized, or win real prize money.
            </p>
            <p className="text-[#d1c5b3] opacity-60 leading-relaxed text-base mb-6">
              We changed that. Today, <strong className="font-bold text-[#e2e2e2]">Zenith Esports</strong> hosts regular open tournaments, verifies every registered team, streams matches live on YouTube, and distributes prizes fairly across Pakistan — from Karachi to Islamabad, Lahore to Peshawar.
            </p>
            <p className="text-[#d1c5b3] opacity-60 leading-relaxed text-base">
              <strong className="font-bold text-[#e2e2e2]">Zenith Esports</strong> is a project of <span className="text-[#f9d07a] font-bold">Beyond Zenith</span> — a Pakistan-based esports management organization committed to professionalizing competitive gaming in South Asia.
            </p>
          </div>
          <div className="relative">
            <img
              src="/image-2.jpeg"
              alt="PUBG Mobile Pakistan esports"
              loading="lazy"
              decoding="async"
              className="w-full h-96 object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-stretch text-[8px] text-[#f9d07a]">BEYOND ZENITH</p>
              <h4 className="font-agency text-2xl font-black italic tracking-tighter">PAKISTAN ESPORTS</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6 md:px-12 bg-[#1b1b1b]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-3">WHAT DRIVES US</span>
            <h2 className="font-agency text-5xl font-black italic tracking-tighter">OUR CORE VALUES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-[rgba(78,70,56,0.1)]">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#1b1b1b] p-8 hover:bg-[#2a2a2a] transition-colors group">
                <div className="w-12 h-12 bg-[#0e0e0e] flex items-center justify-center mb-6 group-hover:bg-[#dbb462] transition-colors">
                  <Icon size={20} className="text-[#dbb462] group-hover:text-[#402d00] transition-colors" />
                </div>
                <h3 className="font-agency text-xl font-bold italic tracking-tight mb-3">{title}</h3>
                <p className="text-[#d1c5b3] opacity-50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILESTONES ── */}
      <section className="relative py-32 overflow-hidden bg-[#131313]">
        {/* Dynamic Evolving Geometry Background */}
        <GeometryBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313] via-transparent to-[#131313] z-10 pointer-events-none" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-20 text-center">
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4 animate-pulse">THE LEGACY</span>
            <h2 className="font-agency text-5xl md:text-7xl font-black italic tracking-tighter text-[#e2e2e2]">OUR JOURNEY</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 group">
            {dynamicMilestones.map(({ year, event }, i) => (
              <div 
                key={i} 
                className="relative bg-[rgba(31,31,31,0.6)] backdrop-blur-md p-8 border border-[rgba(219,180,98,0.1)] hover:border-[#dbb462] hover:bg-[#1f1f1f] transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer shadow-lg"
              >
                {/* Background Accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#dbb462] opacity-5 blur-3xl group-hover:opacity-20 transition-opacity" />
                
                <div className="absolute top-4 right-4 opacity-5">
                  <span className="font-agency text-7xl font-black italic">{year.substring(2)}</span>
                </div>
                
                <span className="inline-block px-3 py-1 bg-[#131313] border border-[#dbb462]/30 font-stretch text-[9px] text-[#dbb462] tracking-[0.2em] mb-6 shadow-[0_0_10px_rgba(219,180,98,0.1)]">
                  {year}
                </span>
                
                <p className="text-[#d1c5b3] text-sm leading-relaxed relative z-10 font-body opacity-80 group-hover:opacity-100 transition-opacity">
                  {event}
                </p>
                
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#dbb462] to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 md:px-12 bg-[#1b1b1b] text-center">
        <h2 className="font-agency text-5xl font-black italic tracking-tighter mb-4">READY TO COMPETE?</h2>
        <p className="text-[#d1c5b3] opacity-60 mb-10 max-w-md mx-auto">
          Join thousands of Pakistani PUBG Mobile players competing for glory and prize money on <strong className="font-bold text-[#e2e2e2]">Zenith Esports</strong>.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/auth"
            className="zenith-gradient text-[#402d00] font-stretch text-xs px-10 py-5 tracking-widest hover:brightness-110 transition-all"
          >
            JOIN NOW
          </Link>
          <Link
            to="/contact"
            className="border border-[rgba(78,70,56,0.5)] text-[#e2e2e2] font-stretch text-xs px-10 py-5 tracking-widest hover:bg-[#2a2a2a] transition-all"
          >
            CONTACT US
          </Link>
        </div>
      </section>

    </div>
  );
}
