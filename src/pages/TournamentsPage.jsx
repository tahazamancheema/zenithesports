import React, { useState, useEffect } from 'react';
import TournamentCard from '../components/TournamentCard';
import { useTournaments } from '../hooks/useTournaments';
import { supabase } from '../supabase/config';
import { AlertTriangle, RefreshCw, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const FILTERS = [
  { label: 'ALL',       value: 'all' },
  { label: 'ACTIVE',    value: 'active' },
  { label: 'UPCOMING',  value: 'upcoming' },
  { label: 'COMPLETED', value: 'completed' },
];

export default function TournamentsPage() {
  const { user } = useAuth();
  const { tournaments, loading, error, refetch } = useTournaments();
  const [regCounts, setRegCounts] = useState({});
  const [userRegs, setUserRegs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase
      .from('registrations')
      .select('tournament_id, status')
      .neq('status', 'rejected')
      .then(({ data }) => {
        if (!data) return;
        const counts = {};
        data.forEach((r) => {
          if (r.status === 'approved') {
            counts[r.tournament_id] = (counts[r.tournament_id] || 0) + 1;
          }
        });
        setRegCounts(counts);
      });

    if (user?.id) {
      supabase
        .from('registrations')
        .select('tournament_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setUserRegs(data.map(r => r.tournament_id));
        });
    }
  }, [user?.id]);

  const filtered = tournaments.filter((t) => filter === 'all' || t.status === filter);
  const getRegCount = (id) => regCounts[id] || 0;

  // Count by status for filter badges
  const countByStatus = {
    all: tournaments.length,
    active: tournaments.filter(t => t.status === 'active').length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    completed: tournaments.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 animate-page-enter">

      {/* ── Hero ── */}
      <section className="relative py-28 md:py-40 px-6 lg:px-16 bg-[#0e0e0e] overflow-hidden border-b border-white/[0.04]">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(219,180,98,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(219,180,98,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0e0e0e]" />

        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[2px] bg-[#dbb462]" />
            <span className="font-teko text-[16px] tracking-[0.25em] text-[#dbb462] uppercase font-medium">Browse & Register</span>
          </div>
          <h1 className="font-bebas text-7xl md:text-[11rem] tracking-tight leading-[0.82] mb-8 uppercase">
            <span className="text-[#f2f2f2]">ALL </span>
            <span className="zenith-gradient-text">TOURNAMENTS</span>
          </h1>
          <p className="font-body text-[#d1c5b3] opacity-40 max-w-lg text-lg leading-relaxed font-medium">
            Browse and join our tournaments. Register your team and compete for the top spots.
          </p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="container mx-auto max-w-7xl px-6 lg:px-16">
          <div className="flex items-center justify-between py-4 gap-6 overflow-x-auto no-scrollbar">
            <div className="flex gap-[1px] bg-white/[0.04]">
              {FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`
                    font-teko text-[15px] tracking-[0.2em] px-6 md:px-8 py-3 transition-all duration-300 uppercase whitespace-nowrap relative
                    ${filter === value
                      ? 'bg-[#dbb462] text-[#402d00]'
                      : 'bg-[#0e0e0e] text-[#d1c5b3] opacity-40 hover:opacity-100 hover:bg-[#111]'
                    }
                  `}
                >
                  {label}
                  {countByStatus[value] > 0 && (
                    <span className={`ml-2 text-[12px] ${filter === value ? 'text-[#402d00]/60' : 'text-[#dbb462]'}`}>
                      {countByStatus[value]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <span className="font-teko text-[14px] tracking-[0.2em] text-[#d1c5b3] opacity-30 uppercase hidden md:block shrink-0">
              {filtered.length} {filtered.length === 1 ? 'TOURNAMENT' : 'TOURNAMENTS'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="container mx-auto max-w-7xl px-6 lg:px-16 py-16 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0e0e0e] aspect-[3/4] animate-pulse border border-white/[0.04]" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <AlertTriangle className="text-red-500 mb-6" size={48} />
            <p className="font-bebas text-5xl text-white mb-4">FAILED TO SYNC</p>
            <p className="font-body text-[#d1c5b3] opacity-40 mb-12 max-w-sm">{error}</p>
            <button onClick={refetch} className="btn-obsidian-ghost px-12 py-4 font-bebas text-xl tracking-widest">
              <RefreshCw size={18} className="mr-3" /> RETRY
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40 flex flex-col items-center">
            <Trophy className="text-[#dbb462] opacity-[0.06] mb-8" size={80} />
            <p className="font-bebas text-6xl text-white opacity-10 mb-3 uppercase">NO RECORDS</p>
            <p className="font-teko text-[16px] tracking-[0.2em] text-[#dbb462] opacity-40 uppercase">
              {filter === 'all' ? 'STAY TUNED FOR UPDATES' : `NO ${filter.toUpperCase()} EVENTS`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                registrationCount={getRegCount(t.id)}
                isUserRegistered={userRegs.includes(t.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
