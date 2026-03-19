import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import semua halaman / page
import Formreport from "./Formreport.jsx";
import FormChecklist from "./Formceklist.jsx";

const Testceklist = () => {
  return (
    <Routes>
      <Route path="/" element={<FormChecklist />} />
      <Route path="/Formreport" element={<Formreport />} />
      <Route path="/FormChecklist" element={<FormChecklist />} />
    </Routes>
  );
};

export default Testceklist;