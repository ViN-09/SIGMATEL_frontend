import React from "react";
import { Routes, Route } from "react-router-dom";
import BeritaAcaraBarang from "./pages/BeritaAcaraBarang";
import BeritaAcaraList from "./pages/BeritaAcaraList";
import BeritaAcaraSelesai from "./components/BeritaAcaraSelesai";

function Testdika() {
  return (
    <div className="dika-container">
      <Routes>
        <Route path="/" element={<BeritaAcaraList />} />
        <Route path="/barang" element={<BeritaAcaraBarang />} />
        <Route path="/selesai" element={<BeritaAcaraSelesai />} />
      </Routes>
    </div>
  );
}

export default Testdika;