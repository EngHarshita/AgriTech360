# AgriTech360 — Phase 3 Implementation Plan: Farmer User Panel

## 1. Architectural Baseline

### 1.1 Existing System State
- **Frontend**: Vite + React 19 + TypeScript, Tailwind CSS, TanStack React Query, React Router DOM.
- **Backend**: Node.js + Express 4 + TypeScript (`server/`), JWT-based authentication, Helmet, CORS, custom ApiError handling.
- **Database**: MongoDB (Mongoose 8). Offline-resilient fallback handlers in place for Mandi prices and Government schemes.
- **AI/ML Microservice**: Python FastAPI service on port 8000 (Random Forest model predicting optimal crop from N-P-K, temperature, humidity, pH, rainfall).
- **Authentication**: Role-based access control with `farmer` and `buyer` personas. Public admin registration strictly blocked.

### 1.2 Endpoint & Contract Verification
| Service Component | Endpoint | Method | Backend Schema / Type | Frontend Usage |
|---|---|---|---|---|
| **Session Profile** | `/api/v1/auth/me` | `GET` | Decoded JWT -> `ISafeUser` | `AuthContext` on mount / refresh |
| **Farmer Profile** | `/api/v1/user/profile` | `GET`, `PUT` | `UpdateProfileDto` | `ProfileView`, `agriService.updateUserProfile` |
| **Farm Parcels** | `/api/v1/farms` | `GET`, `POST` | `CreateFarmParcelDto` | `agriService.getFarmParcels`, `createFarmParcel` |
| **Single Parcel** | `/api/v1/farms/:id` | `GET`, `PUT`, `DELETE`| `UpdateFarmParcelDto` | `agriService.updateFarmParcel`, `deleteFarmParcel` |
| **Crop Recommendation** | `/api/v1/crops/recommend` | `POST` | `CropRecommendationInput` (`N, P, K, temp, humidity, ph, rainfall`) | `CropRecommendationView`, `agriService.getCropRecommendations` |
| **Weather Feed** | `/api/v1/weather` | `GET` | Location query -> `WeatherIntelligence` | `WeatherView`, `DashboardView` |
| **Mandi APMC** | `/api/v1/mandi` | `GET` | Category & search filters -> `MandiPriceItem[]` | `MandiPricesView`, `DashboardView` |
| **Government Schemes** | `/api/v1/schemes` | `GET` | Category filter -> `GovernmentScheme[]` | `SchemesView`, `DashboardView` |
| **Farm Alerts** | `/api/v1/alerts` | `GET` | District query -> `FarmAlert[]` | `DashboardView` |

---

## 2. Confirmed Gaps & Planned Enhancements

1. **Dedicated Farm & Field Management Module (`FarmManagementView.tsx`)**:
   - While backend CRUD (`GET`, `POST`, `PUT`, `DELETE /api/v1/farms`) is implemented, the frontend lacked a dedicated interactive management view for viewing parcels, registering new fields with real acres/soil/irrigation, updating current crop, and deleting with confirmation.
2. **Farmer Dashboard Landing (`DashboardView.tsx`)**:
   - Must show authenticated farmer's name, registered village/district, real summary of farm fields (total acres, active parcels), live weather, Mandi updates with source & timestamp, government schemes, and actionable alerts.
   - Must avoid fabricated live numbers. In demo mode, clearly display the DEMO badge.
3. **Crop Recommendation Integration (`CropRecommendationView.tsx`)**:
   - Connect frontend form directly to `POST /api/v1/crops/recommend`.
   - Autofill option using the farmer's registered soil and district values when available.
   - Robust error handling for ML service unavailability (HTTP 503/504) with clear user feedback.
4. **Security & Ownership Enforcement**:
   - Verify all farm queries derive `farmerId` strictly from verified JWT tokens on the server.
   - Reject buyer access with HTTP 403.
   - In live mode, fail gracefully on DB disconnection without masking write failures.
5. **Rate Limiting & Production CORS**:
   - Add rate limiting on `/api/v1/auth/` and production CORS configuration.

---

