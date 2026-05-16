import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Tv, GitBranch, Banknote, ArrowRight, Trophy, Calendar, Youtube, Instagram, MessageCircle, Zap, Target, Flame, ChevronDown } from 'lucide-react';
import LiveStatus from '../components/LiveStatus';
import { useTournaments } from '../hooks/useTournaments';
import { useSupabaseDB } from '../hooks/useSupabaseDB';
import { usePlatformStats } from '../hooks/usePlatformStats';
import { useAuth } from '../hooks/useAuth';
import RegistrationCountdown from '../components/RegistrationCountdown';

export default function LandingPage() {
  const { currentTournament, openRegistrations } = useTournaments();
  const { user } = useAuth();
  const platformStats = usePlatformStats();
  const { data: allRegistrations, loading: rLoading } = useSupabaseDB('registrations');

  // Compute registration counts and user registration status from real-time data
  const { regCounts, userRegStatuses } = React.useMemo(() => {
    const counts = {};
    const statuses = {};
    
    allRegistrations.forEach((r) => {
      // Slot counts only include approved teams
      if (r.status === 'approved') {
        counts[r.tournament_id] = (counts[r.tournament_id] || 0) + 1;
      }
      // Track which tournaments the current user has joined
      if (user?.id && r.user_id === user.id) {
        statuses[r.tournament_id] = r.status;
      }
    });
    
    return { regCounts: counts, userRegStatuses: statuses };
  }, [allRegistrations, user?.id]);

  const maxTeams = currentTournament?.max_teams;
  const isUnlimited = !maxTeams || maxTeams === 0;
  const approvedCount = regCounts[currentTournament?.id] || 0;
  const fillPct = isUnlimited ? 100 : Math.min((approvedCount / maxTeams) * 100, 100);
  const isOpen = currentTournament?.status === 'registrations_open';

  const prizeFormatted = currentTournament?.prize_pool
    ? `PKR ${Number(currentTournament.prize_pool).toLocaleString('en-PK')}`
    : null;

  return (
    <div className="animate-page-enter bg-[#0a0a0a] overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO — Cinematic Full-Bleed
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden">

        {/* ── Layer 1: Hero Image ── */}
        <div className="absolute inset-0 z-0">
          <img
            src="/image-3.webp"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
            style={{ filter: 'saturate(0.6) contrast(1.05) brightness(0.85)' }}
            alt=""
          />
          {/* Multi-stop gradient: heavy bottom, moderate left, light top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#0a0a0a]/60" />
        </div>

        {/* ── Layer 2: Atmospheric Glows ── */}
        {/* Primary gold orb — top center */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#dbb462]/[0.07] blur-[180px] pointer-events-none z-[1] rounded-full" />
        {/* Secondary orb — mid right */}
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#c49a3a]/[0.06] blur-[130px] pointer-events-none z-[1] rounded-full" />
        {/* Low glow — bottom left */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#dbb462]/[0.04] blur-[100px] pointer-events-none z-[1]" />

        {/* ── Layer 3: Edge Vignette ── */}
        <div className="absolute inset-0 z-[2] pointer-events-none" style={{
          background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(10,10,10,0.55) 100%)',
        }} />

        {/* ── Layer 4: Frame Accents ── */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {/* Top-left corner bracket */}
          <div className="absolute top-28 lg:top-[130px] left-6 lg:left-16 w-10 h-10 border-t-[1.5px] border-l-[1.5px] border-[#dbb462]/25" />
          {/* Bottom-right corner bracket */}
          <div className="absolute bottom-[22%] right-6 lg:right-16 w-10 h-10 border-b-[1.5px] border-r-[1.5px] border-[#dbb462]/15" />
          {/* Single vertical rule — right side */}
          <div className="absolute top-0 right-[22%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#dbb462]/10 to-transparent" />
        </div>

        {/* ── Layer 5: Scanline ── */}
        <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none z-[3]" />

        {/* ── Main Content: Top Section ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center pt-28 lg:pt-32 pb-10">
          <div className="container mx-auto max-w-7xl px-6 lg:px-16">

            {/* Top row: badge + season indicator */}
            <div className="flex items-center justify-between mb-12 lg:mb-16">
              {/* Left badge */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center gap-2 bg-[#dbb462]/10 border border-[#dbb462]/25 px-4 py-2 backdrop-blur-sm">
                  <span className="relative w-2 h-2 rounded-full bg-[#dbb462]">
                    <span className="absolute inset-0 rounded-full bg-[#dbb462] animate-ping opacity-60" />
                  </span>
                  <span className="font-teko text-[#dbb462] text-[13px] tracking-[0.3em] uppercase">
                    Pakistan · PUBG Mobile · Est. 2021
                  </span>
                </div>
              </div>
              {/* Right: scroll hint (desktop) */}
              <div className="hidden lg:flex items-center gap-2 text-[#d1c5b3]/30">
                <span className="font-teko text-[11px] tracking-[0.3em] uppercase">Scroll</span>
                <ChevronDown size={12} className="animate-bounce" />
              </div>
            </div>

            {/* Headline */}
            <div className="mb-10 lg:mb-12">
              {/* Decorative top-left corner bracket */}
              <div className="hidden lg:block absolute -translate-x-6 -translate-y-4 w-6 h-6 border-t-2 border-l-2 border-[#dbb462]/40" />

              <h1 className="font-bebas uppercase select-none leading-[0.82] tracking-tight">
                {/* Line 1 — smaller accent line */}
                <span
                  className="block text-[clamp(2rem,5vw,4rem)] text-[#d1c5b3]/50 tracking-[0.1em] mb-2"
                  style={{ letterSpacing: '0.12em' }}
                >
                  FORGE YOUR
                </span>
                {/* Line 2 — massive hero word */}
                <span className="block text-[clamp(5.5rem,17vw,13.5rem)] zenith-gradient-text leading-[0.85]"
                  style={{ textShadow: '0 0 120px rgba(219,180,98,0.25)' }}>
                  LEGACY.
                </span>
                {/* Line 3 — supporting line */}
                <span className="block text-[clamp(2rem,5.5vw,4.5rem)] text-[#f2f2f2]/80 tracking-wide mt-2">
                  DOMINATE THE COMPETITION
                </span>
              </h1>
            </div>

            {/* Body copy + CTAs row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
              {/* Body */}
              <div>
                <p className="font-rajdhani text-[#d1c5b3] text-xl leading-relaxed opacity-60 font-medium max-w-xl mb-10">
                  Pakistan's most rigorous PUBG Mobile tournament platform. Every squad is verified. Every match is tracked. Only the best rise to the top.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={user ? "/tournaments" : "/auth"}
                    className="btn-obsidian-primary font-bebas text-[22px] px-12 py-5 tracking-[0.15em] inline-flex items-center gap-3 uppercase"
                  >
                    {user ? 'ENTER THE ARENA' : 'CLAIM YOUR SPOT'}{' '}
                    <ArrowRight size={22} strokeWidth={2.5} />
                  </Link>
                  <Link
                    to="/tournaments"
                    className="btn-obsidian-ghost font-bebas text-[22px] px-10 py-5 tracking-[0.15em] uppercase"
                  >
                    VIEW EVENTS
                  </Link>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col gap-4 lg:items-end">
                {[
                  { icon: Shield,  text: 'Every player manually ID-verified' },
                  { icon: Target,  text: 'Tournament-grade bracket system' },
                  { icon: Flame,   text: 'Fast prize settlements guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-[#dbb462]/10 border border-[#dbb462]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dbb462]/20 transition-colors">
                      <Icon size={14} className="text-[#dbb462]" />
                    </div>
                    <span className="font-teko text-[15px] tracking-[0.12em] text-[#d1c5b3] opacity-50 group-hover:opacity-80 transition-opacity uppercase">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats HUD Strip ── */}
        <div className="relative z-10 border-t border-[#dbb462]/15 bg-[#0a0a0a]/60 backdrop-blur-xl">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/40 to-transparent" />

          <div className="container mx-auto max-w-7xl px-6 lg:px-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#dbb462]/10">
              <HeroStat
                value={platformStats.activePlayers}
                label="Players Reached"
                sub="Across all platforms"
                delay={0}
              />
              <HeroStat
                value={platformStats.prizePools}
                label="Prize Money Paid"
                sub="Distributed to winners"
                delay={80}
              />
              <HeroStat
                value={platformStats.tournamentsRun}
                label="Tournaments Run"
                sub="Since 2021"
                delay={160}
              />
              <HeroStat
                value="PAKISTAN"
                label="Region of Operation"
                sub="Nationwide circuit"
                accent
                delay={240}
              />
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/15 to-transparent" />
        </div>
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
                          <div 
                            className="absolute left-0 inset-y-0 zenith-gradient transition-all duration-1000" 
                            style={{ width: `${t.max_teams ? Math.min(((regCounts[t.id] || 0) / t.max_teams) * 100, 100) : 0}%` }} 
                          />
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
      <section className="relative bg-[#0a0a0a] overflow-hidden section-glow">
        {/* Ambient orbs */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] bg-[#dbb462]/[0.04] blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[300px] h-[300px] bg-[#dbb462]/[0.03] blur-[100px] pointer-events-none rounded-full" />
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
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
          COMMUNITY — Social Channels
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#0a0a0a] border-t border-white/[0.04] overflow-hidden section-glow">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#dbb462]/[0.04] blur-[120px] pointer-events-none rounded-full" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28 relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-[2px] bg-[#dbb462]" />
              <span className="font-teko text-[16px] tracking-[0.25em] text-[#dbb462] uppercase font-medium">Stay Connected</span>
              <div className="w-8 h-[2px] bg-[#dbb462]" />
            </div>
            <h2 className="font-bebas text-5xl md:text-7xl tracking-tight leading-[0.85] uppercase">
              <span className="text-[#f2f2f2]">JOIN THE </span>
              <span className="zenith-gradient-text glow-gold-text">COMMUNITY</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.04]">
            {[
              {
                icon: Youtube,
                platform: 'YouTube',
                handle: '@zenithesports.pakistan',
                desc: 'Watch live tournaments, match highlights and professional PUBG Mobile content.',
                href: 'https://youtube.com/@zenithesports.pakistan',
                color: 'text-red-400',
                borderColor: 'border-red-500/20',
                bgHover: 'hover:bg-red-500/[0.03]',
              },
              {
                icon: Instagram,
                platform: 'Instagram',
                handle: '@zenithesports.pk',
                desc: 'Follow for tournament announcements, team spotlights and behind-the-scenes content.',
                href: 'https://instagram.com/zenithesports.pk',
                color: 'text-pink-400',
                borderColor: 'border-pink-500/20',
                bgHover: 'hover:bg-pink-500/[0.03]',
              },
              {
                icon: MessageCircle,
                platform: 'WhatsApp',
                handle: '+92 339 0715753',
                desc: 'Direct support for registrations, disputes, and all tournament related queries.',
                href: 'https://wa.me/923390715753',
                color: 'text-emerald-400',
                borderColor: 'border-emerald-500/20',
                bgHover: 'hover:bg-emerald-500/[0.03]',
              },
            ].map(({ icon: Icon, platform, handle, desc, href, color, borderColor, bgHover }) => (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`bg-[#0e0e0e] p-8 lg:p-10 group ${bgHover} transition-all duration-500 relative overflow-hidden flex flex-col`}
              >
                <div className={`absolute top-0 left-0 w-full h-[2px] ${color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                <Icon size={32} className={`${color} mb-6 opacity-50 group-hover:opacity-100 transition-opacity`} strokeWidth={1.5} />
                <p className="font-teko text-[13px] tracking-[0.25em] text-[#d1c5b3] opacity-40 uppercase mb-1">{platform}</p>
                <p className={`font-bebas text-2xl ${color} mb-4`}>{handle}</p>
                <p className="font-rajdhani text-[#d1c5b3] text-sm opacity-40 group-hover:opacity-70 transition-opacity leading-relaxed flex-1 font-medium">{desc}</p>
                <div className={`mt-6 flex items-center gap-2 ${color} opacity-0 group-hover:opacity-80 transition-all duration-300 translate-y-2 group-hover:translate-y-0 font-teko text-[13px] tracking-widest uppercase`}>
                  Follow <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER — Final Push
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#0e0e0e] border-t border-white/[0.04] overflow-hidden">
        {/* Diagonal gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#dbb462]/[0.05] via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[200px] bg-[#dbb462]/[0.04] blur-[80px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-6 lg:px-16 py-20 lg:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Zap size={20} className="text-[#dbb462]" />
                <span className="font-teko text-[16px] tracking-[0.25em] text-[#dbb462] uppercase">Time to Deploy</span>
              </div>
              <h3 className="font-bebas text-5xl md:text-7xl tracking-tight uppercase leading-[0.85] mb-4">
                READY TO <span className="zenith-gradient-text">COMPETE?</span>
              </h3>
              <p className="font-rajdhani text-[#d1c5b3] opacity-40 text-lg max-w-lg font-medium">
                Register your squad, gear up, and join Pakistan's most competitive PUBG Mobile circuit today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to={user ? "/tournaments" : "/auth"}
                className="btn-obsidian-primary font-bebas text-[22px] px-12 py-6 tracking-[0.2em] inline-flex items-center gap-4 uppercase"
              >
                {user ? 'VIEW TOURNAMENTS' : 'GET STARTED'} <ArrowRight size={22} strokeWidth={2.5} />
              </Link>
              {!user && (
                <Link
                  to="/tournaments"
                  className="btn-obsidian-ghost font-bebas text-[22px] px-10 py-6 tracking-[0.15em] uppercase"
                >
                  BROWSE FIRST
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Hero Stats HUD Cell ── */
function HeroStat({ value, label, sub, accent, delay = 0 }) {
  return (
    <div
      className="px-6 lg:px-10 py-6 lg:py-8 group relative overflow-hidden animate-stat-enter opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Top accent line slides in on hover */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${accent ? 'bg-emerald-400' : 'zenith-gradient'}`} />

      {/* Ambient glow blob */}
      <div className={`absolute -top-6 -left-6 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full ${accent ? 'bg-emerald-500/10' : 'bg-[#dbb462]/08'}`} />

      <p className="font-teko text-[11px] md:text-[12px] tracking-[0.25em] text-[#d1c5b3] opacity-40 uppercase mb-1 group-hover:opacity-70 transition-opacity">{label}</p>
      <p className={`font-bebas text-[2rem] md:text-[2.5rem] leading-none tracking-tight mb-1 ${accent ? 'text-emerald-400' : 'zenith-gradient-text'}`}>
        {value}
      </p>
      <p className="font-teko text-[11px] tracking-[0.2em] text-[#d1c5b3] opacity-25 uppercase group-hover:opacity-50 transition-opacity">{sub}</p>
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
