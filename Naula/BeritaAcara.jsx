import React, { useEffect, useState } from "react";

function BeritaAcara() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/ba")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data BA");
        }
        return res.json();
      })
      .then((json) => {
        console.log("DATA BERITA ACARA:", json); // 🔍 DEBUG
        setData(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR FETCH BA:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data Berita Acara...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        border="1"
        width="100%"
        cellPadding="8"
        style={{ borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>No</th>
            <th>Nomor</th>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" align="center">
                Tidak ada data
              </td>
            </tr>
          )}

          {data.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.nomor || "-"}</td>
              <td>{row.tanggal || "-"}</td>
              <td>{row.jenis}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BeritaAcara;
