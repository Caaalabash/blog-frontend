FROM node:lts-alpine

LABEL maintainer=Caaalabash

WORKDIR /app

ADD ./deploy/backend/node_modules.tar.gz /app

COPY ./backend /app

ENV NODE_ENV=production

CMD ["npm", "run", "online"]