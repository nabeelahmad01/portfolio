'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const currentPath = useRef('');

  useEffect(() => {
    // Avoid double tracking in React 18/19 strict mode
    if (currentPath.current === pathname) return;
    currentPath.current = pathname;

    // 1. Generate or fetch visitor ID (persistent)
    let visitorId = localStorage.getItem('nabil_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('nabil_visitor_id', visitorId);
    }

    // 2. Generate or fetch session ID (tab session)
    let sessionId = sessionStorage.getItem('nabil_session_id');
    if (!sessionId) {
      sessionId = 's_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('nabil_session_id', sessionId);
    }

    // 3. Send tracking payload
    const trackPageview = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            path: pathname,
            referrer: document.referrer || '',
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
          }),
          keepalive: true, // ensures request finishes even if page closes
        });
      } catch (err) {
        console.error('Analytics tracking failed:', err);
      }
    };

    trackPageview();
  }, [pathname]);

  return null;
}
