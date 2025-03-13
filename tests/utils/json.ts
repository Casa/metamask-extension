const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

export function jsonReviver<V>(key: string, value: V): V | Date {
  const datetime =
    typeof value === 'string' && dateRegex.test(value) ? Date.parse(value) : NaN
  if (!isNaN(datetime)) {
    return new Date(datetime)
  }
  return value
}
