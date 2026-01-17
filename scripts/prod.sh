set -e

echo "Starting Acquisition App in Production Mode"
echo "==============================================="

if [ ! -f .env.prod ]; then
  echo "Error .env.dev file not found"
  exit 1
fi

if ! docker info> /dev/null 2>&1; then
  echo 'Error docker is not running'
  exit 1
fi

echo 'Running migration on Neon...'
node scripts/migrate.js
echo 'Successfully completed migration of database to Neon'

echo "Starting production container..."
docker compose -f docker-compose.prod.yml up --build

echo ""
echo "   Production environment started!"
echo "   Application: http://localhost:3000"
