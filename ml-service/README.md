# 🌾 AgriTech360 - Python ML Crop Recommendation Microservice

High-precision Machine Learning microservice built with **FastAPI** and **scikit-learn** to deliver data-driven crop recommendations based on soil chemical parameters and local agro-climate variables.

---

## 📌 Features & Architecture

* **Framework:** FastAPI with Pydantic v2 input validation & schema enforcement.
* **ML Engine:** `scikit-learn` Random Forest Classifier trained on the verified 22-class ICAR/Kaggle agricultural benchmark dataset.
* **Input Parameters:**
  1. `N` (Nitrogen in kg/ha) — supports alias `nitrogen`
  2. `P` (Phosphorus in kg/ha) — supports alias `phosphorus`
  3. `K` (Potassium in kg/ha) — supports alias `potassium`
  4. `temperature` (Ambient temperature in °C)
  5. `humidity` (Relative humidity in %) — supports alias `moisture`
  6. `ph` (Soil pH value 0-14) — supports alias `phLevel`
  7. `rainfall` (Seasonal precipitation in mm)
* **Exact Feature Order:** Enforced strictly across training and inference pipelines:
  `['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']`.
* **Agronomic Enrichment:** All 22 predicted crops are enriched with verified ICAR benchmarks (expected yield, estimated revenue/profit per acre, sowing window, fertilizer schedules, and market suitability).

---

## 📂 Directory Structure

```bash
ml-service/
├── data/
│   └── Crop_recommendation.csv    # 2,200 rows, 22 balanced crop classes
├── models/
│   ├── crop_recommendation_model.joblib # Serialized Random Forest model
│   └── model_metadata.json        # Training evaluation metrics & contracts
├── src/
│   ├── __init__.py
│   ├── crop_data.py               # Agronomic benchmarks for 22 crops
│   ├── train.py                   # Automated model training pipeline
│   └── main.py                    # FastAPI prediction service
├── requirements.txt               # Pinned Python dependencies
└── README.md
```

---

## 🚀 Setup & Execution

### 1. Create Virtual Environment
Using Python 3.12:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Train Model

```powershell
python src/train.py
```

* Validates dataset integrity and schema.
* Evaluates accuracy on 20% stratified holdout test split.
* Serializes model to `models/crop_recommendation_model.joblib`.
* Saves training metadata to `models/model_metadata.json`.

### 4. Run the Prediction Microservice

```powershell
python src/main.py
```
Or via uvicorn directly:
```powershell
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

---

## 📡 API Endpoints

### 1. Health Check
`GET http://localhost:8000/health`

Response:
```json
{
  "status": "healthy",
  "service": "AgriTech360-ML-Service",
  "model_loaded": true,
  "classes_count": 22,
  "features": ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
}
```

### 2. Crop Prediction
`POST http://localhost:8000/predict`

Request Body:
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.88,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.93
}
```

Response Body:
```json
{
  "success": true,
  "crop": "rice",
  "confidence": 0.98,
  "recommendation": {
    "id": "crop_rice",
    "cropName": "Paddy / Rice (धान)",
    "hindiName": "चावल / धान",
    "category": "Cereal",
    "suitabilityScore": 98,
    "season": "Kharif",
    "expectedYield": "22-28 Quintals / Acre",
    "estimatedRevenuePerAcre": 68000,
    "costOfCultivationPerAcre": 24000,
    "netProfitPerAcre": 44000,
    "waterRequirement": "High",
    "durationDays": 125,
    "matchReasons": [
      "High humidity and rainfall parameters match paddy requirements",
      "Optimal Nitrogen (N) levels for vigorous vegetative tillering"
    ],
    "climateRisk": "Low",
    "bestSowingWindow": "15 June - 15 July",
    "recommendedFertilizers": [
      { "name": "Urea", "dosage": "50 kg/acre" },
      { "name": "DAP", "dosage": "40 kg/acre basal" }
    ],
    "imageUrl": "https://..."
  },
  "recommendations": [ ... ],
  "input_features": {
    "N": 90.0,
    "P": 42.0,
    "K": 43.0,
    "temperature": 20.88,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.93
  }
}
```
