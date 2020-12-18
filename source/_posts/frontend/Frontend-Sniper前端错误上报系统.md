---
uuid: be33f160-4101-11eb-b113-9717c2aea740
title: Frontend-Sniper前端错误上报系统
date: 2019-10-21 08:57:01
cover: 
tags:
categories:
  - 前端开发
---
# 前端错误监控系统服务端
其实线上已经有很多监控系统了，例如[fundebug](https://www.fundebug.com/)。试用了一下还是挺不错的。
可惜都是收费的，免费的只能创建一个项目，收费也不便宜。
对于一些小公司来说很难花钱去搞，而且对小公司来说功能也不需要太复杂。
一些js的报错和接口报错就可以大大加快bug的修复，和预知bug。（当上级和测试都还没发现时）
所以我还是写这么个系统，是从自身需求出发吧。功能可以慢慢完善。


现在初期只实现了简单的js和接口资源报错。后期会加入UA和用户等信息以完善错误信息追踪错误。
对服务端还是新手所以代码质量....graphql也是试手。
但好在错误监控系统一般内部人使用，独立不影响线上项目和用户。所以大胆地使用吧。

# 项目集

- 服务端 [frontend-sniper-server](https://github.com/callmesoul/frontend-sniper-server)
- 管理后台 [frontend-sniper-admin](https://github.com/callmesoul/frontend-sniper-admin)
- 错误探针 [better-js](https://github.com/callmesoul/better-js)


# todo

- [x] 支持vue
- [x] 邮件通知（新错误报错，旧错误5n次发邮件报错）
- [ ] 添加UA信息
- [ ] 添加用户信息
- [x] 记录用户行为
- [ ] 手动上传报错
