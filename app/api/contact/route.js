import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // Validation
    const errors = [];
    if (!name || name.length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      errors.push('A valid email address is required.');
    }
    if (!subject || subject.length < 2) {
      errors.push('Subject is required (minimum 2 characters).');
    }
    if (!message || message.length < 5) {
      errors.push('Message is required (minimum 5 characters).');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(' ') },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        {
          error:
            'Database is currently not connected. Please ensure Supabase credentials are configured in .env.local',
        },
        { status: 503 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
          is_read: false,
        },
      ])
      .select('id, name, email, subject, created_at')
      .single();

    if (error) {
      console.error('[API /api/contact DB insert error]:', error);
      return NextResponse.json(
        { error: `Failed to save message: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received! Our team will get back to you shortly.',
        data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API /api/contact error]:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending your message.' },
      { status: 500 }
    );
  }
}

