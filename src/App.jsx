import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ConstellationBackground from "./components/ConstellationBackground.jsx";
import PrologueScreen from "./components/PrologueScreen.jsx";
import CliffhangerEnding from "./components/CliffhangerEnding.jsx";
import LabEngine from "./engine/LabEngine.jsx";

export default function App() {
  useEffect(() => {
    // Global security: Disable context menu (right click) and selection
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleDragStart = (e) => e.preventDefault();

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("cut", handleCopy);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCopy);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <Router>
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="h-screen w-screen bg-black text-slate-100 font-sans relative select-none flex flex-col overflow-hidden"
      >
        {/* Pure Black background with interactive constellation particles */}
        <ConstellationBackground />

        {/* Main Content Viewport with right-side scrollbar */}
        <main className="flex-1 w-full h-full relative z-10 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<PrologueScreen />} />
            <Route path="/investigate/:levelId" element={<LabEngine />} />
            <Route path="/cliffhanger" element={<CliffhangerEnding />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
