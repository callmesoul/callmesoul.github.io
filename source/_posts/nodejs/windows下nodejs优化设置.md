---
uuid: 6efed410-610f-11eb-9541-1931b8064bf2
title: windows下nodejs优化设置
date: 2021-01-28 10:20:47
categories: nodejs
cover: ../images/u=491865045,1211705331&fm=26&gp=0.png
tags: nodejs
---

# 前言
`Nodejs`现在几乎是每个前端必备的了，无论你玩不玩后端服务开发，在前端的构建上也是必备的软件了。
这里总结下自己在`windows`系统下用这么久`Nodejs`的各种优化设置，让新人少走弯路，新装nodejs的可以跟着设置，一次安装设置一劳永逸。



# `git`安装 
`sudo apt-get install git`




# `nvm`安装 `nodejs`
这里推荐用`nvm`安装`Nodejs`，因为
1. 有些`npm`包并不兼容所有版本的nodejs（例如早期的`node-sass`）
2. 有些软件也指定了具体版本的nodejs才可以运行(例如: `ghost cms`, `strapi cms`)
  用`nvm`可以自由切换各个`nodejs`版本最是个不过了

<!-- more -->




## `nvm` 安装
仓库：[coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
链接：[Install nvm-windows](https://github.com/coreybutler/nvm/releases)

安装完后先设置node的安装源为国内taobao，这样安装nodejs才快
`nvm node_mirror https://npm.taobao.org/mirrors/node/`



## `nodejs`安装
然后就可以安装各个版本的nodejs了

- 已安装的版本
  `nvm ls`
- 安装指定版本nodejs
  `nvm install [version]` 推荐stable
- 切换版本
  `nvm use [version]





# nodejs设置
## 修改全局包的安装位置
相信很多人的电脑跟我一样，系统盘是200G以内的固态硬盘，空间有限。而npm全局又默认安装在系统盘上，前期倒没什么事，但是后来发现用久后，全局包变多变大了，系统盘本来就有限，然后系统盘可用空间越来越少，所以修改全局安装包安装位置才好一劳永逸。
```
// 设置全局包的安装位置，路径自己修改成自己要安装的位置
npm config set prefix "D:\nodejs\global"
// 设置npm cache位置
npm config set cache "D:\nodejs\cache"
```

然后要添加个系统变量Path项，地址填全局地址

然后在添加个NODE_PATH系统变量，值为全局npm路径 + node_modules

## 用nrm 管理npm源
当你想切换npm源的时候，你是不是就要打开百度，去查找源的地址，然后设置，不然谁会没事记各种源的地址呢。

所以这里推荐用nrm来管npm的源

安装
`npm install nrm -g`
所有源
`nrm ls`
使用源
`nrm use [name]`

这里推荐用taobao源，比较快
当你需要发布npm包的时候记得切换回npm官方源

## 设置npm个别软件源

虽然上面我们设置了npm的源，但有些npm包需要去下载一些软件，而这些软件的下载地址都是国外比较慢，我们用到时需要去指定更改源。

例如`node-sass` `electron` `phantomjs`

```
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
```

以上的一些配置都会保存写入到`C:\Users\当前用户\.npmrc`

`.npmrc`就是npm的全局配置文件

你也可以直接打开`.npmrc`来修改配置，不用一条条命令输入：

```
registry=https://registry.npm.taobao.org/
electron_mirror=https://npm.taobao.org/mirrors/electron/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
```



## node-gyp`安装

node-gyp，是由于node程序中需要调用一些其他语言编写的 工具 甚至是dll，需要先编译一下，否则就会有跨平台的问题，例如在windows上运行的软件copy到mac上就不能用了，但是如果源码支持，编译一下，在mac上还是可以用的。node-gyp在较新的Node版本中都是自带的（平台相关），用来编译原生C++模块。

`npm install node-gyp -g`

## `windows-build-tools`安装

[Windows的构建工具](https://github.com/felixrieseberg/windows-build-tools)

`npm install --global windows-build-tools`

为啥要一键安装呢，安装的是啥呢？

　　解释：　1、[python](https://www.python.org/downloads/)(v2.7 ，3.x不支持);

　　　　　　2、[visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools),或者 （[vs2015](https://www.visualstudio.com/vs/community/)以上（包含15))

　　　　　　3、.net framework 4.5.1

就是安装的这三个东西，安装时间有点长，别着急，慢慢等~