const request = require('supertest');
const app = require('../app');
const store = require('../store/inMemoryStore');

// Reset the store before each test to ensure isolation
beforeEach(() => {
  store.resetStore();
});

describe('POST /api/projects', () => {
  const validProject = {
    name: 'Test Project',
    description: 'A valid project description for testing purposes',
    ownerId: 'user-test-001',
    status: 'active',
  };

  it('creates a project with valid data → 201', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send(validProject)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(validProject.name);
    expect(response.body.description).toBe(validProject.description);
    expect(response.body.ownerId).toBe(validProject.ownerId);
    expect(response.body.status).toBe(validProject.status);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  it('returns 400 if name is missing', async () => {
    const { name, ...projectWithoutName } = validProject;
    const response = await request(app)
      .post('/api/projects')
      .send(projectWithoutName)
      .expect(400);

    expect(response.body.errors).toContain('name is required');
  });

  it('returns 400 if description is too short', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({ ...validProject, description: 'short' })
      .expect(400);

    expect(response.body.errors).toContain(
      'description must be at least 10 characters'
    );
  });

  it('returns 400 if status is invalid', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({ ...validProject, status: 'unknown' })
      .expect(400);

    expect(response.body.errors).toContain(
      'status must be one of: active, inactive, completed'
    );
  });

  it('returns 400 if ownerId is missing', async () => {
    const { ownerId, ...projectWithoutOwner } = validProject;
    const response = await request(app)
      .post('/api/projects')
      .send(projectWithoutOwner)
      .expect(400);

    expect(response.body.errors).toContain('ownerId is required');
  });
});

describe('GET /api/projects', () => {
  it('returns paginated list → 200', async () => {
    const response = await request(app)
      .get('/api/projects')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('totalPages');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('respects page and limit query params', async () => {
    const response = await request(app)
      .get('/api/projects?page=1&limit=2')
      .expect(200);

    expect(response.body.data.length).toBeLessThanOrEqual(2);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(2);
  });

  it('filters by status correctly', async () => {
    const response = await request(app)
      .get('/api/projects?status=active')
      .expect(200);

    response.body.data.forEach((project) => {
      expect(project.status).toBe('active');
    });
  });

  it('search works on name and description', async () => {
    const response = await request(app)
      .get('/api/projects?search=E-Commerce')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    const found = response.body.data.some(
      (project) =>
        project.name.toLowerCase().includes('e-commerce') ||
        project.description.toLowerCase().includes('e-commerce')
    );
    expect(found).toBe(true);
  });
});

describe('GET /api/projects/:id', () => {
  it('returns correct project → 200', async () => {
    // Get the first project's ID from the seeded data
    const listResponse = await request(app).get('/api/projects');
    const firstProject = listResponse.body.data[0];

    const response = await request(app)
      .get(`/api/projects/${firstProject.id}`)
      .expect(200);

    expect(response.body.id).toBe(firstProject.id);
    expect(response.body.name).toBe(firstProject.name);
  });

  it('returns 404 for non-existent id', async () => {
    const response = await request(app)
      .get('/api/projects/non-existent-id-12345')
      .expect(404);

    expect(response.body.error).toBe('Project not found');
  });
});

describe('PUT /api/projects/:id', () => {
  it('updates fields correctly → 200', async () => {
    const listResponse = await request(app).get('/api/projects');
    const projectToUpdate = listResponse.body.data[0];

    const response = await request(app)
      .put(`/api/projects/${projectToUpdate.id}`)
      .send({ name: 'Updated Project Name' })
      .expect(200);

    expect(response.body.name).toBe('Updated Project Name');
    expect(response.body.id).toBe(projectToUpdate.id);
  });

  it('partial update works (only provided fields change)', async () => {
    const listResponse = await request(app).get('/api/projects');
    const projectToUpdate = listResponse.body.data[0];
    const originalDescription = projectToUpdate.description;

    const response = await request(app)
      .put(`/api/projects/${projectToUpdate.id}`)
      .send({ name: 'Only Name Changed' })
      .expect(200);

    expect(response.body.name).toBe('Only Name Changed');
    expect(response.body.description).toBe(originalDescription);
  });

  it('returns 404 for non-existent id', async () => {
    const response = await request(app)
      .put('/api/projects/non-existent-id-12345')
      .send({ name: 'Does Not Matter' })
      .expect(404);

    expect(response.body.error).toBe('Project not found');
  });

  it('returns 400 on invalid status value', async () => {
    const listResponse = await request(app).get('/api/projects');
    const projectToUpdate = listResponse.body.data[0];

    const response = await request(app)
      .put(`/api/projects/${projectToUpdate.id}`)
      .send({ status: 'invalid-status' })
      .expect(400);

    expect(response.body.errors).toContain(
      'status must be one of: active, inactive, completed'
    );
  });
});

describe('DELETE /api/projects/:id', () => {
  it('deletes project → 200', async () => {
    const listResponse = await request(app).get('/api/projects');
    const projectToDelete = listResponse.body.data[0];

    const response = await request(app)
      .delete(`/api/projects/${projectToDelete.id}`)
      .expect(200);

    expect(response.body.message).toBe('Project deleted successfully');
  });

  it('returns 404 for non-existent id', async () => {
    const response = await request(app)
      .delete('/api/projects/non-existent-id-12345')
      .expect(404);

    expect(response.body.error).toBe('Project not found');
  });

  it('deleted project no longer returned in list', async () => {
    const listResponse = await request(app).get('/api/projects');
    const projectToDelete = listResponse.body.data[0];

    await request(app).delete(`/api/projects/${projectToDelete.id}`).expect(200);

    const updatedList = await request(app).get('/api/projects').expect(200);
    const found = updatedList.body.data.find(
      (project) => project.id === projectToDelete.id
    );
    expect(found).toBeUndefined();
  });
});
