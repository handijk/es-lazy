export const lazyFunction =
  (meta, path, exportedAs = 'default') =>
  (...args) =>
    import(meta.resolve(path)).then(({ [exportedAs]: exportedFn }) =>
      exportedFn(...args)
    );
