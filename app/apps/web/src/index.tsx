import React from "react";
import { App } from "./app"
import { createRoot } from "react-dom/client"
import Providers from "./providers";
import "./global.css"
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";

const root = document.getElementById("root");

if (!root) throw new Error("Failed to render application")

createRoot(root).render(
  <React.StrictMode>
      <Providers >
        <App />
      </Providers>
  </React.StrictMode>
);