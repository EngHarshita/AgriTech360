"""
AgriTech360 Python ML Microservice
FastAPI service exposing real-time ML crop recommendation inference
trained on ICAR/Kaggle agricultural parameters.
"""

import os
import sys
import logging
from typing import Optional, List, Dict, Any
import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.crop_data import enrich_crop_recommendation

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("AgriTech360-ML-Service")

# Expected feature order during model training
FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Load model artifact
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_recommendation_model.joblib")

model = None
classes = []

def load_ml_model():
    global model, classes
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            classes = list(model.classes_)
            logger.info(f"Successfully loaded model from {MODEL_PATH}")
            logger.info(f"Supported classes ({len(classes)}): {classes}")
        except Exception as e:
            logger.error(f"Failed to load ML model artifact: {e}")
            model = None
    else:
        logger.warning(f"Model artifact not found at {MODEL_PATH}. Run src/train.py to train.")


# Initialize FastAPI app
app = FastAPI(
    title="AgriTech360 Crop Recommendation ML Service",
    description="High-precision ML service providing AI-powered crop advisory based on soil and climate variables",
    version="1.0.0"
)

# CORS Middleware (allowing Node.js backend and frontend dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    load_ml_model()


# Input validation schema supporting standard & alias parameters
class SoilCropInput(BaseModel):
    N: Optional[float] = Field(None, description="Nitrogen content in kg/ha")
    P: Optional[float] = Field(None, description="Phosphorus content in kg/ha")
    K: Optional[float] = Field(None, description="Potassium content in kg/ha")
    nitrogen: Optional[float] = Field(None, description="Nitrogen alias")
    phosphorus: Optional[float] = Field(None, description="Phosphorus alias")
    potassium: Optional[float] = Field(None, description="Potassium alias")
    temperature: float = Field(..., ge=-10.0, le=60.0, description="Ambient air temperature in °C")
    humidity: Optional[float] = Field(None, description="Relative humidity in %")
    moisture: Optional[float] = Field(None, description="Soil moisture / humidity alias in %")
    ph: Optional[float] = Field(None, description="Soil pH level (0-14)")
    phLevel: Optional[float] = Field(None, description="Soil pH level alias")
    rainfall: float = Field(..., ge=0.0, le=5000.0, description="Precipitation / rainfall in mm")
    soilType: Optional[str] = Field("Black", description="Soil classification")


class PredictionResponse(BaseModel):
    success: bool
    crop: str
    confidence: float
    recommendation: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    input_features: Dict[str, float]


def normalize_features(input_data: SoilCropInput) -> Dict[str, float]:
    """Resolves aliases and validates strict range bounds."""
    # Nitrogen
    n_val = input_data.N if input_data.N is not None else input_data.nitrogen
    if n_val is None:
        raise HTTPException(status_code=400, detail="Nitrogen parameter ('N' or 'nitrogen') is required.")
    if n_val < 0 or n_val > 300:
        raise HTTPException(status_code=400, detail=f"Nitrogen must be between 0 and 300 kg/ha. Provided: {n_val}")

    # Phosphorus
    p_val = input_data.P if input_data.P is not None else input_data.phosphorus
    if p_val is None:
        raise HTTPException(status_code=400, detail="Phosphorus parameter ('P' or 'phosphorus') is required.")
    if p_val < 0 or p_val > 300:
        raise HTTPException(status_code=400, detail=f"Phosphorus must be between 0 and 300 kg/ha. Provided: {p_val}")

    # Potassium
    k_val = input_data.K if input_data.K is not None else input_data.potassium
    if k_val is None:
        raise HTTPException(status_code=400, detail="Potassium parameter ('K' or 'potassium') is required.")
    if k_val < 0 or k_val > 300:
        raise HTTPException(status_code=400, detail=f"Potassium must be between 0 and 300 kg/ha. Provided: {k_val}")

    # Humidity / Moisture
    hum_val = input_data.humidity if input_data.humidity is not None else input_data.moisture
    if hum_val is None:
        raise HTTPException(status_code=400, detail="Humidity/Moisture parameter ('humidity' or 'moisture') is required.")
    if hum_val < 0 or hum_val > 100:
        raise HTTPException(status_code=400, detail=f"Humidity must be between 0% and 100%. Provided: {hum_val}")

    # pH
    ph_val = input_data.ph if input_data.ph is not None else input_data.phLevel
    if ph_val is None:
        raise HTTPException(status_code=400, detail="Soil pH parameter ('ph' or 'phLevel') is required.")
    if ph_val < 0 or ph_val > 14:
        raise HTTPException(status_code=400, detail=f"Soil pH must be between 0 and 14. Provided: {ph_val}")

    return {
        "N": float(n_val),
        "P": float(p_val),
        "K": float(k_val),
        "temperature": float(input_data.temperature),
        "humidity": float(hum_val),
        "ph": float(ph_val),
        "rainfall": float(input_data.rainfall)
    }


@app.get("/health", tags=["Health"])
@app.get("/", tags=["Health"])
def health_check():
    """Returns service health and model status."""
    return {
        "status": "healthy",
        "service": "AgriTech360-ML-Service",
        "model_loaded": model is not None,
        "classes_count": len(classes),
        "features": FEATURE_NAMES
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
def predict_crop(input_data: SoilCropInput):
    """
    Predict optimal crop recommendation using the trained scikit-learn model.
    Ensures exact feature ordering: ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].
    """
    global model
    if model is None:
        load_ml_model()
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML model is not loaded. Ensure src/train.py has been executed."
            )

    # 1. Validate and resolve parameter aliases
    clean_params = normalize_features(input_data)

    # 2. Construct feature DataFrame in EXACT training column order
    feature_df = pd.DataFrame([[
        clean_params["N"],
        clean_params["P"],
        clean_params["K"],
        clean_params["temperature"],
        clean_params["humidity"],
        clean_params["ph"],
        clean_params["rainfall"]
    ]], columns=FEATURE_NAMES)

    try:
        # 3. Model Inference: predict crop & class probabilities
        predicted_crop = str(model.predict(feature_df)[0]).lower().strip()

        # Extract confidence probabilities
        recommendations = []
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(feature_df)[0]
            top_indices = np.argsort(probs)[::-1][:3]  # Top 3 recommendations

            for idx in top_indices:
                crop_label = str(model.classes_[idx]).lower().strip()
                confidence_score = round(float(probs[idx]) * 100, 1)
                enriched = enrich_crop_recommendation(crop_label, int(confidence_score))
                recommendations.append(enriched)

            top_conf = float(probs[top_indices[0]])
        else:
            top_conf = 0.95
            recommendations.append(enrich_crop_recommendation(predicted_crop, 95))

        top_rec = recommendations[0] if recommendations else enrich_crop_recommendation(predicted_crop, 95)

        return PredictionResponse(
            success=True,
            crop=predicted_crop,
            confidence=round(top_conf, 4),
            recommendation=top_rec,
            recommendations=recommendations,
            input_features=clean_params
        )

    except Exception as e:
        logger.error(f"Error during model prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference computation error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting AgriTech360 ML FastAPI service on port {port}...")
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=False)
