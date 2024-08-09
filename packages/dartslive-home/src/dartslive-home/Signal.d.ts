export type Signal =
  | {
      type: "change"
    }
  | {
      type: "segment"
      inner?: true // `true` when inner segment of single
      base: number
      ratio: number
    }
