FROM node:alpine

LABEL maintainer=Caaalabash

EXPOSE 8887

WORKDIR /app/backend

ADD ./deploy/backend/node_modules.tar.gz /app

COPY ./backend /app/backend

ENV NODE_ENV=production

CMD ["npm", "run", "online"]