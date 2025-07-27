import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TodoApp from "./App.tsx";
// import App from "./components/SocketTest.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoApp />
    {/* <App /> */}
  </StrictMode>
);
