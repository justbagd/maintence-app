# ApartmentCare — Product Requirements Document

**Project:** Apartment Maintenance Management System  
**Version:** 1.0  
**Stack:** React + Tailwind CSS (Frontend) | Java Spring Boot (Backend) | MySQL (Database)  
**Course:** INSY 4325 — Option 1: Information Systems  
**Demo Deadline:** April 14–23 | **Report Due:** April 30

---

## 1. Overview

ApartmentCare is a full-stack web application that digitizes the apartment maintenance request lifecycle. It enables tenants to report issues, maintenance staff to manage and resolve them, and admins to oversee operations and analytics — all through a role-based, secure interface.

---

## 2. User Roles

| Role | Description |
|---|---|
| **Tenant** | Apartment resident who submits and tracks maintenance requests |
| **Maintenance Staff** | Assigned technician who works on and updates requests |
| **Admin** | Property manager with full oversight and assignment control |

---

## 3. Functional Requirements

### 3.1 Authentication & Registration (All Roles)

- Users can register with name, email, password, and role selection (Tenant / Staff / Admin)
- Login returns a JWT token stored client-side; all subsequent requests include `Authorization: Bearer <token>`
- Passwords hashed with BCrypt
- Role-based access enforced on every protected endpoint
- Demo credentials supported:
  - `tenant@demo.com` → Tenant role
  - `maintenance@demo.com` → Maintenance Staff role
  - `admin@demo.com` → Admin role
  - Password: any

---

### 3.2 Tenant Features

#### 3.2.1 Submit Maintenance Request
- Select issue **category**: Plumbing, Electrical, HVAC, Appliance, Structural, Pest Control, Other
- Select **priority level**: Low, Medium, High, Urgent
- Select **location in unit**: Kitchen, Bathroom, Bedroom, Living Room, Hallway, Exterior, Other
- Enter **detailed description** (required, free text)
- **Upload photo(s)** of the issue (optional; PNG/JPG, up to 10MB each; stored locally in dev)
- Select optional **preferred schedule**: date + time window (Any time / Morning / Afternoon / Evening)
- Toggle: **Allow entry if I'm not home**
- On submit, request is created with status `PENDING` and tenant receives an in-app notification confirming submission

#### 3.2.2 View Request History
- Dashboard shows all active requests in a table: Request ID, Category, Priority, Status, Date
- Priority color-coded: Urgent (red), High (orange), Medium (yellow), Low (green)
- Status badges: Pending (blue), In Progress (blue), Completed (green), Archived (gray)
- Tenant can click into any request to see full details, repair notes added by staff, and status history timeline

#### 3.2.3 Archived Requests & Reopen
- Completed requests are moved to an **Archived** tab after 30 days (or manually by admin)
- Tenant can view archived requests at any time
- Tenant can **reopen** an archived request if the original issue was not resolved
  - Reopening creates a new linked request with a note referencing the original Request ID
  - Status resets to `PENDING`

#### 3.2.4 In-App Notifications
- Tenant receives notifications for:
  - Request submitted (confirmation)
  - Request assigned to a technician
  - Status changed (Pending → In Progress → Completed)
  - Request archived
- Bell icon in navbar shows unread count badge
- Notification panel shows message, timestamp, and read/unread state
- Clicking a notification marks it as read and navigates to the related request

---

### 3.3 Maintenance Staff Features

#### 3.3.1 Secure Login
- Staff log in with email + password; JWT token scopes access to staff-only views

#### 3.3.2 View Assigned Requests
- Staff dashboard lists all requests assigned to them
- Columns: Request ID, Tenant & Unit, Category, Priority, Status, Submitted Date
- Can **filter** by priority level (All / Urgent / High / Medium / Low)
- Can **sort** by date submitted or priority

#### 3.3.3 Update Request Status
- Staff can update status on any assigned request:
  - `PENDING` → `IN_PROGRESS`
  - `IN_PROGRESS` → `COMPLETED`
- Status changes trigger in-app notifications to the tenant

#### 3.3.4 Add Repair Notes
- Staff can add timestamped repair notes to a request at any point
- Notes are visible to the tenant on their request detail view
- Multiple notes allowed per request (append-only log)

#### 3.3.5 Mark as Completed
- Marking complete sets `status = COMPLETED` and records `completion_date` timestamp
- Tenant notified immediately

---

### 3.4 Admin Features

#### 3.4.1 View All Requests
- Full paginated table of all requests across all tenants
- Columns: Request ID, Tenant & Unit, Assigned Technician, Priority, Status, Submitted Date, Assign dropdown
- Filter by status, priority, category, or assigned technician
- Export table as report (CSV or PDF)

