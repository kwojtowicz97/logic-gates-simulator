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
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomEdge from './Edges/CustomEdge'
import { TConnected } from './hooks/useIncomersData'
import { Block } from './Nodes/Block'
import ClockNode from './Nodes/Clock'
import CustomNode from './Nodes/CustomNode'
import Display from './Nodes/Display'
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
  inputsMap?: { [key: string]: Node<TNodeData> }
  outputsMap?: { [key: string]: Node<TNodeData> }
  name?: string
  setName?: (nodeId: string, name: string) => void
  updateBlockOutput?: (blockId: string, output: string, value: boolean) => void
}

export type TBlocks = {
  name: string
  nodes: Node<TNodeData>[]
  edges: Edge[]
}[]

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
const nodeTypes = {
  custom: CustomNode,
  in: InputNode,
  clk: ClockNode,
  block: Block,
  display: Display,
}

const edgeTypes = { custom: CustomEdge }

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<TNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [inputsCount, setInputsCount] = useState(0)
  const [outputsCount, setOutputsCount] = useState(0)

  const [blocks, setBlocks] = useState<TBlocks>([])

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
          id: getId(),
          position,
          type: 'block',
          data: {
            ...initialData,
            setNextNodeInOwnData,
            onChange,
            onDelete,
            updateBlockOutput,
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
          id: getId(),
          position,
          data: {
            ...initialData,
            setNextNodeInOwnData,
            onChange,
            onDelete,
            setName,
          },
        }

        if (type === 'in') {
          newNode.type = 'in'
        } else if (type === 'clk') {
          newNode.type = 'clk'
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
    },
    [reactFlowInstance, blocks, inputsCount, outputsCount]
  )

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
    setEdges([])
    setNodes([])
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <Sidebar addBlock={addBlock} blocks={blocks} />
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
          snapToGrid
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App
