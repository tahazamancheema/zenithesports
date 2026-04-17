import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Users, Clock, Calendar, FileText, Map, ListOrdered, BookOpen } from 'lucide-react';
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
  { id: 'teams',     label: 'TEAMS',     icon: Users },
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
  }, [id]);

  const { phase } = useTournamentCountdown(tournament?.registration_open_date, tournament?.registration_deadline);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex justify-center items-start">
        <div className="flex flex-col items-center gap-4 mt-24 animate-pulse">
          <div className="w-12 h-1 zenith-gradient" />
          <span className="font-agency text-3xl font-bold italic text-[#dbb462]">LOADING</span>
          <div className="w-12 h-1 zenith-gradient" />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-agency text-5xl font-bold mb-4">TOURNAMENT NOT FOUND</h1>
        <Link to="/tournaments" className="font-stretch text-[10px] text-[#dbb462] hover:underline uppercase tracking-widest">
          RETURN TO DIRECTORY
        </Link>
      </div>
    );
  }

  // Apply computed status
  const t = { ...tournament, status: computeTournamentStatus(tournament) };
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
    active:    { label: 'REGISTRATIONS OPEN', cls: 'text-emerald-400 border-emerald-500/40' },
    upcoming:  { label: 'UPCOMING',           cls: 'text-[#f9d07a] border-[#f9d07a]/30' },
    completed: { label: 'COMPLETED',          cls: 'text-[#9a8f7f] border-[rgba(78,70,56,0.3)]' },
  };
  const sPill = statusConfig[status] || statusConfig.upcoming;

  return (
    <div className="min-h-screen pt-24 pb-20">

      {/* ── Hero Banner ── */}
      <div className="w-full h-80 lg:h-[450px] relative border-b border-[rgba(78,70,56,0.3)]">
        {poster_url ? (
          <img src={poster_url} alt="Poster" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#131313] flex items-center justify-center">
            <Trophy className="text-[#dbb462] opacity-20" size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[rgba(19,19,19,0.4)] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-16 max-w-7xl mx-auto">
          <Link
            to="/tournaments"
            className="inline-flex items-center text-[#d1c5b3] hover:text-[#dbb462] transition-colors mb-6 font-stretch text-[10px] tracking-widest uppercase"
          >
            <ChevronLeft size={14} className="mr-2" />
            Back to Tournaments
          </Link>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="font-stretch text-[10px] tracking-widest text-[#dbb462] uppercase bg-[#dbb462]/10 px-3 py-1 border border-[#dbb462]/30">
              {game || 'Esports'}
            </span>
            <span className={`font-stretch text-[10px] tracking-widest uppercase border px-3 py-1 ${sPill.cls}`}>
              {sPill.label}
            </span>
          </div>
          <h1 className="font-agency text-5xl lg:text-7xl font-bold uppercase drop-shadow-lg">{title}</h1>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="border-b border-[rgba(78,70,56,0.2)] bg-[#131313] sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex gap-1 overflow-x-auto no-scrollbar">
          {visibleTabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`
                flex items-center gap-2 font-stretch text-[10px] tracking-widest px-6 py-5 whitespace-nowrap border-b-2 transition-all duration-200
                ${activeTab === tabId
                  ? 'text-[#f9d07a] border-[#f9d07a]'
                  : 'text-[#d1c5b3] opacity-40 border-transparent hover:opacity-80'
                }
              `}
            >
              <Icon size={14} />
              {label}
              {tabId === 'teams' && <span className="text-[8px] opacity-60">({approvedCount})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left/Main */}
        <div className="lg:col-span-2">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <section className="space-y-8">
              <div>
                <h2 className="font-agency text-3xl font-bold mb-5 text-[#dbb462]">TOURNAMENT BRIEFING</h2>
                <p className="text-[#d1c5b3] leading-relaxed opacity-80 whitespace-pre-wrap">
                  {briefing || description || 'No official briefing provided for this tournament.'}
                </p>
              </div>
            </section>
          )}

          {/* SCHEDULE */}
          {activeTab === 'schedule' && (
            <section>
              <h2 className="font-agency text-3xl font-bold mb-6 text-[#dbb462]">EVENT SCHEDULE</h2>
              {schedule.length === 0 ? (
                <p className="font-stretch text-[10px] text-[#c6c6c6] tracking-widest opacity-50 uppercase">
                  Schedule not published yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {schedule.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-6 bg-[#1b1b1b] border border-[rgba(78,70,56,0.2)] px-6 py-4 group hover:border-[#dbb462]/30 transition-colors"
                    >
                      {/* Number */}
                      <span className="font-agency text-2xl font-bold text-[#dbb462] opacity-30 w-8 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* Date + Time */}
                      <div className="flex-shrink-0 text-center min-w-[90px]">
                        {row.date && (
                          <p className="font-agency text-lg font-bold">
                            {new Date(row.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                        {row.time && (
                          <p className="font-stretch text-[9px] text-[#dbb462] tracking-widest">{row.time}</p>
                        )}
                      </div>
                      {/* Divider */}
                      <div className="w-px h-8 bg-[rgba(78,70,56,0.3)] flex-shrink-0" />
                      {/* Event */}
                      <p className="font-agency text-xl font-bold tracking-tight flex-1">{row.event}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <section>
              <h2 className="font-agency text-3xl font-bold mb-6 text-[#dbb462]">TOURNAMENT ROADMAP</h2>
              {roadmap.length === 0 ? (
                <p className="font-stretch text-[10px] text-[#c6c6c6] tracking-widest opacity-50 uppercase">
                  Roadmap not published yet.
                </p>
              ) : (
                <div className="space-y-0">
                  {roadmap.map((phase, i) => (
                    <div key={i} className="flex gap-6">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-4 h-4 rounded-full zenith-gradient flex-shrink-0 mt-1" />
                        {i < roadmap.length - 1 && (
                          <div className="w-px flex-1 bg-[rgba(78,70,56,0.3)] mt-1 mb-0 min-h-[40px]" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-10">
                        <span className="font-stretch text-[9px] tracking-widest text-[#dbb462] block mb-1">
                          {phase.phase?.toUpperCase()}
                        </span>
                        <h3 className="font-agency text-2xl font-bold mb-2">{phase.title}</h3>
                        {phase.description && (
                          <p className="text-[#d1c5b3] opacity-60 text-sm leading-relaxed">{phase.description}</p>
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
            <section>
              <h2 className="font-agency text-3xl font-bold mb-6 text-[#dbb462]">REGISTERED TEAMS</h2>
              {registrations.length === 0 ? (
                <p className="font-stretch text-[10px] text-[#c6c6c6] tracking-widest opacity-50 uppercase">
                  No teams registered yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {registrations.map((r, i) => (
                    <div
                      key={r.id}
                      className="bg-[#1b1b1b] border border-[rgba(78,70,56,0.2)] p-4 flex items-center gap-4"
                    >
                      <span className="font-agency text-lg font-bold text-[#dbb462] opacity-40 w-8 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {r.logo_url ? (
                        <img src={r.logo_url} alt="" className="w-10 h-10 object-cover rounded-full border border-[#4e4638] flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-[#2a2a2a] rounded-full flex items-center justify-center font-agency text-sm text-[#f9d07a] font-bold flex-shrink-0">
                          {r.team_name?.[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-agency text-xl font-bold truncate">{r.team_name}</p>
                        {r.city && (
                          <p className="font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-40">{r.city.toUpperCase()}</p>
                        )}
                      </div>
                      <div className="ml-auto flex-shrink-0">
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <div className="bg-[#1f1f1f] p-6 border-t-2 border-[#dbb462] space-y-8">
            
            {/* Registration Countdown */}
            <RegistrationCountdown 
              openDate={registration_open_date} 
              deadlineDate={registration_deadline} 
            />

            <div className="border-t border-[rgba(78,70,56,0.15)] pt-6">
              <h3 className="font-stretch text-[10px] text-[#d1c5b3] tracking-widest mb-6 opacity-50 uppercase">
                Event Specifications
              </h3>

            <div className="space-y-6">
              <SpecRow icon={Trophy} label="Prize Pool">
                {prize_pool ? `PKR ${Number(prize_pool).toLocaleString('en-PK')}` : 'TBA'}
              </SpecRow>

              <SpecRow icon={Users} label="Teams Registered">
                {max_teams ? `${approvedCount} / ${max_teams}` : `${approvedCount} Teams`}
              </SpecRow>

              {start_date && (
                <SpecRow icon={Calendar} label="Start Date">
                  {new Date(start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </SpecRow>
              )}

              {registration_deadline && (
                <SpecRow icon={Clock} label="Registration Deadline">
                  {new Date(registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </SpecRow>
              )}
            </div>

            {/* Slot progress */}
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-50">
                  {max_teams ? 'SLOTS FILLED' : 'OPEN TOURNAMENT'}
                </span>
                {max_teams && (
                  <span className="font-stretch text-[8px] tracking-widest text-[#f9d07a]">
                    {Math.round((approvedCount / max_teams) * 100)}%
                  </span>
                )}
              </div>
              <div className="w-full bg-[#353535] h-1">
                <div
                  className="zenith-gradient h-full transition-all duration-700"
                  style={{ width: max_teams ? `${Math.min((approvedCount / max_teams) * 100, 100)}%` : '100%' }}
                />
              </div>
              </div>
            </div>

            {/* Register CTA */}
            {isOpen && !isUserRegistered && (
              <Link
                to={`/register/${id}`}
                className="block w-full mt-8 text-center zenith-gradient text-[#402d00] font-stretch text-[10px] py-4 tracking-widest hover:brightness-110 active:scale-95 transition-all uppercase"
              >
                Register Team
              </Link>
            )}

            {isUserRegistered && (
              <div className="w-full mt-8 text-center bg-[#dbb462]/10 border border-[#dbb462]/30 text-[#dbb462] font-stretch text-[9px] py-4 tracking-[0.2em] uppercase">
                ENTRY SUBMITTED — VIEWING STATUS
              </div>
            )}
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
        <p className="font-stretch text-[8px] text-[#c6c6c6] tracking-widest uppercase">{label}</p>
        <p className="font-agency text-xl font-bold">{children}</p>
      </div>
    </div>
  );
}
