import { useMemo } from "react";

function makeId(path) {
  return path.join("_");
}

export default function MindMapLayout({
  data,
  collapsedMap = new Set(),
  H_SPACING = 220,
  V_SPACING = 84,
}) {
  return useMemo(() => {
    const nodesOut = [];
    const edgesOut = [];
    const rootId = makeId(["root"]);
    const rootText = data?.TEXT || data?.text || "root";

    const topChildren = data.children || [];
    const mid = Math.ceil(topChildren.length / 2);
    const leftChildren = topChildren.slice(0, mid);
    const rightChildren = topChildren.slice(mid);

    function collect(sideChildren, sideSign) {
      const list = [];
      function dfs(node, path, depth) {
        const id = makeId(path);
        const collapsed = collapsedMap.has(id);
        list.push({ id, node, depth, path, collapsed });
        if (!collapsed && node.children && node.children.length) {
          node.children.forEach((ch, i) => {
            const childPath = path.concat(i);
            edgesOut.push({ fromId: id, toId: makeId(childPath) });
            dfs(ch, childPath, depth + 1);
          });
        }
      }
      sideChildren.forEach((child, i) => {
        const idPath = ["root", sideSign === 1 ? "R" + i : "L" + i];
        edgesOut.push({ fromId: rootId, toId: makeId(idPath) });
        dfs(child, idPath, 1);
      });
      return list;
    }

    const leftList = collect(leftChildren, -1);
    const rightList = collect(rightChildren, 1);

    const padding = 40;
    const nodesSeq = [];

    // place left nodes top-to-bottom
    leftList.forEach((item, idx) => {
      nodesSeq.push({
        ...item,
        x: -item.depth * H_SPACING,
        y: padding + idx * V_SPACING,
      });
    });

    // place root roughly between left and right blocks
    const rootY = padding + leftList.length * V_SPACING * 0.5 + V_SPACING * 0.5;
    nodesSeq.push({
      id: rootId,
      node: { TEXT: rootText },
      depth: 0,
      x: 0,
      y: rootY,
      path: ["root"],
    });

    // place right nodes
    rightList.forEach((item, idx) => {
      nodesSeq.push({
        ...item,
        x: item.depth * H_SPACING,
        y: padding + idx * V_SPACING,
      });
    });

    // bounding box & offset to positive coords
    const xs = nodesSeq.map((n) => n.x);
    const ys = nodesSeq.map((n) => n.y);
    const minX = Math.min(...xs) - 220;
    const maxX = Math.max(...xs) + 220;
    const minY = Math.min(...ys) - 80;
    const maxY = Math.max(...ys) + 80;
    const w = maxX - minX + 40;
    const h = maxY - minY + 40;
    const offsetX = -minX + 20;
    const offsetY = -minY + 20;

    const nodes = nodesSeq.map((n) => ({
      id: n.id,
      text: n.node?.TEXT || n.node?.text || "—",
      x: n.x + offsetX,
      y: n.y + offsetY,
      depth: n.depth,
      raw: n.node,
    }));

    return { nodes, edges: edgesOut, width: w, height: h };
  }, [data, collapsedMap, H_SPACING, V_SPACING]);
}
