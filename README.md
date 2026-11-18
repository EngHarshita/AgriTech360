# 🌾 AgriTech360 — AI-Powered Smart Agriculture Platform

> **Enterprise Agricultural Advisory & Farm Management System**  
> **Domain**: Artificial Intelligence, Smart Agriculture, and Fullstack Web Systems  
> **Engineering Team**: Harshita (Frontend Lead) • Divyanshi (Backend Lead) • Khushi (Database & Testing) • Pragati (ML & Research)

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
├── docs/                    # Complete Platform Documentation
│   ├── ML_MODEL_AND_DATASET.md # Machine Learning concepts, Random Forest, dataset, & evaluation
│   ├── VIVA_QUESTIONS_AND_ANSWERS.md # Complete beginner-friendly viva questions & defense guide
│   ├── ARCHITECTURE.md      # Detailed system architecture and data flows
│   ├── SRS_CAPSTONE_REPORT.md # Software Requirements Specification & Technical Report
│   ├── VIVA_PRESENTATION.md # Technical presentation slide deck
│   ├── DEMO_WALKTHROUGH_SCRIPT.md # Step-by-step practical demonstration guide
│   ├── ADMIN_PANEL_IMPLEMENTATION.md # Admin governance, user management, & audit logs
│   └── PHASE_3_5_FARMER_UX.md # Farmer UX, accessibility, & bilingual workflows
├── docker-compose.yml       # Multi-service container orchestration
└── package.json             # Root workspace scripts and developer tools
```

---

## 🧠 Machine Learning Engine & Crop Recommendation Architecture

AgriTech360 deploys an ensemble **Random Forest Classifier** served via a dedicated Python FastAPI microservice. The model predicts the optimal crop variety based on 7 continuous chemical and agro-climatic parameters.

### 📊 Dataset Specifications
- **Source**: `ml-service/data/Crop_recommendation.csv`
- **Volume**: **2,200 records**, **8 columns**, **0 missing values**, **0 duplicate entries**.
- **Classes**: Exactly **22 crop classes**, balanced at **100 samples per class** across Cereals, Pulses, Fruits, Commercial/Fibre crops, and Beverages.
- **Input Features**: Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Ambient Temperature ($^{\circ}\text{C}$), Relative Humidity ($\%$), Soil pH ($0\text{--}14$), and Seasonal Rainfall ($\text{mm}$).

### 🎯 99.55% Evaluation Benchmark
Evaluated on a **Stratified 80/20 Holdout Test Split** ($N = 440$ unseen test instances):
- **Accuracy**: **99.55%** (438 out of 440 predictions correct).
- **Macro Precision**: **0.996** | **Macro Recall**: **0.995** | **Macro F1-Score**: **0.995**
- **Misclassifications**: Exactly 2 samples in the holdout split:
  1. $1\times$ `blackgram` classified as `maize` (marginal overlapping N/rainfall boundaries).
  2. $1\times$ `rice` classified as `jute` (shared high-humidity $>80\%$ and high-rainfall $>180\text{ mm}$ conditions).

### 🔍 Feature Importance Ranking (Gini Impurity Reduction)
```
1. Rainfall        ████████████████████████ 23.0%
2. Humidity        ███████████████████████  22.4%
3. Potassium (K)   ██████████████████       17.5%
4. Phosphorus (P)  ███████████████          15.1%
5. Nitrogen (N)    ██████████               9.6%
6. Temperature     ███████                  7.4%
7. Soil pH         █████                    5.0%
```
> **Key Agronomic Insight**: Moisture parameters (Rainfall + Relative Humidity) account for **45.4%** of the total decision weight, separating wetland/tropical crops from dryland/arid crops.

### 🔄 End-to-End Recommendation Workflow
```
[Farmer UI] ──(N, P, K, Temp, Humidity, pH, Rainfall)──► [Express Gateway :5000]
                                                                  │
                                                          (Sanitized Payload)
                                                                  ▼
[Enriched Result + Provenance] ◄── [ICAR Database] ◄── [FastAPI Microservice :8000]
                                                           (Random Forest Model)
