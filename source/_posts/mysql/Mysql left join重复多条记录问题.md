---
title: 重复多条记录问题
abbrlink: 41967
date: 2019-10-21 08:52:53
categories:
  - mysql
tags:
---
# mysql group by 和 order by 一起用失效

我自己写了一个前端错误监控系统。

前端有各种报错，后台就会自动发邮件通知、

这里就会遇到同一个错误可能很多人遇到，或者同一个人遇到很多次。

这样同一个错误就会有很多次报错。

当管理员进入后台时，看到很多同一个错误的报错，这很明显不人性化。

于是我就设计成，同一个错误的合并，只显示最新那个。

一开始sql写法为

```sql
SELECT * from `errors` GROUP BY `title`,`msg`,`category`,`level`,`appId`  ORDER BY `createdAt` DESC
```



发现同一个错误是合并了，但是 ORDER BY 并没有生效，合并后的错误不是最新的一条错误而是最早的一条。于是查了资料发现，GROUP BY 没有排序功能，默认取合并时的第一条。于是就想到了，先排序完再合并就好了，于是有下面代码：

```sql
SELECT * FROM (SELECT `errors`.*,`apps`.name from `errors` LEFT JOIN `apps` ON `errors`.`appId`=`apps`.`id` WHERE `apps`.userId=1  ORDER BY `createdAt` DESC ) as result GROUP BY `title` ORDER BY `createdAt` DESC
```



但发现还是没用啊，我百度了下，很多人也是这样写的，但为什么就不生效呢？经过一番查找，终于找到原因了，mysql版本的问题，以上的代码在5.6或以下的代码应该都可以的，但在5.7则要加limit条件，不然子查询是不执行的，完整代码如下

```sql
SELECT * FROM (SELECT `errors`.*,`apps`.name from `errors` LEFT JOIN `apps` ON `errors`.`appId`=`apps`.`id` WHERE `apps`.userId=1  ORDER BY `createdAt` DESC LIMIT 100) as result GROUP BY `title` ORDER BY `createdAt` DESC
```



是不是很坑。。。

记下先
