import { useEffect, useState } from "react";
import "./BukuTamu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ModalInfo from "./ModalInfo";
import { fetchDoneVisitorsRaw } from "./TestVisitor";

const API_HOST = "http://127.0.0.1:8000";

function getSiteConfig() {
  const raw = sessionStorage.getItem("userinfo");
  let user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  // test data paniki cesss
  return {
    username: user?.name || "unknown",
    ttc: "ttc_paniki",
    label: "TTC Paniki",
  };
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
  const [keyword, setKeyword] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState(null);

  useEffect(() => {
    const loadCompletedVisitors = async () => {
      setLoading(true);
      try {
        console.log("BukuTamu SITE:", SITE);

        const rawData = await fetchDoneVisitorsRaw();
        console.log("BukuTamu rawData:", rawData);

        const data = (rawData || []).map((item) => {
          const created = new Date(item.created_at);
          const updated = new Date(item.updated_at);

          return {
            id: item.id,
            hari: Number.isNaN(created.getTime())
              ? "-"
              : created.toLocaleDateString("id-ID", { weekday: "long" }),
            tanggal: Number.isNaN(created.getTime())
              ? "-"
              : created.toLocaleDateString("id-ID"),
            tanggalRaw: created,
            nama: item.name || "-",
            instansi: item.company || "-",
            noTelp: item.phone || "-",
            aktivitas: item.activity || "-",
            jamMasuk: item.created_at || "",
            dokumentasi_in: item.dokumentasi_in || "-",
            jamKeluar: item.updated_at || "",
            dokumentasi_out: item.dokumentasi_out || "-",
            ruangKerja: item.ruang_kerja || "-",
            keterangan: item.visit_id || "-",
            status: item.status || "-",
            id_type: item.id_type || "-",
            id_number: item.id_number || "-",
            signature: item.signature || "-",
            created_at: item.created_at || "",
            updated_at: item.updated_at || "",
            raw: item,
          };
        });

        console.log("BukuTamu mapped data:", data);

        setMergedData(data);
        setFilteredData(data);
      } catch (err) {
        console.error("Error fetch completed visitors:", err);
        setMergedData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompletedVisitors();
  }, [apiHost, ttc]);

  const handleFilter = () => {
    let result = [...mergedData];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((item) => {
        if (!(item.tanggalRaw instanceof Date) || Number.isNaN(item.tanggalRaw.getTime())) {
          return false;
        }
        return item.tanggalRaw >= start && item.tanggalRaw <= end;
      });
    }

    const key = keyword.trim().toLowerCase();

    if (key) {
      result = result.filter((item) => {
        const nama = String(item.nama || "").toLowerCase();
        const instansi = String(item.instansi || "").toLowerCase();
        const noTelp = String(item.noTelp || "").toLowerCase();
        const aktivitas = String(item.aktivitas || "").toLowerCase();
        const ruangKerja = String(item.ruangKerja || "").toLowerCase();
        const keterangan = String(item.keterangan || "").toLowerCase();

        if (searchBy === "nama") return nama.includes(key);
        if (searchBy === "instansi") return instansi.includes(key);
        if (searchBy === "telepon") return noTelp.includes(key);
        if (searchBy === "aktivitas") return aktivitas.includes(key);
        if (searchBy === "ruang") return ruangKerja.includes(key);
        if (searchBy === "visit") return keterangan.includes(key);

        return (
          nama.includes(key) ||
          instansi.includes(key) ||
          noTelp.includes(key) ||
          aktivitas.includes(key) ||
          ruangKerja.includes(key) ||
          keterangan.includes(key)
        );
      });
    }

    setFilteredData(result);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setKeyword("");
    setSearchBy("all");
    setFilteredData(mergedData);
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

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `BukuTamu_${ttc}.xlsx`);
  };

  const openInfo = (r) => {
    setSelectedTamu(r.raw);
    setShowPopup(true);
  };

  return (
    <div className="bt-wrap">
      <div className="bt-panel">
        <h3 className="security-title mb-3">
          Buku Tamu (Completed) - {SITE.label}
        </h3>

        <div className="bt-filters">
          <div className="bt-field">
            <label>Filter Cari</label>
            <select
              className="bt-date"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="nama">Nama</option>
              <option value="instansi">Perusahaan</option>
              <option value="telepon">Telepon</option>
              <option value="aktivitas">Aktivitas</option>
              <option value="ruang">Ruang</option>
              <option value="visit">VISIT/E-SIK</option>
            </select>
          </div>

          <div className="bt-field">
            <label>Cari</label>
            <div className="bt-input">
              <i className="bi bi-search"></i>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ketik kata kunci..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFilter();
                }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary ms-2"
                onClick={handleFilter}
                disabled={loading}
              >
                Cari
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bt-field">
            <label>Dari</label>
            <input
              className="bt-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="bt-field">
            <label>Sampai</label>
            <input
              className="bt-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="bt-field bt-right">
            <label>Total</label>
            <div className="bt-total">{filteredData.length}</div>
          </div>

          <div className="bt-field bt-right">
            <label>Export</label>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={exportToExcel}
              disabled={loading || filteredData.length === 0}
            >
              <i className="bi bi-file-earmark-excel me-1"></i>
              Export Excel
            </button>
          </div>
        </div>

        <div className="bt-tableWrap">
          <table className="bt-table">
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
              {loading ? (
                <tr>
                  <td colSpan="14" className="bt-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="14" className="bt-empty">
                    Belum ada data tamu selesai
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <tr key={r.id}>
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
                    <td style={{ minWidth: 90 }}>
                      {r.dokumentasi_in && r.dokumentasi_in !== "-" ? (
                        <img
                          src={`${apiHost}/storage/visitors/${r.dokumentasi_in}?t=${Date.now()}`}
                          alt="foto masuk"
                          style={{ width: "70px", borderRadius: "2px" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
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
                    <td style={{ minWidth: 90 }}>
                      {r.dokumentasi_out && r.dokumentasi_out !== "-" ? (
                        <img
                          src={`${apiHost}/storage/visitors/${r.dokumentasi_out}?t=${Date.now()}`}
                          alt="foto keluar"
                          style={{ width: "70px", borderRadius: "2px" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{r.ruangKerja}</td>
                    <td>{r.keterangan}</td>
                    <td>{r.status}</td>
                    <td>
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => openInfo(r)}
                        title="Lihat detail"
                      >
                        <i className="bi bi-info-circle"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalInfo
        open={showPopup}
        onClose={() => setShowPopup(false)}
        apiHost={apiHost}
        tamu={selectedTamu}
      />
    </div>
  );
}