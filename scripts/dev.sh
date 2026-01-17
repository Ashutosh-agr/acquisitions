set -e

echo "Starting Acquisition App in Development Mode"
echo "================================================"

if [ ! -f .env.dev ]; then
  echo "Error .env.dev file not found"
  exit 1
fi

if ! docker info> /dev/null 2>&1; then
  echo 'Error docker is not running'
  exit 1
fi

echo 'Running database migrations in the docker container'
node scripts/migrate.js
echo 'Successfully completed migration of database to docker container'

echo 'Starting dev container...'
docker compose -f docker-compose.dev.yml up --build


echo ""
echo "   Development environment started!"
echo "   Application: http://localhost:5173"