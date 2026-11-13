import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Database not connected yet.',
      });
    }

    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API /api/messages GET error]:', error);
      return NextResponse.json(
        { error: `Failed to fetch messages: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: messages || [],
    });
  } catch (err) {
    console.error('[API /api/messages GET error]:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve messages.' },
      { status: 500 }
    );
  }
}