#### 3.4.2 Assign Technicians
- Dropdown on each request row to assign or reassign a maintenance staff member
- Assignment triggers in-app notification to both the tenant and the assigned staff member
- Unassigned requests are visually flagged

#### 3.4.3 Adjust Priority Levels
- Admin can change priority on any open request
- Priority changes are logged in the request history

#### 3.4.4 Monitor Technician Workload
- Dashboard stat card shows average active requests per technician (e.g., "19.5 avg")
- Technician Management page lists all staff with current workload count and availability status

#### 3.4.5 Track Resolution Time
- Dashboard stat card shows average resolution time in days (e.g., "2.4 days")
- Per-request: shows elapsed time from `date_submitted` to `completion_date`

#### 3.4.6 Performance Analytics (Dashboard Charts)
- **Most Common Issue Categories** — bar chart
- **Requests Over Time** — line chart (last 30/60/90 days toggle)
- **Status Distribution** — pie chart (Completed / In Progress / Pending / Urgent)
- Summary stat cards: Total Open Tickets, Urgent Requests, Avg Resolution Time, Technician Workload, Completed This Month

---

## 4. Non-Functional Requirements

| Concern | Requirement |
|---|---|
| **Authentication** | JWT tokens; BCrypt password hashing; tokens expire after 24 hours |
| **Authorization** | RBAC enforced server-side on every endpoint; role mismatches return 403 |
| **File Storage** | Local filesystem for dev (`/uploads`); files served via static endpoint |
| **Notifications** | In-app only; real-time via polling or WebSocket (polling acceptable for v1) |
| **Responsiveness** | Usable on desktop and tablet; mobile is stretch goal |
| **Validation** | All required fields validated client-side and server-side; meaningful error messages returned |
| **Error Handling** | API returns structured JSON errors with HTTP status codes |

---

## 5. Data Model (MySQL)

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK | Auto-increment |
| `name` | VARCHAR(100) | |
| `email` | VARCHAR(150) | Unique |
| `password` | VARCHAR(255) | BCrypt hash |
| `role` | VARCHAR(20) | TENANT / STAFF / ADMIN |
| `apartment_number` | VARCHAR(20) | Nullable (tenants only) |
| `lease_start` | DATE | Nullable |
| `lease_end` | DATE | Nullable |
| `skill_type` | VARCHAR(50) | Nullable (staff only) |
| `available` | BOOLEAN | Nullable (staff only) |

### `maintenance_requests`
| Column | Type | Notes |
|---|---|---|
| `request_id` | BIGINT PK | Auto-increment |
| `tenant_id` | BIGINT FK → users | |
| `assigned_staff_id` | BIGINT FK → users | Nullable |
| `category` | VARCHAR(50) | |
| `location_in_unit` | VARCHAR(50) | |
| `description` | TEXT | |
| `priority` | VARCHAR(20) | LOW / MEDIUM / HIGH / URGENT |
| `status` | VARCHAR(20) | PENDING / ASSIGNED / IN_PROGRESS / COMPLETED / ARCHIVED |
| `photo_url` | VARCHAR(500) | Nullable; local file path |
| `preferred_date` | DATE | Nullable |
| `preferred_time` | VARCHAR(20) | Nullable |
| `allow_entry` | BOOLEAN | Default false |
| `date_submitted` | TIMESTAMP | Auto set on create |
| `completion_date` | TIMESTAMP | Nullable; set on completion |
| `parent_request_id` | BIGINT FK → requests | Nullable; for reopened requests |

### `request_notes`
| Column | Type | Notes |
|---|---|---|
| `note_id` | BIGINT PK | |
| `request_id` | BIGINT FK → requests | |
| `author_id` | BIGINT FK → users | |
| `note_text` | TEXT | |
| `created_at` | TIMESTAMP | |

### `notifications`
| Column | Type | Notes |
|---|---|---|
| `notification_id` | BIGINT PK | |
| `user_id` | BIGINT FK → users | |
| `request_id` | BIGINT FK → requests | Nullable |
| `message` | TEXT | |
| `timestamp` | TIMESTAMP | |
| `read_status` | BOOLEAN | Default false |

---

## 6. REST API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Login; returns JWT | Public |
| POST | `/api/auth/signup` | Register new user with role | Public |

