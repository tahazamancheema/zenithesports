import { useState, useCallback } from 'react';
import { supabase } from '../supabase/config';

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
      const { data, error } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('user_id', uid)
        .eq('tournament_id', tournamentID)
        .in('status', ['pending', 'approved', 'reapplied'])
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (err) {
      console.error('Pending check error:', err);
      return false;
    }
  }, []);

  /**
   * Check if any player ID already exists in any registration using efficient Postgres array operators.
   * Excludes 'rejected' records so those IDs are freed up (unless the same user is re-applying).
   */
  const findDuplicatePlayerID = useCallback(async (playerIDs, excludeRegId = null) => {
    try {
      let query = supabase
        .from('registrations')
        .select('id, player_ids')
        .neq('status', 'rejected')
        .overlaps('player_ids', playerIDs);

      if (excludeRegId) {
        query = query.neq('id', excludeRegId);
      }

      const { data, error } = await query.limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const matchedID = playerIDs.find(id => data[0].player_ids.includes(id));
        return matchedID || playerIDs[0];
      }
      
      return null;
    } catch (err) {
      console.error('Duplicate check error:', err);
      return null;
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
        const { data: existing } = await supabase
          .from('registrations')
          .select('id, status')
          .eq('user_id', uid)
          .eq('tournament_id', tournamentID)
          .maybeSingle();

        // 2. Global Duplicate character ID check (exclude current record if updating)
        const duplicate = await findDuplicatePlayerID(cleanIDs, existing?.id);
        if (duplicate) {
          throw new Error(
            `Player ID "${duplicate}" پہلے سے ڈیٹابیس میں موجود ہے۔\n(Player ID "${duplicate}" is already registered in the database.)`
          );
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
          finalResult = await supabase
            .from('registrations')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single();
        } else if (existing && (existing.status === 'pending' || existing.status === 'approved' || existing.status === 'reapplied')) {
          throw new Error('You already have an active registration for this tournament.');
        } else {
          // INSERT new
          payload.status = 'pending';
          finalResult = await supabase
            .from('registrations')
            .insert([payload])
            .select()
            .single();
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
    [findDuplicatePlayerID]
  );

  return { 
    submitRegistration, 
    hasPendingRegistration, 
    findDuplicatePlayerID, 
    submitting, 
    error, 
    setError 
  };
}
