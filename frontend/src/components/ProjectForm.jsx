'use client';

import { useState, useEffect } from 'react';

const INITIAL_FORM = {
  name: '',
  description: '',
  ownerId: '',
  status: 'active',
};

const ProjectForm = ({ project, onSubmit, onCancel, isLoading }) => {
  const isEditing = Boolean(project);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        ownerId: project.ownerId || '',
        status: project.status || 'active',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
    setApiError('');
  }, [project]);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length < 3) return 'Name must be at least 3 characters';
        if (value.trim().length > 100) return 'Name must be at most 100 characters';
        return '';
      case 'description':
        if (!value || value.trim().length < 10) return 'Description must be at least 10 characters';
        if (value.trim().length > 500) return 'Description must be at most 500 characters';
        return '';
      case 'ownerId':
        if (!value || value.trim().length === 0) return 'Owner ID is required';
        return '';
      case 'status':
        if (!['active', 'inactive', 'completed'].includes(value)) return 'Invalid status';
        return '';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    if (!validateAll()) return;
    try {
      await onSubmit(formData);
    } catch (error) {
      setApiError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onCancel}
            className="btn-icon"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close form"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter project name"
              className={`input-field ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="project-description" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Description
            </label>
            <textarea
              id="project-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe the project (at least 10 characters)"
              rows={4}
              className={`input-field resize-none ${errors.description ? 'error' : ''}`}
            />
            <div className="flex justify-between mt-1.5">
              {errors.description
                ? <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.description}</p>
                : <span />
              }
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formData.description.length}/500
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="project-owner" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Owner ID
            </label>
            <input
              id="project-owner"
              type="text"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. user-alice-001"
              className={`input-field ${errors.ownerId ? 'error' : ''}`}
            />
            {errors.ownerId && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.ownerId}</p>}
          </div>

          <div>
            <label htmlFor="project-status" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Status
            </label>
            <select
              id="project-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="spinner" />}
              {isLoading
                ? (isEditing ? 'Updating…' : 'Creating…')
                : (isEditing ? 'Update Project' : 'Create Project')
              }
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
