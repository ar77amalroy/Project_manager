# Project Management API

## Overview

A full-stack project management CRUD application with an **Express.js** REST API backend and a **Next.js 14** frontend. Manage projects with real-time search, status filtering, pagination, and a premium dark-mode UI. All data is stored in-memory with 5 pre-seeded sample projects.

## Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Middleware:** cors, dotenv
- **Testing:** Jest + Supertest
- **Data Store:** In-memory JavaScript array

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React useState/useEffect
- **HTTP Client:** Fetch API

## Project Structure

```
Root/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── projects.js
│   │   ├── controllers/
│   │   │   └── projectController.js
│   │   ├── middleware/
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── store/
│   │   │   └── inMemoryStore.js
│   │   ├── tests/
│   │   │   └── projects.test.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── globals.css
│   │   │   └── page.js
│   │   ├── components/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── Pagination.jsx
│   │   └── lib/
│   │       └── api.js
│   ├── package.json
│   ├── .env.local.example
│   └── .env.local
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The API server starts at `http://localhost:5000`.

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
The frontend starts at `http://localhost:3000`.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

---

### Create a Project

**`POST /api/projects`**

**Request Body:**
```json
{
  "name": "string (required, 3–100 chars)",
  "description": "string (required, 10–500 chars)",
  "ownerId": "string (required, non-empty)",
  "status": "string (required, one of: active | inactive | completed)"
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "New Project",
  "description": "A detailed project description here",
  "ownerId": "user-alice-001",
  "status": "active",
  "createdAt": "2025-06-10T08:00:00.000Z",
  "updatedAt": "2025-06-10T08:00:00.000Z"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "errors": [
    "name must be at least 3 characters",
    "status must be one of: active, inactive, completed"
  ]
}
```

---

### Get All Projects (Paginated)

**`GET /api/projects`**

**Query Parameters:**
| Param    | Type   | Default | Description                          |
|----------|--------|---------|--------------------------------------|
| `page`   | number | 1       | Page number                          |
| `limit`  | number | 10      | Items per page (max 50)              |
| `status` | string | —       | Filter by status (active/inactive/completed) |
| `search` | string | —       | Search in name and description       |

**Example:** `GET /api/projects?page=1&limit=5&status=active&search=banking`

**Response:** `200 OK`
```json
{
  "data": [ /* array of project objects */ ],
  "total": 3,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

---

### Get Project by ID

**`GET /api/projects/:id`**

**Response:** `200 OK` — returns the project object

**Error Response:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

---

### Update a Project

**`PUT /api/projects/:id`**

Accepts partial updates — only provided fields are updated.

**Request Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "status": "completed"
}
```

**Response:** `200 OK` — returns the updated project object

**Error Responses:**
- `404 Not Found` if project doesn't exist
- `400 Bad Request` if validation fails

---

### Delete a Project

**`DELETE /api/projects/:id`**

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

## Running Tests

```bash
cd backend
npm test
```

Runs 18 test cases covering:
- POST: create valid project, missing name, short description, invalid status, missing ownerId
- GET (list): pagination, page/limit params, status filter, search
- GET (by ID): found, not found
- PUT: update fields, partial update, not found, invalid status
- DELETE: success, not found, verify removal from list

## Sample Data

The following 5 projects are pre-seeded on server startup:

| #  | Name                          | Owner             | Status    |
|----|-------------------------------|--------------------|-----------|
| 1  | E-Commerce Platform Redesign  | user-alice-001     | active    |
| 2  | Internal HR Dashboard         | user-bob-002       | completed |
| 3  | Mobile Banking App            | user-charlie-003   | active    |
| 4  | Legacy System Migration       | user-diana-004     | inactive  |
| 5  | AI Chatbot Integration        | user-ethan-005     | active    |

### Full Sample Objects

```json
[
  {
    "name": "E-Commerce Platform Redesign",
    "description": "Complete overhaul of the existing e-commerce platform with modern UI/UX, improved checkout flow, and mobile-first responsive design.",
    "ownerId": "user-alice-001",
    "status": "active"
  },
  {
    "name": "Internal HR Dashboard",
    "description": "Build an internal dashboard for HR team to manage employee records, track attendance, and generate monthly performance reports.",
    "ownerId": "user-bob-002",
    "status": "completed"
  },
  {
    "name": "Mobile Banking App",
    "description": "Develop a cross-platform mobile banking application with secure authentication, real-time transaction tracking, and bill payment features.",
    "ownerId": "user-charlie-003",
    "status": "active"
  },
  {
    "name": "Legacy System Migration",
    "description": "Migrate legacy monolithic application to microservices architecture using containerized deployments and modern CI/CD pipelines.",
    "ownerId": "user-diana-004",
    "status": "inactive"
  },
  {
    "name": "AI Chatbot Integration",
    "description": "Integrate an AI-powered chatbot into the customer support portal to handle common queries, escalate complex issues, and reduce response times.",
    "ownerId": "user-ethan-005",
    "status": "active"
  }
]
```
