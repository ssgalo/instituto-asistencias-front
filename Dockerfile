FROM node:20-alpine AS build

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/dist .
