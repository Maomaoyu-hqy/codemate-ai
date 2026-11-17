FROM node:20-alpine

WORKDIR /app

COPY package.json server.js ./
COPY public ./public
COPY src ./src

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
