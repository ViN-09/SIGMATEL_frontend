import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import ModalInfo from "./ModalInfo";
import { fetchDoneVisitors } from "./TestVisitor";
import "./BukuTamu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getSITE, HOST, getUSER } from "../auth";
import { exportBukuTamuXLSX } from "./exportExcel";

export default function BukuTamu() {
  const ttc = getSITE();
  const apiHost = HOST;
  const user = getUSER("teling");
  console.log("user", user);
  const username = user.id;

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

  const loadVisitors = async (filters = null) => {
    setLoading(true);

    const data = await fetchDoneVisitors(
      filters
        ? {
            q: filters.q ?? "",
            searchBy: filters.searchBy ?? "all",
            dateFrom: filters.dateFrom ?? "",
            dateTo: filters.dateTo ?? "",
            all: 1,
          }
        : {}
    );

    setRows(data);
    if (!data.length) toast("Tidak ada tamu selesai", "info");
    setLoading(false);
    return data;
  };

  useEffect(() => {
    loadVisitors();
  }, [ttc]);

  const handleSearch = async () => {
    await loadVisitors({
      q: qInput,
      searchBy,
      dateFrom,
      dateTo,
    });
    setQ(qInput);
  };

  const handleReset = async () => {
    setQInput("");
    setQ("");
    setSearchBy("all");
    setDateFrom("");
    setDateTo("");
    await loadVisitors();
  };

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
      const hitAll =
        !keyword ||
        val(t?.name).includes(keyword) ||
        val(t?.company).includes(keyword) ||
        val(t?.visit_id).includes(keyword) ||
        val(t?.phone).includes(keyword) ||
        val(t?.ruang_kerja).includes(keyword) ||
        val(t?.activity).includes(keyword);

      const hitOne =
        !keyword ||
        (searchBy === "name" && val(t?.name).includes(keyword)) ||
        (searchBy === "company" && val(t?.company).includes(keyword)) ||
        (searchBy === "visit_id" && val(t?.visit_id).includes(keyword)) ||
        (searchBy === "phone" && val(t?.phone).includes(keyword)) ||
        (searchBy === "ruang_kerja" && val(t?.ruang_kerja).includes(keyword)) ||
        (searchBy === "activity" && val(t?.activity).includes(keyword));

      const hit = searchBy === "all" ? hitAll : hitOne;

      return hit && inRange(t?.created_at);
    });
  }, [rows, q, dateFrom, dateTo, searchBy]);

  return (
    <div className="bt-wrap">
      {/* Filters */}
      <div className="bt-panel">
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

          {/* tombol Cari & Reset */}
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

          {/* Export Excel */}
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
                const jam = created.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={t.id}>
                    <td data-label="Hari">{hari}</td>
                    <td data-label="Tanggal">{tanggal}</td>
                    <td data-label="Jam">{jam}</td>
                    <td data-label="Nama" className="bt-strong">
                      {t.name}
                    </td>
                    <td data-label="Perusahaan">{t.company}</td>
                    <td data-label="Telepon">{t.phone}</td>
                    <td data-label="Aktivitas" className="bt-truncate" title={t.activity}>
                      {t.activity}
                    </td>
                    <td data-label="Ruang">{t.ruang_kerja}</td>
                    <td data-label="VISIT/E-SIK" className="bt-mono">
                      {t.visit_id}
                    </td>
                    <td data-label="Status">
                      <span className="bt-pill bt-pill-done">{t.status}</span>
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