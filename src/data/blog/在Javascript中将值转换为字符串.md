---
title: "在Javascript中将值转换为字符串"
description: "在Javascript中将值转换为字符串"
pubDate: "2025-05-14"
---

|                     | undefined | null | Symbol() | {\_\_proto\_\_:null}|
| ------------------- | --------- | --------- | --------- | --------- |
| String(v)           |    ✅    |    ✅    |    ✅    | TypeError |
| '' + v              |    ✅    |    ✅    | TypeError | TypeError |
| \`${v}\`             |    ✅    |    ✅    | TypeError | TypeError |
| v.toString()        | TypeError | TypeError |    ✅    | TypeError |
| {}.toString.call(v) |    ✅    |    ✅    |    ✅    |    ✅    |



```
{}.toString.call(v)等效于Object.prototype.toString.call(v)
```