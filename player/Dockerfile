FROM node:alpine AS BASE

WORKDIR /

FROM BASE AS BUILD

COPY ./src ./src
COPY ./package.json ./
COPY ./terser-config.json ./

RUN ["mkdir", "dist"]
RUN ["touch", "bundle.min.js"]

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM BASE AS FRONT

COPY --from=BUILD /dist ./dist

COPY ./index.html ./
COPY ./server.js ./

ENTRYPOINT [ "node", "server" ]