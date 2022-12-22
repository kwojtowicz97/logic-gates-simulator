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
    console.log('nodesAfter')
    data.setNextNodeInOwnData!(
      node,
      connectedNodes.nodesAfter,
      connectedEdges.output
    )
  }, [JSON.stringify(connectedNodes.nodesAfter.map((node) => node.id))])

  useEffect(() => {
    console.log('output')
    if (!data.outputNode || !data.outputEdge || !data.outputEdge.targetHandle)
      return
    const targetHandle = data.outputEdge.targetHandle as 'input1' | 'input2'
    data.onChange!(data.outputNode, targetHandle, data.output)
  }, [data.output])

  console.log('rerender')

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
