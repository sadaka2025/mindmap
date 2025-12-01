import { useRef, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Download,
  X,
  Maximize,
} from "lucide-react";

export default function ImageViewer({ src, onClose }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(true); // toujours plein écran à l’ouverture
  const lastPos = useRef({ x: 0, y: 0 });

  // ===== DRAG START =====
  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    lastPos.current = { x: clientX - pos.x, y: clientY - pos.y };
  };

  // ===== DRAG MOVE =====
  const drag = (e) => {
    if (!dragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    setPos({ x: clientX - lastPos.current.x, y: clientY - lastPos.current.y });
  };

  const stopDrag = () => setDragging(false);

  // ===== ZOOM =====
  const zoom = (delta) =>
    setScale((prev) => Math.min(6, Math.max(0.2, prev + delta)));

  // ===== DOWNLOAD =====
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "mindmap.png";
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="image-viewer-container"
      style={{
        width: fullscreen ? "100vw" : "100%",
        height: fullscreen ? "100vh" : "90vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: "auto",
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onMouseMove={drag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseDown={startDrag}
      onTouchMove={drag}
      onTouchEnd={stopDrag}
      onTouchStart={startDrag}
      onWheel={(e) => zoom(e.deltaY > 0 ? -0.2 : 0.2)}
    >
      {/* IMAGE */}
      <img
        src={src}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "top left",
          userSelect: "none",
          pointerEvents: "auto",
          display: "block",
          willChange: "transform",
          WebkitUserDrag: "none",
        }}
      />

      {/* CONTROLS */}
      <div className="image-viewer-controls">
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        )}
        <button onClick={() => zoom(+0.2)}>
          <ZoomIn size={18} />
        </button>
        <button onClick={() => zoom(-0.2)}>
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPos({ x: 0, y: 0 });
          }}
        >
          <RefreshCw size={18} />
        </button>
        <button onClick={downloadImage}>
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
