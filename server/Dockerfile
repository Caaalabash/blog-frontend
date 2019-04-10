FROM node:lts-alpine

MAINTAINER Caaalabash

WORKDIR /app

COPY package.json /app

RUN npm install

ENV NODE_ENV production

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "online"]