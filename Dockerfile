# Step 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Accept optional env vars like VITE_CLOUD_URL, VITE_TASK_URL
ARG VITE_CLOUD_URL
ARG VITE_TASK_URL
ENV VITE_CLOUD_URL=$VITE_CLOUD_URL
ENV VITE_TASK_URL=$VITE_TASK_URL

COPY . .

RUN npm run build

# Step 2: Serve the build with nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
