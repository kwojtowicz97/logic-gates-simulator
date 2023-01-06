import React, { useEffect } from 'react'
import { NodeProps, Handle, Position, Node } from 'reactflow'
import { TNodeData } from '../App'
import useNeighbours from '../hooks/useIncomersData'
import useNode from '../hooks/useNode'

export const Block = ({ data }: NodeProps<TNodeData>) => {
  const { id } = useNode()
  const { inputsMap, outputsMap } = data
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
