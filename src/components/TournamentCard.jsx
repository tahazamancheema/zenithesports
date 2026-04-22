import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Trophy, ChevronRight, Calendar, MessageCircle } from 'lucide-react';
import RegistrationCountdown from './RegistrationCountdown';
import { useTournamentCountdown } from '../hooks/useTournamentCountdown';

export default function TournamentCard({ tournament, registrationCount = 0, isUserRegistered = false }) {
  const {
    id, title, description, start_date, registration_open_date,
    registration_deadline, status, max_teams, prize_pool,
    game = 'PUBG Mobile', poster_url,
  } = tournament;

  const { phase } = useTournamentCountdown(registration_open_date, registration_deadline);
  const slotsPercent = max_teams ? Math.min((registrationCount / max_teams) * 100, 100) : null;
  const isOpen = status === 'active' && phase === 'closing' && (!max_teams || registrationCount < max_teams);

  const statusConfig = {
    active:    { label: 'OPEN',      dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    upcoming:  { label: 'SOON',      dot: 'bg-[#f9d07a]',   text: 'text-[#f9d07a]',   border: 'border-[#f9d07a]/30' },
    completed: { label: 'FINISHED',  dot: 'bg-[#9a8f7f]',   text: 'text-[#9a8f7f]',   border: 'border-[#9a8f7f]/30' },
  };
  
  const currentStatus = (status === 'active' && phase === 'closed') ? 'completed' : status;
  const pill = statusConfig[currentStatus] || statusConfig.upcoming;

  const fmtDate = (d, opts) => d ? new Date(d).toLocaleDateString('en-PK', opts) : null;
  const startFormatted = fmtDate(start_date, { day: 'numeric', month: 'short' });
  const prizeFormatted = prize_pool ? `PKR ${Number(prize_pool).toLocaleString('en-PK')}` : null;

  return (
    <div className="group relative w-full bg-[#0e0e0e] border border-white/5 hover:border-[#dbb462]/40 transition-all duration-500 overflow-hidden flex flex-col h-full">
      
      {/* ── Banner/Poster Area ── */}
      <div className="relative aspect-[16/9] overflow-hidden group/poster">
        {poster_url ? (
          <img 
            src={poster_url} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover/poster:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-[#131313] flex items-center justify-center">
            <Trophy className="text-[#dbb462] opacity-10" size={64} />
          </div>
        )}
        
        {/* Technical Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#dbb462]/10 to-transparent h-1/2 w-full -translate-y-full group-hover/poster:animate-scanline pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[#dbb462]/5 opacity-0 group-hover/poster:opacity-100 transition-opacity pointer-events-none z-0" />

        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
        
        {/* Prize Badge */}
        <div className="absolute top-4 right-4 bg-[#0e0e0e]/90 backdrop-blur-md border border-[#dbb462]/30 px-3 py-2 flex flex-col items-center min-w-[100px]">
          <span className="font-teko text-[14px] text-[#dbb462] tracking-widest leading-none uppercase">Prize Pool</span>
          <span className="font-bebas text-2xl text-white leading-none mt-1">{prizeFormatted || 'TBA'}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
           <div className={`flex items-center gap-2 bg-[#0e0e0e]/90 backdrop-blur-md px-3 py-1.5 border ${pill.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pill.dot} ${status === 'active' && phase === 'closing' ? 'animate-pulse' : ''}`} />
              <span className={`font-teko text-[14px] tracking-widest uppercase ${pill.text}`}>
                {pill.label}
              </span>
            </div>
        </div>
      </div>

      {/* ── Info Content ── */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
             <span className="font-teko text-[16px] text-[#dbb462] tracking-widest uppercase">{game}</span>
             <div className="w-1 h-1 rounded-full bg-white/20" />
             <span className="font-teko text-[16px] text-[#d1c5b3] opacity-60 tracking-widest uppercase">{startFormatted || 'TBA'}</span>
          </div>

          <h3 className="font-bebas text-4xl mb-4 text-[#f2f2f2] group-hover:text-white transition-colors leading-tight line-clamp-1">
            {title}
          </h3>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
               <span className="font-teko text-[14px] text-[#d1c5b3] opacity-40 uppercase tracking-widest mb-1">Squads Joined</span>
               <div className="flex items-center gap-2">
                  <span className="font-bebas text-2xl text-white">{registrationCount}</span>
                  <span className="font-bebas text-xl text-white/30">/ {max_teams || '∞'}</span>
               </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#dbb462]/30 transition-colors">
               <ChevronRight size={20} className="text-[#dbb462] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Slots Progress */}
          <div className="w-full bg-white/5 h-1 relative overflow-hidden group-hover:bg-white/10 transition-colors">
             <div 
               className="absolute left-0 inset-y-0 zenith-gradient transition-all duration-1000"
               style={{ width: slotsPercent ? `${slotsPercent}%` : '0%' }}
             />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="space-y-3">
          <div className="flex gap-3">
            {isOpen && !isUserRegistered ? (
              <Link 
                to={`/register/${id}`} 
                className="btn-obsidian-primary flex-1 py-4 font-bebas text-2xl tracking-widest uppercase"
              >
                Register Squad
              </Link>
            ) : isUserRegistered ? (
              <div className="flex-1 bg-[#dbb462]/5 border border-[#dbb462]/20 text-[#dbb462] font-teko text-[22px] py-3 tracking-widest uppercase text-center">
                Squad Registered
              </div>
            ) : null}

            <Link 
              to={`/tournaments/${id}`} 
              className="btn-obsidian-ghost flex-1 py-4 font-bebas text-xl tracking-widest uppercase"
            >
              View Details
            </Link>
          </div>

          {phase === 'closed' && (
            <div className="w-full bg-[#dbb462]/5 border border-[#dbb462]/20 p-3 flex items-center justify-between gap-3 group/wa">
               <div className="flex items-center gap-2 min-w-0">
                 <MessageCircle size={14} className="text-[#dbb462] flex-shrink-0" />
                 <p className="font-teko text-[14px] tracking-widest text-[#d1c5b3] uppercase truncate leading-none">
                    Support: <span className="text-[#dbb462]">WhatsApp Unit</span>
                 </p>
               </div>
               <a href="https://wa.me/923390715753" target="_blank" rel="noreferrer" className="text-[12px] font-bold text-[#dbb462] hover:underline whitespace-nowrap leading-none">
                  JOIN →
               </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
