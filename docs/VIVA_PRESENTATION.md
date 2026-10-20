# 🌾 AgriTech360 — B.Tech Capstone Viva Presentation Slide Deck

**Team Members**:
- Harshita (Frontend Lead)
- Divyanshi (Backend Lead)
- Khushi (Database & Testing)
- Pragati (ML & Research)

---

### Slide 1: Title & Introduction
- **Slide Title**: AgriTech360: AI-Powered Smart Agriculture Advisory Platform for Indian Farmers
- **Subtitle**: B.Tech Final Year Capstone Project (2026–2027)
- **Key Talking Point**: "Good morning respected examiners. Today we present AgriTech360, a full-stack, AI-driven advisory system engineered to bridge the digital divide for Indian smallholder farmers through actionable, data-backed insights."

---

### Slide 2: Problem Statement & Motivation
- **Challenges in Indian Agriculture**:
  1. Over-reliance on traditional guesswork leading to crop failures.
  2. Soil degradation caused by unscientific fertilizer application.
  3. Lack of localized agro-meteorological advisories (e.g. pesticide spray timing).
  4. Market asymmetry where farmers sell below MSP due to lack of mandi price visibility.
  5. Low awareness of 100+ Central and State agricultural subsidy schemes.
- **Talking Point**: "Despite technological advances, 86% of Indian farmers are smallholders lacking access to scientific advisory tools."

---

### Slide 3: Proposed Solution — AgriTech360
- **Unified Ecosystem**:
  - **Crop Recommendation**: Machine learning model trained on soil chemical and climatic parameters.
  - **Weather Intelligence**: 24-hour and 7-day agricultural forecasts with spray suitability indicators.
  - **Mandi Price Monitoring**: APMC rates comparison with government MSP floors and revenue calculators.
  - **Scheme Discovery**: Subsidies catalog with automated eligibility assessment.
  - **Farm Management**: Digital parcel records, soil health tracking, and agronomic calendars.

---

### Slide 4: System Architecture
- **Three-Tier Modular Architecture**:
  1. **Presentation Layer**: React 19 + TypeScript + Tailwind CSS (Fast, responsive, accessible).
  2. **Application Gateway Layer**: Node.js + Express + TypeScript (JWT authentication, validation, resilient error handling).
  3. **Intelligence & Data Layer**: Python FastAPI microservice (Scikit-Learn ML engine) + MongoDB Atlas cluster.
- **Talking Point**: "We chose a decoupled microservices design so that ML inference can scale independently from core database operations."

---

### Slide 5: Frontend Technology & User Experience
- **Tech Stack**: React 19, TypeScript, Vite, TanStack React Query v5, Lucide Icons.
- **Key Design Decisions**:
  - WCAG 2.1 AA compliant earthy color system tailored for readability in sunlight.
  - Dual-mode architecture (`VITE_USE_MOCK_DATA` toggle) ensuring resilience during network blackouts.
  - Skeletons, loading states, and error recovery boundaries for smooth UX.

---

### Slide 6: Backend Architecture & Reliability
- **Tech Stack**: Node.js, Express.js, TypeScript, Mongoose ODM, Helmet, Swagger OpenAPI.
- **Resilience Features**:
  - Automated DNS nameserver reconfiguration for MongoDB Atlas SRV resolution (`8.8.8.8`).
  - **Graceful Degraded Mode**: If the cloud database or third-party APIs encounter network interruption, the platform continues operating with zero crashes.
  - Provenance tagging on every alert (`live_telemetry`, `simulated_fallback`, `official_advisory`).

---

### Slide 7: Machine Learning — Dataset & Preprocessing
- **Dataset**: ICAR / Kaggle Agriculture Benchmark Dataset.
- **Size**: 2,200 instances, 22 balanced crop classes (100 samples per class).
- **Features**: Nitrogen (N), Phosphorus (P), Potassium (K), Temperature (°C), Humidity (%), pH (0–14), Rainfall (mm).
- **Quality Checks**: Checked for missing values, zero outliers across physical boundaries, and stratified 80/20 train/test split.

---

### Slide 8: Machine Learning — Model Training & Evaluation
- **Algorithm**: Random Forest Classifier (`n_estimators=100`, `criterion='gini'`).
- **Evaluation Accuracy**: **99.55%** on unseen holdout test split (438/440 correct predictions).
- **Feature Importance**:
  - Rainfall: **23.0%**
  - Relative Humidity: **22.4%**
  - Potassium: **17.5%**
  - Phosphorus: **15.1%**
  - Nitrogen: **9.6%**
- **Talking Point**: "Random Forest outperformed single Decision Trees and KNN by avoiding overfitting across correlated moisture and rainfall variables."

---

