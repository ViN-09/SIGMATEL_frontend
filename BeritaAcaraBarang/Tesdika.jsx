import React from "react";
import { Routes, Route } from "react-router-dom";

import List_ba_to_approved from "./List_ba_to_approved";
import List_berita_acara_barang from "./List_berita_acara_barang";

function Testdika() {
  return (
    <div className="dika-container">
      <Routes>
        <Route path="aprove" element={<List_ba_to_approved />} />
        <Route path="list-berita" element={<List_berita_acara_barang />} />
      </Routes>
    </div>
  );
}

export default Testdika;