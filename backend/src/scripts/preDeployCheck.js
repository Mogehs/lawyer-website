import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

console.log(`${colors.cyan}================================${colors.reset}`);
console.log(`${colors.cyan}   Deployment Pre-Check${colors.reset}`);
console.log(`${colors.cyan}================================${colors.reset}\n`);

let hasErrors = false;

// Check required environment variables
const requiredVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

console.log(`${colors.cyan}Checking environment variables...${colors.reset}`);

requiredVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`${colors.green}✓${colors.reset} ${varName}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${varName} - Missing!`);
    hasErrors = true;
  }
});

console.log();

// Check JWT secret strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.log(
    `${colors.yellow}⚠${colors.reset} JWT_SECRET is too short (< 32 characters). Consider using a stronger secret.`
  );
}

// Test database connection
console.log(`${colors.cyan}Testing database connection...${colors.reset}`);

try {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log(
    `${colors.green}✓${colors.reset} Database connection successful`
  );
  console.log(`  Database: ${mongoose.connection.name}`);
  console.log(`  Host: ${mongoose.connection.host}`);
  await mongoose.connection.close();
} catch (error) {
  console.log(
    `${colors.red}✗${colors.reset} Database connection failed: ${error.message}`
  );
  hasErrors = true;
}

console.log();

// Summary
if (hasErrors) {
  console.log(`${colors.red}================================${colors.reset}`);
  console.log(
    `${colors.red}   Pre-check Failed!${colors.reset}`
  );
  console.log(`${colors.red}================================${colors.reset}\n`);
  console.log("Please fix the errors above before deploying.\n");
  process.exit(1);
} else {
  console.log(`${colors.green}================================${colors.reset}`);
  console.log(
    `${colors.green}   All Checks Passed!${colors.reset}`
  );
  console.log(`${colors.green}================================${colors.reset}\n`);
  console.log("Your backend is ready for deployment! 🚀\n");
  console.log("Run: npm run deploy\n");
  process.exit(0);
}

