# vue-blog

## 技术栈

前端：Vue全家桶 less element-ui Service-Worker PWA

后端：express mongodb redis socket.io

部署: Docker Nginx

## 博客地址

[我的博客](https://blog.calabash.top)

## 涵盖内容

### 前端

内容相关

+ 文章的增删改查,图片上传

+ 文章的分享、点赞、收藏

+ pv统计,查看访问ip,访问路径,请求响应时间图表统计

+ 登录注册(多人博客)

+ 站内信:基于websocket的一对一聊天,包括发送图片,发送语音,添加聊天对象

+ 个人信息、个人动态、收藏夹的管理

+ 消息推送

技术相关

+ 基于`InterSectionObserver`实现无限滚动加载,以及兼容性处理

+ `Axios`结合Element-UI的封装,全局错误管理,api统一管理

+ `Canvas`粒子效果以及换肤功能

+ `Service Worker`

+ 基于``node-ssh``将打包文件上传到云服务器

+ `vue-socket.io`实现实时聊天

+ `echarts` 后台数据统计

+ 基于`Service Worker`的消息推送

### 后端

+ `Restful api`接口

+ `jwt`身份验证

+ `http2`

+ `socket.io`

+ `webp`转换

+ crud

+ ~~自动更新nginx配置文件以实现http2_push~~ `SPA`使用`http2_push`效果不佳

+ 使用`redis`存储访问日志、token、文章浏览次数

+ 基于`DFA`的敏感词过滤

+ `Dockerfile/Docker-Compose.yml`编写

### 部署

## 起步

+ 进入项目目录后安装依赖
````
 npm install
````
+ 进入server目录安装依赖
````
 npm install
````
+ 本地服务
````
 npm run local
````


## 效果
个人喜欢简洁的风格，但没什么好的想法，**于是借（chao）鉴（xi）了[尤雨溪的博客](http://blog.evanyou.me/)**

+ 展示页  登录/注册藏在第四个链接

![](https://blog.calabash.top/file-1528549390573.png)

+ 文章页

![](https://blog.calabash.top/file-1528549550030.png)

+ 后台管理

![](https://blog.calabash.top/file-1528549425790.png)

![](https://blog.calabash.top/file-1528549444399.png)

![](https://blog.calabash.top/file-1528549462998.png)

+ 请求分析

![](https://blog.calabash.top/file-1528549492511.png)

