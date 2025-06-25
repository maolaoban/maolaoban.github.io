---
title: "no-store和no-cache"
description: "no-store和no-cache"
pubDate: "2025-02-19"
---

`no-cache` 和 `no-store` 用作控制缓存，被服务器通过响应头 `Cache-Control`传递给客户端

## **`no-store`**

**「永远都不要在客户端存储资源」**，每次永远都要从原始服务器获取资源

## **`no-cache`**

可以在客户端存储资源，但每次都**「必须去服务器做新鲜度校验」**，来决定从服务器获取最新资源 (200) 还是从客户端读取缓存 (304)，即所谓的协商缓存

