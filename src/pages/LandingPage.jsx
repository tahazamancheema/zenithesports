import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Tv, GitBranch, Banknote, ArrowRight, Trophy, Calendar } from 'lucide-react';
import LiveStatus from '../components/LiveStatus';
import { useTournaments } from '../hooks/useTournaments';
import { usePlatformStats } from '../hooks/usePlatformStats';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase/config';

import RegistrationCountdown from '../components/RegistrationCountdown';
import heroBg from '../assets/images/hero-bg.png';

export default function LandingPage() {
  const { currentTournament, openRegistrations } = useTournaments();
  const { user } = useAuth();
  const platformStats = usePlatformStats();
  const [approvedCounts, setApprovedCounts] = useState({});
  const [userRegStatuses, setUserRegStatuses] = useState({});

  useEffect(() => {
    // 1. Fetch approval counts for all active tournaments
    supabase
      .from('registrations')
      .select('tournament_id')
      .eq('status', 'approved')
      .then(({ data }) => {
        const counts = {};
        data?.forEach(r => counts[r.tournament_id] = (counts[r.tournament_id] || 0) + 1);
        setApprovedCounts(counts);
      });

    // 2. Fetch current user's registration statuses
    if (user?.id) {
      supabase
        .from('registrations')
        .select('tournament_id, status')
        .eq('user_id', user.id)
        .then(({ data }) => {
          const statuses = {};
          data?.forEach(r => statuses[r.tournament_id] = r.status);
          setUserRegStatuses(statuses);
        });
    } else {
      setUserRegStatuses({});
    }

    // Re-fetch when user returns to this tab
    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        // Simple way to trigger effect re-run if needed, but manual fetch is better
        // For simplicity here, we'll just re-do the logic or rely on refocus
      }
    };
    window.addEventListener('focus', handleSync);
    return () => window.removeEventListener('focus', handleSync);
  }, [user?.id, openRegistrations.length]); // Re-run when user changes or tournaments list loads

  const maxTeams = currentTournament?.max_teams;
  const isUnlimited = !maxTeams || maxTeams === 0;
  const approvedCount = approvedCounts[currentTournament?.id] || 0;
  const fillPct = isUnlimited ? 100 : Math.min((approvedCount / maxTeams) * 100, 100);
  const isOpen = currentTournament?.status === 'registrations_open';

  const prizeFormatted = currentTournament?.prize_pool
    ? `PKR ${Number(currentTournament.prize_pool).toLocaleString('en-PK')}`
    : null;

  return (
    <div className="animate-page-enter bg-[#0a0a0a] overflow-x-hidden">
      
      {/* ═══════════════════════════════════════════
          HERO — Full Bleed Cinematic 
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-end pb-20 lg:pb-32 pt-28 overflow-hidden">
        {/* BG Layers */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} className="w-full h-full object-cover opacity-50 scale-110" alt="Hero Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(219,180,98,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(219,180,98,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />

        {/* Scanline */}
        <div className="absolute inset-0 scanline opacity-[0.06] pointer-events-none z-[2]" />

        {/* Gold accent lines */}
        <div className="hidden lg:block absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#dbb462]/20 to-transparent z-[3]" style={{left: '8%'}} />
        <div className="hidden lg:block absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#dbb462]/10 to-transparent z-[3]" style={{left: '50%'}} />

        {/* Main Content */}
        <div className="relative z-10 w-full px-6 lg:px-16 container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-end">
            
            {/* Left Column — Text */}
            <div className="lg:col-span-7 xl:col-span-6">
              {/* Eyebrow Tag */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-[#dbb462] animate-pulse" />
                <span className="font-teko text-[#dbb462] text-[16px] tracking-[0.3em] font-medium uppercase">
                  PAKISTAN'S COMPETITIVE ECOSYSTEM
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-bebas text-[clamp(4rem,14vw,11rem)] leading-[0.82] mb-8 select-none uppercase tracking-tight">
                <span className="text-[#f2f2f2] block">LEVEL UP</span>
                <span className="text-[#f2f2f2] block">YOUR <span className="zenith-gradient-text">GAME</span></span>
              </h1>

              {/* Sub-copy */}
              <p className="font-rajdhani text-[#d1c5b3] text-lg md:text-xl max-w-lg mb-10 leading-relaxed opacity-70 font-medium">
                Join the most technical and reliable tournament circuit in Pakistan. We provide the infrastructure for professional PUBG Mobile squads to shine.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12 lg:mb-0">
                <Link 
                  to={user ? "/profile" : "/auth"} 
                  className="btn-obsidian-primary font-bebas text-[22px] px-10 py-5 tracking-[0.15em] inline-flex items-center gap-3 uppercase"
                >
                  {user ? 'MY DASHBOARD' : 'JOIN THE CIRCUIT'} <ArrowRight size={22} strokeWidth={2.5} />
                </Link>
                <Link 
                  to="/tournaments" 
                  className="btn-obsidian-ghost font-bebas text-[22px] px-10 py-5 tracking-[0.15em] uppercase"
                >
                  BROWSE EVENTS
                </Link>
              </div>
            </div>

            {/* Right Column — Floating Stats Panel */}
            <div className="lg:col-span-5 xl:col-span-6 flex justify-end w-full mt-16 lg:mt-0">
              <div className="w-full grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-[2px] max-w-full lg:max-w-md">
                <FloatingStat label="ACTIVE PLAYERS" value={platformStats.activePlayers} delay={100} />
                <FloatingStat label="PRIZES PAID" value={platformStats.prizePools} delay={200} />
                <FloatingStat label="EVENTS DONE" value={platformStats.tournamentsRun} delay={300} />
                <FloatingStat label="REGION" value="PAKISTAN" accent delay={400} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/30 to-transparent z-10" />
      </section>

      {/* ═══════════════════════════════════════════
          LIVE BROADCAST
          ═══════════════════════════════════════════ */}
      <LiveStatus />

      {/* ═══════════════════════════════════════════
          OPEN REGISTRATIONS
          ═══════════════════════════════════════════ */}
      {openRegistrations.length > 0 && (
        <section className="relative bg-[#0a0a0a] border-t border-white/[0.04] overflow-hidden">
          <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-24 lg:py-32 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-[#dbb462]" />
                  <span className="font-teko text-[16px] tracking-[0.25em] text-[#dbb462] uppercase font-medium">Now Accepting Teams</span>
                </div>
                <h2 className="font-bebas text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.85] uppercase">
                  <span className="text-[#f2f2f2]">OPEN </span>
                  <span className="zenith-gradient-text">REGISTRATIONS</span>
                </h2>
              </div>
              <Link
                to="/tournaments"
                className="btn-obsidian-ghost font-bebas text-[20px] px-8 py-4 tracking-[0.15em] uppercase shrink-0"
              >
                ALL TOURNAMENTS <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>

            {/* Tournament Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/[0.04]">
              {openRegistrations.map((t) => {
                const prize = t.prize_pool ? `PKR ${Number(t.prize_pool).toLocaleString('en-PK')}` : 'TBA';
                const deadline = t.registration_deadline
                  ? new Date(t.registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'TBA';

                return (
                  <div key={t.id} className="bg-[#0e0e0e] group hover:bg-[#111] transition-all duration-500 relative overflow-hidden flex flex-col">
                    {/* Gold top edge on hover */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#dbb462] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

                    {/* Poster */}
                    <Link to={`/tournaments/${t.id}`} className="relative aspect-[16/9] overflow-hidden block">
                      {t.poster_url ? (
                        <img
                          src={t.poster_url}
                          alt={t.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#131313] flex items-center justify-center">
                          <Trophy className="text-[#dbb462] opacity-10" size={56} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
                      {/* Status badge */}
                      <div className={`absolute top-4 left-4 flex items-center gap-2 bg-[#0e0e0e]/90 backdrop-blur-md px-3 py-1.5 border z-20 ${
                        t.status === 'registrations_open' ? 'border-emerald-500/30' : 'border-[#dbb462]/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'registrations_open' ? 'bg-emerald-400 animate-pulse' : 'bg-[#dbb462]'
                        }`} />
                        <span className={`font-teko text-[13px] tracking-[0.2em] uppercase ${
                          t.status === 'registrations_open' ? 'text-emerald-400' : 'text-[#dbb462]'
                        }`}>
                          {t.status === 'registrations_open' ? 'Registrations Open' : t.status.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-6 lg:p-8 flex-1 flex flex-col">
                      <h3 className="font-bebas text-3xl lg:text-4xl text-[#f2f2f2] group-hover:text-white transition-colors leading-tight mb-4 line-clamp-1 uppercase">
                        {t.title}
                      </h3>

                      {/* Data strip */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <span className="font-teko text-[12px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase block mb-1">Prize Pool</span>
                          <span className="font-bebas text-xl text-[#dbb462] leading-none">{prize}</span>
                        </div>
                        <div>
                          <span className="font-teko text-[12px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase block mb-1">Deadline</span>
                          <span className="font-bebas text-xl text-[#f2f2f2] leading-none">{deadline}</span>
                        </div>
                      </div>

                      {/* Slots info */}
                      <div className="mb-6">
                        <div className="flex justify-between font-teko text-[12px] tracking-[0.2em] uppercase mb-2">
                          <span className="text-[#d1c5b3] opacity-40">Team Slots</span>
                          <span className="text-[#dbb462]">{t.max_teams ? `${t.max_teams} TEAMS` : 'UNLIMITED'}</span>
                        </div>
                        <div className="h-[2px] bg-white/[0.06] relative overflow-hidden">
                          <div className="absolute left-0 inset-y-0 zenith-gradient w-[30%]" />
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-auto flex gap-3">
                        {(!userRegStatuses[t.id] || userRegStatuses[t.id] === 'rejected') ? (
                          <Link
                            to={user ? `/register/${t.id}` : '/auth'}
                            className="btn-obsidian-primary flex-1 py-4 font-bebas text-[20px] tracking-[0.15em] uppercase"
                          >
                            REGISTER
                          </Link>
                        ) : (
                          <div className={`flex-1 font-teko text-[16px] py-3.5 tracking-[0.15em] uppercase text-center flex items-center justify-center border ${
                            userRegStatuses[t.id] === 'approved' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : userRegStatuses[t.id] === 'reapplied'
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                          }`}>
                            {userRegStatuses[t.id] === 'approved' ? 'APPROVED' : 
                             userRegStatuses[t.id] === 'reapplied' ? 'RE-APPLIED' : 
                             'PENDING'}
                          </div>
                        )}
                        <Link
                          to={`/tournaments/${t.id}`}
                          className="btn-obsidian-ghost px-5 py-4 font-bebas text-[20px] tracking-widest uppercase"
                        >
                          <ChevronRight size={20} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURED TOURNAMENT — Cinematic Showcase
          ═══════════════════════════════════════════ */}
      {currentTournament && (
        <section className="relative bg-[#0e0e0e] overflow-hidden">
          {/* Diagonal accent strip */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#dbb462]/[0.03] blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-24 lg:py-32 relative z-10">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[2px] bg-[#dbb462]" />
              <span className="font-teko text-[16px] tracking-[0.25em] text-[#dbb462] uppercase font-medium">Ongoing Tournament</span>
            </div>
            <h2 className="font-bebas text-6xl md:text-8xl lg:text-[9rem] tracking-tight leading-[0.82] uppercase zenith-gradient-text mb-16 lg:mb-20">
              {currentTournament.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              
              {/* Poster Column */}
              <div className="lg:col-span-5 relative">
                <div className="relative group">
                  <div className="aspect-[4/5] relative overflow-hidden bg-[#111] border border-white/[0.06]">
                    {currentTournament.poster_url ? (
                      <img 
                        src={currentTournament.poster_url} 
                        alt={currentTournament.title} 
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111] flex items-center justify-center">
                        <img src="/logo.png" className="w-1/2 opacity-20" alt="" />
                      </div>
                    )}
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-80" />
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#dbb462]/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#dbb462]/40" />
                  </div>

                  {/* Glow on hover */}
                  <div className="absolute -inset-4 bg-[#dbb462]/[0.06] blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                </div>
              </div>

              {/* Info Column */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                {/* Description */}
                <p className="font-rajdhani text-[#d1c5b3] text-lg opacity-50 leading-relaxed max-w-2xl mb-10 font-medium">
                  {currentTournament.description || "The next evolution of competitive PUBG Mobile. Secure your team's slot and prepare for the current circuit."}
                </p>

                {/* Metric Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.04] mb-10">
                  <MetricBox label="PRIZE DISTRIBUTION" value={prizeFormatted || 'TBA'} gold />
                  <MetricBox label="TEAM SLOTS" value={isUnlimited ? 'UNLIMITED' : `${maxTeams} TEAMS`} />
                  <MetricBox label="START DATE" value={currentTournament.start_date ? new Date(currentTournament.start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
                  <MetricBox label="DEADLINE" value={currentTournament.registration_deadline ? new Date(currentTournament.registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
                </div>

                {/* Capacity Bar */}
                <div className="mb-10">
                  <div className="flex justify-between font-teko text-[14px] tracking-[0.2em] uppercase mb-3">
                    <span className="text-[#dbb462]">{approvedCount} Teams Verified</span>
                    <span className="text-[#d1c5b3] opacity-40">{isUnlimited ? 'UNLIMITED' : `${Math.round(fillPct)}% Capacity`}</span>
                  </div>
                  <div className="h-[3px] bg-white/[0.06] relative overflow-hidden">
                    <div 
                      className="absolute left-0 inset-y-0 zenith-gradient transition-all duration-1000 ease-out"
                      style={{ width: `${fillPct}%` }}
                    />
                    <div 
                      className="absolute inset-y-0 w-[2px] bg-white/60 transition-all duration-1000"
                      style={{ left: `${fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Registration Card */}
                <div className="bg-[#111] border border-white/[0.06] p-8 relative overflow-hidden group hover:border-[#dbb462]/20 transition-all duration-500">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#dbb462] via-[#dbb462]/40 to-transparent" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <RegistrationCountdown 
                        openDate={currentTournament.registration_open_date}
                        deadlineDate={currentTournament.registration_deadline}
                      />
                    </div>

                    <div className="w-full md:w-auto space-y-3 shrink-0 min-w-[260px]">
                      {(userRegStatuses[currentTournament.id] && userRegStatuses[currentTournament.id] !== 'rejected') ? (
                        <div className={`w-full text-center font-bebas text-[22px] py-5 tracking-widest uppercase border ${
                          userRegStatuses[currentTournament.id] === 'approved' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : userRegStatuses[currentTournament.id] === 'reapplied'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                        }`}>
                          {userRegStatuses[currentTournament.id] === 'approved' ? 'ALREADY APPROVED' : 
                           userRegStatuses[currentTournament.id] === 'reapplied' ? 'ALREADY RE-APPLIED' : 
                           'ALREADY REGISTERED'}
                        </div>
                      ) : isOpen ? (
                        <Link
                          to={user ? `/register/${currentTournament.id}` : "/auth"}
                          className="btn-obsidian-primary w-full py-5 font-bebas text-[22px] tracking-[0.2em]"
                        >
                          REGISTER TEAM
                        </Link>
                      ) : (
                        <div className="w-full text-center bg-white/[0.04] text-[#d1c5b3]/30 font-bebas text-[22px] py-5 tracking-widest uppercase">
                          REGISTRATION CLOSED
                        </div>
                      )}
                      
                      <Link
                        to={`/tournaments/${currentTournament.id}`}
                        className="btn-obsidian-ghost w-full py-5 font-bebas text-[22px] tracking-widest uppercase"
                      >
                        VIEW DETAILS <ChevronRight size={20} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          WHY COMPETE — Feature Pillars
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(219,180,98,1) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-24 lg:py-40 relative z-10">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 lg:mb-24">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[2px] bg-[#dbb462]" />
                <span className="font-teko text-[16px] tracking-[0.25em] text-[#dbb462] uppercase font-medium">Why Compete With Us</span>
              </div>
              <h2 className="font-bebas text-6xl md:text-8xl lg:text-[9rem] tracking-tight leading-[0.82] uppercase">
                <span className="text-[#f2f2f2]">PROFESSIONAL</span><br />
                <span className="zenith-gradient-text">TOURNAMENT QUALITY</span>
              </h2>
            </div>
            <div className="flex items-end lg:justify-end">
              <p className="font-rajdhani text-[#d1c5b3] opacity-40 leading-relaxed text-lg max-w-md font-medium">
                We focus on technical excellence and competitive fairness. Every tournament is run with strict rules to ensure the best experience for every team.
              </p>
            </div>
          </div>

          {/* Feature Grid — 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.04]">
            {[
              { icon: Shield, num: '01', title: 'STRICT INTEGRITY', desc: 'No shortcuts. We manually verify every player and character ID to ensure a fair battlefield for everyone.' },
              { icon: Tv, num: '02', title: 'HIGH-END BROADCAST', desc: 'Watch your matches with professional production. We use high-fidelity streams to showcase your gameplay.' },
              { icon: GitBranch, num: '03', title: 'TECHNICAL BRACKETS', desc: 'No manual bias. Our system handles group distribution and brackets automatically using tournament-grade logic.' },
              { icon: Banknote, num: '04', title: 'FAST SETTLEMENTS', desc: 'We value your time. Prize distributions are handled quickly once results are verified and finalized.' },
            ].map(({ icon: Icon, num, title, desc }) => (
              <div 
                key={num} 
                className="bg-[#0e0e0e] p-8 lg:p-10 group hover:bg-[#111] transition-all duration-500 relative overflow-hidden"
              >
                {/* Gold top edge on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#dbb462] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                {/* Number watermark */}
                <span className="absolute top-4 right-6 font-bebas text-[80px] text-white/[0.03] leading-none select-none group-hover:text-[#dbb462]/[0.06] transition-colors duration-500">{num}</span>
                
                <div className="relative z-10">
                  <Icon size={28} className="text-[#dbb462] mb-6 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  <h4 className="font-bebas text-3xl tracking-tight text-[#f2f2f2] mb-4 group-hover:text-[#dbb462] transition-colors uppercase">{title}</h4>
                  <p className="font-rajdhani text-[15px] text-[#d1c5b3] opacity-40 group-hover:opacity-70 transition-opacity leading-relaxed font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER — Final Push 
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#0e0e0e] border-t border-b border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#dbb462]/[0.03] via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <h3 className="font-bebas text-5xl md:text-7xl tracking-tight uppercase leading-[0.85] mb-4">
                READY TO <span className="zenith-gradient-text">COMPETE?</span>
              </h3>
              <p className="font-rajdhani text-[#d1c5b3] opacity-40 text-lg max-w-lg font-medium">
                Register your squad, gear up, and join Pakistan's most competitive PUBG Mobile circuit today.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={user ? "/tournaments" : "/auth"} 
                className="btn-obsidian-primary font-bebas text-[24px] px-12 py-6 tracking-[0.2em] inline-flex items-center gap-4 uppercase"
              >
                {user ? 'VIEW TOURNAMENTS' : 'GET STARTED'} <ArrowRight size={24} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Floating Stat Block (Hero) ── */
function FloatingStat({ label, value, accent, delay = 0 }) {
  return (
    <div 
      className="relative overflow-hidden bg-[#0e0e0e]/60 backdrop-blur-md border border-white/[0.05] p-4 md:p-6 group hover:border-[#dbb462]/30 hover:bg-[#111]/80 transition-all duration-500 flex flex-col justify-center animate-stat-enter opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Decorative gradient glow */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 ${accent ? 'bg-emerald-500/10' : 'bg-[#dbb462]/10'} blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
      
      {/* Accent corner */}
      <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${accent ? 'border-emerald-500/50' : 'border-[#dbb462]/50'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10 flex flex-col gap-1.5">
        <span className="font-teko text-[12px] md:text-[14px] tracking-[0.2em] text-[#d1c5b3] opacity-50 uppercase group-hover:opacity-90 transition-opacity">{label}</span>
        <span className={`font-bebas text-[28px] md:text-4xl tracking-tight leading-none flex items-center gap-2 ${accent ? 'text-emerald-400' : 'text-[#f2f2f2]'}`}>
          {accent && <span className="inline-block w-2 h-2 bg-emerald-400 shrink-0 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
          {value}
        </span>
      </div>
    </div>
  );
}

/* ── Metric Box (Tournament) ── */
function MetricBox({ label, value, gold }) {
  return (
    <div className="bg-[#0e0e0e] p-5 group hover:bg-[#141414] transition-all duration-300">
      <p className="font-teko text-[11px] tracking-[0.2em] text-[#d1c5b3] opacity-40 mb-2 uppercase">{label}</p>
      <p className={`font-bebas text-2xl leading-none tracking-tight ${gold ? 'text-[#dbb462]' : 'text-[#f2f2f2]'}`}>
        {value}
      </p>
    </div>
  );
}
