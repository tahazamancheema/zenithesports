import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Star, Trophy, Users, Clock, Calendar, Zap } from 'lucide-react';
import LiveStatus from '../components/LiveStatus';
import StatStrip from '../components/StatStrip';
import StaticBackground from '../components/ui/StaticBackground';
import { useTournaments } from '../hooks/useTournaments';
import { usePlatformStats } from '../hooks/usePlatformStats';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase/config';

import RegistrationCountdown from '../components/RegistrationCountdown';

export default function LandingPage() {
  const { currentTournament } = useTournaments();
  const { user } = useAuth();
  const platformStats = usePlatformStats();
  const [approvedCount, setApprovedCount] = useState(0);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    if (!currentTournament?.id) return;
    
    supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('tournament_id', currentTournament.id)
      .eq('status', 'approved')
      .then(({ count }) => setApprovedCount(count || 0));

    if (user?.id) {
      supabase
        .from('registrations')
        .select('id')
        .eq('tournament_id', currentTournament.id)
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => setIsUserRegistered(!!data));
    }
  }, [currentTournament?.id, user?.id]);

  const maxTeams = currentTournament?.max_teams || 64;
  const fillPct = Math.min((approvedCount / maxTeams) * 100, 100);
  const isOpen = currentTournament?.status === 'active';

  const prizeFormatted = currentTournament?.prize_pool
    ? `PKR ${Number(currentTournament.prize_pool).toLocaleString('en-PK')}`
    : null;

  return (
    <div className="animate-page-enter bg-[#131313] overflow-x-hidden">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center pt-20">
        <StaticBackground variant="mesh" />
        
        {/* Ambient Hero Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#dbb462]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full px-6 lg:px-16 container mx-auto">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[2px] bg-[#dbb462]" />
              <span className="font-teko text-[#dbb462] text-[18px] tracking-[0.2em] font-medium uppercase">
                ZENITH ESPORTS &bull; COMPETITIVE ECOSYSTEM
              </span>
            </div>

            <h1 className="hero-text-huge mb-10 select-none leading-[0.85] uppercase tracking-tight">
              PAKISTAN'S PREMIER<br />
              <span className="zenith-gradient-text pr-2">TOURNAMENT CIRCUIT</span>
            </h1>

            <p className="font-body text-[#d1c5b3] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed opacity-60">
              Technical, reliable, and high-quality tournaments for serious PUBG Mobile squads. We provide the infrastructure for you to compete at the highest level.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link 
                to={user ? "/profile" : "/auth"} 
                className="btn-obsidian-primary font-bebas text-2xl px-12 py-5 tracking-widest inline-flex items-center gap-4 uppercase"
              >
                {user ? 'MY DASHBOARD' : 'JOIN THE CIRCUIT'} <ChevronRight size={24} />
              </Link>
              <Link 
                to="/tournaments" 
                className="btn-obsidian-ghost font-bebas text-2xl px-12 py-5 tracking-widest uppercase"
              >
                BROWSE EVENTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <StatStrip />

      {/* ── LIVE DATA ── */}
      <LiveStatus />

      {/* ── FEATURED TOURNAMENT ── */}
      {currentTournament && (
        <section className="relative py-32 px-6 lg:px-16 border-t border-white/5 bg-[#0e0e0e]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dbb462]/30 to-transparent" />
          
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left: Info */}
              <div className="lg:col-span-7">
                <div className="mb-12">
                  <span className="inline-block font-teko text-[16px] text-[#dbb462] mb-6 px-4 py-1.5 border border-[#dbb462]/20 bg-[#dbb462]/5 tracking-widest uppercase">
                    Ongoing Tournament
                  </span>
                  <h2 className="font-bebas text-7xl md:text-9xl mb-8 leading-[0.8] uppercase tracking-tight zenith-gradient-text pr-2">
                    {currentTournament.title}
                  </h2>
                  <p className="font-body text-[#d1c5b3] text-xl opacity-50 leading-relaxed max-w-2xl">
                    {currentTournament.description || "The next evolution of competitive PUBG Mobile. Secure your team's slot and prepare for the current circuit."}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                   <MetricBox label="PRIZE DISTRIBUTION" value={prizeFormatted || 'TBA'} gold />
                   <MetricBox label="No. of Teams" value={`${maxTeams} TEAMS`} />
                   <MetricBox label="START DATE" value={currentTournament.start_date ? new Date(currentTournament.start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
                   <MetricBox label="DEADLINE" value={currentTournament.registration_deadline ? new Date(currentTournament.registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between font-teko text-[16px] tracking-widest text-[#dbb462] uppercase">
                    <span>{approvedCount} Teams Verified</span>
                    <span>{Math.round(fillPct)}% Capacity</span>
                  </div>
                  <div className="h-1.5 bg-white/5 relative overflow-hidden">
                    <div 
                      className="absolute left-0 inset-y-0 zenith-gradient transition-all duration-1000"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Action Card */}
              <div className="lg:col-span-5">
                <div className="bg-[#111] p-10 border border-white/5 relative overflow-hidden group hover:border-[#dbb462]/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="relative z-10 space-y-10 text-center md:text-left">
                    <RegistrationCountdown 
                      openDate={currentTournament.registration_open_date}
                      deadlineDate={currentTournament.registration_deadline}
                    />

                    <div className="pt-10 border-t border-white/5 space-y-4">
                      {isOpen && !isUserRegistered ? (
                        <Link
                          to={user ? `/register/${currentTournament.id}` : "/auth"}
                          className="btn-obsidian-primary w-full py-5 text-2xl tracking-[0.2em]"
                        >
                          REGISTER TEAM
                        </Link>
                      ) : (
                        <div className="w-full text-center bg-white/5 text-[#d1c5b3]/30 font-bebas text-2xl py-5 tracking-widest uppercase">
                          {isUserRegistered ? 'ALREADY REGISTERED' : 'REGISTRATION CLOSED'}
                        </div>
                      )}
                      
                      <Link
                        to={`/tournaments/${currentTournament.id}`}
                        className="btn-obsidian-ghost w-full py-5 text-2xl tracking-widest uppercase"
                      >
                        VIEW DETAILS <ChevronRight size={22} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CORE FEATURES ── */}
      <section className="py-40 px-6 lg:px-16 bg-[#131313] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="font-teko text-[18px] font-medium tracking-[0.2em] text-[#dbb462] block mb-2 uppercase">Why Compete With Us</span>
              <h2 className="font-bebas text-7xl md:text-9xl tracking-tight mb-10 leading-[0.85] uppercase">
                PROFESSIONAL<br />
                <span className="zenith-gradient-text pr-2">TOURNAMENT QUALITY</span>
              </h2>
              <p className="font-body text-[#d1c5b3] opacity-40 leading-relaxed text-xl mb-12 max-w-xl">
                We focus on technical excellence and competitive fairness. Every tournament is run with strict rules to ensure the best experience for every team.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: 'Strict Integrity', desc: 'No shortcuts. We manually verify every player and character ID to ensure a fair battlefield for everyone.' },
                  { title: 'High-End Broadcast', desc: 'Watch your matches with professional production. We use high-fidelity streams to showcase your gameplay.' },
                  { title: 'Technical Brackets', desc: 'No manual bias. Our system handles group distribution and brackets automatically using tournament-grade logic.' },
                  { title: 'Fast Settlements', desc: 'We value your time. Prize distributions are handled quickly once results are verified and finalized.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="group">
                    <h4 className="font-bebas text-3xl tracking-tight text-[#f2f2f2] mb-3 group-hover:text-[#dbb462] transition-colors uppercase">{title}</h4>
                    <p className="font-body text-base text-[#d1c5b3] opacity-40 group-hover:opacity-100 transition-opacity leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="relative aspect-square bg-[#0e0e0e] border border-white/5 flex items-center justify-center p-20 overflow-hidden">
                 <div className="absolute inset-0 bg-[#dbb462]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <img
                  src="/logo.png"
                  alt="Zenith"
                  className="w-full h-full object-contain filter grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function MetricBox({ label, value, gold }) {
  return (
    <div className="bg-[#1b1b1b] border border-white/5 p-5 group hover:border-[#dbb462]/30 transition-all">
      <p className="font-body text-[10px] tracking-wider text-[#d1c5b3] opacity-60 mb-2 uppercase">{label}</p>
      <p className={`font-agency text-xl font-bold leading-none ${gold ? 'text-[#dbb462]' : 'text-[#f2f2f2]'}`}>
        {value}
      </p>
    </div>
  );
}
