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
      <div className="bg-[#181818] border border-[rgba(78,70,56,0.2)] p-4 rounded-sm">
        <p className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] opacity-50 mb-1 uppercase">
          {label}
        </p>
        <p className={`font-agency text-2xl font-bold italic tracking-wider ${colorClass}`}>
          {timeStr}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={13} className="text-[#dbb462]" />
        <span className="font-stretch text-[8px] tracking-widest text-[#d1c5b3]" style={{ opacity: 0.5 }}>
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
    <div className="flex flex-col items-center bg-[#0e0e0e] border border-[rgba(78,70,56,0.25)] px-4 py-3 min-w-[60px]">
      <span className="font-agency text-3xl font-bold text-[#f9d07a] leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-stretch text-[7px] tracking-widest text-[#d1c5b3] mt-1" style={{ opacity: 0.4 }}>
        {label}
      </span>
    </div>
  );
}
