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
 * @returns {'upcoming' | 'registrations_open' | 'registrations_closed' | 'in_progress' | 'completed'}
 */
export function computeTournamentStatus(tournament) {
  if (!tournament) return 'upcoming';

  const { registration_open_date, registration_deadline, start_date, is_completed } = tournament;

  // 1. Admin manually marked as completed
  if (is_completed) return 'completed';

  const now = new Date();

  // 2. If there is an open date and we haven't reached it yet
  if (registration_open_date && now < new Date(registration_open_date)) {
    return 'upcoming';
  }

  // 3. If there is a deadline and we haven't reached it yet, registrations are open
  // (We already know now >= open_date if it exists)
  if (registration_deadline && now <= new Date(registration_deadline)) {
    return 'registrations_open';
  }

  // If we reach here, either the deadline HAS passed, or there is NO deadline.

  // 4. If start date has passed, the tournament is underway
  if (start_date && now >= new Date(start_date)) {
    return 'in_progress';
  }

  // 5. If deadline passed but start date hasn't passed
  if (registration_deadline && now > new Date(registration_deadline)) {
    return 'registrations_closed';
  }

  // 6. If open date passed but no deadline and no start date exists
  if (registration_open_date && now >= new Date(registration_open_date)) {
    return 'registrations_open';
  }

  // 7. No dates configured -> upcoming by default
  return 'upcoming';
}
