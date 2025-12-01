import React from "react";
import { Handle, Position } from "reactflow";

export default function NodeCard({ data }) {
  const label = data.label || data.title || data.desc || "بدون عنوان";

  // Style principal du bouton NodeCard
  const nodeStyle = {
    backgroundColor: "#0ea5e9", // Couleur du bouton
    color: "yellow", // Couleur du texte
    fontFamily: "'arabic typesetting', 'Segoe UI', Tahoma, sans-serif",
    fontSize: 30, // Taille du texte
    fontWeight: 700,
    padding: "20px 20px", // Ajuste hauteur/largeur du bouton
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.2s ease",
    minWidth: 200, // largeur minimale
    minHeight: 60, // hauteur minimale
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div
      className="node-card"
      onClick={data.onClick}
      role="button"
      tabIndex={0}
      style={nodeStyle}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0ea5e9")}
    >
      <div style={{ marginBottom: 6 }}>{label}</div>
      {data.desc && (
        <div style={{ fontSize: 18, color: "#e0f2fe", textAlign: "center" }}>
          {data.desc}
        </div>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
