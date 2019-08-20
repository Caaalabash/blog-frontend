FROM nginx:stable-alpine

LABEL maintainer=Caaalabash

EXPOSE 800

COPY ./deploy/frontend/wait-for-it.sh wait-for-it.sh

RUN chmod +x wait-for-it.sh

COPY ./deploy/frontend/blog.conf /etc/nginx/conf.d

COPY ./frontend/dist /etc/nginx/dist/

CMD ["./wait-for-it.sh"]