### Slide 9: Agronomic Enrichment (ICAR Integration)
- **Beyond Prediction**: Raw model output is just a label (e.g. `'rice'`). AgriTech360 enriches it with:
  1. Expected Yield (e.g. 22–28 Quintals/Acre).
  2. Financial Breakdown (Estimated Gross Revenue, Cultivation Cost, Net Profit).
  3. Climate Risk Assessment (Low / Moderate / High).
  4. Sowing Windows (e.g. June 15 – July 15 for Kharif).
  5. Tailored Fertilizer Schedules (Split dosage: Basal DAP, Vegetative Urea, Potash).

---

### Slide 10: Weather Intelligence & Spray Advisory
- **Agro-Meteorological Features**:
  - Current Temperature, Relative Humidity, Soil Temperature, Evapotranspiration.
  - 24-hour hourly trend and 7-day forward outlook.
  - **Agricultural Spray Suitability Rating**: Calculates wind speed (<14 km/h optimal) and rain probability (<25%) to advise farmers when pesticide/fungicide application is effective vs when it will wash away or drift.

---

### Slide 11: Mandi Price Tracking & MSP Revenue Estimator
- **Market Integration**:
  - Real-time modal, minimum, and maximum prices across Indian APMC mandis.
  - Filterable by Commodity Categories (Grains, Pulses, Oilseeds, Commercial).
  - **Revenue Estimator**: Farmers enter expected harvest quantity (Quintals) to calculate projected gross revenue compared directly against the government MSP safety net.

---

### Slide 12: Government Schemes & Eligibility Engine
- **Features**:
  - Catalog of 26 major Central & State schemes (PM-Kisan, PMFBY, PMKSY, Soil Health Card, Sub-Mission on Agricultural Mechanization).
  - **Automated Eligibility Checker**: Compares farmer profile (landholding acres, state of residence, irrigation method) against official scheme rules.
  - Direct portal links and required document checklists.

---

### Slide 13: Farm & Field Parcel Management
- **Digital Farm Records**:
  - Multiple parcel management (e.g. "North Field - 3 Acres", "Canal Plot - 2 Acres").
  - Soil type classification (Black, Alluvial, Red, Sandy Loam).
  - Crop cultivation history and Kisan Credit Card (KCC) documentation.

---

### Slide 14: Automated Testing & Verification
- **Testing Pyramid**:
  - **Backend API Tests**: 8 automated test suites (`api.test.ts`) covering health checks, auth validation, crop parameter boundaries, and weather fallbacks.
  - **Python ML Tests**: 6 automated test suites (`test_ml_service.py`) covering model loading, 22-class inference, alias normalization, and bounds enforcement.
  - **Build Verification**: Vite production build transforms 2,021 modules with 0 errors.

---

### Slide 15: Single-Command Developer Experience & Docker
- **One-Command Startup**:
  - `npm run dev:all` starts all 3 services simultaneously (Vite Frontend, Node.js Backend, FastAPI ML Service) using `concurrently`.
- **Containerization**:
  - Multi-stage Dockerfiles for frontend, backend, and ML engine.
  - Root `docker-compose.yml` orchestrates all services with health checks and private internal bridge networking.

---

### Slide 16: Project Outcomes & Social Impact
- **Farmer Empowerment**:
  - Eliminates reliance on unverified market middlemen.
  - Reduces fertilizer expenditure through targeted NPK guidance.
  - Prevents crop failure by identifying adverse weather and spray windows.
  - Bridges the 70% gap in government subsidy awareness.

---

### Slide 17: Future Roadmap
- Vernacular Voice Assistant in regional Indian languages.
- Leaf disease detection using smartphone camera capture (CNN model).
- Low-cost IoT soil sensor node integration via LoRaWAN.

---

### Slide 18: Examiner Defense & Technical Q&A
- **Q1: Why did you separate Node.js and Python into two services?**
  - *Answer*: Separation of concerns. Node.js excels at asynchronous I/O, JWT auth, and high-concurrency API routing, whereas Python is the gold standard for ML inference with Scikit-learn.
- **Q2: How does the system handle internet drops in rural areas?**
  - *Answer*: The system features dual-mode architecture (`VITE_USE_MOCK_DATA`) and the backend implements non-blocking degraded fallbacks, ensuring farmers never face a broken screen.
- **Q3: How was 99.55% accuracy validated?**
  - *Answer*: On a 20% stratified holdout test split ($N=440$ samples) that the model never saw during training, verified in `models/model_metadata.json`.

---

### Slide 19: Conclusion & Acknowledgments
- **Summary**: AgriTech360 is a complete, tested, production-ready capstone platform addressing real-world agrarian challenges in India.
- **Special Thanks**: Project guide, department faculty, and external evaluation committee.
- **Thank you! We welcome your questions.**
