import React from 'react'
import { TBlocks } from '../App'
import { gates } from '../Nodes/logic'
import './Sidebar.css'

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
    <div className='sidebar-components-menu'>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'in')}
        draggable
      >
        <div className='circle'>
          <div style={{ translate: 'translateX(-45%)' }}>In</div>
        </div>
        <div style={{ marginTop: '4px' }}>INPUT</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'out')}
        draggable
      >
        <div className='circle'>
          <div>Out</div>
        </div>
        <div style={{ marginTop: '4px' }}>INPUT</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'or')}
        draggable
      >
        <img alt='and gate' src={gates.or.image} />
        <div>OR</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'and')}
        draggable
      >
        <img alt='and gate' src={gates.and.image} />
        <div>AND</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'xor')}
        draggable
      >
        <img alt='xor gate' src={gates.xor.image} />
        <div>XOR</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'nand')}
        draggable
      >
        <img alt='nand gate' src={gates.nand.image} />
        <div>NAND</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'nor')}
        draggable
      >
        <img alt='nor gate' src={gates.nor.image} />
        <div>NOR</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'xnor')}
        draggable
      >
        <img alt='xnor gate' src={gates.xnor.image} />
        <div>XNOR</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'not')}
        draggable
      >
        <img alt='not gate' src={gates.not.image} />
        <div>NOT</div>
      </div>

      <div
        className='sidebar-component'
        style={{ paddingTop: '5%' }}
        onDragStart={(event) => onDragStart(event, 'display')}
        draggable
      >
        <img
          style={{ height: '50px', width: 'auto' }}
          alt='display'
          src='./assets/display.png'
        />
        <div>DISPLAY</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'blockInput')}
        draggable
      >
        <img
          style={{ height: '35px', width: 'auto' }}
          alt='display'
          src='./assets/block_input.png'
        />
        <div style={{ maxWidth: '70%', margin: 'auto' }}>BLOCK INPUT</div>
      </div>
      <div
        className='sidebar-component'
        onDragStart={(event) => onDragStart(event, 'blockOutput')}
        draggable
      >
        <img
          style={{ height: '35px', width: 'auto' }}
          alt='display'
          src='./assets/block_output.png'
        />
        <div style={{ maxWidth: '70%', margin: 'auto' }}>BLOCK OUTPUT</div>
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
