import { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

const CustomNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connectedNodes, connectedEdges } = useNeighbours<TNodeData>()

  const clickHandler = (input: 'input1' | 'input2') => {
    data.onChange!(node, input, !data[input])
  }

  useEffect(() => {
    data.setNextNodeInOwnData!(
      node,
      connectedNodes.nodesAfter,
      connectedEdges.output
    )
  }, [JSON.stringify(connectedEdges.output)])

  useEffect(() => {
    if (!data.outputNodes || !data.outputEdges) return
    for (let outputEgde of data.outputEdges) {
      const targetHandle = outputEgde.targetHandle as 'input1' | 'input2'
      const outputNode = data.outputNodes.find(
        (oNode) => oNode.id === outputEgde.target
      )
      if (!outputNode) return
      console.log(outputNode, targetHandle, data.output)
      data.onChange!(outputNode, targetHandle, data.output)
    }
  }, [data.output])

  return (
    <div
      style={{
        width: '100px',
        height: '50px',
        border: '1px solid black',
        borderRadius: '5px',
      }}
    >
      <Handle
        style={{ top: '25%' }}
        id='input1'
        type='target'
        position={Position.Left}
      />
      <Handle
        style={{ top: '75%' }}
        id='input2'
        type='target'
        position={Position.Left}
      />
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
      {data.logic}

      <Handle type='source' position={Position.Right} />
    </div>
  )
}

export default CustomNode
