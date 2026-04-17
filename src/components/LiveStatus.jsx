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
      <div className="flex justify-between items-end mb-12 border-b border-[rgba(78,70,56,0.15)] pb-8">
        <div>
          <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-2">
            BROADCAST CENTER
          </span>
          <h2 className="font-agency text-6xl md:text-7xl font-bold tracking-tighter leading-tight pb-2 pr-4 italic">
            {isLive ? 'LIVE NOW' : 'LATEST UPLOAD'}
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {isLive ? (
            <span className="flex items-center gap-2 font-stretch text-[10px] tracking-widest text-red-400">
              <span className="w-2 h-2 bg-red-500 rounded-full live-dot" />
              24/7 STREAMING
            </span>
          ) : (
            <span className="flex items-center gap-2 font-stretch text-[10px] tracking-widest text-[#d1c5b3] opacity-40">
              <Clock size={12} />
              LATEST CONTENT
            </span>
          )}
          {/* Refresh countdown — only visible when API is active */}
          {apiAvailable && countdown && (
            <span className="flex items-center gap-1.5 font-stretch text-[8px] tracking-widest text-[#d1c5b3] opacity-30 border border-[rgba(78,70,56,0.2)] px-2 py-1">
              <RefreshCw size={9} />
              NEXT CHECK {countdown}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Video */}
        <div className="lg:col-span-8">
          {loading ? (
            <LoadingSkeleton />
          ) : error || !apiAvailable ? (
            <NoAPIPlaceholder />
          ) : videoId ? (
            <div className="relative">
              {/* Status badge */}
              <div className="absolute top-4 left-4 z-10 flex gap-3">
                {isLive ? (
                  <span className="bg-red-600 px-3 py-1 font-stretch text-[10px] tracking-widest flex items-center gap-2 text-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                    LIVE
                  </span>
                ) : (
                  <span className="bg-[#1f1f1f]/90 px-3 py-1 font-stretch text-[10px] tracking-widest text-[#f9d07a] flex items-center gap-2">
                    <Play size={10} />
                    LATEST UPLOAD
                  </span>
                )}
                {isLive && viewerCount && (
                  <span className="bg-[#2a2a2a]/80 backdrop-blur-md px-3 py-1 font-stretch text-[10px] tracking-widest text-[#d1c5b3]">
                    {Number(viewerCount).toLocaleString('en-PK')} WATCHING
                  </span>
                )}
              </div>

              {/* YouTube Embed */}
              <div className="yt-embed-container">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                />
              </div>

              {/* Video Title */}
              {title && (
                <div className="mt-4 px-2">
                  <h3 className="font-agency text-2xl font-bold tracking-tight">{title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src="/logo.png"
                      alt="Zenith"
                      className="w-6 h-6 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-60">
                      @ZENITHESPORTS.PAKISTAN
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
          <div className="bg-[#0e0e0e] p-8 border-l-4 border-[#dbb462]">
            <span className="font-stretch text-[9px] tracking-widest text-[#f9d07a] block mb-4">
              CHANNEL INFO
            </span>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-stretch text-[9px] text-[#c6c6c6] tracking-widest">CHANNEL</span>
                <span className="font-agency text-sm md:text-lg text-[#f9d07a] font-bold">@ZENITHESPORTS.PAKISTAN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-stretch text-[9px] text-[#c6c6c6] tracking-widest">PLATFORM</span>
                <span className="font-agency text-lg text-[#f9d07a] font-bold">PUBG MOBILE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-stretch text-[9px] text-[#c6c6c6] tracking-widest">STATUS</span>
                <span className={`flex items-center gap-2 font-agency text-lg font-bold ${isLive ? 'text-green-400' : 'text-[#d1c5b3]'}`}>
                  {isLive ? (
                    <>
                      <Wifi size={14} />
                      LIVE
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} />
                      OFFLINE
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Subscribe CTA */}
          <div className="bg-[#1f1f1f] p-8">
            <h4 className="font-stretch text-[10px] tracking-widest text-[#f9d07a] mb-3">
              STAY CONNECTED
            </h4>
            <p className="text-[#d1c5b3] text-sm opacity-60 mb-6 leading-relaxed">
              Subscribe for live tournaments, highlight reels, and PUBG Mobile competitive content from Pakistan's top teams.
            </p>
            <a
              href="https://youtube.com/@zenithesports.pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center zenith-gradient text-[#402d00] font-stretch text-[10px] py-4 tracking-widest hover:brightness-110 active:scale-95 transition-all"
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
      <div className="yt-embed-container bg-[#1f1f1f] animate-pulse" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-stretch text-[10px] tracking-widest text-[#4e4638]">
            LOADING BROADCAST...
          </div>
        </div>
      </div>
    </div>
  );
}

function NoAPIPlaceholder() {
  return (
    <div className="yt-embed-container bg-[#0e0e0e] border border-[rgba(78,70,56,0.3)]" style={{ aspectRatio: '16/9', position: 'relative', paddingBottom: '56.25%' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#1f1f1f] flex items-center justify-center">
          <Play size={24} className="text-[#dbb462]" />
        </div>
        <div className="text-center">
          <p className="font-agency text-2xl font-bold text-[#d1c5b3]">BROADCAST CENTER</p>
          <p className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-40 mt-2">
            CONFIGURE YOUTUBE API KEY TO ENABLE LIVE STATUS
          </p>
        </div>
        <a
          href="https://youtube.com/@zenithesports.pakistan"
          target="_blank"
          rel="noopener noreferrer"
          className="zenith-gradient text-[#402d00] font-stretch text-[10px] px-6 py-3 tracking-widest hover:brightness-110 transition-all"
        >
          WATCH ON YOUTUBE
        </a>
      </div>
    </div>
  );
}
