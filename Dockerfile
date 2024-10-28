     # Use the official Node.js image.
     # https://hub.docker.com/_/node
     FROM node:14

     # Create and change to the app directory.
     WORKDIR /usr/src/app

     # Copy application dependency manifests to the container image.
     # A wildcard is used to ensure both package.json AND package-lock.json are copied.
     # Copying this separately prevents re-running npm install on every code change.
     COPY package*.json ./

     # Install production dependencies.
     RUN npm install --only=production

     # Copy local code to the container image.
     COPY . .

     # Run the web service on container startup.
     CMD [ "npm", "start" ]

     # Document that the service listens on port 8080.
     EXPOSE 8080
    steps:
  - name: 'gcr.io/cloudbuild/docker'
    args: ['build', '-t', 'my-image', '.']
    logs_bucket: 'hello'
