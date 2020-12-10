export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : RecursivePartial<T[P]>
}

export type PartialExcept<T, K extends keyof T> = RecursivePartial<T> &
  Pick<T, K>
