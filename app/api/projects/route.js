import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin, isSupabaseConfigured, uploadProjectImage } from '@/lib/supabase';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { projects as fallbackProjects } from '@/lib/projects';

export async function GET() {
  try {
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        data: fallbackProjects,
        source: 'static_fallback',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[API /api/projects GET DB error]:', error.message);
      return NextResponse.json({
        success: true,
        data: fallbackProjects,
        source: 'static_fallback',
      });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      source: 'database',
    });
  } catch (err) {
    console.error('[API /api/projects GET error]:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve projects.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Verify admin authentication
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database is not configured. Please set Supabase keys in .env.local' },
        { status: 503 }
      );
    }

    // 2. Parse multipart form data
    const formData = await request.formData();
    const title = (formData.get('title') || '').toString().trim();
    const description = (formData.get('description') || '').toString().trim();
    const goal_amount = Number(formData.get('goal_amount')) || 0;
    const raised_amount = Number(formData.get('raised_amount')) || 0;
    const statusRaw = (formData.get('status') || 'ongoing').toString().toLowerCase();
    const status = statusRaw === 'completed' ? 'completed' : 'ongoing';
    const sort_order = parseInt(formData.get('sort_order'), 10) || 0;
    const imageFile = formData.get('image');

    // 3. Validation
    if (!title) {
      return NextResponse.json({ error: 'Project title is required.' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Project description is required.' }, { status: 400 });
    }
    if (!imageFile || typeof imageFile === 'string' || !imageFile.size) {
      return NextResponse.json({ error: 'A valid project image is required (max 5MB, JPG/PNG/WEBP).' }, { status: 400 });
    }

    // 4. Upload image to Supabase Storage bucket 'uploads' under 'projects/'
    let uploadResult;
    try {
      uploadResult = await uploadProjectImage(imageFile);
    } catch (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 400 });
    }

    // 5. Insert project into database
    const { data: newProject, error: dbError } = await supabaseAdmin
      .from('projects')
      .insert([
        {
          title,
          description,
          image: uploadResult.url,
          goal_amount,
          raised_amount,
          status,
          sort_order,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('[API /api/projects POST DB error]:', dbError);
      return NextResponse.json(
        { error: `Database insert failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 6. Instant cache revalidation for frontend
    try {
      revalidatePath('/');
      revalidatePath('/projects');
      revalidatePath('/admin/projects');
      revalidatePath('/admin/dashboard');
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully.',
        data: newProject,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API /api/projects POST error]:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while creating project.' },
      { status: 500 }
    );
  }
}

