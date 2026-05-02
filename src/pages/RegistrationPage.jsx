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
  const { submitRegistration, hasPendingRegistration, findDuplicatePlayerID, submitting } = useRegistration();
  const { user, userDoc, loading: aLoading } = useAuth();
  
  const [form, setForm] = useState({
    team_name: '',
    real_name: '',
    whatsapp_number: '',
    captain_discord: '',
    player_1_ign: '', player_1_id: '',
    player_2_ign: '', player_2_id: '',
    player_3_ign: '', player_3_id: '',
    player_4_ign: '', player_4_id: '',
    player_5_ign: '', player_5_id: '',
    player_6_ign: '', player_6_id: '',
  });

  const handleAutoFill = () => {
    if (!userDoc) return;
    const pids = userDoc.player_ids || [];
    setForm({
      team_name: userDoc.team_name || '',
      real_name: userDoc.display_name || '',
      whatsapp_number: userDoc.whatsapp_number || '',
      captain_discord: userDoc.captain_discord || '',
      player_1_id: pids[0] || '', player_1_ign: userDoc.player_igns?.[0] || '',
      player_2_id: pids[1] || '', player_2_ign: userDoc.player_igns?.[1] || '',
      player_3_id: pids[2] || '', player_3_ign: userDoc.player_igns?.[2] || '',
      player_4_id: pids[3] || '', player_4_ign: userDoc.player_igns?.[3] || '',
      player_5_id: pids[4] || '', player_5_ign: userDoc.player_igns?.[4] || '',
      player_6_id: pids[5] || '', player_6_ign: userDoc.player_igns?.[5] || '',
    });
    toast.success('Profile data synchronized successfully.');
  };

  const [file, setFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([null, null, null, null]);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const tournament = tournaments.find(t => t.id === tournamentId);
  const { phase } = useTournamentCountdown(tournament?.registration_open_date, tournament?.registration_deadline);

  useEffect(() => {
    if (aLoading || tLoading) return;
    if (!user) {
      toast.error('You must be signed in to access tournament registrations.');
      navigate('/auth');
      return;
    }
    if (!tournament) {
      toast.error('Tournament not found.');
      navigate('/tournaments');
      return;
    }

    // Guard: Opening phase check
    if (phase === 'opening') {
      toast.error('REGISTRATION PENDING. Registration is not open yet.');
      navigate(`/tournaments/${tournamentId}`);
    }
    
  }, [user, tournament, aLoading, tLoading, tournamentId, navigate, phase]);

  const handleRegisterSub = async (e) => {
    e.preventDefault();
    if (saving || submitting) return;

    // Validate WhatsApp
    const waClean = form.whatsapp_number.trim().replace(/[^0-9]/g, '');
    if (waClean.length !== 11) {
      setFieldErrors(prev => ({ ...prev, whatsapp_number: 'Number must be exactly 11 digits' }));
      return toast.error('WhatsApp number must be exactly 11 digits.', { id: 'reg' });
    }

    // Validate Player IDs (All required and optional if provided)
    const idRegex = /^\d{10,14}$/;
    let firstErrorField = null;
    
    for (let i = 1; i <= 6; i++) {
      const pid = form[`player_${i}_id`]?.trim();
      // Required for 1-4, or if provided for 5-6
      if (i <= 4 || pid) {
        if (!pid) {
          if (!firstErrorField) firstErrorField = `player_${i}_id`;
          setFieldErrors(prev => ({ ...prev, [`player_${i}_id`]: 'Required' }));
        } else if (!idRegex.test(pid)) {
          if (!firstErrorField) firstErrorField = `player_${i}_id`;
          setFieldErrors(prev => ({ ...prev, [`player_${i}_id`]: 'Invalid ID' }));
        }
      }
    }

    if (firstErrorField) {
      return toast.error('Please fix Character ID errors (10-14 digits required).', { id: 'reg' });
    }
    
    setSaving(true);
    setFieldErrors({});
    try {
      toast.loading('Verifying competitive eligibility...', { id: 'reg' });
      
      const cleanIDs = [
        form.player_1_id, form.player_2_id, form.player_3_id,
        form.player_4_id, form.player_5_id, form.player_6_id
      ].filter(Boolean).map(id => id.trim());

      // Pre-Guard 1: Pending check
      const pending = await hasPendingRegistration(user.id);
      if (pending) {
        setSaving(false);
        return toast.error('You already have a pending registration. Please wait for it to be reviewed.', { id: 'reg' });
      }

      // Pre-Guard 2: Duplicate check
      const duplicate = await findDuplicatePlayerID(cleanIDs);
      if (duplicate) {
        setSaving(false);
        // Map to correct field
        for (let i = 1; i <= 6; i++) {
          if (form[`player_${i}_id`]?.trim() === duplicate) {
            setFieldErrors(prev => ({ ...prev, [`player_${i}_id`]: 'Already Registered' }));
            break;
          }
        }
        return toast.error(`Player ID "${duplicate}" is already registered in this tournament.`, { id: 'reg' });
      }

      toast.loading('Optimizing tactical assets...', { id: 'reg' });
      const { compressImage } = await import('../utils/image');
      
      // Prepare Upload Tasks
      const uploadTasks = [];
      
      // Task 0: Logo (if exists)
      if (file) {
        const compressedLogo = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.7 });
        uploadTasks.push(
          uploadFile('ze-logos', compressedLogo, `logo_${user.id}_${Date.now()}`)
            .catch(err => {
              console.warn('Logo upload failed, proceeding without logo:', err.message);
              return null;
            })
        );
      } else {
        uploadTasks.push(Promise.resolve(null));
      }
      
      // Tasks 1-N: Screenshots (Aggressive compression for faster sync and storage saving)
      const configSS = tournament.registration_config?.screenshots || [];
      for (let i = 0; i < configSS.length; i++) {
        const sFile = screenshotFiles[i];
        if (sFile) {
          const compressedSS = await compressImage(sFile, { maxWidth: 1000, maxHeight: 1000, quality: 0.5 });
          uploadTasks.push(
            uploadFile('ze-proofs', compressedSS, `proof_${i}_${user.id}_${Date.now()}`)
              .catch(err => {
                throw new Error(`Proof upload failed [${configSS[i].label}]: ${err.message}`);
              })
          );
        } else {
          uploadTasks.push(Promise.resolve(null));
        }
      }
      
      toast.loading('Syncing tactical data...', { id: 'reg' });
      
      // Execute all uploads in parallel
      const uploadResults = await Promise.all(uploadTasks);
      
      const logoUrl = uploadResults[0];
      const screenshotURLs = uploadResults.slice(1);
      
      toast.loading('Finalizing registration...', { id: 'reg' });
      
      const playerIgns = [
        form.player_1_ign, form.player_2_ign, form.player_3_ign,
        form.player_4_ign, form.player_5_ign, form.player_6_ign
      ].filter((_, i) => !!form[`player_${i+1}_id`]);

      const result = await submitRegistration({
        uid: user.id,
        tournamentID: tournament.id,
        teamName: form.team_name,
        realName: form.real_name,
        teamLogoURL: logoUrl,
        whatsapp: form.whatsapp_number,
        captainDiscord: form.captain_discord,
        playerIDs: cleanIDs,
        playerIgns: playerIgns,
        screenshotURLs: screenshotURLs
      });

      if (result.success) {
        toast.success('Registration finalized successfully!', { id: 'reg' });
        navigate('/tournaments');
      } else {
        toast.error(result.error || 'Registration failed', { id: 'reg' });
      }
    } catch (err) {
      toast.error(`Registration failed: ${err.message}`, { id: 'reg' });
    } finally {
      setSaving(false);
    }
  };

  if (tLoading || aLoading) {
    return <div className="min-h-screen bg-[#131313] flex items-center justify-center text-[#d1c5b3] font-stretch tracking-widest text-[10px]">VERIFYING ACCOUNT...</div>;
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
              Registrations for this tournament have closed. If you have any issues or require assistance, contact our support team.
            </p>

            <a 
              href="https://wa.me/923390715753" 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col gap-2 w-full bg-[#1a1a1a] border border-white/5 px-6 py-5 group hover:border-[#dbb462]/40 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#dbb462] animate-pulse" />
                <span className="font-teko text-[14px] tracking-[0.2em] text-[#d1c5b3] opacity-60 uppercase">Support Team</span>
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
            Return to Tournament Details
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
          <span className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462] block mb-2 uppercase">Team Registration</span>
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
          {/* Section 1: Team Information */}
          <div className="bg-[#111] border border-white/5 p-8">
            <h2 className="font-bebas text-3xl text-white mb-6 flex items-center gap-3">
              <ShieldAlert className="text-[#dbb462]" size={24} /> 1 - TEAM INFORMATION
            </h2>
            
            <div className="flex gap-6 items-center mb-8">
              <div className="w-24 h-24 bg-[#131313] border border-[rgba(78,70,56,0.2)] flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden object-cover">
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <Users className="text-[#d1c5b3] opacity-20" size={32} />
                )}
              </div>
              <div className="flex-1">
                <label className="font-teko text-[16px] tracking-widest text-[#d1c5b3] uppercase block mb-3 opacity-60">
                  Team Logo (Optional) {fieldErrors.team_logo && <span className="text-red-400 ml-2 italic">— {fieldErrors.team_logo}</span>}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    clearFieldError('team_logo');
                  }}
                  className={`w-full text-[14px] text-[#d1c5b3] file:mr-4 file:py-2 file:px-6 file:border-0 file:bg-[#1f1f1f] file:text-[#dbb462] file:font-teko file:text-[16px] file:cursor-pointer hover:file:bg-[#2a2a2a] file:uppercase file:tracking-widest ${fieldErrors.team_logo ? 'outline outline-1 outline-red-400' : ''}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GhostInput 
                label="Team Name *" 
                value={form.team_name} 
                onChange={e => {
                  setForm(f => ({ ...f, team_name: e.target.value }));
                  clearFieldError('team_name');
                }} 
                required 
                placeholder="Enter full team name" 
                error={fieldErrors.team_name}
              />
              <GhostInput 
                label="Captain Real Name *" 
                value={form.real_name} 
                onChange={e => {
                  setForm(f => ({ ...f, real_name: e.target.value }));
                  clearFieldError('real_name');
                }} 
                required 
                placeholder="Enter Captain's full name" 
                error={fieldErrors.real_name}
              />
              <GhostInput 
                label="Captain's WhatsApp Number *" 
                value={form.whatsapp_number} 
                onChange={e => {
                  setForm(f => ({ ...f, whatsapp_number: e.target.value }));
                  clearFieldError('whatsapp_number');
                }} 
                required 
                placeholder="03XX XXXXXXX (11 Digits)" 
                error={fieldErrors.whatsapp_number}
              />
              <GhostInput 
                label="Captain's Discord *" 
                value={form.captain_discord} 
                onChange={e => {
                  setForm(f => ({ ...f, captain_discord: e.target.value }));
                  clearFieldError('captain_discord');
                }} 
                required 
                placeholder="Discord Username" 
                error={fieldErrors.captain_discord}
              />
            </div>
          </div>

          {/* Section 2: Player Information */}
          <div className="bg-[#111] border border-white/5 p-8">
            <h2 className="font-bebas text-3xl text-white mb-2">2 - PLAYER INFORMATION</h2>
            <p className="font-teko text-[16px] tracking-widest text-[#d1c5b3] opacity-40 uppercase mb-8">
              Minimum 4 players required. Character IDs must be exactly 10-14 digits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div key={num} className="space-y-4 bg-[#131313] p-5 border border-white/5 relative">
                  <span className="absolute -top-3 -left-3 bg-[#dbb462] text-[#131313] w-6 h-6 flex items-center justify-center font-bebas text-lg">
                    {num}
                  </span>
                  <div className="font-bebas text-xl text-white tracking-widest">
                    Player {num} {num <= 4 ? '*' : '(Optional)'}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <GhostInput 
                      label={`Player ${num} IGN${num <= 4 ? ' *' : ''}`}
                      value={form[`player_${num}_ign`]} 
                      onChange={e => {
                        setForm(f => ({ ...f, [`player_${num}_ign`]: e.target.value }));
                        clearFieldError(`player_${num}_ign`);
                      }} 
                      required={num <= 4} 
                      placeholder="In-Game Name" 
                      error={fieldErrors[`player_${num}_ign`]}
                    />
                    <GhostInput 
                      label={`Player ${num} Character ID${num <= 4 ? ' *' : ''}`}
                      value={form[`player_${num}_id`]} 
                      onChange={e => {
                        setForm(f => ({ ...f, [`player_${num}_id`]: e.target.value }));
                        clearFieldError(`player_${num}_id`);
                      }} 
                      required={num <= 4} 
                      placeholder="5XXXXXXXXX" 
                      error={fieldErrors[`player_${num}_id`]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Screenshots Section */}
          {tournament.registration_config?.screenshots?.length > 0 && (
            <div className="bg-[#111] border border-white/5 p-8">
              <h2 className="font-bebas text-3xl text-white mb-2 flex items-center gap-3">
                <Camera className="text-[#dbb462]" size={24} /> 3 - REQUIRED PROOF
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
              disabled={submitting || saving}
              className="btn-obsidian-primary w-full md:w-auto px-20 py-5 font-bebas text-3xl tracking-widest uppercase disabled:opacity-50 disabled:cursor-wait"
            >
              {(submitting || saving) ? 'PROCESSING...' : 'REGISTER TEAM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
