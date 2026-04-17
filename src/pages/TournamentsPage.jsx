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
      <section className="relative py-24 px-6 md:px-12 bg-[#1b1b1b] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80&fm=webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] to-transparent" />
        <div className="relative z-10">
          <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">
            COMPETITIVE CIRCUIT
          </span>
          <h1 className="font-agency text-6xl md:text-8xl font-black italic tracking-tighter leading-tight pb-2 pr-4 mb-6">
            TOURNAMENTS
          </h1>
          <p className="text-[#d1c5b3] opacity-60 max-w-lg text-base leading-relaxed">
            Pakistan ke top PUBG Mobile tournaments. Register your team and compete for glory and prize money.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="px-6 md:px-12 py-8 bg-[#131313] border-b border-[rgba(78,70,56,0.15)]">
        <div className="flex gap-1 flex-wrap items-center">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`
                font-stretch text-[10px] tracking-widest px-6 py-3 transition-all duration-200
                ${filter === value
                  ? 'bg-[#f9d07a] text-[#402d00]'
                  : 'text-[#d1c5b3] opacity-50 hover:opacity-100 hover:bg-[#1f1f1f]'
                }
              `}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-30 self-center">
            {filtered.length} TOURNAMENT{filtered.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {/* List */}
      <section className="px-6 md:px-12 py-12">
        {loading ? (
          /* Skeleton loaders */
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1f1f1f] h-52 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <AlertTriangle className="text-[#ffb4ab] mb-4" size={40} />
            <p className="font-agency text-3xl font-bold italic tracking-tighter text-[#d1c5b3] mb-2">
              FAILED TO LOAD
            </p>
            <p className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-40 mb-8">
              {error}
            </p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 border border-[rgba(78,70,56,0.3)] px-6 py-3 font-stretch text-[10px] tracking-widest text-[#d1c5b3] hover:bg-[#2a2a2a] transition-colors"
            >
              <RefreshCw size={12} /> RETRY
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-agency text-4xl font-bold italic tracking-tighter text-[#d1c5b3] opacity-20 mb-4">
              NO TOURNAMENTS
            </p>
            <p className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-20">
              {filter === 'all' ? 'CHECK BACK SOON' : `NO ${filter.toUpperCase()} TOURNAMENTS`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
