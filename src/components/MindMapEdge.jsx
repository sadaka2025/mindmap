// src/components/MindMapEdge.jsx
import React from "react";

export default function MindMapEdge({ from, to }) {
  // Ici on crée juste une ligne simple entre parent et enfant
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="gray"
        strokeWidth="2"
      />
    </svg>
  );
}
