import React, { useEffect } from 'react'
import { NodeProps, Handle, Position, useNodes } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

export const Block = ({ data }: NodeProps<TNodeData>) => {
  const { id, node } = useNode<TNodeData>()
  const { connected, connectedEdges } = useNeighbours()

  const { inputsMap, outputsMap } = data

  const nodes = useNodes<TNodeData>()

  let blockOutputsIds: string[] = []
  if (outputsMap) {
    blockOutputsIds = Object.values(outputsMap).map((output) => output.id)
  }

  useEffect(() => {
    data.setNextNodeInOwnData!(node, connected)
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
      if (!sourceNode) throw new Error('source node not found')
      const value = sourceNode.data.outputs['output1']
      console.log('start')
      data.onChange!(outputNode, targetHandle, value)
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
        {inputsMap
          ? Object.keys(inputsMap).map((input) => (
              <Handle
                key={`${id}-${input}`}
                style={{ position: 'unset', transform: 'translate(50%, 0)' }}
                id={input}
                type='target'
                position={Position.Left}
              />
            ))
          : null}
      </div>
      Custom block
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
                style={{ position: 'unset', transform: 'translate(50%, 0)' }}
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
