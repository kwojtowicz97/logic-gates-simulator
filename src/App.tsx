import { useCallback, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  ConnectionLineType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomNode from './Nodes/CustomNode'

export type TNodeData = {
  input1: boolean
  input2: boolean
  output: boolean
  onChange?: (
    currentNode: Node<TNodeData>,
    input: 'input1' | 'input2',
    value: boolean
  ) => void | null
  outputNode?: Node<TNodeData>
  outputEdge?: Edge
  setNextNodeInOwnData?: (
    currentNode: Node<TNodeData>,
    nextNodes: Node<TNodeData>[],
    connectedEdge: Edge
  ) => void
}

const initialData: TNodeData = { input1: false, input2: false, output: false }

const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 100 },
    data: initialData,
    type: 'custom',
  },
  {
    id: '2',
    position: { x: 200, y: 100 },
    data: initialData,
    type: 'custom',
  },
  {
    id: '3',
    position: { x: 400, y: 100 },
    data: initialData,
    type: 'custom',
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', targetHandle: 'input2' },
]
const nodeTypes = { custom: CustomNode }

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<TNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

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
    console.log(currentNode, input, value)
    setNodes((nds) =>
      nds.map((node) => {
        const output =
          input === 'input1'
            ? value || node.data.input2
            : node.data.input1 || value
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

  useEffect(() => {
    const setNextNodeInOwnData = (
      currentNode: Node<TNodeData>,
      nextNodes: Node<TNodeData>[],
      connectedEdge: Edge
    ) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== currentNode.id) return node
          return {
            ...node,
            data: {
              ...node.data,
              outputNode: nextNodes[0],
              outputEdge: connectedEdge,
            },
          }
        })
      )
    }

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
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}

export default App
