FROM node:alpine
COPY ./server.js ./
COPY ./package.json ./
RUN npm install
ENTRYPOINT [ "node", "server" ]