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

function mapVisitorData(rawData) {
  return (rawData || [])
    .map((item) => {
      const created = new Date(item.created_at);

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
    })
    .sort((a, b) => {
      const aTime =
        a.tanggalRaw instanceof Date && !Number.isNaN(a.tanggalRaw.getTime())
          ? a.tanggalRaw.getTime()
          : 0;
      const bTime =
        b.tanggalRaw instanceof Date && !Number.isNaN(b.tanggalRaw.getTime())
          ? b.tanggalRaw.getTime()
          : 0;

      return bTime - aTime;
    });
}

function applyFilter(data, keyword, startDate, endDate) {
  let result = [...data];

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    result = result.filter((item) => {
      if (
        !(item.tanggalRaw instanceof Date) ||
        Number.isNaN(item.tanggalRaw.getTime())
      ) {
        return false;
      }
      return item.tanggalRaw >= start && item.tanggalRaw <= end;
    });
  }

  const key = keyword.trim().toLowerCase();

  if (key) {
    result = result.filter((item) => {
      return [
        item.hari,
        item.tanggal,
        item.nama,
        item.instansi,
        item.noTelp,
        item.aktivitas,
        item.ruangKerja,
        item.keterangan,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(key);
    });
  }

  return result;
}

export default function BukuTamu() {
  const SITE = getSiteConfig();
  const username = SITE.username;
  const ttc = SITE.ttc;
  const apiHost = API_HOST;

  const [mergedData, setMergedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("ttc", ttc);
    sessionStorage.setItem("host", apiHost);
  }, [username, ttc, apiHost]);

  useEffect(() => {
    let isMounted = true;

    const loadCompletedVisitors = async () => {
      setLoading(true);
      try {
        const rawData = await fetchDoneVisitorsRaw();
        const data = mapVisitorData(rawData);

        if (!isMounted) return;

        setMergedData(data);
        setFilteredData(data);
      } catch (err) {
        console.error("Error fetch completed visitors:", err);
        if (!isMounted) return;
        setMergedData([]);
        setFilteredData([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCompletedVisitors();

    return () => {
      isMounted = false;
    };
  }, [ttc, apiHost]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const rawData = await fetchDoneVisitorsRaw();
      const latestData = mapVisitorData(rawData);
      const result = applyFilter(latestData, keyword, startDate, endDate);

      setMergedData(latestData);
      setFilteredData(result);
    } catch (err) {
      console.error("Error filter completed visitors:", err);
      const fallback = applyFilter(mergedData, keyword, startDate, endDate);
      setFilteredData(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setStartDate("");
    setEndDate("");
    setKeyword("");
    setLoading(true);

    try {
      const rawData = await fetchDoneVisitorsRaw();
      const latestData = mapVisitorData(rawData);

      setMergedData(latestData);
      setFilteredData(latestData);
    } catch (err) {
      console.error("Error reset completed visitors:", err);
      setFilteredData(mergedData);
    } finally {
      setLoading(false);
    }
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
        <div className="bt-header">
          <div>
            <h3 className="security-title mb-1">
              Buku Tamu (Completed) - {SITE.label}
            </h3>
            <div className="bt-subtitle">
              Data tamu selesai dengan pencarian sederhana dan tampilan lebih rapi
            </div>
          </div>
        </div>

        <div className="bt-filters">
          <div className="bt-field bt-field-search">
            <label>Cari Data</label>
            <div className="bt-input">
              <i className="bi bi-search"></i>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama, perusahaan, telepon, aktivitas, ruang kerja, VISIT/E-SIK..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFilter();
                }}
              />
            </div>
          </div>

          <div className="bt-field">
            <label>Dari Tanggal</label>
            <input
              className="bt-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="bt-field">
            <label>Sampai Tanggal</label>
            <input
              className="bt-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="bt-field bt-field-actions">
            <label>Aksi</label>
            <div className="bt-action-buttons">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleFilter}
                disabled={loading}
              >
                <i className="bi bi-search me-1"></i>
                Cari
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReset}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Reset
              </button>
            </div>
          </div>

          <div className="bt-summary-card">
            <div className="bt-summary-item">
              <span>Total Data</span>
              <strong>{filteredData.length}</strong>
            </div>

            <div className="bt-summary-divider"></div>

            <div className="bt-summary-export">
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
                    <td data-label="Hari">{r.hari}</td>
                    <td data-label="Tanggal">{r.tanggal}</td>
                    <td data-label="Nama">{r.nama}</td>
                    <td data-label="Perusahaan">{r.instansi}</td>
                    <td data-label="Nomor Telepon">{r.noTelp}</td>
                    <td data-label="Aktivitas">{r.aktivitas}</td>
                    <td data-label="Waktu Masuk">
                      {r.jamMasuk
                        ? new Date(r.jamMasuk).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    <td data-label="Foto Masuk" style={{ minWidth: 90 }}>
                      {r.dokumentasi_in && r.dokumentasi_in !== "-" ? (
                        <img
                          src={`${apiHost}/storage/visitors/${r.dokumentasi_in}?t=${Date.now()}`}
                          alt="foto masuk"
                          className="bt-thumb"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td data-label="Waktu Keluar">
                      {r.jamKeluar
                        ? new Date(r.jamKeluar).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    <td data-label="Foto Keluar" style={{ minWidth: 90 }}>
                      {r.dokumentasi_out && r.dokumentasi_out !== "-" ? (
                        <img
                          src={`${apiHost}/storage/visitors/${r.dokumentasi_out}?t=${Date.now()}`}
                          alt="foto keluar"
                          className="bt-thumb"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td data-label="Ruang Kerja">{r.ruangKerja}</td>
                    <td data-label="No. VISIT/E SIK">{r.keterangan}</td>

                    <td data-label="Status">
                      <span className="bt-status">{r.status}</span>
                    </td>

                    <td data-label="Info">
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