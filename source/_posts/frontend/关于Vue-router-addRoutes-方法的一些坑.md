---
title: 关于Vue-router=>addRoutes 方法的一些坑
date: 2020-02-28 08:07:10
cover: 
abbrlink: 3
categories:
  - 前端开发
tags:
---
# 关于Vue-router=>addRoutes 方法的一些坑

1. ```js
   router.addRoutes(routes: Array<RouteConfig>)
   ```

`routes` 是要符合路由规范的数组



2. `router.addRoutes` 只是注册了路由的规则，但是并不会自动更新路由列表项，需要先手动更新路由列表，再去注册规则

```javascript
// 手动添加路由列表项
router.options.routes.push(...routers)
// 注册路由规则
router.addRoutes(routers)
```

3. 注册完最好重定向

   如果添加路由之前，要访问的地址是需要 `addRoutes` 添加的。

   那么在调用`addRouters`之前路由并不存在，所以注册完需重定向一下要访问的地址

   在路由导航守卫可以这样些

   ```javascript
   router.beforeEach((to, from, next) => {
     // 其他逻辑
     router.options.routes.push(...asyncRouterMap)
     router.addRoutes(asyncRouterMap)
     next(to.path)
   })
   ```

4. 动态引入组件component

   网上很多人的文章的copy的，也没验证过，所有导致搜索的大部分方法都是不行

   - `component: () => import(componentPath)`  不行

   - `component: () => import('@/' + componentPath)`  不行

     还有很多的网上办法都不行的

     最后找到了解决方法：

     ```json
     component: require.ensure([], (require) => {
             resolve(require('@/' + componentPath))
     }),
     ```

     注意： `@/` 要分开写死，不可以连同地址一块传入，可能是为了给`webpack`标识的