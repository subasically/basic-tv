# Stage 1: Build and run the script
FROM node:18 AS script

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV REGIONS=us,uk,ca
ENV TIMEZONE=America/Chicago

# Run the fetchChannelsEPG.js script and wait for it to finish
RUN node scripts/fetchChannelsEPG.js

# Stage 2: Build the application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Copy the generated files from the script stage
COPY --from=script /app/public/playlist.m3u8 /app/public/playlist.m3u8
COPY --from=script /app/public/epg.xml /app/public/epg.xml

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the application in production mode
CMD ["node", ".output/server/index.mjs"]