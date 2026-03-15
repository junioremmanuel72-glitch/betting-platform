#!/usr/bin/env bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy