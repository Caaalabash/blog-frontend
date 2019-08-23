FROM node:lts-alpine

LABEL maintainer=Caaalabash

WORKDIR /app/backend

ADD ./deploy/backend/node_modules.tar.gz /app

COPY ./backend /app/backend

ENV NODE_ENV=production

CMD ["npm", "run", "online"]