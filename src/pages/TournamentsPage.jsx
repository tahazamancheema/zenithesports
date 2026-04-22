import React, { useState } from 'react';
import TournamentCard from '../components/TournamentCard';
import { useTournaments } from '../hooks/useTournaments';
import { supabase } from '../supabase/config';
import { AlertTriangle, RefreshCw } from 'lucide-react';
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
  const [regCounts, setRegCounts] = React.useState({});
  const [userRegs, setUserRegs] = React.useState([]);
  const [filter, setFilter] = useState('all');

  // Fetch registration counts and user's own registrations
  React.useEffect(() => {
    // 1. All counts for display
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

    // 2. Current user's joined tournaments
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

  return (
    <div className="min-h-screen bg-[#131313] pt-20 animate-page-enter">

      {/* Hero */}
      <section className="relative py-32 px-6 md:px-12 bg-[#0e0e0e] overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-10 grayscale hover:grayscale-0 transition-all duration-[3s]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80&fm=webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
        <div className="relative z-10">
          <span className="font-teko text-[#dbb462] text-[18px] tracking-[0.1em] block mb-4 uppercase">
            GLOBAL CIRCUIT &bull; ARCHIVE
          </span>
          <h1 className="font-bebas text-8xl md:text-[140px] tracking-tight leading-none mb-8 uppercase zenith-gradient-text pr-2">
             TOURNAMENTS
          </h1>
          <p className="font-body text-[#d1c5b3] opacity-40 max-w-lg text-lg leading-relaxed">
            The proving ground for Pakistani talent. Register your squad, climb the ranks, and forge your legacy.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="px-6 md:px-12 py-12 bg-[#131313] border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-sm">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`
                  font-teko text-[16px] tracking-widest px-8 py-2 transition-all duration-300
                  ${filter === value
                    ? 'bg-[#dbb462] text-[#402d00]'
                    : 'text-[#d1c5b3] opacity-40 hover:opacity-100 hover:bg-white/5'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
             <div className="w-12 h-px bg-white/10" />
             <span className="font-teko text-[18px] tracking-[0.1em] text-[#dbb462] opacity-80 uppercase">
                {filtered.length} ACTIVE INTEL
             </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 md:px-12 py-20 pb-40">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1a1a1a] aspect-[3/4] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <AlertTriangle className="text-red-500 mb-6" size={48} />
            <p className="font-bebas text-5xl text-white mb-4">FAILED TO SYNC</p>
            <p className="font-body text-[#d1c5b3] opacity-40 mb-12 max-w-sm">{error}</p>
            <button
              onClick={refetch}
              className="btn-obsidian-ghost px-12 py-4"
            >
              <RefreshCw size={18} className="mr-3" /> RETRY CONNECTION
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40 flex flex-col items-center">
            <p className="font-bebas text-6xl text-white opacity-10 mb-2">NO RECORDS FOUND</p>
            <p className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462] opacity-40">
              {filter === 'all' ? 'STAY TUNED FOR UPDATES' : `NO ${filter.toUpperCase()} EVENTS`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
