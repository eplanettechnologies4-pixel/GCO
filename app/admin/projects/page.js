'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = Add, object = Edit

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'ongoing',
    goal_amount: '0',
    raised_amount: '0',
    sort_order: '0',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setFeedback({ type: 'error', message: 'Failed to load projects.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setForm({
      title: '',
      description: '',
      status: 'ongoing',
      goal_amount: '0',
      raised_amount: '0',
      sort_order: String(projects.length),
    });
    setSelectedFile(null);
    setImagePreview('');
    setFeedback({ type: '', message: '' });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title || '',
      description: project.description || '',
      status: project.status === 'completed' || project.status === 'Completed' ? 'completed' : 'ongoing',
      goal_amount: String(project.goal_amount ?? 0),
      raised_amount: String(project.raised_amount ?? 0),
      sort_order: String(project.sort_order ?? 0),
    });
    setSelectedFile(null);
    setImagePreview(project.image || '');
    setFeedback({ type: '', message: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingProject(null);
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert('Only JPG, JPEG, PNG, or WEBP image files are allowed.');
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!editingProject && !selectedFile) {
      alert('Please select an image file for the new project.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('status', form.status);
      formData.append('goal_amount', form.goal_amount);
      formData.append('raised_amount', form.raised_amount);
      formData.append('sort_order', form.sort_order);

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      let res;
      if (editingProject) {
        // Edit existing project
        res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Create new project
        res = await fetch('/api/projects', {
          method: 'POST',
          body: formData,
        });
      }

      const result = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: result.error || 'Operation failed.' });
        setSubmitting(false);
        return;
      }

      setFeedback({
        type: 'success',
        message: editingProject ? 'Project updated successfully.' : 'Project created successfully.',
      });
      closeModal();
      fetchProjects();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || 'Failed to delete project.');
        return;
      }
      setFeedback({ type: 'success', message: 'Project and image deleted successfully.' });
      setDeleteConfirmId(null);
      fetchProjects();
    } catch (err) {
      alert('Error deleting project.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-navy">
            Projects Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Create, update, and manage humanitarian projects displayed across the website.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add New Project</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`rounded-xl p-4 text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <i
              className={`fa-solid ${
                feedback.type === 'success' ? 'fa-circle-check text-emerald-500' : 'fa-triangle-exclamation text-rose-500'
              }`}
            ></i>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-xl mb-2 text-brand"></i>
            <div>Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <h3 className="font-display font-bold text-base text-navy">No Projects Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click &quot;Add New Project&quot; above to create your first project with image upload.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Image</th>
                  <th className="py-3.5 px-5">Project Title</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Goal / Raised</th>
                  <th className="py-3.5 px-5 text-center">Order</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id || project.slug} className="hover:bg-slate-50/80 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                            <i className="fa-solid fa-image"></i>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Description preview */}
                    <td className="py-3.5 px-5 max-w-md">
                      <div className="font-display font-bold text-navy text-sm">{project.title}</div>
                      <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          project.status === 'completed' || project.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.status === 'completed' || project.status === 'Completed'
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                        ></span>
                        {project.status === 'completed' || project.status === 'Completed'
                          ? 'Completed'
                          : 'Ongoing'}
                      </span>
                    </td>

                    {/* Goal & Raised */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-navy font-semibold">
                        Goal: ${Number(project.goal_amount || 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Raised: ${Number(project.raised_amount || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Sort Order */}
                    <td className="py-3.5 px-5 text-center font-mono text-xs text-slate-500">
                      {project.sort_order ?? 0}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
                        title="Edit Project"
                      >
                        <i className="fa-solid fa-pen-to-square text-brand"></i>
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(project.id)}
                        className="px-2.5 py-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
                        title="Delete Project"
                      >
                        <i className="fa-solid fa-trash-can text-rose-500"></i>
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm overflow-y-auto"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-folder-plus text-silver-light"></i>
                <h3 className="font-display font-bold text-base">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Orphanage Shelter Support"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description of the welfare project and beneficiaries..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                ></textarea>
              </div>

              {/* Image Upload with Preview */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Project Image {editingProject ? '(leave empty to keep current)' : '*'}
                </label>
                <div className="flex items-start gap-4">
                  {/* Preview Thumbnail */}
                  <div className="w-24 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-2">
                        <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                        <div className="text-[10px] mt-0.5">No Image</div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    <p className="text-[11px] text-slate-400">
                      JPG, PNG, or WEBP up to 5MB. Saved directly to Supabase Storage (<code className="bg-slate-100 px-1 py-0.5 rounded">uploads/projects/</code>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid: Status, Goal, Raised, Sort Order */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Goal ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.goal_amount}
                    onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raised ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.raised_amount}
                    onChange={(e) => setForm({ ...form, raised_amount: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-70 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            role="alertdialog"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl bg-white shadow-2xl border border-slate-200 p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <h3 className="font-display font-bold text-navy text-base">Delete this project?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This will permanently delete the project from the database and remove its uploaded image from Supabase storage.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

