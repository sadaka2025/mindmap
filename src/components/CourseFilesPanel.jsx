import React, { useState } from "react";

export default function CourseFilesPanel({
  courses,
  onSelectPNG,
  onSelectJSON,
}) {
  const [expanded, setExpanded] = useState(true);

  const togglePanel = () => setExpanded(!expanded);

  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        right: 20,
        width: expanded ? 350 : 50,
        maxHeight: "80vh",
        overflowY: "auto",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        borderRadius: 12,
        padding: expanded ? 15 : 5,
        zIndex: 9999,
        transition: "width 0.3s ease",
      }}
    >
      <button
        onClick={togglePanel}
        style={{
          background: "orange",
          color: "black",
          border: "none",
          borderRadius: 6,
          padding: "5px 10px",
          marginBottom: 10,
          cursor: "pointer",
        }}
      >
        {expanded ? "إخفاء" : "عرض"}{" "}
      </button>
      ```
      {expanded &&
        Object.keys(courses).map((key) => (
          <div
            key={key}
            style={{
              marginBottom: 10,
              borderBottom: "1px solid #444",
              paddingBottom: 5,
            }}
          >
            <strong>{key}</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {courses[key].png && (
                <button
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    background: "#333",
                    color: "yellow",
                    borderRadius: 4,
                  }}
                  onClick={() => onSelectPNG(courses[key].png)}
                >
                  عرض PNG
                </button>
              )}
              {courses[key].json && (
                <button
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    background: "#555",
                    color: "lightblue",
                    borderRadius: 4,
                  }}
                  onClick={() => onSelectJSON(key)}
                >
                  عرض JSON
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
