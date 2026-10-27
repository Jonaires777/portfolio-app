FROM node:18.20.3 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Create React App le esta variavel no build, entao ela precisa existir aqui
ARG REACT_APP_BASE_URL=http://localhost:8080
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
