# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the application (http://localhost:8080)
./mvnw spring-boot:run

# Build and package
./mvnw clean install

# Run tests
./mvnw test

# Package without tests
./mvnw clean package -DskipTests
```

## Architecture

**ApartmentCare** is a maintenance request management system for apartment buildings. Spring Boot 4.0.5 / Java 17 backend serves a vanilla HTML/CSS/JS frontend from `/static/`.

### Layer Structure

```
Browser (HTML/CSS/JS in src/main/resources/static/)
  ↕ fetch() via api.js → /api/**
Controller Layer  (controller/)
  ↓
Service Layer     (service/)   ← business logic, validation, notifications
  ↓
Repository Layer  (repository/) ← in-memory ArrayList + AtomicLong IDs
```

No database yet — all storage is in-memory `List<T>` that resets on restart. Seed data (3 demo users, requests, notes, notifications) is initialized in each repository's constructor.

### Request Lifecycle

Status flow: `PENDING → ASSIGNED → IN_PROGRESS → COMPLETED → ARCHIVED`

Each status transition in `MaintenanceRequestService` automatically calls `NotificationService` to create in-app notifications for the relevant tenant and/or staff member. Re-opening a completed request creates a new `MaintenanceRequest` with `parentRequestId` pointing to the original.

### Authentication

- Login returns a mock token (`"mock-token-" + userId`) — not real JWT
- Passwords are stored as plain text — prototype only
- Frontend stores `ac_user` and `ac_token` in `localStorage`
- Each HTML page calls `requireAuth(expectedRole)` on load to guard access
- CORS in `WebConfig.java` allows `localhost:3000` and `localhost:5173`

### Frontend Structure

Three role-based dashboards (`tenant.html`, `staff.html`, `admin.html`) plus a login page (`index.html`). All share:
- `css/styles.css` — CSS custom property design system (`--color-primary`, `--sidebar-width`, etc.)
- `js/api.js` — `apiFetch()` wrapper and namespaced API objects (`auth`, `requests`, `notes`, `notifications`, `admin`)

### Key Enums

`Role` (TENANT/STAFF/ADMIN), `Status` (PENDING/ASSIGNED/IN_PROGRESS/COMPLETED/ARCHIVED), `Priority` (LOW/MEDIUM/HIGH/URGENT), `Category` (PLUMBING/ELECTRICAL/HVAC/APPLIANCE/STRUCTURAL/PEST_CONTROL/OTHER)

### Demo Credentials

| Email | Password | Role |
|---|---|---|
| tenant@demo.com | password | Tenant |
| maintenance@demo.com | password | Staff |
| admin@demo.com | password | Admin |

### Not Yet Implemented

- Real database (JPA + MySQL to replace ArrayLists)
- JWT authentication and BCrypt password hashing
- Photo upload (`POST /api/requests/{id}/photo` endpoint exists but isn't wired)
- Pagination on list endpoints
