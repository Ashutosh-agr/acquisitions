import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import 'dotenv/config';

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {rejectUnauthorized: false},
});

await client.connect();

await client.query(
  `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`
);

const migrationDir = path.resolve('migrations');
const files = fs.readdirSync(migrationDir).sort();

for(const file of files) {

  const res = await client.query(
    'SELECT 1 FROM schema_migrations WHERE version = $1',[file]
  );

  if(res.rowCount > 0){
    console.log(`Skipping file ${file}`);
    continue;
  }

  console.log(`Applying files: ${file}`);

  const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [
      file,
    ]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

await client.end();
console.log('Migration complete');