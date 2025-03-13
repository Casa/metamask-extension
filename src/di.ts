export type Reader<Dependencies, Return> = (
  dependencies: Dependencies,
) => Return
