---
uuid: 783e2210-4102-11eb-b113-9717c2aea740
title: 小程序开发-使用editor组件替换第三方富文本组件
categories:
  - 小程序
cover: >-
  https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E6%95%99%E7%A8%8B.jpg
date: 2019-10-09 00:44:19
tags:
---
### 小程序富文本问题

因为小程序用的不是html标签，，所以市面上的富文本编辑器都不适用，自己改起来也麻烦，大多都是小程序嵌入webview方式解决的富文本编辑框来实现，局限比较大。

还有个问题就是渲染富文本内容也就是html，前期哟很多第三方组件解决了这个问题  ，例如：`htmlparse`  等，但大多这些第三方组件也只是解决富文本的的渲染问题，而且性能也较大问题，编辑富文本一直是一个硬伤。最近期小程序推出了`editor`组件，就能基本解决以上问题，代替市面上第三方的关于小程序富文本插件。

本文就主要讲解下怎么用editor组件，封装一个自定义的富文本组件，既可以渲染html富文本，又可以变成富文本编辑框。

<!-- more -->

### editor 

关于editor组件的使用可以直接看 官方的文档

[editor组件](https://developers.weixin.qq.com/miniprogram/dev/component/editor.html) 





###  自定义富文本组件

 其实 还是比较简单的，editor组件文档里有示例代码，我们把示例带啊跑起来，就是一个富文本编辑框了：

![1568601815906](https://callmesoul-blog.oss-cn-shenzhen.aliyuncs.com/1568601815906.png)



然后我们主要就新建一个组定义组件，把示例带啊复制过去，

把编辑框内容(html)，是否只读（read-only），placeholder（空提示）作为参数传入即可。

- read-only

  ture 时即为渲染html模式，把编辑相关的隐藏即可。

  false 即为编辑框，显示编辑框相关内容，大家自行控制即可



需要 注意的是 在组件内获取editor wxml时要加`.in(this)`表示是组件内的wxml

```html
wx.createSelectorQuery().in(this)
        .select('#editor')
        .context(function(res) {
          
        })
        .exec()
```



剩下的都比较简单了，我直接贴代码,大家可以根据自己需求diy

```javascript
  <config>
{
  "component": true
}
</config>

<template>
  <view class="wrapper {{readOnly?'readOnly':''}}">
    <view class="toolbar" bindtap="format" wx:if="{{!readOnly}}">
      <i class="editicon icon-zitijiacu {{formats.bold ? 'ql-active' : ''}}" data-name="bold"></i>
      <i class="editicon icon-zitixieti {{formats.italic ? 'ql-active' : ''}}" data-name="italic"></i>
      <i
        class="editicon icon-zitixiahuaxian {{formats.underline ? 'ql-active' : ''}}"
        data-name="underline"
      ></i>
      <i
        class="editicon icon-zitishanchuxian {{formats.strike ? 'ql-active' : ''}}"
        data-name="strike"
      ></i>
      <i
        class="editicon icon-zuoduiqi {{formats.align === 'left' ? 'ql-active' : ''}}"
        data-name="align"
        data-value="left"
      ></i>
      <i
        class="editicon icon-juzhongduiqi {{formats.align === 'center' ? 'ql-active' : ''}}"
        data-name="align"
        data-value="center"
      ></i>
      <i
        class="editicon icon-youduiqi {{formats.align === 'right' ? 'ql-active' : ''}}"
        data-name="align"
        data-value="right"
      ></i>
      <i
        class="editicon icon-zuoyouduiqi {{formats.align === 'justify' ? 'ql-active' : ''}}"
        data-name="align"
        data-value="justify"
      ></i>
      <i
        class="editicon icon-line-height {{formats.lineHeight ? 'ql-active' : ''}}"
        data-name="lineHeight"
        data-value="2"
      ></i>
      <i
        class="editicon icon-Character-Spacing {{formats.letterSpacing ? 'ql-active' : ''}}"
        data-name="letterSpacing"
        data-value="2em"
      ></i>
      <i
        class="editicon icon-722bianjiqi_duanqianju {{formats.marginTop ? 'ql-active' : ''}}"
        data-name="marginTop"
        data-value="20px"
      ></i>
      <i
        class="editicon icon-723bianjiqi_duanhouju {{formats.micon-previewarginBottom ? 'ql-active' : ''}}"
        data-name="marginBottom"
        data-value="20px"
      ></i>
      <i class="editicon icon-clearedformat" bindtap="removeFormat"></i>
      <i
        class="editicon icon-font {{formats.fontFamily ? 'ql-active' : ''}}"
        data-name="fontFamily"
        data-value="Pacifico"
      ></i>
      <i
        class="editicon icon-fontsize {{formats.fontSize === '24px' ? 'ql-active' : ''}}"
        data-name="fontSize"
        data-value="24px"
      ></i>

      <i
        class="editicon icon-text_color {{formats.color === '#0000ff' ? 'ql-active' : ''}}"
        data-name="color"
        data-value="#0000ff"
      ></i>
      <i
        class="editicon icon-fontbgcolor {{formats.backgroundColor === '#00ff00' ? 'ql-active' : ''}}"
        data-name="backgroundColor"
        data-value="#00ff00"
      ></i>

      <i class="editicon icon-date" bindtap="insertDate"></i>
      <i class="editicon icon--checklist" data-name="list" data-value="check"></i>
      <i
        class="editicon icon-youxupailie {{formats.list === 'ordered' ? 'ql-active' : ''}}"
        data-name="list"
        data-value="ordered"
      ></i>
      <i
        class="editicon icon-wuxupailie {{formats.list === 'bullet' ? 'ql-active' : ''}}"
        data-name="list"
        data-value="bullet"
      ></i>
      <i class="editicon icon-undo" bindtap="undo"></i>
      <i class="editicon icon-redo" bindtap="redo"></i>

      <i class="editicon icon-outdent" data-name="indent" data-value="-1"></i>
      <i class="editicon icon-indent" data-name="indent" data-value="+1"></i>
      <i class="editicon icon-fengexian" bindtap="insertDivider"></i>
      <i class="editicon icon-charutupian" bindtap="insertImage"></i>
      <i
        class="editicon icon-format-header-1 {{formats.header === 1 ? 'ql-active' : ''}}"
        data-name="header"
        data-value="{{1}}"
      ></i>
      <i
        class="editicon icon-zitixiabiao {{formats.script === 'sub' ? 'ql-active' : ''}}"
        data-name="script"
        data-value="sub"
      ></i>
      <i
        class="editicon icon-zitishangbiao {{formats.script === 'super' ? 'ql-active' : ''}}"
        data-name="script"
        data-value="super"
      ></i>
      <!-- <i class="editicon icon-quanping"></i> -->
      <i class="editicon icon-shanchu" bindtap="clear"></i>
      <i
        class="editicon icon-direction-rtl {{formats.direction === 'rtl' ? 'ql-active' : ''}}"
        data-name="direction"
        data-value="rtl"
      ></i>
    </view>

    <editor
      id="editor"
      class="readOnly?'readOnly-container':'ql-container'"
      placeholder="{{placeholder}}"
      showImgSize
      showImgToolbar
      showImgResize
      bindstatuschange="onStatusChange"
      read-only="{{readOnly}}"
      bindready="onEditorReady"
    ></editor>

    <!-- <view>
        <button bindtap="readOnlyChange">{{readOnly ? '可写':'只读'}}</button>
    </view>-->
  </view>
</template>

<script>
Component({
  properties: {
    readOnly: {
      type: Boolean,
      value: false
    },
      placeholder:{
      type: String,
      value: '开始输入...'
    },
    html:{
      type: String,
      value: ''
    }
  },
  data: {
    formats: {},
    bottom: 0,
    _focus: false,
    editorCtx:''
  },
  observers: {
    'html': function (html) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      if(this.editorCtx){
        this.editorCtx.setContents({
        html: html
      })
      }
    }
  },
  attached: function() {},
  ready: function() {},
  methods: {
    onEditorReady() {
      const that = this
      wx.createSelectorQuery().in(this)
        .select('#editor')
        .context(function(res) {
          that.editorCtx = res.context
          that.editorCtx.setContents({
            html: that.data.html
          })
        })
        .exec()
    },

    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    format(e) {
      let { name, value } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      this.editorCtx.format(name, value)
    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({ formats })
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function() {
          console.log('insert divider success')
        },
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function(res) {
          console.log('clear success')
        },
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() +
        1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate,
      })
    },
    insertImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success: function() {
          that.editorCtx.insertImage({
            src:
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543767268337&di=5a3bbfaeb30149b2afd33a3c7aaa4ead&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20151031%2Ftooopen_sy_147004931368.jpg',
            data: {
              id: 'abcd',
              role: 'god',
            },
            success: function() {
              console.log('insert image success')
            },
          })
        },
      })
    },
  },
})
</script>
<style lang="scss" src="./rich-text.scss"></style>

```



大家赶紧把第三方的富文本组件换过来吧~~~~