// src/components/MindMapNode.jsx
import React from "react";
import MindMapEdge from "./MindMapEdge";

export default function MindMapNode({ node, parentPos }) {
  const [x, y] = [0, 0]; // positions relatives (simplifiées pour démo)

  return (
    <div className="relative ml-4 mt-4">
      {parentPos && <MindMapEdge from={parentPos} to={{ x, y }} />}
      <div className="p-2 border rounded hover:bg-blue-100 cursor-pointer inline-block">
        {node.TEXT}
      </div>
      <div className="ml-6 mt-2">
        {node.children &&
          node.children.map((child, idx) => (
            <MindMapNode key={idx} node={child} parentPos={{ x, y }} />
          ))}
      </div>
    </div>
  );
}
