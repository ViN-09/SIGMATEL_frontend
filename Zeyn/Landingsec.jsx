import { useEffect, useMemo, useRef, useState } from "react";
import "./Landingsec.css";
import "./landing.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import InfoTamu from "./InfoTamu.jsx";

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

  // fallback
  return {
    username: user.name,
    ttc: "ttc_paniki",
    label: "TTC Paniki",
  };
}

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

function dataUrlToFile(dataUrl, filename = "capture.jpg") {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

function pickSavedFilename(json, type) {
  const key = type === "in" ? "dokumentasi_in" : "dokumentasi_out";
  const v =
    json?.data?.[key] ??
    json?.visitor?.[key] ??
    json?.data?.visitor?.[key] ??
    json?.data?.data?.[key];

  return typeof v === "string" && v.trim() ? v.trim() : "";
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
      style={{
        maxWidth: "100%",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
      onError={() => {
        if (idx < candidates.length - 1) setIdx((p) => p + 1);
      }}
    />
  );
}


function CameraModal({ open, onClose, onSubmitFile, title, facingMode = "environment" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [supported, setSupported] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  const canUseMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  const stop = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch {}
  };

  const start = async () => {
    setError("");
    setStarting(true);

    if (!canUseMedia) {
      setSupported(false);
      setStarting(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setSupported(true);
    } catch (e) {
      console.error("getUserMedia error:", e);
      setSupported(false);
      setError("Kamera tidak bisa diakses. Pakai Upload sebagai fallback (izin ditolak / tidak ada kamera / bukan HTTPS).");
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    start();
    return () => stop();
  }, [open]);

  const captureAndSubmit = async () => {
    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    setFlash(true);
    setTimeout(() => setFlash(false), 120);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const file = dataUrlToFile(dataUrl, `capture_${Date.now()}.jpg`);

    await onSubmitFile(file);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
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
          width: "min(560px, 100%)",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center p-3 border-bottom">
          <div>
            <div style={{ fontWeight: 700 }}>{title || "Ambil Foto"}</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}></div>
          </div>
          <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div style={{ padding: 12 }}>
          {supported ? (
            <div style={{ position: "relative" }}>
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "#000",
                }}
              />
              {flash ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#fff",
                    opacity: 0.7,
                    borderRadius: 12,
                    pointerEvents: "none",
                  }}
                />
              ) : null}
            </div>
          ) : (
            <div className="p-3 border rounded" style={{ background: "rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 13, marginBottom: 8 }}>
                <b>Fallback Upload</b>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{error}</div>
              </div>
              <input
                type="file"
                accept="image/*"
                capture={facingMode}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await onSubmitFile(file);
                    onClose();
                  }
                  e.target.value = "";
                }}
              />
            </div>
          )}

          <div className="d-flex gap-2 mt-3 flex-wrap">
            {supported ? (
              <>
                <button type="button" className="btn btn-primary" onClick={captureAndSubmit} disabled={starting}>
                  <i className="bi bi-camera me-2"></i>
                  {starting ? "Membuka kamera..." : "Capture & Simpan"}
                </button>

                <button type="button" className="btn btn-outline-secondary" onClick={start}>
                  Restart
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={async () => {
                    await stop();
                    setSupported(false);
                    setError("Mode kamera dimatikan. Gunakan Upload sebagai fallback.");
                  }}
                >
                  Stop
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-outline-primary" onClick={start}>
                Coba Buka Kamera Lagi
              </button>
            )}
          </div>

          <div className="mt-2" style={{ fontSize: 12, opacity: 0.7 }}></div>
        </div>
      </div>
    </div>
  );
}

