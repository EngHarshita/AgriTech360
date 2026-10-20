# 🎬 AgriTech360 — Live Demonstration Walkthrough Script

**Duration**: 8–10 Minutes  
**Audience**: Final Year Capstone Project Examiners / Evaluation Committee  
**Goal**: Demonstrate an end-to-end user journey across all functional tiers of AgriTech360.

---

## 🛠 Pre-Demo Setup Checklist (1 Minute)

1. Open PowerShell / Terminal in the project root:
   ```powershell
   npm run dev:all
   ```
2. Confirm all 3 services are active in the console output:
   - `[FRONTEND]` running on `http://localhost:5173`
   - `[BACKEND]` listening on port `5000`
   - `[ML-ENGINE]` running on `http://127.0.0.1:8000`
3. Open your browser at `http://localhost:5173`.

---

## 📍 Step-by-Step Walkthrough

### Act 1: Farmer Authentication & Dashboard Telemetry (2 Minutes)
1. **Show Navbar & Farmer Identity**:
   - Point out the branding, district selector (`Indore, Madhya Pradesh`), and notification bell.
   - Click **Demo Farmer Login** to showcase instant zero-friction access, or enter credentials in the Auth modal.
2. **Dashboard Overview**:
   - Explain the 4 primary KPI telemetry cards:
     - **Total Land Cultivated** (5.0 Acres)
     - **Active Field Parcels**
     - **Agro-Climate Risk Score** (Evaluated from weather intelligence)
     - **Projected Revenue Turnover**
   - Point to the **Agricultural Weather Advisory Banner**:
     - Explain how it highlights current spray suitability and tips (e.g. *Safe to spray pesticide today*).
   - Click the **Notification Bell** in the top-right navbar to reveal real-time alerts with provenance indicators (`[live_telemetry]` vs `[official_advisory]`).

---

### Act 2: Machine Learning Crop Advisory (3 Minutes)
1. Navigate to **Crop Advisory** (`/crops`).
2. **Demonstrate Soil Parameter Inputs**:
   - Show the interactive sliders:
     - **Nitrogen (N)**: Set to `90 kg/ha`
     - **Phosphorus (P)**: Set to `42 kg/ha`
     - **Potassium (K)**: Set to `43 kg/ha`
     - **Soil pH**: `6.5`
     - **Relative Moisture**: `82%`
     - **Rainfall**: `200 mm`
     - **Soil Type**: Select `Clayey / Black Soil`
3. Click **Generate Crop Recommendation**:
   - Show that the request hits Express (`/api/v1/crops/recommend`) which forwards to the FastAPI microservice (`/predict`).
   - Highlight the predicted result: **Paddy / Rice (धान)** with high confidence (~98%).
4. **Walk through the Agronomic Cards**:
   - Point out the **Expected Yield** (`22–28 Quintals/Acre`).
   - Point out the **Financial Feasibility**: Gross Revenue (₹68,000), Cost of Cultivation (₹24,000), Net Profit (₹44,000/Acre).
   - Show the **Fertilizer Schedule** (split dosages: Basal DAP, Vegetative Urea, Potash).
   - Demonstrate the **Export / Print Advisory** button for saving a PDF record.

---

### Act 3: Weather Intelligence & Spray Advisory (1.5 Minutes)
1. Navigate to **Weather** (`/weather`).
2. Show the **Agrometeorological Stations**:
   - Current Temperature, Relative Humidity, Soil Temperature, and Evapotranspiration.
3. Highlight the **Spray Suitability Index**:
   - Explain: *"Farmers frequently waste thousands of rupees spraying chemicals when winds or rains wash them away. Our platform computes wind speed and rainfall probability to deliver a clear 'Excellent / Good / Fair / Poor' recommendation."*
4. Show the **24-Hour Timeline** and **7-Day Forward Forecast**.

---

### Act 4: APMC Mandi Prices & Revenue Calculator (1.5 Minutes)
1. Navigate to **Mandi Prices** (`/mandi`).
2. Search for `Soybean` or filter by category `Oilseeds`.
3. Highlight:
   - Live modal price (e.g. ₹4,850/Quintal) compared against the government MSP floor (₹4,600).
   - Price trend badge (`+₹250 above MSP`).
4. **Demonstrate the Revenue Estimator Calculator**:
   - Enter harvest quantity: `50 Quintals`.
   - Show instantaneous projected revenue calculation (e.g. ₹2,42,500 gross revenue with net gain of +₹12,500 over MSP).

---

### Act 5: Government Schemes & Eligibility Engine (1 Minute)
1. Navigate to **Government Schemes** (`/schemes`).
2. Filter by category (e.g. `Financial Assistance` or `Crop Insurance`).
3. Click **Check Eligibility** on **PM-Kisan** or **PMFBY**:
   - Show the automated modal comparing the logged-in farmer's acreage and state against eligibility rules.
   - Point out the direct links to the official government portals (`pmkisan.gov.in`).
4. Click the **Bookmark** star to demonstrate state persistence.

---

### Act 6: Farm Management & System Health (1 Minute)
1. Navigate to **Farm Profile** (`/profile`).
2. Show the registered field parcels, soil classification, and irrigation methods.
3. Switch to terminal or new tab:
   - Show Swagger API documentation at `http://localhost:5000/api/v1/docs`.
   - Run tests live in front of examiners:
     ```powershell
     npm test
     ```
   - Show **8 backend API tests** and **6 Python ML tests** passing with 100% success.

---

## 🎯 Wrap-Up Statement
*"As you have seen, AgriTech360 integrates machine learning, agro-meteorology, market economics, and government policy into a single, accessible, resilient web platform designed to improve farm profitability and rural livelihoods. Thank you."*
