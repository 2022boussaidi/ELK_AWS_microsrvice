# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
# Set environment variables
ENV AWS_ACCESS_KEY_ID=AKIAY7K6VMFCUXGAJQ56
ENV AWS_SECRET_ACCESS_KEY=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

# Copy the rest of the application code
COPY . .

# Expose the port if needed
# EXPOSE <port>

# Command to run the service
CMD ["node", "server.js"]   # Adjust the main JavaScript file name here
