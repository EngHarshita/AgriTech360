# 🎓 AgriTech360 — Capstone Project Report & SRS Documentation

**Project Title**: AgriTech360: AI-Powered Smart Agriculture Advisory Platform for Indian Farmers  
**Domain**: Smart Agriculture, Machine Learning, Applied Web Technologies  
**Project Category**: B.Tech Final Year Capstone Project  
**Academic Session**: 2026–2027  

---

## 1. Executive Summary

Indian agriculture sustains over 58% of the country's population, yet the majority of small and marginal farmers make critical cultivation decisions based on historical precedent or anecdotal information. Sub-optimal crop selection leads to soil degradation, yield losses, and financial distress.

**AgriTech360** is an integrated agro-informatics platform combining:
1. Soil-and-climate-driven **Machine Learning crop recommendations** using verified ICAR datasets.
2. Micro-level **weather intelligence** with agricultural spray suitability indices.
3. Live **APMC Mandi wholesale price tracking** and Minimum Support Price (MSP) revenue estimators.
4. Central & State **Government Scheme discovery** with automatic eligibility scoring.
5. Digital **Farm and Parcel Management** records.

---

## 2. Software Requirements Specification (SRS)

### 2.1 Functional Requirements (FR)

| Req ID | Module | Functional Requirement Description | Verification Method |
|:-------|:-------|:-----------------------------------|:--------------------|
| **FR-01** | Authentication | The system shall allow farmers to register, authenticate via JWT, and maintain session persistence across sessions. | Tested via automated API suite (`api.test.ts`) |
| **FR-02** | Dashboard | The system shall display aggregated farm telemetry (Total acreage, active crops, agro-climatic risk index, and revenue projection). | Verified in `DashboardView.tsx` |
| **FR-03** | Crop Advisory | The system shall evaluate soil N, P, K, pH, moisture, temperature, and rainfall to predict optimal crops using a trained ML model. | Tested on 2,200 samples with 99.55% accuracy |
| **FR-04** | Agronomic Profile | The advisory system shall enrich predictions with expected yield, estimated revenue, cultivation cost, and fertilizer application schedules. | Verified against ICAR benchmarks |
| **FR-05** | Weather Intelligence | The system shall present current conditions, 24-hour hourly forecasts, 7-day outlooks, and agrochemical spray suitability ratings. | Tested via OpenWeatherMap adapter + fallback |
| **FR-06** | Mandi Tracking | The system shall enable search and category filtering of APMC wholesale mandi rates and calculate projected revenues against MSP floors. | Tested with 20+ market datasets |
| **FR-07** | Scheme Discovery | The system shall maintain an indexed catalog of government agricultural subsidies with bookmarking and qualification verification. | Implemented with 26 pre-seeded schemes |
| **FR-08** | Field Management | The system shall allow authenticated farmers to perform full CRUD operations on individual field parcels and soil profiles. | Implemented via `/api/v1/farms` |
| **FR-09** | Alerts & Warnings | The system shall serve real-time notifications for adverse weather, mandi price spikes, and scheme enrollment deadlines with clear data provenance. | Tested via `/api/v1/alerts` |

### 2.2 Non-Functional Requirements (NFR)

- **Performance**: ML inference response time $< 150\text{ ms}$; API response time $< 50\text{ ms}$ for cached queries.
- **Reliability & Resilience**: Non-blocking graceful degradation when cloud database or external weather services are offline.
- **Accessibility & UX**: Conformance to WCAG 2.1 AA standards; high-contrast agrarian typography and responsive layouts for mobile smartphones.
- **Security**: Passwords hashed with bcrypt (salt rounds = 10); JWT authentication with standard 7-day expiration; CORS restriction and Helmet security headers.

---

## 3. Machine Learning Model Architecture & Performance

### 3.1 Dataset Specification
- **Dataset Source**: ICAR / Kaggle Agricultural Benchmark Dataset (`Crop_recommendation.csv`)
- **Total Records**: 2,200 balanced instances
- **Number of Classes**: 22 crops (100 samples per crop class)
- **Features (7 Dimensions)**:
  1. `N` (Nitrogen index, kg/ha) — Mean: 50.55
  2. `P` (Phosphorus index, kg/ha) — Mean: 53.36
  3. `K` (Potassium index, kg/ha) — Mean: 48.15
  4. `temperature` (Ambient temperature, °C) — Mean: 25.62
  5. `humidity` (Relative humidity, %) — Mean: 71.48
  6. `ph` (Soil pH value, 0–14) — Mean: 6.47
  7. `rainfall` (Seasonal precipitation, mm) — Mean: 103.46

### 3.2 Model Evaluation & Metrics
- **Algorithm**: `RandomForestClassifier` (100 decision trees)
- **Train/Test Split**: 80% Training ($N=1,760$), 20% Stratified Holdout Test ($N=440$)
- **Overall Test Accuracy**: **99.55%** (438/440 correctly predicted on unseen test data)
- **Feature Importance Ranking**:
  - Rainfall: **23.02%**
  - Relative Humidity: **22.42%**
  - Potassium ($K$): **17.54%**
  - Phosphorus ($P$): **15.08%**
  - Nitrogen ($N$): **9.64%**
  - Temperature: **7.24%**
  - Soil pH: **5.06%**

---

## 4. Database Schema Design (MongoDB)

1. **User Collection (`users`)**:
   - `name`, `email`, `phone`, `password`, `district`, `state`, `landHolding`, `soilType`, `irrigationType`, `role`
2. **Farm Parcel Collection (`farmparcels`)**:
   - `farmerId`, `parcelName`, `areaAcres`, `surveyNumber`, `soilType`, `irrigationType`, `currentCrop`, `sowingDate`
3. **Mandi Price Collection (`mandiprices`)**:
   - `commodity`, `variety`, `market`, `district`, `state`, `modalPrice`, `minPrice`, `maxPrice`, `msp`, `volumeTradedTons`, `trend`, `category`
4. **Government Schemes Collection (`governmentschemes`)**:
   - `title`, `shortCode`, `department`, `category`, `subsidyAmount`, `description`, `benefits`, `eligibilityCriteria`, `requiredDocuments`, `officialWebsite`, `deadline`, `bookmarkCount`, `eligibilityRules`

---

## 5. Verification & Test Summary

The platform features automated regression suites across all three tiers:
1. **Frontend**: Vite production build (`dist/`) compiles with 0 TypeScript and bundling errors.
2. **Backend API**: Automated test suite (`server/src/tests/api.test.ts`) verifies health check, route catalog, alerts, authentication validation, crop parameter boundaries, and weather fallback.
3. **ML Microservice**: Python test suite (`ml-service/test_ml_service.py`) tests model serialization, 22-class predictions, parameter bounds, alias resolution, and ICAR agronomic enrichment.

---

## 6. Conclusion & Future Scope

AgriTech360 demonstrates that modern microservice architectures combined with calibrated machine learning models can deliver high-accuracy, practical agronomic intelligence to farmers. Future enhancements include:
- Multi-lingual voice interface in regional vernacular languages (Hindi, Marathi, Punjabi).
- Computer vision integration for leaf disease detection using smartphone camera capture.
- IoT telemetry integration with low-cost LoRaWAN soil moisture probes.
