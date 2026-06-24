# Techstack Requirement

# HR-CRM Platform Technology Stack

## Frontend

### Framework
- React.js

### Build Tool
- Vite

### Language
- JavaScript (or TypeScript)

### Styling
- Tailwind CSS

### UI Components
- shadcn/ui

### Icons
- Lucide React

### State Management
- Zustand

### API Communication
- Axios

### Form Handling
- React Hook Form

### Validation
- Zod

---

## Backend

### Runtime
- Node.js

### Framework
- Express.js

Responsibilities:

- Authentication
- CRUD Operations
- Role Management
- Candidate Tracking
- Reporting APIs

---

## Database

### Primary Database
- PostgreSQL

Reason:

- Relational structure fits CRM systems
- Strong reporting capabilities
- Excellent scalability

---

## ORM

### Prisma ORM

Used For:

- Database migrations
- Query management
- Relationship handling

---

## Authentication

### JWT Authentication

Roles:

- Admin
- Employee
- Candidate

Features:

- Login
- Logout
- Password Reset
- Role-Based Access Control (RBAC)

---

## File Storage

### Cloudinary

Stores:

- Resumes
- Certificates
- Candidate Documents

Alternative:

- AWS S3

---

## Email Service

### Resend

Used For:

- Candidate notifications
- Password resets
- Interview invitations

Alternative:

- SendGrid

---

## Search System

### Phase 1

PostgreSQL Full Text Search

Filters:

- Skills
- Experience
- Location
- Education
- Notice Period

### Phase 2

ElasticSearch

---

## Hosting

### Frontend

- Vercel

### Backend

- Render
- Railway

### Database

- Supabase PostgreSQL

### File Storage

- Cloudinary

---

## Monitoring

- Sentry
- LogRocket

---

## Security

- bcrypt Password Hashing
- JWT Refresh Tokens
- HTTPS
- API Rate Limiting

---

## Recommended Folder Structure

src/
├── assets/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
├── store/
├── utils/
├── routes/
├── context/
└── App.jsx

---

## Why This Stack

The HR-CRM platform requires:

- Role-based dashboards
- Large candidate databases
- Resume and document management
- Advanced search and filtering
- Reporting and analytics
- Scalable recruitment workflows

React + Vite + Express + PostgreSQL + Prisma + Cloudinary provides a modern, scalable, and production-ready foundation for the platform.
