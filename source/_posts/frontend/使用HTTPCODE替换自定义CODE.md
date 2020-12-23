---
uuid: ed031f30-44bb-11eb-877f-9d665ae77b76
title: 使用HTTPCODE替换自定义CODE
tags: frontend
categories:
  - 前端开发
date: 2019-10-21 08:47:58
cover:
---

# 前言
现在的开发基本都是前后端分离的项目，既解放了前后台各自的生产力（后台专注写业务给出数据就行，再也不用管前端UI的事。前台专注于写UI拿数据就行，再也不用跑后台服务，不用打开eclipse了）又可以一套代码兼容多个项目：APP，网页，微信，微信小程序等。

但在开发的过程中发现了，现在后台普遍用了自定义code去判断接口的成功失败信息。而http code则变成鸡脖，除非是服务器蹦了之外，其他一律返回200成功。为什么会有这个现状呢？具体不是很了解啊，据说是以前IE上有些http code报错会导致IE一些问题。不知道是不是，知道的可以给我科普下。

而在开发中使用自定义code也并没有什么问题，例如我们的项目一般接口返回的response信息完整结构：



```javascript
{
	data:{
		data:{
			userList:[
				{id:1}
			]
		},
		rcode: 300,
		message: "操作成功"
	},
	engine:'.....',
	headers:{//....},
	request:{//....},
	status:200,
	statusText:"request:ok"
}
```





而我们开发中一般用一个拦截器去拦截接口中的错误和返回接口要用的东西，不用的heades我们就不返回了。例如:

```javascript
response.use(
  (response) => {
    if(response.data.rcode===405){
      //统一处理某个自定义错误code
    }else{
      return response.data;//返回我们要用的数据
      promise.resolve();
    }
  },
  (err) => {
	//httpcode 错误 默认返回200，所以只要处理500以上的服务器问题即可
	//发生网络错误后会走到这里
    if(err.status>=500){
       //统一处理某个httpcode 500以上错误
    }
  }
);
```





使用了拦截器后我们正常得到的数据格式如下:

```javascript
{
		data:{
			userList:[
				{id:1}
			]
		},
		rcode: 300,
		message: "操作成功"
},
```





但我们请求完数据后必须判断rcode是否成功才好操作,否则会报错，例如

```javascript
let res=await this.api.getUserList();
if(res.data.rcode==300){//要先判断是否成功,否则失败下面语句会报错找不到'userList'，接口失败是没有返回userList的	
	this.userList=res.data.userList;
}
```



以上就基本大部分公司的写法，也没什么问题。但写多了（例如：100个接口）就会发现,100个接口，前端就要写100个` if(res.data.rcode==300) `。能不能有办法优化下。

后来用接触了nodejs 自己写后台接口发现是可以优化的，而且对于接口比较多的项目，效率可以大大的提高，对于前后台都是。那就是用httpcode替换自定义的code。

#  先来说说httpcode相对于自定义code的好处

1. 规范，httpcode的规范有国际的规范，百度搜一下就有。而使用自定义code规范都是自己定的，而且每个项目的定义code的字段，每个值的规范也不一样容易混乱。如果每个项目都用httpcode 都用国际的规范这样是不是会好很多？
2. 对于后端开发来说使用httpcode可以大大增加效率，例如：

- 使用自动code时输出数据

 ```
 //成功时
this.body={
	data:{
		userList:[{id:1}]
	},
	rcode:300,
	msg:'成功'
}
//失败时
this.body={
	rcode:400,
	msg:'失败'
}

 ```

- 使用httpcode是，因为默认输出都是200，只有错误的的是否才需要去定义错误码：

  ```
  //成功时
  this.body={
  	userList:[{id:1}]
  }
  //失败时
  this.status=400;
  this.body={
  	msg:'失败'
  }
  ```

  你可能以为也就简单了那么点事，可是当有100个接口时呢？效率就是从这里来的啊



  对于前端开发来说使用httpcode也可以大大增加效率，例如：

  拦截器就不用去判断自定义code 而直接判断httpcode：

  ``` javascript
  response.use(
    (response) => {
      if(response.data.rcode===405){
        //统一处理某个自定义错误code
      }else{
        return response.data;//返回我们要用的数据
        promise.resolve();
      }
    },
    (err) => {
  	//httpcode 错误 默认返回200，所以只要处理500以上的服务器问题即可
  	//发生网络错误后会走到这里
  	if(err.status===400){
        //统一处理某个httpcode 错误
      }else if(err.status>=500){
         //统一处理某个httpcode 500以上错误
      }
    }
  );
  ```



# 然后再来对比下使用httpcode和使用自定义code的数据个操作：

``` javascript
//自定义code时返回数据
{
		data:{
			userList:[
				{id:1}
			]
		},
		rcode: 300,
		message: "操作成功"
}

//httpcode时返回数据
{
		userList:[
				{id:1}
			]
},


//自定义code时操作
let res=await this.api.getUserList();
if(res.data.rcode==300){//要先判断是否成功,否则失败下面语句会报错找不到'userList'，接口失败是没有返回userList的	
	this.userList=res.data.userList;
}


//httpcode时操作
let res=await this.api.getUserList();
if(res){//要先判断是否成功,否则失败下面语句会报错找不到'userList'，接口失败是没有返回userList的	
	this.userList=res.userList;
}
```



虽然感觉就优化了那么点，但真正写起来，那么多个接口，你就会感觉显明方便多，效率也快乐。
