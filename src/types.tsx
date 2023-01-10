import { TConnected } from './hooks/useIncomersData'
import { TGates } from './Nodes/logic'
import { Node, Edge } from 'reactflow'

export type TBlocks = {
  name: string
  nodes: Node<TNodeData>[]
  edges: Edge[]
}[]

export type TContext = {
  setNextNodeInOwnData:
    | ((currentNode: Node<TNodeData>, connected: TConnected) => void)
    | null
  onChange:
    | ((currentNode: Node<TNodeData>, input: string, value: boolean) => void)
    | null
  onDelete: ((nodeToDelete: Node) => void) | null
}

export type TNodeData = {
  inputs: {
    [key: string]: boolean
  }
  outputs: {
    [key: string]: boolean
  }

  connected: TConnected<TNodeData>
  logic: keyof TGates
  inputsMap?: { [key: string]: Node<TNodeData> }
  outputsMap?: { [key: string]: Node<TNodeData> }
  name?: string
  setName?: (nodeId: string, name: string) => void
  updateBlockOutput?: (blockId: string, output: string, value: boolean) => void
}

export type TProject = {
  name: string
  nodes: Node[]
  edges: Edge[]
  autosave: boolean
  upToDate: boolean
}
