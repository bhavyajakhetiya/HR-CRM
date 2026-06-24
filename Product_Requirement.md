# Product Requirement Document (PRD)

# HR-CRM Platform

## Overview

HR-CRM is a recruitment and workforce management platform that connects four stakeholders:

- Admin (HR Company)
- Employees (Recruiters)
- Clients (Companies hiring candidates)
- Candidates (Job Seekers)

The platform enables recruitment agencies to manage clients, employee recruiters, candidate databases, recruitment pipelines, communication, and performance tracking from a single dashboard.

---

## Problem Statement

Recruitment agencies often manage candidates, clients, job openings, and recruiter activities across spreadsheets, emails, and messaging applications.

This leads to:

- Poor candidate tracking
- Lack of recruiter accountability
- Delayed communication
- Difficulty monitoring placements
- Scattered client information

HR-CRM centralizes all recruitment operations into one platform.

---

## Stakeholders

### Admin

Primary system owner.

Responsibilities:

- Manage employees
- Manage clients
- Create job requirements
- Monitor recruiter performance
- Track candidate pipeline
- Send notices and announcements
- Generate reports

### Employee

Recruiter working under the admin.

Responsibilities:

- Manage assigned clients
- Search candidates
- Contact candidates
- Schedule interviews
- Update candidate statuses
- Maintain activity logs

### Candidate

Job seeker registered on the platform.

Responsibilities:

- Register profile
- Upload resume
- Update personal details
- View application status
- Receive notifications

### Client

External company requesting candidates.

No direct dashboard in Phase 1.

Client data is managed by Admin.

---

## Core Modules

### Authentication

- Admin Login
- Employee Login
- Candidate Login
- Password Reset
- Role-Based Access Control

### Client Management

Admin can:

- Add client
- Edit client
- Archive client
- View client history

### Requirement Management

Admin can create job requirements.

Fields:

- Client
- Position
- Department
- Skills Required
- Experience
- Salary Range
- Location
- Number of Openings
- Priority
- Status

### Employee Management

Admin can:

- Create employee accounts
- Assign clients
- Assign requirements
- Monitor performance

### Candidate Management

Candidates can:

- Register
- Upload resumes
- Upload documents
- Manage profiles

Employees can:

- Search candidates
- Filter candidates
- Download resumes
- Shortlist candidates

### Recruitment Pipeline

Registered
→ Profile Completed
→ Screening
→ Contacted
→ Interested
→ Interview Scheduled
→ Interview Completed
→ Selected
→ Offer Released
→ Joined
→ Closed

### Activity Tracking

System tracks:

- Calls made
- Candidates contacted
- Interviews scheduled
- Placements completed
- Status updates

### Notification System

Admin → Employees

- Notices
- Announcements
- Targets

System → Candidates

- Application updates
- Interview schedules
- Selection status
- Offer notifications

### Reports

- Recruiter Performance Reports
- Client Reports
- Requirement Reports
- Placement Reports
- Monthly Hiring Reports

---

## Non-Functional Requirements

### Performance

- Dashboard load under 3 seconds

### Security

- Role-based permissions
- Encrypted passwords
- Secure document storage

### Scalability

- 100,000+ candidates
- 500+ employees
- 1,000+ clients

### Availability

- 99% uptime target

---

## Future Enhancements

- Client Portal
- WhatsApp Integration
- AI Candidate Matching
- Resume Parsing
- Interview Scheduling Automation
- Mobile Application
