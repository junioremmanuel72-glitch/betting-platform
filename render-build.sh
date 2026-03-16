#!/usr/bin/env bash
# The script runs from the project root, so we need to go into the backend folder
cd backend || { echo "❌ backend folder not found"; exit 1; }
echo "📂 Changed directory to: $(pwd)"
npm install
npx prisma generate
npx prisma migrate deploy