// App.jsx — version complète corrigée pour 7 matières
import React, { useState, useMemo, useEffect } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

/* ------------------------------ Components ------------------------------ */
import Header from "./components/Header";
import Footer from "./components/Footer";
import NodeModal from "./components/NodeModal";
import NodeCard from "./components/NodeCard";
import PDFExportButton from "./components/PDFExportButton";
import ImageViewer from "./components/ImageViewer";

/* --------------------------------- Utils -------------------------------- */
import { buildMap } from "./utils/buildMap";

/* ------------------------------- Dedicace ------------------------------- */
import dedications from "./datadedication/dedications";

/* --------------------------- Node Types ---------------------------- */
const nodeTypes = { default: NodeCard };

export default function App() {
  const [selected, setSelected] = useState(null);

  // selectors
  const [year, setYear] = useState("year2");
  const [semester, setSemester] = useState("s1");
  // 7 matières gérées ici
  const [subject, setSubject] = useState("nahw");
  const subjects = [
    "fiqh",
    "tajwid",
    "sirah",
    "nahw",
    "aqida",
    "akhlaq",
    "hadith",
  ];

  // cours / image states
  const [currentCourse, setCurrentCourse] = useState("");
  const [currentPng, setCurrentPng] = useState(""); // url fourni par Vite
  const [showImageViewer, setShowImageViewer] = useState(false);

  // dedication popup
  const [showDedication, setShowDedication] = useState(false);
  const [dedicationMessage, setDedicationMessage] = useState("");

  /* --------------------------- Import all JSON & PNG --------------------------- */
  const allJsonModules = import.meta.glob(
    "/src/lib/courses/years/**/jsonfile/*.json",
    { eager: true }
  );
  const allPngModules = import.meta.glob(
    "/src/lib/courses/years/**/pngfile/*.png",
    { eager: true }
  );

  /* ------------------------- Filter courses by selection ------------------------ */
  const courses = useMemo(() => {
    const filtered = {};

    for (const path in allJsonModules) {
      if (path.includes(`/lib/courses/years/${year}/${semester}/${subject}/`)) {
        const filename = path.split("/").pop().replace(".json", "");
        filtered[filename] = { json: allJsonModules[path].default, png: null };
      }
    }

    for (const path in allPngModules) {
      if (path.includes(`/lib/courses/years/${year}/${semester}/${subject}/`)) {
        const filename = path.split("/").pop().replace(".png", "");
        if (filtered[filename]) {
          filtered[filename].png = allPngModules[path].default;
        }
      }
    }

    return filtered;
  }, [year, semester, subject, allJsonModules, allPngModules]);

  /* -------------- Set first course automatically when courses change ------------ */
  useEffect(() => {
    const keys = Object.keys(courses);
    if (keys.length > 0 && !currentCourse) {
      setCurrentCourse(keys[0]);
    }
    // if no courses, clear selection
    if (keys.length === 0) {
      setCurrentCourse("");
      setCurrentPng("");
    }
  }, [courses, currentCourse]);

  /* ------------------------ Build images object --------------------------- */
  const images = useMemo(() => {
    const imgs = {};
    for (const key in courses) imgs[key] = courses[key].png;
    return imgs;
  }, [courses]);

  /* ------------------- Auto-select PNG when course changes --------------------- */
  useEffect(() => {
    if (currentCourse && images[currentCourse]) {
      setCurrentPng(images[currentCourse]);
    } else {
      setCurrentPng("");
    }
  }, [currentCourse, images]);

  /* ---------------- Map Builder ---------------- */
  const { nodes, edges } = useMemo(() => {
    if (!currentCourse || !courses[currentCourse])
      return { nodes: [], edges: [] };
    return buildMap(courses[currentCourse].json, (node) => setSelected(node));
  }, [currentCourse, courses]);

  /* ------------------------- Handle Subject Change ----------------------------- */
  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    setDedicationMessage(dedications[newSubject] || "مرحبًا بك في الدرس!");
    setShowDedication(true);
    setSubject(newSubject);

    // reset course selection (will auto-select first via effect)
    setCurrentCourse("");
    setCurrentPng("");
  };

  return (
    <>
      <Header />

      <div
        id="content-area"
        style={{ padding: 10, color: "yellow", fontSize: 40 }}
      >
        {/* Selectors */}
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* YEAR */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="pdf-btn"
            style={{ backgroundColor: "orange", color: "blue" }}
          >
            {["year1", "year2", "year3", "year4", "year5"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {/* SEMESTER */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="pdf-btn"
            style={{ backgroundColor: "orange", color: "black" }}
          >
            {["s1", "s2"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {/* SUBJECT (7 matières) */}
          <select
            value={subject}
            onChange={handleSubjectChange}
            className="pdf-btn"
            style={{ backgroundColor: "orange", color: "black" }}
          >
            {subjects.map((su) => (
              <option key={su} value={su}>
                {su}
              </option>
            ))}
          </select>
          {/* JSON Courses Selector (liste des cours JSON disponibles) */}
          <select
            value={currentCourse}
            onChange={(e) => setCurrentCourse(e.target.value)}
            className="pdf-btn"
            style={{ backgroundColor: "yellow", color: "black" }}
          >
            {Object.keys(courses).length === 0 ? (
              <option value="">— aucun cours —</option>
            ) : (
              Object.keys(courses).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))
            )}
          </select>
          {/* PNG Selector (AUTO-LINKED) — UTILISE LA KEY, PAS L'URL */}
          {/* PNG Selector (AUTO-LINKED) */}
          <select
            value={currentCourse}
            onChange={(e) => {
              const key = e.target.value;
              setCurrentCourse(key);
              setCurrentPng(images[key] || "");

              // ⭐ NOUVEAU : ouvrir automatiquement l’image
              if (images[key]) setShowImageViewer(true);
            }}
            className="pdf-btn"
            style={{ backgroundColor: "lime", color: "black" }}
          >
            {Object.keys(images).length === 0 ? (
              <option value="">— aucune image —</option>
            ) : (
              Object.keys(images)
                .filter((key) => images[key])
                .map((key) => (
                  <option key={key} value={key}>
                    {key}.png
                  </option>
                ))
            )}
          </select>{" "}
          <button
            className="pdf-btn"
            onClick={() => setShowImageViewer(true)}
            style={{ color: "yellow", marginRight: 8, fontSize: 40 }}
            disabled={!currentPng}
            title={currentPng ? "Ouvrir l'image" : "Aucune image disponible"}
          >
            عرض خريطة ذهنية شاملة 🧠
          </button>
        </div>

        {/* Header Tools */}
        <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
          <span className="pdf-btn" style={{ color: "yellow", fontSize: 40 }}>
            عرض خريطة تفاعلية
          </span>

          <PDFExportButton />
        </div>

        {/* ReactFlow */}
        <div style={{ width: "100%", height: "70vh", marginBottom: 12 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url('/images/map-bg.jpg')",
              backgroundSize: "cover",
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {/* Miniature + Download */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {currentPng ? (
            <>
              <img
                src={currentPng}
                alt="miniature"
                style={{
                  width: 160,
                  height: "auto",
                  cursor: "pointer",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
                onClick={() => setShowImageViewer(true)}
              />
              <a
                href={currentPng}
                download
                className="pdf-btn"
                style={{
                  backgroundColor: "teal",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                Télécharger PNG
              </a>
            </>
          ) : (
            <div style={{ color: "#ccc" }}>
              Aucune image à afficher pour ce cours
            </div>
          )}
        </div>

        {/* Dedication Popup */}
        {showDedication && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(4px)",
              zIndex: 10000,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0,0,0,0.95)",
                color: "white",
                padding: "30px 50px",
                fontSize: "24px",
                borderRadius: "12px",
                textAlign: "right",
                lineHeight: 1.6,
                maxHeight: "80vh",
                overflow: "auto",
                fontFamily: "arabic typesetting",
                pointerEvents: "auto",
              }}
            >
              <div style={{ textAlign: "left", marginBottom: 12 }}>
                <button
                  onClick={() => setShowDedication(false)}
                  style={{
                    backgroundColor: "orange",
                    color: "black",
                    fontSize: 20,
                    padding: "5px 15px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  إغلاق
                </button>
              </div>

              {dedicationMessage.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      <NodeModal node={selected} onClose={() => setSelected(null)} />

      {/* IMAGE VIEWER uses currentPng */}
      {showImageViewer && currentPng && (
        <ImageViewer
          src={currentPng}
          onClose={() => setShowImageViewer(false)}
        />
      )}

      <Footer />
    </>
  );
}
