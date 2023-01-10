import React, { Dispatch, SetStateAction } from 'react'
import { TBlocks, TProject } from '../types'
import { gates } from '../Nodes/logic'
import './Sidebar.css'

type TSidebarProps = {
  addBlock: () => void
  addProject: () => void
  blocks: TBlocks
  projects: TProject[]
  currentProject: string | null
  setCurrentProject: React.Dispatch<React.SetStateAction<string | null>>
  setProjects: Dispatch<SetStateAction<TProject[]>>
}

const Sidebar = ({
  addBlock,
  addProject,
  blocks,
  projects,
  setCurrentProject,
  setProjects,
}: TSidebarProps) => {
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

  const addProjectHandler = () => addProject()

  const changeProjectHandler = (projectName: string) => {
    setCurrentProject(projectName)
  }

  return (
    <div className='sidebar'>
      <div className='custom-blocks'>
        <div className='header'>
          <div className='title'>Components</div>
        </div>
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
        </div>
      </div>
      <div className='custom-blocks'>
        <div className='header'>
          <div className='title'>Custom blocks</div>
          <button onClick={addBlockHandler}>Add block</button>
        </div>
        <div className='sidebar-components-menu'>
          {blocks.map((block) => (
            <div
              style={{ padding: '2%' }}
              key={block.name}
              className='dndnode sidebar-component'
            >
              <div
                onDragStart={(event) => onDragStart(event, block.name, true)}
                draggable
                style={{
                  border: '2px solid black',
                  height: '50px',
                  borderRadius: '5px',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  background: 'white',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <div>{block.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='custom-blocks'>
        <div className='header'>
          <div className='title'>Projects</div>
          <button onClick={addProjectHandler}>Create new project</button>
        </div>
        <ul>
          {projects.map((project) => (
            <li onClick={() => changeProjectHandler(project.name)}>
              {project.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
