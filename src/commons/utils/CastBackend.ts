/**
 * Casts a library returned by an API call to a
 * Library used in the frontend.
 */
export const castLibrary = (lib: any) => ({
  variant: lib.variant,
  external: {
    /** external names are lowercase for API results */
    symbols: lib.external.symbols
  },
  /** globals are passed as an object, mapping symbol name -> value */
  globals: Object.entries(lib.globals as object).map(entry => {
    /** The value that is passed is evaluated into an actual JS value */
    try {
      entry[1] = (window as any).eval(entry[1]);
    } catch (e) {}
    return entry;
  })
});
