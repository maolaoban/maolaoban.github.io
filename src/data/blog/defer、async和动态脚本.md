---
title: "defer、async和动态脚本"
description: "defer、async和动态脚本"
pubDate: "2021-01-08"
---

### defer、async和动态脚本

当浏览器加载HTML遇到<script>...</script>时，便会停止DOM构建，去加载script。

下载执行之后，才能继续处理。

这会导致两个重要的问题：

1. 脚本不能访问到位于它们下面的 DOM 元素，因此，脚本无法给它们添加处理程序等。
2. 如果页面顶部有一个笨重的脚本，它会“阻塞页面”。在该脚本下载并执行结束前，用户都不能看到页面内容。

常用的解决方法是将script标签放到页面的底部。当网络较差是也会有一些问题。

* `defer`特性告诉浏览器不需要等待脚本，继续处理HTML，脚本会在“后台”下载，扥DOM构建完成之后，再执行脚本。`defer`特性适用于外部脚本。

  **文档顺序**（它们在文档中的顺序）

  在文档加载和解析完成之后（如果需要，则会等待），即在 `DOMContentLoaded` 之前执行。

* `async`类似`defer`

  **加载优先顺序**。脚本在文档中的顺序不重要 —— 先加载完成的先执行

  可能在文档加载完成前加载并执行完毕。如果脚本很小或者来自于缓存，同时文档足够长，就会发生这种情况。

在script里动态的创建一个脚本：

```js
let script = document.createElement('script');
script.src = "/article/script-async-defer/long.js";
document.body.append(script);
```

当脚本被添加到文档时就会立即开始加载。

默认情况下，动态脚本的行为是异步的。