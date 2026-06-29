import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const expectedPasscode = process.env.VIEWER_PASSCODE || 'TTCTech2026!';

    if (passcode === expectedPasscode) {
      const response = NextResponse.json({ success: true });
      // Set httpOnly cookie for session persistence
      response.cookies.set('cadence_viewer_auth', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid passcode' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Check auth status
  const cookieHeader = request.headers.get('cookie') || '';
  const isAuthenticated = cookieHeader.includes('cadence_viewer_auth=authenticated');
  return NextResponse.json({ authenticated: isAuthenticated });
}
