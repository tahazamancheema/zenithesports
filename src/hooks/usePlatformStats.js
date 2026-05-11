import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { useTournaments } from './useTournaments';

// Social channel reach baseline (YouTube + Instagram + WhatsApp + misc)
const BASE_PLAYERS = 3000 + 2400 + 4700 + 67;

// Historical prize pool offset (before tournaments were tracked in DB)
const BASE_PRIZE_PKR = 175_000;

export function usePlatformStats() {
  const [totalPlayers, setTotalPlayers] = useState(BASE_PLAYERS);
  const [totalPrize, setTotalPrize] = useState(BASE_PRIZE_PKR);
  const { tournaments } = useTournaments();

  useEffect(() => {
    // Registered user count via RPC
    supabase.rpc('get_total_users').then(({ data, error }) => {
      if (!error && typeof data === 'number') {
        setTotalPlayers(BASE_PLAYERS + data);
      }
    });

    // Sum all prize pools from the tournaments table
    supabase
      .from('tournaments')
      .select('prize_pool')
      .then(({ data, error }) => {
        if (!error && data) {
          const dbPrize = data.reduce((sum, t) => {
            const val = parseFloat(t.prize_pool);
            return sum + (isNaN(val) ? 0 : val);
          }, 0);
          setTotalPrize(BASE_PRIZE_PKR + dbPrize);
        }
      });
  }, []);

  // Tournament count: base offset (pre-DB) + live DB count
  const totalTournaments = 8 + tournaments.length;

  // Format prize: round to nearest 1000 for display
  const formatPrize = (pkr) => {
    if (pkr >= 1_000_000) return `${(pkr / 1_000_000).toFixed(1)}M PKR+`;
    if (pkr >= 1000) return `${Math.floor(pkr / 1000)}K PKR+`;
    return `${pkr} PKR+`;
  };

  return {
    activePlayers: totalPlayers.toLocaleString('en-PK') + '+',
    prizePools: formatPrize(totalPrize),
    tournamentsRun: totalTournaments + '+',
  };
}
