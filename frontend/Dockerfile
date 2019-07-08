FROM nginx:stable-alpine

LABEL maintainer=Caaalabash

EXPOSE 800

COPY wait-for-it.sh wait-for-it.sh

RUN chmod +x wait-for-it.sh

COPY blog.conf /etc/nginx/conf.d

COPY dist /etc/nginx/dist/

CMD ["./wait-for-it.sh"]

