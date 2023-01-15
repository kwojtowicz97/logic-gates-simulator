import React, { useContext, useEffect } from 'react'
import { NodeProps, Handle, Position, useNodes } from 'reactflow'
import { context } from '../App'
import { TNodeData } from '../types'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

export const Block = ({ data }: NodeProps<TNodeData>) => {
  const { setNextNodeInOwnData, onChange, updateBlockOutput } =
    useContext(context)
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  const { inputsMap, outputsMap } = data

  const isChild = !!node.parentNode

  const nodes = useNodes<TNodeData>()

  let blockOutputsIds: string[] = []
  if (outputsMap) {
    blockOutputsIds = Object.values(outputsMap).map((output) => output.id)
  }

  useEffect(() => {
    setNextNodeInOwnData!(node, connected)
  }, [JSON.stringify(connectedEdges)])

  useEffect(() => {
    if (!outputsMap) throw new Error('outputs map not found')
    const outputNodes = data.connected.after.map((a) => a.targetNode)
    const outputEdges = data.connected.after.map((a) => a.edgeAfter)
    if (!outputNodes || !outputEdges)
      throw new Error('outputs edges or nodes not found')
    for (let outputEgde of outputEdges) {
      const targetHandle = outputEgde.targetHandle as 'input1' | 'input2'
      const outputNode = outputNodes.find(
        (oNode) => oNode.id === outputEgde.target
      )
      if (!outputNode) {
        throw new Error('Output node not found')
      }
      if (!outputEgde.sourceHandle)
        throw new Error('Source handle node not found')

      const outputHandle = outputEgde.sourceHandle
      if (!outputEgde.sourceHandle) throw new Error('source handle not found')
      const outputId = outputsMap[outputHandle].id

      const sourceNode = nodes.find((node) => node.id === outputId)
      let value = false
      if (sourceNode) {
        value = sourceNode.data.outputs['output1']
      }
      if (!updateBlockOutput) throw new Error('updateBlockOutput fn not found')
      updateBlockOutput(id, outputHandle, value)
      onChange!(outputNode, targetHandle, value)
    }
  }, [
    JSON.stringify(
      nodes
        .filter((node) => blockOutputsIds.includes(node.id))
        .map((node) => Object.values(node.data.outputs))
    ),
    JSON.stringify(data.connected),
  ])

  return (
    <div
      style={{
        border: '2px solid black',
        borderRadius: '5px',
        position: 'relative',
        display: isChild ? 'none' : 'flex',
        background: 'white',
        alignItems: 'center',
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
        {inputsMap
          ? Object.keys(inputsMap).map((input) => (
              <Handle
                key={`${id}-${input}`}
                style={{
                  position: 'unset',
                  transform: 'translate(-50%, 0)',
                  background: data.inputs[input] ? 'red' : 'black',
                }}
                id={input}
                type='target'
                position={Position.Left}
              />
            ))
          : null}
      </div>

      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        {inputsMap
          ? Object.values(inputsMap).map((input) => (
              <span
                key={Math.random()}
                style={{
                  padding: '10px 4px',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                }}
              >
                {input.data.name}
              </span>
            ))
          : null}
      </div>
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ padding: '0 10px' }}>{data.name}</span>
      </div>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        {outputsMap
          ? Object.values(outputsMap).map((ouput) => (
              <span
                key={Math.random()}
                style={{
                  padding: '10px 4px',
                  textAlign: 'right',
                  fontSize: '0.8rem',
                }}
              >
                {ouput.data.name}
              </span>
            ))
          : null}
      </div>
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
        {outputsMap
          ? Object.keys(outputsMap).map((output) => (
              <Handle
                key={`${id}-${output}`}
                style={{
                  position: 'unset',
                  transform: 'translate(50%, 0)',
                  background: data.outputs[output] ? 'red' : 'black',
                }}
                id={output}
                type='source'
                position={Position.Right}
              />
            ))
          : null}
      </div>
    </div>
  )
}