## 3. Implementation Summary & Verified Results

### 3.1 Implemented Features
1. **Farmer Landing Dashboard (`DashboardView.tsx`)**:
   - Displays authenticated farmer's verified name and location (`district, state`).
   - Real summary of registered farm parcels (total acreage, active crops under cultivation).
   - Live weather intelligence integration with station coordinates and spray advisories.
   - APMC Mandi wholesale price tracker with clear source attribution and last-updated timestamp.
   - Actionable farm alerts and active DBT government schemes.
   - Working shortcuts to all primary farmer features.
   - Distinct `DEMO` badges when running in mock mode to avoid confusing sample data with live telemetry.

2. **Farm & Field Management Module (`FarmManagementView.tsx`)**:
   - Full CRUD support connected to `/api/v1/farms`.
   - Aggregate statistics: Total Acreage, Actively Cultivated Acreage, ICAR Standard Status.
   - Interactive field registration & edit modals with strict validation (rejects 0 or negative acreage).
   - Delete action with confirmation modal.
   - RBAC enforcement: `farmerId` derived strictly from server-side JWT identity (`req.user.userId`).
   - Server prevents silent write failures when DB is offline by throwing HTTP 503 instead of masking writes.

3. **Crop Recommendation Integration (`CropRecommendationView.tsx`)**:
   - Connected directly to backend `POST /api/v1/crops/recommend`.
   - "Autofill from My Farm" feature pulling soil and acreage parameters from farmer profile.
   - Range validation for NPK, pH, and moisture parameters before submission.
   - Graceful fallback to ICAR regional benchmarks with advisory notice when Python ML microservice is offline (HTTP 503).
   - Agronomic advisory disclaimer explaining model limitations.

4. **Weather, Mandi & Government Schemes Polish**:
   - `WeatherView.tsx`: Observed vs. forecast separation, spray suitability index, DEMO radar indicator in mock mode.
   - `MandiPricesView.tsx`: APMC market wholesale price grid, MSP price difference badges, modal price calculator, and DEMO feed badge.
   - `SchemesView.tsx`: Central & state agricultural subsidy catalog, bookmarks, search/filter, official application portals, and clear advisory notice that eligibility is guidance, not sanction.

5. **Security Hardening**:
   - `server/src/middleware/rateLimiter.ts`: In-memory IP rate limiter on `/api/v1/auth/login` and `/api/v1/auth/register` (60 attempts per 15-minute window).
   - `server/src/app.ts`: Compliant CORS configuration supporting credentials and dynamic origin verification.
   - RBAC: Buyer tokens strictly forbidden with HTTP 403 on `/api/v1/farms` endpoints.

---

## 4. Acceptance Criteria Status

- [x] Farmer dashboard renders authenticated farmer profile, parcel counts, live weather, mandi prices, schemes, and actionable alerts.
- [x] Dedicated Farm & Field Management component supports listing, creating, editing, and deleting fields.
- [x] Deletion requires user confirmation; edits persist to backend.
- [x] Field inputs reject invalid, zero, or negative acreages on both frontend and backend.
- [x] Server verifies ownership (`farmerId: req.user.userId`) on every parcel mutation.
- [x] Buyers receive HTTP 403 on `/api/v1/farms` (POST/PUT/DELETE/GET).
- [x] Crop Recommendation submits valid parameters (`N, P, K, temperature, moisture/humidity, phLevel/ph, rainfall`) to `POST /api/v1/crops/recommend`.
- [x] ML service unavailability (HTTP 503) displays a user-friendly error state with advisory guidance.
- [x] Weather, Mandi, and Schemes modules feature loading, empty, and retry states.
- [x] All project checks pass:
  - `npm run build`: ✓ Exit code 0 (Vite production bundle built cleanly)
  - `npm run lint`: ✓ Exit code 0 (0 errors)
  - `npm --prefix server run typecheck`: ✓ Exit code 0 (tsc clean)
  - `npm run test:server`: ✓ 12/12 tests passed
  - `npx tsx --test server/src/tests/auth.test.ts`: ✓ 18/18 tests passed

