import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Trophy, ChevronRight, Calendar, Star } from 'lucide-react';
import RegistrationCountdown from './RegistrationCountdown';

export default function TournamentCard({ tournament, registrationCount = 0, isUserRegistered = false }) {
  const {
    id, title, description, start_date, registration_open_date,
    registration_deadline, status, max_teams, prize_pool,
    game = 'PUBG Mobile', poster_url,
  } = tournament;

  const slotsPercent = max_teams ? Math.min((registrationCount / max_teams) * 100, 100) : null;
  const isOpen = status === 'active' && (!max_teams || registrationCount < max_teams);

  const statusConfig = {
    active:    { label: 'REGISTRATIONS OPEN', dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    upcoming:  { label: 'COMING SOON',        dot: 'bg-[#f9d07a]',   text: 'text-[#f9d07a]',   border: 'border-[#f9d07a]/30' },
    completed: { label: 'COMPLETED',          dot: 'bg-[#9a8f7f]',   text: 'text-[#9a8f7f]',   border: 'border-[#9a8f7f]/30' },
  };
  const pill = statusConfig[status] || statusConfig.upcoming;

  const fmtDate = (d, opts) => d ? new Date(d).toLocaleDateString('en-PK', opts) : null;
  const startFormatted    = fmtDate(start_date,             { day: 'numeric', month: 'short', year: 'numeric' });
  const deadlineFormatted = fmtDate(registration_deadline,  { day: 'numeric', month: 'short', year: 'numeric' });
  const regOpenFormatted  = fmtDate(registration_open_date, { day: 'numeric', month: 'short' });
  const prizeFormatted    = prize_pool ? `PKR ${Number(prize_pool).toLocaleString('en-PK')}` : null;

  return (
    <div className="group relative w-full rounded-sm overflow-hidden flex flex-col md:flex-row min-h-[360px] bg-[#0e0e0e] border border-[rgba(78,70,56,0.3)] hover:border-[#dbb462]/60 hover:shadow-[0_0_40px_rgba(219,180,98,0.1)] transition-all duration-500">
      
      {/* ── Background Poster Image (Full cover with heavy vignette) ── */}
      <div className="absolute inset-0 z-0">
        {poster_url ? (
          <img src={poster_url} alt={title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 group-hover:rotate-1 transition-all duration-1000 ease-out" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#0e0e0e]">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(219,180,98,1) 1px, transparent 1px), linear-gradient(90deg, rgba(219,180,98,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <Trophy className="text-[#dbb462]" style={{ opacity: 0.1 }} size={120} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
      </div>

      {/* ── Left Content (Text & Chips) ── */}
      <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex items-center gap-2 bg-[#0e0e0e]/90 backdrop-blur-md px-3 py-1.5 border ${pill.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pill.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
              <span className={`font-stretch text-[8px] tracking-widest uppercase ${pill.text}`}>{pill.label}</span>
            </div>
            <span className="font-stretch text-[10px] tracking-widest text-[#dbb462] opacity-80 uppercase px-3 py-1.5 bg-[#dbb462]/10 border border-[#dbb462]/20">
              {game}
            </span>
          </div>

          <h3 className="font-agency text-4xl md:text-6xl font-bold italic tracking-tighter leading-none mb-3 text-[#e2e2e2] group-hover:text-white transition-colors uppercase drop-shadow-md">
            {title}
          </h3>
          
          {description && (
            <p className="text-[#d1c5b3] text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-8 max-w-2xl" style={{ opacity: 0.6 }}>
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 mb-8">
            {startFormatted && (
              <div className="flex gap-3 items-center backdrop-blur-sm bg-black/30 p-3 border border-white/5 rounded-sm">
                <Calendar size={18} className="text-[#dbb462]" />
                <div>
                  <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] opacity-50 uppercase">MAIN EVENT</p>
                  <p className="font-agency text-lg font-bold text-[#e2e2e2] leading-none mt-1">{startFormatted}</p>
                </div>
              </div>
            )}
            {deadlineFormatted && (
              <div className="flex gap-3 items-center backdrop-blur-sm bg-black/30 p-3 border border-white/5 rounded-sm">
                <Clock size={18} className="text-[#dbb462]" />
                <div>
                  <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] opacity-50 uppercase">REG. CLOSES</p>
                  <p className="font-agency text-lg font-bold text-[#e2e2e2] leading-none mt-1">{deadlineFormatted}</p>
                </div>
              </div>
            )}
            {regOpenFormatted && !startFormatted && (
              <div className="flex gap-3 items-center backdrop-blur-sm bg-black/30 p-3 border border-white/5 rounded-sm">
                <Star size={18} className="text-[#dbb462]" />
                <div>
                  <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] opacity-50 uppercase">REG. OPENS</p>
                  <p className="font-agency text-lg font-bold text-[#e2e2e2] leading-none mt-1">{regOpenFormatted}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full">
          {isOpen && !isUserRegistered && (
            <Link to={`/register/${id}`} className="inline-flex flex-1 md:flex-none relative group/btn overflow-hidden">
              <div className="absolute inset-0 zenith-gradient opacity-100 group-hover/btn:opacity-90 transition-opacity" />
              <div className="relative w-full z-10 font-stretch text-[11px] tracking-widest text-[#402d00] py-4 px-12 text-center items-center justify-center flex font-bold shadow-[0_0_15px_rgba(219,180,98,0.5)] whitespace-nowrap">
                PROCESS REGISTRATION <ChevronRight size={14} className="ml-2" strokeWidth={3} />
              </div>
            </Link>
          )}

          {isUserRegistered && (
            <div className="inline-flex justify-center flex-1 md:flex-none border border-[#dbb462]/30 text-[#dbb462] bg-[#dbb462]/10 font-stretch text-[10px] tracking-widest py-4 px-8 uppercase whitespace-nowrap">
              ENTRY SUBMITTED
            </div>
          )}

          <Link to={`/tournaments/${id}`} className="inline-flex justify-center flex-1 md:flex-none border border-[#dbb462]/30 text-[#dbb462] bg-[#dbb462]/5 font-stretch text-[10px] tracking-widest py-4 px-8 hover:bg-[#dbb462]/10 transition-colors uppercase whitespace-nowrap">
            VIEW DETAILS
          </Link>
        </div>
      </div>

      {/* ── Right Panel (Stats Block) ── */}
      <div className="relative z-10 w-full md:w-72 bg-gradient-to-b from-[#111] to-[#0a0a0a] border-t md:border-t-0 md:border-l border-[rgba(78,70,56,0.3)] shadow-2xl flex flex-col justify-center p-8 backdrop-blur-xl">
        
        <div className="mb-8">
          <p className="flex items-center gap-2 font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-50 uppercase mb-2">
            <Trophy size={12} className="text-[#f9d07a]" /> PRIZE POOL
          </p>
          <div className="font-agency text-4xl xl:text-5xl font-black italic tracking-tighter zenith-gradient-text drop-shadow-[0_0_15px_rgba(219,180,98,0.3)]">
            {prizeFormatted || 'TBA'}
          </div>
        </div>

        <div className="w-12 h-px bg-[rgba(78,70,56,0.3)] mb-8" />

        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <p className="flex items-center gap-2 font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-50 uppercase">
              <Users size={12} className="text-[#f9d07a]" /> TEAMS REGISTERED
            </p>
            {slotsPercent !== null && (
              <span className="font-stretch text-[9px] tracking-widest text-[#f9d07a] font-bold">{Math.round(slotsPercent)}%</span>
            )}
          </div>
          
          <div className="w-full bg-[#1a1a1a] h-2 rounded-sm mb-3 overflow-hidden border border-[#2a2a2a]">
            {slotsPercent !== null ? (
              <div className="zenith-gradient h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(219,180,98,0.5)]" style={{ width: `${slotsPercent}%` }} />
            ) : (
              <div className="zenith-gradient h-full w-full opacity-50 animate-pulse" />
            )}
          </div>
          
          <div className="font-agency text-2xl font-bold tracking-tight">
            {max_teams ? (
              <>
                <span className="text-white">{registrationCount}</span>
                <span className="text-[#d1c5b3] opacity-40"> / {max_teams}</span>
              </>
            ) : (
              <span className="text-[#dbb462]">{registrationCount} CURRENTLY</span>
            )}
          </div>
        </div>

        {(isOpen || status === 'upcoming') && (
          <RegistrationCountdown 
            openDate={registration_open_date} 
            deadlineDate={registration_deadline} 
            compact={true} 
          />
        )}
      </div>

    </div>
  );
}
