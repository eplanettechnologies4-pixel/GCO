import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin session required' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.username.includes('@') ? admin.username : `${admin.username}@gcofoundation.org`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}

