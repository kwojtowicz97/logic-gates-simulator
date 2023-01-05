import {
  getIncomers,
  getOutgoers,
  useNodeId,
  useNodes,
  useEdges,
  Node,
  Edge,
} from 'reactflow'

export type TConnected<T = any> = {
  before: { sourceNode: Node<T>; edgeBefore: Edge }[]
  after: { targetNode: Node<T>; edgeAfter: Edge }[]
}

const useNeighbours = <T,>() => {
  const id = useNodeId()
  const nodes = useNodes<T>()
  const egdes = useEdges()

  const node = nodes.find((n) => n.id === id)

  if (!node) throw new Error('Node not found')

  const connectedEdges = {
    input1: egdes.filter(
      (edge) => edge.target === id && edge.targetHandle === 'input1'
    )[0],
    input2: egdes.filter(
      (edge) => edge.target === id && edge.targetHandle === 'input2'
    )[0],
    output: egdes.filter((edge) => edge.source === id),
  }

  const connected: TConnected = { before: [], after: [] }

  for (let edge of egdes) {
    if (edge.target === id) {
      const sourceNode = nodes.find((node) => node.id === edge.source)
      if (!sourceNode) throw new Error('source node not found')
      connected.before.push({ sourceNode, edgeBefore: edge })
    }
    if (edge.source === id) {
      const targetNode = nodes.find((node) => node.id === edge.target)
      if (!targetNode) throw new Error('target node not found')
      connected.after.push({ targetNode, edgeAfter: edge })
    }
  }
  const nodesBefore = getIncomers(node, nodes, egdes)

  const nodesAfter = getOutgoers(node, nodes, egdes)

  return {
    connected,
    connectedEdges,
    connectedNodes: { nodesBefore, nodesAfter },
  }
}

export default useNeighbours
