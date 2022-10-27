FROM nginx:alpine
LABEL maintainer=Caaalabash
COPY ./blog.conf /etc/nginx/conf.d
COPY ./dist /etc/nginx/dist/
