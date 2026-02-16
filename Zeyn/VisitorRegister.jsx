import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./VisitorRegister.css";

const SITES = {
  paniki: { label: "TTC Paniki", ttc: "ttc_paniki", host: "127.0.0.1:8000" },
  teling: { label: "TTC Teling", ttc: "ttc_teling", host: "127.0.0.1:8000" },
};

const INITIAL_FORM = {
  name: "",
  company: "",
  phone: "",
  idType: "KTP",
  idNumber: "",
  visitId: "",
  activity: "",
  workspace: "",
};

export default function VisitorRegister() {
  const navigate = useNavigate(); // masih boleh dipakai kalau nanti mau navigate
  const canvasRef = useRef(null);
  const nameInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [siteKey, setSiteKey] = useState(() => sessionStorage.getItem("siteKey") || "");
  const [formData, setFormData] = useState(INITIAL_FORM);

  // notif di halaman
  const [notice, setNotice] = useState({ type: "", text: "" }); // type: "success" | "error" | ""

  useEffect(() => {
    if (!siteKey) return;
    sessionStorage.setItem("siteKey", siteKey);
    sessionStorage.setItem("host", SITES[siteKey].host);
    sessionStorage.setItem("ttc", SITES[siteKey].ttc);
  }, [siteKey]);

  const host = siteKey ? SITES[siteKey].host : "";
  const ttc = siteKey ? SITES[siteKey].ttc : "";

  const endpoint = useMemo(() => {
    if (!host || !ttc) return "";
    return `http://${host}/api/${ttc}/visitor/registry`;
  }, [host, ttc]);

  // init canvas saat step 2
  useEffect(() => {
    if (step !== 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    // fokus ke input nama saat masuk step 2
    setTimeout(() => nameInputRef.current?.focus(), 0);
  }, [step]);

  const handleChange = (e) => {
    setNotice({ type: "", text: "" }); // bersihkan notif saat user mengetik
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const getPointerPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPointerPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    e && e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    clearSignature();
    // fokus balik ke nama biar cepat input berikutnya
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const goNext = () => {
    if (!siteKey) {
      setNotice({ type: "error", text: "Pilih lokasi dulu (Teling / Paniki)." });
      return;
    }
    setNotice({ type: "", text: "" });
    setStep(2);
  };

  const goBack = () => {
    setNotice({ type: "", text: "" });
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ type: "", text: "" });

    if (!endpoint) {
      setNotice({ type: "error", text: "Lokasi belum dipilih." });
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    const signatureData = canvasRef.current?.toDataURL("image/png") || "";
    const payload = { ...formData, signature: signatureData };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotice({ type: "error", text: `Gagal: ${data.message || "Server error"}` });
        console.error("Server response error:", data);
        return;
      }

      // ✅ SUKSES: tampil notif + reset form
      setNotice({ type: "success", text: "Data berhasil disimpan. Silakan isi data tamu berikutnya." });
      resetForm();

      // ❌ tidak navigate ke /guest agar bisa input berikutnya
      // navigate("/guest", { state: { visitor: data.data } });

    } catch (err) {
      console.error("Fetch error:", err);
      setNotice({ type: "error", text: "Gagal mengirim data, cek koneksi atau server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="visitor-register">
      <div className="register-card">
        <h2 className="register-title">Form Registrasi Tamu</h2>

        {/* NOTIF */}
        {notice.text && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              background: notice.type === "success" ? "rgba(25,135,84,0.12)" : "rgba(220,53,69,0.12)",
            }}
          >
            <i className={`bi ${notice.type === "success" ? "bi-check-circle" : "bi-exclamation-triangle"} me-2`}></i>
            {notice.text}
          </div>
        )}

        {/* ===== STEP 1: PILIH SITE ===== */}
        {step === 1 && (
          <div className="register-form">
            <div className="form-group">
              <label>
                <i className="bi bi-geo-alt"></i> Pilih Lokasi
              </label>
              <select value={siteKey} onChange={(e) => setSiteKey(e.target.value)} required>
                <option value="">-- Pilih Lokasi --</option>
                {Object.entries(SITES).map(([key, v]) => (
                  <option key={key} value={key}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="btn-register" onClick={goNext}>
              Lanjut Isi Form <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        )}

        {/* ===== STEP 2: FORM INPUT ===== */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button type="button" className="clear-btn" onClick={goBack} disabled={isSubmitting}>
                <i className="bi bi-arrow-left"></i> Ganti Lokasi
              </button>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                Lokasi: <b>{SITES[siteKey].label}</b>
              </div>

              {/* tombol reset manual */}
              <div style={{ marginLeft: "auto" }}>
                <button type="button" className="clear-btn" onClick={resetForm} disabled={isSubmitting}>
                  <i className="bi bi-arrow-counterclockwise"></i> Reset Form
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-person-fill"></i> Nama Lengkap
              </label>
              <input
                ref={nameInputRef}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-building"></i> Perusahaan
              </label>
              <input name="company" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-telephone"></i> Nomor Telepon
              </label>
              <input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-card-text"></i> Jenis ID
              </label>
              <select name="idType" value={formData.idType} onChange={handleChange}>
                <option value="KTP">KTP</option>
                <option value="SIM">SIM</option>
                <option value="Passport">Passport</option>
                <option value="Kartu Pegawai">Kartu Pegawai</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-hash"></i> Nomor ID
              </label>
              <input name="idNumber" value={formData.idNumber} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-key"></i> No. VISIT/ESIK
              </label>
              <input name="visitId" value={formData.visitId} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-pencil-square"></i> Aktivitas
              </label>
              <textarea name="activity" value={formData.activity} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-grid-1x2"></i> Ruang Kerja
              </label>
              <select name="workspace" value={formData.workspace} onChange={handleChange} required>
                <option value="">-- Pilih Ruang Kerja --</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Common Area">Common Area</option>
                <option value="Ruang Perangkat">Ruang Perangkat</option>
                <option value="All Area">All Area</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-brush"></i> Tanda Tangan
              </label>
              <div className="signature-container">
                <canvas
                  ref={canvasRef}
                  width={350}
                  height={150}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                />
                <button type="button" className="clear-btn" onClick={clearSignature} disabled={isSubmitting}>
                  Hapus
                </button>
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={isSubmitting}>
              <i className="bi bi-check-circle me-2"></i>
              {isSubmitting ? "Mengirim..." : "Daftar Sekarang"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
