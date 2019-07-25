FROM node:lts-alpine

LABEL maintainer=Caaalabash

WORKDIR /app

COPY package.json /app

ADD node_modules.tar.gz /app

COPY . /app

ENV NODE_ENV=production

CMD ["npm", "run", "online"]