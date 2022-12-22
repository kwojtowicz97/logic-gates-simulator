import React, { useMemo } from 'react'
import {
  getIncomers,
  getOutgoers,
  useNodeId,
  useNodes,
  useEdges,
} from 'reactflow'

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
    output: egdes.filter((edge) => edge.source === id)[0],
  }
  const nodesBefore = getIncomers(node, nodes, egdes)

  const nodesAfter = getOutgoers(node, nodes, egdes)

  return { connectedEdges, connectedNodes: { nodesBefore, nodesAfter } }
}

export default useNeighbours
