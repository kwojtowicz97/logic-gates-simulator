import { NONAME } from 'dns'
import { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

const OutputNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  const isChild = !!node.parentNode

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

  const inputs = Object.entries(data.inputs)

  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '2px solid black',
        borderRadius: '50%',
        background: data.inputs.input1 ? 'red' : 'white',
        position: 'relative',
        display: isChild ? 'none' : 'block',
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
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        Out
      </div>
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
            key={`${id}-${input[0]}`}
            style={{
              position: 'unset',
              transform: 'translate(-50%, 0)',
              background: input[1] ? 'red' : 'black',
            }}
            id={input[0]}
            type='target'
            position={Position.Left}
          />
        ))}
      </div>
    </div>
  )
}

export default OutputNode
