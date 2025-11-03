# Avantio: News API and Scraper

Technical assessment project for Avantio. A REST API to manage news articles with an  automated scraping from El País and El Mundo newspapers.

## Features

- **REST API** with Express + TypeScript + MongoDB
- **Web Scraper** using Playwright for El País and El Mundo
- **Docker**
- **Unit Tests** with Jest
- **CI/CD** with GitHub Actions
- **AWS ECS** deployment with ECR

### Full API Documentation

Complete API documentation available at:  
**[Postman Documentation](https://documenter.getpostman.com/view/6446320/2sB3WpRM5h)**

## Project Structure

```
avantio/
├── controllers/        # API route handlers
├── services/          
│   ├── feed/          # Business logic for news
│   └── scraper/       # Web scrapers
├── repositories/      # Database layer
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middlewares/       # Auth, validation, error handling
├── types/             # TypeScript types
└── utils/             # Error definitions browser manager
```

## Quick Start with Docker

### 1. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with the right configuration. Environment variables will be provided separately by email.

### 2. Build Docker image

```bash
docker build -t avantio-api .
```

### 3. Run the container

**Option A: Run in background**
```bash
docker run -d --name avantio-api -p 3000:3000 --env-file .env avantio-api
```

**Option B: Run with live logs**
```bash
docker run --name avantio-api -p 3000:3000 --env-file .env avantio-api
```

### 4. View logs (if running in background)

```bash
docker logs -f avantio-api
```

## Using the API

### Base URL
```
http://localhost:3000/api
```


## Running the Scraper

```bash
docker exec avantio-api npm run scrape
```

## Test coverage

To check the test coverage run the following command:

```bash
pnpm run test:coverage
```

Then a coverage folder should be created in the root path, so now you can check the coverage opening this file:

```bash
open coverage/lcov-report/index.html
```



## AWS Deployment

The project is deployed on AWS with the following architecture:

### API Service
- **ECS Fargate** - API running as a service with public IP
- **ECR** - Docker image registry
- **GitHub Actions** - Automated CI/CD pipeline
- The API is publicly accessible and can be consumed freely
### Scraper
- **EventBridge Scheduler** - Triggers scraper execution on schedule and runs every 4 hours `pnpm run scrape` as a one-off task
- Automatically fetches and stores news from El País and El Mundo

