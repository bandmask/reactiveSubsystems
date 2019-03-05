FROM node:alpine

COPY ./server.js ./
COPY ./index.html ./
COPY ./playerApp.js ./
COPY ./socketElement.js ./
COPY ./attributeElement.js ./

ENTRYPOINT [ "node", "server" ]