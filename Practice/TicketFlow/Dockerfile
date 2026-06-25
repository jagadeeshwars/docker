FROM node:18-alpine AS base

WORKDIR /app

FROM base AS frontend-base

COPY frontend/package*.json .

RUN npm install && npm cache clean --force

COPY frontend/angular.json frontend/tsconfig.json ./

COPY frontend/src ./src

FROM frontend-base AS frontend-build

RUN npm run build

FROM base AS backend-build

COPY backend/package* ./

RUN npm install && npm cache clean --force

COPY backend/server.js ./

COPY backend/config ./config

COPY backend/controllers ./controllers

COPY backend/middleware ./middleware

COPY backend/routes ./routes

COPY backend/routes ./routes

COPY backend/models ./models

FROM backend-build AS backend-prod

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]

FROM nginx:alpine AS frontend-prod

COPY --from=frontend-build /app/dist/frontend /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]