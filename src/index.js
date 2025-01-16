import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+

import App from "./App.js";

// Find the container where React should be mounted
const container = document.getElementById("root");


const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add Font Awesome script dynamically
const script = document.createElement('script');
script.src = "https://kit.fontawesome.com/2cacd0cbd0.js";
script.crossOrigin = "anonymous";
document.head.appendChild(script);