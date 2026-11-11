import test from 'node:test';
import assert from 'node:assert/strict';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../app';
import { config } from '../config';
import { connectDB, disconnectDB } from '../config/database';

let server: Server;
let baseUrl: string;

test.before(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Database offline or not running in test environment:', err);
  }

  await new Promise<void>((resolve) => {
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

// Helpers to generate valid test JWTs with application secret
const generateTestToken = (payload: { userId: string; role: 'farmer' | 'buyer' | 'admin'; email: string }, expiresIn = '1h') => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn } as jwt.SignOptions);
};

test('Scenario 1 & 4: Farmer registration validation requires agricultural attributes', async () => {
  // Missing landHolding & soilType for farmer role
  const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Ramesh Patel',
      email: 'ramesh.farmer@example.com',
      password: 'StrongPassword123!',
      phone: '9876543210',
      role: 'farmer',
      district: 'Indore',
      state: 'Madhya Pradesh'
      // missing landHolding, soilType, irrigationType
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('landHolding') || details.includes('soilType'));
});

test('Scenario 2: Buyer registration is disallowed in farmer portal', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Sharma',
      email: 'priya.buyer@example.com',
      password: 'StrongPassword123!',
      phone: '9876543211',
      role: 'buyer',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      landHolding: 5,
      soilType: 'Black',
      irrigationType: 'Drip'
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('Invalid role') || details.includes('farmer'));
});

test('Scenario 3: Missing required registration credentials', async () => {
  // Missing password and email
  const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Incomplete User'
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
});

test('Scenario 3: Missing login credentials rejected with HTTP 400', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'someone@example.com'
      // missing password
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('Password is required') || details.includes('password'));
});

test('Scenario 9: Attempted public admin registration is strictly rejected', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Malicious Actor',
      email: 'admin.exploit@example.com',
      password: 'StrongPassword123!',
      phone: '9876543212',
      role: 'admin', // Escalation attempt
      district: 'Indore',
      state: 'Madhya Pradesh'
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message} ${JSON.stringify(data.errors || [])}`;
  assert.ok(
    details.includes('Admin registration is not allowed') ||
    details.includes('Role must be') ||
    details.includes('Invalid registration input')
  );
});

test('Scenario 6 & 7: Unauthenticated request to protected route is rejected with HTTP 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/user/profile`);
  assert.equal(res.status, 401);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
});

test('Scenario 6: Malformed / forged token is rejected with HTTP 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/user/profile`, {
    headers: {
      Authorization: 'Bearer invalid.forged.jwttoken'
    }
  });
  assert.equal(res.status, 401);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
});

test('Scenario 6: Expired token is rejected with HTTP 401', async () => {
  // Generate token expired 10 minutes ago
  const expiredToken = jwt.sign(
    { userId: '507f1f77bcf86cd799439011', role: 'farmer', email: 'farmer@example.com' },
    config.jwt.secret,
    { expiresIn: '-10m' }
  );

  const res = await fetch(`${baseUrl}/api/v1/user/profile`, {
    headers: {
      Authorization: `Bearer ${expiredToken}`
    }
  });
  assert.equal(res.status, 401);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
});

test('Scenario 8: Buyer attempting to access Farmer-only route (/api/v1/farms) is rejected with HTTP 403', async () => {
  const buyerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439012',
    role: 'buyer',
    email: 'buyer.corporate@agrocorp.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/farms`, {
    headers: {
      Authorization: `Bearer ${buyerToken}`
    }
  });

  assert.equal(res.status, 403);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message || ''} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('restricted') || details.includes('roles'));
});

test('Scenario 7: Farmer token is accepted on Farmer-authorized route (/api/v1/farms)', async () => {
  const farmerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'farmer',
    email: 'ramesh.farmer@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/farms`, {
    headers: {
      Authorization: `Bearer ${farmerToken}`
    }
  });

  // When MongoDB is offline, it returns 500/503 from farmService rather than 401/403 authorization rejection
  assert.notEqual(res.status, 401, 'Should not be rejected as unauthenticated');
  assert.notEqual(res.status, 403, 'Farmer must not be forbidden from farm routes');
});

