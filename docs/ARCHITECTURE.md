# 🌾 AgriTech360 — System Architecture & Technical Specifications

## 1. System Overview

AgriTech360 is an enterprise-grade Smart Agriculture Advisory and Analytics Platform designed specifically for Indian smallholder farmers, agronomists, and cooperative societies. The system bridges agronomic science with real-time agro-meteorology and Machine Learning to provide data-backed agricultural intelligence.

```
                      ┌───────────────────────────────────────┐
                      │    Client Layer: React 19 Frontend    │
                      │  (TypeScript, Tailwind CSS, Lucide)   │
                      │         Port: 5173 / Port 80          │
                      └──────────────────┬────────────────────┘
                                         │
                                   HTTP / REST
                                (JSON Payloads)
                                         │
                                         ▼
                      ┌───────────────────────────────────────┐
                      │   Gateway / Core API: Node.js/Express │
                      │      TypeScript, JWT Auth, Helmet     │
                      │               Port: 5000              │
                      └──────────────┬─────────────────┬──────┘
                                     │                 │
              Internal REST (Inference)                │ Mongoose ODM
                                     │                 │ (Connection Pooling)
                                     ▼                 ▼
          ┌──────────────────────────────────┐   ┌──────────────────────────────┐
          │  ML Microservice: Python FastAPI │   │  Database: MongoDB Atlas     │
          │ Scikit-Learn 22-Class RF Engine  │   │  (Users, Farms, Mandi,       │
          │           Port: 8000             │   │   Government Schemes)        │
          └──────────────────────────────────┘   └──────────────────────────────┘
```

---

## 2. Component Architecture

### A. Frontend Layer (`src/`)
- **Framework**: React 19 with TypeScript 5.7+
- **Styling**: Tailwind CSS with custom earthy, accessible agrarian palette (WCAG 2.1 AA certified)
- **State & Data Fetching**: TanStack React Query v5 for server-side cache management, React Context for session authentication and notifications
- **Network Client**: Axios with automatic request interception, JWT token attachment, and unified error mapping
- **Resilience**: Configurable Dual-Mode (`VITE_USE_MOCK_DATA=true/false`) allowing full offline demonstrations even in network-constrained field environments

### B. Core REST API Backend (`server/`)
- **Runtime**: Node.js v20+ with Express 4.21
- **Language**: TypeScript 5.7+ compiled strictly without emit errors
- **Security & Hardening**: Helmet security headers, CORS origin validation, bcryptjs password hashing, JSON Web Tokens (7-day validity)
- **API Documentation**: Interactive Swagger UI at `/api/v1/docs` and OpenAPI JSON at `/api/v1/docs.json`
- **Fault-Tolerant Database Startup**: Automated DNS nameserver reconfiguration for MongoDB Atlas SRV resolution (`8.8.8.8`) with seamless degraded offline mode if network or IP whitelist restrictions occur

### C. Machine Learning Engine (`ml-service/`)
- **Runtime**: Python 3.12 with FastAPI
- **Model**: Scikit-Learn `RandomForestClassifier` (100 estimators, stratified 80/20 train/test split, evaluated at **99.55% test accuracy**)
- **Target Classes**: 22 crops (Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas, Mothbeans, Mungbean, Blackgram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee)
- **Input Parameters**: Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, pH, Rainfall
- **Agronomic Enrichment**: Enriched with Indian Council of Agricultural Research (ICAR) benchmarks for expected yield, cost of cultivation, net profit per acre, and split fertilizer application schedules

---

## 3. Data Flow & Sequence

### Crop Recommendation Flow
```
Farmer Enters Soil Parameters (N, P, K, pH, Moisture)
                    │
                    ▼
          React Frontend Form
                    │
                    │ POST /api/v1/crops/recommend
                    ▼
          Express Server (Port 5000)
          - Validates parameter boundaries
          - Normalizes parameter aliases (e.g. moisture -> humidity)
                    │
                    │ POST http://127.0.0.1:8000/predict
                    ▼
          Python FastAPI Engine (Port 8000)
          - Loads Random Forest artifact
          - Generates class prediction & probability confidence
          - Attaches ICAR crop profile & fertilizer schedules
                    │
                    │ 200 OK (Enriched Recommendation JSON)
                    ▼
          Express Server forwards response to Client
                    │
                    ▼
          Frontend renders interactive cards with yield, profit, and risk
```

---

## 4. API Endpoints Catalog

| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `GET` | `/api/v1/health` | Service health, memory telemetry, and database connectivity status | No |
| `GET` | `/api/v1/` | API Discovery root catalog | No |
| `POST` | `/api/v1/auth/register` | Register new farmer account | No |
| `POST` | `/api/v1/auth/login` | Authenticate farmer and obtain JWT token | No |
| `GET` | `/api/v1/user/profile` | Retrieve authenticated farmer details and farm parcels | Yes |
| `PUT` | `/api/v1/user/profile` | Update profile attributes and soil properties | Yes |
| `GET` | `/api/v1/dashboard/metrics`| Consolidated farm metrics (Land, Active Crops, Risk, Turnover) | Optional |
| `GET` | `/api/v1/weather` | Agro-meteorological conditions, 24h & 7d forecast, spray rating | No |
| `GET` | `/api/v1/mandi` | APMC commodity market rates, search, and category filters | No |
| `POST`| `/api/v1/mandi/calculate-revenue` | Estimate gross revenue based on modal prices vs MSP floor | No |
| `GET` | `/api/v1/schemes` | Catalog of Central & State government agricultural subsidies | No |
| `POST`| `/api/v1/schemes/:id/check-eligibility` | Evaluate farmer qualification based on land holding & state | Yes |
| `POST`| `/api/v1/schemes/:id/bookmark` | Save scheme to farmer profile | Yes |
| `GET` | `/api/v1/farms` | List registered field parcels | Yes |
| `POST`| `/api/v1/farms` | Register new field parcel with crop and irrigation records | Yes |
| `POST`| `/api/v1/crops/recommend` | ML inference bridge for data-driven crop recommendations | Optional |
| `GET` | `/api/v1/alerts` | Real-time agro-climate advisories, price alerts, and system notifications | Optional |

---

## 5. Security & Reliability Architecture

1. **Fail-Fast & Non-Blocking Design**: If external dependencies (OpenWeatherMap or MongoDB Atlas) are temporarily offline, the server runs in safe fallback mode without crashing or terminating user sessions.
2. **Provenance Transparency**: Every alert returned by `/api/v1/alerts` explicitly declares its `sourceType` (`live_telemetry`, `simulated_fallback`, or `official_advisory`).
3. **Containerized Portability**: Dedicated Dockerfiles and a root `docker-compose.yml` enable standardized deployments on Linux, Windows, macOS, or cloud VMs.
