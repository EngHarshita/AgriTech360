"""
AgriTech360 ML Service Automated Test Suite
Tests model loading, Pydantic normalization, valid and invalid inputs, and ICAR agronomic enrichment.
"""

import unittest
import os
import sys

# Add ml-service directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import HTTPException
from src.main import load_ml_model, normalize_features, SoilCropInput
from src.crop_data import enrich_crop_recommendation, CROP_PROFILES
import joblib


class TestMLService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        load_ml_model()
        model_path = os.path.join(BASE_DIR, "models", "crop_recommendation_model.joblib")
        cls.model = joblib.load(model_path)

    def test_01_model_loading_and_classes(self):
        """Verify Random Forest model loads successfully with 22 distinct crop classes."""
        self.assertIsNotNone(self.model, "Model must load from joblib artifact")
        classes = list(self.model.classes_)
        self.assertEqual(len(classes), 22, f"Expected 22 crop classes, found {len(classes)}")
        self.assertIn("rice", classes)
        self.assertIn("maize", classes)
        self.assertIn("cotton", classes)
        self.assertIn("chickpea", classes)

    def test_02_valid_crop_inference(self):
        """Test inference pipeline with typical Rice soil/climate parameters."""
        input_data = SoilCropInput(
            nitrogen=90,
            phosphorus=42,
            potassium=43,
            temperature=20.88,
            humidity=82.0,
            ph=6.5,
            rainfall=202.93,
            soilType="Clayey"
        )
        features = normalize_features(input_data)
        self.assertEqual(features["N"], 90.0)
        self.assertEqual(features["P"], 42.0)
        self.assertEqual(features["K"], 43.0)

        feature_vector = [[features["N"], features["P"], features["K"],
                           features["temperature"], features["humidity"],
                           features["ph"], features["rainfall"]]]
        prediction = self.model.predict(feature_vector)[0]
        self.assertEqual(prediction, "rice", f"Expected 'rice', got '{prediction}'")

    def test_03_alias_normalization(self):
        """Verify alias names (moisture, phLevel, nitrogen) resolve properly to standard features."""
        input_data = SoilCropInput(
            nitrogen=60,
            phosphorus=55,
            potassium=40,
            temperature=25.0,
            moisture=70.0,
            phLevel=6.8,
            rainfall=150.0
        )
        features = normalize_features(input_data)
        self.assertEqual(features["N"], 60.0)
        self.assertEqual(features["humidity"], 70.0)
        self.assertEqual(features["ph"], 6.8)

    def test_04_invalid_nitrogen_out_of_bounds(self):
        """Ensure Nitrogen exceeding 300 kg/ha raises HTTPException 400."""
        input_data = SoilCropInput(
            nitrogen=500,  # Invalid: max is 300
            phosphorus=40,
            potassium=40,
            temperature=25.0,
            humidity=60.0,
            ph=6.5,
            rainfall=100.0
        )
        with self.assertRaises(HTTPException) as ctx:
            normalize_features(input_data)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Nitrogen must be between 0 and 300", ctx.exception.detail)

    def test_05_invalid_ph_out_of_bounds(self):
        """Ensure pH exceeding 14 raises HTTPException 400."""
        input_data = SoilCropInput(
            N=80,
            P=40,
            K=40,
            temperature=25.0,
            humidity=60.0,
            ph=18.5,  # Invalid: max is 14
            rainfall=100.0
        )
        with self.assertRaises(HTTPException) as ctx:
            normalize_features(input_data)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("pH", ctx.exception.detail)

    def test_06_agronomic_enrichment_integrity(self):
        """Verify ICAR agronomic enrichment returns required production attributes for all crops."""
        for crop_name in ["rice", "cotton", "coffee", "chickpea", "maize"]:
            enrichment = enrich_crop_recommendation(crop_name, 0.95)
            self.assertIn("cropName", enrichment)
            self.assertIn("expectedYield", enrichment)
            self.assertIn("estimatedRevenuePerAcre", enrichment)
            self.assertIn("recommendedFertilizers", enrichment)
            self.assertGreater(len(enrichment["recommendedFertilizers"]), 0)


if __name__ == "__main__":
    unittest.main()
