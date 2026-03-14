import { useEffect, useState } from "react";
import "./BukuTamu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ModalInfo from "./ModalInfo";
import { API_HOST, fetchDoneVisitorsRaw, getSiteConfig, mapVisitorData, applyFilter, exportExcel } from "./TestVisitor";

export default function BukuTamu() {
  const SITE = getSiteConfig();
  const username = SITE.username;
  const ttc = SITE.ttc;
  const apiHost = API_HOST;
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [mergedData, setMergedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [monthData, setMonthData] = useState([]); 
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
    const rawData = await fetchDoneVisitorsRaw("month");
    const data = mapVisitorData(rawData);

    if (!isMounted) return;
    setMonthData(data);      
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
  let sourceData = allDataLoaded ? mergedData : monthData;
  if (!allDataLoaded) {
    setLoading(true);

    try {
      const rawData = await fetchDoneVisitorsRaw("all");
      const data = mapVisitorData(rawData);

      setMergedData(data);
      setAllDataLoaded(true);

      sourceData = data;

      console.log("Fetch visitor selesai");

    } catch (err) {
      console.error("fetch all error", err);
    } finally {
      setLoading(false);
    }
  }
  const result = applyFilter(sourceData, keyword, startDate, endDate);
  setFilteredData(result);
};

  const handleReset = () => {
  setStartDate("");
  setEndDate("");
  setKeyword("");

  setMergedData(monthData);
  setFilteredData(monthData);
  setAllDataLoaded(false);
};

  const openInfo = (r) => {
    setSelectedTamu(r.raw);
    setShowPopup(true);
  };

  const exportToExcel = () => {
  exportExcel(filteredData, ttc);
};

  return (
    <div className="bt-wrap">
      <div className="bt-panel">
        <div className="bt-header">
          <div>
            <h3 className="security-title mb-1">
              Buku Tamu - {SITE.label}
            </h3>
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
              <button
                className="btn btn-outline-success btn-sm bt-export-btn"
                onClick={exportToExcel}
                disabled={loading || filteredData.length === 0}
              >
                <i className="bi bi-file-earmark-excel me-1"></i>
                Export
              </button>
            </div>
          </div>

          <div className="bt-summary-card">
            <div className="bt-summary-item">
              <span>Total Tamu</span>
              <strong>{filteredData.length}</strong>
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
                          src={`${apiHost}/storage/visitors/${r.dokumentasi_in}?t=${r.id}`}
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
                          src={`${apiHost}/storage/visitors/${r.dokumentasi_out}?t=${r.id}`}
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