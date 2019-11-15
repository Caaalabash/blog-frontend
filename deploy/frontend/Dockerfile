FROM nginx:alpine

LABEL maintainer=Caaalabash

EXPOSE 800

COPY ./deploy/frontend/blog.conf /etc/nginx/conf.d

COPY ./frontend/dist /etc/nginx/dist/

CMD nginx -g "daemon off;"
