import { lazyFunction } from './lazy-function.js';

export const lazyGenerator = (...args) => async function* generator(...generatorArgs) {
    yield* await lazyFunction(...args)(...generatorArgs);
};
