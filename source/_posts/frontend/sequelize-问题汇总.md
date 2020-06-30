---
title: sequelize 问题汇总
date: 2020-06-17 09:20:33
tags: frontend
abbrlink: 4
photos:
  - >-
    ../images/sequelize.jpg
---
## Sequelize
`sequelize` 是`nodejs`里面很成熟的数据库`ORM`，配合`nodejs`使用，开发事半功倍。相较于其他语言`ORM`，`sequelize` 有着一整套完整的解决方案，包括各种复杂的查询，联表，数据库表的设计与生成等。

本文主要记录各种负责的数据查询使用`sequelize`如何实现，还有记录一些坑或bug。

### sequelize include order
写过原生sql查询的人都知道，排序都是在最外层排序的，所以一下代码无效:
```
ctx.model.User.findAll({
    include: [
        {
            model: ctx.mode.Book,
            as: 'books',
            order: [['createdAt', 'ASC']]
        }
    ],
    order: [['createdAt', 'DESC']]
})
```
以上查询最外层的`order`是有效的， 但是里面`include`层的`books`数组排序是无效的，会导致每次查询的数据顺序不一样，要指定`include`里面数据的排序，应该这样写

```
ctx.model.User.findAll({
    include: [
        {
            model: ctx.mode.Book,
            as: 'books'
        }
    ],
    order: [['createdAt', 'DESC'], order: [['books', 'createdAt', 'ASC']]]
})
```
类似于原生查询的`A.createdAt`