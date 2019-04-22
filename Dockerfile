FROM nginx:1.14

MAINTAINER Caaalabash

WORKDIR /app
# 打包后的文件只需要['service-worker.js', 'index.html', 'manifest.json'] 此处暂时全部拷贝
COPY dist /app
# 使用自定义的nginx.conf配置
RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d

