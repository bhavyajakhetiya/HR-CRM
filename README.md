# HR-CRM Platform

An interactive, high-fidelity recruitment and workforce management platform designed to connect **Admins** (agency owners) and **Employees** (recruiters) to optimize hiring pipelines, candidate selections, client accounts, and performance analytics.

---

## 🚀 Key Features

*   **Unified Authentication Portal:** Role-based access control (RBAC) separating administrative actions and recruiter tasks.
*   **Recruiter Account Roster:** Admin tool to add, update, and manage team recruiter credentials.
*   **Client Company Directory:** Directory of hiring clients assigned to specific recruiters, with activity logging for assignments.
*   **Candidate Pool Sourcing:** Shared database where recruiters can register candidate profiles, upload resumes and photos, search by skill keywords, and update candidate hiring stages.
*   **Selection Locking:** Recruiters can lock candidates to prevent double-sourcing by other team members.
*   **Activity Logs & Daily Input Reports:** Recruiter audits and daily work summaries logged to monitor team productivity.
*   **Performance Reports:** Custom SVG Donut and Line charts visualizing candidate status distributions and recruiter activity trends over time, with CSV data exports.
*   **System Notices:** Admin broadcast board that reflects real-time notices on recruiter dashboards.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js, Zustand (State Management), Tailwind CSS, React Hook Form, Zod, Axios, Lucide React, and Google Material Symbols.
*   **Backend:** Node.js, Express.js, JWT Authentication, bcryptjs.
*   **Database & ORM:** PostgreSQL (hosted on **Supabase**), Prisma ORM (with `@prisma/adapter-pg` driver).
*   **Realtime Sync:** Supabase Realtime client listening to Postgres database changes via WebSockets.
*   **File Uploads:** Multer local disk storage (stores candidate resumes and photos).

For a detailed review of our technical stack and database relations, see [TECH_STACK_DOCUMENTATION.md](file:///Users/Bhavya/Desktop/internship/react/HRCRM%20/TECH_STACK_DOCUMENTATION.md).

---

## 📂 Project Architecture

```text
HRCRM/
├── backend/                  # REST API server & database layers
│   ├── prisma/               # Schema models & migrations
│   ├── src/                  # Controllers, routes, middlewares, & utilities
│   ├── uploads/              # Local storage for resume and photo uploads
│   └── seed-dev.js           # Seeder script for default Admin/Recruiter logins
├── frontend/                 # React SPA
│   ├── src/                  # Pages, components, stores, routes, & styles
│   └── tailwind.config.js    # Design tokens & color schemas
├── render.yaml               # Infrastructure-as-Code for Render hosting
├── README.md                 # Project Overview
├── TECH_STACK_DOCUMENTATION.md # Detailed technical stack documentation
└── PRODUCT_REVIEW_DOCUMENTATION.md # Project review and prioritizations scorecard
```

---

## 💻 Local Quick Start

### Prerequisites
*   Node.js (v18.x or above)
*   PostgreSQL database (or Supabase instance)

### Installation & Environment Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/bhavyajakhetiya/HR-CRM.git
    cd HR-CRM
    ```

2.  **Configure Backend Environments (`backend/.env`):**
    ```env
    PORT=5000
    DATABASE_URL="postgresql://username:password@localhost:5432/hrcrm?schema=public"
    DIRECT_URL="postgresql://username:password@localhost:5432/hrcrm?schema=public"
    JWT_SECRET="your-development-jwt-secret-key-12345"
    FRONTEND_URL="http://localhost:5173"
    ```

3.  **Configure Frontend Environments (`frontend/.env`):**
    ```env
    VITE_API_URL="http://localhost:5000"
    VITE_SUPABASE_URL="https://your-project.supabase.co"
    VITE_SUPABASE_ANON_KEY="your-anon-public-key"
    ```

4.  **Install Dependencies:**
    *   **Backend:**
        ```bash
        cd backend
        npm install
        ```
    *   **Frontend:**
        ```bash
        cd ../frontend
        npm install
        ```

5.  **Initialize Database & Run Seeder:**
    Inside the `backend/` directory:
    ```bash
    npx prisma generate
    npx prisma db push
    npm run seed # Seeds admin@example.com / recruiter@example.com (Password: password123)
    ```

6.  **Run Development Servers:**
    *   **Backend:** `npm run dev` (Runs on port 5000)
    *   **Frontend:** `npm run dev` (Runs on port 5173)

---

## 📈 Product scorecard & Review
For recommendations, accessibility scores, security evaluations, and UX reviews, read [PRODUCT_REVIEW_DOCUMENTATION.md](file:///Users/Bhavya/Desktop/internship/react/HRCRM%20/PRODUCT_REVIEW_DOCUMENTATION.md).
