import { NONAME } from 'dns'
import { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

const InputNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  const isChild = !!node.parentNode

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

  const ouputs = Object.entries(data.outputs)

  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '2px solid black',
        borderRadius: '50%',
        position: 'relative',
        cursor: 'pointer',
        display: isChild ? 'none' : 'block',
      }}
    >
      {/* <input type='checkbox' checked={data.outputs.output1} disabled /> */}
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
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-45%, -50%)',
          pointerEvents: 'none',
        }}
      >
        In
      </div>
      <input
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          padding: '0px',
          border: 'none',
          margin: '0px',
          background: data.inputs.input1 ? 'red' : 'white',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          cursor: 'pointer',
          zIndex: '20',
        }}
        type='checkbox'
        checked={data.inputs.input1}
        onChange={() => clickHandler('input1')}
      />
      <button
        style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          background: '#ccc',
          border: 'none',
          cursor: 'pointer',
          color: 'red',
          width: '10px',
          height: '10px',
          zIndex: '99',
        }}
        onClick={deleteHandler}
      ></button>
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
            key={`${id}-${ouput[0]}`}
            style={{
              position: 'unset',
              transform: 'translate(50%, 0)',
              background: ouput[1] ? 'red' : 'black',
            }}
            id={ouput[0]}
            type='source'
            position={Position.Right}
          />
        ))}
      </div>
    </div>
  )
}

export default InputNode
