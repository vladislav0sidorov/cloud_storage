# node:bookworm — предсобранные bcrypt без сборки на alpine
FROM node:22-bookworm-slim AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads/tmp

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "start"]
