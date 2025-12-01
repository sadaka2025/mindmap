// buildMap.jsx
export function buildMap(rootJson, onClick) {
  const nodes = [];
  const edges = [];
  const xStep = 280;
  const yStep = 80;

  const genId = () => "n-" + Math.random().toString(36).slice(2, 9);

  function addNode(label, depth, index, parentId, onClickData) {
    const x = 600 + depth * xStep;
    const y = 80 + index * yStep;
    const id = genId();

    nodes.push({
      id,
      position: { x, y },
      data: { label, onClick: () => onClick(onClickData) },
      draggable: true,
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${id}`,
        source: parentId,
        target: id,
        animated: true,
      });
    }

    return id;
  }

  // ----------- 1) عنوان الدرس ----------- //
  const rootId = addNode(rootJson.label, 0, 0, null, rootJson);

  // ----------- 2) المفاهيم النحوية ----------- //
  if (rootJson.concepts) {
    const conceptsId = addNode("المفاهيم ", 1, 0, rootId, rootJson.concepts);

    Object.keys(rootJson.concepts).forEach((k, idx) => {
      addNode(k.replace(/_/g, " "), 2, idx, conceptsId, {
        text: rootJson.concepts[k],
      });
    });
  }

  // ----------- 3) القاعدة العامة ----------- //
  if (rootJson.generalRule) {
    addNode("القاعدة العامة", 1, 1, rootId, {
      generalRule: rootJson.generalRule,
    });
  }

  // ----------- 4) الأمثلة ----------- //
  if (rootJson.examples && Array.isArray(rootJson.examples)) {
    rootJson.examples.forEach((ex, exIndex) => {
      const groupId = addNode(ex.label, 1, exIndex + 2, rootId, ex);

      // المعنى الصحيح
      addNode("المعنى الصحيح", 2, 0, groupId, {
        example: ex.example,
        correct: ex.correct,
        meaning: ex.meaning,
        spiritual: ex.spiritual || ex.spiritualReflection,
        expansion_correct: ex.expansion,
        source: ex.source,
      });

      // المعنى الخاطئ
      addNode("المعنى الخاطئ", 2, 1, groupId, {
        example: ex.example,
        if_wrong: ex.if_wrong,
        meaning: ex.meaning,
        spiritual: ex.spiritual || ex.spiritualReflection,
        expansion_wrong: { howMisapplied: ex.if_wrong },
        source: ex.source,
      });
    });
  }

  return { nodes, edges };
}
