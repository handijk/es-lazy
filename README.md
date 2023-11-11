# es-lazy

Lazy load [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

* [Installation](#installation)
* [Usage](#usage)
* [Lazy function](#lazy-function)
* [Lazy class](#lazy-class)
* [Lazy generator](#lazy-generator)
* [Lazy factories](#lazy-factories)

## Installation

```
npm i es-lazy
```

## Usage

All methods take three arguments:
- meta: [Import meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
- path: the path to the filename relative to the current file
- exportedAs: the name of the export to import (default: `default`)

## Lazy function

Create an async function that when called will import the file and call the exported function with the arguments provided.

###### lazy.js
```js
export default (name) => {
  return `${name} is lazy!`;
}
```

```js
import { lazyFunction } from 'es-lazy/lazy-function.js';

const iAmLazy = lazyFunction(import.meta, './lazy.js');

console.log(await iAmLazy('Han')); // --> Han is lazy!
```

## Lazy class

Create an async function that when called will import the file and instantiate the exported class with the arguments provided.

###### lazy.js
```js
export default class {
  constructor(name) {
    this.name = name;
  }

  message() {
    return `${this.name} is lazy!`;
  }
}
```

```js
import { lazyClass } from 'es-lazy/lazy-class.js';

const iAmLazy = lazyClass(import.meta, './lazy.js');

console.log((await iAmLazy('Han')).message()); // --> Han is lazy!
```

## Lazy generator

Create an async generator function that when yielded will import the file and call the exorted generator function with the arguments provided.

###### lazy.js
```js
export default function* (name) {
  yield `${name} is lazy!`;
  yield `${name} is still lazy!`;
  yield `${name} is not getting less lazy!`;
}
```

```js
import { lazyGenerator } from 'es-lazy/lazy-generator.js';

const iAmLazy = lazyGenerator(import.meta, './lazy.js');

for await (const message of iAmLazy('Han')) {
  console.log(message); 
}

// console --> Han is lazy!
// console --> Han is still lazy!
// console --> Han is not getting less lazy!

```

## Lazy factories

The factory is called once when the first call to the factorized method is made. Available for functions (`lazy-function-factory.js`), classes (`lazy-class-factory.js`) and generators (`lazy-generator-factory.js`).

###### lazy.js
```js
export default (name) => (lazyOrNot) => {
  return `${name} is ${lazyOrNot ? 'lazy' : 'not lazy'}!`;
} 
```

```js
import { lazyFunctionFactory } from 'es-lazy/lazy-function-factory.js';

const amILazyFactory = lazyFunctionFactory(import.meta, './lazy.js');
const amILazy = amILazyFactory('Han');


console.log(await amILazy(true)); // --> Han is lazy!
console.log(await amILazy(false)); // --> Han is not lazy!
```

