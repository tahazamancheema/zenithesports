import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Trophy, Clock, Map as MapIcon, MessageCircle, ArrowRight, ShieldCheck, Gamepad2, Zap, Award, Target, Star } from 'lucide-react';
import StaticBackground from '../components/ui/StaticBackground';

const PRIZE_DATA = [
  { rank: '1st Place', amount: '2,100 PKR', sub: 'Winner', color: '#dbb462' },
  { rank: '2nd Place', amount: '1,000 PKR', sub: 'Runner Up', color: '#c0c0c0' },
  { rank: '3rd Place', amount: '700 PKR', sub: 'Top 3', color: '#cd7f32' },
  { rank: '4th - 6th', amount: 'Retention', sub: 'Top 4-6', color: '#666' },
  { rank: 'Per Chicken', amount: '150 PKR', sub: 'Bonus', color: '#dbb462' },
];

const TIMINGS = [
  { id: 1, title: 'Match 1', time: '8:05 PM', type: 'Prime' },
  { id: 2, title: 'Match 2', time: '10:30 PM', type: 'Night' },
  { id: 3, title: 'Late Night', time: '12:45 AM', type: 'Late' },
];

const MAPS = [
  { id: '01', name: 'ERANGEL', desc: 'The Classic Battlefield' },
  { id: '02', name: 'MIRAMAR', desc: 'Desert Domination' },
  { id: '03', name: 'ERANGEL', desc: 'The Classic Battlefield' },
  { id: '04', name: 'RONDO', desc: 'The Urban Protocol' },
];

