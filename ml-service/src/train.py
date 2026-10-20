"""
AgriTech360 Crop Recommendation Model Training Pipeline
Trains a high-accuracy Random Forest classifier on the ICAR/Kaggle crop dataset
and validates feature contracts for the ML microservice.
"""

import os
import sys
import json
import logging
from datetime import datetime, timezone
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("AgriTech360-ML-Train")

# Expected dataset specifications
EXPECTED_FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET_COLUMN = "label"

def get_paths():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "Crop_recommendation.csv")
    model_dir = os.path.join(base_dir, "models")
    model_path = os.path.join(model_dir, "crop_recommendation_model.joblib")
    metadata_path = os.path.join(model_dir, "model_metadata.json")
    return base_dir, data_path, model_dir, model_path, metadata_path


def validate_dataset(df: pd.DataFrame) -> None:
    """Validates dataset columns, types, nulls, and target integrity."""
    logger.info("Validating dataset structure and schema...")

    # 1. Column existence
    all_expected = EXPECTED_FEATURES + [TARGET_COLUMN]
    missing_cols = [c for c in all_expected if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset is missing required columns: {missing_cols}")

    # 2. Check nulls
    null_counts = df[all_expected].isnull().sum()
    if null_counts.any():
        raise ValueError(f"Dataset contains null values: {null_counts[null_counts > 0].to_dict()}")

    # 3. Check feature types
    for col in EXPECTED_FEATURES:
        if not np.issubdtype(df[col].dtype, np.number):
            raise TypeError(f"Feature column '{col}' is not numeric. Type: {df[col].dtype}")

    # 4. Check labels
    classes = df[TARGET_COLUMN].unique()
    logger.info(f"Dataset validation passed. Total rows: {len(df)}, Unique crops: {len(classes)}")
    logger.info(f"Target crops: {sorted(list(classes))}")


def train_model():
    """Executes model training, evaluation, and artifact serialization."""
    base_dir, data_path, model_dir, model_path, metadata_path = get_paths()

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Crop dataset not found at expected location: {data_path}")

    os.makedirs(model_dir, exist_ok=True)

    logger.info(f"Loading crop dataset from: {data_path}")
    df = pd.read_csv(data_path)

    # Validate dataset
    validate_dataset(df)

    # Features and Target
    X = df[EXPECTED_FEATURES]
    y = df[TARGET_COLUMN].str.lower().str.strip()

    # Train / Test split with stratified sampling
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    logger.info(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    # Initialize and train Random Forest Classifier
    logger.info("Training Random Forest Classifier (n_estimators=100, random_state=42)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        criterion="gini",
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )

    clf.fit(X_train, y_train)

    # Evaluate model
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    logger.info(f"Model Evaluation Accuracy on Test Set: {accuracy * 100:.2f}%")

    report = classification_report(y_test, y_pred, output_dict=True)

    # Feature Importances
    importances = dict(zip(EXPECTED_FEATURES, [round(float(imp), 4) for imp in clf.feature_importances_]))
    logger.info(f"Feature Importances: {importances}")

    # Serialize trained model artifact
    logger.info(f"Saving serialized model to: {model_path}")
    joblib.dump(clf, model_path, compress=3)

    # Save model metadata and feature contracts
    metadata = {
        "model_type": "RandomForestClassifier",
        "n_estimators": 100,
        "accuracy": round(float(accuracy), 4),
        "total_samples": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "features": EXPECTED_FEATURES,
        "feature_importances": importances,
        "classes": sorted(list(clf.classes_)),
        "num_classes": len(clf.classes_),
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset_source": "ml-service/data/Crop_recommendation.csv"
    }

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"Model metadata successfully written to: {metadata_path}")
    logger.info("Training pipeline completed successfully.")

    return {
        "accuracy": accuracy,
        "model_path": model_path,
        "metadata_path": metadata_path,
        "num_classes": len(clf.classes_),
        "classes": sorted(list(clf.classes_))
    }


if __name__ == "__main__":
    result = train_model()
    print("\n" + "=" * 60)
    print("AGRITECH360 MODEL TRAINING RESULTS")
    print("=" * 60)
    print(f"Accuracy:    {result['accuracy'] * 100:.2f}%")
    print(f"Classes:     {result['num_classes']} crops")
    print(f"Model Path:  {result['model_path']}")
    print("=" * 60)
