import { useState, useEffect } from 'react';

/**
 * useTournamentCountdown
 * Intelligent hook to switch between "Registration Opens In" and "Registration Closes In".
 */
export function useTournamentCountdown(openDate, deadlineDate) {
  const [data, setData] = useState({
    phase: 'loading', // loading, opening, closing, closed
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
    totalSeconds: 0
  });

  useEffect(() => {
    if (!openDate && !deadlineDate) {
      setData(prev => ({ ...prev, phase: 'closed' }));
      return;
    }

    function tick() {
      const now = new Date();
      const open = openDate ? new Date(openDate) : null;
      const deadline = deadlineDate ? new Date(deadlineDate) : null;

      let target = null;
      let phase = 'closed';

      if (open && now < open) {
        target = open;
        phase = 'opening';
      } else if (deadline && now < deadline) {
        target = deadline;
        phase = 'closing';
      } else {
        setData({ phase: 'closed', days: 0, hours: 0, mins: 0, secs: 0, totalSeconds: 0 });
        return;
      }

      const diff = target - now;
      if (diff <= 0) {
        // Recalculate on next tick to switch phase
        return;
      }

      setData({
        phase,
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
        totalSeconds: Math.floor(diff / 1000)
      });
    }

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [openDate, deadlineDate]);

  return data;
}
