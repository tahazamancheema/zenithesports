import React from 'react';
import { Users, Trophy, Server, TrendingUp } from 'lucide-react';
import { usePlatformStats } from '../hooks/usePlatformStats';

/**
 * StatStrip — horizontal bar with key platform stats.
 * Props: stats = [] (optional override)
 */
export default function StatStrip({ overrideStats = null }) {
  const platformStats = usePlatformStats();

  const activeStats = overrideStats || [
    { label: 'ACTIVE PLAYERS', value: platformStats.activePlayers, icon: Users },
    { label: 'PRIZE POOLS', value: platformStats.prizePools, icon: Trophy },
    { label: 'TOURNAMENTS RUN', value: platformStats.tournamentsRun, icon: TrendingUp },
    { label: 'REGION', value: 'PAKISTAN', icon: Server, pulse: true },
  ];

  return (
    <div className="bg-[#0e0e0e] grid grid-cols-2 md:grid-cols-4 border-b border-[rgba(78,70,56,0.2)] shadow-xl relative z-20">
      {activeStats.map(({ label, value, icon: Icon, pulse }, idx) => (
        <div
          key={label}
          className={`
            p-6 lg:p-8 flex flex-col gap-2
            ${idx % 2 === 1 ? 'bg-[#141414]' : 'bg-[#0e0e0e]'}
            border-r border-[rgba(78,70,56,0.15)] last:border-r-0
            hover:bg-[#1a1a1a] transition-colors
          `}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon size={16} className="text-[#dbb462]" />}
            <span className="font-teko text-[16px] text-[#dbb462] tracking-[0.2em] font-medium uppercase">
              {label}
            </span>
          </div>
          <span className={`font-bebas text-4xl lg:text-5xl tracking-tight ${pulse ? 'text-emerald-400 flex items-center gap-3' : 'text-white'}`}>
            {pulse && (
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse inline-block shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            )}
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
