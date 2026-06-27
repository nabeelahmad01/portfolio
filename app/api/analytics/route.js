import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const { sessionId, path, referrer } = await request.json();
    
    if (!sessionId || !path) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get User-Agent and Vercel geo headers
    const userAgent = request.headers.get('user-agent') || '';
    const vercelCountry = request.headers.get('x-vercel-ip-country') || 'Unknown';
    
    // Parse device type from User-Agent
    let device = 'Desktop';
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      if (/iPad|tablet/i.test(userAgent)) {
        device = 'Tablet';
      } else {
        device = 'Mobile';
      }
    }

    // Log the visit in our custom JSON DB
    const logResult = db.logVisit({
      sessionId,
      path,
      referrer,
      country: vercelCountry === 'Unknown' ? 'Local' : vercelCountry,
      device
    });

    return NextResponse.json({ success: true, data: logResult });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
