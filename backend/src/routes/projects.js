const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const {
  validateCreateProject,
  validateUpdateProject,
} = require('../middleware/validation');

router.post('/', validateCreateProject, createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', validateUpdateProject, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
