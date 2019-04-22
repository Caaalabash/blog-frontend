#!/usr/bin/env bash

# 输出脚本接收的镜像tag参数并设置为环境变量
echo $1
export VUE_BLOG_TAG=$1

# 拉取镜像
docker pull caaalabash/vue-blog:$1-FE
docker pull caaalabash/vue-blog:$1-BE

# 删除旧容器
if docker ps -a | grep -q vue-blog; then
  docker rm -f vue-blog
fi

# 首先运行后端服务
cd /mynode/vue-blog-ci/deploy/server
docker-compose up -d

# 运行前端服务
cd /mynode/vue-blog-ci/deploy
docker-compose up -d
