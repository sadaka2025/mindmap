import React from "react";
export default function Footer() {
  return (
    <footer style={{ color: "yellow", fontSize: 40 }} className="pdf-btn">
      © {new Date().getFullYear()} — مشروع تعليمي في خدمة العلوم الشرعية.
    </footer>
  );
}
