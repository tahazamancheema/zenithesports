import { useState, useCallback } from 'react';
import { supabase } from '../supabase/config';

/**
 * useRegistration — handles registration submission with validation guards:
 * 1. User can only have ONE pending / approved registration at a time (per tournament or globally - currently global per requirement)
 * 2. No player character ID can already exist in ANY active registration globally.
 * 3. Character IDs must be numeric and 5-12 digits long.
 */
export function useRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check if the current user already has a pending registration.
   */
  const hasPendingRegistration = useCallback(async (uid) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', uid)
        .eq('status', 'pending')
        .abortSignal(controller.signal);

      if (error) throw error;
      return data && data.length > 0;
    } finally {
      clearTimeout(timer);
    }
  }, []);

  /**
   * Check if any player ID already exists in any registration using efficient Postgres array operators.
   */
  const findDuplicatePlayerID = useCallback(async (playerIDs) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      // Use Postgres 'overlaps' operator (&&) to find if any of the provided IDs
      // exist in the player_ids array column of ANY existing active registration.
      const { data, error } = await supabase
        .from('registrations')
        .select('player_ids')
        .neq('status', 'rejected')
        .overlaps('player_ids', playerIDs)
        .limit(1)
        .abortSignal(controller.signal);

      if (error) throw error;
      
      // If we found a match, return the first one from the result set for feedback
      if (data && data.length > 0) {
        const matchedID = playerIDs.find(id => data[0].player_ids.includes(id));
        return matchedID || playerIDs[0];
      }
      
      return null;
    } finally {
      clearTimeout(timer);
    }
  }, []);

  /**
   * Submit a new registration after all guards pass.
   */
  const submitRegistration = useCallback(
    async ({ uid, tournamentID, teamName, realName, teamLogoURL, whatsapp, captainDiscord, playerIDs, playerIgns, screenshotURLs }) => {
      setSubmitting(true);
      setError(null);

      try {
        // Guard 1 — Pending registration check
        const pending = await hasPendingRegistration(uid);
        if (pending) {
          throw new Error(
            'آپ کی ایک پہلے سے Pending Registration موجود ہے۔ براہ کرم پہلے اسے مکمل ہونے دیں۔\n(You already have a pending registration. Please wait for it to be reviewed.)'
          );
        }

        // Guard 2 — Character ID Validation
        const idRegex = /^\d{10,14}$/;
        const cleanIDs = playerIDs.filter(Boolean).map((id) => id.trim());
        
        // Check for duplicates within the team itself
        const uniqueInTeam = new Set(cleanIDs);
        if (uniqueInTeam.size !== cleanIDs.length) {
          throw new Error('ایک ہی ٹیم میں ایک ہی کریکٹر آئی ڈی دو بار استعمال نہیں کی جا سکتی۔\n(Duplicate Character IDs detected within the same squad.)');
        }

        for (const pid of cleanIDs) {
          if (!idRegex.test(pid)) {
            throw new Error(`کریکٹر آئی ڈی "${pid}" درست نہیں ہے۔ یہ صرف 10 سے 14 ہندسوں پر مشتمل ہونی چاہیے۔\n(Character ID "${pid}" is invalid. It must be numeric and between 10-14 digits.)`);
          }
        }

        // Guard 3 — Global Duplicate character ID check
        const duplicate = await findDuplicatePlayerID(cleanIDs);
        if (duplicate) {
          throw new Error(
            `Player ID "${duplicate}" پہلے سے ڈیٹابیس میں موجود ہے۔\n(Player ID "${duplicate}" is already registered in the database.)`
          );
        }

        // Guard 4 — WhatsApp Validation
        const cleanWhatsApp = whatsapp.trim().replace(/[^0-9]/g, '');
        if (cleanWhatsApp.length !== 11) {
          throw new Error('واٹس ایپ نمبر 11 ہندسوں کا ہونا چاہیے۔\n(WhatsApp number must be exactly 11 digits.)');
        }

        // All guards passed — submit
        const insertController = new AbortController();
        const insertTimer = setTimeout(() => insertController.abort(), 20000);
        let data, insertErr;
        try {
          const result = await supabase
            .from('registrations')
            .insert([{
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
              status: 'pending',
            }])
            .select()
            .single()
            .abortSignal(insertController.signal);
          data = result.data;
          insertErr = result.error;
        } finally {
          clearTimeout(insertTimer);
        }

        if (insertErr) throw insertErr;
        return { success: true, id: data.id };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setSubmitting(false);
      }
    },
    [hasPendingRegistration, findDuplicatePlayerID]
  );

  return { submitRegistration, submitting, error, setError };
}
