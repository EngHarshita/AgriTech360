# 🌾 AgriTech360 — AI-Powered Smart Agriculture Platform

> **Final Year B.Tech Capstone Project**  
> **Domain**: Artificial Intelligence, Smart Agriculture, and Fullstack Web Systems  
> **Team**: Harshita (Frontend Lead) • Divyanshi (Backend Lead) • Khushi (Database & Testing) • Pragati (ML & Research)
> https://agritech360.vercel.app/

---

## 📌 Project Overview

**AgriTech360** is an enterprise-grade agricultural advisory and farm analytics platform designed specifically for Indian farmers. The platform combines:

1. **AI/ML Crop Recommendation System**: Random Forest Classifier evaluating 7 soil and agro-climate parameters across 22 crops with **99.55% accuracy** and full ICAR agronomic enrichment.
2. **Weather Intelligence & Spray Suitability Index**: Micro-level temperature, humidity, rainfall probability, and agrochemical spray timing advisories.
3. **Mandi Price Monitoring & MSP Calculator**: Real-time APMC mandi rates across India, category filtering, MSP comparison, and harvest revenue estimators.
4. **Government Schemes Discovery**: Searchable catalog of 26 central and state agricultural subsidies with an automated eligibility checker.
5. **Farm & Field Parcel Management**: Digital parcel records, soil classifications, and Kisan Credit Card tracking.
6. **Farm Alerts & Advisories**: Real-time notifications with full data provenance tracking (`live_telemetry`, `simulated_fallback`, `official_advisory`).

---

## 🛠 Tech Stack

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, TanStack React Query v5, Lucide Icons | Responsive agrarian UI (WCAG 2.1 AA certified) |
| **Backend REST API** | Node.js v20+, Express 4.x, TypeScript 5.7+, Mongoose ODM, Helmet, Swagger OpenAPI | Core business logic, JWT authentication, and ML proxy |
| **ML Microservice** | Python 3.12, FastAPI, Scikit-Learn, Joblib, Pydantic v2 | 22-class Random Forest model and ICAR agronomic database |
| **Database** | MongoDB Atlas (Cloud) / MongoDB (Docker local) | Farmer profiles, field parcels, mandi prices, and schemes |
| **DevOps / Containers** | Docker, Docker Compose, Concurrently, Nginx | Standardized multi-container orchestration |

---

## 📂 Project Structure

```bash
AgriTech360/
├── src/                     # React 19 frontend application
│   ├── api/                 # Axios client, React Query hooks, and API adapters
│   ├── components/          # Common UI, layouts, and feature module views
│   ├── context/             # AuthContext, AgriContext (alerts), ToastContext
│   ├── data/                # Localized agricultural benchmarks and fallback datasets
│   └── types/               # TypeScript domain interfaces
├── server/                  # Node.js Express REST API backend
│   ├── src/
│   │   ├── config/          # Environment variables, database, and Swagger config
│   │   ├── controllers/     # Request handlers (auth, user, crops, weather, mandi, schemes, alerts)
│   │   ├── middleware/      # JWT auth, error handler, and request logging
│   │   ├── models/          # Mongoose schemas (User, FarmParcel, MandiPrice, Scheme)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic and external service adapters
│   │   └── tests/           # Automated API regression test suite
│   ├── Dockerfile           # Multi-stage production container
│   └── package.json
├── ml-service/              # Python FastAPI Machine Learning microservice
│   ├── data/                # Crop_recommendation.csv (2,200 samples)
│   ├── models/              # Serialized Random Forest model & training metadata
│   ├── src/
│   │   ├── crop_data.py     # ICAR agronomic profiles for all 22 crop classes
│   │   ├── main.py          # FastAPI server with /health and /predict endpoints
│   │   └── train.py         # Automated model training pipeline
│   ├── test_ml_service.py   # Automated Python unit & inference test suite
│   ├── Dockerfile           # Python 3.12 slim container
│   └── requirements.txt     # Pinned Python dependencies
├── scripts/                 # Cross-platform runner and verification scripts
│   ├── start_ml.cjs         # Cross-platform Python/uvicorn runner
│   └── verify_system.cjs    # Live integration health test
├── docs/                    # Complete Capstone Documentation
│   ├── ARCHITECTURE.md      # Detailed system architecture and data flows
│   ├── SRS_CAPSTONE_REPORT.md # Software Requirements Specification & Final Report
│   ├── VIVA_PRESENTATION.md # 19-slide structured Viva defense deck
│   └── DEMO_WALKTHROUGH_SCRIPT.md # Step-by-step practical presentation script
├── docker-compose.yml       # Multi-service container orchestration
└── package.json             # Root workspace scripts and developer tools
```

