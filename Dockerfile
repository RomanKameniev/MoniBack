FROM node:10.15.1-alpine

WORKDIR /app

COPY ./app /app/

RUN npm install 

CMD ["npm", "start"]

