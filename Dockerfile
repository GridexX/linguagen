# Use an official Node.js runtime as a parent image
FROM node:20

# Set the environment variable
ENV NODE_ENV=production
ENV API_KEY=your_api_key

# Copy needed files
COPY package.json .
COPY package-lock.json .
COPY out out

RUN npm ci

# Expose any necessary ports
EXPOSE 3000

# Run the application
ENTRYPOINT ["node", "out"]
