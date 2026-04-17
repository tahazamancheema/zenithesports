import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase/config';
import GhostInput from '../components/ui/GhostInput';
import GradientButton from '../components/ui/GradientButton';
import toast from 'react-hot-toast';
import { Save, User, Shield, Users, MapPin, Phone } from 'lucide-react';

export default function ProfilePage() {
  const { user, userDoc, loading, refreshProfile } = useAuth();
  
  const [form, setForm] = useState({
    displayName: '',
    whatsapp_number: '',
    team_name: '',
    player_1_id: '',
    player_2_id: '',
    player_3_id: '',
    player_4_id: '',
    player_5_id: '',
    player_6_id: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userDoc) {
        const pids = userDoc.player_ids || [];
        setForm({
          displayName: userDoc.display_name || '',
          whatsapp_number: userDoc.whatsapp_number || '',
          team_name: userDoc.team_name || '',
          player_1_id: pids[0] || '',
          player_2_id: pids[1] || '',
          player_3_id: pids[2] || '',
          player_4_id: pids[3] || '',
          player_5_id: pids[4] || '',
          player_6_id: pids[5] || '',
        });
    }
  }, [userDoc]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] pt-24 px-6 md:px-12 flex justify-center">
        <div className="w-12 h-1 zenith-gradient animate-pulse" />
      </div>
    );
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let responseError = null;
      
      // Auto-retry block to bypass Vite HMR ghost lock exceptions
      for (let attempt = 1; attempt <= 3; attempt++) {
        const { error } = await supabase
          .from('users')
          .update({
            display_name: form.displayName,
            whatsapp_number: form.whatsapp_number,
            team_name: form.team_name,
            player_ids: [
              form.player_1_id,
              form.player_2_id,
              form.player_3_id,
              form.player_4_id,
              form.player_5_id,
              form.player_6_id,
            ].map(id => id.trim()).filter(Boolean),
          })
          .eq('id', user.id);

        responseError = error;
        // If the error isn't a lock stealing issue or it succeeded, break early
        if (!error || !error.message?.includes('Lock')) break;
        // Short pause before retrying the lock acquisition
        await new Promise(r => setTimeout(r, 300));
      }

      if (responseError) throw responseError;
      toast.success('Profile updated! Your data will auto-fill during registrations.');
      await refreshProfile(user.id);
    } catch (err) {
      toast.error('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] pt-28 pb-20 animate-page-enter">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 border-b border-[rgba(78,70,56,0.15)] pb-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div>
            <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-2">OPERATIVE CENTER</span>
            <h1 className="font-agency text-5xl md:text-6xl font-black italic tracking-tighter leading-tight pb-2 pr-4 text-[#e2e2e2]">
              PLAYER <span className="zenith-gradient-text pr-4">PROFILE</span>
            </h1>
            <p className="text-[#d1c5b3] opacity-60 text-sm max-w-md mt-4">
              Pre-fill your team roster and contact details here. When you enter a tournament, your saved roster will automatically be used to secure your slot faster.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#1b1b1b] p-4 border border-[rgba(78,70,56,0.3)]">
             <div className="w-12 h-12 bg-[#0e0e0e] border border-[#dbb462] flex items-center justify-center">
               <User size={20} className="text-[#dbb462]" />
             </div>
             <div>
               <p className="font-agency text-xl font-bold">{userDoc?.display_name || 'UNKNOWN'}</p>
               <p className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-50">{user?.email}</p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#1b1b1b] p-8 border border-[rgba(78,70,56,0.2)] hover:border-[rgba(78,70,56,0.5)] transition-colors">
              <div className="flex items-center gap-3 mb-6 border-b border-[rgba(78,70,56,0.15)] pb-4">
                <Shield size={16} className="text-[#dbb462]" />
                <h2 className="font-agency text-2xl font-bold italic tracking-tight">COMMANDER LOG</h2>
              </div>
              
              <div className="space-y-6">
                <GhostInput
                  id="displayName"
                  label="Full Name (Player's Real Name)"
                  value={form.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Muhammad Ali"
                />
                <div className="relative">
                  <Phone size={14} className="absolute right-0 top-1 text-[#d1c5b3] opacity-30" />
                  <GhostInput
                    id="whatsapp"
                    label="WhatsApp Contact Number"
                    value={form.whatsapp_number}
                    onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Team Roster */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#1b1b1b] p-8 border border-[rgba(78,70,56,0.2)] hover:border-[rgba(78,70,56,0.5)] transition-colors relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between mb-8 border-b border-[rgba(78,70,56,0.15)] pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-[#dbb462]" />
                  <h2 className="font-agency text-2xl font-bold italic tracking-tight">SAVED ROSTER</h2>
                </div>
                <span className="font-stretch text-[8px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase">
                  PUBG MOBILE CHAR IDs
                </span>
              </div>

              <div className="space-y-8 relative z-10">
                <GhostInput
                  id="teamName"
                  label="Team Name"
                  value={form.team_name}
                  onChange={(e) => handleChange('team_name', e.target.value)}
                  placeholder="e.g. 100 Thieves"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="relative group">
                      <span className="absolute -left-3 top-2 font-agency text-xs text-[#d1c5b3] opacity-20 group-hover:opacity-100 transition-opacity">
                        0{num}
                      </span>
                      <GhostInput
                        id={`player_${num}`}
                        label={num <= 4 ? `Player ${num} ID *` : `Substitute ${num} ID`}
                        value={form[`player_${num}_id`]}
                        onChange={(e) => handleChange(`player_${num}_id`, e.target.value)}
                        placeholder="5XXXXXXXXXX"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <GradientButton type="submit" size="lg" disabled={saving} icon={Save} className="w-full md:w-auto px-12">
                {saving ? 'UPDATING SYSTEMS...' : 'SAVE CONFIGURATION'}
              </GradientButton>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
