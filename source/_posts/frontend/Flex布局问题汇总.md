---
title: Flex 布局问题汇总
abbrlink: 794
date: 2019-10-14 16:24:03
tags: frontend
---
flex布局使用起来很方便\n而且现在的浏览器也基本支持了
大家可放心用起来。
但用了flex总会有一些小问题
这里总结下再使用flex时遇到的问题：

### flex下 input 宽度无法自适应：
```javascript
   <div class='flex'>        
    <input class='flex1'>
    <button>提交</button>
  </div>
```
               
以上代码在有写浏览器上input宽度不能自适应，导致了input和button宽度固定，如果button的自多点就会超出了父div的宽度了。
#### 解决方法：
- 添加`min-width:0;`网上说的，但试了下并不行
- 添加div包裹即可（推荐）
```javascript
    <div class='flex'>
            <div class='flex1'><input style='width:100%'></div>
                    
                  <button>提交</button>
                      </div>
                        ```
### flex 下`text-overflow: ellipsis;`不生效
```javascript
    <div class='flex'>
            <label>标题</label>
                    <div class='flex1' style='text-overflow: ellipsis;overflow:hidden;white-space: nowrap;'>奥术大师多按时发斯蒂芬斯蒂芬斯蒂芬斯蒂芬是否水电费水电费水电费水电费水电费水电费水电费水电费</div>\n    </div>\n    ```\n    以上的div还是不能让`text-overflow: ellipsis`生效\n    \n    #### 解决方法\n    \n    - 父flex加`min-width:0;`\n      ```javascript\n        <div class='flex' style='min-width:0;'>\n            <label>标题</label>\n            <div class='flex1' style='text-overflow: ellipsis;overflow:hidden;white-space: nowrap;'>奥术大师多按时发斯蒂芬斯蒂芬斯蒂芬斯蒂芬是否水电费水电费水电费水电费水电费水电费水电费水电费</div>\n        </div>\n      ```
