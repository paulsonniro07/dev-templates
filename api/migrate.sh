#!/usr/bin/env bash
# Usage: ./migrate.sh <MigrationName>
# Generates EF Core migration (reads credentials from .env) then rebuilds API container.

set -e

if [ -z "$1" ]; then
  echo "Usage: ./migrate.sh <MigrationName>"
  exit 1
fi

MIGRATION_NAME="$1"

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "Error: .env file not found. Copy .env.example to .env and fill in values."
  exit 1
fi

echo "==> Generating migration: $MIGRATION_NAME"
cd src/[ProjectName].API
ConnectionStrings__DefaultConnection="Host=${DB_HOST};Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD}" \
  dotnet ef migrations add "$MIGRATION_NAME" \
    --project ../[ProjectName].Infrastructure \
    --startup-project . \
    --output-dir ../../migrations
cd ../..

echo "==> Rebuilding API container..."
docker compose build api

echo "==> Restarting API container (migration applied on startup via db.Migrate())..."
docker compose up -d api

echo "==> Done! Migration '$MIGRATION_NAME' applied."
