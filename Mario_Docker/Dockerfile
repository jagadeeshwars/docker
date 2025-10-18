#build stage

FROM node:18-alphine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

#deployment stage

FROM node:18-alphine

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install -g http-server

EXPOSE 9090

CMD ["http-server", "dist", "-p", "9090", "-c-1"]
