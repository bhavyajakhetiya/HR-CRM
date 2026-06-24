Since you're using an AI coding agent, don't think in terms of pages. Think in terms of **milestones**. Each milestone should leave the project in a working state before moving to the next one.

---

# Phase 1: Project Foundation

### Task 1: Initialize Project Structure

**Frontend**

* Create React + Vite project
* Install Tailwind CSS
* Configure React Router
* Create folder structure

```text
src/
├── pages/
├── components/
├── layouts/
├── services/
├── hooks/
├── contexts/
├── utils/
├── routes/
├── assets/
└── App.jsx
```

**Backend**

* Create Express server
* Setup Prisma
* Setup PostgreSQL connection
* Create environment variables

Expected Outcome:

* Frontend runs
* Backend runs
* Database connected

---

# Phase 2: Public Website

### Task 2: Landing Page

Create:

* Hero Section
* Features Section
* About Platform
* Contact Section
* Login/Register Buttons

Pages:

```text
/
```

Expected Outcome:

* Professional landing page
* Navigation works

---

### Task 3: Authentication UI

Create:

```text
/admin/login

/employee/login

/candidate/login

/candidate/register
```

Forms:

Admin:

* Email
* Password

Employee:

* Email
* Password

Candidate:

* Name
* Email
* Password
* Phone

Expected Outcome:

* All forms designed
* Form validation implemented

---

# Phase 3: Database Design

### Task 4: Database Schema Creation

Create tables:

```text
Admins

Employees

Clients

Candidates

Requirements

CandidateDocuments

ActivityLogs

Notices

Notifications
```

Relationships:

```text
Employee
    ↓
Assigned Client

Client
    ↓
Requirements

Requirement
    ↓
Candidates
```

Expected Outcome:

* Prisma schema finalized
* Database migrated

---

# Phase 4: Authentication Backend

### Task 5: Candidate Registration

Features:

* Register account
* Hash password
* Save user

Endpoints:

```text
POST /candidate/register
```

Expected Outcome:

* Candidate account stored in DB

---

### Task 6: Login System

Create:

```text
POST /admin/login

POST /employee/login

POST /candidate/login
```

Implement:

* JWT Authentication
* Session persistence
* Protected routes

Expected Outcome:

* Login works
* Dashboard access protected

---

# Phase 5: Dashboard Skeletons

### Task 7: Admin Dashboard Layout

Sidebar:

```text
Dashboard
Clients
Employees
Candidates
Reports
Notices
Settings
```

Expected Outcome:

* Navigation complete

---

### Task 8: Employee Dashboard Layout

Sidebar:

```text
Dashboard
My Clients
Candidate Pool
Activities
Notifications
Settings
```

Expected Outcome:

* Navigation complete

---

### Task 9: Candidate Dashboard Layout

Sidebar:

```text
Dashboard
My Profile
Documents
Notifications
Settings
```

Expected Outcome:

* Navigation complete

---

# Phase 6: Candidate Module

### Task 10: Candidate Profile System

Candidate can:

* Edit Profile
* Add Skills
* Add Education
* Add Experience

Expected Outcome:

* Candidate data saved

---

### Task 11: Resume Upload

Implement:

* PDF Upload
* Resume Storage
* Resume Retrieval

Expected Outcome:

* Resume visible to recruiters

---

# Phase 7: Client Management

### Task 12: Client CRUD

Admin can:

* Create Client
* Edit Client
* Delete Client
* View Client

Expected Outcome:

* Client management complete

---

### Task 13: Assign Employee To Client

Admin can:

```text
Select Employee
↓
Select Client
↓
Assign
```

Expected Outcome:

* Employee sees assigned clients

---

# Phase 8: [DELETED - Requirements Feature Removed]

---

# Phase 9: Candidate Pool

### Task 16: Candidate Database

Employee can:

* View all candidates
* Search candidates
* Filter candidates

Filters:

```text
Skills
Experience
Location
Education
```

Expected Outcome:

* Search working

---

### Task 17: Candidate Details Page

Employee can:

* Open profile
* View experience
* Download resume

Expected Outcome:

* Full candidate visibility

---

# Phase 10: Recruitment Pipeline

### Task 18: Candidate Status System

Statuses:

```text
Registered
Screening
Contacted
Interested
Interview Scheduled
Interview Completed
Selected
Offer Released
Joined
Rejected
```

Expected Outcome:

* Status updates work

---

### Task 19: Candidate Assignment

Employee:

```text
Select Candidate
↓
Link To Requirement
```

Expected Outcome:

* Candidate linked to requirement

---

# Phase 11: Activity Logging

### Task 20: Activity Logs

Track:

* Candidate viewed
* Resume downloaded
* Candidate contacted
* Status changed

Expected Outcome:

* Logs generated automatically

---

### Task 21: Admin Monitoring

Admin sees:

```text
Employee
Calls
Candidates
Interviews
Placements
```

Expected Outcome:

* Recruiter tracking operational

---

# Phase 12: Notifications

### Task 22: Internal Notice System

Admin:

```text
Create Notice
↓
Employees Receive Notice
```

Expected Outcome:

* Internal communication works

---

### Task 23: Candidate Notifications

Triggers:

* Shortlisted
* Interview Scheduled
* Selected
* Rejected

Expected Outcome:

* Candidate receives updates

---

# Phase 13: Reporting

### Task 24: Dashboard Analytics

Admin Metrics:

```text
Total Clients
Total Employees
Total Candidates
Open Requirements
Placements
```

Expected Outcome:

* Overview dashboard complete

---

### Task 25: Performance Reports

Generate:

* Employee Performance
* Requirement Performance
* Placement Reports

Expected Outcome:

* Reporting module complete

---

# Phase 14: Final Polish

### Task 26: Role-Based Access Testing

Verify:

* Admin permissions
* Employee permissions
* Candidate permissions

---

### Task 27: UI Polish

* Responsive design
* Loading states
* Error handling
* Empty states

---

### Task 28: End-to-End Testing

Test full workflow:

```text
Candidate Registers
↓
Admin Creates Client
↓
Admin Records Requirement
↓
Admin Assigns Employee
↓
Employee Finds Candidate
↓
Employee Updates Status
↓
Candidate Receives Notification
↓
Admin Sees Activity
```

Expected Outcome:

* Complete prototype ready for demonstration.

This sequence is optimized for an AI coding agent because every task has a clear scope, clear output, and minimal dependencies on unfinished features.
