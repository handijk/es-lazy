import { lazyFunction } from './lazy-function.js';

export const lazyGenerator = (...args) => {
  let fn;
  return async function* generator(...generatorArgs) {
    if (!fn) {
      fn = lazyFunction(...args);
    }
    yield* (await fn)(...generatorArgs);
  };
};
