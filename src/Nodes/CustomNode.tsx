import { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

const CustomNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours<TNodeData>()

  const clickHandler = (input: string) => {
    data.onChange!(node, input, !data.inputs[input])
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

  const inputs = Object.keys(data.inputs)
  const ouputs = Object.keys(data.outputs)

  Object.entries(data.inputs).map((key) => console.log(key))

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
      >
        {inputs.map((input) => (
          <Handle
            key={`${id}-${input}`}
            style={{ position: 'unset', transform: 'translate(-50%, 0)' }}
            id={input}
            type='target'
            position={Position.Left}
          />
        ))}
      </div>
      {Object.entries(data.inputs).map((entry) => (
        <input
          key={entry[0]}
          type='checkbox'
          checked={data.inputs[entry[0]]}
          onChange={() => clickHandler(entry[0])}
        />
      ))}
      <input type='checkbox' checked={data.outputs.output1} disabled />
      {data.logic} {id}
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

export default CustomNode