#!/usr/bin/env bash
# Usage: ./migrate.sh <MigrationName>
# Run from the api/ directory. Reads credentials from .env.

set -e

# Guard: must run from api/ directory
if [ ! -f "migrate.sh" ]; then
  echo "Error: Run this script from the api/ directory."
  echo "  cd api && ./migrate.sh <MigrationName>"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: ./migrate.sh <MigrationName>"
  exit 1
fi

MIGRATION_NAME="$1"

# Load .env safely (handles spaces, quotes, inline comments)
if [ -f .env ]; then
  while IFS='=' read -r key value; do
    [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
    value="${value%%#*}"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    value="$(echo "$value" | xargs)"
    export "$key=$value"
  done < .env
else
  echo "Error: .env file not found."
  echo "  Copy .env.example to .env and fill in values."
  exit 1
fi

# Check dotnet ef is available
if ! dotnet ef --version &>/dev/null; then
  echo "Error: dotnet-ef tool not found."
  echo "  Install it with: dotnet tool install --global dotnet-ef"
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
