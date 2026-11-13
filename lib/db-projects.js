import { supabaseAdmin, supabaseClient, isSupabaseConfigured } from './supabase.js';
import { projects as fallbackProjects } from './projects.js';

/**
 * Fetches projects from Supabase database with fallback to static projects
 * @param {{ limit?: number }} options
 * @returns {Promise<Array>}
 */
export async function getProjects({ limit } = {}) {
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseAdmin || supabaseClient;
      if (client) {
        let query = client
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (limit && Number.isInteger(limit) && limit > 0) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (!error && Array.isArray(data) && data.length > 0) {
          // Normalize to match component expectations
          return data.map((p) => ({
            id: p.id,
            slug: p.id,
            title: p.title,
            description: p.description,
            image: p.image,
            goal_amount: p.goal_amount,
            raised_amount: p.raised_amount,
            status: p.status === 'completed' ? 'Completed' : 'Ongoing',
            sort_order: p.sort_order,
            icon: 'fa-hand-holding-heart',
            highlights: [
              p.goal_amount > 0 ? `Target Goal: $${Number(p.goal_amount).toLocaleString()}` : 'Grassroots Community Support',
              p.status === 'completed' ? 'Project Completed' : 'Active & Ongoing',
              'GCO Foundation Pakistan',
            ],
          }));
        }
      }
    } catch (err) {
      console.warn('[getProjects] Could not fetch projects from DB, falling back to static list:', err.message);
    }
  }

  // Fallback to static projects
  if (limit && Number.isInteger(limit) && limit > 0) {
    return fallbackProjects.slice(0, limit);
  }
  return fallbackProjects;
}

