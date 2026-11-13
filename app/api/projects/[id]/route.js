import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin, isSupabaseConfigured, uploadProjectImage, deleteProjectImage } from '@/lib/supabase';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error('[API /api/projects/[id] GET error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve project.' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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
      return NextResponse.json(
        { error: 'Database is not configured. Please set Supabase keys in .env.local' },
        { status: 503 }
      );
    }

    // 1. Fetch current project to get existing image URL
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // 2. Parse request body (supports either multipart/form-data or application/json)
    const contentType = request.headers.get('content-type') || '';
    let title = existingProject.title;
    let description = existingProject.description;
    let goal_amount = existingProject.goal_amount;
    let raised_amount = existingProject.raised_amount;
    let status = existingProject.status;
    let sort_order = existingProject.sort_order;
    let newImageUrl = existingProject.image;
    let uploadedNewImage = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      if (formData.has('title')) title = (formData.get('title') || '').toString().trim();
      if (formData.has('description')) description = (formData.get('description') || '').toString().trim();
      if (formData.has('goal_amount')) goal_amount = Number(formData.get('goal_amount')) || 0;
      if (formData.has('raised_amount')) raised_amount = Number(formData.get('raised_amount')) || 0;
      if (formData.has('status')) {
        const rawStatus = (formData.get('status') || '').toString().toLowerCase();
        status = rawStatus === 'completed' ? 'completed' : 'ongoing';
      }
      if (formData.has('sort_order')) sort_order = parseInt(formData.get('sort_order'), 10) || 0;

      const imageFile = formData.get('image');
      if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
        try {
          const uploadResult = await uploadProjectImage(imageFile);
          newImageUrl = uploadResult.url;
          uploadedNewImage = true;
        } catch (uploadErr) {
          return NextResponse.json({ error: uploadErr.message }, { status: 400 });
        }
      }
    } else {
      const body = await request.json().catch(() => ({}));
      if (body.title !== undefined) title = (body.title || '').toString().trim();
      if (body.description !== undefined) description = (body.description || '').toString().trim();
      if (body.goal_amount !== undefined) goal_amount = Number(body.goal_amount) || 0;
      if (body.raised_amount !== undefined) raised_amount = Number(body.raised_amount) || 0;
      if (body.status !== undefined) {
        status = (body.status || '').toString().toLowerCase() === 'completed' ? 'completed' : 'ongoing';
      }
      if (body.sort_order !== undefined) sort_order = parseInt(body.sort_order, 10) || 0;
    }

    if (!title) {
      return NextResponse.json({ error: 'Title cannot be empty.' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Description cannot be empty.' }, { status: 400 });
    }

    // 3. Update in database
    const { data: updatedProject, error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        title,
        description,
        image: newImageUrl,
        goal_amount,
        raised_amount,
        status,
        sort_order,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[API /api/projects/[id] PUT update error]:', updateError);
      return NextResponse.json({ error: `Update failed: ${updateError.message}` }, { status: 500 });
    }

    // 4. Delete old image from storage if replaced with a new one
    if (uploadedNewImage && existingProject.image && existingProject.image !== newImageUrl) {
      await deleteProjectImage(existingProject.image);
    }

    // 5. Revalidate cache
    try {
      revalidatePath('/');
      revalidatePath('/projects');
      revalidatePath('/admin/projects');
      revalidatePath('/admin/dashboard');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully.',
      data: updatedProject,
    });
  } catch (err) {
    console.error('[API /api/projects/[id] PUT error]:', err);
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
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
      return NextResponse.json(
        { error: 'Database is not configured.' },
        { status: 503 }
      );
    }

    // 1. Fetch project to get image URL for deletion
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, image')
      .eq('id', id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // 2. Delete project from database
    const { error: deleteError } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: `Failed to delete project: ${deleteError.message}` }, { status: 500 });
    }

    // 3. Delete image from Supabase storage
    if (project.image) {
      await deleteProjectImage(project.image);
    }

    // 4. Revalidate cache
    try {
      revalidatePath('/');
      revalidatePath('/projects');
      revalidatePath('/admin/projects');
      revalidatePath('/admin/dashboard');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Project and associated image deleted successfully.',
    });
  } catch (err) {
    console.error('[API /api/projects/[id] DELETE error]:', err);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}

