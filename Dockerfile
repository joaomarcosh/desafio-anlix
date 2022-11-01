FROM node:18-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

USER root

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "src/server.js" ]
