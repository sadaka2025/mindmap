import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Styles globaux
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // ton CSS personnalisé
import "reactflow/dist/base.css"; // CSS pour React Flow

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
