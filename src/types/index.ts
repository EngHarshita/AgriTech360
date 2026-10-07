export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  farmDetails: {
    totalAcres: number;
    soilType: 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Loamy' | 'Sandy Loam';
    irrigationType: 'Drip' | 'Canal' | 'Borewell' | 'Rainfed' | 'Sprinkler';
    primaryCrops: string[];
    kisanCreditCardNo?: string;
  };
  memberSince: string;
}

export interface SoilParams {
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  phLevel: number;
  moisture: number; // %
  rainfall: number; // mm
  temperature: number; // C
  soilType: string;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  hindiName?: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Horticulture' | 'Oilseed' | 'Vegetable';
  suitabilityScore: number; // 0-100
  season: 'Kharif' | 'Rabi' | 'Zaid';
  expectedYield: string;
  estimatedRevenuePerAcre: number;
  costOfCultivationPerAcre: number;
  netProfitPerAcre: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  durationDays: number;
  matchReasons: string[];
  climateRisk: 'Low' | 'Moderate' | 'High';
  bestSowingWindow: string;
  recommendedFertilizers: {
    name: string;
    dosage: string;
  }[];
  imageUrl?: string;
}

export interface WeatherHour {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  pop: number; // probability of precipitation
  windSpeed: number;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  rainfallMm: number;
  humidity: number;
  spraySuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface WeatherIntelligence {
  location: string;
  state: string;
  coordinates: { lat: number; lng: number };
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    uvIndex: number;
    rainfallPast24h: number;
    soilTemperature: number;
    evapotranspiration: number;
  };
  agriculturalAdvisory: {
    title: string;
    level: 'Safe' | 'Caution' | 'Alert';
    message: string;
    irrigationRecommendation: string;
    pestRiskLevel: 'Low' | 'Moderate' | 'High';
  };
  hourly: WeatherHour[];
  forecast: WeatherDay[];
}

export interface MandiPriceItem {
  id: string;
  commodity: string;
  hindiName?: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  modalPrice: number; // Rs per Quintal
  minPrice: number;
  maxPrice: number;
  priceChange: number; // percentage +/-
  volumeTradedTons: number;
  lastUpdated: string;
  msp: number; // Minimum Support Price
  trend: 'up' | 'down' | 'stable';
  category: 'Grains' | 'Pulses' | 'Oilseeds' | 'Spices' | 'Vegetables' | 'Fruits' | 'Commercial';
}

export interface GovernmentScheme {
  id: string;
  title: string;
  shortCode: string;
  department: string;
  category: 'Financial Assistance' | 'Crop Insurance' | 'Irrigation & Machinery' | 'Soil & Fertilizers' | 'Organic Farming' | 'Solar Energy';
  subsidyAmount: string;
  targetBeneficiaries: string;
  description: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  keyBenefits: string[];
  deadline: string;
  status: 'Open' | 'Upcoming' | 'Active Enrollment';
  officialPortalUrl: string;
  isPopular?: boolean;
}

export interface FarmAlert {
  id: string;
  title: string;
  category: 'weather' | 'pest' | 'price' | 'scheme' | 'system';
  type: 'danger' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface FarmMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  description: string;
  iconName: string;
}
