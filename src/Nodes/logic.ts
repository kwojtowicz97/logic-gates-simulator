export type TGatesNames = 'or' | 'and' | 'xor' | 'nand' | 'nor' | 'xnor'

export type TGates = {
  [key in TGatesNames]: {
    fn: (a: boolean, b: boolean) => boolean
    data?: {
      input1?: boolean
      input2?: boolean
      output?: boolean
    }
  }
}
export const gates = {
  or: { fn: (a: boolean, b: boolean) => a || b },
  and: { fn: (a: boolean, b: boolean) => a && b },
  xor: { fn: (a: boolean, b: boolean) => (a || b) && !(a && b) },
  nand: { fn: (a: boolean, b: boolean) => !(a && b) },
  nor: { fn: (a: boolean, b: boolean) => !(a || b) },
  xnor: { fn: (a: boolean, b: boolean) => !((a || b) && !(a && b)) },
}
