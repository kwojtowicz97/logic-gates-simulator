import { useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'
import { gates } from './logic'

const CustomNode = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  // const isChild = !!node.parentNode
  const isChild = false

  const clickHandler = (input: string) => {
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

  const inputs = Object.entries(data.inputs)
  const ouputs = Object.entries(data.outputs)

  return (
    <div
      style={{
        width: '80px',
        height: '50px',
        // border: '1px solid black',
        borderRadius: '5px',
        position: 'relative',
        // background: 'white',
        display: isChild ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        style={{ width: '100%', margin: 'auto' }}
        src={gates[data.logic].image}
      />
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          height: '60%',
          margin: '10px 0',
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
      {/* {Object.entries(data.inputs).map((entry) => (
        <input
          key={entry[0]}
          type='checkbox'
          checked={data.inputs[entry[0]]}
          onChange={() => clickHandler(entry[0])}
        />
      ))} */}
      {/* <input type='checkbox' checked={data.outputs.output1} disabled />
      {data.logic} {id} */}
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

export default CustomNode