```
1. **Input Collection**: Farmer inputs soil chemistry and climate parameters or selects a 1-click ICAR preset (Rice, Cotton, Chickpea, Apple, Coffee).
2. **Gateway Normalization**: Express backend validates boundaries and handles multi-casing aliases (`N/n`, `P/p`, `K/k`, `temp`, `humidity`, `ph`, `rainfall`).
3. **Model Inference**: FastAPI calls `predict_proba` on the serialized Random Forest model to compute posterior probabilities for all 22 classes.
4. **Agronomic Enrichment**: Winning crop is enriched with ICAR data: sowing windows, expected yield per acre, cultivation cost, gross revenue, net profit, and tailored split fertilizer schedules.

---

## 🐛 The Repeated Prediction Bug & Root-Cause Resolution

### The Issue
In previous versions, entering different soil values in the UI always recommended **"Wheat"**, making recommendations appear static or mocked.

### Root Causes Identified
1. **Form Omissions**: `CropRecommendationView.tsx` only gathered $N, P, K, \text{pH}$, hardcoding Temperature and Rainfall to static constants ($25^{\circ}\text{C}$ and $100\text{ mm}$). Because moisture governs 45.4% of the model's decisions, holding them constant severely constrained variance.
2. **Hardcoded Fallback Constant**: The offline client fallback in `src/api/agriService.ts` was returning a static object initialized to `"Wheat"`.
3. **Gateway Case Sensitivity**: Express expected uppercase keys (`N, P, K`). When the frontend sent lowercase keys, values defaulted to `undefined`.

### Engineering Fix Applied
- **Statistical Centroids (`src/data/cropProfiles.ts`)**: Extracted the empirical mean ($\mu$) and standard deviation ($\sigma$) for all 22 crops from `Crop_recommendation.csv`. Implemented `predictTopCropsFromDataset()` computing normalized Euclidean distances:
  $$D(C_k) = \sqrt{\sum_{i=1}^{7} \left(\frac{x_i - \mu_{k,i}}{\sigma_{k,i}}\right)^2}$$
- **Full Climate Sliders**: Added numeric inputs for Ambient Temperature ($^{\circ}\text{C}$) and Seasonal Rainfall ($\text{mm}$) to the UI.
- **Multi-Casing Validation**: Updated `server/src/services/cropService.ts` to accept uppercase, lowercase, and full names (`N`/`n`/`nitrogen`, etc.).

---

## 📈 APMC Mandi Price Monitoring & MSP Calculator

- **Data Source**: Modeled on the official **Agmarknet** portal of the **Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare** (`data.gov.in`).
- **Coverage**: **88 verified APMC mandi records** across Madhya Pradesh, Punjab, Maharashtra, Uttar Pradesh, Rajasthan, and Gujarat.
- **Metrics Tracked**: Daily Modal Price ($\text{₹/Quintal}$), Minimum/Maximum price range, price movement percentage ($\pm\%$), and official Government Minimum Support Price (MSP) benchmarks.
- **Harvest Revenue Calculator**: Farmers enter estimated harvest quantity ($Q$ Quintals) to compute projected market revenue compared directly against the government MSP safety net.

---

## 🏛️ Government Schemes & Automated Eligibility Engine

- **Catalog**: **26 comprehensive Central & State schemes** indexed at `server/src/data/seedSchemesData.ts` (e.g. PM-KISAN, PMFBY, PMKSY, Soil Health Card, SMAM 40–50% farm mechanization subsidy, Kisan Credit Card).
- **Rule-Based Eligibility Engine**: Automatically cross-references the farmer's registered profile (landholding acres, state of residence, irrigation method, soil type) against official scheme guidelines, outputting an eligibility badge (`Eligible`, `Partially Eligible`, `Ineligible`) and required documentation checklists.

---

## 🚀 Quick Start (One-Command Startup)

### 1. Prerequisites
- **Node.js**: v20 or higher
- **Python**: 3.12 installed
- **Git**

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/EnDivyanshiGupta/agritech360.git
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

## 📚 Platform Documentation

- 🧠 [Machine Learning Model, Dataset & 99.55% Evaluation Deep-Dive](./docs/ML_MODEL_AND_DATASET.md)
- 🎓 [Complete Beginner-Friendly Viva Q&A & Examiner Defense Guide](./docs/VIVA_QUESTIONS_AND_ANSWERS.md)
- 📐 [System Architecture Documentation & Decoupled Data Flows](./docs/ARCHITECTURE.md)
- 🎯 [Technical Presentation Slide Deck](./docs/VIVA_PRESENTATION.md)
- 📋 [Software Requirements & Technical Specifications](./docs/SRS_CAPSTONE_REPORT.md)
- 🎬 [Interactive Walkthrough Guide](./docs/DEMO_WALKTHROUGH_SCRIPT.md)
- 🛡️ [Administrator Governance Panel Implementation](./docs/ADMIN_PANEL_IMPLEMENTATION.md)
- 🌾 [Farmer UX, Accessibility & Bilingual Workflows](./docs/PHASE_3_5_FARMER_UX.md)

---

## 👥 Engineering Team

- **Harshita**: Frontend Architecture & UI/UX Design Lead
- **Divyanshi**: Backend REST APIs, Resilience, & Microservices Lead
- **Khushi**: Database Modeling, Testing, & Quality Assurance
- **Pragati**: Machine Learning Models & Agronomic Research

*AgriTech360 Platform • Production Release v1.0*