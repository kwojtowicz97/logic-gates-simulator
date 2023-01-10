import { type } from 'os'
import React, { useContext, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { context } from '../App'
import { TNodeData } from '../types'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'
import { gates } from './logic'
import './Display.css'

const Display = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  const { setNextNodeInOwnData, onChange, onDelete } = useContext(context)

  const isChild = !!node.parentNode

  const clickHandler = (input: string) => {
    onChange!(node, input, !data.inputs[input])
  }

  const deleteHandler = () => {
    if (onDelete) onDelete(node)
  }

  useEffect(() => {
    setNextNodeInOwnData!(node, connected)
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
      onChange!(outputNode, targetHandle, data.outputs[outputEgde.sourceHandle])
    }
  }, [JSON.stringify(data.outputs)])

  const inputs = Object.entries(data.inputs)
  const ouputs = Object.entries(data.outputs)

  return (
    <div
      className='display'
      style={{
        border: '2px solid black',
        borderRadius: '5px',
        position: 'relative',
        display: isChild ? 'none' : 'flex',
        background: 'white',
        alignItems: 'center',
        padding: '10px',
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
          alignItems: 'center',
        }}
      >
        {inputs.map((input) => (
          <Handle
            key={`${id}-${input[0]}`}
            style={{
              position: 'unset',
              transform: 'translate(-50%, 0)',
              background: input[1] ? 'red' : 'black',
              scale: '1 !important',
            }}
            id={input[0]}
            type='target'
            position={Position.Left}
          />
        ))}
      </div>
      <div
        id='display-1'
        className='display-container display-size-12 display-no-0'
      >
        <div
          className={['segment-x segment-a', inputs[0][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
        <div
          className={['segment-y segment-b', inputs[1][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
        <div
          className={['segment-y segment-c', inputs[2][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
        <div
          className={['segment-x segment-d', inputs[3][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
        <div
          className={['segment-y segment-e', inputs[4][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
        <div
          className={['segment-y segment-f', inputs[5][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
        <div
          className={['segment-x segment-g', inputs[6][1] ? 'active' : ''].join(
            ' '
          )}
        >
          <span className='segment-border'></span>
        </div>
      </div>
    </div>
  )
}

export default Display
