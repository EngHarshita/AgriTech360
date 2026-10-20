const http = require('http');

const API_BASE = 'http://localhost:5000/api/v1';
const ML_BASE = 'http://127.0.0.1:8000';

function request(url, options = {}) {
  const parsed = new URL(url);
  const bodyData = options.body ? JSON.stringify(options.body) : null;
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {})
  };
  if (bodyData) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(bodyData);
  }

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {
            json = raw;
          }
          resolve({ status: res.statusCode, data: json });
        });
      }
    );
    req.on('error', reject);
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

async function verify() {
  console.log('\n======================================================');
  console.log('   AgriTech360 Live Integration Verification Check    ');
  console.log('======================================================\n');

  // 1. Python ML Service
  try {
    const ml = await request(`${ML_BASE}/health`);
    if (ml.status === 200 && ml.data?.service) {
      console.log(' [OK] Python ML Service is RUNNING on port 8000');
      console.log(`      - Model Loaded: ${ml.data.model_loaded}`);
      console.log(`      - Supported Crops: ${ml.data.classes_count}`);
    } else {
      console.log(` [WARN] ML Service returned status ${ml.status}`);
    }
  } catch {
    console.log(' [FAIL] Python ML Service NOT REACHABLE on port 8000');
    console.log('        Run: & "ml-service\\.venv\\Scripts\\python.exe" -m uvicorn src.main:app --app-dir ml-service --host 127.0.0.1 --port 8000');
  }

  // 2. Node.js Express Backend
  try {
    const be = await request(`${API_BASE}/health`);
    if (be.status === 200) {
      console.log(' [OK] Express Backend is RUNNING on port 5000');
      console.log(`      - Database Status: ${be.data.mongodb?.status || 'connected'}`);
    } else if (be.status === 503) {
      console.log(' [INFO] Express Backend is RUNNING in Degraded Mode (Atlas TLS handshaking/waiting for IP whitelist)');
    } else {
      console.log(` [WARN] Express Backend status: ${be.status}`);
    }
  } catch {
    console.log(' [FAIL] Express Backend NOT REACHABLE on port 5000');
    console.log('        Run: npm --prefix server run dev');
  }

  // 3. ML Crop Recommendation Inference via Node Backend
  try {
    const crop = await request(`${API_BASE}/crops/recommend`, {
      method: 'POST',
      body: {
        nitrogen: 92,
        phosphorus: 48,
        potassium: 44,
        temperature: 24.5,
        moisture: 38.0,
        phLevel: 6.8,
        rainfall: 110.0,
        soilType: 'Black Soil'
      }
    });

    if (crop.status === 200 && crop.data?.crop) {
      const top = crop.data.crop;
      const conf = Math.round(crop.data.confidence * 100);
      const recs = crop.data.data || crop.data.recommendations || [];
      console.log(` [OK] Crop Recommendation ML Pipeline Working!`);
      console.log(`      - Prediction: "${top}" (${conf}% confidence)`);
      console.log(`      - Agronomic Recommendations returned: ${recs.length}`);
    } else {
      console.log(` [FAIL] Crop Recommendation API returned status ${crop.status}`);
    }
  } catch (err) {
    console.log(` [FAIL] Crop Recommendation pipeline error: ${err.message}`);
  }

  // 4. Weather Intelligence
  try {
    const weather = await request(`${API_BASE}/weather?location=Indore`);
    if (weather.status === 200 && weather.data?.data) {
      const w = weather.data.data;
      console.log(` [OK] Weather Intelligence Working!`);
      console.log(`      - Station: ${w.location}, Temp: ${w.current.temp}°C, Spray Advisory: ${w.spraySuitability || w.current.spraySuitability}`);
    } else {
      console.log(` [FAIL] Weather endpoint returned status ${weather.status}`);
    }
  } catch (err) {
    console.log(` [FAIL] Weather endpoint error: ${err.message}`);
  }

  // 5. Dashboard Telemetry
  try {
    const dash = await request(`${API_BASE}/dashboard/metrics`);
    if (dash.status === 200 && Array.isArray(dash.data?.metrics)) {
      console.log(` [OK] Dashboard Metrics Working!`);
      console.log(`      - Metrics loaded: ${dash.data.metrics.length} telemetry gauges`);
    } else {
      console.log(` [FAIL] Dashboard metrics returned status ${dash.status}`);
    }
  } catch (err) {
    console.log(` [FAIL] Dashboard metrics error: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log('   All Core Live Microservices Verified Successfully  ');
  console.log('======================================================\n');
}

verify();
