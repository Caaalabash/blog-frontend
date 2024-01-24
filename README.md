## Blog

### 博客地址

[https://blog.calabash.top/](https://blog.calabash.top/)

供本人写一些很无聊的话 

**[2024.1.24]更新: 云服务器不续费了, 在线地址已经倒闭**

### 项目相关

[Vue2版本 - vue2.5.17 + element-ui + vue-cli](https://github.com/Caaalabash/blog-frontend/tree/f-go-version)

[Vue3版本 - vue3.2.38 + element-plus + vite](https://github.com/Caaalabash/blog-frontend)

如果你想跑vue3

````shell
npm install
npm run dev
````

如果你想跑vue2

````shell
npm install
npm run local
````

golang后端地址:[https://github.com/Caaalabash/blog-backend](https://github.com/Caaalabash/blog-backend)

### 部署流程

+ 提交到私有化部署的 gitlab，触发 gitlab-ci，参考`.gitlab-ci.yml`
    + 前端build：在`node:alpine`镜像中安装依赖、打包、将打包结果上传至阿里云OSS
    + 构建前端容器：在`docker:statble`镜像中构建前端容器，参考`Dockerfile`、`blog.conf`(nginx配置)，容器上传到Dockerhub
    + 将启动脚本`docker-compose.yml`发送到部署服务器，执行`docker-compose up`即可
+ gitlab代码自动同步到github
