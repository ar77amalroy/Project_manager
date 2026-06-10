'use client';

import { useState, useEffect, useCallback } from 'react';
import ProjectList from '@/components/ProjectList';
import ProjectForm from '@/components/ProjectForm';
import Pagination from '@/components/Pagination';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/api';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'completed', label: 'Completed' },
];

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (searchQuery) filters.search = searchQuery;
      const result = await getProjects(currentPage, ITEMS_PER_PAGE, filters);
      setProjects(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreateClick = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteClick = (project) => {
    setDeleteTarget(project);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }
      setShowForm(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (submitError) {
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      if (projects.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchProjects();
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete project');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <header className="animate-fade-in" style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.6)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                Project Manager
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {totalCount} project{totalCount !== 1 ? 's' : ''} total
              </p>
            </div>
            <button
              id="create-project-btn"
              onClick={handleCreateClick}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5" style={{ animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search projects by name or description…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="input-field pl-11"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium mr-1" style={{ color: 'var(--text-muted)' }}>Filter:</span>
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                id={`filter-${option.value || 'all'}`}
                onClick={() => { setStatusFilter(option.value); setCurrentPage(1); }}
                className="transition-all duration-200"
                style={{
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === option.value
                    ? option.value === 'active' ? '1px solid rgba(5, 150, 105, 0.3)'
                      : option.value === 'inactive' ? '1px solid rgba(100, 116, 139, 0.3)'
                      : option.value === 'completed' ? '1px solid rgba(37, 99, 235, 0.3)'
                      : '1px solid rgba(8, 145, 178, 0.3)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  background: statusFilter === option.value
                    ? option.value === 'active' ? 'var(--accent-green-bg)'
                      : option.value === 'inactive' ? 'var(--accent-gray-bg)'
                      : option.value === 'completed' ? 'var(--accent-blue-bg)'
                      : 'rgba(8, 145, 178, 0.1)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: statusFilter === option.value
                    ? option.value === 'active' ? 'var(--accent-green)'
                      : option.value === 'inactive' ? 'var(--accent-gray)'
                      : option.value === 'completed' ? 'var(--accent-blue)'
                      : 'var(--primary)'
                    : 'var(--text-muted)',
                }}
              >
                {option.value && (
                  <span style={{ marginRight: '4px', fontSize: '8px' }}>
                    {option.value === 'active' ? '●' : option.value === 'inactive' ? '○' : '✓'}
                  </span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" style={{ animation: 'fadeIn 0.6s ease-out 0.2s both' }}>
        {error && (
          <div className="mb-5 p-4 rounded-xl flex items-center gap-3 animate-fade-in"
            style={{ background: 'var(--danger-bg)', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--danger)', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
            <button
              onClick={() => setError('')}
              className="btn-icon ml-auto"
              style={{ color: 'var(--danger)' }}
              aria-label="Dismiss error"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <ProjectList
          projects={projects}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isLoading={isLoading}
        />

        {!isLoading && projects.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isSubmitting}
        />
      )}

      {deleteTarget && (
        <div className="confirm-overlay" onClick={handleDeleteCancel}>
          <div className="confirm-box" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--danger-bg)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--danger)' }}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Delete Project</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--foreground)' }}>{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                id="cancel-delete-btn"
                onClick={handleDeleteCancel}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="btn-danger flex items-center gap-2 text-sm"
              >
                {isDeleting && <span className="spinner" style={{ borderTopColor: 'var(--danger)' }} />}
                {isDeleting ? 'Deleting…' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
