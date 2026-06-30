# HR-CRM Platform Technical Stack Documentation

This document provides a comprehensive analysis of the technical stack, system architecture, database design, and deployment workflows for the HR-CRM recruitment and workforce management platform.

---

## 1. Project Overview

The HR-CRM platform is a web-based portal designed for recruitment agencies to manage employee recruiters, external clients, candidate profiles, and placement pipelines. 

*   **Problem Solved:** Centralizes candidate tracking, client assignments, recruiter logs, and announcement broadcasts, replacing fragmented tools like spreadsheets and email threads.
*   **Target Users:** 
    *   **Admins:** Agency owners/managers who control system settings, add/edit recruiters, register clients, assign recruiters to accounts, and view performance reports.
    *   **Employees (Recruiters):** Recruiting staff who source candidates, track communication, change placement statuses, log daily activities, and view client requirements.
*   **Key Workflows:**
    1.  Admin registers Clients and assigns them to Employees.
    2.  Employees create and update Candidates, adding contact information, skills, resumes, and photos.
    3.  Employees "select" candidates (locking them to prevent double-sourcing by other recruiters) and guide them through the pipeline.
    4.  Employees log daily work reports.
    5.  Admins monitor recruiter activity logs, broadcast notices, and analyze placement reports.

---

## 2. Complete Technology Stack

