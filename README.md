# vue-blog

## 技术栈

前端：vue vue-router vuex axios element-ui less Service-Worker

RESTful API

后端：express mongodb redis socket.io nginx

## 博客地址

[我的博客](https://blog.calabash.top)

## 涵盖内容

### 前端

+ 登录注册(多人博客)

+ 滚动加载

+ axios封装,api统一管理

+ 文章的增删改查,上传图片

+ 文章的分享、点赞、收藏

+ pv统计,查看访问ip,访问路径

+ 站内信:基于websocket的一对一聊天,包括发送图片,发送语音,添加聊天对象

+ 个人信息、个人动态的管理

+ canvas粒子效果以及换肤功能

+ Service Worker

+ 基于``node-ssh``将打包文件上传到云服务器

### 后端

+ Restful api接口

+ jwt身份验证

+ http2

+ socket.io

+ webp转换

+ crud

+ 基于Service Worker的消息推送

+ 自动更新nginx配置文件以实现http2_push

+ 使用redis存储访问日志、token、文章浏览次数

+ 基于DFA的敏感词过滤

## 起步

+ 进入项目目录后安装依赖
````
 cnpm install
````
+ 进入server目录安装依赖
````
 cnpm install
````
+ 在有mongodb的条件下启动服务器
````
  node bin/www
````
+ 回到项目目录启动前端
````
  npm run serve
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

