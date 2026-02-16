import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./VisitorRegister.css";
import Swal from "sweetalert2";

export default function VisitorRegister() {
  /* ===============================
     KONFIGURASI BACKEND
  =============================== */
  sessionStorage.setItem("host", "127.0.0.1:8000");
  sessionStorage.setItem("ttc", "ttc_paniki");

  const host = sessionStorage.getItem("host");

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  /* ===============================
     STATE FORM
  =============================== */
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

  /* ===============================
     INIT CANVAS
  =============================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
  }, []);

  /* ===============================
     FORM HANDLER
  =============================== */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ===============================
     SIGNATURE DRAW
  =============================== */
  const getPointerPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
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
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  /* ===============================
     SUBMIT FORM
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const signature = canvasRef.current.toDataURL("image/png");

    // VALIDASI CLIENT SIDE
    if (!signature || signature.length < 100) {
      await Swal.fire({
        icon: "warning",
        title: "Tanda tangan wajib diisi",
        confirmButtonText: "OK",
      });
      return;
    }

    const payload = {
      ...formData,
      signature,
    };

    console.log("Payload dikirim ke API:", payload);

    try {
      const response = await fetch(`http://${host}/api/ttc_paniki/visitors/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        console.error("Error response:", data);
        await Swal.fire({
          icon: "error",
          title: "Gagal menyimpan data",
          text: data?.message || "Terjadi kesalahan",
          footer: data?.error ? `<pre style="text-align:left;white-space:pre-wrap">${data.error}</pre>` : "",
          confirmButtonText: "OK",
        });
        return;
      }

      // ✅ SUKSES: tampilkan notif dulu, baru pindah halaman
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data tamu berhasil disimpan.",
        timer: 1300,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      navigate("/guest", {
        state: {
          visitor: data.data,
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal koneksi ke server",
        text: "Cek koneksi / server API kamu.",
        confirmButtonText: "OK",
      });
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="visitor-register">
      <div className="register-card">
        <h2 className="register-title">Form Registrasi Tamu</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="bi bi-person-fill" /> Nama Lengkap
            </label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-building" /> Perusahaan
            </label>
            <input name="company" value={formData.company} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-telephone" /> Nomor Telepon
            </label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-card-text" /> Jenis ID
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
              <i className="bi bi-hash" /> Nomor ID
            </label>
            <input name="idNumber" value={formData.idNumber} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-key" /> No. VISIT / ESIK
            </label>
            <input name="visitId" value={formData.visitId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-pencil-square" /> Aktivitas
            </label>
            <textarea name="activity" value={formData.activity} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-grid-1x2" /> Ruang Kerja
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
              <i className="bi bi-brush" /> Tanda Tangan
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
              <button type="button" className="clear-btn" onClick={clearSignature}>
                Hapus
              </button>
            </div>
          </div>

          <button type="submit" className="btn-register">
            <i className="bi bi-check-circle me-2" />
            Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
