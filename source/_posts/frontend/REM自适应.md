---
title: REM自适应
abbrlink: 52063
date: 2019-10-14 16:14:57
tags: frontend
---
<p>designSize=640 为设计稿大小<br>
htmlFontSize=100为当设计稿为640px时html font-size为100px<br>
(建议默认100，因为好换算,10也可以，但pc有些浏览器会不支持12px以下字体，所用100最安全)<br>
此时1px=0.01rem;</p>
<pre><code> (function(doc, win, designSize,htmlFontSize) {
        var docEl = doc.documentElement,
                isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
                dpr = window.top === window.self ? dpr : 1, //被iframe引用时，禁止缩放
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        docEl.dataset.dpr = dpr;
        var recalc = function() {
          var width = docEl.clientWidth;
          if (width / dpr &gt; designSize) {
            width = designSize * dpr;
          }
          docEl.dataset.width = width;
          docEl.dataset.percent = htmlFontSize * (width / designSize);
          docEl.style.fontSize = htmlFontSize * (width / designSize) + 'px';
        };
        recalc();
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
      })(document, window,640,100);
      ```</code></pre>
"
