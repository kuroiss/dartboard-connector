import type { Signal } from "./Signal.js"

/**
 * `value`:
 *    segment = Math.floor(value / 20)
 *      inner single: 0
 *      outer single: 1
 *      double: 2
 *      triple: 3
 *    area = value % 20
 *    single bull = 81
 *    double bull = 82
 *    change = 84
 */
export const format = (value: number): Signal => {
  if (value === 84) {
    return { type: "change" }
  }
  if (value === 81 || value === 82) {
    return { type: "segment", base: 25, ratio: value % 80 }
  }
  const segmentType = Math.floor(value / 20)
  const ratio = (() => {
    if (segmentType === 2 || segmentType === 3) {
      return segmentType
    }
    return 1
  })()
  const base = value % 20 || 20
  return {
    type: "segment",
    base,
    ratio,
  }
}
