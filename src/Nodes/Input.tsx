import { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

const InputNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  const clickHandler = (input: 'input1') => {
    data.onChange!(node, input, !data.inputs[input])
  }

  const deleteHandler = () => {
    if (data.onDelete) data.onDelete(node)
  }

  useEffect(() => {
    data.setNextNodeInOwnData!(node, connected)
  }, [JSON.stringify(connectedEdges)])

  useEffect(() => {
    const outputNodes = data.connected.after.map((a) => a.targetNode)
    const outputEdges = data.connected.after.map((a) => a.edgeAfter)
    if (!outputNodes || !outputEdges) return
    for (let outputEgde of outputEdges) {
      const targetHandle = outputEgde.targetHandle as 'input1' | 'input2'
      const outputNode = outputNodes.find(
        (oNode) => oNode.id === outputEgde.target
      )
      if (!outputNode) throw new Error('Output node not found')
      if (!outputEgde.sourceHandle)
        throw new Error('Source handle node not found')
      data.onChange!(
        outputNode,
        targetHandle,
        data.outputs[outputEgde.sourceHandle]
      )
    }
  }, [JSON.stringify(data.outputs)])

  const ouputs = Object.keys(data.outputs)

  return (
    <div
      style={{
        width: '100px',
        height: '50px',
        border: '1px solid black',
        borderRadius: '5px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      ></div>
      <input
        type='checkbox'
        checked={data.inputs.input1}
        onChange={() => clickHandler('input1')}
      />
      <input type='checkbox' checked={data.outputs.output1} disabled />
      Input {id}
      <button onClick={deleteHandler}>Delete</button>
      <div
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        {ouputs.map((ouput) => (
          <Handle
            key={`${id}-${ouput}`}
            style={{ position: 'unset', transform: 'translate(50%, 0)' }}
            id={ouput}
            type='source'
            position={Position.Right}
          />
        ))}
      </div>
    </div>
  )
}

export default InputNode
