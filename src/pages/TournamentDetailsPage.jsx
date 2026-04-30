import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Users, Clock, Calendar, Map, ListOrdered, BookOpen, MessageCircle, ArrowRight, Shield, ChevronRight } from 'lucide-react';
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
    const timer = setTimeout(() => setLoading(false), 5000);
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
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
        <Trophy className="text-[#dbb462] opacity-[0.06] mb-8" size={80} />
        <h1 className="font-bebas text-5xl mb-4 uppercase">TOURNAMENT NOT FOUND</h1>
        <Link to="/tournaments" className="font-teko text-[16px] text-[#dbb462] hover:underline uppercase tracking-[0.2em]">
          RETURN TO DIRECTORY
        </Link>
      </div>
    );
  }

  let currentStatus = computeTournamentStatus(tournament);
  if (currentStatus === 'active' && phase === 'closed') currentStatus = 'closed';
  const t = { ...tournament, status: currentStatus };
  const { title, description, briefing, game, max_teams, prize_pool, status, start_date, registration_deadline, registration_open_date, poster_url } = t;

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
  const isOpen = status === 'active' && phase === 'closing' && (!max_teams || totalCount < max_teams);
  const capacityPct = max_teams ? Math.min((approvedCount / max_teams) * 100, 100) : 100;

  const visibleTabs = TABS.filter((tab) => {
    if (tab.id === 'schedule') return schedule.length > 0;
    if (tab.id === 'roadmap')  return roadmap.length > 0;
    return true;
  });

  const statusConfig = {
    active:      { label: 'REGISTRATIONS OPEN',   cls: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', dot: 'bg-emerald-400' },
    in_progress: { label: 'IN PROGRESS',          cls: 'text-[#dbb462] border-[#dbb462]/30 bg-[#dbb462]/10',      dot: 'bg-[#dbb462]' },
    upcoming:    { label: 'UPCOMING',             cls: 'text-[#f9d07a] border-[#f9d07a]/30 bg-[#f9d07a]/10',      dot: 'bg-[#f9d07a]' },
    closed:      { label: 'REGISTRATIONS CLOSED', cls: 'text-red-400 border-red-500/30 bg-red-500/10',             dot: 'bg-red-400' },
    completed:   { label: 'COMPLETED',            cls: 'text-[#9a8f7f] border-[#9a8f7f]/30 bg-[#9a8f7f]/10',      dot: 'bg-[#9a8f7f]' },
  };
  const sPill = statusConfig[status] || statusConfig.upcoming;

  const prizeFormatted = prize_pool ? `PKR ${Number(prize_pool).toLocaleString('en-PK')}` : 'TBA';

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 md:pt-24 pb-20">

      {/* ═══ Hero Banner ═══ */}
      <div className="w-full relative border-b border-white/[0.04] overflow-hidden">
        {/* Poster BG */}
        <div className="absolute inset-0">
          {poster_url ? (
            <img src={poster_url} alt="" className="w-full h-full object-cover scale-105" />
          ) : (
            <div className="w-full h-full bg-[#0e0e0e]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-16 md:py-24 lg:py-32">
          {/* Breadcrumb */}
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 text-[#d1c5b3] opacity-50 hover:opacity-100 hover:text-[#dbb462] transition-all mb-8 font-teko text-[16px] tracking-[0.2em] uppercase"
          >
            <ChevronLeft size={16} /> Back to Tournaments
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className="font-teko text-[14px] tracking-[0.2em] text-[#dbb462] uppercase bg-[#dbb462]/10 px-4 py-1.5 border border-[#dbb462]/20">
              {game || 'PUBG MOBILE'}
            </span>
            <span className={`flex items-center gap-2 font-teko text-[14px] tracking-[0.2em] uppercase border px-4 py-1.5 ${sPill.cls}`}>
              <span className={`w-1.5 h-1.5 ${sPill.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
              {sPill.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-bebas text-5xl md:text-8xl lg:text-[10rem] uppercase leading-[0.82] tracking-tight mb-8 zenith-gradient-text pr-2">
            {title}
          </h1>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-[1px] bg-white/[0.04] max-w-3xl">
            <QuickStat label="PRIZE POOL" value={prizeFormatted} gold />
            <QuickStat label="TEAMS" value={max_teams ? `${approvedCount}/${max_teams}` : `${approvedCount}`} />
            <QuickStat label="STARTS" value={start_date ? new Date(start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
            <QuickStat label="DEADLINE" value={registration_deadline ? new Date(registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
          </div>
        </div>
      </div>

      {/* ═══ Tab Bar ═══ */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex gap-0 overflow-x-auto no-scrollbar">
          {visibleTabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => {
                setActiveTab(tabId);
                document.getElementById('details-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`
                flex items-center gap-3 font-teko text-[18px] tracking-[0.15em] px-6 md:px-8 py-5 whitespace-nowrap border-b-2 transition-all duration-300 uppercase
                ${activeTab === tabId
                  ? 'text-[#dbb462] border-[#dbb462]'
                  : 'text-[#d1c5b3] opacity-25 border-transparent hover:opacity-80'
                }
              `}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Content Area ═══ */}
      <div id="details-content" className="max-w-7xl mx-auto px-6 lg:px-16 py-16 scroll-mt-40 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

        {/* ── Left: Tab Content ── */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-16">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <section key="overview" style={{ animation: 'fadeIn 0.4s ease-out both' }}>
              <SectionHeader title="TOURNAMENT OVERVIEW" />
              <div className="bg-[#0e0e0e] border border-white/[0.06] p-8 md:p-12">
                <p className="font-body text-[#d1c5b3] leading-[1.8] opacity-70 whitespace-pre-wrap text-lg">
                  {briefing || description || 'No official briefing provided for this tournament.'}
                </p>
              </div>
            </section>
          )}

          {/* SCHEDULE */}
          {activeTab === 'schedule' && (
            <section key="schedule" style={{ animation: 'fadeIn 0.4s ease-out both' }}>
              <SectionHeader title="EVENT SCHEDULE" />
              {schedule.length === 0 ? (
                <p className="font-teko text-[18px] text-white/20 tracking-[0.2em] uppercase">Schedule pending publication.</p>
              ) : (
                <div className="space-y-[1px] bg-white/[0.04]">
                  {schedule.map((row, i) => (
                    <div key={i} className="bg-[#0e0e0e] flex items-center gap-6 md:gap-8 px-6 md:px-8 py-6 group hover:bg-[#111] transition-all duration-300 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#dbb462] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                      <span className="font-bebas text-3xl text-[#dbb462] opacity-20 w-10 flex-shrink-0 group-hover:opacity-50 transition-opacity">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-shrink-0 text-center min-w-[80px]">
                        {row.date && <p className="font-bebas text-2xl text-white">{new Date(row.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</p>}
                        {row.time && <p className="font-teko text-[13px] text-[#dbb462] tracking-[0.15em] uppercase opacity-60">{row.time}</p>}
                      </div>
                      <div className="w-px h-10 bg-white/[0.06] flex-shrink-0" />
                      <p className="font-bebas text-2xl md:text-3xl tracking-tight flex-1 text-white/80 group-hover:text-white transition-colors">{row.event}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <section key="roadmap" style={{ animation: 'fadeIn 0.4s ease-out both' }}>
              <SectionHeader title="TOURNAMENT ROADMAP" />
              {roadmap.length === 0 ? (
                <p className="font-teko text-[18px] text-white/20 tracking-[0.2em] uppercase">Roadmap pending publication.</p>
              ) : (
                <div className="space-y-0 pl-4">
                  {roadmap.map((p, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-4 h-4 zenith-gradient shadow-[0_0_15px_rgba(219,180,98,0.4)] flex-shrink-0 mt-2" />
                        {i < roadmap.length - 1 && (
                          <div className="w-[1px] flex-1 bg-gradient-to-b from-[#dbb462]/30 to-white/5 mt-2 mb-2 min-h-[80px]" />
                        )}
                      </div>
                      <div className="pb-14 group-last:pb-0">
                        <span className="font-teko text-[13px] tracking-[0.2em] text-[#dbb462] block mb-2 uppercase opacity-60">
                          STAGE {i + 1} &bull; {p.phase?.toUpperCase()}
                        </span>
                        <h3 className="font-bebas text-3xl md:text-4xl mb-3 text-white group-hover:text-[#dbb462] transition-colors uppercase">{p.title}</h3>
                        {p.description && (
                          <p className="font-body text-[#d1c5b3] opacity-40 text-base leading-relaxed max-w-xl group-hover:opacity-70 transition-opacity">{p.description}</p>
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
            <section key="teams" style={{ animation: 'fadeIn 0.4s ease-out both' }}>
              <SectionHeader title="REGISTERED TEAMS" count={registrations.length} />
              {registrations.length === 0 ? (
                <p className="font-teko text-[18px] text-white/20 tracking-[0.2em] uppercase">No teams registered yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.04]">
                  {registrations.map((r, i) => (
                    <div key={r.id} className="bg-[#0e0e0e] p-5 flex items-center gap-5 group hover:bg-[#111] transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#dbb462] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      <span className="font-bebas text-3xl text-[#dbb462] opacity-10 w-8 flex-shrink-0 group-hover:opacity-30 transition-opacity">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {r.logo_url ? (
                        <img src={r.logo_url} alt="" className="w-10 h-10 object-cover border border-white/[0.06]" />
                      ) : (
                        <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center font-bebas text-xl text-[#dbb462] border border-white/[0.06]">
                          {r.team_name?.[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bebas text-2xl truncate leading-none mb-1 text-white/80 group-hover:text-white transition-colors uppercase">{r.team_name}</p>
                        {r.city && <p className="font-teko text-[13px] tracking-[0.15em] text-[#d1c5b3] opacity-30 uppercase truncate leading-none">{r.city}</p>}
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="sticky top-40 space-y-6">

            {/* Registration CTA Card */}
            <div className="bg-[#0e0e0e] border border-white/[0.06] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] zenith-gradient" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#dbb462]/[0.04] blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                {/* Countdown / Status Banner */}
                {phase !== 'closed' && (
                  <div className="p-6 pb-0">
                    <RegistrationCountdown openDate={registration_open_date} deadlineDate={registration_deadline} />
                  </div>
                )}

                {phase === 'closed' && (
                  <div className="p-6 pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle size={18} className="text-[#dbb462]" />
                      <h3 className="font-bebas text-2xl text-white uppercase">REGISTRATIONS CLOSED</h3>
                    </div>
                    <p className="font-body text-[#d1c5b3] text-sm leading-relaxed opacity-50 mb-4">
                      Registrations are closed. Contact us via WhatsApp for any queries.
                    </p>
                    <a href="https://wa.me/923390715753" target="_blank" rel="noreferrer" className="btn-obsidian-ghost w-full py-3 font-bebas text-[16px] tracking-[0.15em]">
                      WHATSAPP SUPPORT
                    </a>
                  </div>
                )}

                {/* Specs Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-[1px] bg-white/[0.04] mb-6">
                    <SpecCell icon={Trophy} label="PRIZE POOL" value={prizeFormatted} gold />
                    <SpecCell icon={Users} label="TEAMS" value={max_teams ? `${approvedCount}/${max_teams}` : `${approvedCount}/∞`} />
                    <SpecCell icon={Calendar} label="STARTS" value={start_date ? new Date(start_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
                    <SpecCell icon={Clock} label="DEADLINE" value={registration_deadline ? new Date(registration_deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'TBA'} />
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-teko text-[12px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase">
                        {max_teams ? 'SLOT CAPACITY' : 'REGISTRATIONS'}
                      </span>
                      <span className="font-bebas text-xl text-[#dbb462]">
                        {max_teams ? `${Math.round(capacityPct)}%` : approvedCount}
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 relative overflow-hidden">
                      <div className="zenith-gradient h-full transition-all duration-[2s] ease-out" style={{ width: `${capacityPct}%` }} />
                    </div>
                    {max_teams && (
                      <p className="font-teko text-[11px] tracking-[0.15em] text-[#d1c5b3] opacity-25 uppercase mt-2 text-right">
                        {max_teams - approvedCount > 0 ? `${max_teams - approvedCount} SLOTS REMAINING` : 'FULL'}
                      </p>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    {/* Show Register button: for logged-in users it goes to register, for logged-out it goes to auth */}
                    {isOpen && !isUserRegistered && (
                      <Link
                        to={user ? `/register/${id}` : '/auth'}
                        className="btn-obsidian-primary w-full py-5 font-bebas text-[22px] tracking-[0.2em] inline-flex items-center justify-center gap-3 uppercase group/cta"
                      >
                        {user ? 'REGISTER TEAM' : 'LOGIN TO REGISTER'} <ArrowRight size={20} className="group-hover/cta:translate-x-1 transition-transform" />
                      </Link>
                    )}

                    {/* Also show Register CTA for non-logged-in users when status is active but not phase closing yet */}
                    {!user && status === 'active' && phase !== 'closing' && phase !== 'closed' && (
                      <Link
                        to="/auth"
                        className="btn-obsidian-primary w-full py-5 font-bebas text-[22px] tracking-[0.2em] inline-flex items-center justify-center gap-3 uppercase group/cta"
                      >
                        LOGIN TO REGISTER <ArrowRight size={20} className="group-hover/cta:translate-x-1 transition-transform" />
                      </Link>
                    )}

                    {isUserRegistered && (() => {
                      const userReg = registrations.find(r => r.user_id === user?.id);
                      const cfg = {
                        approved: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'APPROVED ✓' },
                        pending:  { bg: 'bg-[#dbb462]/10',   border: 'border-[#dbb462]/20',   text: 'text-[#dbb462]',   label: 'PENDING REVIEW' },
                        rejected: { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     label: 'REJECTED' },
                      }[userReg?.status] || { bg: 'bg-[#dbb462]/10', border: 'border-[#dbb462]/20', text: 'text-[#dbb462]', label: 'PENDING REVIEW' };
                      return (
                        <div className={`w-full py-5 text-center ${cfg.bg} border ${cfg.border} ${cfg.text} font-bebas text-[22px] tracking-[0.15em] uppercase`}>
                          {cfg.label}
                        </div>
                      );
                    })()}

                    {!isOpen && !isUserRegistered && !user && status !== 'active' && (
                      <Link
                        to="/auth"
                        className="btn-obsidian-ghost w-full py-4 font-bebas text-[20px] tracking-[0.15em] uppercase"
                      >
                        LOGIN TO REGISTER
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <a
              href="https://wa.me/923390715753"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-[#0e0e0e] border border-white/[0.06] p-5 hover:border-[#dbb462]/20 transition-all group"
            >
              <Shield size={20} className="text-[#dbb462] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1">
                <p className="font-bebas text-xl text-white group-hover:text-[#dbb462] transition-colors uppercase">Need Help?</p>
                <p className="font-teko text-[12px] tracking-[0.15em] text-[#d1c5b3] opacity-40 uppercase">Contact Support via WhatsApp</p>
              </div>
              <ChevronRight size={16} className="text-[#dbb462] opacity-30 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="w-8 h-[2px] bg-[#dbb462]" />
      <h2 className="font-bebas text-4xl md:text-5xl text-[#dbb462] uppercase">{title}</h2>
      {count !== undefined && (
        <span className="font-teko text-[14px] tracking-[0.2em] text-[#d1c5b3] opacity-30 uppercase ml-2">{count}</span>
      )}
    </div>
  );
}

function QuickStat({ label, value, gold }) {
  return (
    <div className="bg-[#0e0e0e]/80 backdrop-blur-sm px-6 py-4 flex-1 min-w-[120px]">
      <span className="font-teko text-[11px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase block mb-1">{label}</span>
      <span className={`font-bebas text-2xl leading-none ${gold ? 'text-[#dbb462]' : 'text-[#f2f2f2]'}`}>{value}</span>
    </div>
  );
}

function SpecRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 group">
      <Icon className="text-[#dbb462] flex-shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" size={16} />
      <div>
        <p className="font-teko text-[12px] text-[#d1c5b3] tracking-[0.15em] uppercase opacity-40 mb-0.5 leading-none">{label}</p>
        <p className="font-bebas text-xl text-white leading-none uppercase">{children}</p>
      </div>
    </div>
  );
}

function SpecCell({ icon: Icon, label, value, gold }) {
  return (
    <div className="bg-[#0e0e0e] p-4 group hover:bg-[#111] transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[#dbb462] opacity-40 group-hover:opacity-80 transition-opacity" />
        <span className="font-teko text-[11px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase">{label}</span>
      </div>
      <p className={`font-bebas text-xl leading-none ${gold ? 'text-[#dbb462]' : 'text-[#f2f2f2]'}`}>{value}</p>
    </div>
  );
}

