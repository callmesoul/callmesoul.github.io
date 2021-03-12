---
uuid: 70068e70-4102-11eb-b113-9717c2aea740
title: 小程序静态资源无缝转移到腾讯云COS 使用wepy mpvue 等webpack打包的小程序项目
categories:
  - 小程序
cover: >-
  https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E6%95%99%E7%A8%8B.jpg
date: 2019-02-10 09:13:14
tags: frontend
---

### 今天介绍的工具是[wecos](https://github.com/tencentyun/wecos)

- ## 原生小程序

原生的小程序直接根据wecos的文章操作即可，wecos提供了上传本地资源文件到cos、替换小程序的引用本地路径为上传路径等。

这里不作详细说明，主要介绍webpack打包的小程序项目。

因为原生写起来很不方便。

<!-- more -->

- ## webpack小程序打包项目

  最好是开发完再来进行这一步，前期专心开发。

  我前期开发时，引用静态资源用的是相对路径，用的绝对路径应该也可以的。

  项目开发完后

  1. webpack设置打包后的cdn地址, webpack rules选项：

     ```javascript
     {
             test: /\.(png|jpg|jpeg|gif|svg)$/,
             use: {
               loader: 'file-loader',
               options: {
                 name: '/[path][name].[ext]',
                 publicPath: function (file) {
                   if(isProduction){//判断是否生产环境，自己判断咯。
                     if(file.indexOf('tabbar')>=0){//如果有tabbar的，tabbar用一个tabbar的文件夹装起来，因为tabbar图片只支持本地。
                       return file;
                     }
                     else{
                       return 'https://xxx-1234567.cos.ap-guangzhou.myqcloud.com/'+file;//你的腾讯云cos bucket的域名。
                     }
                   }else{
                     return file;
                   }
                 }
               }
             },
           },
     ```

  2. 安装`wecos`

     `npm install -g wecos`

  3. 跟目录创建`wecos.config.json`文件

  4. 填写`wecos.config.json` 配置

     ```javascript
     {
       "appDir": "./dist/assets",
       "cos": {
         "secret_id": "xxxxx",
         "secret_key": "xxxxx",
         "bucket": "xxx-1234567",//bucker-appid
         "region": "ap-guangzhou", //创建 bucket 时选择的地域简称
         "folder": "/assets" //资源存放在 bucket 的哪个目录下
       },
       "uploadFileSuffix": [".jpg",".png",".gif",".webp",".svg"],
       "uploadFileBlackList": [//不上传的图片，填tabbar的目录
         "./dist/assets/images/tabbar",
       ]
     }
     ```

  5. 在根目录运行`wecos`即可。



- ## 总结

- 为什么不用`webpack`的 `publicPath` 而用`file-loader`的`publicPath` ？

  因为`webpack`的 `publicPath`只支持字符串，一但改成线上域名，所有静态资源的前缀都会变成cdn域名。而小城的tabbar并不支持网络图片，base64也不支持，只支持本地图片。

  这时我们就用`file-loader`的`publicPath` ，支持函数且返回文件名，可以写条件去过滤掉tabbar的文件。

  使tabbar文件使用本地的，而其他使用线上cdn域名的文件。

- 为什么要用`wecos`？

  当然你也可以不用自己，本地打包后自己手动上传到cos后台。

  然后删除了本地的图片文件（除了tabbar的图片）。

  然后开发者工具再上传代码。

  你会发现这步骤很累赘。

  使用`wecos`后，我们打包后只需要跑一下`cos`就可以自动上传本地的上cdn，且自动删除本地的（tabbar图片除外）。

  是不是方便多了？

  赶紧在你项目用上把！
