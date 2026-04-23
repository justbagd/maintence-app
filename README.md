# ApartmentCare — Maintenance Management System

A full-stack web application for managing apartment maintenance requests.
Tenants submit issues, staff resolve them, and admins oversee everything.

**Stack:** Java 17 · Spring Boot 4.0.5 · Vanilla HTML/CSS/JS  
**Storage:** In-memory (no database yet)  
**Demo deadline:** April 14–23

---

## Quick Start

```bash
./mvnw spring-boot:run
# → open http://localhost:8080
```

**Demo logins:**

| Email | Password | Role |
|---|---|---|
| tenant@demo.com | password | Tenant |
| maintenance@demo.com | password | Staff |
| admin@demo.com | password | Admin |

---

## File Structure

```
maintence-app/
├── pom.xml                            # Maven build — Spring Boot 4.0.5, Java 17, Lombok
├── maintenance-prd.md                 # Full product requirements + design system
│
└── src/main/
    ├── java/com/example/maintenance/
    │   │
    │   ├── MaintenceAppApplication.java        # Entry point — @SpringBootApplication
    │   │
    │   ├── config/
    │   │   └── WebConfig.java                  # CORS — allows localhost:3000 and :5173
    │   │
    │   ├── model/                              # Plain Java classes, no JPA
    │   │   ├── Enums
    │   │   │   ├── Role.java                   # TENANT | STAFF | ADMIN
    │   │   │   ├── Status.java                 # PENDING | ASSIGNED | IN_PROGRESS | COMPLETED | ARCHIVED
    │   │   │   ├── Priority.java               # LOW | MEDIUM | HIGH | URGENT
    │   │   │   ├── Category.java               # PLUMBING | ELECTRICAL | HVAC | APPLIANCE | STRUCTURAL | PEST_CONTROL | OTHER
    │   │   │   ├── LocationInUnit.java          # KITCHEN | BATHROOM | BEDROOM | LIVING_ROOM | HALLWAY | EXTERIOR | OTHER
    │   │   │   └── PreferredTime.java           # ANY_TIME | MORNING | AFTERNOON | EVENING
    │   │   │
    │   │   ├── Entities
    │   │   │   ├── User.java                   # id, name, email, password, role + tenant/staff fields
    │   │   │   ├── MaintenanceRequest.java      # requestId, tenantId, category, priority, status, etc.
    │   │   │   ├── RequestNote.java             # noteId, requestId, authorId, noteText, createdAt
    │   │   │   └── Notification.java            # notificationId, userId, requestId, message, readStatus
    │   │   │
    │   │   └── DTOs
    │   │       ├── UserResponse.java            # User without password field; only role-relevant fields
    │   │       ├── LoginRequest.java            # { email, password }
    │   │       ├── LoginResponse.java           # { UserResponse user, String token }
    │   │       ├── AnalyticsResponse.java       # totalOpen, urgentCount, avgResolutionDays, etc.
    │   │       └── TechnicianWorkload.java      # { UserResponse technician, long activeRequestCount }
    │   │
    │   ├── repository/                         # In-memory ArrayList storage + seed data
    │   │   ├── UserRepository.java             # Holds List<User>; seeds 3 demo users
    │   │   ├── MaintenanceRequestRepository.java  # Holds List<MaintenanceRequest>; seeds 3 demo requests
    │   │   ├── RequestNoteRepository.java       # Holds List<RequestNote>; seeds 2 demo notes
    │   │   └── NotificationRepository.java     # Holds List<Notification>; seeds 3 demo notifications
    │   │
    │   ├── service/                            # Business logic layer
    │   │   ├── AuthService.java                # login(email, password), register(user)
    │   │   ├── UserService.java                # getAll, getById, getByRole, save
    │   │   ├── MaintenanceRequestService.java  # submit, assignStaff, updateStatus, updatePriority, reopen
    │   │   ├── RequestNoteService.java         # getByRequest, addNote
    │   │   └── NotificationService.java        # create, getByUser, markRead, markAllRead
    │   │
    │   └── controller/                         # HTTP layer — maps URLs to service calls
    │       ├── AuthController.java             # POST /api/auth/login, /api/auth/signup
    │       ├── UserController.java             # GET/POST /api/users
    │       ├── MaintenanceRequestController.java  # GET/POST /api/requests/**
    │       ├── RequestNoteController.java       # GET/POST /api/requests/{id}/notes
    │       ├── NotificationController.java      # GET/POST /api/notifications/**
    │       ├── AdminController.java             # GET /api/admin/analytics, /api/admin/technicians
    │       ├── GlobalExceptionHandler.java      # Catches RuntimeException → 400 response
    │       └── TestController.java             # GET /api/test — sanity check endpoint
    │
    └── resources/
        ├── application.properties              # Only sets spring.application.name
        └── static/                             # Served at http://localhost:8080/
            ├── index.html                      # Login / Sign Up page
            ├── tenant.html                     # Tenant dashboard
            ├── staff.html                      # Staff dashboard
            ├── admin.html                      # Admin dashboard
            ├── css/
            │   └── styles.css                  # Shared design system (CSS variables, layout, components)
            └── js/
                └── api.js                      # Shared JS — auth helpers, fetch wrapper, API calls
```

---

## Architecture

```
Browser (HTML/CSS/JS)
    ↕  fetch() calls to /api/**
Controller  (receives HTTP request, calls service, returns JSON)
    ↕
Service     (business logic — validation, workflows, auto-notifications)
    ↕
Repository  (ArrayList storage — no database yet)
```

