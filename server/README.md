# Project Management
##### This repository was create d for development the new project management in CE-KMITL 

## Install 
Cloning 
```bash
git clone git@github.com:ChickenDontEatPork/backend.git
```

Install Dependencies
```bash
npm install
```

Install Database
```bash
docker compose -f docker-compose.db.yml up -d
```

## Running
Development
```bash
npm run start:dev
```

Local Running
```bash
docker compose up -d
```

## Migration
```bash
npx prisma migrate dev --name init
```

## Commit
```bash
npm run commit [remoteName] [branchName]
```
