import pkg from 'pg';

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DB_URL,

  // Neon requires SSL
  ssl: {
    rejectUnauthorized: false,
  },

  // Important for serverless environments
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('connect', () => {
  console.log('Connected to Neon Postgres');
});
