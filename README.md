<div align="center"><img src="https://yff111.github.io/dnd-ts/logo.png" height="320px" width="320px" aria-label="dnd-ts logo"></div>

# dnd-ts

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

[Documentation](https://yff111.github.io/dnd-ts)

Simple, low level drop-in drag & drop library 

### Features

- 🧰 **versatile:** covers most drag & drop use cases (multiple lists, horizontal lists, trees & nesting, tables etc.)
- 🌐 **framework agnostic:** only typescript and RxJS, no framework involved
- 📊 **performant:** large-list support due to event-throttling, event-delegation and rect-caching
- 🖱️ **auto-scrolling**
- 🍭 **custom drag image**
- 🍓 **custom indicator or placeholder**
- 🧩 **modular:** use only the features you need

### How to use

```ts
// docs/getting-started-snippet.ts

import createDragDrop from 'dnd-ts'

// provides a few basic styles for drop-animations etc.
// @ts-expect-error — CSS module, no types needed
import 'dnd-ts/dist/styles.css'

const instance = createDragDrop(document.getElementById('list')!, {
  // adds css classes to drag-, drop- and container-elements
  addClasses: true,
  // adds drop position indicator while dragging
  indicator: true,
  // adds custom drag image that follows the mouse cursor
  dragImage: true,
  // adds auto-scroll behavior inside the closest scrollable container
  autoScroll: true,
  onDragEnd({ dragElements, dropElement, position }) {
    // do list transformation on "DragEnd"
  },
  // for more options @see `DragDropConfig`
})

// call destroy() when the component is unmounted to remove all event-listeners
instance.destroy()
```


for a more sophisticated solution consider: https://github.com/atlassian/pragmatic-drag-and-drop

### Links

- https://gist.github.com/alexreardon/9ef479804a7519f713fe2274e076f1f3

## License

[MIT](https://github.com/yff111/dnd-ts/blob/main/LICENSE) License © 2023-PRESENT [Stephan Reich](https://github.com/yff111)

[npm-version-src]: https://img.shields.io/npm/v/dnd-ts?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/dnd-ts
[npm-downloads-src]: https://img.shields.io/npm/dm/dnd-ts?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/dnd-ts
[bundle-src]: https://img.shields.io/bundlephobia/minzip/dnd-ts?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=dnd-ts
