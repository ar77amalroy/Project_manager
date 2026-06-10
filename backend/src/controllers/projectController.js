/**
 * @fileoverview Controller layer for Project CRUD operations.
 *
 * Each function extracts data from the Express request, delegates to
 * the in-memory store, and sends a JSON response. Errors are forwarded
 * to the global error handler via `next()`.
 *
 * @module controllers/projectController
 */

const store = require('../store/inMemoryStore');

/**
 * Creates a new project from the request body and persists it in the store.
 *
 * Responds with HTTP 201 and the newly created project object, including
 * the server-generated `id`, `createdAt`, and `updatedAt` timestamps.
 *
 * @param {import('express').Request} req  - Express request; expects `name`, `description`, `ownerId`, and `status` in `req.body`.
 * @param {import('express').Response} res - Express response; sends the created project as JSON.
 * @param {import('express').NextFunction} next - Express next middleware; called on error.
 * @returns {void}
 */
const createProject = (req, res, next) => {
  try {
    const { name, description, ownerId, status } = req.body;
    const project = store.create({ name, description, ownerId, status });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a paginated, optionally filtered and searchable list of projects.
 *
 * Supports the following query parameters:
 * - `page`   (number, default 1)  — page number (clamped to >= 1).
 * - `limit`  (number, default 10) — items per page (clamped to 1–50).
 * - `status` (string, optional)   — filter by project status (`active` | `inactive` | `completed`).
 * - `search` (string, optional)   — case-insensitive substring match against `name` and `description`.
 *
 * Responds with HTTP 200 and a JSON object:
 * `{ data: Project[], total: number, page: number, limit: number, totalPages: number }`.
 *
 * @param {import('express').Request} req  - Express request with optional query parameters.
 * @param {import('express').Response} res - Express response; sends paginated result as JSON.
 * @param {import('express').NextFunction} next - Express next middleware; called on error.
 * @returns {void}
 */
const getAllProjects = (req, res, next) => {
  try {
    let { page, limit, status, search } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    // Enforce bounds
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 50) limit = 50;

    let filteredProjects = store.getAll();

    // Filter by status if provided
    if (status) {
      filteredProjects = filteredProjects.filter(
        (project) => project.status === status
      );
    }

    // Search in name and description if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredProjects.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + limit);

    res.status(200).json({
      data: paginatedProjects,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single project by its unique identifier.
 *
 * Responds with HTTP 200 and the project object if found, or HTTP 404
 * with an error message if no project matches the given ID.
 *
 * @param {import('express').Request} req  - Express request; expects `id` in `req.params`.
 * @param {import('express').Response} res - Express response; sends the project or a 404 error.
 * @param {import('express').NextFunction} next - Express next middleware; called on error.
 * @returns {void}
 */
const getProjectById = (req, res, next) => {
  try {
    const { id } = req.params;
    const project = store.getById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing project with the provided fields.
 *
 * Only the fields present in the request body are updated (partial update).
 * The `id` and `createdAt` fields are immutable and preserved automatically.
 * `updatedAt` is refreshed on every successful update.
 *
 * Responds with HTTP 200 and the updated project, or HTTP 404 if not found.
 *
 * @param {import('express').Request} req  - Express request; expects `id` in `req.params` and optional `name`, `description`, `ownerId`, `status` in `req.body`.
 * @param {import('express').Response} res - Express response; sends the updated project or a 404 error.
 * @param {import('express').NextFunction} next - Express next middleware; called on error.
 * @returns {void}
 */
const updateProject = (req, res, next) => {
  try {
    const { id } = req.params;
    const existingProject = store.getById(id);

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { name, description, ownerId, status } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (ownerId !== undefined) updateData.ownerId = ownerId;
    if (status !== undefined) updateData.status = status;

    const updatedProject = store.update(id, updateData);
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

/**
 * Permanently deletes a project by its unique identifier.
 *
 * Responds with HTTP 200 and a success message if the project was deleted,
 * or HTTP 404 if no project matches the given ID.
 *
 * @param {import('express').Request} req  - Express request; expects `id` in `req.params`.
 * @param {import('express').Response} res - Express response; sends a success message or a 404 error.
 * @param {import('express').NextFunction} next - Express next middleware; called on error.
 * @returns {void}
 */
const deleteProject = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = store.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
