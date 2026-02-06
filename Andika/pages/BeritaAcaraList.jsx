import React, { useEffect, useState } from "react";
import BeritaAcaraTable from "../components/BeritaAcaraTable";
import { getBeritaAcara } from "../services/beritaAcaraService";
import "../styles/beritaAcara.css";

export default function BeritaAcaraList() {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  getBeritaAcara()
    .then((res) => {
      console.log("DATA BA:", res);
      setData(res);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);


  return (
    <div className="ba-page">
      <h2 className="ba-title">Data Berita Acara Barang</h2>

      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <BeritaAcaraTable data={data} />
      )}
    </div>
  );
}
