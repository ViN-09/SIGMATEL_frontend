import { useState, useEffect } from "react";
import "../FrontendDevelopmen/Rizki/Landingsec.css";
import InfoTamu from "../component/InfoTamu";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



export default function BukuTamu() {
  const [mergedData, setMergedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const apiHost = sessionStorage.getItem("host");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState({});

  const sampleData = {
    nama: "Vinci Tampubolon",
    alamat: "Tatelu, Jaga III, Dimembe",
    telepon: "085240534296",
    keperluan: "Kunjungan ke ruang server",
    waktu: "2025-10-06 21:45",
    note: "Diterima oleh Admin Jank.",
  };

  useEffect(() => {
    const fetchCompletedVisitors = async () => {
      try {
        const apiHost = sessionStorage.getItem("host");
        const ttc = sessionStorage.getItem("ttc");
        const res = await fetch(`${apiHost}/api/${ttc}/visitor/visitors/completed`, {
          credentials: "include",
        });
        const json = await res.json();
        if (json.success) {
          const data = json.data.map((item) => ({
            hari: new Date(item.created_at).toLocaleDateString("id-ID", { weekday: "long" }),
            tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
            tanggalRaw: new Date(item.created_at),
            nama: item.name,
            instansi: item.company,
            noTelp: item.phone,
            aktivitas: item.activity,
            jamMasuk: item.created_at,
            fotoMasuk: item.dokumentasi_in ? `${apiHost}/storage/visitors/${item.dokumentasi_in}` : null,
            jamKeluar: item.updated_at,
            fotoKeluar: item.dokumentasi_out ? `${apiHost}/storage/visitors/${item.dokumentasi_out}` : null,
            ruangKerja: item.ruang_kerja,
            keterangan: item.visit_id,
            status: item.status,
          }));
          setMergedData(data);
          setFilteredData(data);
        } else {
          console.error("Gagal ambil data:", json.message);
        }
      } catch (err) {
        console.error("Error fetch:", err);
      }
    };

    fetchCompletedVisitors();
  }, [apiHost]);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Pilih tanggal awal dan akhir!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = mergedData.filter(
      (item) => item.tanggalRaw >= start && item.tanggalRaw <= end
    );

    setFilteredData(result);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    const dataToExport = filteredData.map((r) => ({
      Hari: r.hari,
      Tanggal: r.tanggal,
      Nama: r.nama,
      Perusahaan: r.instansi,
      "Nomor Telepon": r.noTelp,
      Aktivitas: r.aktivitas,
      "Waktu Masuk": r.jamMasuk
        ? new Date(r.jamMasuk).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      "Waktu Keluar": r.jamKeluar
        ? new Date(r.jamKeluar).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      "Ruang Kerja": r.ruangKerja,
      "No. VISIT/E SIK": r.keterangan,
      Status: r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BukuTamu");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "BukuTamu.xlsx");
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h3 className="security-title">Buku Tamu</h3>

        <div className="filter-container">
          <div className="date-selector">
            <label>Dari:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label>Sampai:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleFilter}>
            Filter
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setFilteredData(mergedData)}
          >
            Reset
          </button>
          <button className="btn btn-success btn-sm" onClick={exportToExcel}>
            Export
          </button>
        </div>

        <section className="table-section" id="guest-list">
          <table>
            <thead>
              <tr>
                <th>Hari</th>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Perusahaan</th>
                <th>Nomor Telepon</th>
                <th>Aktivitas</th>
                <th>Waktu Masuk</th>
                <th>Foto Masuk</th>
                <th>Waktu Keluar</th>
                <th>Foto Keluar</th>
                <th>Ruang Kerja</th>
                <th>No. VISIT/E SIK</th>
                <th>Status</th>
                <th>Info</th> {/* ✅ kolom baru */}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="14" style={{ textAlign: "center" }}>
                    Belum ada data tamu
                  </td>
                </tr>
              ) : (
                filteredData.map((r, index) => (
                  <tr key={index}>
                    <td>{r.hari}</td>
                    <td>{r.tanggal}</td>
                    <td>{r.nama}</td>
                    <td>{r.instansi}</td>
                    <td>{r.noTelp}</td>
                    <td>{r.aktivitas}</td>
                    <td>
                      {r.jamMasuk
                        ? new Date(r.jamMasuk).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td>
                      {r.fotoMasuk ? (
                        <img
                          src={r.fotoMasuk}
                          alt="foto masuk"
                          style={{ width: "70px", borderRadius: "2px" }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {r.jamKeluar
                        ? new Date(r.jamKeluar).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td>
                      {r.fotoKeluar ? (
                        <img
                          src={r.fotoKeluar}
                          alt="foto keluar"
                          style={{ width: "70px", borderRadius: "2px" }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{r.ruangKerja}</td>
                    <td>{r.keterangan}</td>
                    <td>{r.status}</td>
                    {/* ✅ tombol Info */}
                    <td>
                     <button
  className="btn btn-outline-info btn-sm"
  onClick={() => {
    setSelectedTamu(r); // kirim semua data baris
    setShowPopup(true);
  }}
>
  <i className="bi bi-info-circle"></i>
</button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* ✅ Popup Info Tamu */}
      <InfoTamu
        open={showPopup}
        onClose={() => setShowPopup(false)}
        data={selectedTamu || sampleData}
      />
    </div>
  );
}