const ADMINS = [
  { name: 'Admin 1', phone: '03390715753' },
  { name: 'Admin 2', phone: '03140679418' },
  { name: 'Admin 3', phone: '03163126525' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DailyScrimsPage() {
  const [activeMap, setActiveMap] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [800, 1500], [0, -100]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-rajdhani selection:bg-[#dbb462] selection:text-black pt-24 overflow-x-hidden">
      <StaticBackground variant="mesh" />
      
      {/* ── HERO SECTION ── */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8 z-10"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-[#dbb462]" />
              <span className="font-teko text-[#dbb462] tracking-[0.4em] uppercase text-sm">Zenith Official Protocol</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="font-teko text-7xl md:text-9xl font-bold leading-none uppercase"
            >
              DAILY <span className="text-[#dbb462] italic">SCRIMS</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-[#d1c5b3] text-lg md:text-xl max-w-xl leading-relaxed opacity-90 border-l-2 border-[#dbb462]/30 pl-6 italic"
            >
              Dominate the landscape. Join Pakistan's most prestigious daily competitive protocol and prove your squad's dominance in the server.
            </motion.p>

            {/* Stats Cards */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <div className="flex-1 min-w-[200px] glass-obsidian p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#dbb462]/5 blur-3xl group-hover:bg-[#dbb462]/10 transition-colors" />
                <p className="font-teko text-white/40 tracking-[0.3em] uppercase text-xs mb-2">Total Prize</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bebas text-5xl text-[#dbb462]">5,000</span>
                  <span className="font-bebas text-xl text-white/50 tracking-widest">PKR</span>
                </div>
              </div>

              <div className="flex-1 min-w-[200px] glass-obsidian p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl" />
                <p className="font-teko text-white/40 tracking-[0.3em] uppercase text-xs mb-2">Entry Fee</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bebas text-5xl text-white">300</span>
                  <span className="font-bebas text-xl text-white/50 tracking-widest">PKR</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Poster */}
          <motion.div 
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative lg:block"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto group">
              {/* Floating Shadow Glow */}
              <div className="absolute -inset-4 bg-[#dbb462]/10 blur-[60px] group-hover:bg-[#dbb462]/20 transition-all duration-700 animate-pulse" />
              
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full h-full border border-white/10 shadow-[0_0_80px_rgba(219,180,98,0.15)] overflow-hidden"
              >
                <img 
                  src="/assets/image-5.png" 
                  alt="Daily Scrims Poster" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                
                {/* Tactical Overlays */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#dbb462] rounded-full animate-pulse" />
                  <span className="font-teko text-white text-xs tracking-widest uppercase">Live Protocol Active</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── MATCH TIMELINE ── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-20"
          >
            <div className="shrink-0">
              <h2 className="font-teko text-5xl text-white tracking-widest uppercase">Scrim Timings</h2>
              <p className="font-teko text-[#dbb462] tracking-[0.4em] uppercase text-sm mt-1">Match Schedule</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {TIMINGS.map((match) => (
                <motion.div 
                  key={match.id}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(219, 180, 98, 0.05)' }}
                  className="bg-[#0a0a0a] border border-white/5 p-8 relative group cursor-default overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#dbb462]/5 blur-2xl group-hover:bg-[#dbb462]/10 transition-colors" />
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-teko text-white/40 tracking-[0.3em] uppercase text-xs">{match.title}</span>
                    <Clock size={16} className="text-[#dbb462] opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-bebas text-5xl text-white tracking-widest group-hover:text-[#dbb462] transition-colors">{match.time}</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-white/10 group-hover:bg-[#dbb462]/30 transition-colors" />
                    <span className="font-teko text-[10px] text-white/30 tracking-widest uppercase">{match.type} Protocol</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAP ROTATION PARALLAX ── */}
      <section className="relative py-32 overflow-hidden group">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute inset-0 z-0 scale-110 group-hover:scale-125 transition-transform duration-[3s] ease-out"
        >
          <img src="/assets/image-4.png" className="w-full h-full object-cover grayscale opacity-20" alt="" />
          <div className="absolute inset-0 bg-[#050505]/80" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-16"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-[#dbb462]" />
                <span className="font-teko text-[#dbb462] tracking-[0.4em] uppercase text-sm">Tactical Rotation</span>
              </div>
              <h2 className="font-teko text-6xl md:text-7xl font-bold text-white tracking-tighter uppercase leading-none">Map Rotation</h2>
              <p className="text-[#d1c5b3] tracking-[0.2em] uppercase text-xs font-bold opacity-60">
                OUTSKIRTS TO FALLEN STUDBAK'S LOBBY TIMING PROTOCOLS
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MAPS.map((map, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                onMouseEnter={() => setActiveMap(idx)}
                whileHover={{ y: -10 }}
                className={`relative p-10 border transition-all duration-500 cursor-default group/map ${
                  activeMap === idx ? 'bg-[#dbb462]/5 border-[#dbb462]/30' : 'bg-black/40 border-white/5 hover:border-[#dbb462]/30'
                }`}
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bebas text-lg text-[#dbb462] tracking-[0.2em]">Match {map.id}</span>
                    <MapIcon size={20} className={activeMap === idx ? 'text-[#dbb462]' : 'text-white/20'} />
                  </div>
                  <div>
                    <h4 className="font-bebas text-4xl text-white tracking-widest mb-1 group-hover/map:text-[#dbb462] transition-colors">{map.name}</h4>
                    <p className="font-teko text-white/30 text-[11px] tracking-widest uppercase">{map.desc}</p>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] bg-[#dbb462] transition-all duration-500 ${activeMap === idx ? 'w-full' : 'w-0'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE POOL PODIUM ── */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="font-teko text-6xl md:text-7xl font-bold text-white tracking-tighter uppercase mb-4">Prize Pool</h2>
            <div className="w-24 h-[2px] bg-[#dbb462] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {PRIZE_DATA.map((prize, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ x: 10, backgroundColor: 'rgba(219, 180, 98, 0.05)' }}
                className={`flex items-center justify-between p-6 md:p-8 bg-black border-l-4 group transition-all duration-500 overflow-hidden relative ${
                  idx === 0 ? 'border-[#dbb462]' : 'border-white/10 hover:border-[#dbb462]'
                }`}
              >
                <div className="flex items-center gap-8 relative z-10">
                  <div className="w-16 h-16 flex items-center justify-center bg-white/5 group-hover:bg-[#dbb462]/10 transition-colors">
                    {idx < 3 ? <Trophy size={28} color={prize.color} /> : <Award size={28} className="text-white/20 group-hover:text-[#dbb462]" />}
                  </div>
                  <div>
                    <span className="font-teko text-[#dbb462] tracking-[0.3em] uppercase text-xs font-bold">{prize.sub}</span>
                    <h3 className="font-bebas text-3xl md:text-4xl text-white tracking-widest uppercase">{prize.rank}</h3>
                  </div>
                </div>

                <div className="text-right relative z-10">
                  <span className="font-bebas text-4xl md:text-5xl text-white tracking-wider group-hover:text-[#dbb462] transition-colors">{prize.amount}</span>
                </div>

                {/* Animated Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOK SLOTS CTA ── */}
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#dbb462]/30 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1 border border-red-500/30 bg-red-500/5 text-red-500 font-teko text-xs tracking-[0.4em] uppercase">
                <Target size={14} className="animate-pulse" />
                Slots Filling Fast
              </div>
              <h2 className="font-teko text-6xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-none">Book Your Slot</h2>
              <p className="font-body text-[#d1c5b3] text-lg opacity-80 leading-relaxed italic max-w-2xl mx-auto">
                Secure your squad's presence. Contact our official admins directly on WhatsApp to verify slot availability and complete your registration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {ADMINS.map((admin, idx) => (
                <motion.a 
                  key={idx}
                  href={`https://wa.me/${admin.phone}?text=Hi,%20I%20want%20to%20book%20a%20slot%20for%20Daily%20Scrims.`}
                  target="_blank" rel="noreferrer"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col items-center gap-4 p-8 bg-black border border-white/5 hover:border-[#dbb462] transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-[#dbb462]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-16 h-16 rounded-sm bg-white/5 flex items-center justify-center group-hover:bg-[#dbb462] transition-all duration-500">
                    <MessageCircle className="text-[#dbb462] group-hover:text-black transition-colors" size={32} />
                  </div>
                  
                  <div className="text-center">
                    <p className="font-teko text-white/30 group-hover:text-white/60 tracking-widest uppercase text-xs mb-1 transition-colors">Admin Protocol {idx + 1}</p>
                    <p className="font-bebas text-3xl text-white group-hover:text-[#dbb462] transition-colors">{admin.phone}</p>
                  </div>
                  
                  <div className="absolute top-0 right-0 p-2">
                    <Star size={10} className="text-[#dbb462] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              ))}
            </div>
            
            <div className="pt-12">
              <p className="font-teko text-white/20 tracking-[0.5em] uppercase text-[10px] animate-pulse">
                Verification required for every booking session
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER SPACING ── */}
      <div className="h-20" />
    </div>
  );
}
