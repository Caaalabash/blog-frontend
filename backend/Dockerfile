FROM node:lts-alpine

LABEL maintainer=Caaalabash

WORKDIR /app

COPY package.json /app

RUN npm install --registry https://registry.npm.taobao.org

COPY . /app

ENV NODE_ENV=production

CMD ["npm", "run", "online"]