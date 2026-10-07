# 🌾 AgriTech360

AI-Powered Smart Agriculture Advisory Platform for Indian Farmers

## 📌 Project Overview

AgriTech360 is a Final Year B.Tech Capstone Project designed to empower Indian farmers through intelligent, data-driven agricultural recommendations.

The platform combines:

- Crop Recommendation System
- Weather Intelligence
- Mandi Price Monitoring
- Government Scheme Discovery
- Farm Profile Management
- Agricultural Analytics Dashboard

The goal is to provide farmers with actionable insights that improve productivity, profitability, and decision-making.

---

## 🎯 Project Objectives

- Improve crop selection using soil and environmental parameters.
- Provide real-time weather intelligence for farming activities.
- Track mandi prices and estimate harvest revenue.
- Increase awareness of government agricultural schemes.
- Digitize farmer profile and farm management records.
- Build a scalable architecture ready for AI/ML integration.

---

## 🛠 Frontend Tech Stack

| Technology | Purpose |
|------------|----------|
| React 19 | UI Development |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling Framework |
| React Context API | State Management |
| React Query | Data Fetching & Caching |
| Axios | API Communication |
| Local Storage | Session Persistence |

---

## 📂 Project Structure

```bash
src/
│
├── api/
│   ├── hooks/
│   ├── apiClient.ts
│   ├── agriService.ts
│   └── queryClient.ts
│
├── components/
│   ├── common/
│   ├── layout/
│   └── modules/
│
├── config/
│   └── env.ts
│
├── context/
│   ├── AuthContext.tsx
│   ├── AgriContext.tsx
│   └── ToastContext.tsx
│
├── data/
│   └── mockData.ts
│
├── types/
│   └── index.ts
│
├── App.tsx
└── main.tsx
```

---

# 🚀 Implemented Modules

## 1. Authentication Module

Features:

- Farmer Registration
- Login System
- Demo Login
- Local Session Persistence
- JWT Backend Ready Architecture

---

## 2. Dashboard Module

Features:

- Farm KPI Metrics
- Weather Summary
- Agricultural Advisory Banner
- Mandi Price Preview
- Smart Alerts

---

## 3. Crop Recommendation Module

Features:

- NPK Input Form
- Soil pH Analysis
- Moisture Analysis
- Climate Parameters
- Recommendation Cards
- Fertilizer Suggestions
- Soil Health Card Autofill

---

## 4. Weather Intelligence Module

Features:

- Current Weather Conditions
- 24-Hour Forecast
- 7-Day Forecast
- Spray Suitability Analysis
- Agricultural Advisory Insights

---

## 5. Mandi Price Monitoring Module

Features:

- APMC Market Rates
- Commodity Search
- Category Filters
- MSP Comparison
- Revenue Estimator

---

## 6. Government Schemes Module

Features:

- Scheme Discovery
- Eligibility Information
- Bookmarking
- Required Documents
- Direct Portal Links

---

## 7. Farmer Profile Management

Features:

- Personal Information
- Land Holdings
- Soil Information
- Irrigation Details
- Farm Record Management

---

# 🎨 UI/UX Enhancements

Implemented:

- Responsive Mobile Design
- Tablet Optimization
- Desktop Layout
- Accessibility (WCAG 2.1)
- Focus Management
- Keyboard Navigation
- Toast Notifications
- Empty States
- Loading Skeletons
- Error Recovery Screens

---

# 📡 API Integration Readiness

The frontend has been fully prepared for backend integration.

Supported endpoints:

```http
POST /api/v1/auth/login
POST /api/v1/auth/register

GET /api/v1/dashboard/metrics

GET /api/v1/weather

GET /api/v1/mandi

GET /api/v1/schemes

GET /api/v1/user/profile
PUT /api/v1/user/profile

POST /api/v1/crop/recommend
```

---

# ⚙ Environment Configuration

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_USE_MOCK_DATA=true
```

---

# 💻 Installation

Clone Repository

```bash
git clone https://github.com/EngHarshita/AgriTech360.git
```

Move into project

```bash
cd AgriTech360
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production version

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🧪 Verification

Completed Successfully:

- TypeScript Build ✅
- Vite Production Build ✅
- React Query Integration ✅
- Accessibility Audit ✅
- Responsive Design Audit ✅
- Error Handling Audit ✅
- Loading State Audit ✅

---

# 👥 Team Members

| Name | Role |
|--------|--------|
| Harshita | Frontend Lead |
| Divyanshi | Backend Lead |
| Khushi | Database & Testing |
| Pragati | ML & Research |

---

# 📅 Capstone Status

### Phase I – Project Initiation
✅ Completed

### Phase II – Planning & Design
✅ Completed

### Phase III – Frontend Implementation
✅ Completed

### Backend Integration
🔄 In Progress

### Database Integration
🔄 In Progress

### ML Model Integration
🔄 In Progress

---

# 🎓 Academic Information

Project Type: B.Tech Final Year Capstone Project

Domain: Smart Agriculture & Artificial Intelligence

Academic Session: 2026–27

---

© 2026 AgriTech360 Team