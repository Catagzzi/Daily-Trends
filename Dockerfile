FROM mcr.microsoft.com/playwright:v1.56.0-jammy  

# Work directory
WORKDIR /app

# Copy dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
