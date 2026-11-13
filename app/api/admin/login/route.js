import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { comparePassword, createSessionToken, getSessionCookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = (body.username || '').trim();
    const password = body.password || '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        {
          error:
            'Database is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local',
        },
        { status: 503 }
      );
    }

    // Query admin user by username
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, username, password')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Verify bcrypt password
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Generate signed JWT session token (7 days)
    const token = await createSessionToken({
      id: admin.id,
      username: admin.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
      },
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (err) {
    console.error('[API /api/admin/login error]:', err);
    return NextResponse.json(
      { error: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}

