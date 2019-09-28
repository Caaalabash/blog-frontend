#!/bin/bash
export VUE_BLOG_TAG=$1
cd /mynode/vue-blog-ci/deploy
docker-compose down && docker-compose up -d
