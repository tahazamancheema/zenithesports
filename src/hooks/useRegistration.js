import { useState, useCallback } from 'react';
import { supabase } from '../supabase/config';

/**
 * useRegistration — handles registration submission with validation guards:
 * 1. User can only have ONE pending / approved / reapplied registration at a time per tournament.
 * 2. If rejected, they can RE-APPLY (which updates their existing record).
 * 3. No player character ID can already exist in ANY active registration globally.
 */
/**
 * Helper to run a Supabase query with a timeout.
 * @param {Object} query - The Supabase query object (thenable).
 * @param {number} timeoutMs - Timeout in milliseconds.
 */
async function runTimedQuery(query, timeoutMs = 10000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('QUERY_TIMEOUT')), timeoutMs)
  );
  // Ensure the query is treated as a real promise
  return Promise.race([Promise.resolve(query), timeoutPromise]);
}

/**
 * useRegistration — handles registration submission with validation guards:
 * 1. User can only have ONE pending / approved / reapplied registration at a time per tournament.
 * 2. If rejected, they can RE-APPLY (which updates their existing record).
 * 3. No player character ID can already exist in ANY active registration globally.
 */
export function useRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check if the current user already has an active (pending/approved/reapplied) registration.
   * If they are rejected, this returns false to allow re-applying.
   */
  const hasPendingRegistration = useCallback(async (uid, tournamentID) => {
    try {
      const query = supabase
        .from('registrations')
        .select('id, status')
        .eq('user_id', uid)
        .eq('tournament_id', tournamentID)
        .in('status', ['pending', 'approved', 'reapplied'])
        .limit(1);

      const { data, error } = await runTimedQuery(query, 10000);

      if (error) throw error;
      return data && data.length > 0;
    } catch (err) {
      console.error('Pending check error:', err);
      if (err.message === 'QUERY_TIMEOUT') {
        throw new Error('Connection timed out while checking eligibility. Please check your network.');
      }
      return false;
    }
  }, []);

  /**
   * Check if any player ID or IGN already exists in any registration.
   * Excludes 'rejected' records.
   */
  const findDuplicates = useCallback(async (playerIDs, playerIGNs, teamName, tournamentID, excludeRegId = null) => {
    try {
      // 1. Check for Duplicate Team Name (Case-insensitive)
      if (teamName) {
        const teamQuery = supabase
          .from('registrations')
          .select('id, team_name')
          .eq('tournament_id', tournamentID)
          .neq('status', 'rejected')
          .ilike('team_name', teamName)
          .neq('id', excludeRegId || '00000000-0000-0000-0000-000000000000')
          .limit(1);

        const { data: teamCheck, error: teamError } = await runTimedQuery(teamQuery, 8000);
        if (teamError) throw teamError;
        if (teamCheck?.length > 0) return { type: 'team', value: teamName };
      }

      // 2. Check for Duplicate Player IDs
      if (playerIDs && playerIDs.length > 0) {
        let idQuery = supabase
          .from('registrations')
          .select('id, player_ids')
          .eq('tournament_id', tournamentID)
          .neq('status', 'rejected')
          .overlaps('player_ids', playerIDs);

        if (excludeRegId) idQuery = idQuery.neq('id', excludeRegId);
        
        const { data: idData, error: idError } = await runTimedQuery(idQuery.limit(1), 8000);
        if (idError) throw idError;
        if (idData?.length > 0) {
          const matched = playerIDs.find(id => idData[0].player_ids.includes(id));
          return { type: 'id', value: matched };
        }
      }

      // 3. Check for Duplicate Player IGNs (Case-insensitive)
      if (playerIGNs && playerIGNs.length > 0) {
        let ignQuery = supabase
          .from('registrations')
          .select('id, player_igns')
          .eq('tournament_id', tournamentID)
          .neq('status', 'rejected')
          .overlaps('player_igns', playerIGNs.map(n => n.toLowerCase()));

        if (excludeRegId) ignQuery = ignQuery.neq('id', excludeRegId);
        
        const { data: ignData, error: ignError } = await runTimedQuery(ignQuery.limit(1), 8000);
        if (ignError) throw ignError;
        if (ignData?.length > 0) {
          const matched = playerIGNs.find(n => 
            ignData[0].player_igns.some(existing => existing.toLowerCase() === n.toLowerCase())
          );
          return { type: 'ign', value: matched };
        }
      }
      
      return null;
    } catch (err) {
      console.error('Duplicate check error:', err);
      if (err.message === 'QUERY_TIMEOUT') {
        throw new Error('Connection timed out during duplicate verification. Please try again.');
      }
      throw err; // Propagate real errors so the UI knows something went wrong
    }
  }, []);

  /**
   * Submit a registration. If a 'rejected' record exists, we UPDATE it 
   * to status 'reapplied' to avoid duplicates. Otherwise, we INSERT.
   */
  const submitRegistration = useCallback(
    async ({ uid, tournamentID, teamName, realName, teamLogoURL, whatsapp, captainDiscord, playerIDs, playerIgns, screenshotURLs }) => {
      setSubmitting(true);
      setError(null);

      try {
        const idRegex = /^\d{10,14}$/;
        const cleanIDs = playerIDs.filter(Boolean).map((id) => id.trim());
        
        // 1. Check for existing record
        const { data: existing, error: checkErr } = await runTimedQuery(
          supabase
            .from('registrations')
            .select('id, status')
            .eq('user_id', uid)
            .eq('tournament_id', tournamentID)
            .maybeSingle(),
          10000
        );

        if (checkErr) throw checkErr;

        // 2. Global Duplicate check (exclude current record if updating)
        const duplicate = await findDuplicates(cleanIDs, playerIgns, teamName.trim(), tournamentID, existing?.id);
        if (duplicate) {
          if (duplicate.type === 'team') {
            throw new Error(`Team name "${duplicate.value}" is already taken in this tournament.`);
          }
          if (duplicate.type === 'ign') {
            throw new Error(`Player name "${duplicate.value}" is already registered in another squad.`);
          }
          throw new Error(`Player ID "${duplicate.value}" is already registered in another squad.`);
        }

        // 3. Validation
        if (cleanIDs.length < 4) throw new Error('At least 4 players are required.');
        for (const pid of cleanIDs) {
          if (!idRegex.test(pid)) throw new Error(`Invalid ID format: ${pid}`);
        }

        const payload = {
          user_id: uid,
          tournament_id: tournamentID,
          team_name: teamName.trim(),
          real_name: realName.trim(),
          logo_url: teamLogoURL || null,
          whatsapp_number: whatsapp.trim(),
          captain_discord: captainDiscord?.trim() || null,
          player_ids: cleanIDs,
          player_igns: playerIgns || [],
          screenshot_urls: screenshotURLs || [],
          rejection_reason: null, // Clear old reason
          updated_at: new Date().toISOString(),
        };

        let finalResult;
        if (existing && (existing.status === 'rejected')) {
          // UPDATE existing to 'reapplied'
          payload.status = 'reapplied';
          finalResult = await runTimedQuery(
            supabase
              .from('registrations')
              .update(payload)
              .eq('id', existing.id)
              .select()
              .single(),
            15000 // Slightly longer for the final write
          );
        } else if (existing && (existing.status === 'pending' || existing.status === 'approved' || existing.status === 'reapplied')) {
          throw new Error('You already have an active registration for this tournament.');
        } else {
          // INSERT new
          payload.status = 'pending';
          finalResult = await runTimedQuery(
            supabase
              .from('registrations')
              .insert([payload])
              .select()
              .single(),
            15000
          );
        }

        if (finalResult.error) throw finalResult.error;
        return { success: true, id: finalResult.data.id };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setSubmitting(false);
      }
    },
    [findDuplicates]
  );

  return { 
    submitRegistration, 
    hasPendingRegistration, 
    findDuplicates, 
    submitting, 
    error, 
    setError 
  };
}
