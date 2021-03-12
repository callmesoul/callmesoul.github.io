---
uuid: 6c3206d0-4102-11eb-b113-9717c2aea740
title: 使用**gitalk** 代替其他第三方评论插件
categories:
  - 工具周边
date: 2018-06-10 09:14:14
tags:
---
###  前言

第三方评论插件已经死得差不多了，从一开始多说到后来的网易云跟帖，最后剩下了畅言。最近畅言为了活下去，也退出了广告，让用户体验更差了。本来用户体验就不咋地。可惜碍于找不到其他更好的代替者就只好将就一下了。

知道今天找到gitalk，坚定不移地把畅言给换了。

<!-- more -->

### 关于gitalk

Gitalk 是一个基于 GitHub Issue 和 Preact 开发的评论插件。 

- 使用 GitHub 登录
- 支持多语言 [en, zh-CN, zh-TW, es-ES, fr, ru]
- 支持个人或组织
- 无干扰模式（设置 distractionFreeMode 为 true 开启）
- 快捷键提交评论 （cmd|ctrl + enter）

[Readme](https://github.com/gitalk/gitalk/blob/master/readme.md) [在线示例](https://gitalk.github.io/)



### 使用

1. 在需要插入评论的地方给个占位`<div id="gitalk-container"></div>`

2. 接着在占位下方引入插件

   ```
   <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
   <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
   ```

   也可以js文件和css文件下载下来自己引入

3. 创建 **GitHub Application**，如果没有 [点击这里申请](https://github.com/settings/applications/new) 

   - ![avatar](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/TIM%E6%88%AA%E5%9B%BE20180713151231.png)

4. 在自己的GitHub账号创建一个库来放评论，库名称填上一步的应用名称

5. 在博客的引用插件下方填写配置

   ```javascript
   var gitalk = new Gitalk({
                   clientID: '9f89xxxxxxde0f46', ///步骤3创建后得到的
                   clientSecret: '22fc21a22xxxxxxf599fd41746ff54f',///步骤3创建后得到的
                   repo: 'myblog_comment',///步骤4创建的库名
                   owner: 'callmesoul',//自己的GitHub用户名
                   admin: ['callmesoul'],//自己的GitHub用户名
                   id: '{{id}}', // 唯一标示，一般是文章id也可以是文章url
                   distractionFreeMode: false  // Facebook-like distraction free mode
               })
               gitalk.render('gitalk-container')
   ```

6. 以上完成后就可以上传上自己的博客了。

   上传完，第一次进入相应页面会出现一个初始化提示。

   根据操作登录自己的GitHub授权就可以了。



值得一说的就一有评论就相当于项目有issue，gitthub就自动会有邮件提示。

比畅言好多了，畅言你不登录它后台看都不知道有新的评论。



以上就完成了，有什么问题不懂得可以在评论处提问。

