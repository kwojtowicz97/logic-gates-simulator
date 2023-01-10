import React from 'react'
import { getBezierPath, EdgeProps, useNodes } from 'reactflow'
import { TNodeData } from '../types'

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  source,
  sourceHandleId,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const nodes = useNodes<TNodeData>()

  const sourceNode = nodes.find((node) => node.id === source)

  if (!sourceNode || !sourceHandleId)
    throw new Error('source node or source handle not found')
  const sourceHandleValue = sourceNode?.data.outputs[sourceHandleId]

  return (
    <>
      <path
        id={id}
        style={{
          stroke: sourceHandleValue ? 'red' : 'black',
          strokeWidth: '2px',
        }}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* <text>
        <textPath href={`#${id}`} style={{ fontSize: 12 }} startOffset='50%'>
          X
        </textPath>
      </text> */}
    </>
  )
}

export default CustomEdge
