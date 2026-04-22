import React from 'react';
import { useTournamentCountdown } from '../hooks/useTournamentCountdown';
import { Clock, Zap } from 'lucide-react';

export default function RegistrationCountdown({ openDate, deadlineDate, compact = false }) {
  const { phase, days, hours, mins, secs } = useTournamentCountdown(openDate, deadlineDate);

  if (phase === 'closed' || phase === 'loading') return null;

  const label = phase === 'opening' ? 'REGISTRATION OPENS IN' : 'REGISTRATION CLOSES IN';
  const colorClass = phase === 'opening' ? 'text-[#f9d07a]' : 'text-emerald-400';

  if (compact) {
    const timeStr = days > 0 ? `${days}D ${hours}H` : `${hours}H ${mins}M`;
    return (
      <div className="bg-[#111] border border-white/5 p-4">
        <p className="font-teko text-[14px] tracking-widest text-[#dbb462] mb-1 uppercase">
          {label}
        </p>
        <p className={`font-bebas text-3xl tracking-tight ${colorClass}`}>
          {timeStr}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-[#dbb462]" />
        <span className="font-teko text-[16px] tracking-widest text-[#dbb462] uppercase">
          {label}
        </span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <CountdownUnit value={days}  label="DAYS" />
        <CountdownUnit value={hours} label="HRS" />
        <CountdownUnit value={mins}  label="MIN" />
        <CountdownUnit value={secs}  label="SEC" />
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-[#0e0e0e] border border-white/5 px-4 py-3 min-w-[70px]">
      <span className="font-bebas text-4xl text-[#dbb462] leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-teko text-[14px] tracking-widest text-[#d1c5b3] opacity-40 mt-1">
        {label}
      </span>
    </div>
  );
}
