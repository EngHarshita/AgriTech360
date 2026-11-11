# AgriTech360 — Admin Panel Implementation & Audit Report

**Date:** October 30, 2026  
**Auditor / Architect:** Senior Full-Stack & Application Security Engineer  
**Status:** Implemented, Tested, Hardened & Verified  
**Stack:** React 19, TypeScript, Vite, Express 4, Node.js, MongoDB / Mongoose

---

## 1. Executive Summary

This document details the audit, architecture, security hardening, and complete implementation of the **AgriTech360 Admin Governance & Control Panel** (`/admin/dashboard`). The implementation seamlessly integrates with the existing Farmer Panel (`/farmer/dashboard`) and Buyer Client Panel (`/client/dashboard`) without duplicating user models, bypassing authentication middleware, or creating secondary databases.

---

## 2. Root Cause Analysis of "Admin Panel Not Working"

Prior to this phase, our investigation uncovered five distinct issues preventing the Admin Panel from operating securely and reliably:

1. **Missing Dedicated Admin Route and Views in Router:**  
   The application router in `src/App.tsx` did not define an `/admin/dashboard` route or an `AdminPanel` module. Non-farmer/non-buyer users were directed either to the farmer dashboard or to a 404 page.
2. **Missing Admin Backend Controller & Routes:**  
   While `UserRole` included `'admin'` and `auth.ts` supported `authorizeRoles('admin')`, there were no backend routes mounted under `/api/v1/admin` to serve aggregated telemetry, paginated user management, audit trails, or subsystem health.
3. **Absence of User Status and Suspension Lifecycle:**  
   The `User` schema in both frontend and backend lacked an account status (`'active' | 'suspended'`). There was no mechanism to suspend malicious actors or disallow suspended accounts from logging into the system.
4. **Offline Database Handling in Local Development:**  
   When MongoDB was not running locally at `127.0.0.1:27017`, the admin provisioning script crashed without descriptive diagnostics, and client-side demo flows lacked an explicitly labeled Administrator profile to demonstrate the dashboard without a live database.
5. **Incompatible Role Route Redirection in Login:**  
   `LoginPage.tsx` blindly navigated users to previously attempted `location.state.from` paths without validating whether the user's role possessed permission for that route, causing role confusion loops.

---

## 3. Architecture & Security Implementation

### 3.1. Authentication & Role Enforcement
- **No Public Admin Registration:**  
  Public registration via `POST /api/v1/auth/register` strictly rejects any payload attempting to set `role: 'admin'` with HTTP 400 Bad Request (`"Admin registration is not allowed"`).
- **Backend Role Guarding:**  
  All administrative endpoints are protected with `authenticateJWT` and `authorizeRoles('admin')`. Attempts by unauthenticated users return `HTTP 401 Unauthorized`; attempts by farmers or buyers return `HTTP 403 Forbidden`.
- **Frontend Role Protection:**  
  The route `/admin/dashboard` is wrapped in `<ProtectedRoute allowedRole="admin">`. Farmers and buyers attempting direct URL navigation are redirected to `/unauthorized` with contextual recovery options to return to their appropriate dashboard (`/farmer/dashboard` or `/client/dashboard`).
- **Account Suspension Enforcement:**  
  Suspended accounts cannot log in via `authService.login` (rejected with `HTTP 403: Your account has been suspended by an administrator`).

### 3.2. Secure Admin Account Provisioning (No Hardcoded Credentials)
- Implemented `server/src/scripts/seedAdmin.ts` executed via `npm run seed:admin`.
- Configuration is provided strictly via environment variables or CLI arguments:
  ```bash
  # Option A: With environment variables
  ADMIN_EMAIL=admin@agritech360.internal ADMIN_PASSWORD=StrongPassword123! npm run seed:admin

  # Option B: With CLI parameters
  npx tsx src/scripts/seedAdmin.ts --email admin@agritech360.internal --password StrongPassword123!
  ```
- If no password is provided, a cryptographically secure 16-character random password is generated and printed once to stdout. No hardcoded default credentials exist anywhere in source code.
- Clear diagnostics are printed if MongoDB is offline, instructing the operator on required database connectivity.

### 3.3. Self-Lockout Prevention & Audit Logging
- **Self-Lockout Prevention:**  
  In `server/src/services/adminService.ts`, an administrator attempting to suspend their own account ID is rejected with `HTTP 400: Administrators cannot suspend their own account to prevent accidental lockout`. In the UI, the suspend button is disabled for the currently logged-in administrator.
- **Audit Logging Model (`AuditLog`):**  
  Every administrative status modification (`USER_SUSPENDED`, `USER_RESTORED`) is recorded with timestamp, acting administrator ID & email, target user ID & email, previous & new status, reason, and IP address. Persisted to MongoDB `auditlogs` collection with an in-memory ring-buffer fallback if the database connection is degraded.
