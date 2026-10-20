"""
AgriTech360 ML Service - Crop Agronomic Profiles
Provides verified ICAR (Indian Council of Agricultural Research) benchmark agronomic data
for all 22 crop classes predicted by the model.
"""

from typing import Dict, Any, List

CROP_PROFILES: Dict[str, Dict[str, Any]] = {
    "rice": {
        "cropName": "Paddy / Rice (धान)",
        "hindiName": "चावल / धान",
        "category": "Cereal",
        "season": "Kharif",
        "expectedYield": "22-28 Quintals / Acre",
        "estimatedRevenuePerAcre": 68000,
        "costOfCultivationPerAcre": 24000,
        "netProfitPerAcre": 44000,
        "waterRequirement": "High",
        "durationDays": 125,
        "matchReasons": [
            "High humidity and rainfall parameters match paddy requirements",
            "Optimal Nitrogen (N) levels for vigorous vegetative tillering",
            "Strong APMC wholesale market liquidity across Kharif season"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "15 June - 15 July",
        "recommendedFertilizers": [
            {"name": "Urea (Nitrogen)", "dosage": "50 kg/acre in 3 splits"},
            {"name": "DAP (Diammonium Phosphate)", "dosage": "40 kg/acre basal"},
            {"name": "Muriate of Potash (MOP)", "dosage": "25 kg/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop&q=80"
    },
    "maize": {
        "cropName": "Maize / Corn (मक्का)",
        "hindiName": "मक्का",
        "category": "Cereal",
        "season": "Kharif",
        "expectedYield": "24-30 Quintals / Acre",
        "estimatedRevenuePerAcre": 62000,
        "costOfCultivationPerAcre": 20000,
        "netProfitPerAcre": 42000,
        "waterRequirement": "Medium",
        "durationDays": 105,
        "matchReasons": [
            "Well-drained soil moisture index supports cob filling",
            "Moderate rainfall resilience during tasseling stage",
            "High feed industry and poultry demand driving firm prices"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "20 June - 10 July",
        "recommendedFertilizers": [
            {"name": "NPK 12:32:16", "dosage": "50 kg/acre at sowing"},
            {"name": "Urea", "dosage": "45 kg/acre at knee-high stage"},
            {"name": "Zinc Sulphate", "dosage": "10 kg/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80"
    },
    "chickpea": {
        "cropName": "Chickpea / Desi Chana (चना)",
        "hindiName": "देसी चना",
        "category": "Pulse",
        "season": "Rabi",
        "expectedYield": "9-12 Quintals / Acre",
        "estimatedRevenuePerAcre": 67650,
        "costOfCultivationPerAcre": 19800,
        "netProfitPerAcre": 47850,
        "waterRequirement": "Low",
        "durationDays": 105,
        "matchReasons": [
            "Exceptional drought tolerance for residual moisture soils",
            "Atmospheric nitrogen fixation replenishes farm field fertility",
            "Low pest incidence under cool, dry winter spells"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "15 Oct - 15 Nov",
        "recommendedFertilizers": [
            {"name": "SSP (Single Super Phosphate)", "dosage": "100 kg/acre basal"},
            {"name": "Rhizobium Biofertilizer", "dosage": "200g/10kg seed treatment"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80"
    },
    "kidneybeans": {
        "cropName": "Kidney Beans / Rajma (राजमा)",
        "hindiName": "राजमा",
        "category": "Pulse",
        "season": "Rabi",
        "expectedYield": "8-10 Quintals / Acre",
        "estimatedRevenuePerAcre": 85000,
        "costOfCultivationPerAcre": 28000,
        "netProfitPerAcre": 57000,
        "waterRequirement": "Medium",
        "durationDays": 115,
        "matchReasons": [
            "Cool weather temperature profile matches vegetative cycle",
            "High premium price realization in urban mandis",
            "Good soil pH compatibility and medium moisture utilization"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "15 Oct - 5 Nov",
        "recommendedFertilizers": [
            {"name": "DAP", "dosage": "45 kg/acre"},
            {"name": "Urea", "dosage": "30 kg/acre top dressing"},
            {"name": "Potash", "dosage": "20 kg/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1588615419957-4627a8f331cf?w=400&auto=format&fit=crop&q=80"
    },
    "pigeonpeas": {
        "cropName": "Pigeon Peas / Arhar / Tur (अरहर / तुअर)",
        "hindiName": "तुअर / अरहर",
        "category": "Pulse",
        "season": "Kharif",
        "expectedYield": "7-10 Quintals / Acre",
        "estimatedRevenuePerAcre": 75000,
        "costOfCultivationPerAcre": 22000,
        "netProfitPerAcre": 53000,
        "waterRequirement": "Low",
        "durationDays": 160,
        "matchReasons": [
            "Deep taproot system accesses subsoil moisture during dry spells",
            "High MSP buffer and assured APMC procurement",
            "Excellent intercropping compatibility with soybean or cotton"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "15 June - 10 July",
        "recommendedFertilizers": [
            {"name": "DAP", "dosage": "40 kg/acre"},
            {"name": "Sulphur 90%", "dosage": "10 kg/acre for pod development"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80"
    },
    "mothbeans": {
        "cropName": "Moth Beans / Matki (मोठ)",
        "hindiName": "मोठ",
        "category": "Pulse",
        "season": "Kharif",
        "expectedYield": "5-7 Quintals / Acre",
        "estimatedRevenuePerAcre": 42000,
        "costOfCultivationPerAcre": 12000,
        "netProfitPerAcre": 30000,
        "waterRequirement": "Low",
        "durationDays": 80,
        "matchReasons": [
            "Extreme drought and heat tolerance in arid zones",
            "Short duration allows flexible catch-cropping",
            "Very low input cost and high soil conservation value"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "1 July - 25 July",
        "recommendedFertilizers": [
            {"name": "SSP", "dosage": "50 kg/acre at sowing"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?w=400&auto=format&fit=crop&q=80"
    },
    "mungbean": {
        "cropName": "Mung Bean / Green Gram (मूंग)",
        "hindiName": "हरी मूंग",
        "category": "Pulse",
        "season": "Zaid",
        "expectedYield": "6-8 Quintals / Acre",
        "estimatedRevenuePerAcre": 54000,
        "costOfCultivationPerAcre": 15000,
        "netProfitPerAcre": 39000,
        "waterRequirement": "Low",
        "durationDays": 68,
        "matchReasons": [
            "Ultra short duration crop perfectly fitting crop rotation",
            "High market demand with prices consistently trading above MSP",
            "Improves subsequent crop yield by returning organic nitrogen"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "1 March - 25 March (Zaid) or July (Kharif)",
        "recommendedFertilizers": [
            {"name": "DAP", "dosage": "30 kg/acre"},
            {"name": "Phosphorus Solubilizing Bacteria (PSB)", "dosage": "250g/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80"
    },
    "blackgram": {
        "cropName": "Black Gram / Urad (उड़द)",
        "hindiName": "उड़द",
        "category": "Pulse",
        "season": "Kharif",
        "expectedYield": "6-8 Quintals / Acre",
        "estimatedRevenuePerAcre": 56000,
        "costOfCultivationPerAcre": 16000,
        "netProfitPerAcre": 40000,
        "waterRequirement": "Low",
        "durationDays": 75,
        "matchReasons": [
            "Warm and humid weather during growth phase is ideal",
            "High domestic culinary demand ensures dependable liquidity",
            "Root nodules enrich soil biological health"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "20 June - 15 July",
        "recommendedFertilizers": [
            {"name": "DAP", "dosage": "35 kg/acre at basal"},
            {"name": "Sulphur", "dosage": "8 kg/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80"
    },
    "lentil": {
        "cropName": "Lentil / Masoor (मसूर)",
        "hindiName": "मसूर",
        "category": "Pulse",
        "season": "Rabi",
        "expectedYield": "7-9 Quintals / Acre",
        "estimatedRevenuePerAcre": 52000,
        "costOfCultivationPerAcre": 16000,
        "netProfitPerAcre": 36000,
        "waterRequirement": "Low",
        "durationDays": 110,
        "matchReasons": [
            "Thrives in cool climatic winter conditions with light soils",
            "Modest nutrient demands and low irrigation requirement",
            "Excellent protein-rich cash pulse crop"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "20 Oct - 15 Nov",
        "recommendedFertilizers": [
            {"name": "SSP", "dosage": "75 kg/acre"},
            {"name": "Urea", "dosage": "15 kg/acre basal"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80"
    },
    "pomegranate": {
        "cropName": "Pomegranate (अनार)",
        "hindiName": "अनार",
        "category": "Horticulture",
        "season": "Kharif",
        "expectedYield": "45-60 Quintals / Acre",
        "estimatedRevenuePerAcre": 240000,
        "costOfCultivationPerAcre": 75000,
        "netProfitPerAcre": 165000,
        "waterRequirement": "Medium",
        "durationDays": 180,
        "matchReasons": [
            "Well-suited to semi-arid agro-climatic conditions",
            "High net commercial profit margin via export quality harvest",
            "Drip irrigation compatibility enables precise fertigation"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "Ambe Bahar (Jan-Feb) or Mrig Bahar (June-July)",
        "recommendedFertilizers": [
            {"name": "Farmyard Manure (FYM)", "dosage": "10 tons/acre"},
            {"name": "Water Soluble NPK 19:19:19", "dosage": "Via drip weekly"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1541344999736-83eca872f241?w=400&auto=format&fit=crop&q=80"
    },
    "banana": {
        "cropName": "Banana / Grand Naine (केला)",
        "hindiName": "केला",
        "category": "Horticulture",
        "season": "Kharif",
        "expectedYield": "300-380 Quintals / Acre",
        "estimatedRevenuePerAcre": 320000,
        "costOfCultivationPerAcre": 110000,
        "netProfitPerAcre": 210000,
        "waterRequirement": "High",
        "durationDays": 330,
        "matchReasons": [
            "High potassium and moisture availability promotes heavy bunching",
            "Year-round consumer market demand across national mandis",
            "Tissue culture varieties produce uniform high-value yields"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "June - July or Oct - Nov",
        "recommendedFertilizers": [
            {"name": "Urea", "dosage": "200g/plant in split doses"},
            {"name": "Muriate of Potash (MOP)", "dosage": "300g/plant"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80"
    },
    "mango": {
        "cropName": "Mango (आम)",
        "hindiName": "आम",
        "category": "Horticulture",
        "season": "Zaid",
        "expectedYield": "35-50 Quintals / Acre",
        "estimatedRevenuePerAcre": 180000,
        "costOfCultivationPerAcre": 45000,
        "netProfitPerAcre": 135000,
        "waterRequirement": "Medium",
        "durationDays": 150,
        "matchReasons": [
            "Deep soils and warm temperatures favor fruit development and brix",
            "High export and processing demand (Alphonso, Kesar, Dasheri)",
            "Low maintenance once orchard canopy is established"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "July - August (Planting)",
        "recommendedFertilizers": [
            {"name": "Organic Compost", "dosage": "20 kg/tree"},
            {"name": "NPK 10:26:26", "dosage": "1.5 kg/tree post harvest"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80"
    },
    "grapes": {
        "cropName": "Table Grapes (अंगूर)",
        "hindiName": "अंगूर",
        "category": "Horticulture",
        "season": "Rabi",
        "expectedYield": "80-110 Quintals / Acre",
        "estimatedRevenuePerAcre": 380000,
        "costOfCultivationPerAcre": 140000,
        "netProfitPerAcre": 240000,
        "waterRequirement": "Medium",
        "durationDays": 140,
        "matchReasons": [
            "Low humidity during ripening prevents fungal mildew risk",
            "High export realizations in European and Middle Eastern markets",
            "Precision micro-irrigation maximizes bunch weight and sugar content"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "Oct Pruning (Forward Pruning)",
        "recommendedFertilizers": [
            {"name": "Calcium Nitrate", "dosage": "25 kg/acre"},
            {"name": "Potassium Nitrate (13:0:45)", "dosage": "Via fertigation"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&auto=format&fit=crop&q=80"
    },
    "watermelon": {
        "cropName": "Watermelon (तरबूज)",
        "hindiName": "तरबूज",
        "category": "Vegetable",
        "season": "Zaid",
        "expectedYield": "180-240 Quintals / Acre",
        "estimatedRevenuePerAcre": 120000,
        "costOfCultivationPerAcre": 38000,
        "netProfitPerAcre": 82000,
        "waterRequirement": "Medium",
        "durationDays": 85,
        "matchReasons": [
            "High temperature and sunshine during maturity stage produce sweet flesh",
            "Short duration summer crop generating rapid capital turnover",
            "Drip irrigation with silver-black mulch delivers 95%+ germination"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "15 Jan - 28 Feb",
        "recommendedFertilizers": [
            {"name": "Basal NPK 19:19:19", "dosage": "50 kg/acre"},
            {"name": "Micronutrient Spray", "dosage": "At 30 and 50 days"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&auto=format&fit=crop&q=80"
    },
    "muskmelon": {
        "cropName": "Muskmelon / Cantaloupe (खरबूजा)",
        "hindiName": "खरबूजा",
        "category": "Vegetable",
        "season": "Zaid",
        "expectedYield": "120-160 Quintals / Acre",
        "estimatedRevenuePerAcre": 95000,
        "costOfCultivationPerAcre": 32000,
        "netProfitPerAcre": 63000,
        "waterRequirement": "Medium",
        "durationDays": 80,
        "matchReasons": [
            "Warm dry weather supports high sugar accumulation",
            "Strong local seasonal demand during peak summer months",
            "Quick harvest turnaround fits between Rabi harvest and Kharif sowing"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "1 Feb - 10 March",
        "recommendedFertilizers": [
            {"name": "DAP", "dosage": "40 kg/acre"},
            {"name": "0:0:50 (Potash)", "dosage": "15 kg/acre during fruit sizing"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80"
    },
    "apple": {
        "cropName": "Apple (सेब)",
        "hindiName": "सेब",
        "category": "Horticulture",
        "season": "Kharif",
        "expectedYield": "60-90 Quintals / Acre",
        "estimatedRevenuePerAcre": 350000,
        "costOfCultivationPerAcre": 95000,
        "netProfitPerAcre": 255000,
        "waterRequirement": "Medium",
        "durationDays": 160,
        "matchReasons": [
            "Optimal low ambient temperatures match required chilling units",
            "High market value with national cold storage infrastructure",
            "High-density rootstocks offer early commercial bearing"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "Dec - Feb (Dormancy Planting)",
        "recommendedFertilizers": [
            {"name": "FYM Compost", "dosage": "15 tons/acre"},
            {"name": "Balanced NPK", "dosage": "500g/tree"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80"
    },
    "orange": {
        "cropName": "Nagpur Orange / Mandarin (संतरा)",
        "hindiName": "संतरा",
        "category": "Horticulture",
        "season": "Rabi",
        "expectedYield": "70-100 Quintals / Acre",
        "estimatedRevenuePerAcre": 160000,
        "costOfCultivationPerAcre": 48000,
        "netProfitPerAcre": 112000,
        "waterRequirement": "Medium",
        "durationDays": 240,
        "matchReasons": [
            "Dry winter atmosphere facilitates natural fruit color break",
            "Well established Vidarbha and central India market network",
            "High juice processing and fresh consumption off-take"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "June - August",
        "recommendedFertilizers": [
            {"name": "Urea", "dosage": "400g/tree"},
            {"name": "Single Super Phosphate", "dosage": "600g/tree"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80"
    },
    "papaya": {
        "cropName": "Papaya / Red Lady (पपीता)",
        "hindiName": "पपीता",
        "category": "Horticulture",
        "season": "Kharif",
        "expectedYield": "250-320 Quintals / Acre",
        "estimatedRevenuePerAcre": 220000,
        "costOfCultivationPerAcre": 65000,
        "netProfitPerAcre": 155000,
        "waterRequirement": "Medium",
        "durationDays": 270,
        "matchReasons": [
            "Continuous production cycle provides steady weekly farm cashflow",
            "Moderate temperature and well-aerated soil prevent collar rot",
            "Taiwan 786 Red Lady variety enjoys high consumer acceptance"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "June - Sept or Jan - March",
        "recommendedFertilizers": [
            {"name": "NPK 19:19:19", "dosage": "15g/plant every 15 days"},
            {"name": "Boron Micronutrient", "dosage": "Foliar spray at flowering"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&auto=format&fit=crop&q=80"
    },
    "coconut": {
        "cropName": "Coconut (नारियल)",
        "hindiName": "नारियल",
        "category": "Cash Crop",
        "season": "Kharif",
        "expectedYield": "80-110 Bags / Acre",
        "estimatedRevenuePerAcre": 140000,
        "costOfCultivationPerAcre": 35000,
        "netProfitPerAcre": 105000,
        "waterRequirement": "High",
        "durationDays": 365,
        "matchReasons": [
            "High humidity and stable temperature profile promote continuous flowering",
            "Multi-decade productive lifecycle once mature",
            "Tender coconut and copra processing industries provide secure demand"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "May - June (Pre-Monsoon)",
        "recommendedFertilizers": [
            {"name": "Muriate of Potash (MOP)", "dosage": "1.5 kg/palm/year"},
            {"name": "Urea", "dosage": "1 kg/palm/year"},
            {"name": "Common Salt (NaCl)", "dosage": "1 kg/palm/year"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=400&auto=format&fit=crop&q=80"
    },
    "cotton": {
        "cropName": "Cotton / White Gold (कपास)",
        "hindiName": "कपास",
        "category": "Cash Crop",
        "season": "Kharif",
        "expectedYield": "10-14 Quintals / Acre",
        "estimatedRevenuePerAcre": 85000,
        "costOfCultivationPerAcre": 28000,
        "netProfitPerAcre": 57000,
        "waterRequirement": "Medium",
        "durationDays": 160,
        "matchReasons": [
            "Deep black soil and moderate rainfall support boll formation",
            "High textile mill demand and CCI minimum support price backing",
            "Good response to balanced N-P-K nutrient management"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "20 May - 20 June",
        "recommendedFertilizers": [
            {"name": "NPK 10:26:26", "dosage": "50 kg/acre basal"},
            {"name": "Urea", "dosage": "40 kg/acre in 2 splits"},
            {"name": "Magnesium Sulphate", "dosage": "10 kg/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=400&auto=format&fit=crop&q=80"
    },
    "jute": {
        "cropName": "Golden Fibre Jute (पटसन)",
        "hindiName": "पटसन / जूट",
        "category": "Cash Crop",
        "season": "Kharif",
        "expectedYield": "14-18 Quintals / Acre",
        "estimatedRevenuePerAcre": 72000,
        "costOfCultivationPerAcre": 22000,
        "netProfitPerAcre": 50000,
        "waterRequirement": "High",
        "durationDays": 120,
        "matchReasons": [
            "High ambient humidity (>70%) and warm temperature support fiber elongation",
            "Abundant retting water availability during harvest",
            "Eco-friendly packaging mandate ensures government procurement"
        ],
        "climateRisk": "Low",
        "bestSowingWindow": "15 March - 30 April",
        "recommendedFertilizers": [
            {"name": "Urea", "dosage": "30 kg/acre top dressing"},
            {"name": "SSP", "dosage": "50 kg/acre"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80"
    },
    "coffee": {
        "cropName": "Arabica / Robusta Coffee (कॉफ़ी)",
        "hindiName": "कॉफ़ी",
        "category": "Cash Crop",
        "season": "Kharif",
        "expectedYield": "8-12 Quintals / Acre",
        "estimatedRevenuePerAcre": 190000,
        "costOfCultivationPerAcre": 55000,
        "netProfitPerAcre": 135000,
        "waterRequirement": "High",
        "durationDays": 240,
        "matchReasons": [
            "Humid climate and rich organic soil foster high bean density",
            "Global specialty coffee export premiums available",
            "Agroforestry shade trees support biodiversity and soil conservation"
        ],
        "climateRisk": "Moderate",
        "bestSowingWindow": "June - August",
        "recommendedFertilizers": [
            {"name": "NPK 17:17:17", "dosage": "100g/bush in split doses"},
            {"name": "Zinc + Boron Spray", "dosage": "Pre-blossom stage"}
        ],
        "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80"
    }
}


def enrich_crop_recommendation(crop_id: str, suitability_score: int) -> Dict[str, Any]:
    """
    Enriches a predicted crop label with verified ICAR agronomic guidelines
    conforming directly to the frontend CropRecommendation TypeScript interface.
    """
    normalized = crop_id.lower().strip()
    profile = CROP_PROFILES.get(normalized, {
        "cropName": normalized.capitalize(),
        "hindiName": normalized.capitalize(),
        "category": "Cereal",
        "season": "Kharif",
        "expectedYield": "15-20 Quintals / Acre",
        "estimatedRevenuePerAcre": 50000,
        "costOfCultivationPerAcre": 18000,
        "netProfitPerAcre": 32000,
        "waterRequirement": "Medium",
        "durationDays": 110,
        "matchReasons": ["Soil and agro-climatic conditions are conducive for cultivation"],
        "climateRisk": "Low",
        "bestSowingWindow": "Seasonal window",
        "recommendedFertilizers": [{"name": "Balanced NPK", "dosage": "50 kg/acre"}],
        "imageUrl": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80"
    })

    return {
        "id": f"crop_{normalized}",
        "cropName": profile["cropName"],
        "hindiName": profile["hindiName"],
        "category": profile["category"],
        "suitabilityScore": max(1, min(100, suitability_score)),
        "season": profile["season"],
        "expectedYield": profile["expectedYield"],
        "estimatedRevenuePerAcre": profile["estimatedRevenuePerAcre"],
        "costOfCultivationPerAcre": profile["costOfCultivationPerAcre"],
        "netProfitPerAcre": profile["netProfitPerAcre"],
        "waterRequirement": profile["waterRequirement"],
        "durationDays": profile["durationDays"],
        "matchReasons": profile["matchReasons"],
        "climateRisk": profile["climateRisk"],
        "bestSowingWindow": profile["bestSowingWindow"],
        "recommendedFertilizers": profile["recommendedFertilizers"],
        "imageUrl": profile["imageUrl"]
    }
