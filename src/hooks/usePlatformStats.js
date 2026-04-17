import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { useTournaments } from './useTournaments';

export function usePlatformStats() {
  // Base fixed numbers from social channels
  const BASE_PLAYERS = 3000 + 2400 + 4700 + 67; // 10,167
  
  const [totalPlayers, setTotalPlayers] = useState(BASE_PLAYERS);
  const { tournaments } = useTournaments();

  useEffect(() => {
    supabase.rpc('get_total_users')
      .then(({ data, error }) => {
        if (!error && typeof data === 'number') {
          setTotalPlayers(BASE_PLAYERS + data);
        }
      })
      .catch((err) => console.warn('Failed to fetch user count:', err));
  }, []);

  // Compute total tournaments run
  // Base offset 8 requested by user
  const totalTournaments = 8 + tournaments.length;

  return {
    activePlayers: totalPlayers.toLocaleString() + '+',
    prizePools: '250,000PKR+',
    tournamentsRun: totalTournaments + '+'
  };
}
