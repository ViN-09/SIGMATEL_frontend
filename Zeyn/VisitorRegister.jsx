import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./VisitorRegister.css";

export default function VisitorRegister() {
  // Set session 'azure-beaver-930369.hostingersite.com'     ----  192.168.1.22:8000;
  sessionStorage.setItem("host", '192.168.1.22:8000');
  sessionStorage.setItem("ttc", "ttc_Paniki");

  const ttc = sessionStorage.getItem("ttc");
  const host = sessionStorage.getItem("host");

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    idType: "KTP",
    idNumber: "",
    visitId: "",
    activity: "",
    workspace: "",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signatureData = canvasRef.current.toDataURL("image/png");
    const payload = { ...formData, signature: signatureData };

    try {
      const res = await fetch(
        `http://${host}/api/${ttc}/visitor/registry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(`Gagal: ${data.message || "Server error"}`);
        console.error("Server response error:", data);
        return;
      }

      // Redirect ke Guest.jsx dengan state visitor
      navigate("/guest", { state: { visitor: data.data } });

    } catch (err) {
      console.error("Fetch error:", err);
      alert("Gagal mengirim data, cek koneksi atau server");
    }
  };

  return (
    <div className="visitor-register">
      <div className="register-card">
        <h2 className="register-title">Form Registrasi Tamu</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label><i className="bi bi-person-fill"></i> Nama Lengkap</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><i className="bi bi-building"></i> Perusahaan</label>
            <input name="company" value={formData.company} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><i className="bi bi-telephone"></i> Nomor Telepon</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><i className="bi bi-card-text"></i> Jenis ID</label>
            <select name="idType" value={formData.idType} onChange={handleChange}>
              <option value="KTP">KTP</option>
              <option value="SIM">SIM</option>
              <option value="Passport">Passport</option>
              <option value="Kartu Pegawai">Kartu Pegawai</option>
            </select>
          </div>

          <div className="form-group">
            <label><i className="bi bi-hash"></i> Nomor ID</label>
            <input name="idNumber" value={formData.idNumber} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><i className="bi bi-key"></i> No. VISIT/ESIK</label>
            <input name="visitId" value={formData.visitId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><i className="bi bi-pencil-square"></i> Aktivitas</label>
            <textarea name="activity" value={formData.activity} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><i className="bi bi-grid-1x2"></i> Ruang Kerja</label>
            <select name="workspace" value={formData.workspace} onChange={handleChange} required>
              <option value="">-- Pilih Ruang Kerja --</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Common Area">Common Area</option>
              <option value="Ruang Perangkat">Ruang Perangkat</option>
              <option value="All Area">All Area</option>
            </select>
          </div>

          <div className="form-group">
            <label><i className="bi bi-brush"></i> Tanda Tangan</label>
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
              <button type="button" className="clear-btn" onClick={clearSignature}>
                Hapus
              </button>
            </div>
          </div>

          <button type="submit" className="btn-register">
            <i className="bi bi-check-circle me-2"></i> Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
