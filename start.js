const { spawn } = require('node:child_process');
const path = require('node:path');

// Start backend server
function startBackend() {
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
  });

  backend.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });

  return backend;
}

// Start frontend server
function startFrontend() {
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('Failed to start frontend:', err);
  });

  return frontend;
}

console.log('Starting servers...');

const backend = startBackend();
const frontend = startFrontend();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});