export const lazyClass =
  (meta, path, exportedAs = 'default') =>
  (...args) =>
    import(meta.resolve(path)).then(
      ({ [exportedAs]: ExportedClass }) => new ExportedClass(...args)
    );
