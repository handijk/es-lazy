import { lazyFunction } from './lazy-function.js';

export const lazyFunctionFactory =
  (...args) =>
  (...factoryArgs) => {
    let fn;
    return async (...functionArgs) => {
      if (!fn) {
        fn = lazyFunction(...args)(...factoryArgs);
      }
      return (await fn)(...functionArgs);
    };
  };
