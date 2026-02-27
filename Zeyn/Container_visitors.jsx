import React, { useState, useEffect } from "react";


function Container_visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengambil data dari API
    fetch("http://localhost:8000/api/ttc_teling/visitors")
      .then((response) => response.json())
      .then((data) => {
        setVisitors(data); // Menyimpan data ke state
        setLoading(false);   // Set loading menjadi false setelah data berhasil diambil
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
        setLoading(false);  // Set loading menjadi false jika terjadi error
      });
  }, []);  // Menggunakan array kosong untuk memastikan hanya dijalankan sekali saat komponen pertama kali dirender

  return (
    <div className="container_zeyn" style={{ backgroundColor: "#933e3e" }}>
      
      {loading ? (
        <p>Loading...</p> // Menampilkan loading jika data sedang diambil
      ) : (
        <div>
          <h2>Buku Tamu Bulanan</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Perusahaan</th>
                <th>Telepon</th>
                <th>ID Type</th>
                <th>ID Number</th>
                <th>Visit ID</th>
                <th>Activity</th>
                <th>Signature</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td>{visitor.id}</td>
                    <td>{visitor.name}</td>
                    <td>{visitor.company}</td>
                    <td>{visitor.phone}</td>
                    <td>{visitor.id_type}</td>
                    <td>{visitor.id_number}</td>
                    <td>{visitor.visit_id}</td>
                    <td>{visitor.activity}</td>
                    <td>{visitor.signature}</td>
                    <td>{visitor.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No visitors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Container_visitors;
