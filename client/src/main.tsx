import { createRoot } from "react-dom/client";
import { Router as WouterRouter } from "wouter";
import App from "./App";
import "./index.css";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/Gemessence/" : "/";

createRoot(document.getElementById("root")!).render(
  <WouterRouter base={BASE_PATH}>
    <App />
  </WouterRouter>,
);
