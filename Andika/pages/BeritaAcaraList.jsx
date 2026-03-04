import React, { useEffect, useState } from "react";
import BeritaAcaraTable from "../components/BeritaAcaraTable";
import { getBeritaAcara } from "../services/beritaAcaraService";
import "../styles/beritaAcara.css";
import { getUser, HOST } from "../auth";

export default function BeritaAcaraList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  
  
  
  const user=getUser('BM') // Kalau Mau Tes Role Ganti BM Atau ME
  const host = HOST

  useEffect(() => {
    getBeritaAcara(user.jabatan)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ba-page">
      <h2 className="ba-tittle">
        <b>Page Approval Berita Acara </b>
      </h2>

      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <BeritaAcaraTable data={data} />
      )}
    </div>
  );
}
