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
  ConnectionLineType,
  Edge,
  updateEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TConnected } from './hooks/useIncomersData'
import ClockNode from './Nodes/Clock'
import CustomNode from './Nodes/CustomNode'
import InputNode from './Nodes/Input'
import { gates, TComponents, TGates, TGatesNames } from './Nodes/logic'
import Sidebar from './Sidebar/Sidebar'

export type TNodeData = {
  inputs: {
    [key: string]: boolean
  }
  outputs: {
    [key: string]: boolean
  }
  onChange?: (
    currentNode: Node<TNodeData>,
    input: string,
    value: boolean
  ) => void | null
  connected: TConnected<TNodeData>
  setNextNodeInOwnData?: (
    currentNode: Node<TNodeData>,
    connected: TConnected
  ) => void
  logic: keyof TGates
  onDelete?: (nodeToDelete: Node) => void
}

const initialData: TNodeData = {
  inputs: {
    input1: false,
    input2: false,
  },
  outputs: { output1: false },
  logic: 'or',
  connected: { after: [], before: [] },
}

let id = 0
const getId = () => `dndnode_${id++}`

const initialNodes: Node<TNodeData>[] = []

const initialEdges: Edge[] = []
const nodeTypes = { custom: CustomNode, in: InputNode, clk: ClockNode }

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

      const newNode: Node<TNodeData> = {
        id: getId(),
        position,
        data: {
          ...initialData,
          setNextNodeInOwnData,
          onChange,
          onDelete,
        },
      }

      if (type === 'in') {
        newNode.type = 'in'
      } else if (type === 'clk') {
        newNode.type = 'clk'
      } else {
        newNode.type = 'custom'
        newNode.data.logic = type
        newNode.data.outputs = {
          output1:
            type === 'nor' || type === 'nand' || type === 'not' ? true : false,
        }
        if (type === 'not') {
          newNode.data.inputs = { input1: false }
        }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance]
  )

  const onConnect = (params: Connection) => {
    setEdges((eds) => {
      const edges = addEdge(params, eds)
      return edges.map((i) => {
        return { ...i, type: 'smoothstep' }
      })
    })
    const target = nodes.find((node) => node.id === params.target)
    const source = nodes.find((node) => node.id === params.source)
    if (!target || !source) return
    const targetHandle = params.targetHandle as 'input1' | 'input2'
    if (!params.sourceHandle) throw new Error('Source handle not found')
    onChange(target, targetHandle, source.data.outputs[params.sourceHandle])
  }

  const onChange = (
    currentNode: Node<TNodeData>,
    input: string,
    value: boolean
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentNode.id) {
          const inputs = { ...node.data.inputs }
          inputs[input] = value
          console.log(inputs)
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
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeToDelete.id))
    nodeToDelete.data.connected.after.forEach((after) => {
      console.log(nodeToDelete, after.edgeAfter.targetHandle as string, false)
      onChange(after.targetNode, after.edgeAfter.targetHandle as string, false)
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
            connected,
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
          data: { ...node.data, onChange, setNextNodeInOwnData, onDelete },
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
          connectionLineType={ConnectionLineType.SmoothStep}
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
