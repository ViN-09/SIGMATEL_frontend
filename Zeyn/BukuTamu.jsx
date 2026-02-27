import { useEffect, useMemo, useState } from "react";
import "./BukuTamu.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const HARDCODE_USERNAME = "zeyn";
const HARDCODE_TTC = "ttc_paniki";
const HARDCODE_API_HOST = "http://127.0.0.1:8000";

function formatTanggalWaktu(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("id-ID");
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

  if (!fileName || fileName === "-" || candidates.length === 0) return <span className="bt-muted">-</span>;
  const src = candidates[idx];

  return (
    <img
      src={src}
      alt={alt}
      className="bt-img"
      onError={() => {
        if (idx < candidates.length - 1) setIdx((p) => p + 1);
      }}
    />
  );
}

function ModalInfo({ open, onClose, apiHost, tamu }) {
  if (!open) return null;

  const fotoMasukName = tamu?.dokumentasi_in || "";
  const fotoKeluarName = tamu?.dokumentasi_out || "";
  const signName = tamu?.signature || "";
  const signatureUrl = signName
    ? `${apiHost.replace(/\/$/, "")}/storage/signatures/${signName}?t=${Date.now()}`
    : "";

  return (
    <div className="bt-modal-overlay" onClick={onClose}>
      <div className="bt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bt-modal-head">
          <div>
            <div className="bt-modal-title">Info Buku Tamu</div>
            <div className="bt-modal-sub">Detail tamu yang sudah selesai</div>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div className="bt-modal-body">
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="bt-card">
                <div className="bt-kv"><b>Nama</b><span>{tamu?.name || "-"}</span></div>
                <div className="bt-kv"><b>Perusahaan</b><span>{tamu?.company || "-"}</span></div>
                <div className="bt-kv"><b>Telepon</b><span>{tamu?.phone || "-"}</span></div>
                <div className="bt-kv"><b>Jenis ID</b><span>{tamu?.id_type || "-"}</span></div>
                <div className="bt-kv"><b>No ID</b><span>{tamu?.id_number || "-"}</span></div>
                <div className="bt-kv"><b>Aktivitas</b><span>{tamu?.activity || "-"}</span></div>
                <div className="bt-kv"><b>Ruang Kerja</b><span>{tamu?.ruang_kerja || "-"}</span></div>
                <div className="bt-kv"><b>No VISIT / E-SIK</b><span>{tamu?.visit_id || "-"}</span></div>
                <div className="bt-kv"><b>Status</b><span className="bt-pill bt-pill-done">{tamu?.status || "-"}</span></div>
                <div className="bt-kv"><b>Dibuat</b><span>{formatTanggalWaktu(tamu?.created_at)}</span></div>
                <div className="bt-kv"><b>Update</b><span>{formatTanggalWaktu(tamu?.updated_at)}</span></div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bt-grid2">
                <div className="bt-card">
                  <div className="bt-card-title">Tanda Tangan</div>
                  {signatureUrl ? (
                    <img
                      src={signatureUrl}
                      alt="Tanda Tangan"
                      className="bt-img"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="bt-muted">-</div>
                  )}
                </div>

                <div className="bt-card">
                  <div className="bt-card-title">Foto Masuk</div>
                  <ImageWithFallback apiHost={apiHost} fileName={fotoMasukName} alt="Foto Masuk" />
                  {!!fotoMasukName && <div className="bt-fn">{fotoMasukName}</div>}
                </div>

                <div className="bt-card">
                  <div className="bt-card-title">Foto Keluar</div>
                  <ImageWithFallback apiHost={apiHost} fileName={fotoKeluarName} alt="Foto Keluar" />
                  {!!fotoKeluarName && <div className="bt-fn">{fotoKeluarName}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bt-modal-foot">
          <button className="btn btn-sm btn-outline-dark" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BukuTamu() {
  const username = HARDCODE_USERNAME;
  const ttc = HARDCODE_TTC;
  const apiHost = HARDCODE_API_HOST;

  useEffect(() => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("ttc", ttc);
    sessionStorage.setItem("host", apiHost);
  }, [username, ttc, apiHost]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState(""); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState("");     // yyyy-mm-dd

  const [selected, setSelected] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);

  const listURL = useMemo(() => `${apiHost}/api/${ttc}/visitor`, [apiHost, ttc]);

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

  const safeReadJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`);
    }
    return res.json();
  };

  const fetchDoneVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch(listURL, { credentials: "include" });
      const json = await safeReadJson(res);

      if (!json?.success) {
        setRows([]);
        toast(json?.message || "Gagal ambil data", "error");
        return;
      }

      const all = Array.isArray(json.data) ? json.data : [];

      const done = all.filter((t) => {
        const okStatus = String(t?.status || "").toLowerCase() === "selesai";
        const hasIn = !!String(t?.dokumentasi_in || "").trim();
        const hasOut = !!String(t?.dokumentasi_out || "").trim();
        return okStatus && hasIn && hasOut;
      });

      done.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRows(done);
    } catch (e) {
      console.error(e);
      setRows([]);
      toast("API error / route tidak ada / bukan JSON", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoneVisitors();
  }, [listURL]);

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

  const openDetail = (t) => {
    setSelected(t);
    setOpenInfo(true);
  };

  return (
    <div className="bt-wrap">
      <div className="bt-topbar">
        <div>
          <div className="bt-title">Buku Tamu</div>
          <div className="bt-sub">
            User: <b>{username}</b> • Host: <b>{apiHost}</b> • TTC: <b>{ttc}</b>
          </div>
        </div>

        <div className="bt-actions">
          <button className="btn btn-sm btn-outline-light bt-btn" onClick={fetchDoneVisitors} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

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
            <input className="bt-date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>

          <div className="bt-field">
            <label>Sampai</label>
            <input className="bt-date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>

          <div className="bt-field bt-right">
            <label>Total</label>
            <div className="bt-total">{filtered.length}</div>
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
                    <td data-label="Aktivitas" className="bt-truncate" title={t.activity}>
                      {t.activity}
                    </td>
                    <td data-label="Ruang">{t.ruang_kerja}</td>
                    <td data-label="VISIT/E-SIK" className="bt-mono">{t.visit_id}</td>
                    <td data-label="Status">
                      <span className="bt-pill bt-pill-done">{t.status}</span>
                    </td>
                    <td data-label="Info">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => openDetail(t)} title="Lihat detail">
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

      <ModalInfo open={openInfo} onClose={() => setOpenInfo(false)} apiHost={apiHost} tamu={selected} />
    </div>
  );
}