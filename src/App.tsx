import React, {
  ChangeEvent,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  ReactFlowInstance,
  ConnectionLineType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomEdge from './Edges/CustomEdge'
import { TConnected } from './hooks/useIncomersData'
import { Block } from './Nodes/Block'
import ClockNode from './Nodes/Clock'
import CustomNode from './Nodes/CustomNode'
import Display from './Nodes/Display'
import InputNode from './Nodes/Input'
import { gates, TComponents, TGates } from './Nodes/logic'
import OutputNode from './Nodes/Output'
import Sidebar from './Sidebar/Sidebar'
import Topbar from './Topbar/Topbar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { TBlocks, TContext, TNodeData, TProject } from './types'
import { initialProjects } from './initialData'
import { TextNode } from './Nodes/TextNode'
import Description from './Description/Description'

export const context = createContext<TContext>({
  setNextNodeInOwnData: null,
  onChange: null,
  onDelete: null,
  updateBlockOutput: null,
  setName: null,
  onTextNodeChange: null,
})

const initialData: TNodeData = {
  inputs: {
    input1: false,
    input2: false,
  },
  outputs: { output1: false },
  logic: 'or',
  connected: { after: [], before: [] },
}

let id = +(localStorage.getItem('lgsId') || 40)
const getId = () => {
  id++
  localStorage.setItem('lgsId', '' + id)
  return `dndnode_${id}`
}

const nodeTypes = {
  custom: CustomNode,
  in: InputNode,
  out: OutputNode,
  clk: ClockNode,
  block: Block,
  display: Display,
  textNode: TextNode,
}

const edgeTypes = { custom: CustomEdge }

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<TNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [inputsCount, setInputsCount] = useState(0)
  const [outputsCount, setOutputsCount] = useState(0)
  const [blocks, setBlocks] = useLocalStorage<TBlocks>('lgsBlocks', [])
  const [projects, setProjects] = useLocalStorage<TProject[]>(
    'lgsProjects',
    initialProjects
  )
  const [currentProject, setCurrentProject] = useState<string | null>(
    projects[0].name
  )

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  const setName = (nodeId: string, name: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        return node.id === nodeId
          ? { ...node, data: { ...node.data, name } }
          : node
      })
    )
  }

  useEffect(() => {
    const current = projects.find((project) => project.name === currentProject)
    if (current?.autosave) {
      setProjects((projects) =>
        projects.map((project) =>
          project.name === currentProject
            ? { ...project, edges: edges, nodes: nodes }
            : project
        )
      )
    } else {
      console.log('notUpToDate')
      setProjects((projects) =>
        projects.map((project) =>
          project.name === currentProject
            ? { ...project, upToDate: false }
            : project
        )
      )
    }
  }, [JSON.stringify(nodes), JSON.stringify(edges)])

  const onTextNodeChange = (nodeId: string, text: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, text } } : node
      )
    )
  }

  const updateBlockOutput = (
    blockId: string,
    output: string,
    value: boolean
  ) => {
    const updatedOputputs: { [key: string]: boolean } = {}
    updatedOputputs[output] = value
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === blockId
          ? {
              ...node,
              data: {
                ...node.data,
                outputs: { ...node.data.outputs, ...updatedOputputs },
              },
            }
          : node
      )
    )
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (
      !reactFlowWrapper.current ||
      !reactFlowInstance ||
      !reactFlowInstance.project
    )
      return

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
    const type = event.dataTransfer.getData(
      'application/reactflow'
    ) as TComponents

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })

    //check if block
    if (type.slice(0, 5) === 'bl0ck') {
      const name = type.slice(5)

      const block = blocks.find((block) => block.name === name)
      if (!block) throw new Error('block not found')

      const inputNodes = block.nodes.filter(
        (node) => node.data.logic === 'blockInput'
      )
      const outputNodes = block.nodes.filter(
        (node) => node.data.logic === 'blockOutput'
      )

      const newNode: Node<TNodeData> = {
        id: `dndnode_${getId()}`,
        position,
        selectable: false,
        type: 'block',
        data: {
          ...initialData,
          name,
        },
      }

      let inputCount = -1
      const inputsMap: { [key: string]: Node<TNodeData> } = {}
      for (let inputNode of inputNodes) {
        if (!inputNode.parentNode) {
          inputCount++
          inputsMap['input' + inputCount] = {
            ...inputNode,
            id: newNode.id + '_' + inputNode.id,
          }
        }
      }

      let outputsCount = -1
      const outputsMap: { [key: string]: Node<TNodeData> } = {}
      for (let outputNode of outputNodes) {
        if (!outputNode.parentNode) {
          outputsCount++
          outputsMap['output' + outputsCount] = {
            ...outputNode,
            id: newNode.id + '_' + outputNode.id,
          }
        }
      }

      newNode.data.inputsMap = inputsMap
      newNode.data.outputsMap = outputsMap

      const dataInputs: { [key: string]: boolean } = {}

      for (let input of Object.keys(inputsMap)) {
        dataInputs[input] = false
      }

      newNode.data.inputs = dataInputs

      const dataOutputs: { [key: string]: boolean } = {}

      for (let output of Object.keys(outputsMap)) {
        dataOutputs[output] = false
      }

      newNode.data.outputs = dataOutputs

      for (let node of block.nodes) {
        setNodes((nodes) => [
          ...nodes,
          {
            ...node,
            position: { x: 0, y: 0 },
            id: newNode.id + '_' + node.id,
            parentNode: newNode.id,
          },
        ])
      }

      for (let edge of block.edges) {
        setEdges((edges) => [
          ...edges,
          {
            ...edge,
            source: newNode.id + '_' + edge.source,
            target: newNode.id + '_' + edge.target,
          },
        ])
      }

      setNodes((nds) => nds.concat(newNode))
    } else {
      const newNode: Node<TNodeData> = {
        id: `dndnode_${getId()}`,
        position,
        selectable: false,
        data: {
          ...initialData,
        },
      }

      if (type === 'in') {
        newNode.type = 'in'
      } else if (type === 'clk') {
        newNode.type = 'clk'
      } else if (type === 'textNode') {
        newNode.type = 'textNode'
      } else if (type === 'out') {
        newNode.type = 'out'
        newNode.data.inputs = { input1: false }
        newNode.data.outputs = {}
      } else if (type === 'display') {
        newNode.type = 'display'
        newNode.data.inputs = {
          input1: false,
          input2: false,
          input3: false,
          input4: false,
          input5: false,
          input6: false,
          input7: false,
        }
        newNode.data.outputs = {}
      } else if (type === 'blockInput') {
        newNode.type = 'custom'
        newNode.data.logic = 'blockInput'
        newNode.data.name = 'Input ' + inputsCount
        setInputsCount((state) => state + 1)
      } else if (type === 'blockOutput') {
        newNode.type = 'custom'
        newNode.data.logic = 'blockOutput'
        newNode.data.name = 'Output ' + outputsCount
        setOutputsCount((state) => state + 1)
      } else {
        newNode.type = 'custom'
        newNode.data.logic = type
        newNode.data.inputs = gates[type].inputs
        newNode.data.outputs = gates[type].outputs
      }
      setNodes((nds) => nds.concat(newNode))
    }
  }

  const autosaveChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setProjects((projects) =>
      projects.map((project) =>
        project.name === currentProject
          ? {
              ...project,
              nodes: e.target.checked ? nodes : project.nodes,
              edges: e.target.checked ? edges : project.edges,
              upToDate: e.target.checked ? true : project.upToDate,
              autosave: e.target.checked,
            }
          : project
      )
    )
  }

  const onConnect = (params: Connection) => {
    setEdges((eds) => {
      const edges = addEdge(params, eds)
      return edges.map((i) => {
        return { ...i, type: 'custom' }
      })
    })
    const target = nodes.find((node) => node.id === params.target)
    const source = nodes.find((node) => node.id === params.source)
    if (!target || !source) return
    const targetHandle = params.targetHandle as 'input1' | 'input2'
    if (!params.sourceHandle) throw new Error('Source handle not found')
    onChange(target, targetHandle, source.data.outputs[params.sourceHandle])
  }

  const forwardSignal = (node: Node<TNodeData>, value: boolean) => {
    onChange(node, 'input1', value)
  }

  const onChange = (
    currentNode: Node<TNodeData>,
    input: string,
    value: boolean
  ) => {
    if (currentNode.type === 'block') {
      if (!currentNode.data.inputsMap || !currentNode.data.inputsMap[input])
        throw new Error('Input not found')
      const blockInputs = { ...currentNode.data.inputs }
      blockInputs[input] = value
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === currentNode.id
            ? { ...node, data: { ...node.data, inputs: blockInputs } }
            : node
        )
      )
      forwardSignal(currentNode.data.inputsMap[input], value)
      return
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentNode.id) {
          const inputs = { ...node.data.inputs }
          inputs[input] = value
          const outputs = gates[node.data.logic].fn(
            Object.values(inputs)[0],
            Object.values(inputs)[1]
          )
          return {
            ...node,
            data: {
              ...node.data,
              inputs,
              outputs,
            },
          }
        }
        return node
      })
    )
  }

  const onDelete = (nodeToDelete: Node<TNodeData>) => {
    const connectedNodesAfter = nodeToDelete.data.connected.after
    const connectedNodesBefore = nodeToDelete.data.connected.before
    const connectedEgdesIdBefore = nodeToDelete.data.connected.before.map(
      (before) => before.edgeBefore.id
    )
    const connectedEgdesIdAfter = nodeToDelete.data.connected.after.map(
      (after) => after.edgeAfter.id
    )
    const edgesIdToDelete = connectedEgdesIdAfter.concat(connectedEgdesIdBefore)

    setEdges((edges) =>
      edges.filter((edge) => !edgesIdToDelete.includes(edge.id))
    )

    setNodes((nodes) => nodes.filter((node) => node.id !== nodeToDelete.id))

    nodeToDelete.data.connected.after.forEach((after) => {
      if (!after.edgeAfter.targetHandle)
        throw new Error('TargetHandle is undefined or null')
      onChange(after.targetNode, after.edgeAfter.targetHandle, false)
    })
    connectedNodesBefore.forEach((before) =>
      setNextNodeInOwnData(before.sourceNode, before.sourceNode.data.connected)
    )
    connectedNodesAfter.forEach((after) =>
      setNextNodeInOwnData(after.targetNode, after.targetNode.data.connected)
    )
  }

  const setNextNodeInOwnData = (
    currentNode: Node<TNodeData>,
    connected: TConnected<TNodeData>
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== currentNode.id) return node
        return {
          ...node,
          data: {
            ...node.data,
            connected: {
              after: connected.after.map((after) => {
                return {
                  ...after,
                  targetNode: {
                    ...after.targetNode,
                    data: {
                      ...after.targetNode.data,
                      connected: { after: [], before: [] },
                    },
                  },
                }
              }),
              before: connected.before.map((before) => {
                return {
                  ...before,
                  sourceNode: {
                    ...before.sourceNode,
                    data: {
                      ...before.sourceNode.data,
                      connected: { after: [], before: [] },
                    },
                  },
                }
              }),
            },
          },
        }
      })
    )
  }

  function hasDuplicates<T = any>(array: T[]) {
    return new Set(array).size !== array.length
  }

  const addBlock = () => {
    const ins = nodes.filter((node) => node.data.logic === 'blockInput')
    const outs = nodes.filter((node) => node.data.logic === 'blockOutput')

    if (!ins.length || !outs.length) {
      alert(
        'A block has to have at least one block input and one block output.'
      )
      return
    }

    if (
      hasDuplicates(ins.map((input) => input.data.name)) ||
      hasDuplicates(outs.map((output) => output.data.name))
    ) {
      alert('Every input and output has to have distinct name.')
      return
    }
    let name = ''

    while (
      hasDuplicates([...blocks.map((block) => block.name), name]) ||
      name === ''
    ) {
      name =
        prompt(
          "Enter block's name. Block name has to be uqniqe and has at least one character"
        ) || 'New block'
    }

    setBlocks((blocks) => {
      return [...blocks, { name, edges, nodes }]
    })
    setEdges(() => [])
    setNodes(() => [])
  }

  const addProject = () => {
    const name = prompt('Enter project name')
    if (name === null) return
    if (projects.map((project) => project.name).includes(name)) {
      alert('Name has to be unique')
      return
    }
    setProjects((projects) => {
      return [
        ...projects,
        { name, nodes: [], edges: [], autosave: true, upToDate: true },
      ]
    })
    setCurrentProject(name)
  }

  const saveProject = () => {
    setProjects((projects) =>
      projects.map((project) =>
        project.name === currentProject
          ? { ...project, nodes: nodes, edges: edges, upToDate: true }
          : project
      )
    )
  }

  useEffect(() => {
    const project = projects.find((project) => project.name === currentProject)
    if (!project) {
      console.log('Project not found')
      return
    }
    setNodes(project.nodes)
    setEdges(project.edges)
  }, [currentProject])

  const current = projects.find((project) => project.name === currentProject)
  console.log(current)

  return (
    <context.Provider
      value={{
        setNextNodeInOwnData,
        onChange,
        onDelete,
        updateBlockOutput,
        setName,
        onTextNodeChange,
      }}
    >
      <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <Sidebar
          addBlock={addBlock}
          addProject={addProject}
          projects={projects}
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          blocks={blocks}
          setProjects={setProjects}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Topbar
            saveProject={saveProject}
            projects={projects}
            setProjects={setProjects}
            setCurrentProject={setCurrentProject}
            currentProject={currentProject}
            autosaveChangeHandler={autosaveChangeHandler}
          />
          <div
            className='reactflow-wrapper'
            style={{ width: '100%', height: '100%' }}
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineType={ConnectionLineType.SimpleBezier}
              onInit={setReactFlowInstance}
            >
              <Controls />
            </ReactFlow>
            {current?.description ? (
              <Description
                name={currentProject || ''}
                description={current.description}
              />
            ) : null}
          </div>
        </div>
      </div>
    </context.Provider>
  )
}

export default App
