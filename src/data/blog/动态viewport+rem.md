---
title: "动态viewport+rem"
description: "动态viewport+rem"
pubDate: "2025-02-19"
---

```js
    var viewport = document.querySelector("meta[name=viewport]");
    //下面是根据设备像素设置viewport
    if (window.devicePixelRatio == 1) {
            viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');
    }
    if (window.devicePixelRatio == 2) {
            viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');
    }
    if (window.devicePixelRatio == 3) {
            viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no');
    }
    var docEl = document.documentElement;
    var fontsize = 10 * (docEl.clientWidth / 320) + 'px';
    docEl.style.fontSize = fontsize;
```