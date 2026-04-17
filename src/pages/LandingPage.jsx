import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Star, Trophy, Users, Clock, Calendar, Zap } from 'lucide-react';
import LiveStatus from '../components/LiveStatus';
import StatStrip from '../components/StatStrip';
import InteractiveBackground from '../components/ui/InteractiveBackground';
import { useTournaments } from '../hooks/useTournaments';
import { usePlatformStats } from '../hooks/usePlatformStats';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase/config';

import RegistrationCountdown from '../components/RegistrationCountdown';

// ── Main Component ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const { currentTournament } = useTournaments();
  const { user } = useAuth();
  const platformStats = usePlatformStats();
  const [approvedCount, setApprovedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  // Fetch slot count for current tournament only (silent fail)
  useEffect(() => {
    if (!currentTournament?.id) return;
    
    // Fetch total non-rejected for closing logic
    supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('tournament_id', currentTournament.id)
      .neq('status', 'rejected')
      .then(({ count }) => { if (count != null) setTotalCount(count); });

    // Fetch only approved for display
    supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('tournament_id', currentTournament.id)
      .eq('status', 'approved')
      .then(({ count }) => { if (count != null) setApprovedCount(count); });

    // Check if current user is registered
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

  const maxTeams      = currentTournament?.max_teams || 64;
  const slotsLeft     = Math.max(0, maxTeams - totalCount);
  const fillPct       = Math.min((approvedCount / maxTeams) * 100, 100);
  
  // Registration is open if the tournament is active AND slots are left
  // (Countdown component handles the actual time display)
  const isOpen        = currentTournament?.status === 'active' && slotsLeft > 0;
  const prizeFormatted = currentTournament?.prize_pool
    ? `PKR ${Number(currentTournament.prize_pool).toLocaleString('en-PK')}`
    : null;

  return (
    <div className="animate-page-enter">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#131313]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80&fm=webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/60 to-[#0e0e0e]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
          <InteractiveBackground />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 flex flex-col items-start">
              <span className="font-stretch text-[#f9d07a] text-xs tracking-[0.3em] mb-6 bg-[#2a2a2a] px-4 py-2 inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                PAKISTAN'S PREMIER ESPORTS PLATFORM
              </span>
              <h1 className="font-agency text-[14vw] md:text-[10vw] lg:text-[8vw] leading-tight pb-2 font-black tracking-tighter text-[#e2e2e2] mb-6 uppercase italic">
                COMMAND<br />
                <span className="zenith-gradient-text">THE ARENA</span>
              </h1>
              <p className="font-body text-[#d1c5b3] text-lg md:text-xl max-w-xl mb-10 leading-relaxed opacity-80">
                Pakistan ka sabse bada PUBG Mobile esports platform. Register your team, compete for glory, aur Pakistan ko represent karo.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/profile" className="zenith-gradient text-[#402d00] font-stretch text-xs px-10 py-5 tracking-widest hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-3">
                    MY PROFILE <ChevronRight size={14} />
                  </Link>
                ) : (
                  <Link to="/auth" className="zenith-gradient text-[#402d00] font-stretch text-xs px-10 py-5 tracking-widest hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-3">
                    JOIN NOW <ChevronRight size={14} />
                  </Link>
                )}
                <Link to="/tournaments" className="border border-[rgba(78,70,56,0.5)] text-[#e2e2e2] font-stretch text-xs px-10 py-5 tracking-widest hover:bg-[#2a2a2a] transition-all">
                  VIEW TOURNAMENTS
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-[rgba(78,70,56,0.15)]">
                {[
                  { icon: Shield, text: 'Verified Platform' },
                  { icon: Star,   text: 'Top Tier Tournaments' },
                  { icon: Trophy, text: 'Fair Competition' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={14} className="text-[#dbb462]" />
                    <span className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-50">{text.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stat panel */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="bg-[#0e0e0e] p-8 border-l-4 border-[#dbb462] shadow-2xl relative overflow-hidden backdrop-blur-xl bg-opacity-90">
                <div className="absolute -right-10 -top-10 opacity-5">
                  <Trophy size={180} />
                </div>
                <span className="font-stretch text-[9px] tracking-widest text-[#f9d07a] block mb-8 relative z-10">PLATFORM STATS</span>
                {[
                  { label: 'ACTIVE PLAYERS',  value: platformStats.activePlayers },
                  { label: 'PRIZE POOLS',     value: platformStats.prizePools },
                  { label: 'TOURNAMENTS',     value: platformStats.tournamentsRun },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center mb-6 relative z-10">
                    <span className="font-stretch text-[9px] text-[#c6c6c6] tracking-widest">{label}</span>
                    <span className="font-agency text-3xl text-[#f9d07a] font-bold drop-shadow-md">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="font-stretch text-[9px] text-[#c6c6c6] tracking-widest">REGION</span>
                  <span className="font-agency text-2xl text-green-500 font-bold">PAKISTAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <StatStrip />

      {/* ── LIVE BROADCAST ── */}
      <LiveStatus />

      {/* ── ACTIVE TOURNAMENT ── */}
      {currentTournament && (
        <section className="relative pt-32 pb-24 px-6 md:px-12 bg-[#0a0a0a] overflow-hidden border-t border-[rgba(78,70,56,0.2)]">
          {/* Blurred poster background */}
          {currentTournament.poster_url && (
            <div
              className="absolute inset-0 opacity-10 scale-125 origin-center mix-blend-screen"
              style={{
                backgroundImage: `url(${currentTournament.poster_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(40px)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-0" />
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#dbb462]/5 to-transparent z-0 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Live indicator */}
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="font-stretch text-[10px] tracking-[0.4em] text-emerald-400">
                {currentTournament.status === 'active' ? 'LIVE NOW — REGISTRATIONS OPEN' : 'UPCOMING TOURNAMENT'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Poster overlay card */}
              {currentTournament.poster_url && (
                <div className="hidden lg:block lg:col-span-4 relative group perspective-1000">
                  <div className="relative overflow-hidden border border-[#dbb462]/30 shadow-[0_0_30px_rgba(219,180,98,0.15)] rounded-sm transform group-hover:scale-[1.02] transition-all duration-700">
                    <img
                      src={currentTournament.poster_url}
                      alt={currentTournament.title}
                      className="w-full aspect-[3/4] object-cover group-hover:opacity-80 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                  </div>
                </div>
              )}

              {/* Info panel */}
              <div className={`${currentTournament.poster_url ? 'lg:col-span-8 lg:pl-8' : 'lg:col-span-12'} space-y-8 mt-4 lg:mt-0`}>
                <div>
                  <span className="inline-flex items-center gap-2 font-stretch text-[10px] tracking-[0.2em] text-[#dbb462] bg-[#dbb462]/10 border border-[#dbb462]/20 px-4 py-2 mb-6">
                    <Zap size={14} className="text-[#dbb462]" /> {(currentTournament.game || 'PUBG Mobile').toUpperCase()}
                  </span>
                  <h2 className="font-agency text-5xl md:text-7xl lg:text-8xl font-black italic leading-[0.9] tracking-tighter text-[#e2e2e2] mb-6 drop-shadow-2xl">
                    {currentTournament.title}
                  </h2>
                  {currentTournament.description && (
                    <p className="text-[#d1c5b3] text-lg lg:text-xl leading-relaxed max-w-3xl" style={{ opacity: 0.7 }}>
                      {currentTournament.description}
                    </p>
                  )}
                </div>

                {/* Info chips grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Trophy,   label: 'PRIZE POOL',  value: prizeFormatted || 'TBA', gold: !!prizeFormatted },
                    { icon: Users,    label: 'MAX TEAMS',   value: `${maxTeams} SLOTS` },
                    { icon: Calendar, label: 'STARTS',      value: currentTournament.start_date
                        ? new Date(currentTournament.start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                        : 'TBA' },
                    { icon: Clock,    label: 'REG. CLOSES', value: currentTournament.registration_deadline
                        ? new Date(currentTournament.registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                        : 'TBA' },
                  ].map(({ icon: Icon, label, value, gold }) => (
                    <div key={label} className="bg-[#131313] border border-[rgba(78,70,56,0.2)] p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon size={11} className="text-[#dbb462]" style={{ opacity: 0.6 }} />
                        <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3]" style={{ opacity: 0.4 }}>{label}</p>
                      </div>
                      <p className={`font-agency text-lg font-bold leading-none ${gold ? 'zenith-gradient-text' : 'text-[#e2e2e2]'}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Slot bar */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-stretch text-[9px] tracking-widest text-[#dbb462] uppercase">
                      {maxTeams ? `SLOTS FILLED — ${approvedCount} / ${maxTeams}` : `REGISTERED — ${approvedCount} TEAMS`}
                    </span>
                    {maxTeams && (
                      <span className="font-agency text-xl font-bold text-[#f9d07a]">
                        {Math.round(fillPct)}%
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden border border-[#2a2a2a] relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 zenith-gradient transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(219,180,98,0.8)]"
                      style={{ width: maxTeams ? `${fillPct}%` : '100%' }}
                    />
                    {!maxTeams && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
                  </div>
                </div>
              </div>

              {/* Right: Countdown + CTA */}
              <div className="lg:col-span-4">
                <div className="bg-[#131313] border border-[rgba(78,70,56,0.25)] p-6 space-y-6">

                  {/* Countdown */}
                  <RegistrationCountdown 
                    openDate={currentTournament.registration_open_date}
                    deadlineDate={currentTournament.registration_deadline}
                  />

                  {/* Briefing preview */}
                  {currentTournament.briefing && (
                    <div className="border-t border-[rgba(78,70,56,0.15)] pt-4">
                      <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] mb-2" style={{ opacity: 0.4 }}>BRIEFING</p>
                      <p className="text-[#d1c5b3] text-xs leading-relaxed line-clamp-3" style={{ opacity: 0.6 }}>
                        {currentTournament.briefing}
                      </p>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="border-t border-[rgba(78,70,56,0.15)] pt-4 space-y-3">
                    {isOpen && !isUserRegistered ? (
                      user ? (
                        <Link
                          to={`/register/${currentTournament.id}`}
                          className="block w-full text-center zenith-gradient text-[#402d00] font-stretch text-[10px] py-4 tracking-widest hover:brightness-110 active:scale-95 transition-all"
                        >
                          REGISTER YOUR TEAM
                        </Link>
                      ) : (
                        <Link
                          to="/auth"
                          className="block w-full text-center zenith-gradient text-[#402d00] font-stretch text-[10px] py-4 tracking-widest hover:brightness-110 transition-all"
                        >
                          SIGN IN TO REGISTER
                        </Link>
                      )
                    ) : isUserRegistered ? (
                      <div className="w-full text-center bg-[#dbb462]/10 border border-[#dbb462]/30 text-[#dbb462] font-stretch text-[9px] py-4 tracking-[0.2em] uppercase">
                        ENTRY SUBMITTED
                      </div>
                    ) : (
                      <div className="w-full text-center bg-[#1f1f1f] font-stretch text-[10px] py-4 tracking-widest text-[#d1c5b3]" style={{ opacity: 0.4 }}>
                        REGISTRATION PENDING
                      </div>
                    )}
                    <Link
                      to={`/tournaments/${currentTournament.id}`}
                      className="flex items-center justify-center gap-2 w-full border border-[rgba(78,70,56,0.3)] text-[#d1c5b3] font-stretch text-[10px] py-3 tracking-widest hover:bg-[#1f1f1f] hover:border-[#dbb462]/40 transition-all"
                    >
                      VIEW FULL DETAILS <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── WHY ZENITH ── */}
      <section className="py-24 px-6 md:px-12 bg-[#131313]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">OUR MISSION</span>
            <h2 className="font-agency text-6xl font-black italic tracking-tighter mb-6">
              PAKISTAN KA APNA ESPORTS PLATFORM
            </h2>
            <p className="text-[#d1c5b3] opacity-60 leading-relaxed text-base mb-8">
              At <strong className="font-bold text-[#e2e2e2]">Zenith Esports</strong>, we don't just host games; we build legacies. A professional ecosystem where Pakistan's top-tier talent finally gets the stage it deserves.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Verified Competition', desc: 'Every team is manually vetted. Only the real ones make the cut.' },
                { title: 'Live-Action Glory',    desc: 'Broadcast your gameplay to the nation via our YouTube live feeds.' },
                { title: 'Elite Logistics',      desc: 'Transparent brackets and WhatsApp-integrated coordination.' },
                { title: 'Direct Rewards',       desc: 'No delays. Real PKR prize pools paid straight to the champions.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#dbb462] rounded-full flex-shrink-0 mt-1.5" />
                  <span className="text-[#d1c5b3] opacity-70 text-sm leading-relaxed">
                    <strong className="text-[#e2e2e2]">{title}:</strong> {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/image-1.jpg"
              alt="PUBG Mobile battle royale esports"
              loading="lazy"
              decoding="async"
              className="w-full h-80 object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-stretch text-[8px] text-[#f9d07a]">ZENITH ESPORTS</p>
              <h4 className="font-agency text-2xl font-black italic tracking-tighter">PAKISTAN REGION</h4>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
