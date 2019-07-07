#!/bin/bash

echo $1
export VUE_BLOG_TAG=$1

lastBlogImage=$(docker images | grep "vue-blog" | awk '{print $3}')
# 删除旧容器
docker rm -f $(docker ps -a |  grep "blog"  | awk '{print $1}')
# 依次运行后端、前端服务
cd /mynode/vue-blog-ci/deploy
docker-compose -f docker-compose-be.yml up -d
docker-compose -f docker-compose-fe.yml up -d
# 删除旧镜像
if [[ ! "$lastBlogImage" ]]; then
  echo "Can't find last vue-blog imageID"
else
  docker rmi -f ${lastBlogImage}
fi