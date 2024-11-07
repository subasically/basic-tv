FROM node:18
WORKDIR /app
COPY . .
RUN yarn install
# Expose default Nuxt port
EXPOSE 3000
# The command will be set by the Docker Compose file
CMD ["yarn", "dev"]