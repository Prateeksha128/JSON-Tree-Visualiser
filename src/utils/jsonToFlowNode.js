import dagre from "dagre";

// color & style presets
const STYLE_PRESETS = {
  object: { fill: "#eef2ff", border: "#4338ca", text: "#1e1b4b" },
  array: { fill: "#ecfdf3", border: "#16a34a", text: "#065f46" },
  key: { fill: "#e0f2fe", border: "#0ea5e9", text: "#0c4a6e" },
  value: { fill: "#fef3c7", border: "#f59e0b", text: "#7c2d12" },
};

let idCounter = 0;

// Basic label formatter
const formatPrimitive = (value) =>
  value === null ? "null" : typeof value === "string" ? `"${value}"` : String(value);

// Core node style generator
const createBaseStyle = (preset, labelLength, width = 140, height = 52) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 14,
  fontSize: 12.5,
  fontWeight: 600,
  padding: "10px 14px",
  background: preset.fill,
  border: `2px solid ${preset.border}`,
  color: preset.text,
  minWidth: Math.max(width, labelLength * 8 + 40),
  height,
  whiteSpace: "nowrap",
  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.2)",
});

export const jsonToFlowNodes = (data) => {
  idCounter = 0;
  const nodes = [];
  const edges = [];

  // helper to add node
  const addNode = ({ label, path, variant, hiddenValue }) => {
    const preset = STYLE_PRESETS[variant] || STYLE_PRESETS.key;
    const baseStyle = createBaseStyle(preset, label.length);
    const nodeId = `${++idCounter}`;

    nodes.push({
      id: nodeId,
      data: {
        label,
        path,
        hiddenValue, // for tooltip use later
        baseStyle,
      },
      position: { x: 0, y: 0 },
      style: baseStyle,
    });

    return nodeId;
  };

  // helper to connect
  const addEdge = (source, target) => {
    edges.push({ id: `e${source}-${target}`, source, target });
  };

  // recursive builder
  const traverse = (obj, parentId, path) => {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const indexPath = `${path}[${index}]`;
        const indexId = addNode({
          label: `[${index}]`,
          path: indexPath,
          variant: "array",
          hiddenValue:
            typeof item !== "object" || item === null
              ? formatPrimitive(item)
              : undefined,
        });
        addEdge(parentId, indexId);
        if (typeof item === "object" && item !== null) {
          traverse(item, indexId, indexPath);
        }
      });
      return;
    }

    if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, val]) => {
        const childPath = `${path}.${key}`;
        const childId = addNode({
          label: key,
          path: childPath,
          variant: typeof val === "object" && val !== null ? "object" : "key",
          hiddenValue:
            typeof val !== "object" || val === null ? formatPrimitive(val) : undefined,
        });
        addEdge(parentId, childId);
        if (typeof val === "object" && val !== null) {
          traverse(val, childId, childPath);
        }
      });
      return;
    }

    // Primitive at root: do nothing here; we won't create a separate value node
    return;
  };

  // root setup
  const isRootObject = typeof data === "object" && data !== null;
  const rootId = addNode({
    label: "root",
    path: "$",
    variant: Array.isArray(data) ? "array" : isRootObject ? "object" : "key",
    hiddenValue: !isRootObject && !Array.isArray(data) ? formatPrimitive(data) : undefined,
  });

  if (isRootObject || Array.isArray(data)) {
    traverse(data, rootId, "$");
  }

  // dagre layout
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => g.setNode(n.id, { width: 160, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x, y: pos.y };
  });

  return { nodes, edges };
};
