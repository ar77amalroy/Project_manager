const crypto = require('crypto');

// In-memory data store
let projects = [];

// Pre-seed with 5 sample projects
const seedProjects = () => {
  projects = [
    {
      id: crypto.randomUUID(),
      name: 'E-Commerce Platform Redesign',
      description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX, improved checkout flow, and mobile-first responsive design.',
      ownerId: 'user-alice-001',
      status: 'active',
      createdAt: new Date('2025-01-15T09:00:00Z').toISOString(),
      updatedAt: new Date('2025-03-20T14:30:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Internal HR Dashboard',
      description: 'Build an internal dashboard for HR team to manage employee records, track attendance, and generate monthly performance reports.',
      ownerId: 'user-bob-002',
      status: 'completed',
      createdAt: new Date('2024-11-01T08:00:00Z').toISOString(),
      updatedAt: new Date('2025-02-28T17:00:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Mobile Banking App',
      description: 'Develop a cross-platform mobile banking application with secure authentication, real-time transaction tracking, and bill payment features.',
      ownerId: 'user-charlie-003',
      status: 'active',
      createdAt: new Date('2025-02-10T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-04-15T11:45:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Legacy System Migration',
      description: 'Migrate legacy monolithic application to microservices architecture using containerized deployments and modern CI/CD pipelines.',
      ownerId: 'user-diana-004',
      status: 'inactive',
      createdAt: new Date('2024-08-20T07:30:00Z').toISOString(),
      updatedAt: new Date('2024-12-10T16:00:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'AI Chatbot Integration',
      description: 'Integrate an AI-powered chatbot into the customer support portal to handle common queries, escalate complex issues, and reduce response times.',
      ownerId: 'user-ethan-005',
      status: 'active',
      createdAt: new Date('2025-03-01T12:00:00Z').toISOString(),
      updatedAt: new Date('2025-05-10T09:15:00Z').toISOString(),
    },
  ];
};

// Initialize with seed data
seedProjects();

const getAll = () => [...projects];

const getById = (id) => projects.find((project) => project.id === id) || null;

const create = (projectData) => {
  const newProject = {
    id: crypto.randomUUID(),
    ...projectData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  return newProject;
};

const update = (id, updateData) => {
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updateData,
    id: projects[index].id,
    createdAt: projects[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  return projects[index];
};

const remove = (id) => {
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return null;

  const [deleted] = projects.splice(index, 1);
  return deleted;
};

// Reset store to seed data — used for test isolation
const resetStore = () => {
  seedProjects();
};

module.exports = { getAll, getById, create, update, remove, resetStore };
