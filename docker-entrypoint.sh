#!/bin/sh
set -e

DB_PATH="${DATABASE_URL:-/data/sqlite.db}"

# Initialize database on first run
if [ ! -f "$DB_PATH" ]; then
  echo "First run: creating database and seeding..."
  npx drizzle-kit push 2>&1
  npx tsx src/db/seed.ts 2>&1
  echo "Database ready."
fi

exec node server.js