---

## 🚀 Quick Start (One-Command Startup)

### 1. Prerequisites
- **Node.js**: v20 or higher
- **Python**: 3.12 installed
- **Git**

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/EngHarshita/AgriTech360.git
cd AgriTech360

# Install frontend dependencies
npm install

# Install backend dependencies
npm --prefix server install

# Set up Python ML virtual environment
cd ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 3. Launch All 3 Services (One Command)
Run the root startup script:
```powershell
npm run dev:all
```
This automatically launches all three services simultaneously via `concurrently`:
- 🌐 **Frontend**: `http://localhost:5173`
- ⚙️ **Node.js Backend**: `http://localhost:5000`
- 🧠 **Python ML Service**: `http://127.0.0.1:8000`
- 📖 **Interactive Swagger Docs**: `http://localhost:5000/api/v1/docs`

---

## 🧪 Automated Testing

AgriTech360 includes end-to-end regression test suites covering both the Node.js API and the Python ML service.

Run all tests in one command:
```powershell
npm test
```

Or run individual test suites:
```powershell
# Run backend API tests (health, auth, crops, weather, alerts)
npm run test:server

# Run Python ML service tests (model loading, inference, parameter bounds)
npm run test:ml

# Verify TypeScript type safety
npm --prefix server run typecheck
npm run build
```

---

## 🐳 Docker Deployment

To launch the complete containerized stack using Docker Compose:

```powershell
docker compose up --build
```

Services started:
- `agritech360-frontend`: `http://localhost:80` (or `http://localhost:5173`)
- `agritech360-backend`: `http://localhost:5000`
- `agritech360-ml-engine`: `http://localhost:8000`

To also run a local MongoDB database container instead of Atlas:
```powershell
docker compose --profile local-db up --build
```

---

## 🗄 Database Configuration & Atlas IP Whitelist

The backend connects to MongoDB Atlas using the URI configured in `server/.env`.

### If You Encounter IP Whitelist Restrictions:
1. Log into your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. In the left navigation, click **Network Access**.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere (`0.0.0.0/0`)** for development, or add your current IP address.
5. Click **Confirm**.

### Running Database Seed Scripts:
Once your IP address is whitelisted in Atlas, run:
```powershell
npm --prefix server run seed:mandi
npm --prefix server run seed:schemes
```
> **Note**: Even if MongoDB Atlas is temporarily unreachable, AgriTech360 automatically operates in **Resilient Degraded Mode** with zero crashes, serving cached or fallback data.

---

## 📚 Capstone Documentation

- 📐 [System Architecture Documentation](file:///c:/Users/divya/Downloads/AgriTech360-Fresh/docs/ARCHITECTURE.md)
- 📋 [SRS & Capstone Project Report](file:///c:/Users/divya/Downloads/AgriTech360-Fresh/docs/SRS_CAPSTONE_REPORT.md)
- 🎯 [Viva Presentation Slides (19 Slides)](file:///c:/Users/divya/Downloads/AgriTech360-Fresh/docs/VIVA_PRESENTATION.md)
- 🎬 [Demo Walkthrough Script](file:///c:/Users/divya/Downloads/AgriTech360-Fresh/docs/DEMO_WALKTHROUGH_SCRIPT.md)

---

## 👥 Authors & Academic Credits

- **Harshita**: Frontend Architecture & UI/UX Design Lead
- **Divyanshi**: Backend REST APIs, Resilience, & Microservices Lead
- **Khushi**: Database Modeling, Testing, & Quality Assurance
- **Pragati**: Machine Learning Models & Agronomic Research

*Academic Session 2026–2027 • B.Tech Capstone Project*
