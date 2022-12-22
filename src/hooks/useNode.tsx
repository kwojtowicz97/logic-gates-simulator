import React from 'react'
import {
  useNodeId,
  useNodes,
  useEdges,
  getIncomers,
  getOutgoers,
} from 'reactflow'

const useNode = <T,>() => {
  const id = useNodeId()
  const nodes = useNodes<T>()
  const egdes = useEdges()

  const node = nodes.find((n) => n.id === id)

  if (!id || !nodes || !egdes || !node)
    throw new Error('Id or nodes or edges or nor not found')

  const nodesBefore = getIncomers(node, nodes, egdes)
  const nodesAfter = getOutgoers(node, nodes, egdes)

  return { id, node, nodesBefore, nodesAfter }
}

export default useNode
