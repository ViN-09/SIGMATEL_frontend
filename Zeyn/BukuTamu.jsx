import { useEffect, useMemo, useState } from "react";
import "../../FrontendScript2/Zeyn/Landingsec.css";
import InfoTamu from "./InfoTamu";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_HOST = "http://127.0.0.1:8000";

function getSiteConfig() {
  const user = JSON.parse(sessionStorage.getItem("userinfo"));

  if (!user) {
    return {
      username: "unknown",
      ttc: "ttc_paniki",
      label: "Default",
    };
  }

  if (user.site === "TTC Teling") {
    return {
      username: user.name,
      ttc: "ttc_teling",
      label: "TTC Teling",
    };
  }

  if (user.site === "TTC Paniki") {
    return {
      username: user.name,
      ttc: "ttc_paniki",
      label: "TTC Paniki",
    };
  }

  return {
    username: user.name,
    ttc: "ttc_paniki",
    label: "TTC Paniki",
  };
}

function buildCandidates(apiHost, fileName) {
  if (!fileName || fileName === "-") return [];
  const clean = String(fileName).trim();
  if (!clean) return [];

  const base = apiHost.replace(/\/$/, "");
  const bust = `?t=${Date.now()}`;

  return [
    `${base}/storage/visitors/${clean}${bust}`,
    `${base}/storage/visitor/${clean}${bust}`,
    `${base}/storage/dokumentasi/${clean}${bust}`,
    `${base}/storage/uploads/${clean}${bust}`,
    `${base}/storage/${clean}${bust}`,
  ];
}

function ImageWithFallback({ apiHost, fileName, alt }) {
  const candidates = useMemo(() => buildCandidates(apiHost, fileName), [apiHost, fileName]);
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [fileName]);

  if (!fileName || fileName === "-" || candidates.length === 0) return <span>-</span>;

  const src = candidates[idx];

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "70px", borderRadius: "2px" }}
      onError={() => {
        if (idx < candidates.length - 1) setIdx((p) => p + 1);
      }}
    />
  );
}

export default function BukuTamu() {
  const SITE = getSiteConfig();
  const username = SITE.username;
  const ttc = SITE.ttc;
  const apiHost = API_HOST;

  useEffect(() => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("ttc", ttc);
    sessionStorage.setItem("host", apiHost);
  }, [username, ttc, apiHost]);

  const [mergedData, setMergedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const safeReadJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`);
    }
    return res.json();
  };

  useEffect(() => {
    const fetchCompletedVisitors = async () => {
      try {
        const ttcFromSession = sessionStorage.getItem("ttc") || ttc;
        const hostFromSession = sessionStorage.getItem("host") || apiHost;

        const url = `${hostFromSession}/api/${ttcFromSession}/visitor/completed`;

        const res = await fetch(url, { credentials: "include" });
        const json = await safeReadJson(res);

        if (json.success) {
          const data = (json.data || []).map((item) => {
            const created = new Date(item.created_at);
            const updated = new Date(item.updated_at);

            return {
              // tampilan tabel
              hari: created.toLocaleDateString("id-ID", { weekday: "long" }),
              tanggal: created.toLocaleDateString("id-ID"),
              tanggalRaw: created,
              nama: item.name,
              instansi: item.company,
              noTelp: item.phone,
              aktivitas: item.activity,
              jamMasuk: item.created_at,
              dokumentasi_in: item.dokumentasi_in || "-",
              jamKeluar: item.updated_at,
              dokumentasi_out: item.dokumentasi_out || "-",
              ruangKerja: item.ruang_kerja,
              keterangan: item.visit_id,
              status: item.status,
              id_type: item.id_type,
              id_number: item.id_number,
              signature: item.signature || "-", 
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
          });

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
  }, [apiHost, ttc]);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Pilih tanggal awal dan akhir!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result = mergedData.filter((item) => item.tanggalRaw >= start && item.tanggalRaw <= end);
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
        ? new Date(r.jamMasuk).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : "-",
      "Waktu Keluar": r.jamKeluar
        ? new Date(r.jamKeluar).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : "-",
      "Ruang Kerja": r.ruangKerja,
      "No. VISIT/E SIK": r.keterangan,
      Status: r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BukuTamu");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `BukuTamu_${ttc}.xlsx`);
  };

  const openInfo = (r) => {
    const fotoMasuk = r?.dokumentasi_in && r.dokumentasi_in !== "-" ? r.dokumentasi_in : "-";
    const fotoKeluar = r?.dokumentasi_out && r.dokumentasi_out !== "-" ? r.dokumentasi_out : "-";
    const signature = r?.signature && r.signature !== "-" ? r.signature : "-";

    setSelectedTamu({
      Nama: r?.nama,
      Perusahaan: r?.instansi,
      Telepon: r?.noTelp,
      Aktivitas: r?.aktivitas,
      "Ruang Kerja": r?.ruangKerja,
      "No VISIT / E-SIK": r?.keterangan,
      Status: r?.status,
      "Jenis ID": r?.id_type,
      "No ID": r?.id_number,
      "Tanda Tangan": signature,
      "Foto Masuk": fotoMasuk,
      "Foto Keluar": fotoKeluar,
      

      "Dibuat Pada": r?.created_at,
      "Diperbarui Pada": r?.updated_at,
    });

    setShowPopup(true);
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h3 className="security-title">Buku Tamu (Completed) - {SITE.label}</h3>

        <div className="filter-container">
          <div className="date-selector">
            <label>Dari:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <label>Sampai:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleFilter}>
            Filter
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => setFilteredData(mergedData)}>
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
                <th>Info</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="14" style={{ textAlign: "center" }}>
                    Belum ada data tamu selesai
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
                        ? new Date(r.jamMasuk).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                        : "-"}
                    </td>

                    <td>
                      <ImageWithFallback apiHost={apiHost} fileName={r.dokumentasi_in} alt="foto masuk" />
                    </td>

                    <td>
                      {r.jamKeluar
                        ? new Date(r.jamKeluar).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                        : "-"}
                    </td>

                    <td>
                      <ImageWithFallback apiHost={apiHost} fileName={r.dokumentasi_out} alt="foto keluar" />
                    </td>

                    <td>{r.ruangKerja}</td>
                    <td>{r.keterangan}</td>
                    <td>{r.status}</td>

                    <td>
                      <button className="btn btn-outline-info btn-sm" onClick={() => openInfo(r)} title="Lihat detail">
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

      <InfoTamu
        open={showPopup}
        onClose={() => setShowPopup(false)}
        apiHost={apiHost}
        data={Object.keys(selectedTamu || {}).length ? selectedTamu : sampleData}
      />
    </div>
  );
}