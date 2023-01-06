export type TGates = {
  [key in TGatesNames]: {
    fn: (a: boolean, b: boolean) => boolean
    inputs: string[]
    outputs: string[]
  }
}
export type TGatesNames =
  | 'or'
  | 'and'
  | 'xor'
  | 'nand'
  | 'nor'
  | 'xnor'
  | 'not'
  | 'blockInput'
  | 'blockOutput'

export type TComponents = TGatesNames | 'in' | 'clk'

export const gates = {
  or: {
    fn: (a: boolean, b: boolean) => {
      return { output1: a || b }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
  },
  and: {
    fn: (a: boolean, b: boolean) => {
      return { output1: a && b }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
  },
  xor: {
    fn: (a: boolean, b: boolean) => {
      return { output1: (a || b) && !(a && b) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
  },
  nand: {
    fn: (a: boolean, b: boolean) => {
      return { output1: !(a && b) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
  },
  nor: {
    fn: (a: boolean, b: boolean) => {
      return { output1: !(a || b) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
  },
  xnor: {
    fn: (a: boolean, b: boolean) => {
      return { output1: !((a || b) && !(a && b)) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
  },
  not: {
    fn: (a: boolean) => {
      return { output1: !a }
    },
    inputs: { input1: false },
    outputs: { output1: true },
  },
  blockInput: {
    fn: (a: boolean) => {
      return { output1: a }
    },
    inputs: { input1: false },
    outputs: { output1: false },
  },
  blockOutput: {
    fn: (a: boolean) => {
      return { output1: a }
    },
    inputs: { input1: false },
    outputs: { output1: false },
  },
}
