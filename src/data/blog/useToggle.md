---
title: "useToggle"
description: "useToggle"
pubDate: "2025-02-19"
---

```js
function useToggle(initialValue) {
 const [value, setValue] = React.useState(initialValue);

 const toggle = React.useCallback(() => {
  setValue(v => !v);
 }, []);

 return [value, toggle];
}
```