| Layer | Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | `^18.x` | Industry-standard declarative component-driven framework for responsive dashboards. |
| **Build Tool** | Vite | `^8.0.12` | Next-generation frontend build system, enabling extremely fast Hot Module Replacement (HMR) and optimized rollup production bundles. |
| **Styling** | Tailwind CSS | `^3.4.19` | Utility-first CSS framework combined with custom Material Design-inspired style tokens in [index.css](file:///Users/Bhavya/Desktop/internship/react/HRCRM%20/frontend/src/index.css) to build a polished, high-performance interface. |
| **Icons** | Lucide React / Google Material Symbols | `^1.17.0` | Combines lightweight vector icons (Lucide) with scalable font glyphs (Material Symbols) for clear, modern iconography. |
| **State Management** | Zustand | `^5.0.14` | Light, boilerplate-free state manager. Used with `persist` middleware to save session state (JWT token and user info) in `localStorage`. |
| **API Client** | Axios | `^1.17.0` | Custom instance [api.js](file:///Users/Bhavya/Desktop/internship/react/HRCRM%20/frontend/src/services/api.js) handles Base URL resolving, appends the JWT bearer token automatically on request, and intercepts `401 Unauthorized` responses to handle automated logouts. |
| **Form Handling** | React Hook Form & Zod | `^7.78.0` / `^4.4.3` | Used for validation and state handling in the unified login portal. |
| **Backend Runtime** | Node.js | `^20.x` | Scalable JavaScript runtime for low-latency network APIs. |
| **Web Framework** | Express.js | `^5.2.1` | Lightweight routing framework to handle HTTP API endpoints, CORS handling, cookie parsing, and static file serving. |
| **Database** | PostgreSQL | — | Relational database hosted on **Supabase** that ensures ACID compliance, relational consistency (essential for clients/employees/candidates), and robust text-based query capabilities. |
| **ORM** | Prisma ORM | `^7.8.0` | Generates type-safe database clients, handles declarative migrations, and implements the modern `@prisma/adapter-pg` driver. |
| **File Storage** | Multer (Local Disk) | `^2.1.1` | Multer uploads resumes (PDF/DOC/DOCX) and profile images to local server disk (`/uploads`) and serves them statically. |
| **Realtime Sync** | Supabase JavaScript Client | `^2.108.2` | Listens to Postgres changes via WebSocket connection. Triggers instant frontend updates when database rows are added, updated, or deleted. |

---

## 3. Folder Structure

The project is structured as a monorepo split into standard `frontend` and `backend` layers:

```text
HRCRM/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema models and relationships
│   ├── src/
│   │   ├── controllers/          # Business logic handlers for REST endpoints
│   │   ├── middleware/           # JWT verification and Multer file upload filters
│   │   ├── routes/               # Express router maps for controllers
│   │   ├── utils/                # Prisma client initialization and JWT utilities
│   │   └── app.js                # Express app setup and middleware configuration
│   │   └── index.js              # Server bootstrapper
│   ├── uploads/                  # Local folder storing uploaded resumes & photos (gitignored)
│   ├── package.json              # Backend script commands & dependencies
│   ├── seed-dev.js               # Dev database seeder (Creates Admin + Recruiter accounts)
│   └── seedAdmin.js              # Admin production database seeder
├── frontend/
│   ├── public/                   # Static favicon and asset files
│   ├── src/
│   │   ├── assets/               # Image/illustration background files
│   │   ├── components/
│   │   │   └── layout/           # Global Sidebar & Header layouts
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx # Role-based dashboard guard & layout wrapper
│   │   ├── pages/
│   │   │   ├── admin/            # Admin pages (Dashboard, Clients, Employees, Reports, Settings)
│   │   │   ├── employee/         # Employee pages (Dashboard, Clients, Activities, Settings)
│   │   │   ├── public/           # UnifiedLogin portal
│   │   │   └── shared/           # Candidates database (shared by Admin/Employee)
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # Navigation routes defining role requirements
│   │   ├── services/
│   │   │   ├── api.js            # Axios request/response interceptor service
│   │   │   └── supabase.js       # Supabase Realtime WebSocket client
│   │   ├── store/
│   │   │   └── authStore.js      # Zustand persisted authentication state
│   │   ├── index.css             # Main styling, custom layers, and scrollbars
│   │   └── main.jsx              # Vite entry point
│   ├── tailwind.config.js        # Design tokens mapping custom themes & colors
│   └── package.json              # Frontend script commands & package config
└── render.yaml                   # Infrastructure-as-Code for Render cloud deployment
```

---

## 4. Architecture Diagram

The diagram below maps the interaction between frontend views, Zustand state management, the Express API controllers, and the Supabase Postgres instance.

```mermaid
graph TD
    %% Frontend Components
    subgraph Frontend [React Frontend - Vite]
        UI[User Interface / Dashboards]
        ZS[Zustand authStore]
        AX[Axios api.js Instance]
        SU[Supabase Client]
    end

    %% Backend Server
    subgraph Backend [Express API Server]
        MW[Auth & Upload Middlewares]
        CO[Controllers]
        PR[Prisma ORM Client]
        FS[Uploads Directory]
    end

    %% Database / Cloud
    subgraph SupabaseDB [Supabase Cloud]
        DB[(PostgreSQL Database)]
        RT[Postgres Replication Engine]
    end

    %% Interactions
    UI -->|Uses| ZS
    UI -->|Subscribes to Realtime| SU
    UI -->|Dispatches Requests| AX
    AX -->|Bearer JWT Header| MW
    MW -->|Routes Requests| CO
    CO -->|Reads/Writes Files| FS
    CO -->|Query Commands| PR
    PR -->|Postgres Connection| DB
    DB -->|CDC Notifications| RT
    RT -->|WebSocket Stream| SU
    SU -->|Triggers UI Reload| UI
```

---

## 5. Database Architecture

The Postgres database structure is managed through Prisma and contains 7 main tables. Models use relational links with Cascading/SetNull rules.

```mermaid
erDiagram
    Admin {
        string id PK
        string name
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    
    Employee {
        string id PK
        string name
        string email UK
        string password
        string phone
        string address
        datetime createdAt
        datetime updatedAt
    }

    Client {
        string id PK
        string name
        string industry
        string contactName
        string email
        string phone
        string companyType
        string website
        string companyAddress
        string state
        string city
        string recruitmentPositionRequired
        string employeeId FK
        datetime createdAt
        datetime updatedAt
    }

    Candidate {
        string id PK
        string name
        string email UK
        string phone
        string skills
        string experience
        string jobTitle
        string noticePeriod
        string linkedin
        string portfolio
        string education
        string location
        string resumeUrl
        string photoUrl
        string status
        datetime joiningDate
        string selectedById FK
        datetime createdAt
        datetime updatedAt
    }

    CandidateDocument {
        string id PK
        string name
        string fileUrl
        string documentType
        string candidateId FK
        datetime uploadedAt
    }

    ActivityLog {
        string id PK
        string action
        string details
        string employeeId FK
        string candidateId FK
        string clientId FK
        datetime createdAt
    }

    Notice {
        string id PK
        string title
        string content
        string adminId FK
        datetime createdAt
    }

    Admin ||--o{ Notice : "publishes"
    Employee ||--o{ Client : "is assigned to"
    Employee ||--o{ Candidate : "selects/locks"
    Employee ||--o{ ActivityLog : "performs"
    Candidate ||--o{ CandidateDocument : "owns"
    Candidate ||--o{ ActivityLog : "relates to"
    Client ||--o{ ActivityLog : "relates to"
```

### Table Relationships Details
*   **Employee &rarr; Client:** One-to-many relationship (an employee handles multiple clients; a client is assigned to at most one employee).
*   **Employee &rarr; Candidate:** One-to-many relationship (`EmployeeSelectedCandidates`). An employee can "select" and lock multiple candidates. If an employee is deleted, the candidate's `selectedById` is set to `NULL` via `onDelete: SetNull`.
*   **Candidate &rarr; CandidateDocument:** One-to-many cascade relationship (`onDelete: Cascade`). Deleting a candidate automatically purges all documents.
*   **ActivityLog Links:** Automatically connects to the responsible `Employee`. Optionally links to a `Candidate` or `Client` for full context.

---

## 6. Authentication Flow

The system implements stateless JSON Web Token (JWT) authentication:

```mermaid
sequenceDiagram
    autonumber
    actor User as Admin / Employee
    participant UI as React Frontend
    participant AS as Zustand authStore
    participant API as Express API auth.controller
    participant DB as PostgreSQL Database

    User->>UI: Enter email & password (select role)
    UI->>API: POST /api/auth/{role}/login
    API->>DB: Query Admin / Employee by email
    DB-->>API: Return account details & hashed password
    API->>API: Verify password via bcryptjs
    alt Invalid Credentials
        API-->>UI: Return 401 Unauthorized
        UI-->>User: Show "Invalid email or password" error
    else Successful Verification
        API-->>UI: Return 200 (ID, name, email, role, token)
        UI->>AS: Call setAuth() (Save in localStorage)
        UI->>UI: Redirect to /{role}/dashboard
    end
```

*   **Protected Pages Routing:** The frontend [AppRoutes.jsx](file:///Users/Bhavya/Desktop/internship/react/HRCRM%20/frontend/src/routes/AppRoutes.jsx) wraps dashboard paths in a `DashboardLayout` component. It checks the Zustand `isAuthenticated` status and compares the current user's role against the `requiredRole`. If unauthorized, they are immediately redirected to `/`.
*   **API Protection:** All non-public backend routes are passed through the `protect` middleware which verifies the JWT token present in the `Authorization: Bearer <token>` header, attaching the payload `{ id, role }` to `req.user`.

---

## 7. Data Flow

### Candidate Creation with Resume & Photo Upload
1.  Frontend sends a `multipart/form-data` payload containing fields, resume file, and photo file.
2.  Backend `upload.middleware.js` checks mime-types (JPEG/PNG/GIF/WEBP for photos, PDF/DOC/DOCX for resumes) and limits file size to 5MB.
3.  Multer saves files to `/backend/uploads` with unique timestamps.
4.  Backend `candidate.controller.js` creates a Candidate row in the DB with the file paths.
5.  A related `CandidateDocument` record is inserted to track the resume file.
6.  The database sync triggers a Postgres replication notification.
7.  The frontend Supabase Realtime channel catches the notification, prompting candidates to refresh automatically on all active recruiter screens.

---

## 8. Build Process & Environments

### Local Environment Setup
#### Prerequisites
*   Node.js (v18.x or above)
*   PostgreSQL instance

#### Installation
1.  **Clone the project** to your local workspace directory.
2.  **Setup Backend environment** (`/backend/.env`):
    ```env
    PORT=5000
    DATABASE_URL="postgresql://username:password@localhost:5432/hrcrm?schema=public"
    DIRECT_URL="postgresql://username:password@localhost:5432/hrcrm?schema=public"
    JWT_SECRET="your-development-jwt-secret-key-12345"
    FRONTEND_URL="http://localhost:5173"
    ```
3.  **Setup Frontend environment** (`/frontend/.env`):
    ```env
    VITE_API_URL="http://localhost:5000"
    VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
    VITE_SUPABASE_ANON_KEY="your-anon-public-key"
    ```
4.  **Install dependencies**:
    *   In `/backend`: Run `npm install`
    *   In `/frontend`: Run `npm install`
5.  **Initialize Database**:
    *   Generate Prisma client: `npx prisma generate` (inside `/backend`)
    *   Run migrations: `npx prisma db push` or `npx prisma migrate dev`
    *   Seed default accounts: `npm run seed` or `node seed-dev.js`
6.  **Run Development Servers**:
    *   Backend: `npm run dev` (Runs Nodemon on port 5000)
    *   Frontend: `npm run dev` (Runs Vite server on port 5173)

### Deployment Guide (Render Config)
The monorepo uses Infrastructure-as-Code config defined in [render.yaml](file:///Users/Bhavya/Desktop/internship/react/HRCRM%20/render.yaml):

1.  **Backend Web Service (`hrcrm-backend`):**
    *   Build Command: `npm install && npm run build` (Installs dependencies and runs `npx prisma generate` to output client files).
    *   Start Command: `npm start` (Runs `node src/index.js`).
    *   Required Environment Variables:
        *   `DATABASE_URL`: Connection string.
        *   `DIRECT_URL`: Database connection for migrations.
        *   `JWT_SECRET`: Autogenerated security key.
        *   `FRONTEND_URL`: Injected from the static site service URL.
2.  **Frontend Static Site (`hrcrm-frontend`):**
    *   Build Command: `npm install && npm run build` (Runs `vite build` compilation).
    *   Publish Directory: `dist`
    *   Required Environment Variables:
        *   `VITE_API_URL`: Injected from the backend web service URL.

---

## 9. Security Practices

*   **Password Hashing:** Passwords are never stored in plain text. They are hashed using `bcryptjs` with 10 salt rounds before being stored.
*   **Role-Based Access Control (RBAC):** Backend checks roles via `authorizeRoles('admin')` for sensitive endpoints like notices creation, employee account generation, and client assignments.
*   **Database Query Protection:** By using Prisma ORM, SQL statements are fully parameterized by default, protecting the backend against SQL Injection vulnerabilities.
*   **CORS Configuration:** Origin verification handles authorized domains (explicitly verifying development localhost and Render production URLs to prevent unauthorized cross-origin data queries).

---

## 10. Future Scalability Plan

*   **File Storage Transition:** Shift from Multer's local disk storage to **Cloudinary** or **AWS S3** since hosted static deployments (like Render) wipe local folder additions when virtual containers restart.
*   **Realtime Optimization:** Replace the broad `event: '*'` Supabase channel listener with discrete table filters or cursor-based polling to prevent bandwidth crashes when the candidate table grows past 100k+ rows.
*   **Search System Upgrade:** Replace PostgreSQL query contains searches (`{ contains: search }`) with Postgres Full-Text Search (FTS) indexes or a dedicated **ElasticSearch** cluster for lightning-fast keyword mapping across large candidate pools.
