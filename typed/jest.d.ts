declare namespace jest {
  export interface Expect {
    // The return type for expect.any() is any. However, this is inaccurate
    // and results in a linter warning for assigning an implicit any value.
    // This fixes the inaccurate type and resolves the warning.
    any: (classType: unknown) => object
    stringContaining: (text: string) => object
    stringMatching: (match: RegExp) => object
  }
}
