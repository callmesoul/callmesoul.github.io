---
title: 小程序开发之-使用GraphQl
categories:
  - 小程序
cover: https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E6%95%99%E7%A8%8B.jpg
abbrlink: 20484
date: 2017-10-10 09:14:14
tags:
---

之前文章有介绍到graphql的好处，而且很大可能就是未来Restful api的代替者,不过以后的事谁也不好说啊。反正就是好的东西，我们就想折腾下用起来。最近自己写了小程序，想顺便学习graphql，实践。于事有了本篇教程

### Apollo

Apollo是一整套的关于GraphQl的工具套件吧，各种后台语言java、php、nodej的都有，关于前端框架封装GraphQl，让GraphQl使用更简单，更优化的库类也都有。vue、react等。



### 小程序

但小程序不同传统的网页。小程序是无浏览器环境的，而且也没ajax用的是自己的api。很显然apollo这么好的社区出的这么好的工具在小程序上根本没法用啊。

毕竟小程序比较小众，想用的话就只能自己折腾了。



### 原理

其实GraphQl请求跟Restfel api的请求一样，都是一个http请求。只是GraphQl的请求入口有且只有一个，一般是graphql服务端的入口，一般是`/graphql` 而且是post放，所有。

所以GraphQl请求无非就是post方法的`http://xxxx.com/graphql`的请求后台再传这graphql的参数来使graphql服务端根据参数不同来执行不同的方法，从而实现不同的接口效果。

搞清这原理就可以慢慢折腾了。



### 开始

```
var Fly=require("../lib/wx.js") //wx.js is your downloaded code
var fly=new Fly(); //Create an instance of Fly
import message from './message'
import { create_client } from 'tiny-graphql-client'

const client =create_client( async( body)=>{
  const res_data = await fly.post("/graphql",body)
  const {data ,errors}=res_data;
  if(errors){
    message.error(errors[0].message);
    throw errors;
  }
  return res_data.data;
})

export default client;
```

- `fly`是一个兼容小程序的http组件，你可以使用原生的request来替换。
- `tiny-graphql-client` 是一别人封装好的graphql工具类，详情：[https://github.com/xialvjun/tiny-graphql-client](https://github.com/xialvjun/tiny-graphql-client)
- graphql返回的字段，一定会有`data`，无论成功后失败。只是有错误失败时才会有`errors`字段。所以我们在全局处理graphql返回时先判断有没有`errors`字段的存在，有就是有错误。没有就是成功了。



### 使用

#### query

```
user=await this.$parent.client.run(`query getUser{getUser{id nickName avatarUrl space nowSpace album}}`);
```

#### mutation

```
let bucket=await this.$parent.client.run(`mutation createBucket($name:String!){createBucket(name:$name){id name createdAt}}`,this.album);
```

使用前记得先引入上面封装好的client哦。



好了，大家快来试试吧。
