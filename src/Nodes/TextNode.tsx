import { NodeProps } from 'reactflow'
import { TNodeData } from '../types'
import useNode from '../hooks/useNode'
import React, { useContext } from 'react'
import { context } from '../App'

export const TextNode = ({ data }: NodeProps<TNodeData>) => {
  const { node, id } = useNode<TNodeData>()
  const { onTextNodeChange } = useContext(context)
  const isChild = !!node.parentNode

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextNodeChange!(id, e.target.value)
  }

  return (
    <div
      style={{
        border: '2px solid black',
        borderRadius: '5px',
        position: 'relative',
        display: isChild ? 'node' : 'flex',
        background: 'white',
        alignItems: 'center',
        zIndex: '100',
      }}
    >
      <textarea
        onChange={onChange}
        value={data.text}
        style={{ width: '500px', height: '200px', resize: 'none' }}
      ></textarea>
    </div>
  )
}
