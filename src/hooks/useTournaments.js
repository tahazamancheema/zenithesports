import { useSupabaseDB } from './useSupabaseDB';
import { computeTournamentStatus } from '../utils/tournamentStatus';

/**
 * useTournaments — fetches all tournaments ordered by creation date.
 * Applies computed status from registration_open_date and is_completed flag,
 * so the stored `status` column is always up-to-date in the UI.
 */
export function useTournaments() {
  const {
    data: rawTournaments,
    loading,
    error,
    add,
    update,
    remove,
  } = useSupabaseDB('tournaments', { field: 'created_at', direction: 'desc' });

  // Overlay computed status on every tournament record
  const tournaments = rawTournaments.map((t) => ({
    ...t,
    status: computeTournamentStatus(t),
  }));

  const activeTournaments = tournaments.filter((t) => t.status === 'registrations_open' || t.status === 'in_progress');
  const upcomingTournaments = tournaments.filter((t) => t.status === 'upcoming');
  const completedTournaments = tournaments.filter((t) => t.status === 'completed' || t.status === 'registrations_closed');

  // The primary active tournament (first one)
  const currentTournament = activeTournaments[0] || upcomingTournaments[0] || null;

  return {
    tournaments,
    activeTournaments,
    upcomingTournaments,
    completedTournaments,
    currentTournament,
    loading,
    error,
    add,
    update,
    remove,
  };
}
