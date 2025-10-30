import React, { useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { jsonToFlowNodes } from "../utils/jsonToFlowNode";
import "../assets/css/tooltip.css"; // we'll add this next

// Custom Node with tooltip
function TooltipNode({ data }) {
  return (
    <div className="tooltip-node" style={data.baseStyle}>
      {data.label}
      {data.hiddenValue !== undefined && (
        <span className="tooltip-text">
          {typeof data.hiddenValue === "object"
            ? JSON.stringify(data.hiddenValue)
            : String(data.hiddenValue)}
        </span>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { tooltipNode: TooltipNode };

function TreeVisualizer({ jsonData, searchQuery, setMatchStatus }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!jsonData) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: generatedNodes, edges: generatedEdges } =
      jsonToFlowNodes(jsonData);

    // Ensure all nodes use our custom node type
    setNodes(generatedNodes.map((n) => ({ ...n, type: "tooltipNode" })));
    setEdges(generatedEdges);
  }, [jsonData, setEdges, setNodes]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    let matchCount = 0;
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const baseStyle = node.data.baseStyle;
        const matchesQuery =
          query.length > 0 &&
          (node.data.path.toLowerCase().includes(query) ||
            node.data.label.toLowerCase().includes(query));
        if (matchesQuery) matchCount++;
        return {
          ...node,
          style: {
            ...baseStyle,
            border: matchesQuery ? "2px solid #2563eb" : baseStyle.border,
            boxShadow: matchesQuery
              ? "0 0 0 4px rgba(37, 99, 235, 0.15), 0 18px 46px -26px rgba(15, 23, 42, 0.45)"
              : baseStyle.boxShadow,
          },
        };
      })
    );
    if (setMatchStatus) {
      if (!query) setMatchStatus("");
      else setMatchStatus(matchCount > 0 ? "Match found" : "No match found");
    }
  }, [searchQuery, setNodes, setMatchStatus]);

  if (!jsonData) {
    return (
      <div className="tree-visualizer empty-state">
        Paste JSON on the left to generate the tree.
      </div>
    );
  }

  return (
    <div className="tree-visualizer">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        panOnScroll
        fitView
        fitViewOptions={{ padding: 0.35 }}
      >
        <Controls position="top-left" showInteractive={false} />
        <Background gap={28} size={1} color="#e2e8f0" />
      </ReactFlow>
    </div>
  );
}

export default TreeVisualizer;
