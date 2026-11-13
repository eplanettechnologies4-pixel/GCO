import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
    }

    // 1. Fetch message
    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !message) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    // 2. Automatically mark message as read upon opening
    if (!message.is_read) {
      await supabaseAdmin
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);
      message.is_read = true;
    }

    return NextResponse.json({ success: true, data: message });
  } catch (err) {
    console.error('[API /api/messages/[id] GET error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve message.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    if (typeof body.is_read !== 'boolean') {
      return NextResponse.json(
        { error: 'Field is_read must be a boolean (true or false).' },
        { status: 400 }
      );
    }

    const { data: updated, error } = await supabaseAdmin
      .from('messages')
      .update({ is_read: body.is_read })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: 'Failed to update message status.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('[API /api/messages/[id] PATCH error]:', err);
    return NextResponse.json({ error: 'Failed to update message.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
    }

    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: `Failed to delete message: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (err) {
    console.error('[API /api/messages/[id] DELETE error]:', err);
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}

