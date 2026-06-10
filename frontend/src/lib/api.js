const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.errors?.join(', ') ||
      errorData.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const getProjects = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`${API_URL}/projects?${params.toString()}`);
  return handleResponse(response);
};

export const getProjectById = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}`);
  return handleResponse(response);
};

export const createProject = async (data) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateProject = async (id, data) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteProject = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};
