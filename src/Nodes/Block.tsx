import React from 'react'
import { NodeProps } from 'reactflow'
import { TNodeData } from '../App'

export const Block = ({ data }: NodeProps<TNodeData>) => {
  return <div>Custom block</div>
}
