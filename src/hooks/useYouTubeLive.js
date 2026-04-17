import { useState, useEffect, useRef } from 'react';

const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_HANDLE = import.meta.env.VITE_YOUTUBE_CHANNEL_HANDLE || '@zenithesports.pakistan';
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || null;

// How often to re-check live status (milliseconds)
// 5 minutes = 300_000 ms  |  change to suit your needs
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

// Cache the resolved channel ID for the page session so we
// don't waste API quota re-resolving it on every interval tick.
let cachedChannelId = CHANNEL_ID || null;

async function resolveChannelId() {
  if (cachedChannelId) return cachedChannelId;
  if (!YT_API_KEY || YT_API_KEY === 'YOUR_YOUTUBE_DATA_API_KEY_HERE') return null;

  try {
    const handle = CHANNEL_HANDLE.replace('@', '');
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&maxResults=1&key=${YT_API_KEY}`
    );
    const json = await res.json();
    cachedChannelId = json.items?.[0]?.id?.channelId || null;
    return cachedChannelId;
  } catch {
    return null;
  }
}

/**
 * useYouTubeLive — polls YouTube every CHECK_INTERVAL_MS (default 5 min).
 *
 * No real-time subscription — just periodic REST checks.
 * Returns: { isLive, videoId, title, viewerCount, loading, error, apiAvailable, lastChecked }
 */
export function useYouTubeLive() {
  const [state, setState] = useState({
    isLive:       false,
    videoId:      null,
    title:        '',
    viewerCount:  null,
    loading:      true,
    error:        null,
    apiAvailable: false,
    lastChecked:  null,   // timestamp of last successful check
  });

  // Keep a ref so the interval callback always has the latest cancelled flag
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function check() {
      // No API key configured — show placeholder immediately, no retry
      if (!YT_API_KEY || YT_API_KEY === 'YOUR_YOUTUBE_DATA_API_KEY_HERE') {
        if (!cancelledRef.current) {
          setState((s) => ({
            ...s,
            loading:      false,
            error:        'YouTube API key not configured',
            apiAvailable: false,
          }));
        }
        return;
      }

      try {
        const channelId = await resolveChannelId();
        if (!channelId) throw new Error('Channel ID could not be resolved');

        // ── Step 1: Check for an active live broadcast ──
        const liveRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${channelId}&eventType=live&type=video&maxResults=1&key=${YT_API_KEY}`
        );
        const liveJson = await liveRes.json();

        if (liveJson.error) throw new Error(liveJson.error.message);

        if (liveJson.items?.length > 0) {
          const item     = liveJson.items[0];
          const videoId  = item.id.videoId;

          // Fetch concurrent viewer count
          const statsRes  = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${videoId}&key=${YT_API_KEY}`
          );
          const statsJson = await statsRes.json();
          const viewers   = statsJson.items?.[0]?.liveStreamingDetails?.concurrentViewers || null;

          if (!cancelledRef.current) {
            setState({
              isLive:       true,
              videoId,
              title:        item.snippet?.title || 'LIVE NOW',
              viewerCount:  viewers,
              loading:      false,
              error:        null,
              apiAvailable: true,
              lastChecked:  new Date(),
            });
          }
          return;
        }

        // ── Step 2: Fallback — fetch latest upload ──
        const latestRes  = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${YT_API_KEY}`
        );
        const latestJson = await latestRes.json();

        if (latestJson.error) throw new Error(latestJson.error.message);

        if (latestJson.items?.length > 0) {
          const item = latestJson.items[0];
          if (!cancelledRef.current) {
            setState({
              isLive:       false,
              videoId:      item.id.videoId,
              title:        item.snippet?.title || 'Latest Upload',
              viewerCount:  null,
              loading:      false,
              error:        null,
              apiAvailable: true,
              lastChecked:  new Date(),
            });
          }
        } else {
          throw new Error('No videos found on channel');
        }
      } catch (err) {
        if (!cancelledRef.current) {
          setState((s) => ({
            ...s,
            loading:      false,
            error:        err.message,
            apiAvailable: false,
            lastChecked:  new Date(),
          }));
        }
      }
    }

    // Run immediately on mount
    check();

    // Then re-check on a fixed interval (no real-time subscription)
    const intervalId = setInterval(check, CHECK_INTERVAL_MS);

    // Clean up: cancel any in-flight check and clear the interval
    return () => {
      cancelledRef.current = true;
      clearInterval(intervalId);
    };
  }, []); // runs once — the interval handles subsequent checks

  return state;
}
