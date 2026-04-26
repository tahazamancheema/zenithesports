import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Users, Clock, Calendar, FileText, Map, ListOrdered, BookOpen, MessageCircle } from 'lucide-react';
import { supabase } from '../supabase/config';
import { computeTournamentStatus } from '../utils/tournamentStatus';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/ui/StatusBadge';
import RegistrationCountdown from '../components/RegistrationCountdown';
import { useTournamentCountdown } from '../hooks/useTournamentCountdown';

const TABS = [
  { id: 'overview',  label: 'OVERVIEW',  icon: BookOpen },
  { id: 'schedule',  label: 'SCHEDULE',  icon: ListOrdered },
  { id: 'roadmap',   label: 'ROADMAP',   icon: Map },
  { id: 'teams',     label: 'TEAMS',    icon: Users },
];

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const { data: tData } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single();

        const { data: rData } = await supabase
          .from('registrations')
          .select('*')
          .eq('tournament_id', id)
          .neq('status', 'rejected');

        setTournament(tData);
        setRegistrations(rData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Safety timeout to prevent stuck loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id]);

  const { phase } = useTournamentCountdown(tournament?.registration_open_date, tournament?.registration_deadline);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex justify-center items-start bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4 mt-24 animate-pulse">
          <div className="w-16 h-[2px] bg-[#dbb462]" />
          <span className="font-bebas text-4xl text-[#dbb462] tracking-widest uppercase">Loading Data</span>
          <div className="w-16 h-[2px] bg-[#dbb462]" />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-agency text-3xl md:text-5xl font-bold mb-4">TOURNAMENT NOT FOUND</h1>
        <Link to="/tournaments" className="font-stretch text-[10px] text-[#dbb462] hover:underline uppercase tracking-widest">
          RETURN TO DIRECTORY
        </Link>
      </div>
    );
  }

  // Apply computed status
  let currentStatus = computeTournamentStatus(tournament);
  if (currentStatus === 'active' && phase === 'closed') currentStatus = 'closed';
  const t = { ...tournament, status: currentStatus };
  const { title, description, briefing, game, max_teams, prize_pool, status, start_date, registration_deadline, registration_open_date, poster_url } = t;

  // Parse schedule / roadmap (may come back as array from JSONB or string)
  const parseJSON = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };
  const schedule = parseJSON(t.schedule);
  const roadmap  = parseJSON(t.roadmap);

  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const totalCount    = registrations.length;
  const isUserRegistered = user && registrations.some(r => r.user_id === user.id);

  // Use total non-rejected count to determine if registrations should actually stop
  const isOpen   = status === 'active' && phase === 'closing' && (!max_teams || totalCount < max_teams);

  // Filter available tabs
  const visibleTabs = TABS.filter((tab) => {
    if (tab.id === 'schedule') return schedule.length > 0;
    if (tab.id === 'roadmap')  return roadmap.length > 0;
    return true;
  });

  const statusConfig = {
    active:      { label: 'REGISTRATIONS OPEN', cls: 'text-emerald-400 border-emerald-500/40' },
    in_progress: { label: 'IN PROGRESS',        cls: 'text-[#dbb462] border-[#dbb462]/40' },
    upcoming:    { label: 'UPCOMING',           cls: 'text-[#f9d07a] border-[#f9d07a]/30' },
    closed:      { label: 'REGISTRATIONS CLOSED', cls: 'text-red-400 border-red-500/30' },
    completed:   { label: 'COMPLETED',          cls: 'text-[#9a8f7f] border-[rgba(78,70,56,0.3)]' },
  };
  const sPill = statusConfig[status] || statusConfig.upcoming;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 md:pt-24 pb-20">

      {/* ── Hero Banner ── */}
      <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative border-b border-white/5 overflow-hidden">
        {poster_url ? (
          <img src={poster_url} alt="Poster" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-[3s]" />
        ) : (
          <div className="w-full h-full bg-[#131313] flex items-center justify-center">
            <Trophy className="text-[#dbb462] opacity-10" size={120} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-20 max-w-7xl mx-auto z-10">
          <Link
            to="/tournaments"
            className="inline-flex items-center text-[#d1c5b3] opacity-60 hover:opacity-100 hover:text-[#dbb462] transition-all mb-4 md:mb-8 font-teko text-[14px] md:text-[18px] tracking-widest uppercase"
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to Directory
          </Link>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-teko text-[16px] tracking-widest text-[#dbb462] uppercase bg-[#dbb462]/10 px-4 py-1.5 border border-[#dbb462]/30">
              {game || 'PUBG MOBILE'}
            </span>
            <span className={`font-teko text-[16px] tracking-widest uppercase border px-4 py-1.5 ${sPill.cls}`}>
              {sPill.label}
            </span>
          </div>
          <h1 className="font-bebas text-5xl md:text-9xl lg:text-[140px] uppercase leading-[0.9] md:leading-[0.8] tracking-tight mb-4 zenith-gradient-text pr-2">
            {title}
          </h1>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="border-b border-white/5 bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex gap-4 overflow-x-auto no-scrollbar">
          {visibleTabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => {
                setActiveTab(tabId);
                const el = document.getElementById('details-content');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`
                flex items-center gap-3 font-teko text-[20px] tracking-widest px-8 py-5 whitespace-nowrap border-b-2 transition-all duration-300
                ${activeTab === tabId
                  ? 'text-[#dbb462] border-[#dbb462]'
                  : 'text-[#d1c5b3] opacity-30 border-transparent hover:opacity-100'
                }
              `}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div id="details-content" className="max-w-7xl mx-auto px-6 lg:px-20 py-16 scroll-mt-40 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Left: Main Details */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-20">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-[2px] bg-[#dbb462]" />
                  <h2 className="font-bebas text-5xl text-[#dbb462]">TOURNAMENT OVERVIEW</h2>
                </div>
                <div className="bg-[#111] border border-white/5 p-10 md:p-16">
                  <p className="font-body text-[#d1c5b3] leading-[1.8] opacity-80 whitespace-pre-wrap text-lg">
                    {briefing || description || 'No official briefing provided for this tournament.'}
                  </p>
                </div>
            </section>
          )}

          {/* SCHEDULE */}
          {activeTab === 'schedule' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-[2px] bg-[#dbb462]" />
                  <h2 className="font-bebas text-5xl text-[#dbb462]">EVENT SCHEDULE</h2>
                </div>
              {schedule.length === 0 ? (
                <p className="font-teko text-[20px] text-white/20 tracking-widest uppercase">
                  Schedule pending publication.
                </p>
              ) : (
                <div className="space-y-4">
                  {schedule.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-8 bg-[#111] border border-white/5 px-8 py-6 group hover:border-[#dbb462]/30 transition-all duration-300"
                    >
                      <span className="font-bebas text-4xl text-[#dbb462] opacity-20 w-12 flex-shrink-0 group-hover:opacity-40 transition-opacity">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        {row.date && (
                          <p className="font-bebas text-3xl text-white">
                            {new Date(row.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                        {row.time && (
                          <p className="font-teko text-[14px] text-[#dbb462] tracking-widest uppercase opacity-60">{row.time}</p>
                        )}
                      </div>
                      <div className="w-px h-12 bg-white/5 flex-shrink-0" />
                      <p className="font-bebas text-3xl tracking-tight flex-1 text-white/90 group-hover:text-white transition-colors">{row.event}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-[2px] bg-[#dbb462]" />
                  <h2 className="font-bebas text-5xl text-[#dbb462]">TOURNAMENT ROADMAP</h2>
                </div>
              {roadmap.length === 0 ? (
                 <p className="font-teko text-[20px] text-white/20 tracking-widest uppercase">
                  Roadmap pending publication.
                </p>
              ) : (
                <div className="space-y-0 pl-4">
                  {roadmap.map((phase, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-4 h-4 rounded-full zenith-gradient shadow-[0_0_15px_rgba(219,180,98,0.5)] flex-shrink-0 mt-2" />
                        {i < roadmap.length - 1 && (
                          <div className="w-[1px] flex-1 bg-gradient-to-b from-[#dbb462]/30 to-white/5 mt-2 mb-2 min-h-[80px]" />
                        )}
                      </div>
                      <div className="pb-16 group-last:pb-0">
                        <span className="font-teko text-[14px] tracking-widest text-[#dbb462] block mb-2 uppercase opacity-60">
                           STAGE {i + 1} &bull; {phase.phase?.toUpperCase()}
                        </span>
                        <h3 className="font-bebas text-4xl mb-4 text-white group-hover:text-[#dbb462] transition-colors uppercase">{phase.title}</h3>
                        {phase.description && (
                          <p className="font-body text-[#d1c5b3] opacity-50 text-lg leading-relaxed max-w-xl group-hover:opacity-80 transition-opacity">{phase.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TEAMS */}
          {activeTab === 'teams' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-[2px] bg-[#dbb462]" />
                  <h2 className="font-bebas text-5xl text-[#dbb462]">REGISTERED TEAMS</h2>
                </div>
              {registrations.length === 0 ? (
                <p className="font-teko text-[20px] text-white/20 tracking-widest uppercase">
                  No teams registered for deployment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registrations.map((r, i) => (
                    <div
                      key={r.id}
                      className="bg-[#111] border border-white/5 p-6 flex items-center gap-6 group hover:border-[#dbb462]/30 transition-all duration-300"
                    >
                      <span className="font-bebas text-4xl text-[#dbb462] opacity-10 w-10 flex-shrink-0 group-hover:opacity-30 transition-opacity">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {r.logo_url ? (
                        <img src={r.logo_url} alt="" className="w-12 h-12 object-cover border border-white/5 group-hover:border-[#dbb462]/30 transition-colors" />
                      ) : (
                        <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center font-bebas text-2xl text-[#dbb462] border border-white/5">
                          {r.team_name?.[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bebas text-3xl truncate leading-none mb-1 text-white/90 group-hover:text-white transition-colors uppercase">{r.team_name}</p>
                        {r.city && (
                          <p className="font-teko text-[14px] tracking-widest text-[#d1c5b3] opacity-40 uppercase truncate leading-none">{r.city}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right: Details Panel */}
        <div className="lg:col-span-1 order-1 lg:order-2 space-y-8">
          <div className="bg-[#111] border border-white/5 p-10 space-y-12 sticky top-40 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 blur-3xl pointer-events-none" />
            
            {/* Registration Countdown */}
            {phase !== 'closed' && (
              <div className="pb-12 border-b border-white/5">
                <RegistrationCountdown 
                  openDate={registration_open_date} 
                  deadlineDate={registration_deadline} 
                />
              </div>
            )}

            {phase === 'closed' && (
               <div className="bg-[#dbb462]/5 border border-[#dbb462]/20 p-8 rounded-sm mb-8">
                 <div className="flex items-center gap-4 mb-4">
                   <MessageCircle size={24} className="text-[#dbb462]" />
                   <h3 className="font-bebas text-3xl text-white uppercase">CLOSED</h3>
                 </div>
                 <p className="font-body text-[#d1c5b3] text-sm leading-relaxed opacity-60 mb-8">
                   Registrations for this tournament are now closed. Please contact us via WhatsApp for any queries.
                 </p>
                 <a 
                   href="https://wa.me/923390715753" 
                   target="_blank" 
                   rel="noreferrer"
                   className="btn-obsidian-ghost w-full py-4 text-[16px] tracking-widest"
                 >
                   WHATSAPP SUPPORT
                 </a>
               </div>
            )}

            <div className="space-y-10">
              <h3 className="font-teko text-[18px] text-[#dbb462] tracking-widest uppercase opacity-80 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#dbb462]/40" /> SPECIFICATIONS
              </h3>

              <div className="space-y-8">
                <SpecRow icon={Trophy} label="Prize Distribution">
                  {prize_pool ? `PKR ${Number(prize_pool).toLocaleString('en-PK')}` : 'TBA'}
                </SpecRow>

                <SpecRow icon={Users} label="No. of Teams">
                  {max_teams ? `${approvedCount} / ${max_teams} VERIFIED` : `${approvedCount} / UNLIMITED`}
                </SpecRow>

                {start_date && (
                  <SpecRow icon={Calendar} label="Matches Start On">
                    {new Date(start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long' })}
                  </SpecRow>
                )}

                {registration_deadline && (
                  <SpecRow icon={Clock} label="Registration Deadline">
                    {new Date(registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'long' })}
                  </SpecRow>
                )}
              </div>

              {/* Slot progress */}
              <div className="pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-teko text-[14px] tracking-widest text-[#d1c5b3] opacity-60 uppercase">
                    {max_teams ? 'CAPACITY STATUS' : 'OPEN DEPLOYMENT'}
                  </span>
                  {max_teams && (
                    <span className="font-bebas text-xl text-[#dbb462]">
                      {Math.round((approvedCount / max_teams) * 100)}%
                    </span>
                  )}
                </div>
                <div className="w-full bg-white/5 h-1.5 overflow-hidden">
                  <div
                    className="zenith-gradient h-full transition-all duration-[2s] ease-out"
                    style={{ width: max_teams ? `${Math.min((approvedCount / max_teams) * 100, 100)}%` : '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Register CTA */}
            {isOpen && !isUserRegistered && (
              <Link
                to={`/register/${id}`}
                className="btn-obsidian-primary w-full py-5 text-2xl tracking-widest"
              >
                REGISTER TEAM →
              </Link>
            )}

            {isUserRegistered && (() => {
              const userReg = registrations.find(r => r.user_id === user?.id);
              const statusMap = {
                approved: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'APPROVED & VERIFIED' },
                pending:  { bg: 'bg-[#dbb462]/10', border: 'border-[#dbb462]/30', text: 'text-[#dbb462]', label: 'PENDING REVIEW' },
                rejected: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'REJECTED' }
              };
              const cfg = statusMap[userReg?.status] || statusMap.pending;
              return (
                <div className={`w-full py-5 text-center ${cfg.bg} border ${cfg.border} ${cfg.text} font-bebas text-2xl tracking-widest uppercase`}>
                  {cfg.label}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="text-[#dbb462] flex-shrink-0 mt-0.5" size={18} />
      <div>
        <p className="font-teko text-[14px] text-[#d1c5b3] tracking-widest uppercase opacity-60 mb-0.5 leading-none">{label}</p>
        <p className="font-bebas text-2xl text-white leading-none uppercase">{children}</p>
      </div>
    </div>
  );
}
