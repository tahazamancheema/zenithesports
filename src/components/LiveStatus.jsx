import React, { useState, useEffect } from 'react';
import { useYouTubeLive } from '../hooks/useYouTubeLive';
import { Play, Wifi, WifiOff, Clock, RefreshCw } from 'lucide-react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // must match hook value

/** Return mm:ss until next refresh */
function useCountdown(lastChecked) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!lastChecked) return;
    function tick() {
      const elapsed = Date.now() - lastChecked.getTime();
      const remaining = Math.max(0, CHECK_INTERVAL_MS - elapsed);
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setLabel(`${mins}:${secs.toString().padStart(2, '0')}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastChecked]);

  return label;
}

/**
 * LiveStatus — Shows YouTube live stream if channel is live,
 * otherwise shows the latest upload. Full "BROADCAST CENTER" section.
 */
export default function LiveStatus() {
  const { isLive, videoId, title, viewerCount, loading, error, apiAvailable, lastChecked } = useYouTubeLive();
  const countdown = useCountdown(lastChecked);

  return (
    <section className="bg-[#1b1b1b] py-20 px-6 md:px-12" id="live">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-12 border-b border-[rgba(219,180,98,0.1)] pb-8">
        <div>
          <span className="font-teko text-[#dbb462] text-[20px] tracking-[0.2em] font-medium block mb-2 uppercase">
            LIVE BROADCAST
          </span>
          <h2 className="font-bebas text-7xl md:text-9xl tracking-tight leading-none pr-4 flex flex-wrap gap-x-6">
            <span className="zenith-gradient-text pr-2">{isLive ? 'LIVE' : 'LATEST'}</span>
            <span className="zenith-gradient-text pr-2">CONTENT</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {isLive ? (
            <span className="flex items-center gap-2 font-teko text-[16px] tracking-[0.2em] text-red-500 uppercase">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              BROADCAST ACTIVE
            </span>
          ) : (
            <span className="flex items-center gap-2 font-teko text-[16px] tracking-[0.2em] text-[#d1c5b3] opacity-40 uppercase">
              <Clock size={14} />
              RECENT UPLOADS
            </span>
          )}
          {apiAvailable && countdown && (
            <span className="flex items-center gap-1.5 font-teko text-[14px] tracking-[0.1em] text-[#dbb462] border border-[#dbb462]/20 px-3 py-1.5 bg-[#dbb462]/5">
              <RefreshCw size={12} className="animate-spin-slow" />
              REFRESH IN {countdown}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Video */}
        <div className="lg:col-span-8">
          {loading ? (
            <LoadingSkeleton />
          ) : error || !apiAvailable ? (
            <NoAPIPlaceholder />
          ) : videoId ? (
            <div className="relative group/vid">
              {/* Status badge */}
              <div className="absolute top-6 left-6 z-10 flex gap-3">
                {isLive ? (
                  <span className="bg-red-700 px-4 py-1.5 font-teko text-[14px] tracking-[0.2em] flex items-center gap-2 text-white shadow-xl">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="bg-[#131313] px-4 py-1.5 font-teko text-[14px] tracking-[0.2em] text-[#dbb462] flex items-center gap-2 border border-[#dbb462]/20 shadow-xl">
                    <Play size={12} fill="currentColor" />
                    LATEST VIDEO
                  </span>
                )}
              </div>

              {/* YouTube Embed Container */}
              <div className="relative aspect-video w-full bg-[#0e0e0e] border border-white/5 overflow-hidden shadow-2xl group-hover/vid:border-[#dbb462]/20 transition-all duration-500">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Video Title */}
              {title && (
                <div className="mt-6">
                  <h3 className="font-bebas text-4xl tracking-tight uppercase mb-3 text-[#f2f2f2]">{title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1f1f1f] border border-[#dbb462]/10 p-1 flex items-center justify-center">
                      <img
                        src="/logo.png"
                        alt="Zenith"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <span className="font-teko text-[16px] tracking-[0.2em] text-[#dbb462] uppercase">
                      OFFICIAL CHANNEL &bull; ZENITH ESPORTS
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NoAPIPlaceholder />
          )}
        </div>

        {/* Side info panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Channel info card */}
          <div className="bg-[#131313] p-10 border border-white/5 border-t-2 border-[#dbb462] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#dbb462]/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1.5 h-1.5 bg-[#dbb462] rounded-full" />
              <span className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462] uppercase font-bold">
                Broadcast Information
              </span>
            </div>
            <div className="space-y-8">
              <SpecRow label="CHANNEL HANDLE" value="@zenithesports.pakistan" />
              <SpecRow label="CURRENT GAME" value="PUBG MOBILE" />
              <SpecRow label="CONNECTION" value={isLive ? 'CONNECTED' : 'STANDBY'} active={isLive} />
            </div>
          </div>

          {/* Subscribe CTA */}
          <div className="bg-[#1a1a1a] p-10 border border-white/5 group relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#dbb462]/5 blur-2xl group-hover:bg-[#dbb462]/10 transition-colors" />
            <h4 className="font-teko text-[22px] tracking-[0.2em] text-[#dbb462] mb-4 uppercase font-bold">
              JOIN THE COMMUNITY
            </h4>
            <p className="font-body text-[#d1c5b3] text-base opacity-40 mb-8 leading-relaxed">
              Never miss a moment. Subscribe for major Pakistani tournament broadcasts, highlights, and team spotlights.
            </p>
            <a
              href="https://youtube.com/@zenithesports.pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center zenith-gradient text-[#402d00] font-bebas text-2xl py-4 tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(219,180,98,0.1)] group-hover:shadow-[0_0_30px_rgba(219,180,98,0.2)]"
            >
              SUBSCRIBE ON YOUTUBE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="yt-embed-container bg-[#1f1f1f] animate-pulse relative" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-teko text-[18px] tracking-[0.2em] text-[#dbb462]/40 uppercase">
            Loading Broadcast...
          </div>
        </div>
      </div>
    </div>
  );
}

function NoAPIPlaceholder() {
  return (
    <div className="yt-embed-container bg-[#0e0e0e] border border-[rgba(78,70,56,0.3)] relative" style={{ paddingBottom: '56.25%' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#1f1f1f] flex items-center justify-center">
          <Play size={24} className="text-[#dbb462]" />
        </div>
        <div className="text-center px-6">
          <p className="font-bebas text-4xl text-[#d1c5b3] uppercase">BROADCAST CENTER</p>
          <p className="font-teko text-[14px] tracking-[0.2em] text-[#dbb462]/40 mt-2 uppercase">
            Video Fetch Pending
          </p>
        </div>
        <a
          href="https://youtube.com/@zenithesports.pakistan"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-obsidian-primary font-bebas text-2xl px-8 py-3 tracking-widest uppercase"
        >
          YouTube Channel
        </a>
      </div>
    </div>
  );
}

function SpecRow({ label, value, active }) {
  return (
    <div className="flex flex-col gap-1 transition-all group/row border-l border-white/5 pl-4 hover:border-[#dbb462]/40">
      <span className="font-teko text-[14px] tracking-[0.2em] text-[#dbb462]/40 uppercase font-medium group-hover/row:text-[#dbb462]/80 transition-colors">
        {label}
      </span>
      <span className={`font-bebas text-2xl tracking-[0.05em] ${active ? 'text-emerald-400' : 'text-white'} transition-all truncate`}>
        {value}
      </span>
    </div>
  );
}
