import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import dns from 'node:dns';

// Configure DNS for MongoDB Atlas SRV if needed
try {
  const currentServers = dns.getServers();
  if (!currentServers || currentServers.length === 0 || currentServers.includes('127.0.0.1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch {
  // Ignore
}

const BASE_URL = 'http://localhost:5000/api/v1';
const ML_URL = 'http://127.0.0.1:8000';

const testFarmerA = {
  name: 'Vikram Singh',
  email: `audit_alpha_${Date.now()}@agritech360.internal`,
  phone: '+919876543210',
  password: 'StrongFarmerPassword@2026',
  district: 'Indore',
  state: 'Madhya Pradesh',
  landHolding: 7.5,
  soilType: 'Black Soil',
  irrigationType: 'Drip Irrigation',
  role: 'farmer'
};

const testFarmerB = {
  name: 'Anita Sharma',
  email: `audit_beta_${Date.now()}@agritech360.internal`,
  phone: '+919876543211',
  password: 'AnotherStrongPassword@2026',
  district: 'Nashik',
  state: 'Maharashtra',
  landHolding: 3.2,
  soilType: 'Red Soil',
  irrigationType: 'Sprinkler',
  role: 'farmer'
};

let tokenA = '';
let userA_Id = '';
let tokenB = '';
let userB_Id = '';
let parcelA_Id = '';

interface AuditResult {
  section: string;
  test: string;
  status: 'PASS' | 'FAIL';
  details: string;
}

const results: AuditResult[] = [];

function recordPass(section: string, test: string, details: string) {
  results.push({ section, test, status: 'PASS', details });
  console.log(`[PASS] [${section}] ${test}: ${details}`);
}

function recordFail(section: string, test: string, details: string) {
  results.push({ section, test, status: 'FAIL', details });
  console.error(`[FAIL] [${section}] ${test}: ${details}`);
}

async function runAudit() {
  console.log('====================================================');
  console.log('   AgriTech360 Comprehensive End-to-End Audit      ');
  console.log('====================================================');

  // ----------------------------------------------------
  // PHASE 2: AUTHENTICATION AUDIT
  // ----------------------------------------------------
  console.log('\n--- Phase 2: Authentication Audit ---');

  // Test 2.1: Duplicate / Incomplete Registration Validation
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bad_email', password: '123' })
    });
    assert.equal(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
    recordPass('Auth', 'Registration Input Validation', 'Correctly rejected invalid email and short password with 400 Bad Request');
  } catch (err: any) {
    recordFail('Auth', 'Registration Input Validation', err.message);
  }

  // Test 2.2: Register Farmer A
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testFarmerA)
    });
    assert.equal(res.status, 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(data.token, 'Token must be returned');
    assert.ok(data.user, 'Safe user must be returned');
    assert.equal(data.user.password, undefined, 'Password must never be exposed');
    assert.equal(data.user.email, testFarmerA.email.toLowerCase());
    tokenA = data.token;
    userA_Id = data.user.id || data.user._id;
    recordPass('Auth', 'Farmer Registration', `Successfully registered Farmer A (ID: ${userA_Id}) and received valid JWT`);
  } catch (err: any) {
    recordFail('Auth', 'Farmer Registration', err.message);
  }

  // Test 2.3: Duplicate Registration Rejection
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testFarmerA)
    });
    assert.equal(res.status, 409, `Expected 409 Conflict for duplicate email, got ${res.status}`);
    const data = await res.json() as any;
    assert.equal(data.success, false);
    recordPass('Auth', 'Duplicate Registration Prevention', 'Rejects duplicate email registration with 409 Conflict');
  } catch (err: any) {
    recordFail('Auth', 'Duplicate Registration Prevention', err.message);
  }

  // Test 2.4: Invalid Credentials Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testFarmerA.email,
        password: 'WrongPassword123!'
      })
    });
    assert.equal(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
    recordPass('Auth', 'Invalid Credentials Rejection', 'Rejects incorrect password with 401 Unauthorized');
  } catch (err: any) {
    recordFail('Auth', 'Invalid Credentials Rejection', err.message);
  }

  // Test 2.5: Valid Credentials Login & Password Verification
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testFarmerA.email,
        password: testFarmerA.password
      })
    });
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(data.token, 'Token must be issued upon login');
    assert.equal(data.user.email, testFarmerA.email.toLowerCase());
    assert.equal(data.user.password, undefined);
    recordPass('Auth', 'Password Verification & Login', 'Bcrypt password comparison succeeded, returned safe user object and JWT');
  } catch (err: any) {
    recordFail('Auth', 'Password Verification & Login', err.message);
  }

  // Test 2.6: Protected Route Authorization (/auth/me) with Bearer token
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.equal(data.user.id || data.user._id, userA_Id);
    assert.equal(data.user.district, testFarmerA.district);
    recordPass('Auth', 'Protected Route Authorization (/auth/me)', 'Successfully retrieved farmer identity using Bearer token');
  } catch (err: any) {
    recordFail('Auth', 'Protected Route Authorization (/auth/me)', err.message);
  }

  // Test 2.7: Protected Route Rejection without Bearer token
  try {
    const res = await fetch(`${BASE_URL}/auth/me`);
    assert.equal(res.status, 401, `Expected 401 Unauthorized without token, got ${res.status}`);
    recordPass('Auth', 'Unauthorized Rejection (/auth/me)', 'Protected route properly blocked unauthenticated request with 401');
  } catch (err: any) {
    recordFail('Auth', 'Unauthorized Rejection (/auth/me)', err.message);
  }

  // Test 2.8: Protected Route Rejection with Tampered Token
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token' }
    });
    assert.ok([401, 403].includes(res.status), `Expected 401/403 for tampered token, got ${res.status}`);
    recordPass('Auth', 'Tampered Token Rejection', 'Cryptographic verification rejected tampered JWT with 401/403');
  } catch (err: any) {
    recordFail('Auth', 'Tampered Token Rejection', err.message);
  }

  // Register Farmer B for multi-tenant isolation testing
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testFarmerB)
    });
    assert.equal(res.status, 201);
    const data = await res.json() as any;
    tokenB = data.token;
    userB_Id = data.user.id || data.user._id;
  } catch (err: any) {
    console.error('Failed to register Farmer B:', err);
  }

  // ----------------------------------------------------
  // PHASE 3: FARM MANAGEMENT & MULTI-TENANT ISOLATION
  // ----------------------------------------------------
  console.log('\n--- Phase 3: Farm Management & Multi-Tenant Isolation ---');

  // Test 3.1: Create Farm Parcel for Farmer A
  try {
    const parcelPayload = {
      name: 'North Canal Wheat Plot',
      surveyNumber: 'Khasra #302/1',
      village: 'Sanwer',
      district: 'Indore',
      state: 'Madhya Pradesh',
      areaAcres: 4.5,
      soilType: 'Black Soil',
      irrigationType: 'Drip Irrigation',
      currentCrop: 'Sharbati Wheat',
      croppingSeason: 'Rabi 2026',
      status: 'Active Cultivation'
    };

    const res = await fetch(`${BASE_URL}/farms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify(parcelPayload)
    });

    assert.equal(res.status, 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(data.parcel, 'Parcel object returned');
    assert.equal(data.parcel.name, parcelPayload.name);
    assert.equal(data.parcel.areaAcres, 4.5);
    parcelA_Id = data.parcel.id || data.parcel._id;
    recordPass('Farm Management', 'Parcel Creation', `Registered parcel "${parcelPayload.name}" (ID: ${parcelA_Id}) for Farmer A`);
  } catch (err: any) {
    recordFail('Farm Management', 'Parcel Creation', err.message);
  }

  // Test 3.2: Input Validation on Parcel Creation
  try {
    const badPayload = { name: '', areaAcres: -2.5 };
    const res = await fetch(`${BASE_URL}/farms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify(badPayload)
    });
    assert.equal(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
    recordPass('Farm Management', 'Parcel Input Validation', 'Rejected invalid acreage and empty parcel name with 400');
  } catch (err: any) {
    recordFail('Farm Management', 'Parcel Input Validation', err.message);
  }

  // Test 3.3: Fetch Farmer A's Parcels
  try {
    const res = await fetch(`${BASE_URL}/farms`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(Array.isArray(data.parcels), 'Parcels array returned');
    const found = data.parcels.some((p: any) => (p.id || p._id) === parcelA_Id);
    assert.ok(found, 'Created parcel must be present in farmer parcel list');
    assert.ok(data.totalAreaAcres >= 4.5, 'Total area acres calculated accurately');
    recordPass('Farm Management', 'Fetch Farmer Parcels', `Farmer A has ${data.parcels.length} parcel(s), Total Acres: ${data.totalAreaAcres}`);
  } catch (err: any) {
    recordFail('Farm Management', 'Fetch Farmer Parcels', err.message);
  }

  // Test 3.4: Update Farm Parcel
  try {
    const updatePayload = {
      currentCrop: 'Bt Cotton Hybrid',
      status: 'Active Cultivation'
    };
    const res = await fetch(`${BASE_URL}/farms/${parcelA_Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify(updatePayload)
    });
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.equal(data.parcel.currentCrop, 'Bt Cotton Hybrid');
    recordPass('Farm Management', 'Update Parcel', `Updated crop to "${data.parcel.currentCrop}" successfully`);
  } catch (err: any) {
    recordFail('Farm Management', 'Update Parcel', err.message);
  }

  // Test 3.5: Multi-Tenant Isolation - Farmer B cannot READ Farmer A's parcel
  try {
    const res = await fetch(`${BASE_URL}/farms/${parcelA_Id}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.ok([403, 404].includes(res.status), `Expected 403/404 for unauthorized parcel access, got ${res.status}`);
    recordPass('Farm Management', 'Tenant Isolation (Read Protection)', `Farmer B denied reading Farmer A's parcel (Status: ${res.status})`);
  } catch (err: any) {
    recordFail('Farm Management', 'Tenant Isolation (Read Protection)', err.message);
  }

  // Test 3.6: Multi-Tenant Isolation - Farmer B cannot MODIFY Farmer A's parcel
  try {
    const res = await fetch(`${BASE_URL}/farms/${parcelA_Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ currentCrop: 'Malicious Crop Override' })
    });
    assert.ok([403, 404].includes(res.status), `Expected 403/404 for unauthorized parcel update, got ${res.status}`);
    recordPass('Farm Management', 'Tenant Isolation (Write Protection)', `Farmer B denied modifying Farmer A's parcel (Status: ${res.status})`);
  } catch (err: any) {
    recordFail('Farm Management', 'Tenant Isolation (Write Protection)', err.message);
  }

  // Test 3.7: Multi-Tenant Isolation - Farmer B cannot DELETE Farmer A's parcel
  try {
    const res = await fetch(`${BASE_URL}/farms/${parcelA_Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.ok([403, 404].includes(res.status), `Expected 403/404 for unauthorized parcel deletion, got ${res.status}`);
    recordPass('Farm Management', 'Tenant Isolation (Delete Protection)', `Farmer B denied deleting Farmer A's parcel (Status: ${res.status})`);
  } catch (err: any) {
    recordFail('Farm Management', 'Tenant Isolation (Delete Protection)', err.message);
  }

  // Test 3.8: Farmer A Deletes Parcel
  try {
    const res = await fetch(`${BASE_URL}/farms/${parcelA_Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    recordPass('Farm Management', 'Delete Parcel', 'Farmer A successfully deleted their own parcel');
  } catch (err: any) {
    recordFail('Farm Management', 'Delete Parcel', err.message);
  }

  // ----------------------------------------------------
  // PHASE 4: DASHBOARD METRICS AUDIT
  // ----------------------------------------------------
  console.log('\n--- Phase 4: Dashboard Metrics Audit ---');

  // Test 4.1: Dashboard Metrics for Authenticated Farmer
  try {
    const res = await fetch(`${BASE_URL}/dashboard/metrics`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(Array.isArray(data.metrics || data.data), 'Metrics array returned');
    const metrics = data.metrics || data.data;
    assert.equal(metrics.length, 4, 'Should contain 4 core KPI cards');

    const totalLand = metrics.find((m: any) => m.id === 'total-land');
    assert.ok(totalLand, 'Total Land metric exists');
    assert.equal(totalLand.value, testFarmerA.landHolding, `Total land should match Farmer A landHolding (${testFarmerA.landHolding})`);

    const activeCrops = metrics.find((m: any) => m.id === 'active-crops');
    assert.ok(activeCrops, 'Active Crops metric exists');

    const weatherRisk = metrics.find((m: any) => m.id === 'weather-risk');
    assert.ok(weatherRisk, 'Weather Risk metric exists');

    const revenue = metrics.find((m: any) => m.id === 'revenue-estimate');
    assert.ok(revenue, 'Revenue Estimate metric exists');
    assert.ok(revenue.value > 0, 'Revenue estimate should be positive');

    recordPass('Dashboard', 'Authenticated Metrics Calculation', `Metrics computed dynamically: Land=${totalLand.value} Acres, Revenue=₹${revenue.value}`);
  } catch (err: any) {
    recordFail('Dashboard', 'Authenticated Metrics Calculation', err.message);
  }

  // Test 4.2: Dashboard Metrics for Unauthenticated / Guest Farmer
  try {
    const res = await fetch(`${BASE_URL}/dashboard/metrics`);
    assert.equal(res.status, 200, `Expected 200 OK for guest metrics, got ${res.status}`);
    const data = await res.json() as any;
    const metrics = data.metrics || data.data;
    assert.equal(metrics.length, 4, 'Guest metrics should contain 4 baseline cards');
    recordPass('Dashboard', 'Guest / Empty State Fallback', 'Dashboard gracefully responds with benchmark agronomic metrics for guest sessions');
  } catch (err: any) {
    recordFail('Dashboard', 'Guest / Empty State Fallback', err.message);
  }

  // ----------------------------------------------------
  // PHASE 5: WEATHER & ALERTS AUDIT
  // ----------------------------------------------------
  console.log('\n--- Phase 5: Weather & Alerts Audit ---');

  // Test 5.1: Weather Endpoint
  try {
    const res = await fetch(`${BASE_URL}/weather?location=Indore`);
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    const weather = data.weather || data.data;
    assert.ok(weather.location, 'Location must be defined');
    assert.ok(typeof weather.temperature === 'number', 'Temperature must be numeric');
    assert.ok(typeof weather.humidity === 'number', 'Humidity must be numeric');
    assert.ok(typeof weather.windSpeed === 'number', 'Wind speed must be numeric');
    assert.ok(['Excellent', 'Good', 'Fair', 'Poor'].includes(weather.spraySuitability), 'Spray suitability must be classified');
    assert.ok(weather.agriculturalAdvisory, 'Context-aware agricultural advisory returned');
    assert.ok(Array.isArray(weather.forecast7d), '7-day forecast array returned');
    recordPass('Weather', 'Agro-Meteorology Response', `Location: ${weather.location}, Temp: ${weather.temperature}°C, Spray Window: ${weather.spraySuitability}`);
  } catch (err: any) {
    recordFail('Weather', 'Agro-Meteorology Response', err.message);
  }

  // Test 5.2: Alerts Endpoint & Data Provenance
  try {
    const res = await fetch(`${BASE_URL}/alerts?location=Indore`);
    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(Array.isArray(data.data), 'Alerts array returned');
    assert.ok(data.data.length > 0, 'Alerts should not be empty');

    const validSourceTypes = ['live_telemetry', 'simulated_fallback', 'official_advisory'];
    const allValid = data.data.every((a: any) => validSourceTypes.includes(a.sourceType));
    assert.ok(allValid, 'All alerts must declare explicit provenance sourceType');

    recordPass('Alerts', 'Data Provenance & Aggregation', `Retrieved ${data.data.length} alerts with transparent source tracking: ${data.data.map((a: any) => a.sourceType).join(', ')}`);
  } catch (err: any) {
    recordFail('Alerts', 'Data Provenance & Aggregation', err.message);
  }

  // ----------------------------------------------------
  // PHASE 6: CROP RECOMMENDATION ML INTEGRATION AUDIT
  // ----------------------------------------------------
  console.log('\n--- Phase 6: Crop Recommendation ML Integration Audit ---');

  // Test 6.1: Direct Python ML Microservice Health
  try {
    const res = await fetch(`${ML_URL}/health`);
    assert.equal(res.status, 200, `Expected 200 OK from ML microservice, got ${res.status}`);
    const data = await res.json() as any;
    assert.equal(data.status, 'healthy');
    assert.equal(data.model_loaded, true);
    assert.equal(data.classes_count, 22);
    recordPass('ML Service', 'Python Health & Model Inspection', `Random Forest Model Loaded: 22 crop classes, features: ${data.features.join(', ')}`);
  } catch (err: any) {
    recordFail('ML Service', 'Python Health & Model Inspection', err.message);
  }

  // Test 6.2: End-to-End Prediction via Node.js Backend with Standard Features
  try {
    const standardInput = {
      N: 90,
      P: 42,
      K: 43,
      temperature: 24.5,
      humidity: 82.0,
      ph: 6.5,
      rainfall: 202.9,
      soilType: 'Clayey'
    };

    const startTime = Date.now();
    const res = await fetch(`${BASE_URL}/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(standardInput)
    });
    const latency = Date.now() - startTime;

    assert.equal(res.status, 200, `Expected 200 OK from crop recommendation flow, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(data.crop, 'Recommended crop returned');
    assert.ok(typeof data.confidence === 'number', 'Confidence score returned');
    assert.ok(data.recommendation, 'ICAR cultivation guidelines enriched');
    recordPass('Crop ML Integration', 'End-to-End Inference (Standard Parameters)', `Prediction: ${data.crop} (Confidence: ${(data.confidence * 100).toFixed(1)}%, Latency: ${latency}ms)`);
  } catch (err: any) {
    recordFail('Crop ML Integration', 'End-to-End Inference (Standard Parameters)', err.message);
  }

  // Test 6.3: End-to-End Prediction with Frontend Parameter Aliases
  try {
    const aliasInput = {
      nitrogen: 20,
      phosphorus: 60,
      potassium: 20,
      temperature: 28.0,
      moisture: 55.0,     // Alias for humidity
      phLevel: 7.2,       // Alias for ph
      rainfall: 75.0,
      soilType: 'Black Soil'
    };

    const res = await fetch(`${BASE_URL}/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aliasInput)
    });

    assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json() as any;
    assert.ok(data.crop, 'Recommended crop returned');
    assert.ok(data.recommendation.cropName, 'ICAR crop package returned');
    recordPass('Crop ML Integration', 'Alias Normalization (Frontend Compatibility)', `Normalized nitrogen/moisture/phLevel -> ${data.crop}`);
  } catch (err: any) {
    recordFail('Crop ML Integration', 'Alias Normalization (Frontend Compatibility)', err.message);
  }

  // Test 6.4: Input Bounds Validation Rejection
  try {
    const invalidInput = {
      nitrogen: 500, // Exceeds 300 kg/ha limit
      temperature: 25,
      rainfall: 100
    };
    const res = await fetch(`${BASE_URL}/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidInput)
    });
    assert.equal(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
    recordPass('Crop ML Integration', 'Validation Bounds Enforcement', 'Rejects nitrogen > 300 with 400 Bad Request');
  } catch (err: any) {
    recordFail('Crop ML Integration', 'Validation Bounds Enforcement', err.message);
  }

  // ----------------------------------------------------
  // CLEANUP TEST USERS
  // ----------------------------------------------------
  console.log('\n--- Cleanup Test Artifacts ---');
  try {
    const envUri = process.env.MONGODB_URI;
    // We can clean up by connecting directly to MongoDB Atlas
    if (envUri) {
      await mongoose.connect(envUri, { serverSelectionTimeoutMS: 5000 });
      const db = mongoose.connection.db;
      if (db) {
        const usersCol = db.collection('users');
        const farmsCol = db.collection('farmparcels');

        const deletedUsers = await usersCol.deleteMany({
          email: { $in: [testFarmerA.email.toLowerCase(), testFarmerB.email.toLowerCase()] }
        });
        const deletedParcels = await farmsCol.deleteMany({
          farmerId: { $in: [new mongoose.Types.ObjectId(userA_Id), new mongoose.Types.ObjectId(userB_Id)] }
        });
        console.log(`Cleaned up ${deletedUsers.deletedCount} test user(s) and ${deletedParcels.deletedCount} test parcel(s).`);
      }
      await mongoose.disconnect();
    }
  } catch (cleanupErr) {
    console.warn('Cleanup warning (non-fatal):', cleanupErr);
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('                 AUDIT SUMMARY                      ');
  console.log('====================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total Audit Checks: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => r.status === 'FAIL').forEach(f => console.log(` - [${f.section}] ${f.test}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('\nAll integration audit checks PASSED successfully!');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
