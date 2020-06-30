---
title: 坑吭记录
abbrlink: 12004
date: 2019-10-21 08:44:58
tags: frontend
---
- 苹果IOS系统分享配置失败，签名错误

原因：苹果IOS系统下，页面跳转时，路由跳转但地址并没有变，还是进入程序的第一个地址，所以签名的地址！=当前页面地址 所以错误了。

解决:就是手动把url改了，先建一个mixins插件，然后以后那个页面需要分享就引入这个插件就可以了。

```javascript
// assign.js

//ios端 histiry 模式兼容问题

const location = global.location
const u = navigator.userAgent 
let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
let baseUrl=process.env.BASE_URL.substring(0,process.env.BASE_URL.length-1); // 兼容自定义 BASE_URL

export default {
  beforeRouteEnter(to, from, next) {
    if (isiOS && baseUrl+to.path !== location.pathname) {//只要ios需要处理，其他跳过
      // 此处不能使用location.replace
		location.assign(baseUrl+to.fullPath)
      //location.replace (baseUrl+to.fullPath) 
	  //重定向时用location.replace 其他用location.assign
    } else {
      next()
    }
  }
}
```







- IOS 滚动穿透问题：就是非body滚动时，其他其他浮层滚动，会穿透，时body滚动。

原因：我也不知道啊，为什么这么设计，我也不敢问，也不敢说。

解决：



```javascript
// 打开浮层时调用closeTouch阻止body事件，关闭时调用openTouch 恢复
{
	data:{
		//...
		handler: function (e) {
          e.preventDefault()
        }
	},
	methods:{
		/* 解决iphone页面层级相互影响滑动的问题 */
      closeTouch: function () {
        document.getElementsByTagName('body')[0].addEventListener('touchmove',
          this.handler, { passive: false })// 阻止默认事件
      },
      openTouch: function () {
        document.getElementsByTagName('body')[0].removeEventListener('touchmove',
          this.handler, { passive: false })// 打开默认事件
      },
	}
}
```

