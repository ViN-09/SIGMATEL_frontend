import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import ModalInfo from "./ModalInfo";
import { fetchDoneVisitors } from "./Visitor";
import "./BukuTamu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSITE, HOST, getUserInfo } from "../../Auth/Property";
import { exportBukuTamuXLSX } from "./exportExcel";

export default function BukuTamu() {
  const ttc = getSITE();
  const apiHost = HOST;
  const user = getUserInfo();
  const username = user.id;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
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
    const data = await fetchDoneVisitors(ttc);
    setRows(data);
    if (!data.length) toast("Tidak ada tamu selesai", "info");
    setLoading(false);
  };

  useEffect(() => {
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

    return rows.filter((t) => {
      const hit =
        !keyword ||
        String(t?.name || "").toLowerCase().includes(keyword) ||
        String(t?.company || "").toLowerCase().includes(keyword) ||
        String(t?.visit_id || "").toLowerCase().includes(keyword) ||
        String(t?.phone || "").toLowerCase().includes(keyword) ||
        String(t?.ruang_kerja || "").toLowerCase().includes(keyword) ||
        String(t?.activity || "").toLowerCase().includes(keyword);

      return hit && inRange(t?.created_at);
    });
  }, [rows, q, dateFrom, dateTo]);

  return (
    <div className="bt-wrap">
      {/* Filters */}
      <div className="bt-panel">
        <div className="bt-filters">
          <div className="bt-field">
            <label>Cari</label>
            <div className="bt-input">
              <i className="bi bi-search"></i>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nama / perusahaan / VISIT / telp / ruang / aktivitas..."
              />
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

          {/*Export Excel */}
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

        {/* Table */}
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
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={11} className="bt-empty">
                    Data kosong / belum ada tamu selesai.
                  </td>
                </tr>
              )}

              {filtered.map((t) => {
                const created = new Date(t.created_at);
                const hari = created.toLocaleDateString("id-ID", { weekday: "long" });
                const tanggal = created.toLocaleDateString("id-ID");
                const jam = created.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                return (
                  <tr key={t.id}>
                    <td data-label="Hari">{hari}</td>
                    <td data-label="Tanggal">{tanggal}</td>
                    <td data-label="Jam">{jam}</td>
                    <td data-label="Nama" className="bt-strong">{t.name}</td>
                    <td data-label="Perusahaan">{t.company}</td>
                    <td data-label="Telepon">{t.phone}</td>
                    <td data-label="Aktivitas" className="bt-truncate" title={t.activity}>{t.activity}</td>
                    <td data-label="Ruang">{t.ruang_kerja}</td>
                    <td data-label="VISIT/E-SIK" className="bt-mono">{t.visit_id}</td>
                    <td data-label="Status">
                      <span className="bt-pill bt-pill-done">{t.status}</span>
                    </td>
                    <td data-label="Info">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => { setSelected(t); setOpenInfo(true); }}
                        title="Lihat detail"
                      >
                        <i className="bi bi-info-circle"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
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