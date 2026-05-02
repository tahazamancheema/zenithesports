import React, { useState } from 'react';
import { Trophy, Clock, Map as MapIcon, MessageCircle, ArrowRight, ShieldCheck, Gamepad2, Zap } from 'lucide-react';
import StaticBackground from '../components/ui/StaticBackground';

const ChickenIcon = ({ size = 18 }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M12 2c0 1.1-.9 2-2 2s-2-.9-2-2" />
    <path d="M18 13c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 1.7.7 3.2 1.8 4.2L6 22h12l-1.8-4.8c1.1-1 1.8-2.5 1.8-4.2z" />
    <path d="M12 7v2" />
    <circle cx="10" cy="11" r="1" />
    <circle cx="14" cy="11" r="1" />
  </svg>
);

const PRIZE_DISTRIBUTION = [
  { rank: '1st Place', amount: '2,100 PKR', sub: 'Winner', icon: 'trophy' },
  { rank: '2nd Place', amount: '1,000 PKR', sub: 'Runner Up', icon: 'trophy' },
  { rank: '3rd Place', amount: '700 PKR', sub: 'Top 3', icon: 'trophy' },
  { rank: '4th - 5th', amount: 'Retention', sub: 'Top 4-5', icon: 'trophy' },
  { rank: 'Per Chicken', amount: '150 PKR', sub: 'Bonus', icon: 'chicken' },
];

const SESSIONS = [
  {
    id: 's1',
    name: 'SESSION 1',
    tag: 'EVENING',
    time: '8:05 PM',
    maps: ['Erangel', 'Miramar', 'Erangel', 'Rondo']
  },
  {
    id: 's2',
    name: 'SESSION 2',
    tag: 'NIGHT',
    time: '10:30 PM',
    maps: ['Erangel', 'Miramar', 'Erangel', 'Rondo']
  },
  {
    id: 's3',
    name: 'SESSION 3',
    tag: 'LATE NIGHT',
    time: '12:45 AM',
    maps: ['Erangel', 'Miramar', 'Erangel', 'Rondo']
  }
];

const ADMINS = [
  { name: 'Admin 1', phone: '03390715753' },
  { name: 'Admin 2', phone: '03140679418' },
  { name: 'Admin 3', phone: '03163126525' },
];

