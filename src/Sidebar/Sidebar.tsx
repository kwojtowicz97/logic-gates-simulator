import React from 'react'

const Sidebar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    if (!event.dataTransfer) return
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
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
    </div>
  )
}

export default Sidebar
