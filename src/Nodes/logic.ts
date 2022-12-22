export const Logic = {
  or: (a: boolean, b: boolean) => a || b,
  and: (a: boolean, b: boolean) => a && b,
  xor: (a: boolean, b: boolean) => (a || b) && !(a && b),
  nand: (a: boolean, b: boolean) => !(a && b),
  nor: (a: boolean, b: boolean) => !(a || b),
  xnor: (a: boolean, b: boolean) => !((a || b) && !(a && b)),
}

export type TLogic = keyof typeof Logic
