FROM nginx:1.14

MAINTAINER Caaalabash

WORKDIR /app
# 打包后的文件只需要['service-worker.js', 'index.html', 'manifest.json']
COPY ["./dist/service-worker.js", "./dist/index.html", "./dist/manifest.json", "/app/dist/"]
# 使用自定义的nginx.conf配置
RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d

