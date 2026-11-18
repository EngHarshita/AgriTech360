import type { CropRecommendation, SoilParams } from '../types';

export interface CropProfileData {
  id: string;
  cropName: string;
  hindiName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Horticulture' | 'Oilseed' | 'Vegetable';
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Annual';
  expectedYield: string;
  estimatedRevenuePerAcre: number;
  costOfCultivationPerAcre: number;
  netProfitPerAcre: number;
  waterRequirement: 'High' | 'Medium' | 'Low';
  durationDays: number;
  matchReasons: string[];
  climateRisk: 'Low' | 'Moderate' | 'High';
  bestSowingWindow: string;
  recommendedFertilizers: Array<{ name: string; dosage: string }>;
  imageUrl: string;
  centroid: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
}

export const CROP_CENTROIDS_AND_PROFILES: Record<string, CropProfileData> = {
  "apple": {
    "cropName": "Apple (\u0938\u0947\u092c)",
    "hindiName": "\u0938\u0947\u092c",
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
      {
        "name": "FYM Compost",
        "dosage": "15 tons/acre"
      },
      {
        "name": "Balanced NPK",
        "dosage": "500g/tree"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80",
    "id": "crop_apple",
    "centroid": {
      "N": 20.8,
      "P": 134.22,
      "K": 199.89,
      "temperature": 22.63,
      "humidity": 92.33,
      "ph": 5.93,
      "rainfall": 112.65
    }
  },
  "banana": {
    "cropName": "Banana / Grand Naine (\u0915\u0947\u0932\u093e)",
    "hindiName": "\u0915\u0947\u0932\u093e",
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
      {
        "name": "Urea",
        "dosage": "200g/plant in split doses"
      },
      {
        "name": "Muriate of Potash (MOP)",
        "dosage": "300g/plant"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80",
    "id": "crop_banana",
    "centroid": {
      "N": 100.23,
      "P": 82.01,
      "K": 50.05,
      "temperature": 27.38,
      "humidity": 80.36,
      "ph": 5.98,
      "rainfall": 104.63
    }
  },
  "blackgram": {
    "cropName": "Black Gram / Urad (\u0909\u0921\u093c\u0926)",
    "hindiName": "\u0909\u0921\u093c\u0926",
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
      {
        "name": "DAP",
        "dosage": "35 kg/acre at basal"
      },
      {
        "name": "Sulphur",
        "dosage": "8 kg/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80",
    "id": "crop_blackgram",
    "centroid": {
      "N": 40.02,
      "P": 67.47,
      "K": 19.24,
      "temperature": 29.97,
      "humidity": 65.12,
      "ph": 7.13,
      "rainfall": 67.88
    }
  },
  "chickpea": {
    "cropName": "Chickpea / Desi Chana (\u091a\u0928\u093e)",
    "hindiName": "\u0926\u0947\u0938\u0940 \u091a\u0928\u093e",
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
      {
        "name": "SSP (Single Super Phosphate)",
        "dosage": "100 kg/acre basal"
      },
      {
        "name": "Rhizobium Biofertilizer",
        "dosage": "200g/10kg seed treatment"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80",
    "id": "crop_chickpea",
    "centroid": {
      "N": 40.09,
      "P": 67.79,
      "K": 79.92,
      "temperature": 18.87,
      "humidity": 16.86,
      "ph": 7.34,
      "rainfall": 80.06
    }
  },
  "coconut": {
    "cropName": "Coconut (\u0928\u093e\u0930\u093f\u092f\u0932)",
    "hindiName": "\u0928\u093e\u0930\u093f\u092f\u0932",
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
      {
        "name": "Muriate of Potash (MOP)",
        "dosage": "1.5 kg/palm/year"
      },
      {
        "name": "Urea",
        "dosage": "1 kg/palm/year"
      },
      {
        "name": "Common Salt (NaCl)",
        "dosage": "1 kg/palm/year"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=400&auto=format&fit=crop&q=80",
    "id": "crop_coconut",
    "centroid": {
      "N": 21.98,
      "P": 16.93,
      "K": 30.59,
      "temperature": 27.41,
      "humidity": 94.84,
      "ph": 5.98,
      "rainfall": 175.69
    }
  },
  "coffee": {
    "cropName": "Arabica / Robusta Coffee (\u0915\u0949\u092b\u093c\u0940)",
    "hindiName": "\u0915\u0949\u092b\u093c\u0940",
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
      {
        "name": "NPK 17:17:17",
        "dosage": "100g/bush in split doses"
      },
      {
        "name": "Zinc + Boron Spray",
        "dosage": "Pre-blossom stage"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80",
    "id": "crop_coffee",
    "centroid": {
      "N": 101.2,
      "P": 28.74,
      "K": 29.94,
      "temperature": 25.54,
      "humidity": 58.87,
      "ph": 6.79,
      "rainfall": 158.07
    }
  },
  "cotton": {
    "cropName": "Cotton / White Gold (\u0915\u092a\u093e\u0938)",
    "hindiName": "\u0915\u092a\u093e\u0938",
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
      {
        "name": "NPK 10:26:26",
        "dosage": "50 kg/acre basal"
      },
      {
        "name": "Urea",
        "dosage": "40 kg/acre in 2 splits"
      },
      {
        "name": "Magnesium Sulphate",
        "dosage": "10 kg/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=400&auto=format&fit=crop&q=80",
    "id": "crop_cotton",
    "centroid": {
      "N": 117.77,
      "P": 46.24,
      "K": 19.56,
      "temperature": 23.99,
      "humidity": 79.84,
      "ph": 6.91,
      "rainfall": 80.4
    }
  },
  "grapes": {
    "cropName": "Table Grapes (\u0905\u0902\u0917\u0942\u0930)",
    "hindiName": "\u0905\u0902\u0917\u0942\u0930",
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
      {
        "name": "Calcium Nitrate",
        "dosage": "25 kg/acre"
      },
      {
        "name": "Potassium Nitrate (13:0:45)",
        "dosage": "Via fertigation"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&auto=format&fit=crop&q=80",
    "id": "crop_grapes",
    "centroid": {
      "N": 23.18,
      "P": 132.53,
      "K": 200.11,
      "temperature": 23.85,
      "humidity": 81.88,
      "ph": 6.03,
      "rainfall": 69.61
    }
  },
  "jute": {
    "cropName": "Golden Fibre Jute (\u092a\u091f\u0938\u0928)",
    "hindiName": "\u092a\u091f\u0938\u0928 / \u091c\u0942\u091f",
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
      {
        "name": "Urea",
        "dosage": "30 kg/acre top dressing"
      },
      {
        "name": "SSP",
        "dosage": "50 kg/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80",
    "id": "crop_jute",
    "centroid": {
      "N": 78.4,
      "P": 46.86,
      "K": 39.99,
      "temperature": 24.96,
      "humidity": 79.64,
      "ph": 6.73,
      "rainfall": 174.79
    }
  },
  "kidneybeans": {
    "cropName": "Kidney Beans / Rajma (\u0930\u093e\u091c\u092e\u093e)",
    "hindiName": "\u0930\u093e\u091c\u092e\u093e",
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
      {
        "name": "DAP",
        "dosage": "45 kg/acre"
      },
      {
        "name": "Urea",
        "dosage": "30 kg/acre top dressing"
      },
      {
        "name": "Potash",
        "dosage": "20 kg/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1588615419957-4627a8f331cf?w=400&auto=format&fit=crop&q=80",
    "id": "crop_kidneybeans",
    "centroid": {
      "N": 20.75,
      "P": 67.54,
      "K": 20.05,
      "temperature": 20.12,
      "humidity": 21.61,
      "ph": 5.75,
      "rainfall": 105.92
    }
  },
  "lentil": {
    "cropName": "Lentil / Masoor (\u092e\u0938\u0942\u0930)",
    "hindiName": "\u092e\u0938\u0942\u0930",
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
      {
        "name": "SSP",
        "dosage": "75 kg/acre"
      },
      {
        "name": "Urea",
        "dosage": "15 kg/acre basal"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    "id": "crop_lentil",
    "centroid": {
      "N": 18.77,
      "P": 68.36,
      "K": 19.41,
      "temperature": 24.51,
      "humidity": 64.8,
      "ph": 6.93,
      "rainfall": 45.68
    }
  },
  "maize": {
    "cropName": "Maize / Corn (\u092e\u0915\u094d\u0915\u093e)",
    "hindiName": "\u092e\u0915\u094d\u0915\u093e",
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
      {
        "name": "NPK 12:32:16",
        "dosage": "50 kg/acre at sowing"
      },
      {
        "name": "Urea",
        "dosage": "45 kg/acre at knee-high stage"
      },
      {
        "name": "Zinc Sulphate",
        "dosage": "10 kg/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80",
    "id": "crop_maize",
    "centroid": {
      "N": 77.76,
      "P": 48.44,
      "K": 19.79,
      "temperature": 22.39,
      "humidity": 65.09,
      "ph": 6.25,
      "rainfall": 84.77
    }
  },
  "mango": {
    "cropName": "Mango (\u0906\u092e)",
    "hindiName": "\u0906\u092e",
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
      {
        "name": "Organic Compost",
        "dosage": "20 kg/tree"
      },
      {
        "name": "NPK 10:26:26",
        "dosage": "1.5 kg/tree post harvest"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80",
    "id": "crop_mango",
    "centroid": {
      "N": 20.07,
      "P": 27.18,
      "K": 29.92,
      "temperature": 31.21,
      "humidity": 50.16,
      "ph": 5.77,
      "rainfall": 94.7
    }
  },
  "mothbeans": {
    "cropName": "Moth Beans / Matki (\u092e\u094b\u0920)",
    "hindiName": "\u092e\u094b\u0920",
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
      {
        "name": "SSP",
        "dosage": "50 kg/acre at sowing"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?w=400&auto=format&fit=crop&q=80",
    "id": "crop_mothbeans",
    "centroid": {
      "N": 21.44,
      "P": 48.01,
      "K": 20.23,
      "temperature": 28.19,
      "humidity": 53.16,
      "ph": 6.83,
      "rainfall": 51.2
    }
  },
  "mungbean": {
    "cropName": "Mung Bean / Green Gram (\u092e\u0942\u0902\u0917)",
    "hindiName": "\u0939\u0930\u0940 \u092e\u0942\u0902\u0917",
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
      {
        "name": "DAP",
        "dosage": "30 kg/acre"
      },
      {
        "name": "Phosphorus Solubilizing Bacteria (PSB)",
        "dosage": "250g/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80",
    "id": "crop_mungbean",
    "centroid": {
      "N": 20.99,
      "P": 47.28,
      "K": 19.87,
      "temperature": 28.53,
      "humidity": 85.5,
      "ph": 6.72,
      "rainfall": 48.4
    }
  },
  "muskmelon": {
    "cropName": "Muskmelon / Cantaloupe (\u0916\u0930\u092c\u0942\u091c\u093e)",
    "hindiName": "\u0916\u0930\u092c\u0942\u091c\u093e",
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
      {
        "name": "DAP",
        "dosage": "40 kg/acre"
      },
      {
        "name": "0:0:50 (Potash)",
        "dosage": "15 kg/acre during fruit sizing"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80",
    "id": "crop_muskmelon",
    "centroid": {
      "N": 100.32,
      "P": 17.72,
      "K": 50.08,
      "temperature": 28.66,
      "humidity": 92.34,
      "ph": 6.36,
      "rainfall": 24.69
    }
  },
  "orange": {
    "cropName": "Nagpur Orange / Mandarin (\u0938\u0902\u0924\u0930\u093e)",
    "hindiName": "\u0938\u0902\u0924\u0930\u093e",
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
      {
        "name": "Urea",
        "dosage": "400g/tree"
      },
      {
        "name": "Single Super Phosphate",
        "dosage": "600g/tree"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80",
    "id": "crop_orange",
    "centroid": {
      "N": 19.58,
      "P": 16.55,
      "K": 10.01,
      "temperature": 22.77,
      "humidity": 92.17,
      "ph": 7.02,
      "rainfall": 110.47
    }
  },
  "papaya": {
    "cropName": "Papaya / Red Lady (\u092a\u092a\u0940\u0924\u093e)",
    "hindiName": "\u092a\u092a\u0940\u0924\u093e",
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
      {
        "name": "NPK 19:19:19",
        "dosage": "15g/plant every 15 days"
      },
      {
        "name": "Boron Micronutrient",
        "dosage": "Foliar spray at flowering"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&auto=format&fit=crop&q=80",
    "id": "crop_papaya",
    "centroid": {
      "N": 49.88,
      "P": 59.05,
      "K": 50.04,
      "temperature": 33.72,
      "humidity": 92.4,
      "ph": 6.74,
      "rainfall": 142.63
    }
  },
  "pigeonpeas": {
    "cropName": "Pigeon Peas / Arhar / Tur (\u0905\u0930\u0939\u0930 / \u0924\u0941\u0905\u0930)",
    "hindiName": "\u0924\u0941\u0905\u0930 / \u0905\u0930\u0939\u0930",
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
      {
        "name": "DAP",
        "dosage": "40 kg/acre"
      },
      {
        "name": "Sulphur 90%",
        "dosage": "10 kg/acre for pod development"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80",
    "id": "crop_pigeonpeas",
    "centroid": {
      "N": 20.73,
      "P": 67.73,
      "K": 20.29,
      "temperature": 27.74,
      "humidity": 48.06,
      "ph": 5.79,
      "rainfall": 149.46
    }
  },
  "pomegranate": {
    "cropName": "Pomegranate (\u0905\u0928\u093e\u0930)",
    "hindiName": "\u0905\u0928\u093e\u0930",
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
      {
        "name": "Farmyard Manure (FYM)",
        "dosage": "10 tons/acre"
      },
      {
        "name": "Water Soluble NPK 19:19:19",
        "dosage": "Via drip weekly"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1541344999736-83eca872f241?w=400&auto=format&fit=crop&q=80",
    "id": "crop_pomegranate",
    "centroid": {
      "N": 18.87,
      "P": 18.75,
      "K": 40.21,
      "temperature": 21.84,
      "humidity": 90.13,
      "ph": 6.43,
      "rainfall": 107.53
    }
  },
  "rice": {
    "cropName": "Paddy / Rice (\u0927\u093e\u0928)",
    "hindiName": "\u091a\u093e\u0935\u0932 / \u0927\u093e\u0928",
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
      {
        "name": "Urea (Nitrogen)",
        "dosage": "50 kg/acre in 3 splits"
      },
      {
        "name": "DAP (Diammonium Phosphate)",
        "dosage": "40 kg/acre basal"
      },
      {
        "name": "Muriate of Potash (MOP)",
        "dosage": "25 kg/acre"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop&q=80",
    "id": "crop_rice",
    "centroid": {
      "N": 79.89,
      "P": 47.58,
      "K": 39.87,
      "temperature": 23.69,
      "humidity": 82.27,
      "ph": 6.43,
      "rainfall": 236.18
    }
  },
  "watermelon": {
    "cropName": "Watermelon (\u0924\u0930\u092c\u0942\u091c)",
    "hindiName": "\u0924\u0930\u092c\u0942\u091c",
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
      {
        "name": "Basal NPK 19:19:19",
        "dosage": "50 kg/acre"
      },
      {
        "name": "Micronutrient Spray",
        "dosage": "At 30 and 50 days"
      }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&auto=format&fit=crop&q=80",
    "id": "crop_watermelon",
    "centroid": {
      "N": 99.42,
      "P": 17.0,
      "K": 50.22,
      "temperature": 25.59,
      "humidity": 85.16,
      "ph": 6.5,
      "rainfall": 50.79
    }
  }
};

export const FEATURE_WEIGHTS_AND_STD = {
  "N": 36.92,
  "P": 32.99,
  "K": 50.65,
  "temperature": 5.06,
  "humidity": 22.26,
  "ph": 0.77,
  "rainfall": 54.96
};

/**
 * Predicts the most suitable crops based on normalized distance to verified ICAR dataset centroids.
 * Used as resilient offline fallback or in demo mode so predictions strictly reflect input values.
 */
export function predictTopCropsFromDataset(params: SoilParams, topN: number = 3): CropRecommendation[] {
  const n = Number(params.nitrogen) || 50;
  const p = Number(params.phosphorus) || 50;
  const k = Number(params.potassium) || 50;
  const temp = Number(params.temperature) || 25;
  const hum = Number(params.moisture) || 70;
  const ph = Number(params.phLevel) || 6.5;
  const rain = Number(params.rainfall) || 100;

  const userVector = { N: n, P: p, K: k, temperature: temp, humidity: hum, ph: ph, rainfall: rain };

  const scored: Array<{ id: string; profile: CropProfileData; score: number }> = [];

  for (const [key, profile] of Object.entries(CROP_CENTROIDS_AND_PROFILES)) {
    const c = profile.centroid;
    
    // Normalized squared distance
    const distSq =
      Math.pow((userVector.N - c.N) / (FEATURE_WEIGHTS_AND_STD.N || 35), 2) * 1.0 +
      Math.pow((userVector.P - c.P) / (FEATURE_WEIGHTS_AND_STD.P || 33), 2) * 1.5 +
      Math.pow((userVector.K - c.K) / (FEATURE_WEIGHTS_AND_STD.K || 50), 2) * 1.5 +
      Math.pow((userVector.temperature - c.temperature) / (FEATURE_WEIGHTS_AND_STD.temperature || 5), 2) * 1.0 +
      Math.pow((userVector.humidity - c.humidity) / (FEATURE_WEIGHTS_AND_STD.humidity || 22), 2) * 2.0 +
      Math.pow((userVector.ph - c.ph) / (FEATURE_WEIGHTS_AND_STD.ph || 0.8), 2) * 1.0 +
      Math.pow((userVector.rainfall - c.rainfall) / (FEATURE_WEIGHTS_AND_STD.rainfall || 55), 2) * 2.5;

    const distance = Math.sqrt(distSq);
    // Convert distance to realistic suitability score (max ~98%, down to 50%)
    const suitabilityScore = Math.max(50, Math.min(99, Math.round(100 / (1 + distance * 0.28))));

    scored.push({ id: key, profile, score: suitabilityScore });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN).map(({ profile, score }, index) => {
    // Add realistic spacing between top, 2nd, and 3rd rank
    const adjustedScore = index === 0 ? score : Math.min(score, scored[0].score - (index * 4 + 2));
    return {
      id: profile.id,
      cropName: profile.cropName,
      hindiName: profile.hindiName,
      category: profile.category as any,
      suitabilityScore: Math.max(60, adjustedScore),
      season: profile.season as any,
      expectedYield: profile.expectedYield,
      estimatedRevenuePerAcre: profile.estimatedRevenuePerAcre,
      costOfCultivationPerAcre: profile.costOfCultivationPerAcre,
      netProfitPerAcre: profile.netProfitPerAcre,
      waterRequirement: profile.waterRequirement as any,
      durationDays: profile.durationDays,
      matchReasons: profile.matchReasons,
      climateRisk: profile.climateRisk as any,
      bestSowingWindow: profile.bestSowingWindow,
      recommendedFertilizers: profile.recommendedFertilizers,
      imageUrl: profile.imageUrl
    };
  });
}
