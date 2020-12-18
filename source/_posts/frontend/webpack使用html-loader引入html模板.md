---
uuid: 47a41dd0-4102-11eb-b113-9717c2aea740
title: webpack使用html-loader引入html模板
tags: frontend
categories:
  - 前端开发
date: 2019-12-04 16:32:57
cover:
---
### 前言

最近在打一个多页面的手脚架，因为经常会接到一两个页面的临时活动的开发需求。

vue开发栈喜欢了，想用vue来开发，有感觉有点累赘，大材小用的感觉。

直接新建个html，手撸起来又各种问题，导致开发效率低下，例如:

- 平时用惯了es6语法，要写回es5,要经常查文档
- 不能使用预处理样式(less,sass)，这个效率大打折扣啊
- 手动页面优化(压缩，去除注释,检测语法)

本着现代开流，还是自己根据自己的需求撸个基于webpack的多页面开发手脚架，虽然没用vue，但是开发的流程基本跟vue开发流程一直，能自动化的部分都自动化，能提高开发效率的都用上，以后再也这类需求，就直接拉下手脚架，开发就行，不用再另外一个个配置了。

本以为大功告成，却忽略了一个问题，就是有时几个页面的头部或者底部是共用的，这时候需要分离出来，不然三个页面个三个一样的头部，要修改头部时也要修改三个页面，这很不好维护。

于是乎就寻找各种方案了



### html 引入模板

1. iframe

   首先淘汰了这种方法，因为iframe算是历史遗留产物，而且会引起许多的bug，能不用还是不用吧。对iframe真心没好感。

2. 模板引擎

   这是开始确认的方向，因为之前玩node用过ejs，使用起来简单方便，于是乎在网上找了各种方案，但还是没找到合适的。

   - 一种是基于一个布局模板去生成html，但这不够灵活啊，不是所有的页面都一定要基于那个模板，比如有几个页面公用一个头部，另一个页面公用另一个头部这样，我能根据自己需求来引入才是完美的，而且ejs并没有继承的功能，不能再一个模板上追加内容，也是个大问题。
   - 第二种就是项目直接全部用ejs，webpack解析打包成html。虽然解决了上面的问题.但对于前端开发来说不是很友好，都变成了.ejs后缀了，最终还是舍弃了。

3. html-loader 的  interpolate

   html-loader 大部分人都有用，甚至在解决这个问题前我自己也用了，但大部分人都想我一样，用来处理html文件中的静态资源文件，但其实有一个引入模板的功能。

   首先要在webpack rules里加上加一条处理html的规则

   ```javascript
   {
         test: /\.html$/,
         use: {
           loader: 'html-loader',
           options: {
             // 处理html 引用的图片
             attrs: ['img:src'],
             // 开启 html模板功能
             interpolate: true
           }
         }
       }
   ```

   

   然后在html文件就可以直接引入其他html模板了

   ```html
   <!DOCTYPE html>
   <html>
   
   <head>
     <title>index</title>
     ${require("../layouts/head.html")}
   </head>
     ${require("../layouts/header.html")}
   <body>
   
     ${require("../layouts/footer.html")}
   </body>
   
   </html>
   ```

   简单又灵活，Get it！





​		最后也分享下自己配置好手脚架：**[webpack-multiple-pages-template](https://github.com/callmesoul/webpack-multiple-pages-template)**
