const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js development server...');
console.log('Current directory:', process.cwd());

const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
console.log('Next.js path:', nextPath);

const child = spawn(nextPath, ['dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' }
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
}); 