export default function DailyScrimsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
      <StaticBackground variant="mesh" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Tactical Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-center">
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dbb462]/10 border border-[#dbb462]/20 text-[#dbb462] font-agency font-bold text-xs tracking-widest uppercase mb-4">
              <ShieldCheck size={12} />
              ZENITH'S OWN ECOSYSTEM
            </div>
            
            <h1 className="font-agency font-bold text-6xl md:text-9xl leading-tight uppercase tracking-tighter text-white py-4 px-2">
              DAILY <span className="zenith-gradient-text italic block md:inline pr-8">SCRIMS</span>
            </h1>
            
            <p className="font-body text-[#d1c5b3] text-xl opacity-60 max-w-xl leading-relaxed italic border-l-2 border-[#dbb462]/30 pl-6">
              Dominate the landscape. Join Pakistan's most prestigious daily competitive protocol and prove your squad's dominance in the server.
            </p>

            <div className="flex flex-wrap gap-6 pt-6">
              <div className="bg-[#111] border border-white/5 p-8 flex items-center gap-8 group hover:border-[#dbb462]/50 hover:bg-[#161616] transition-all duration-500 min-w-[300px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 blur-3xl group-hover:bg-[#dbb462]/10 transition-colors" />
                <div className="p-4 bg-[#dbb462]/10 border border-[#dbb462]/20 text-[#dbb462] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Trophy size={40} />
                </div>
                <div className="relative z-10">
                  <p className="font-agency text-white/30 text-xs tracking-[0.4em] uppercase mb-2">TOTAL PRIZE</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-bebas text-6xl md:text-7xl zenith-gradient-text leading-none tracking-tighter">5,000</p>
                    <p className="font-bebas text-2xl text-[#dbb462] opacity-80 tracking-widest">PKR</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111] border border-white/5 p-8 flex items-center gap-8 group hover:border-white/20 hover:bg-[#161616] transition-all duration-500 min-w-[300px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl" />
                <div className="p-4 bg-white/5 border border-white/10 text-white/40 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <Zap size={40} />
                </div>
                <div className="relative z-10">
                  <p className="font-agency text-white/30 text-xs tracking-[0.4em] uppercase mb-2">ENTRY FEE</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-bebas text-6xl md:text-7xl text-white leading-none tracking-tighter">300</p>
                    <p className="font-bebas text-2xl text-white/40 tracking-widest">PKR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[320px] aspect-[3/4] bg-[#111] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
              <img src="/battle-poster.png" alt="" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>

        {/* 1. Timings Block */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-[#dbb462]" />
            <h2 className="font-agency font-bold text-3xl text-white tracking-[0.2em] uppercase">SCRIM TIMINGS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SESSIONS.map((session) => (
              <div key={session.id} className="bg-[#111] border border-white/5 p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#dbb462]/5 blur-2xl group-hover:bg-[#dbb462]/10 transition-colors" />
                <p className="font-agency font-bold text-[#dbb462] tracking-[0.3em] text-[10px] uppercase mb-2">{session.tag}</p>
                <div className="flex justify-between items-center">
                  <h3 className="font-bebas text-5xl text-white tracking-widest leading-none">{session.time}</h3>
                  <Clock className="text-white/10 group-hover:text-[#dbb462]/40 transition-colors" size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Map Rotation Block */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-[#dbb462]" />
            <h2 className="font-agency font-bold text-3xl text-white tracking-[0.2em] uppercase">MAP ROTATION</h2>
          </div>

          <div className="bg-[#111] border border-white/5 relative overflow-hidden min-h-[400px] flex flex-col lg:flex-row">
            {/* Visual Side Block */}
            <div className="lg:w-1/2 relative min-h-[250px] lg:min-h-full">
              <img 
                src="/image-4.png" 
                alt="Map Rotation" 
                className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#111]/80 via-transparent to-[#111]" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="px-4 py-1 bg-[#dbb462] text-black font-agency font-bold text-xs tracking-widest inline-block mb-2">
                  MAP ROTATION
                </div>
                <p className="text-white/40 font-body text-xs italic">Current map rotation according to the standards of PUBG Mobile Official Esports.</p>
              </div>
            </div>

            {/* List Block */}
            <div className="flex-1 p-8 lg:p-12 bg-[#0d0d0d] relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Erangel', 'Miramar', 'Erangel', 'Rondo'].map((map, idx) => (
                  <div key={idx} className="group/map p-6 bg-white/[0.02] border border-white/5 hover:border-[#dbb462]/30 transition-all relative overflow-hidden">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-1 h-1 bg-[#dbb462] rounded-full" />
                        <span className="font-agency text-[10px] text-white/30 tracking-widest">MATCH 0{idx + 1}</span>
                      </div>
                      <h4 className="font-bebas text-3xl text-white tracking-widest uppercase group-hover/map:text-[#dbb462] transition-colors">{map}</h4>
                    </div>
                    {/* Tactical ID watermark */}
                    <span className="absolute -bottom-2 -right-2 font-bebas text-5xl text-white/[0.02] pointer-events-none group-hover/map:text-[#dbb462]/5 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="font-agency text-[10px] text-[#dbb462] tracking-[0.4em] uppercase font-bold opacity-40">
                  Matches follow standard lobby timing protocols
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Prizes & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Prize Distribution */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#dbb462]" />
              <h2 className="font-agency font-bold text-3xl text-white tracking-[0.2em] uppercase">PRIZE POOL</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {PRIZE_DISTRIBUTION.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center p-5 bg-[#111] border border-white/5 relative group hover:bg-[#1a1a1a] transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#dbb462]/10 border border-[#dbb462]/20 text-[#dbb462]">
                      {p.icon === 'chicken' ? <ChickenIcon size={20} /> : <Trophy size={18} />}
                    </div>
                    <div>
                      <p className="font-agency text-[10px] text-white/30 tracking-widest uppercase mb-0.5">{p.sub}</p>
                      <h4 className="font-bebas text-2xl text-white tracking-widest uppercase">{p.rank}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bebas text-3xl zenith-gradient-text tracking-wider">{p.amount}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#dbb462] group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Book Slots / Contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#dbb462]" />
              <h2 className="font-agency font-bold text-3xl text-[#dbb462] tracking-[0.2em] uppercase">BOOK SLOTS</h2>
            </div>
            
            <div className="bg-[#111] border border-[#dbb462]/20 p-8 relative overflow-hidden">
              <p className="font-body text-[#d1c5b3] text-lg opacity-70 leading-relaxed mb-10 italic">
                To book your slots, you can reach out to us on WhatsApp on the following contacts. Our admins are active 24/7 for support.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {ADMINS.map((admin, idx) => (
                  <a 
                    key={idx}
                    href={`https://wa.me/${admin.phone}?text=Hi,%20I%20want%20to%20book%20a%20slot%20for%20Daily%20Scrims.`}
                    target="_blank" rel="noreferrer"
                    className="group flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 hover:border-[#dbb462] hover:bg-[#dbb462] transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <p className="font-agency text-[10px] text-white/40 group-hover:text-black/60 tracking-widest uppercase mb-1">{admin.name}</p>
                      <p className="font-bebas text-2xl text-white group-hover:text-black tracking-widest transition-colors">{admin.phone}</p>
                    </div>
                    <div className="relative z-10 w-12 h-12 flex items-center justify-center bg-white/5 rounded-full group-hover:bg-black/10 transition-colors">
                      <MessageCircle className="text-[#dbb462] group-hover:text-black transition-colors" size={24} />
                    </div>
                    {/* Animated background slide */}
                    <div className="absolute inset-0 bg-[#dbb462] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
