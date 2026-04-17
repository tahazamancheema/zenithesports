/**
 * tournamentStatus.js
 * Computes tournament status automatically based on dates and
 * an admin-controlled "completed" toggle (is_completed field).
 *
 * Priority order:
 *  1. is_completed = true  → 'completed'
 *  2. Now < registration_open_date → 'upcoming'
 *  3. Now >= registration_open_date → 'active'
 *  4. Fallback (no dates set) → 'upcoming'
 */

/**
 * @param {Object} tournament - A tournament record from Supabase
 * @returns {'upcoming' | 'active' | 'completed'}
 */
export function computeTournamentStatus(tournament) {
  if (!tournament) return 'upcoming';

  const { registration_open_date, is_completed } = tournament;

  // Admin manually marked as completed
  if (is_completed) return 'completed';

  const now = new Date();

  if (registration_open_date) {
    const openDate = new Date(registration_open_date);
    if (now < openDate) return 'upcoming';
    if (now >= openDate) return 'active';
  }

  // No dates configured → upcoming by default
  return 'upcoming';
}
