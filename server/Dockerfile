FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Cloud Run expects the container to listen on port 8080 by default, 
# or the port specified by the PORT env var.
# We'll use the environment variable which usually defaults to 8080 on Cloud Run.
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
