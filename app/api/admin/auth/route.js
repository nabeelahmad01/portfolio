import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set secure HttpOnly cookie for session tracking
      response.cookies.set('nabil_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json({ error: 'Incorrect credentials' }, { status: 401 });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  const cookie = request.cookies.get('nabil_admin_session');
  
  if (cookie && cookie.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  // Clear cookie upon logout
  response.cookies.set('nabil_admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
