import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, ChevronLeft, Save } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import { useRegistration } from '../hooks/useRegistration';
import { useAuth } from '../hooks/useAuth';
import { uploadFile } from '../utils/storage';
import GhostInput from '../components/ui/GhostInput';
import GradientButton from '../components/ui/GradientButton';
import toast from 'react-hot-toast';

export default function RegistrationPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { tournaments, loading: tLoading } = useTournaments();
  const { submitRegistration, submitting } = useRegistration();
  const { user, userDoc, loading: aLoading } = useAuth();
  
  const [form, setForm] = useState({
    team_name: '',
    real_name: '',
    whatsapp_number: '',
    player_1_id: '',
    player_2_id: '',
    player_3_id: '',
    player_4_id: '',
    player_5_id: '',
    player_6_id: '',
  });

  const handleAutoFill = () => {
    if (!userDoc) return;
    const pids = userDoc.player_ids || [];
    setForm({
      team_name: userDoc.team_name || '',
      real_name: userDoc.display_name || '',
      whatsapp_number: userDoc.whatsapp_number || '',
      player_1_id: pids[0] || '',
      player_2_id: pids[1] || '',
      player_3_id: pids[2] || '',
      player_4_id: pids[3] || '',
      player_5_id: pids[4] || '',
      player_6_id: pids[5] || '',
    });
    toast.success('Profile data synchronized successfully.');
  };

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const tournament = tournaments.find(t => t.id === tournamentId);

  useEffect(() => {
    if (aLoading || tLoading) return;
    if (!user) {
      toast.error('You must be securely authenticated to access tactical registrations.');
      navigate('/auth');
      return;
    }
    if (!tournament) {
      toast.error('Tournament parameters corrupted or vanished.');
      navigate('/tournaments');
      return;
    }
    
    // The useRegistration hook handles duplicate checks and user registration status internally
  }, [user, tournament, aLoading, tLoading, tournamentId, navigate]);

    async function handleRegisterSub(e) {
    if (e) e.preventDefault();
    if (!form.team_name.trim()) { toast.error('Callsign (Team Name) is mandatory'); return; }
    if (!form.real_name.trim()) { toast.error('Real Name is mandatory'); return; }
    if (!form.whatsapp_number.trim()) { toast.error('WhatsApp Contact is mandatory'); return; }
    if (!form.player_1_id || !form.player_2_id || !form.player_3_id || !form.player_4_id) {
      toast.error('Minimum four active combatants required to register.');
      return;
    }
    if (!file) { toast.error('Squad insignia (Team Logo) must be uploaded to the vault.'); return; }
    
    try {
      toast.loading('Synchronizing to ze-logos vault...', { id: 'reg' });
      const logoUrl = await uploadFile('ze-logos', file, `logo_${user.id}`);
      
      const playerIds = [
        form.player_1_id,
        form.player_2_id,
        form.player_3_id,
        form.player_4_id,
        form.player_5_id,
        form.player_6_id
      ];

      const result = await submitRegistration({
        uid: user.id,
        tournamentID: tournament.id,
        teamName: form.team_name,
        realName: form.real_name,
        teamLogoURL: logoUrl,
        whatsapp: form.whatsapp_number,
        playerIDs: playerIds
      });

      if (result.success) {
        toast.success('Registration finalized and pushed to Admin queue!', { id: 'reg' });
        navigate('/tournaments');
      } else {
        toast.error(result.error || 'Registration failed', { id: 'reg' });
      }
    } catch (err) {
      toast.error(`Registration uplink failed: ${err.message}`, { id: 'reg' });
    }
  }

  if (tLoading || aLoading) {
    return <div className="min-h-screen bg-[#131313] flex items-center justify-center text-[#d1c5b3] font-stretch tracking-widest text-[10px]">VERIFYING COMMAND CREDENTIALS...</div>;
  }
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-[#131313] pt-28 pb-20 px-6 md:px-12 animate-page-enter">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-[#d1c5b3] opacity-60 hover:opacity-100 hover:text-[#f9d07a] transition-colors font-stretch text-[9px] tracking-widest uppercase">
          <ChevronLeft size={12} /> Abort Registration
        </button>

        <div className="border-b border-[rgba(78,70,56,0.15)] pb-6 mb-10">
          <span className="font-stretch text-[10px] tracking-widest text-[#f9d07a] block mb-2">INITIALIZING ENTRY</span>
          <h1 className="font-agency text-5xl font-black italic tracking-tighter text-[#e2e2e2] uppercase">
            {tournament.title}
          </h1>
          <p className="text-[#d1c5b3] opacity-60 mt-2 font-body text-sm max-w-2xl">{tournament.description}</p>
        </div>

        {userDoc && (userDoc.team_name || userDoc.whatsapp_number) && (
          <div className="bg-[#dbb462]/10 border border-[#dbb462]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#dbb462] p-3 text-[#402d00] rounded-sm">
                <Users size={20} />
              </div>
              <div className="text-left">
                <p className="font-agency text-xl font-bold text-[#e2e2e2]">SAVED ROSTER DETECTED</p>
                <p className="font-stretch text-[8px] tracking-[0.2em] text-[#d1c5b3] opacity-60 uppercase">
                  Would you like to import data from your player profile?
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleAutoFill}
              className="w-full md:w-auto bg-[#dbb462] text-[#402d00] font-stretch text-[10px] tracking-widest px-8 py-3 hover:bg-[#f9d07a] active:scale-95 transition-all font-bold uppercase"
            >
              Import Data
            </button>
          </div>
        )}

        <form onSubmit={handleRegisterSub} className="space-y-12">
          {/* Logo Section */}
          <div className="bg-[#1b1b1b] border border-[rgba(78,70,56,0.3)] border-l-4 border-l-[#dbb462] p-8">
            <h2 className="font-agency text-2xl font-bold italic text-[#e2e2e2] mb-6 flex items-center gap-3">
              <ShieldAlert className="text-[#f9d07a]" size={20} /> INSIGNIA VAULT
            </h2>
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 bg-[#131313] border border-[rgba(78,70,56,0.2)] flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden object-cover">
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <Users className="text-[#d1c5b3] opacity-20" size={32} />
                )}
              </div>
              <div className="flex-1">
                <label className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] uppercase block mb-3">Team Logo (JPEG/PNG)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="w-full text-[10px] text-[#d1c5b3] file:mr-4 file:py-2 file:px-6 file:border-0 file:bg-[#1f1f1f] file:text-[#f9d07a] file:font-stretch file:text-[9px] file:cursor-pointer hover:file:bg-[#2a2a2a] file:uppercase file:tracking-widest"
                />
              </div>
            </div>
          </div>

          {/* Comms Section */}
          <div className="bg-[#1b1b1b] border border-[rgba(78,70,56,0.3)] p-8">
            <h2 className="font-agency text-2xl font-bold italic text-[#e2e2e2] mb-6">SQUAD COMMS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GhostInput label="Team Name (Callsign) *" value={form.team_name} onChange={e => setForm(f => ({ ...f, team_name: e.target.value }))} required placeholder="e.g. 100 Thieves" />
              <GhostInput label="Player's Real Name *" value={form.real_name} onChange={e => setForm(f => ({ ...f, real_name: e.target.value }))} required placeholder="Full name of Captain" />
              <div className="md:col-span-2">
                <GhostInput label="WhatsApp Contact Number *" value={form.whatsapp_number} onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} required placeholder="+92 3XX XXXXXXX" />
              </div>
            </div>
          </div>

          {/* Roster Section */}
          <div className="bg-[#1b1b1b] border border-[rgba(78,70,56,0.3)] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="font-agency text-2xl font-bold italic text-[#e2e2e2] mb-2 flex items-center gap-3">
              <Users className="text-[#f9d07a]" size={20} /> ACTIVE ROSTER
            </h2>
            <p className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-40 uppercase mb-8">PUBG Mobile Char IDs only (10-14 digits). 4 Required.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="relative group">
                  <span className="absolute -left-3 top-2 font-agency text-xs text-[#d1c5b3] opacity-20 group-hover:opacity-100 transition-opacity">
                    0{num}
                  </span>
                  <GhostInput
                    id={`player_${num}`}
                    label={num <= 4 ? `Player ${num} ID *` : `Substitute ${num} ID`}
                    value={form[`player_${num}_id`]}
                    onChange={(e) => setForm(f => ({ ...f, [`player_${num}_id`]: e.target.value }))}
                    placeholder="5XXXXXXXXXX"
                    required={num <= 4}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <GradientButton type="submit" size="lg" disabled={submitting} icon={Save} className="w-full md:w-auto px-16">
              {submitting ? 'UPLOADING TO MAINFRAME...' : 'COMMIT REGISTRATION'}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}
