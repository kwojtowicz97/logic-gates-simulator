import React, { useMemo } from 'react'
import { getIncomers, useNodeId, useNodes, useEdges } from 'reactflow'

const useNodeData = <T,>() => {
  const id = useNodeId()
  const nodes = useNodes<T>()

  const node = nodes.find((n) => n.id === id)

  if (!node) throw new Error('Node not found')

  const data = useMemo(() => node.data, [JSON.stringify(node.data)])

  return data
}

export default useNodeData
