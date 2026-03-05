import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import ModalInfo from "./ModalInfo";
import { fetchDoneVisitors } from "./Visitor";
import "./BukuTamu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSITE, HOST, getUserInfo } from "../../Auth/Property";
import { exportBukuTamuXLSX } from "./exportExcel";

function getSiteLabel(ttc) {
  if (ttc === "ttc_teling") return "TTC Teling";
  if (ttc === "ttc_paniki") return "TTC Paniki";
  return ttc || "Unknown Site";
}

export default function BukuTamu() {
  const ttc = getSITE();
  const apiHost = HOST;
  const user = getUserInfo();
  const username = user?.name || user?.id || "unknown";
  const siteLabel = getSiteLabel(ttc);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [searchBy, setSearchBy] = useState("all");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selected, setSelected] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);

  const toast = (message, type = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  };

  const loadVisitors = async () => {
    setLoading(true);
    try {
      console.log("BukuTamu getSITE():", ttc);
      console.log("BukuTamu HOST:", apiHost);
      console.log("BukuTamu user:", user);

      const data = await fetchDoneVisitors(ttc);
      console.log("BukuTamu fetched rows:", data);

      setRows(Array.isArray(data) ? data : []);

      if (!data || data.length === 0) {
        toast("Tidak ada tamu selesai", "info");
      }
    } catch (err) {
      console.error("loadVisitors error:", err);
      setRows([]);
      toast("Gagal memuat data tamu selesai", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ttc) return;
    loadVisitors();
  }, [ttc]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    const inRange = (createdAt) => {
      if (!dateFrom && !dateTo) return true;

      const d = new Date(createdAt);
      if (Number.isNaN(d.getTime())) return true;

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const ds = `${yyyy}-${mm}-${dd}`;

      if (dateFrom && ds < dateFrom) return false;
      if (dateTo && ds > dateTo) return false;

      return true;
    };

    const val = (x) => String(x ?? "").toLowerCase();

    return rows.filter((t) => {
      const hit =
        !keyword ||
        (searchBy === "all" &&
          (
            val(t?.name).includes(keyword) ||
            val(t?.company).includes(keyword) ||
            val(t?.visit_id).includes(keyword) ||
            val(t?.phone).includes(keyword) ||
            val(t?.ruang_kerja).includes(keyword) ||
            val(t?.activity).includes(keyword)
          )) ||
        (searchBy === "name" && val(t?.name).includes(keyword)) ||
        (searchBy === "company" && val(t?.company).includes(keyword)) ||
        (searchBy === "visit_id" && val(t?.visit_id).includes(keyword)) ||
        (searchBy === "phone" && val(t?.phone).includes(keyword)) ||
        (searchBy === "ruang_kerja" && val(t?.ruang_kerja).includes(keyword)) ||
        (searchBy === "activity" && val(t?.activity).includes(keyword));

      return hit && inRange(t?.created_at);
    });
  }, [rows, q, searchBy, dateFrom, dateTo]);

  const handleSearch = () => {
    setQ(qInput);
  };

  const handleReset = () => {
    setQInput("");
    setQ("");
    setSearchBy("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="bt-wrap">
      <div className="bt-panel">
        <h3 className="security-title mb-3">Buku Tamu (Completed) - {siteLabel}</h3>

        {/* optional debug info
        <div className="mb-2" style={{ fontSize: 12, opacity: 0.75 }}>
          User: <b>{username}</b> | Host: <b>{apiHost}</b> | TTC: <b>{ttc}</b>
        </div>
        */}

        <div className="bt-filters">
          <div className="bt-field">
            <label>Filter Cari</label>
            <select
              className="bt-date"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="name">Nama</option>
              <option value="company">Perusahaan</option>
              <option value="visit_id">VISIT/E-SIK</option>
              <option value="phone">Telepon</option>
              <option value="ruang_kerja">Ruang</option>
              <option value="activity">Aktivitas</option>
            </select>
          </div>

          <div className="bt-field">
            <label>Cari</label>
            <div className="bt-input">
              <i className="bi bi-search"></i>
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Ketik kata kunci..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary ms-2"
                onClick={handleSearch}
                disabled={loading}
                title="Cari"
              >
                Cari
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={handleReset}
                disabled={loading}
                title="Reset"
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
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="bt-field">
            <label>Sampai</label>
            <input
              className="bt-date"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="bt-field bt-right">
            <label>Total</label>
            <div className="bt-total">{filtered.length}</div>
          </div>

          <div className="bt-field bt-right">
            <label>Export</label>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => exportBukuTamuXLSX(filtered, toast)}
              disabled={loading || filtered.length === 0}
              title="Export data yang sudah terfilter"
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
                <th>Jam</th>
                <th>Nama</th>
                <th>Perusahaan</th>
                <th>Telepon</th>
                <th>Aktivitas</th>
                <th>Ruang</th>
                <th>VISIT/E-SIK</th>
                <th>Status</th>
                <th>Info</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="bt-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="bt-empty">
                    Data kosong / belum ada tamu selesai.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const created = new Date(t.created_at);
                  const hari = Number.isNaN(created.getTime())
                    ? "-"
                    : created.toLocaleDateString("id-ID", { weekday: "long" });
                  const tanggal = Number.isNaN(created.getTime())
                    ? "-"
                    : created.toLocaleDateString("id-ID");
                  const jam = Number.isNaN(created.getTime())
                    ? "-"
                    : created.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                  return (
                    <tr key={t.id}>
                      <td data-label="Hari">{hari}</td>
                      <td data-label="Tanggal">{tanggal}</td>
                      <td data-label="Jam">{jam}</td>
                      <td data-label="Nama" className="bt-strong">
                        {t.name || "-"}
                      </td>
                      <td data-label="Perusahaan">{t.company || "-"}</td>
                      <td data-label="Telepon">{t.phone || "-"}</td>
                      <td
                        data-label="Aktivitas"
                        className="bt-truncate"
                        title={t.activity || "-"}
                      >
                        {t.activity || "-"}
                      </td>
                      <td data-label="Ruang">{t.ruang_kerja || "-"}</td>
                      <td data-label="VISIT/E-SIK" className="bt-mono">
                        {t.visit_id || "-"}
                      </td>
                      <td data-label="Status">
                        <span className="bt-pill bt-pill-done">
                          {t.status || "-"}
                        </span>
                      </td>
                      <td data-label="Info">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setSelected(t);
                            setOpenInfo(true);
                          }}
                          title="Lihat detail"
                        >
                          <i className="bi bi-info-circle"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalInfo
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        apiHost={apiHost}
        tamu={selected}
      />
    </div>
  );
}