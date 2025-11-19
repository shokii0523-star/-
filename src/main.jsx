import React from "react";
import ReactDOM from "react-dom/client";
import InventoryApp from "./InventoryApp";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InventoryApp />
  </React.StrictMode>
);

// Service Worker を登録
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
