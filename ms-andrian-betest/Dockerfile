# Use Node.js 16 as the base image
FROM node:lts-slim

# Set the working directory to /app
WORKDIR /app

ENV PORT=3000
ENV URI='mongodb+srv://andrianaji06:bxNHK0SRYCbN73Yx@cluster0.n9dab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
ENV SECRET="secret"
ENV TOPIC="kafka_andrian_betest"
ENV REDIS="redisandrianbetest"
ENV REDIS_PORT="13997"
ENV REDIS_HOST="redis-13997.c256.us-east-1-2.ec2.redns.redis-cloud.com"
ENV REDIS_PASSWORD="Vy4vVLZfwdpzwcnkeqm87SVHX1A1R1TT"

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json /app/

# 1 Install dependencies
RUN npm install && npm cache clean --force
RUN npm install -g nodemon

#2 Install setup for development

# Copy the rest of the application files
COPY ./ ./

# Start the application
CMD ["npm", "start"]