### Maintenance Requests
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/requests` | Submit new request (with optional photo upload) | Tenant |
| GET | `/api/requests/tenant/{tenantId}` | Get tenant's own requests | Tenant |
| GET | `/api/requests` | Get all requests (paginated, filterable) | Admin |
| GET | `/api/requests/staff/{staffId}` | Get requests assigned to staff member | Staff |
| GET | `/api/requests/{id}` | Get single request detail | Tenant (own) / Staff (assigned) / Admin |
| PUT | `/api/requests/{id}/assign` | Assign technician | Admin |
| PUT | `/api/requests/{id}/priority` | Update priority | Admin |
| PUT | `/api/requests/{id}/status` | Update status + add note | Staff |
| POST | `/api/requests/{id}/reopen` | Reopen archived request | Tenant |

### Notes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/requests/{id}/notes` | Add repair note | Staff / Admin |
| GET | `/api/requests/{id}/notes` | Get all notes for a request | Tenant (own) / Staff / Admin |

### Notifications
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/notifications` | Get current user's notifications | All |
| PUT | `/api/notifications/{id}/read` | Mark notification as read | All |
| PUT | `/api/notifications/read-all` | Mark all as read | All |

### Admin / Analytics
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/analytics` | Aggregate stats and chart data | Admin |
| GET | `/api/admin/technicians` | List all staff with workload | Admin |
| GET | `/api/requests/export` | Export requests as CSV | Admin |

---

## 7. Request Lifecycle

```
PENDING → ASSIGNED → IN_PROGRESS → COMPLETED → (ARCHIVED)
                                        ↑
                              (REOPEN creates new PENDING)
```

| Transition | Triggered By | Notification Sent To |
|---|---|---|
| Submitted → PENDING | Tenant | Tenant (confirmation) |
| PENDING → ASSIGNED | Admin assigns technician | Tenant + Staff |
| ASSIGNED → IN_PROGRESS | Staff updates status | Tenant |
| IN_PROGRESS → COMPLETED | Staff marks complete | Tenant |
| COMPLETED → ARCHIVED | Auto (30 days) or Admin | Tenant |
| ARCHIVED → PENDING (reopen) | Tenant | Admin |

---

## 8. Architecture

```
React + Tailwind (Frontend)
  ↓ Axios HTTP / Bearer Token
Controller Layer (Spring Boot REST)
  ↓
Service Layer (Business Logic + RBAC)
  ↓
Repository Layer (JPA / Hibernate)
  ↓
MySQL Database
```

### Layer Responsibilities
- **Controller:** HTTP request/response, input validation, routing
- **Service:** Business logic, role checks, workflow enforcement, notification creation
- **Repository:** JPA queries, entity CRUD
- **Security Config:** JWT filter, BCrypt bean, Spring Security role guards

---

## 9. UI Screens Summary

| Screen | Role | Key Elements |
|---|---|---|
| Login / Sign Up | All | Email + password, role select on signup, demo credentials shown |
| Tenant Dashboard | Tenant | Welcome banner, Submit Request CTA, Active Requests table |
| New Request Form | Tenant | Category, priority, location, description, photo upload, schedule |
| My Requests | Tenant | Full history table with status badges, click-through to detail |
| Request Detail | Tenant | Full info, repair notes log, status timeline, reopen button (if archived) |
| Staff Dashboard | Staff | Assigned requests table, priority filter, status update controls |
| Admin Dashboard | Admin | Stat cards, request management table, assign dropdowns, export button |
| Admin Analytics | Admin | Bar chart (categories), line chart (over time), pie chart (status distribution) |
| Technician Mgmt | Admin | Staff list with active workload and availability toggle |
| Notifications Panel | All | Bell icon dropdown, unread badge, message list with timestamps |

---

## 10. Implementation Phases

| Phase | Scope |
|---|---|
| **1 — Database & Models** | MySQL schema, JPA entities, repository layer |
| **2 — Auth & Security** | JWT auth, BCrypt, Spring Security config, RBAC guards |
| **3 — Core API** | Request CRUD, assignment, priority update, status update, notes |
| **4 — Notifications** | Auto-create notifications on all status transitions; notification endpoints |
| **5 — React Integration** | Connect all frontend views via Axios; test full flows end-to-end |

**Demo:** April 14–23 | **Final Report:** April 30

---

## 11. Design System

### 11.1 Color Variables

#### Brand & Primary
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#2452C9` | Sidebar background, login page gradient base |
| `--color-primary-dark` | `#1A3A99` | Sidebar active hover, deeper gradient stop |
| `--color-accent` | `#4169F5` | CTA buttons (Log In, Submit Request), active nav highlight, links |
| `--color-accent-hover` | `#2F56E0` | Button hover state |

