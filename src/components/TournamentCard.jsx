import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, MessageCircle } from 'lucide-react';
import { useTournamentCountdown } from '../hooks/useTournamentCountdown';

export default function TournamentCard({ tournament, registrationCount = 0, isUserRegistered = false }) {
  const {
    id, title, start_date, registration_open_date,
    registration_deadline, status, max_teams, prize_pool,
    game = 'PUBG Mobile', poster_url,
  } = tournament;

  const { phase } = useTournamentCountdown(registration_open_date, registration_deadline);
  const slotsPercent = max_teams ? Math.min((registrationCount / max_teams) * 100, 100) : null;
  const isOpen = status === 'active' && phase === 'closing' && (!max_teams || registrationCount < max_teams);

  const statusConfig = {
    active:      { label: 'OPEN',        dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    in_progress: { label: 'IN PROGRESS', dot: 'bg-[#dbb462]',  text: 'text-[#dbb462]',  border: 'border-[#dbb462]/30',   bg: 'bg-[#dbb462]/10' },
    upcoming:    { label: 'UPCOMING',    dot: 'bg-[#f9d07a]',  text: 'text-[#f9d07a]',  border: 'border-[#f9d07a]/30',   bg: 'bg-[#f9d07a]/10' },
    completed:   { label: 'COMPLETED',   dot: 'bg-[#9a8f7f]',  text: 'text-[#9a8f7f]',  border: 'border-[#9a8f7f]/30',   bg: 'bg-[#9a8f7f]/10' },
    closed:      { label: 'CLOSED',      dot: 'bg-red-400',    text: 'text-red-400',    border: 'border-red-500/30',      bg: 'bg-red-500/10' },
  };

  const currentStatus = (status === 'completed' || status === 'in_progress') ? status : (phase === 'closed' ? 'closed' : status);
  const pill = statusConfig[currentStatus] || statusConfig.upcoming;

  const startFormatted = start_date ? new Date(start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : null;
  const prizeFormatted = prize_pool ? `PKR ${Number(prize_pool).toLocaleString('en-PK')}` : null;

  return (
    <div className="group relative w-full bg-[#0e0e0e] border border-white/[0.06] hover:border-[#dbb462]/30 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Gold top edge on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#dbb462] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

      {/* ── Poster ── */}
      <Link to={`/tournaments/${id}`} className="relative aspect-[16/9] overflow-hidden block">
        {poster_url ? (
          <img src={poster_url} alt={title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-[#131313] flex items-center justify-center">
            <Trophy className="text-[#dbb462] opacity-[0.06]" size={80} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`flex items-center gap-2 ${pill.bg} backdrop-blur-md px-3 py-1.5 border ${pill.border}`}>
            <span className={`w-1.5 h-1.5 ${pill.dot} ${status === 'active' && phase === 'closing' ? 'animate-pulse' : ''}`} />
            <span className={`font-teko text-[13px] tracking-[0.2em] uppercase ${pill.text}`}>{pill.label}</span>
          </div>
        </div>

        {/* Prize overlay */}
        {prizeFormatted && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-[#0e0e0e]/90 backdrop-blur-md border border-[#dbb462]/20 px-4 py-2">
              <span className="font-bebas text-2xl text-[#dbb462] leading-none">{prizeFormatted}</span>
            </div>
          </div>
        )}
      </Link>

      {/* ── Content ── */}
      <div className="p-6 md:p-8 flex-1 flex flex-col relative">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-teko text-[14px] text-[#dbb462] tracking-[0.15em] uppercase">{game}</span>
          {startFormatted && (
            <>
              <div className="w-1 h-1 bg-white/20" />
              <span className="font-teko text-[14px] text-[#d1c5b3] opacity-50 tracking-[0.15em] uppercase">{startFormatted}</span>
            </>
          )}
        </div>

        {/* Title */}
        <Link to={`/tournaments/${id}`}>
          <h3 className="font-bebas text-4xl text-[#f2f2f2] group-hover:text-white transition-colors leading-tight line-clamp-1 uppercase mb-6">
            {title}
          </h3>
        </Link>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-[1px] bg-white/[0.04] mb-6">
          <div className="bg-[#0e0e0e] py-3 px-4">
            <span className="font-teko text-[11px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase block mb-1">Squads</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bebas text-xl text-white leading-none">{registrationCount}</span>
              <span className="font-teko text-sm text-white/25 tracking-wider uppercase">/ {max_teams || '∞'}</span>
            </div>
          </div>
          <div className="bg-[#0e0e0e] py-3 px-4">
            <span className="font-teko text-[11px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase block mb-1">Prize Pool</span>
            <span className="font-bebas text-xl text-[#dbb462] leading-none">{prizeFormatted || 'TBA'}</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-8">
          <div className="h-[2px] bg-white/[0.06] relative overflow-hidden">
            <div
              className="absolute left-0 inset-y-0 zenith-gradient transition-all duration-1000"
              style={{ width: slotsPercent ? `${slotsPercent}%` : '0%' }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-3">
          <div className="flex gap-3">
            {isOpen && !isUserRegistered ? (
              <Link
                to={`/register/${id}`}
                className="btn-obsidian-primary flex-1 py-4 font-bebas text-[20px] tracking-[0.15em] uppercase"
              >
                REGISTER SQUAD
              </Link>
            ) : isUserRegistered ? (
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-teko text-[18px] py-3.5 tracking-[0.15em] uppercase text-center flex items-center justify-center">
                SQUAD REGISTERED ✓
              </div>
            ) : null}

            <Link
              to={`/tournaments/${id}`}
              className="btn-obsidian-ghost px-5 py-4"
            >
              <ChevronRight size={20} className="text-[#dbb462]" />
            </Link>
          </div>

          {phase === 'closed' && (
            <a
              href="https://wa.me/923390715753"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#dbb462]/[0.04] border border-[#dbb462]/15 p-3 flex items-center gap-3 hover:bg-[#dbb462]/[0.08] transition-colors"
            >
              <MessageCircle size={14} className="text-[#dbb462] flex-shrink-0" />
              <p className="font-teko text-[13px] tracking-[0.15em] text-[#d1c5b3] uppercase flex-1">
                Registrations closed — contact for queries
              </p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
