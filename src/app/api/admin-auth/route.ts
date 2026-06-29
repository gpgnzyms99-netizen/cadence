import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const expectedPasscode = process.env.AUTHOR_PASSCODE || 'CadenceAdmin2026!';

    if (passcode === expectedPasscode) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('cadence_author_auth', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid author password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const isAuthenticated = cookieHeader.includes('cadence_author_auth=authenticated');
  return NextResponse.json({ authenticated: isAuthenticated });
}
