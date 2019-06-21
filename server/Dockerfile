FROM node:lts-alpine

MAINTAINER Caaalabash

WORKDIR /app

COPY package.json /app

RUN yarn --prod

ENV NODE_ENV=production NODE_ICU_DATA=/app/node_modules/full-icu

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "online"]