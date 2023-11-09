import { lazyFunction } from './lazy-function.js';

export const lazyGeneratorFactory =
  (...args) =>
  (...factoryArgs) => {
    let fn;
    return async function* generator(...generatorArgs) {
      if (!fn) {
        fn = lazyFunction(...args)(...factoryArgs);
      }
      yield* (await fn)(...generatorArgs);
    };
  };
