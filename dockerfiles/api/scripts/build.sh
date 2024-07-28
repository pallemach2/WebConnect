#!/bin/bash

cd /usr/src/app/appfiles
npm install

# Generate db-client
echo 'Generating database client...'
npx dotenv-cli -e .env -- npx prisma generate

npm run start:dev

