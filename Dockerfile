# Oficial image of Playwright (includes all dependencies and browsers)
FROM mcr.microsoft.com/playwright:v1.56.0-jammy  

# Work directory
WORKDIR /app

# Copy dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

# Copy the code
COPY . .

# Commands
CMD ["pnpm", "run", "scrape:example"]
