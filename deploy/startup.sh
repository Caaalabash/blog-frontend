#!/bin/bash

echo $1
export VUE_BLOG_TAG=$1

# 删除旧容器, 镜像
docker rm -f $(docker ps -a |  grep "blog"  | awk '{print $1}')
docker rmi -f $(docker images | grep "blog" | awk '{print $3}')
# 依次运行后端、前端服务
cd /mynode/vue-blog-ci/deploy
docker-compose up -d
