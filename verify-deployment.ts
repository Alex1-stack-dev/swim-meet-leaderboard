import fs from 'fs'
import path from 'path'

const requiredFiles = [
  'package.json',
  'vercel.json',
  'next.config.js',
  'tsconfig.json',
  '.env.example',
  'README.md'
];

const requiredEnvVars = [
  'NEXT_PUBLIC_TIME_MACHINE_API_URL',
  'NEXT_PUBLIC_TIME_MACHINE_API_KEY',
  'NEXT_PUBLIC_TIME_MACHINE_DEVICE_ID'
];

function verifyFiles() {
  const missing = requiredFiles.filter(file => 
    !fs.existsSync(path.join(process.cwd(), file))
  );

  if (missing.length > 0) {
    console.error('Missing required files:', missing);
    process.exit(1);
  }
}

function verifyEnvExample() {
  const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  const missingVars = requiredEnvVars.filter(v => !envExample.includes(v));

  if (missingVars.length > 0) {
    console.error('Missing environment variables in .env.example:', missingVars);
    process.exit(1);
  }
}

verifyFiles();
verifyEnvExample();
console.log('Deployment verification passed!');
