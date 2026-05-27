/**
 * env.js
 * Loads and validates all required environment variables at startup.
 * The app throws immediately if any required variable is missing,
 * so misconfiguration is caught before any request is served.
 */

require('dotenv').config();

// List every variable the app needs to function
const REQUIRED_VARS = [
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'FRONTEND_URL',
];

// Validate all required variables are present
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `[Config] Missing required environment variables: ${missing.join(', ')}`
  );
  console.error('[Config] Copy .env.example to .env and fill in all values.');
  process.exit(1);
}

// Export a single config object — never read process.env directly elsewhere
const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL,
  },
};

module.exports = config;
