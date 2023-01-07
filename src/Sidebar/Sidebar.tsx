import React from 'react'
import { TBlocks } from '../App'

type TSidebarProps = {
  addBlock: () => void
  blocks: TBlocks
}

const Sidebar = ({ addBlock, blocks }: TSidebarProps) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    block?: boolean
  ) => {
    if (!event.dataTransfer) return
    event.dataTransfer.setData(
      'application/reactflow',
      block ? 'bl0ck' + nodeType : nodeType
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const addBlockHandler = () => addBlock()

  return (
    <div style={{ width: '20%', borderRight: '1px solid black' }}>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'in')}
        draggable
      >
        INPUT
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'or')}
        draggable
      >
        OR
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'and')}
        draggable
      >
        AND
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'xor')}
        draggable
      >
        XOR
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'nand')}
        draggable
      >
        NAND
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'nor')}
        draggable
      >
        NOR
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'xnor')}
        draggable
      >
        XNOR
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'not')}
        draggable
      >
        NOT
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'clk')}
        draggable
      >
        CLOCK
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'blockInput')}
        draggable
      >
        Block Input
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'blockOutput')}
        draggable
      >
        Block Output
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'display')}
        draggable
      >
        Display
      </div>
      <button onClick={addBlockHandler}>Add block</button>
      {blocks.map((block) => (
        <div
          key={block.name}
          className='dndnode'
          onDragStart={(event) => onDragStart(event, block.name, true)}
          draggable
        >
          {block.name}
        </div>
      ))}
    </div>
  )
}

export default Sidebar
