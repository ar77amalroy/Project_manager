const store = require('../store/inMemoryStore');

const createProject = (req, res, next) => {
  try {
    const { name, description, ownerId, status } = req.body;
    const project = store.create({ name, description, ownerId, status });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

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
