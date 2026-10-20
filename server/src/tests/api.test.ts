import test from 'node:test';
import assert from 'node:assert/strict';
import { Server } from 'http';
import app from '../app';
import { connectDB, disconnectDB } from '../config/database';

let server: Server;
let baseUrl: string;

test.before(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Test setup: Database connection warning:', err);
  }

  await new Promise<void>((resolve) => {
    // Listen on ephemeral random port to prevent conflicts
    server = app.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await disconnectDB();
});

test('1. Backend Health Endpoint - returns operational telemetry', async () => {
  const res = await fetch(`${baseUrl}/api/v1/health`);
  // Either 200 (healthy) or 503 (degraded mode while Atlas is offline)
  assert.ok([200, 503].includes(res.status), `Unexpected status code: ${res.status}`);

  const body = (await res.json()) as any;
  assert.ok(body.data, 'Response should contain data payload');
  assert.ok(['healthy', 'degraded'].includes(body.data.status));
  assert.ok(body.data.database, 'Should report database connection status');
  assert.ok(typeof body.data.uptime === 'number');
});

test('2. Root Discovery Endpoint - exposes active route catalog', async () => {
  const res = await fetch(`${baseUrl}/api/v1`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  assert.ok(body.data.endpoints.crops);
  assert.ok(body.data.endpoints.alerts);
  assert.ok(body.data.endpoints.weather);
});

test('3. Alerts API - returns categorized farm alerts with source tracking', async () => {
  const res = await fetch(`${baseUrl}/api/v1/alerts?location=Indore`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length > 0);

  const first = body.data[0];
  assert.ok(first.id);
  assert.ok(first.title);
  assert.ok(first.category);
  assert.ok(['live_telemetry', 'simulated_fallback', 'official_advisory'].includes(first.sourceType));
});

test('4. Authentication Validation - rejects missing login credentials', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 400);

  const body = (await res.json()) as any;
  assert.equal(body.success, false);
});

test('5. Authentication Validation - rejects incomplete registration', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Farmer' })
  });
  assert.equal(res.status, 400);

  const body = (await res.json()) as any;
  assert.equal(body.success, false);
});

test('6. Crop Recommendation Validation - rejects missing body or parameters', async () => {
  const res = await fetch(`${baseUrl}/api/v1/crops/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 400);

  const body = (await res.json()) as any;
  assert.equal(body.success, false);
});

test('7. Crop Recommendation Validation - rejects out-of-range NPK values', async () => {
  const res = await fetch(`${baseUrl}/api/v1/crops/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nitrogen: 9999, // Out of bounds (0-300)
      phosphorus: 50,
      potassium: 50,
      temperature: 25,
      moisture: 50,
      phLevel: 6.5,
      rainfall: 100
    })
  });
  assert.equal(res.status, 400);

  const body = (await res.json()) as any;
  assert.equal(body.success, false);
  assert.match(body.message, /nitrogen/i);
});

test('8. Weather Intelligence Fallback - responds reliably with localized agro-meteorology', async () => {
  const res = await fetch(`${baseUrl}/api/v1/weather?location=Indore`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  const weather = body.weather || body.data;
  assert.ok(weather.location);
  assert.ok(typeof weather.temperature === 'number');
  assert.ok(['Excellent', 'Good', 'Fair', 'Poor'].includes(weather.spraySuitability));
  assert.ok(Array.isArray(weather.forecast7d));
});

test('9. Mandi Prices Endpoint - returns seeded APMC market rates with pagination', async () => {
  const res = await fetch(`${baseUrl}/api/v1/mandi?limit=50`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.prices));
  assert.ok(body.prices.length > 0, 'Should return seeded mandi records');
  assert.ok(body.pagination.total >= 50, 'Total records in DB should match seeded APMC data');

  const first = body.prices[0];
  assert.ok(first.commodity);
  assert.ok(first.market);
  assert.ok(typeof first.modalPrice === 'number');
});

test('10. Mandi Revenue Estimator - accurately computes gross and net revenue against MSP', async () => {
  const res = await fetch(`${baseUrl}/api/v1/mandi/estimate?commodity=Wheat&quantity=50`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  assert.ok(body.estimation);
  assert.equal(body.estimation.commodity, 'Wheat');
  assert.equal(body.estimation.quantityQtl, 50);
  assert.ok(body.estimation.estimatedGrossRevenue > 0);
  assert.ok(typeof body.estimation.netGainOverMsp === 'number');
});

test('11. Government Schemes Endpoint - returns seeded agricultural schemes with category filtering', async () => {
  const res = await fetch(`${baseUrl}/api/v1/schemes?limit=50`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.schemes));
  assert.ok(body.schemes.length >= 20, 'Should return seeded schemes');
  assert.equal(body.pagination.total, 26, 'Should report 26 total seeded schemes');

  // Verify category filter works
  const resCat = await fetch(`${baseUrl}/api/v1/schemes?category=Financial%20Assistance`);
  const bodyCat = (await resCat.json()) as any;
  assert.equal(resCat.status, 200);
  assert.ok(bodyCat.schemes.every((s: any) => s.category === 'Financial Assistance'));
});

test('12. Single Scheme Retrieval - retrieves full guidelines and official portal URL', async () => {
  const res = await fetch(`${baseUrl}/api/v1/schemes/PM-KISAN`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.success, true);
  const scheme = body.scheme || body.data;
  assert.equal(scheme.shortCode, 'PM-KISAN');
  assert.ok(scheme.title.includes('Kisan'));
  assert.ok(scheme.benefits.length > 0);
  assert.ok(scheme.officialWebsite.includes('pmkisan.gov.in'));
});

