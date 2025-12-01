import React, { useState, useMemo } from "react";
import MindMapLayout from "./MindMapLayout";
import MindMapEdge from "./MindMapEdge";
import MindMapNode from "./MindMapNode";

export default function MindMapCanvas({ data, theme }) {
  const [collapsedMap, setCollapsedMap] = useState(new Set());

  const layout = MindMapLayout({ data, collapsedMap });
  const nodesById = useMemo(() => {
    const map = new Map();
    layout.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [layout.nodes]);

  const onToggle = (id) => {
    setCollapsedMap((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // assign a color index per top-level branch (R0,R1,... or L0,L1,...)
  const branchIndexMap = useMemo(() => {
    const map = new Map();
    layout.nodes.forEach((n) => {
      // id format: e.g. root_R0_1_0 or root_L1_0
      const parts = n.id.split("_");
      const top = parts[1] || "";
      if (!map.has(top)) map.set(top, map.size);
    });
    return map;
  }, [layout.nodes]);

  const edgesToRender = layout.edges
    .map((e) => {
      const from = nodesById.get(e.fromId);
      const to = nodesById.get(e.toId);
      if (!from || !to) return null;
      return { from, to };
    })
    .filter(Boolean);

  return (
    <div className="w-full overflow-auto">
      <div
        className="relative bg-white rounded-lg p-6 shadow-sm"
        style={{ minHeight: 420, minWidth: 900 }}
      >
        <svg
          width={layout.width}
          height={layout.height}
          style={{ position: "relative", zIndex: 0 }}
        >
          {edgesToRender.map((edge, i) => (
            <MindMapEdge
              key={i}
              from={edge.from}
              to={edge.to}
              themePalette={theme.palette}
            />
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: layout.width,
            height: layout.height,
            zIndex: 2,
          }}
        >
          {layout.nodes.map((n) => {
            const topKey = n.id.split("_")[1] || "root";
            const colorIdx = branchIndexMap.get(topKey) || 0;
            return (
              <MindMapNode
                key={n.id}
                node={n}
                onToggle={onToggle}
                isCollapsed={collapsedMap.has(n.id)}
                theme={theme}
                colorIdx={colorIdx}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
