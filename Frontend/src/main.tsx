import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import axios from "axios";
import "./global.css";
import "./index.css";
axios.defaults.baseURL = "http://192.168.0.47:5000";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App data-theme="light" />
    </BrowserRouter>
  </React.StrictMode>
);
