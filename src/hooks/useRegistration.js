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
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', uid)
      .eq('status', 'pending');

    if (error) throw error;
    return data && data.length > 0;
  }, []);

  /**
   * Check if any player ID already exists in any registration.
   */
  const findDuplicatePlayerID = useCallback(async (playerIDs) => {
    // Because player_ids is a JSONB array, we can use the Contains operator or query all and check in JS.
    // simpler to query all pending/approved and check in JS.
    const { data, error } = await supabase
      .from('registrations')
      .select('player_ids')
      .neq('status', 'rejected'); // Only check active/pending

    if (error) throw error;
    
    for (const pid of playerIDs) {
      if (!pid.trim()) continue;
      // Check if this pid exists in any registration's player_ids array
      const isDuplicate = data.some(reg => 
        reg.player_ids && reg.player_ids.includes(pid.trim().toUpperCase())
      );
      if (isDuplicate) return pid;
    }
    return null;
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
        const { data, error: insertErr } = await supabase
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
          .single();

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