export default function Landingsec() {
  const SITE = getSiteConfig();
  const username = SITE.username;
  const ttc = SITE.ttc;
  const apiHost = API_HOST;

  useEffect(() => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("ttc", ttc);
    sessionStorage.setItem("host", apiHost);
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
  const [selectedTamu, setSelectedTamu] = useState({});

  const [cam, setCam] = useState({ open: false, id: null, type: "in" });

  const listURL = useMemo(() => `${apiHost}/api/${ttc}/visitor/waiting`, [apiHost, ttc]);
  const updateURL = useMemo(
    () => (id) => `${apiHost}/api/${ttc}/visitor/visitors/${id}/update-status`,
    [apiHost, ttc]
  );

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
      throw new Error(`Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`);
    }
    return res.json();
  };

  const fetchTamu = async () => {
    setLoading(true);
    try {
      const res = await fetch(listURL, { credentials: "include" });
      const json = await safeReadJson(res);

      if (json.success) {
        setTamu(json.data || []);
      } else {
        showToast(json.message || "Gagal ambil data", "error");
        setTamu([]);
      }
    } catch (err) {
      console.error("fetchTamu error:", err);
      showToast("API error / route tidak ada / bukan JSON", "error");
      setTamu([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTamu();
  }, [listURL]);

  const handleApproveClick = (id) => {
    setUploading((prev) => ({ ...prev, [id]: "in" }));
    setCam({ open: true, id, type: "in" });
  };

  const handleKeluarClick = (id) => {
    setUploading((prev) => ({ ...prev, [id]: "out" }));
    setCam({ open: true, id, type: "out" });
  };

  const handleUploadFoto = async (file, id, type) => {
    if (!file) return;

    const formData = new FormData();
    if (type === "in") formData.append("dokumentasi_in", file);
    if (type === "out") formData.append("dokumentasi_out", file);
    formData.append("status", type === "in" ? "approved" : "selesai");

    try {
      const res = await fetch(updateURL(id), {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: { userid: String(userID) },
      });

      const json = await safeReadJson(res);

      if (!json.success) {
        showToast("Gagal update status: " + (json.message || "unknown"), "error");
        return;
      }

      const savedName = pickSavedFilename(json, type) || file.name;

      if (type === "in") {
        setTamu((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "approved", dokumentasi_in: savedName } : t))
        );
        setUploading((prev) => ({ ...prev, [id]: false }));
        showToast("Tamu Berhasil Approved", "success");
      }

      if (type === "out") {
        setTamu((prev) => prev.map((t) => (t.id === id ? { ...t, status: "selesai", dokumentasi_out: savedName } : t)));
        setTamu((prev) => prev.filter((t) => t.id !== id));
        setUploading((prev) => ({ ...prev, [id]: false }));
        showToast("Tamu Out", "success");
      }

      await fetchTamu();
    } catch (err) {
      console.error("Error upload foto:", err);
      showToast("Upload gagal, cek koneksi atau server API!", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(updateURL(id), {
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
        showToast(json.message || "Gagal reject", "error");
      }
    } catch (err) {
      console.error("Error reject:", err);
      showToast("Error reject", "error");
    }
  };

  const openInfo = (t) => {
    const fotoMasuk = t?.dokumentasi_in ? `${apiHost}/storage/visitors/${t.dokumentasi_in}` : "-";
    const fotoKeluar = t?.dokumentasi_out ? `${apiHost}/storage/visitors/${t.dokumentasi_out}` : "-";
    const tandaTangan = t?.signature ? `${apiHost}/storage/signatures/${t.signature}` : "-";

    setSelectedTamu({
      Nama: t?.name,
      Perusahaan: t?.company,
      Telepon: t?.phone,
      "Jenis ID": t?.id_type,
      "No ID": t?.id_number,
      Aktivitas: t?.activity,
      "Ruang Kerja": t?.ruang_kerja,
      "No VISIT / E-SIK": t?.visit_id,
      Status: t?.status,
      "Tanda Tangan": tandaTangan,
      "Foto Masuk": fotoMasuk,
      "Foto Keluar": fotoKeluar,
      "Dibuat Pada": t?.created_at,
      "Diperbarui Pada": t?.updated_at,
    });

    setShowPopup(true);
  };

  const pendingCount = tamu.filter((t) => t.status === "pending").length;
  const approvedCount = tamu.filter((t) => t.status === "approved").length;

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="d-flex align-items-center mb-3">
          <h3 className="security-title mb-3" style={{ textAlign: "center", width: "100%" }}>
            {" "}
            Approval Tamu{" "}
          </h3>
        </div>

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
        </section>

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
                  <td>{new Date(t.created_at).toLocaleDateString("id-ID", { weekday: "long" })}</td>
                  <td>{new Date(t.created_at).toLocaleDateString("id-ID")}</td>
                  <td>{t.name}</td>
                  <td>{t.company}</td>
                  <td>{t.phone}</td>
                  <td>{t.activity}</td>
                  <td>{new Date(t.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{t.ruang_kerja}</td>
                  <td>{t.visit_id}</td>
                  <td>{t.status}</td>

                  <td>
                    <button className="btn btn-outline-info btn-sm" onClick={() => openInfo(t)} title="Lihat detail">
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </td>

                  <td>
                    {t.status === "pending" && (
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-success btn-sm d-flex align-items-center"
                          onClick={() => handleApproveClick(t.id)}
                          title="Approve (langsung buka kamera foto masuk)"
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

                    {t.status === "approved" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleKeluarClick(t.id)}
                        title="Tamu Keluar (langsung buka kamera foto keluar)"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    )}

                    {t.status === "selesai" && <span style={{ fontSize: 12, opacity: 0.7 }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <InfoTamu open={showPopup} onClose={() => setShowPopup(false)} data={selectedTamu} />

      <CameraModal
        open={cam.open}
        onClose={() => {
          if (cam.id != null) setUploading((prev) => ({ ...prev, [cam.id]: false }));
          setCam({ open: false, id: null, type: "in" });
        }}
        title={cam.type === "in" ? "Foto Masuk (Approve)" : "Foto Keluar (Selesai)"}
        facingMode="environment"
        onSubmitFile={async (file) => {
          if (!cam.id) return;
          await handleUploadFoto(file, cam.id, cam.type);
        }}
      />
    </div>
  );
}