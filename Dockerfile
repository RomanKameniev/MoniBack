FROM node:10.15.1-alpine

WORKDIR /app

COPY ./app /app/


RUN apk add --no-cache python2 make gcc g++ git libtool autoconf automake linux-headers \
openssl-dev zlib-dev libuv-dev

# Installs dependencies
ENV PREFIX=/usr/src/app/aerospike-client-c/target/Linux-x86_64
RUN npm install


CMD ["npm", "start"]

