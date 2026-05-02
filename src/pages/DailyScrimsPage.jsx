import React, { useState } from 'react';
import { Trophy, Clock, Map as MapIcon, MessageCircle, ArrowRight, ShieldCheck, Gamepad2, Zap } from 'lucide-react';
import StaticBackground from '../components/ui/StaticBackground';

const PRIZE_DISTRIBUTION = [
  { rank: '1st Place', amount: '2,100 PKR', sub: 'Winner' },
  { rank: '2nd Place', amount: '1,000 PKR', sub: 'Runner Up' },
  { rank: '3rd Place', amount: '700 PKR', sub: 'Top 3' },
  { rank: '4th - 5th', amount: 'Retention', sub: 'Qualifiers' },
  { rank: 'Per Chicken', amount: '150 PKR', sub: 'Bonus' },
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
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 relative overflow-hidden">
      <StaticBackground variant="mesh" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-[#dbb462]/20 to-transparent border-l-4 border-[#dbb462] text-[#dbb462] font-agency font-bold text-lg tracking-[0.2em] uppercase">
              <Gamepad2 size={20} className="animate-pulse" />
              DAILY COMPETITIVE CIRCUIT
            </div>
            
            <div className="space-y-2">
              <h1 className="font-agency font-bold text-7xl md:text-9xl leading-none uppercase tracking-tighter">
                DAILY <span className="zenith-gradient-text">SCRIMS</span>
              </h1>
              <div className="h-1 w-32 zenith-gradient" />
            </div>
            
            <p className="font-body text-[#d1c5b3] text-xl opacity-60 max-w-xl leading-relaxed italic">
              Pakistan's most active daily scrims. Professional lobby management, consistent schedules, and instant prize payouts.
            </p>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="bg-[#111] border border-white/10 p-6 min-w-[240px] flex items-center gap-6 group hover:border-[#dbb462]/30 transition-colors">
                <div className="w-14 h-14 bg-[#dbb462]/10 border border-[#dbb462]/20 flex items-center justify-center text-[#dbb462]">
                  <Trophy size={32} />
                </div>
                <div>
                  <p className="font-agency text-white/30 text-xs tracking-[0.3em] uppercase mb-1">Prize Pool</p>
                  <p className="font-bebas text-5xl tracking-wider zenith-gradient-text">5,000 <span className="text-xl opacity-40">PKR</span></p>
                </div>
              </div>

              <div className="bg-[#111] border border-white/10 p-6 min-w-[240px] flex items-center gap-6 group hover:border-white/30 transition-colors">
                <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                  <Zap size={32} />
                </div>
                <div>
                  <p className="font-agency text-white/30 text-xs tracking-[0.3em] uppercase mb-1">Entry Fee</p>
                  <p className="font-bebas text-5xl tracking-wider text-white">300 <span className="text-xl text-white/40">PKR</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] shrink-0">
            <div className="aspect-[3/4] bg-[#111] border border-white/10 shadow-2xl overflow-hidden">
              <img 
                src="/battle-poster.png" 
                alt="Daily Battle" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          
          {/* Timings */}
          <div className="bg-[#111] border border-white/5 p-10 relative overflow-hidden group transition-all hover:border-[#dbb462]/20">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#dbb462] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <h2 className="font-agency font-bold text-4xl text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
              <Clock className="text-[#dbb462] group-hover:rotate-12 transition-transform" size={28} />
              SCRIM TIMINGS
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { label: 'SESSION 01', time: '08:05 PM' },
                { label: 'SESSION 02', time: '10:30 PM' },
                { label: 'SESSION 03', time: '12:45 AM' }
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group/item">
                  <span className="font-agency font-bold text-white/40 tracking-[0.3em] uppercase">{s.label}</span>
                  <span className="font-bebas text-4xl text-white tracking-widest group-hover/item:text-[#dbb462] transition-colors">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Rotation */}
          <div className="bg-[#111] border border-white/5 p-10 relative overflow-hidden group transition-all hover:border-[#dbb462]/20">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#dbb462] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            <h2 className="font-agency font-bold text-4xl text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
              <MapIcon className="text-[#dbb462] group-hover:scale-110 transition-transform" size={28} />
              MAP ROTATION
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { m: '01', name: 'Erangel' },
                { m: '02', name: 'Miramar' },
                { m: '03', name: 'Erangel' },
                { m: '04', name: 'Rondo' }
              ].map((m, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group/map">
                  <p className="font-agency text-[10px] text-[#dbb462] tracking-[0.3em] uppercase mb-2">MATCH {m.m}</p>
                  <p className="font-bebas text-3xl text-white tracking-widest uppercase group-hover/map:translate-x-1 transition-transform">{m.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="font-body text-[#d1c5b3] text-sm opacity-40 italic flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#dbb462] animate-pulse" />
                Standard rotation applies to all active sessions.
              </p>
            </div>
          </div>

        </div>

        {/* Rewards & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Prizes */}
          <div className="bg-[#111] border border-white/5 p-8">
            <h3 className="font-agency font-bold text-3xl text-white mb-8 tracking-widest uppercase flex items-center gap-3">
              <Trophy className="text-[#dbb462]" size={24} />
              PRIZE DISTRIBUTION
            </h3>
            <div className="space-y-4">
              {PRIZE_DISTRIBUTION.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-white/[0.05] last:border-0">
                  <div>
                    <p className="font-agency text-[10px] text-white/40 uppercase tracking-widest mb-0.5">{p.sub}</p>
                    <p className="font-bebas text-xl text-white tracking-widest uppercase">{p.rank}</p>
                  </div>
                  <span className="font-bebas text-2xl text-[#dbb462]">{p.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#161616] border border-[#dbb462]/20 p-8">
            <h3 className="font-agency font-bold text-3xl text-[#dbb462] mb-4 tracking-widest uppercase flex items-center gap-3">
              <MessageCircle size={24} />
              CONTACT ADMIN
            </h3>
            <p className="font-body text-[#d1c5b3] opacity-60 text-sm mb-8 leading-relaxed">
              Slots are limited. Send a message on WhatsApp to any of our admins to book your slot for the daily scrims.
            </p>
            <div className="space-y-3">
              {ADMINS.map((admin, idx) => (
                <a 
                  key={idx}
                  href={`https://wa.me/${admin.phone}?text=Hi,%20I%20want%20to%20book%20a%20slot%20for%20Daily%20Scrims.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 hover:border-[#dbb462]/40 transition-all group"
                >
                  <div>
                    <p className="font-agency text-[10px] text-white/40 uppercase tracking-widest mb-1">{admin.name}</p>
                    <p className="font-bebas text-2xl text-white tracking-widest">{admin.phone}</p>
                  </div>
                  <ArrowRight size={18} className="text-[#dbb462] opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-white/20">
              <ShieldCheck size={16} />
              <span className="font-agency text-[10px] uppercase tracking-widest font-bold">Zenith Professional Lobby Protocol</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
