import { lazyClass } from './lazy-class.js';

export const lazyFunctionFactory =
  (...args) =>
  (...factoryArgs) => {
    let fn;
    return async (...classArgs) => {
      if (!fn) {
        fn = lazyClass(...args)(...factoryArgs);
      }
      return (await fn)(...classArgs);
    };
  };
