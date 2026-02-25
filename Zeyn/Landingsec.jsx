import { useEffect, useMemo, useState } from "react";
import "./Landingsec.css";
import "./landing.css";
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
  return [
    `${base}/storage/visitors/${clean}`,
    `${base}/storage/visitor/${clean}`,
    `${base}/storage/dokumentasi/${clean}`,
    `${base}/storage/uploads/${clean}`,
    `${base}/storage/${clean}`,
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
      style={{ maxWidth: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)" }}
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

  const signatureUrl = signName ? `${apiHost}/storage/signatures/${signName}` : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: "min(820px, 100%)",
          maxHeight: "85vh",
          overflow: "auto",
          padding: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center mb-2">
          <h5 className="mb-0">Info Tamu</h5>
          <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div style={{ fontSize: 14 }}>
          <div className="row g-2">
            <div className="col-md-6">
              <div className="p-2 border rounded">
                <div className="mb-2"><b>Nama</b>: {tamu?.name || "-"}</div>
                <div className="mb-2"><b>Perusahaan</b>: {tamu?.company || "-"}</div>
                <div className="mb-2"><b>Telepon</b>: {tamu?.phone || "-"}</div>
                <div className="mb-2"><b>Jenis ID</b>: {tamu?.id_type || "-"}</div>
                <div className="mb-2"><b>No ID</b>: {tamu?.id_number || "-"}</div>
                <div className="mb-2"><b>Aktivitas</b>: {tamu?.activity || "-"}</div>
                <div className="mb-2"><b>Ruang Kerja</b>: {tamu?.ruang_kerja || "-"}</div>
                <div className="mb-2"><b>No VISIT / E-SIK</b>: {tamu?.visit_id || "-"}</div>
                <div className="mb-2"><b>Status</b>: {tamu?.status || "-"}</div>
                <div className="mb-2"><b>Dibuat</b>: {formatTanggalWaktu(tamu?.created_at)}</div>
                <div className="mb-2"><b>Update</b>: {formatTanggalWaktu(tamu?.updated_at)}</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-2 border rounded mb-2">
                <div className="mb-2"><b>Tanda Tangan</b></div>
                {signatureUrl ? (
                  <img
                    src={signatureUrl}
                    alt="Tanda Tangan"
                    style={{ maxWidth: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div>-</div>
                )}
              </div>

              <div className="p-2 border rounded mb-2">
                <div className="mb-2"><b>Foto Masuk</b></div>
                <ImageWithFallback apiHost={apiHost} fileName={fotoMasukName} alt="Foto Masuk" />
                {fotoMasukName ? (
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{fotoMasukName}</div>
                ) : null}
              </div>

              <div className="p-2 border rounded">
                <div className="mb-2"><b>Foto Keluar</b></div>
                <ImageWithFallback apiHost={apiHost} fileName={fotoKeluarName} alt="Foto Keluar" />
                {fotoKeluarName ? (
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{fotoKeluarName}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landingsec() {

  const username = HARDCODE_USERNAME;
  const ttc = HARDCODE_TTC;
  const apiHost = HARDCODE_API_HOST;

  useEffect(() => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("ttc", ttc);
    sessionStorage.setItem("host", apiHost.replace(/^https?:\/\//, "")); // simpan versi tanpa http biar aman
  }, [username, ttc, apiHost]);

  let userID = 0;
  try {
    const u = JSON.parse(sessionStorage.getItem("userinfo"));
    if (u?.id != null) userID = u.id;
  } catch {
    userID = 0;
  }

  const [tamu, setTamu] = useState([]);
  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState(null);

  const allURL = useMemo(() => `${apiHost}/api/${ttc}/visitor`, [apiHost, ttc]);
  const updateBaseURL = useMemo(() => `${apiHost}/api/${ttc}/visitor`, [apiHost, ttc]);

  const showToast = (message, type = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const safeReadJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 80)}`);
    }
    return res.json();
  };

  const fetchTamu = async () => {
    setLoading(true);
    try {
      const res = await fetch(allURL, { credentials: "include" });
      const json = await safeReadJson(res);

      if (json.success) {
        const data = json.data || [];

        const filtered = data.filter((t) =>
          ["pending", "approved", "selesai"].includes(t.status)
        );
        setTamu(filtered);
      } else {
        showToast("Gagal ambil data visitor", "error");
      }
    } catch (err) {
      console.error("fetchTamu error:", err);
      showToast("API error / bukan JSON", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTamu();

  }, [allURL]);

  const handleApproveClick = (id) => {
    setUploading((prev) => ({ ...prev, [id]: "in" }));
  };

  const handleUploadFoto = async (file, id, type) => {
    if (!file) return;

    const formData = new FormData();
    if (type === "in") formData.append("dokumentasi_in", file);
    if (type === "out") formData.append("dokumentasi_out", file);
    formData.append("status", type === "in" ? "approved" : "selesai");

    try {
      const res = await fetch(`${updateBaseURL}/${id}/update-status`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          userid: String(userID),
        },
      });

      const json = await safeReadJson(res);

      if (!json.success) {
        alert("Gagal update status: " + (json.message || "unknown"));
        return;
      }

      if (type === "in") {
        setTamu((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, status: "approved", dokumentasi_in: file.name } : t
          )
        );
        setUploading((prev) => ({ ...prev, [id]: false }));
        showToast("Approved + Foto Masuk tersimpan", "success");
      }

      if (type === "out") {
        setTamu((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, status: "selesai", dokumentasi_out: file.name } : t
          )
        );
        setUploading((prev) => ({ ...prev, [id]: false }));
        showToast("Selesai + Foto Keluar tersimpan", "success");
      }
    } catch (err) {
      console.error("Error upload foto:", err);
      alert("Upload gagal, cek koneksi atau server API!");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${updateBaseURL}/${id}/update-status`, {
        method: "POST",
        body: new URLSearchParams({ status: "rejected" }),
        credentials: "include",
        headers: {
          userid: String(userID),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const json = await safeReadJson(res);

      if (json.success) {

        setTamu((prev) => prev.filter((t) => t.id !== id));
        showToast("Tamu rejected", "success");
      } else {
        showToast("Gagal reject", "error");
      }
    } catch (err) {
      console.error("Error reject:", err);
      showToast("Error reject", "error");
    }
  };

  const openInfo = (t) => {
    setSelectedTamu(t);
    setShowPopup(true);
  };

  const pendingCount = tamu.filter((t) => t.status === "pending").length;
  const approvedCount = tamu.filter((t) => t.status === "approved").length;
  const selesaiCount = tamu.filter((t) => t.status === "selesai").length;

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="d-flex align-items-center mb-2">
          <h3 className="security-title mb-0">Approval Tamu</h3>

          <button
            className="btn btn-sm btn-outline-primary ms-auto"
            onClick={fetchTamu}
            disabled={loading}
            title="Refresh data"
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 12 }}>
          User: <b>{username}</b> • Host: <b>{apiHost}</b> • TTC: <b>{ttc}</b>
        </div>

        {/* Ringkasan */}
        <section className="summary-section">
          <div className="summary-card bg-red">
            <i className="bi bi-person summary-icon text-white"></i>
            <div className="summary-text">
              <div className="summary-title">Waiting Approval</div>
              <div className="summary-value">{pendingCount}</div>
            </div>
          </div>

          <div className="summary-card bg-green">
            <i className="bi bi-check-circle summary-icon text-white"></i>
            <div className="summary-text">
              <div className="summary-title">Tamu Approved</div>
              <div className="summary-value">{approvedCount}</div>
            </div>
          </div>

          <div className="summary-card" style={{ background: "#f0ad4e" }}>
            <i className="bi bi-flag summary-icon text-white"></i>
            <div className="summary-text">
              <div className="summary-title">Tamu Selesai</div>
              <div className="summary-value">{selesaiCount}</div>
            </div>
          </div>
        </section>

        {/* Daftar Tamu */}
        <section className="table-section" id="approval-list">
          <table>
            <thead>
              <tr>
                <th>Hari</th>
                <th>Tanggal</th>
                <th>Nama Lengkap</th>
                <th>Perusahaan</th>
                <th>No. Telepon</th>
                <th>Aktivitas</th>
                <th>Jam</th>
                <th>Ruang Kerja</th>
                <th>No. VISIT/E SIK</th>
                <th>Status</th>
                <th>Info</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {tamu.length === 0 && !loading && (
                <tr>
                  <td colSpan={12} style={{ textAlign: "center", padding: 18, opacity: 0.7 }}>
                    Data kosong / belum ada tamu.
                  </td>
                </tr>
              )}

              {tamu.map((t) => (
                <tr key={t.id}>
                  <td>
                    {new Date(t.created_at).toLocaleDateString("id-ID", { weekday: "long" })}
                  </td>
                  <td>{new Date(t.created_at).toLocaleDateString("id-ID")}</td>
                  <td>{t.name}</td>
                  <td>{t.company}</td>
                  <td>{t.phone}</td>
                  <td>{t.activity}</td>
                  <td>
                    {new Date(t.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{t.ruang_kerja}</td>
                  <td>{t.visit_id}</td>
                  <td>{t.status}</td>

                  <td>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => openInfo(t)}
                      title="Lihat detail"
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </td>

                  <td>
                    {/* pending */}
                    {t.status === "pending" && !uploading[t.id] && (
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-success btn-sm d-flex align-items-center"
                          onClick={() => handleApproveClick(t.id)}
                          title="Approve (upload foto masuk)"
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm d-flex align-items-center"
                          onClick={() => handleReject(t.id)}
                          title="Reject"
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </div>
                    )}

                    {uploading[t.id] === "in" && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFoto(e.target.files?.[0], t.id, "in")}
                      />
                    )}

                    {/* approved -> out */}
                    {t.status === "approved" && !uploading[t.id] && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setUploading((prev) => ({ ...prev, [t.id]: "out" }))}
                        title="Tamu Keluar (upload foto keluar)"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    )}

                    {uploading[t.id] === "out" && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFoto(e.target.files?.[0], t.id, "out")}
                      />
                    )}

                    {/* selesai */}
                    {t.status === "selesai" && (
                      <span style={{ fontSize: 12, opacity: 0.7 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
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