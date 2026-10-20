const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const mlDir = path.join(rootDir, 'ml-service');

const winVenv = path.join(mlDir, '.venv', 'Scripts', 'python.exe');
const unixVenv = path.join(mlDir, '.venv', 'bin', 'python');

let pythonBin = 'python';
if (fs.existsSync(winVenv)) {
  pythonBin = winVenv;
} else if (fs.existsSync(unixVenv)) {
  pythonBin = unixVenv;
}

const customScript = process.argv[2];
let args = [];
let workingDir = rootDir;

if (customScript) {
  console.log(`[ML Runner] Executing Python script: ${customScript} with ${pythonBin}`);
  args = [path.join(mlDir, customScript), ...process.argv.slice(3)];
  workingDir = mlDir;
} else {
  console.log(`[ML Service] Starting FastAPI Microservice with: ${pythonBin}`);
  args = ['-m', 'uvicorn', 'src.main:app', '--app-dir', 'ml-service', '--host', '127.0.0.1', '--port', '8000', '--reload'];
}

const proc = spawn(pythonBin, args, {
  cwd: workingDir,
  stdio: 'inherit',
  shell: false
});

proc.on('error', (err) => {
  console.error('[ML Service] Failed to start Python process:', err);
  process.exit(1);
});

proc.on('close', (code) => {
  process.exit(code || 0);
});
