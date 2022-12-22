import React, { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

const CustomNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connectedNodes, connectedEdges } = useNeighbours<TNodeData>()

  console.log(id, node)

  const clickHandler = (input: 'input1' | 'input2') => {
    data.onChange!(node, input, !data[input])
  }

  useEffect(() => {
    data.setNextNodeInOwnData!(
      node,
      connectedNodes.nodesAfter,
      connectedEdges.output
    )
  }, [JSON.stringify(connectedNodes.nodesAfter)])

  useEffect(() => {
    if (!data.outputNode || !data.outputEdge || !data.outputEdge.targetHandle)
      return
    const targetHandle = data.outputEdge.targetHandle as 'input1' | 'input2'
    data.onChange!(data.outputNode, targetHandle, data.output)
  }, [data.output])

  return (
    <div style={{ width: '100px', height: '50px', border: '1px solid black' }}>
      <Handle
        style={{ top: '10%' }}
        id='input1'
        type='target'
        position={Position.Left}
      />
      <Handle id='input2' type='target' position={Position.Left} />
      <input
        type='checkbox'
        checked={data.input1}
        onChange={() => clickHandler('input1')}
      />
      <input
        type='checkbox'
        checked={data.input2}
        onChange={() => clickHandler('input2')}
      />
      <input type='checkbox' checked={data.output} disabled />

      <Handle type='source' position={Position.Right} />
    </div>
  )
}

export default CustomNode
