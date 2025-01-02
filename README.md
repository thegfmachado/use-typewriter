# useTypewriter hook ✍️⌨️

[![version][version-badge]][npm]
[![typescript][typescript-badge]][typescript-badge]
[![size][size-badge]][bundlephobia]

_A [React][react] hook to add a dynamic typewriting effect to your components!_

<p align="center">
    <a href="https://www.npmjs.com/package/@gfmachado/use-typewriter">
        <img alt="next link" src="./images/cover.png" width="500">
    </a>
</p>

## 📦 Installation

This package is hosted on [npm][npm].

```bash
npm install @gfmachado/use-typewriter
```

## 🔧 Usage

In any React component, import `useTypewriter`, then call it like any other [hook][hooks]. The returned `typewriter` instance will update every second with the remaining time.

```typescript
import React, { useRef } from 'react';
import useCountdown from '@gfmachado/use-typewriter';

const App = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const typewriter = useTypewriter({
    targetRef,
    speed: 150,
    cursor: true,
    loop: true,
  });

  React.useEffect(() => {
    typewriter
      .write("Hello, world!")
      .stop(500)
      .delete(6)
      .write("Typewriter!")
      .start();
  }, [typewriter]);

  return <div ref={targetRef} />;
};

export default App;
```

## 📖 API Reference

### `useTypewriter({ targetRef, loop: true })`

Starts a typewriter effect based on the provided options. The returned `TypewriterInstance` object works like a chainable actions queue, it means you can combine actions like write, stop or delete. Just don't forget to call `start()` as the last chain method.

### Options

| Option        | Type                                         | Default Value | Description                                                                                      |
| ------------- | -------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `targetRef`   | `React.RefObject<HTMLElement \| null>`       | -             | The target element (a reference) where the typewriter effect will be applied. It must be passed as a `ref` to the element you want to animate. |
| `speed`       | `number`                                    | `100`         | Typing and deleting speed in milliseconds per character.                                         |
| `cursor`      | `boolean`                                   | `true`        | Whether to display a blinking cursor.                                                            |
| `cursorChar`  | `string`                                    | `"\|"`         | The character to use for the blinking cursor.                                                    |
| `cursorSpeed` | `number`                                    | `450`         | The speed of the blinking cursor in milliseconds.                                                |
| `loop`        | `boolean`                                   | `false`       | Whether to loop the typewriter queue.                                                            |
| `onWrite`     | `(text: string) => void`                    | -             | Callback function called when new text is written.                                               |
| `onDelete`    | `(text: string) => void`                    | -             | Callback function called when text is deleted.                                                   |
| `onComplete`  | `() => void`                                | -             | Callback function called when the typewriter completes a loop.                                   |

### Instance Methods

| Method           | Description                                         |
| ---------------- | --------------------------------------------------- |
| `write(text: string)`    | Appends new text to the output.                     |
| `delete(count: number)`  | Deletes a specified number of characters.           |
| `stop(duration: number)` | Pauses the effect for a specified duration (in ms). |
| `start()`        | Starts processing the typewriter queue.             |
| `reset()`        | Clears all text and pending tasks from the queue.   |

## ❔ Questions

🐛📢 Report bugs and provide feedback by filing [issues][issues]

## ✨ Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://gfmachado.dev"><img src="https://avatars.githubusercontent.com/u/53434033?s=400&v=4" width="100px;" alt="Gabriel Machado"/><br /><sub><b>Gabriel Machado</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

[issues]: https://github.com/thegfmachado/use-typewriter/issues
[react]: https://reactjs.org
[npm]: https://www.npmjs.com/package/@gfmachado/use-typewriter
[hooks]: https://reactjs.org/docs/hooks-intro.html
[bundlephobia]: https://bundlephobia.com/result?p=@gfmachado/use-typewriter
[version-badge]: https://img.shields.io/npm/v/@gfmachado/use-typewriter.svg?style=flat-square
[size-badge]: https://img.shields.io/bundlephobia/minzip/@gfmachado/use-typewriter?style=flat-square
[typescript-badge]: https://img.shields.io/npm/types/@gfmachado/use-typewriter?style=flat-square
```
