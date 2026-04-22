import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, ChevronLeft, Save, Camera, MessageCircle } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import { useRegistration } from '../hooks/useRegistration';
import { useAuth } from '../hooks/useAuth';
import { useTournamentCountdown } from '../hooks/useTournamentCountdown';
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
  const [screenshotFiles, setScreenshotFiles] = useState([null, null, null, null]);
  const [saving, setSaving] = useState(false);

  const tournament = tournaments.find(t => t.id === tournamentId);
  const { phase } = useTournamentCountdown(tournament?.registration_open_date, tournament?.registration_deadline);

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

    // Guard: Opening phase check
    if (phase === 'opening') {
      toast.error('REGISTRATION PENDING. Signal has not been initialized.');
      navigate(`/tournaments/${tournamentId}`);
    }
    
  }, [user, tournament, aLoading, tLoading, tournamentId, navigate, phase]);

  const handleRegisterSub = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Team logo is required for identification.', { id: 'reg' });
    
    setSaving(true);
    try {
      toast.loading('Synchronizing to secure vaults...', { id: 'reg' });
      
      // Upload Team Logo
      const logoUrl = await uploadFile('ze-logos', file, `logo_${user.id}_${Date.now()}`);
      
      // Upload Screenshots
      const screenshotURLs = [];
      const configSS = tournament.registration_config?.screenshots || [];
      
      for (let i = 0; i < configSS.length; i++) {
        const sFile = screenshotFiles[i];
        if (sFile) {
          toast.loading(`Uploading proof: ${configSS[i].label}...`, { id: 'reg' });
          const url = await uploadFile('ze-proofs', sFile, `proof_${i}_${user.id}_${Date.now()}`);
          screenshotURLs.push(url);
        } else {
          screenshotURLs.push(null);
        }
      }
      
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
        playerIDs: playerIds,
        screenshotURLs: screenshotURLs
      });

      if (result.success) {
        toast.success('Registration finalized and pushed to Admin queue!', { id: 'reg' });
        navigate('/tournaments');
      } else {
        toast.error(result.error || 'Registration failed', { id: 'reg' });
      }
    } catch (err) {
      toast.error(`Registration uplink failed: ${err.message}`, { id: 'reg' });
    } finally {
      setSaving(false);
    }
  };

  if (tLoading || aLoading) {
    return <div className="min-h-screen bg-[#131313] flex items-center justify-center text-[#d1c5b3] font-stretch tracking-widest text-[10px]">VERIFYING COMMAND CREDENTIALS...</div>;
  }
  if (!tournament) return null;

  if (phase === 'closed') {
    return (
      <div className="min-h-screen bg-[#131313] pt-28 pb-20 px-6 md:px-12 flex items-center justify-center animate-page-enter">
        <div className="max-w-xl w-full space-y-8 text-center">
          <div className="bg-[#111] border border-[#dbb462]/20 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-[#dbb462]/10 rounded-full flex items-center justify-center border border-[#dbb462]/20">
                <MessageCircle size={32} className="text-[#dbb462]" />
              </div>
              <h1 className="font-bebas text-6xl text-white uppercase tracking-tight">REGISTRATION CLOSED</h1>
            </div>

            <p className="font-body text-[#d1c5b3] text-lg leading-relaxed opacity-60 mb-12">
              Registrations for this tournament have been officially terminated. If you have any issues or require tactical assistance, contact our support unit.
            </p>

            <a 
              href="https://wa.me/923390715753" 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col gap-2 w-full bg-[#1a1a1a] border border-white/5 px-6 py-5 group hover:border-[#dbb462]/40 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#dbb462] animate-pulse" />
                <span className="font-teko text-[14px] tracking-[0.2em] text-[#d1c5b3] opacity-60 uppercase">Support Unit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bebas text-2xl text-white uppercase tracking-wider">WhatsApp Support</span>
                <span className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462] uppercase group-hover:translate-x-1 transition-transform">Join →</span>
              </div>
            </a>
          </div>

          <button 
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
            className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462] uppercase hover:underline"
          >
            Return to Intel Briefing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] pt-28 pb-20 px-6 md:px-12 animate-page-enter">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-[#d1c5b3] opacity-60 hover:opacity-100 hover:text-[#dbb462] transition-colors font-teko text-[16px] tracking-widest uppercase">
          <ChevronLeft size={16} /> Cancel Registration
        </button>

        <div className="border-b border-white/5 pb-6 mb-10">
          <span className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462] block mb-2 uppercase">Squad Registration</span>
          <h1 className="font-bebas text-5xl md:text-7xl tracking-tight text-[#f2f2f2] uppercase">
            {tournament.title}
          </h1>
          <p className="text-[#d1c5b3] opacity-40 mt-2 font-body text-lg max-w-2xl">{tournament.description}</p>
        </div>

        {userDoc && (userDoc.team_name || userDoc.whatsapp_number) && (
          <div className="bg-[#dbb462]/10 border border-[#dbb462]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#dbb462] p-3 text-[#402d00] rounded-sm">
                <Users size={20} />
              </div>
              <div className="text-left">
                <p className="font-bebas text-2xl text-white">PROFILE DATA DETECTED</p>
                <p className="font-teko text-[14px] tracking-[0.1em] text-[#d1c5b3] opacity-60 uppercase">
                  Would you like to import details from your player profile?
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleAutoFill}
              className="w-full md:w-auto bg-[#dbb462] text-[#402d00] font-bebas text-xl tracking-widest px-8 py-3 hover:brightness-110 active:scale-95 transition-all uppercase"
            >
              Fill From Profile
            </button>
          </div>
        )}

        <form onSubmit={handleRegisterSub} className="space-y-12">
          {/* Logo Section */}
          <div className="bg-[#111] border border-white/5 p-8">
            <h2 className="font-bebas text-3xl text-white mb-6 flex items-center gap-3">
              <ShieldAlert className="text-[#dbb462]" size={24} /> TEAM BRANDING
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
                <label className="font-teko text-[16px] tracking-widest text-[#d1c5b3] uppercase block mb-3 opacity-60">Team Logo (JPEG/PNG)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="w-full text-[14px] text-[#d1c5b3] file:mr-4 file:py-2 file:px-6 file:border-0 file:bg-[#1f1f1f] file:text-[#dbb462] file:font-teko file:text-[16px] file:cursor-pointer hover:file:bg-[#2a2a2a] file:uppercase file:tracking-widest"
                />
              </div>
            </div>
          </div>

          {/* Comms Section */}
          <div className="bg-[#111] border border-white/5 p-8">
            <h2 className="font-bebas text-3xl text-white mb-6">CONTACT DETAILS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GhostInput label="Team Name *" value={form.team_name} onChange={e => setForm(f => ({ ...f, team_name: e.target.value }))} required placeholder="Enter full squad name" />
              <GhostInput label="Point of Contact *" value={form.real_name} onChange={e => setForm(f => ({ ...f, real_name: e.target.value }))} required placeholder="Full name of Captain/Manager" />
              <div className="md:col-span-2">
                <GhostInput label="WhatsApp Contact Number *" value={form.whatsapp_number} onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} required placeholder="+92 3XX XXXXXXX" />
              </div>
            </div>
          </div>

          {/* Squad Roster Section */}
          <div className="bg-[#111] border border-white/5 p-8">
            <h2 className="font-bebas text-3xl text-white mb-2">SQUAD ROSTER</h2>
            <p className="font-teko text-[16px] tracking-widest text-[#d1c5b3] opacity-40 uppercase mb-8">
              Minimum 4 players required. Character IDs must be exactly 10-14 digits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <GhostInput label="Player 1 (Captain) *" value={form.player_1_id} onChange={e => setForm(f => ({ ...f, player_1_id: e.target.value }))} required placeholder="5XXXXXXXXX" />
              <GhostInput label="Player 2 *" value={form.player_2_id} onChange={e => setForm(f => ({ ...f, player_2_id: e.target.value }))} required placeholder="5XXXXXXXXX" />
              <GhostInput label="Player 3 *" value={form.player_3_id} onChange={e => setForm(f => ({ ...f, player_3_id: e.target.value }))} required placeholder="5XXXXXXXXX" />
              <GhostInput label="Player 4 *" value={form.player_4_id} onChange={e => setForm(f => ({ ...f, player_4_id: e.target.value }))} required placeholder="5XXXXXXXXX" />
              <GhostInput label="Player 5 (Sub)" value={form.player_5_id} onChange={e => setForm(f => ({ ...f, player_5_id: e.target.value }))} placeholder="Optional" />
              <GhostInput label="Player 6 (Sub)" value={form.player_6_id} onChange={e => setForm(f => ({ ...f, player_6_id: e.target.value }))} placeholder="Optional" />
            </div>
          </div>

          {/* Verification Screenshots Section */}
          {tournament.registration_config?.screenshots?.length > 0 && (
            <div className="bg-[#111] border border-white/5 p-8">
              <h2 className="font-bebas text-3xl text-white mb-2 flex items-center gap-3">
                <Camera className="text-[#dbb462]" size={24} /> REQUIRED PROOF
              </h2>
              <p className="font-teko text-[16px] tracking-widest text-[#d1c5b3] opacity-40 uppercase mb-8">
                Upload the following required documents to proceed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tournament.registration_config.screenshots.map((ss, idx) => (
                  <div key={idx} className="space-y-3">
                    <label className="font-teko text-[16px] tracking-widest text-[#d1c5b3] uppercase block opacity-60">
                      {ss.label} {ss.required && <span className="text-[#dbb462]">*</span>}
                    </label>
                    <div className="relative group min-h-[140px] bg-[#131313] border border-[rgba(78,70,56,0.2)] hover:border-[#dbb462]/30 transition-colors flex flex-col items-center justify-center p-4">
                      {screenshotFiles[idx] ? (
                        <div className="relative w-full h-full flex flex-col items-center">
                           <img src={URL.createObjectURL(screenshotFiles[idx])} alt="Proof" className="h-20 w-auto object-contain mb-2" />
                           <span className="text-[14px] text-[#dbb462] font-bebas tracking-widest uppercase truncate max-w-full">{screenshotFiles[idx].name}</span>
                           <button 
                             type="button" 
                             onClick={() => {
                               const next = [...screenshotFiles];
                               next[idx] = null;
                               setScreenshotFiles(next);
                             }}
                             className="absolute top-0 right-0 text-red-400 opacity-40 hover:opacity-100 p-1 font-bebas text-sm"
                           >
                             REMOVE
                           </button>
                        </div>
                      ) : (
                        <>
                          <Camera size={24} className="text-[#d1c5b3] opacity-20 mb-2 group-hover:text-[#dbb462] transition-colors" />
                          <span className="text-[14px] text-[#d1c5b3] opacity-30 group-hover:opacity-60 transition-opacity uppercase tracking-widest font-teko">Select Image</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        required={ss.required}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const next = [...screenshotFiles];
                            next[idx] = file;
                            setScreenshotFiles(next);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={submitting}
              className="btn-obsidian-primary w-full md:w-auto px-20 py-5 font-bebas text-3xl tracking-widest uppercase"
            >
              {submitting ? 'PROCESSING...' : 'REGISTER SQUAD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
