import React from 'react'
import useNode from './useNode'
import { useNodes, useEdges, getIncomers } from 'reactflow'

const useNodesBefore = () => {
  const { node } = useNode()
  const nodes = useNodes()
  const egdes = useEdges()
  const nodesBefore = getIncomers(node, nodes, egdes)
  return nodesBefore
}

export default useNodesBefore
