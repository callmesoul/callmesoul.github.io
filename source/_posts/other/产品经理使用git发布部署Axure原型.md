---
uuid: 635ecf70-4102-11eb-b113-9717c2aea740
title: 产品经理使用git发布/部署Axure原型
categories:
  - 其他周边
cover: >-
  https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%E4%BD%BF%E7%94%A8git%E5%8F%91%E5%B8%83%E9%83%A8%E7%BD%B2Axure%E5%8E%9F%E5%9E%8B.jpg
date: 2019-09-10 09:14:14
tags:
---

### 前言

工作了几年了，也和不少产品打过交道发现了和产品交流上的一些问题，就是axure原型分享。

产品做完原型就要发给老板，设计师，开发看，每人发一份。然后后面原型有修改或添加之类的，又要重新每人发一份，别人又要经常接受一份。

看似很正常的传统工作流程，但效率有点低，而且接受的人，接受了多个版本以后会经常弄混乱，没有整理的人还要每次去找产品经理发的 原型放在了哪里？哪个才是最新的版本。

下面就介绍下git来解决以上问题。



### Axure

axure是一原型开发工具，做产品都都应该很熟悉。

其实前言说到的问题，一些新的做原型产品其实很好解决了，例如墨刀之类的，做完只需要发个预览链接到群里就行了，然后每次更新了，预览的链接也会跟着更新。但墨刀是收费，而且功能也相对Axure有点限制，axure的生态更完善，比如UI框架都有开源自己的Axure组件，所以大多产品还是比较喜欢Axure做原型多。



### Git

git 是一版本控制系统，一般用来管理开发代码居多，开发人员必会的了，产品经理可能少接触写。

windows 安装：[https://www.cnblogs.com/wj-1314/p/7993819.html](https://www.cnblogs.com/wj-1314/p/7993819.html)

mac 安装：[https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git](https://git-scm.com/book/zh/v2/起步-安装-Git)

安装完打开命令行初始化

windows : win键 + R键 --> 输入`cmd` 回车 

```
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```





### Gitee,Github

可以理解为使用git的文件托管平台

这里推荐gitee，国内快。

网址：https://gitee.com/

先去注册个账号，免费的放心。



### 开始使用gitee 部署 axure项目 github等其他托管平台相似

1. 登陆后创建个仓库

![1567589996040](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567589996040.png)



![1567590260125](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567590260125.png)

2. 创建一个`index.html`文件

   ![1567591236721](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567591236721.png)

   ![1567591334990](C:\Users\Benz\AppData\Roaming\Typora\typora-user-images\1567591334990.png)

3. 开始仓库pages服务

   

   ![1567591427074](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567591427074.png)

   ![1567591471259](C:\Users\Benz\AppData\Roaming\Typora\typora-user-images\1567591471259.png)

   点启动

   ![1567591517421](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567591517421.png)

   需要等一会时间

   ![1567591557067](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567591557067.png)

   部署完后就可以访问下地址 [https://你的用户名.gitee.io](https://callmesoul.gitee.io/)

   ![1567591916474](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567591916474.png)

   其实就是我们刚创建的`index.html`内容

4. 把gitee项目拉下来

   复制gitee项目地址

   ![1567593069749](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567593069749.png)

   

   打开你要放置项目的目录右键，右键打开命令行

   windows用户可以右键选择`Git Bash here`

   输入 `git clone 刚复制的项目地址`

   ![1567593148050](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567593148050.png)

   完成后就会多个你的项目名的文件夹

5. 设置 Axure 项目导出 到本地的 gitee 项目文件夹地址

   打来Axure, 选择 `发布` -> `生成html`

   ![1567644410702](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567644410702.png)

   然后输出目标文件夹我们就选刚创建的gitte本地文件夹，然后考虑我我们后面会有多个项目，于是乎我们就在里面新建一个文件夹去当前项目，下次有新项目了就只需在里面再创建个心文件夹放就可以了

   ![1567644652834](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567644652834.png)

   弄完此时就可以看到可以访问打方才输出的html axure原型了

   ![1567644792908](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567644792908.png)

   

   但此时只是本地或局域网可以问题，你发给别人，别人看不到的。

   而且要一直开着机。

   下面我们就要把gitee本地文件夹中里面我们刚才新加的内容同步上gitee仓库里，这样就可以通过上面的域名访问了。

   

6. 把本地的gitee文件夹同步到gittee仓库

   回到本地gitee文件夹的命令行

   输入

   ```
   git add *
   ```

   意思就是添加所有文件

   再输入

   ```
   git commit -m 备注信息 
   ```

   就是提交修改的意思 ，后面的备注信息是备注你每次提交修改了什么内容一个提示（自定义）

   最后输入

   ```
   git push
   ```

   意思就是推送到线上对应仓库，

   第一次推送时会需要填写gitee的账号密码，因为要知道那你仓库是属于你的才可以推送，不然每个人都可以往你仓库推送那就麻烦了。

   ![1567645656523](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567645656523.png)

   

   然后回到gittee仓库的pages服务页面更新下就可以访问了

   

   然后就可以试下访问线上的域名了。

   ![1567646417382](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567646417382.png)

   还记得域名么？

   `https://你的用户名.gitee.io/`

   你直接访问这个是没变的，因为我们的文件放在了一个目录下了。所有要加上目录名，然后Axure的导航页是`start.html`

   于是你要访问的域名就是

   `https://你的用户名.gitee.io/项目文件夹名/start.html`

   ![1567646603270](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1567646603270.png)

   

   最后大功告成，可以把url发给各位老板，开发者，设计师了。