#### Backgrounds & Surfaces
| Token | Hex | Usage |
|---|---|---|
| `--color-background` | `#F3F4F6` | Page/content area background |
| `--color-surface` | `#FFFFFF` | Cards, modals, form panels |
| `--color-surface-subtle` | `#F0F4FF` | Demo credentials box, info callouts |
| `--color-border` | `#E5E7EB` | Input borders, table dividers, card outlines |

#### Text
| Token | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#111827` | Headings, table body text |
| `--color-text-secondary` | `#374151` | Subheadings, nav labels |
| `--color-text-muted` | `#6B7280` | Placeholders, metadata (unit, date), table column headers |
| `--color-text-on-primary` | `#FFFFFF` | Text/icons on blue backgrounds (sidebar, buttons) |

#### Priority Colors
| Token | Hex | Usage |
|---|---|---|
| `--color-urgent` | `#EF4444` | Urgent priority label text |
| `--color-high` | `#F97316` | High priority label text |
| `--color-medium` | `#EAB308` | Medium priority label text |
| `--color-low` | `#22C55E` | Low priority label text |

#### Status Badge Colors
| Status | Background | Text | Tokens |
|---|---|---|---|
| Pending | `#FEF9C3` | `#92400E` | `--color-badge-pending-bg` / `--color-badge-pending-text` |
| In Progress | `#DBEAFE` | `#1D4ED8` | `--color-badge-inprogress-bg` / `--color-badge-inprogress-text` |
| Completed | `#DCFCE7` | `#15803D` | `--color-badge-completed-bg` / `--color-badge-completed-text` |
| Urgent | `#FEE2E2` | `#DC2626` | `--color-badge-urgent-bg` / `--color-badge-urgent-text` |

#### Notification & Utility
| Token | Hex | Usage |
|---|---|---|
| `--color-notification-dot` | `#EF4444` | Bell icon unread badge |
| `--color-avatar-bg` | `#3B82F6` | User avatar circle fallback |

---

### 11.2 Typography

**Primary Font:** `Inter`, fallback `ui-sans-serif, system-ui, -apple-system, sans-serif`

#### Text Styles
| Style | Font Size | Font Weight | Line Height | Usage |
|---|---|---|---|---|
| `app-name` | 24px | 700 (Bold) | 1.2 | "ApartmentCare" brand name in login header |
| `page-title` | 22px | 600 (Semibold) | 1.3 | Page headings ("Welcome back, Kevin Lu", "Submit New Maintenance Request") |
| `section-header` | 16px | 600 (Semibold) | 1.4 | Section labels ("Active Requests", "Need to report an issue?") |
| `nav-label` | 14px | 500 (Medium) | 1.4 | Sidebar navigation items |
| `body` | 14px | 400 (Regular) | 1.5 | Table cell content, form labels, general body copy |
| `body-small` | 13px | 400 (Regular) | 1.5 | Metadata subtitles ("Unit 304 · Lease ends Dec 2026") |
| `label` | 12px | 500 (Medium) | 1.4 | Form field labels, table column headers, badge text |
| `caption` | 11px | 400 (Regular) | 1.4 | Helper text, timestamps |
| `stat-value` | 28px | 700 (Bold) | 1.1 | Dashboard stat card numbers ("156", "2.4 days") |
| `stat-label` | 12px | 400 (Regular) | 1.4 | Stat card subtitles ("Total Open Tickets") |

#### Font Weight Reference
| Weight | Value | Usage |
|---|---|---|
| Regular | 400 | Body text, placeholders, captions |
| Medium | 500 | Nav items, labels, badge text |
| Semibold | 600 | Section headers, page titles, card headings |
| Bold | 700 | App name, stat values, primary CTAs |

---

### 11.3 Component Tokens

#### Spacing
| Token | Value | Usage |
|---|---|---|
| `--spacing-xs` | 4px | Icon-to-label gap, badge padding |
| `--spacing-sm` | 8px | Input internal padding (vertical), nav icon gap |
| `--spacing-md` | 16px | Card internal padding, form field gap |
| `--spacing-lg` | 24px | Section spacing, card margin |
| `--spacing-xl` | 32px | Page section separation |

#### Border Radius
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Badges, tags, small chips |
| `--radius-md` | 10px | Input fields, dropdowns, table rows |
| `--radius-lg` | 16px | Cards, modals, login panel |
| `--radius-pill` | 999px | Toggle switches, nav active highlight |

#### Shadows
| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 1px 4px rgba(0,0,0,0.08)` | Cards, panels |
| `--shadow-modal` | `0 8px 32px rgba(0,0,0,0.15)` | Login card, modals |
| `--shadow-button` | `0 2px 8px rgba(65,105,245,0.35)` | Primary action buttons |
