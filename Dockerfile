FROM node:22.12.0-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]