test('Scenario 10: Password hashing security - bcrypt salt and hash verification', async () => {
  const rawPassword = 'SecurePassword2026!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);

  // Hash must never equal plaintext password
  assert.notEqual(hash, rawPassword);
  assert.ok(hash.startsWith('$2'), 'Must be a valid bcrypt hash');

  // Comparison verification
  const isMatch = await bcrypt.compare(rawPassword, hash);
  assert.equal(isMatch, true, 'Correct password verifies successfully');

  const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
  assert.equal(isWrongMatch, false, 'Incorrect password correctly rejected');
});

test('Scenario 11: Live backend database unavailable returns graceful error without crashing', async () => {
  // Test health endpoint reports degraded status when DB is down
  const res = await fetch(`${baseUrl}/api/v1/health`);
  assert.ok([200, 503].includes(res.status));
  const data = (await res.json()) as any;
  assert.ok(data.data.status);
});

test('Scenario 12: Farm creation validates positive area and rejects negative/zero values', async () => {
  const farmerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'farmer',
    email: 'ramesh.farmer@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/farms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${farmerToken}`
    },
    body: JSON.stringify({
      name: 'South Field',
      areaAcres: -2.5, // invalid negative area
      district: 'Indore',
      state: 'Madhya Pradesh'
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message || ''} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('areaAcres') || details.includes('positive'));
});

test('Scenario 13: Farm creation validates name length', async () => {
  const farmerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'farmer',
    email: 'ramesh.farmer@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/farms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${farmerToken}`
    },
    body: JSON.stringify({
      name: 'A', // too short (< 2 chars)
      areaAcres: 3.5,
      district: 'Indore',
      state: 'Madhya Pradesh'
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message || ''} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('name'));
});

test('Scenario 14: Farm update rejects invalid parcel status', async () => {
  const farmerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'farmer',
    email: 'ramesh.farmer@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/farms/507f1f77bcf86cd799439099`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${farmerToken}`
    },
    body: JSON.stringify({
      status: 'Abandoned_Invalid_Status'
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message || ''} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('status'));
});

test('Scenario 15: Buyer account receives 403 Forbidden for farm mutations (POST/PUT/DELETE)', async () => {
  const buyerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439014',
    role: 'buyer',
    email: 'priya.buyer@example.com'
  });

  // Test POST /farms with buyer role
  const postRes = await fetch(`${baseUrl}/api/v1/farms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`
    },
    body: JSON.stringify({
      name: 'Unauthorized Field',
      areaAcres: 5.0
    })
  });
  assert.equal(postRes.status, 403, 'Buyer must be forbidden from creating farm parcels');

  // Test DELETE /farms/:id with buyer role
  const delRes = await fetch(`${baseUrl}/api/v1/farms/507f1f77bcf86cd799439099`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${buyerToken}`
    }
  });
  assert.equal(delRes.status, 403, 'Buyer must be forbidden from deleting farm parcels');
});

test('Scenario 16: Crop recommendation rejects invalid negative soil nutrient values', async () => {
  const res = await fetch(`${baseUrl}/api/v1/crops/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nitrogen: -15, // invalid negative N
      phosphorus: 40,
      potassium: 30,
      temperature: 25,
      humidity: 60,
      ph: 6.5,
      rainfall: 200
    })
  });

  assert.equal(res.status, 400);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
  const details = `${data.message || ''} ${JSON.stringify(data.errors || [])}`;
  assert.ok(details.includes('nitrogen') || details.includes('negative'));
});

test('Scenario 17: Mandi and Schemes API endpoints return structured response without unhandled crashes', async () => {
  const mandiRes = await fetch(`${baseUrl}/api/v1/mandi`);
  assert.ok([200, 500, 503].includes(mandiRes.status));
  const mandiData = (await mandiRes.json()) as any;
  assert.ok(typeof mandiData.success === 'boolean');

  const schemesRes = await fetch(`${baseUrl}/api/v1/schemes`);
  assert.ok([200, 500, 503].includes(schemesRes.status));
  const schemesData = (await schemesRes.json()) as any;
  assert.ok(typeof schemesData.success === 'boolean');
});

