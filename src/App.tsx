import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  ReactFlowInstance,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomNode from './Nodes/CustomNode'
import { gates, TGates } from './Nodes/logic'
import Sidebar from './Sidebar/Sidebar'

export type TNodeData = {
  input1: boolean
  input2: boolean
  output: boolean
  onChange?: (
    currentNode: Node<TNodeData>,
    input: 'input1' | 'input2',
    value: boolean
  ) => void | null
  outputNodes: Node<TNodeData>[]
  outputEdges: Edge[]
  setNextNodeInOwnData?: (
    currentNode: Node<TNodeData>,
    nextNodes: Node<TNodeData>[],
    connectedEdges: Edge[]
  ) => void
  logic: keyof TGates
}

const initialData: TNodeData = {
  input1: false,
  input2: false,
  output: false,
  logic: 'or',
  outputEdges: [],
  outputNodes: [],
}

let id = 0
const getId = () => `dndnode_${id++}`

const initialNodes: Node<TNodeData>[] = [
  {
    id: getId(),
    position: { x: 0, y: 100 },
    data: initialData,
    type: 'custom',
  },
  {
    id: getId(),
    position: { x: 200, y: 100 },
    data: initialData,
    type: 'custom',
  },
  {
    id: getId(),
    position: { x: 400, y: 100 },
    data: { ...initialData, logic: 'and' },
    type: 'custom',
  },
]

const initialEdges: Edge[] = [
  // { id: 'e1-2', source: '1', target: '2', targetHandle: 'input2' },
]
const nodeTypes = { custom: CustomNode }

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<TNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (
        !reactFlowWrapper.current ||
        !reactFlowInstance ||
        !reactFlowInstance.project
      )
        return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow') as
        | 'or'
        | 'and'
        | 'xor'
        | 'nand'
        | 'nor'
        | 'xnor'

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      const newNode: Node<TNodeData> = {
        id: getId(),
        type: 'custom',
        position,
        data: {
          ...initialData,
          logic: type,
          setNextNodeInOwnData,
          onChange,
          output: type === 'nor' ? true : false,
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance]
  )

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
    const target = nodes.find((node) => node.id === params.target)
    const source = nodes.find((node) => node.id === params.source)
    if (!target || !source) return
    const targetHandle = params.targetHandle as 'input1' | 'input2'
    onChange(target, targetHandle, source.data.output)
  }

  const onChange = (
    currentNode: Node<TNodeData>,
    input: 'input1' | 'input2',
    value: boolean
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        const output =
          input === 'input1'
            ? gates[node.data.logic].fn(value, node.data.input2)
            : gates[node.data.logic].fn(node.data.input1, value)
        if (node.id === currentNode.id) {
          return {
            ...node,
            data:
              input === 'input1'
                ? {
                    ...node.data,
                    output,
                    input1: value,
                  }
                : {
                    ...node.data,
                    output,
                    input2: value,
                  },
          }
        }
        return node
      })
    )
  }

  const setNextNodeInOwnData = (
    currentNode: Node<TNodeData>,
    nextNodes: Node<TNodeData>[],
    connectedEdges: Edge[]
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== currentNode.id) return node
        return {
          ...node,
          data: {
            ...node.data,
            outputNodes: nextNodes,
            outputEdges: connectedEdges,
          },
        }
      })
    )
  }
  useEffect(() => {
    setNodes(
      initialNodes.map((node) => {
        return {
          ...node,
          data: { ...node.data, onChange, setNextNodeInOwnData },
        }
      })
    )

    setEdges(initialEdges)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <Sidebar />
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
          onInit={setReactFlowInstance}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App
