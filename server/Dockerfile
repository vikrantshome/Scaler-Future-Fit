FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm install --production

COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]