**Request flows through layers in one direction.** Controllers never touch repositories directly — always through a service.

---

## Backend Layer Guide

### model/
Pure data. No Spring annotations, no logic. Split into three groups:

- **Enums** — the fixed value sets used throughout (Role, Status, Priority, etc.)
- **Entities** — the main data objects that get stored (User, MaintenanceRequest, RequestNote, Notification)
- **DTOs** — shapes used only for API input/output (LoginRequest, LoginResponse, UserResponse, AnalyticsResponse)

`UserResponse` is important: it's what gets returned instead of `User` so the password field is never sent to the browser.

### repository/
Each repository is a `@Repository` Spring component that owns a `List<T>` and an `AtomicLong` ID counter. All four follow the same pattern:

- **Constructor** — seeds demo data
- **findAll / findById / findBy*** — read operations, return `Optional` or `List`
- **save(entity)** — if `id == null` → assign new ID and add; if id exists → find-and-replace

Data is lost on restart (no database). This is intentional for the prototype phase.

### service/
Each service is a `@Service` Spring component injected with its repository (and sometimes other services). This is where all business rules live:

- `AuthService` — checks email uniqueness on register; matches plain-text password on login
- `MaintenanceRequestService` — auto-sets `status=PENDING` and `dateSubmitted=now()` on submit; auto-fires a `Notification` whenever a request is assigned or its status changes; `reopen()` clones a completed request as a new PENDING with `parentRequestId` pointing back to the original
- `NotificationService` — depended on by `MaintenanceRequestService` to auto-create notifications

### controller/
Each controller is a `@RestController` that maps HTTP endpoints to service calls. Controllers contain no logic — they validate the path/params exist, call the service, and return `ResponseEntity`.

`GlobalExceptionHandler` catches any `RuntimeException` thrown by a service and returns it as a `400 Bad Request` with the message as the body. This keeps error handling out of individual controllers.

---

## Frontend Layer Guide

### How pages work
There is no React or framework — just three HTML files served statically. Each page is a **single-page app** built with vanilla JavaScript:

- On load: check `localStorage` for `ac_user` and `ac_token` — redirect to `/` if missing
- Views are `<div>` blocks; `showView(name)` hides all others and shows the target one
- All API calls go through `api.js` using `fetch()`

### js/api.js
The shared utility file. Import it with `<script src="/js/api.js"></script>`.

Key pieces:
- `getUser()` / `getToken()` — read from `localStorage`
- `requireAuth(role)` — redirects to `/` if not logged in or wrong role
- `apiFetch(path, options)` — wrapper around `fetch` that prepends `/api`, sets JSON headers, and throws on non-OK responses
- Helper functions: `fmtReqId(id)` formats `1` → `REQ-1001`, `statusBadge(status)` returns an HTML badge string, `priorityLabel(priority)` returns colored text

### css/styles.css
All CSS variables are defined at the top in `:root`. To change a color across the whole app, change it there. Key design tokens:

```css
--color-primary:   #2452C9   /* sidebar background */
--color-accent:    #4169F5   /* buttons, active states */
--color-background: #F3F4F6  /* page background */
```

---

## API Reference

### Auth
| Method | URL | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/login` | `{email, password}` | `{user, token}` |
| POST | `/api/auth/signup` | `{name, email, password, role}` | `UserResponse` |

### Requests
| Method | URL | Notes |
|---|---|---|
| GET | `/api/requests` | All requests (admin) |
| GET | `/api/requests/{id}` | Single request |
| GET | `/api/requests/tenant/{id}` | Tenant's requests |
| GET | `/api/requests/staff/{id}` | Staff's assigned requests |
| POST | `/api/requests` | Submit new request |
| POST | `/api/requests/{id}/status?status=` | Update status |
| POST | `/api/requests/{id}/assign?staffId=` | Assign technician |
| POST | `/api/requests/{id}/priority?priority=` | Update priority |
| POST | `/api/requests/{id}/reopen` | Reopen completed request |

### Notes
| Method | URL |
|---|---|
| GET | `/api/requests/{id}/notes` |
| POST | `/api/requests/{id}/notes` |

### Notifications
| Method | URL |
|---|---|
| GET | `/api/notifications/user/{userId}` |
| POST | `/api/notifications/{id}/read` |
| POST | `/api/notifications/read-all/{userId}` |

### Admin
| Method | URL | Returns |
|---|---|---|
| GET | `/api/admin/analytics` | `AnalyticsResponse` |
| GET | `/api/admin/technicians` | `List<TechnicianWorkload>` |

---

## Request Lifecycle

```
Tenant submits → PENDING
Admin assigns staff → ASSIGNED   (notification sent to tenant + staff)
Staff starts work  → IN_PROGRESS (notification sent to tenant)
Staff completes    → COMPLETED   (notification sent to tenant)
After 30 days      → ARCHIVED
Tenant reopens     → new PENDING (linked via parentRequestId)
```

---

## What's Not Built Yet

| Feature | Notes |
|---|---|
| Database | Replace `ArrayList` repositories with JPA + MySQL |
| Real auth | Replace mock token with JWT (add `spring-boot-starter-security`) |
| Password hashing | Add BCrypt once security is wired |
| Photo upload | `photoUrl` field exists; needs a `POST /api/requests/{id}/photo` endpoint |
| Email notifications | In-app only for now |
| Pagination | All list endpoints return everything |