- **Zero Credential Exposure:**  
  Passwords, password hashes, salt rounds, and JWT secrets are excluded from all administrative DTOs, API responses, and client models (`ISafeUser` via `.toSafeObject()`).

---

## 4. Admin Dashboard Features (`/admin/dashboard`)

The Admin Governance Panel features 5 tabbed modules built with an agricultural emerald/slate theme:

1. **System Overview:**
   - Real-time aggregate metric counters: Total Users, Total Farmers, Total Buyers, Active vs Suspended Accounts.
   - Farm land aggregates: Total registered farm parcels, active cultivation parcels, and total agricultural acres across all farmers.
   - Live APMC Mandi price records and Government Schemes active in catalog.
   - Database connection state and Node.js runtime telemetry (process memory, uptime, platform).
2. **User Management:**
   - Server-side paginated user search across name, email, phone, district, and business name.
   - Filter by role (`All`, `Farmer`, `Buyer`, `Admin`) and status (`All`, `Active`, `Suspended`).
   - Interactive modal to suspend or restore accounts with mandatory/optional audit reason.
   - Self-lockout protection visually and functionally enforced.
3. **Fields & Moderation:**
   - Inspection of all agricultural land parcels registered across farmers.
   - Filter by status (`Active Cultivation`, `Fallow Land`, `Sowing Prep`, `Harvested`).
   - Detailed soil type, irrigation system, acreage, and location attributes.
4. **Subsystem Health & Telemetry:**
   - Node.js runtime statistics, process ID, memory RSS / heap allocations.
   - Real-time database connectivity status (host, database name, connection state).
   - Microservice health monitoring (Weather Station, Mandi Aggregator, Crop ML Engine).
5. **Audit Trail:**
   - Chronological log of administrative actions with IP addresses, timestamps, actor emails, and change diffs.

---

## 5. Offline Demo Mode Support

For presentation and local evaluation without a running MongoDB service:
- Set `VITE_USE_MOCK_DATA=true` and `VITE_DEMO_MODE=true` in `.env`.
- On `LoginPage.tsx`, a 1-click **Admin Demo** button signs in as `Devraj Chauhan` (`admin@agritech360.internal`).
- The Admin Dashboard renders a prominent **DEMO SANDBOX** banner explaining that data changes are held in-memory and will not persist to a live database.
- Mock tokens (`agritech_mock_session`) are segregated from live JWT tokens (`agritech_auth_token`), ensuring mock sessions are never accepted by the live Express backend.

---

## 6. Verification and Test Results

All quality and security checks were executed and passed cleanly:

| Check | Command | Result |
| :--- | :--- | :--- |
| **Server TypeScript Typecheck** | `npm --prefix server run typecheck` | **PASS (0 errors)** |
| **Backend Test Suite (38 tests)** | `npm run test:server` | **PASS (38 passed, 0 failed)** |
| **Frontend Linter** | `npm run lint` | **PASS (0 errors, 10 info warnings)** |
| **Frontend Production Build** | `npm run build` | **PASS (0 errors, dist generated)** |
| **Server Production Build** | `npm run server:build` | **PASS (0 errors, dist generated)** |

### Summary of Automated Test Scenarios (in `server/src/tests/auth.test.ts`):
- **Scenario 9:** Attempted public admin registration is strictly rejected (HTTP 400).
- **Scenario 18:** Unauthenticated access to `/api/v1/admin/overview` rejected with HTTP 401.
- **Scenario 19:** Farmer and Buyer roles receive HTTP 403 Forbidden on admin endpoints.
- **Scenario 20:** Admin token successfully retrieves live `/api/v1/admin/overview` telemetry.
- **Scenario 21:** Admin token successfully retrieves `/api/v1/admin/health` subsystem statuses.
- **Scenario 22:** Admin queries paginated users with regex filter and role sorting.
- **Scenario 23:** Self-lockout prevention rejects admin suspending own account with HTTP 400.
- **Scenario 24:** Non-admin attempting to patch user status returns HTTP 403.
- **Scenario 25:** Audit logs endpoint returns chronological audit records.

---

## 7. How to Run Locally

### With Live MongoDB:
1. Ensure MongoDB is running on `127.0.0.1:27017` (or configure `MONGODB_URI` in `server/.env`).
2. Provision the initial administrator:
   ```bash
   ADMIN_EMAIL=admin@agritech360.internal ADMIN_PASSWORD=YourSecurePassword123! npm run seed:admin
   ```
3. Start the application:
   ```bash
   npm run dev:all
   ```
4. Navigate to `http://localhost:5173/login` and log in with your provisioned credentials.

### In Demo Mode (Without MongoDB):
1. In `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_USE_MOCK_DATA=true
   VITE_DEMO_MODE=true
   ```
2. Run `npm run dev`.
3. Open `http://localhost:5173/login`, click the **Admin** 1-click pill, and test the Admin Governance Panel immediately.
