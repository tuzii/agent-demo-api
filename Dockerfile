FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src

ENV PORT=4310
EXPOSE 4310
CMD ["node", "src/server.js"]
