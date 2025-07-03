#!/bin/sh

set -e

echo "Running pending TypeORM migrations..."
npm run migration:run

echo "Starting NestJS application..."
npm start