test('Scenario 18: Unauthenticated access to admin endpoints is rejected with HTTP 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/overview`);
  assert.equal(res.status, 401);
  const data = (await res.json()) as any;
  assert.equal(data.success, false);
});

test('Scenario 19: Farmer and Buyer roles receive HTTP 403 Forbidden on admin endpoints', async () => {
  const farmerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'farmer',
    email: 'farmer.user@example.com'
  });
  const buyerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439014',
    role: 'buyer',
    email: 'buyer.user@example.com'
  });

  const farmerRes = await fetch(`${baseUrl}/api/v1/admin/overview`, {
    headers: { Authorization: `Bearer ${farmerToken}` }
  });
  assert.equal(farmerRes.status, 403, 'Farmer role must be rejected with 403 on admin routes');

  const buyerRes = await fetch(`${baseUrl}/api/v1/admin/overview`, {
    headers: { Authorization: `Bearer ${buyerToken}` }
  });
  assert.equal(buyerRes.status, 403, 'Buyer role must be rejected with 403 on admin routes');
});

test('Scenario 20: Admin user can access /api/v1/admin/overview with valid telemetry metrics', async () => {
  const adminToken = generateTestToken({
    userId: '507f1f77bcf86cd799439099',
    role: 'admin',
    email: 'admin.user@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const json = (await res.json()) as any;
  assert.equal(json.success, true);
  assert.ok(typeof json.data.totalUsers === 'number');
  assert.ok(typeof json.data.totalFarmers === 'number');
  assert.ok(typeof json.data.databaseStatus === 'string');
  assert.ok(typeof json.data.systemUptimeSeconds === 'number');
});

test('Scenario 21: Admin user can access /api/v1/admin/health with system subsystem statuses', async () => {
  const adminToken = generateTestToken({
    userId: '507f1f77bcf86cd799439099',
    role: 'admin',
    email: 'admin.user@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/health`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const json = (await res.json()) as any;
  assert.equal(json.success, true);
  assert.ok(typeof json.data.subsystems === 'object');
  assert.ok(json.data.subsystems.mongodb);
  assert.ok(json.data.subsystems.weatherService);
});

test('Scenario 22: Admin user can query paginated users with filter', async () => {
  const adminToken = generateTestToken({
    userId: '507f1f77bcf86cd799439099',
    role: 'admin',
    email: 'admin.user@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/users?role=all&status=all&page=1&limit=10`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const json = (await res.json()) as any;
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data.users));
  assert.ok(typeof json.data.total === 'number');
});

test('Scenario 23: Self-lockout prevention rejects admin attempting to suspend own account with HTTP 400', async () => {
  const adminId = '507f1f77bcf86cd799439099';
  const adminToken = generateTestToken({
    userId: adminId,
    role: 'admin',
    email: 'admin.user@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/users/${adminId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'suspended', reason: 'Accidental lockout attempt' })
  });

  assert.equal(res.status, 400, 'Self-suspension must return 400 Bad Request');
  const json = (await res.json()) as any;
  assert.equal(json.success, false);
  assert.ok(json.message.includes('cannot suspend their own account'));
});

test('Scenario 24: Non-admin attempt to patch user status returns HTTP 403', async () => {
  const farmerToken = generateTestToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'farmer',
    email: 'farmer.user@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/users/507f1f77bcf86cd799439014/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${farmerToken}`
    },
    body: JSON.stringify({ status: 'suspended' })
  });

  assert.equal(res.status, 403, 'Non-admin role must be forbidden from updating account status');
});

test('Scenario 25: Admin audit logs endpoint returns audit records', async () => {
  const adminToken = generateTestToken({
    userId: '507f1f77bcf86cd799439099',
    role: 'admin',
    email: 'admin.user@example.com'
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/logs?limit=10`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const json = (await res.json()) as any;
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data) || Array.isArray(json.logs));
});


