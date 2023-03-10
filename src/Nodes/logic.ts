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

export type TComponents =
  | TGatesNames
  | 'in'
  | 'out'
  | 'clk'
  | 'display'
  | 'textNode'

export const gates = {
  or: {
    fn: (a: boolean, b: boolean) => {
      return { output1: a || b }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
    image: './assets/OR.png',
  },
  and: {
    fn: (a: boolean, b: boolean) => {
      return { output1: a && b }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
    image: './assets/AND.png',
  },
  xor: {
    fn: (a: boolean, b: boolean) => {
      return { output1: (a || b) && !(a && b) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: false },
    image: './assets/XOR.png',
  },
  nand: {
    fn: (a: boolean, b: boolean) => {
      return { output1: !(a && b) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: true },
    image: './assets/NAND.png',
  },
  nor: {
    fn: (a: boolean, b: boolean) => {
      return { output1: !(a || b) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: true },
    image: './assets/NOR.png',
  },
  xnor: {
    fn: (a: boolean, b: boolean) => {
      return { output1: !((a || b) && !(a && b)) }
    },
    inputs: { input1: false, input2: false },
    outputs: { output1: true },
    image: './assets/XNOR.png',
  },
  not: {
    fn: (a: boolean) => {
      return { output1: !a }
    },
    inputs: { input1: false },
    outputs: { output1: true },
    image: './assets/NOT.png',
  },
  blockInput: {
    fn: (a: boolean) => {
      return { output1: a }
    },
    inputs: { input1: false },
    outputs: { output1: false },
    image: './assets/OR.png',
  },
  blockOutput: {
    fn: (a: boolean) => {
      return { output1: a }
    },
    inputs: { input1: false },
    outputs: { output1: false },
    image: './assets/OR.png',
  },
}
