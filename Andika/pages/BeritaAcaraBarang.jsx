import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import SignatureCanvas from "react-signature-canvas";

export default function BeritaAcaraBarang() {

//   const host = 'http://192.168.1.10';
//  const host = 'http://localhost'

  // ====== Inject Minimalist CSS ======
  useEffect(() => {
    const css = `
/* ===== ROOT ===== */
:root {
  --bg: #ef2b1a;
  --border: #ef2b1a;
  --shadow: 0 6px 18px rgba(11,22,38,0.06);
  --text: #111827;
  --primary: #ef2b1a;
  --danger: #ef4444;
}

/* ===== RESET ===== */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  font-family: Inter, system-ui, Arial;
  background: #ef2d1f;
}

/* ===== PAGE ===== */
.page {
  min-height: 100vh;
  background: #ff2b2b;
  padding: 16px;
  display: flex;
  justify-content: center;
}

/* ===== CARD ===== */
.wrapper {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 18px;
  padding: clamp(16px, 4vw, 26px);
  box-shadow: 0 12px 28px rgba(0,0,0,.15);
}

/* ===== TITLE ===== */
.wrapper h1 {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 18px;
}

/* ===== FORM ===== */
.form-group {
  margin-bottom: 14px;
}

label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #111;
}

input, select, textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
}

textarea {
  resize: none;
  min-height: 70px;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #f97316;
  outline: none;
}

/* ===== ADD BARANG GRID ===== */
.add-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

@media (min-width: 480px) {
  .add-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

/* ===== BUTTON ===== */
.btn-tambah {
  width: 100%;
  margin-top: 10px;
  height: 44px;
  border-radius: 12px;
  font-weight: 700;
  background: var(--primary);
  color: #ff0808;
  border: none;
}
  .btn-hapus {
  table-layout: fixed;
  overflow-wrap: break-word;
  background: var(--danger);
  }

/* ===== TABLE (DESKTOP ONLY) ===== */
.table-wrapper {
  display: none;
}

@media (min-width: 768px) {
  .table-wrapper {
    display: block;
    overflow-x: auto;
  }

  .mobile-list {
    display: none;
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  text-align: center;
  vertical-align: middle;
  padding: 12px 18px;
  font-size: 13px;
  white-space: nowrap;
}

td {
  padding: 10px 12px;
  table-layout: fixed;
  word-wrap: break-word;
  font-size: 14px;
  text-align: center;
}

/* ===== MOBILE CARD ITEM ===== */
.item-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
  font-size: 14px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.item-label {
  color: #6b7280;
  font-size: 12px;
}

/* ===== SIGNATURE ===== */
.sig-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;   /* ⬅️ KUNCI TENGAH */
  margin-bottom: 20px;
}

.sig-canvas {
  border: 1px dashed #999;
  width: 320px;
  height: 140px;
  background: #fff;
  touch-action: none;
}

.sig-preview {
  display: flex;
  justify-content: center; /* ⬅️ KUNCI TENGAH */
  margin-top: 8px;
}

.sig-preview img {
  max-height: 70px;
}

.sig-clear {
  background: #ff2c2c;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

/* ===== RESPONSIVE SMALL ===== */
@media (max-width: 360px) {
  .wrapper {
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 8px 18px rgba(0,0,0,0.12);
  }

  h1 {
    font-size: 16px;
  }
}

    `;


    const style = document.createElement("style");
    style.id = "ba-style";
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
useEffect(() => {
  
  const getNomorOtomatis = async () => {
    try {
      const res = await fetch(
        `http://localhost/BA_barang_in-out/api/get_next_nomor_ba.php`
      );

      const data = await res.json();

      if (data.status === "success") {
        setForm((p) => ({
          ...p,
          nomor: data.nomor, 
        }));
      } else {
        console.error("Gagal ambil nomor:", data.message);
      }
    } catch (err) {
      console.error("Gagal mengambil nomor BA:", err);
    }
  };

  getNomorOtomatis();
}, []);

  // ====== STATE ======
  const [form, setForm] = useState({
    nomor: "",
    tanggal: "",
    jenis: "MASUK",
    keterangan: "",
    pihakA: { nama: "", jabatan: "" },
    pihakB: { nama: "", jabatan: "" }
  });

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ nama: "", jumlah: "", tipe: "", sn: "" });

  // ====== SIGNATURE ======
const sigPenyerah = useRef(null);
const sigPenerima = useRef(null);
const sigMengetahui = useRef(null);

const [ttdPenyerah, setTtdPenyerah] = useState("");
const [ttdPenerima, setTtdPenerima] = useState("");
const [ttdMengetahui, setTtdMengetahui] = useState("");

const [penyerah, setPenyerah] = useState({ nama: "", asal: "" });
const [penerima, setPenerima] = useState({ nama: "", asal: "" });
const [mengetahui, setMengetahui] = useState({
  nama: "Djefli Dalita",
  asal: "Building Manager"
});

  // ====== Controlled Input ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [pihak, key] = name.split(".");
      setForm((p) => ({ ...p, [pihak]: { ...p[pihak], [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleNewItem = (e) => {
    const { name, value } = e.target;
    setNewItem((p) => ({ ...p, [name]: value }));
  };

  const addItem = () => {
    if (!newItem.nama || !newItem.jumlah) {
      Swal.fire("Lengkapi data!", "Nama & Jumlah wajib diisi", "warning");
      return;
    }
    setItems((p) => [...p, newItem]);
    setNewItem({ nama: "", jumlah: "", tipe: "", sn: "" });
    
  };



  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));

  const getHari = (tanggal) => {
    if (!tanggal) return "";
    const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    return hari[new Date(tanggal).getDay()];
  };


  const buildPDFContent = () => `
    <div style="font-family:Inter; color:#111;">
      <div style="display:flex; justify-content:space-between;">
        <img src="/logo.png" style="height:50px;" />
        <img src="/Logo Kanan.png" style="height:50px;" />
      </div>

      <h2 style="text-align:center; text-decoration:underline;">BERITA ACARA ${form.jenis}</h2>

            <p style="font-size:14px; text-align:center;">
              Pada Hari <b>${getHari(form.tanggal)}</b>, tanggal <b>${form.tanggal}</b>.<br>
              Dari <b>${penyerah.asal}</b> kepada <b>${penerima.asal}</b>.<br>
              Telah dilakukan serah terima barang berikut:
            </p>

      <table style="width:100%; border-collapse:collapse; margin-top:12px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="border:1px solid #ddd;">No</th>
            <th style="border:1px solid #ddd;">Nama Barang</th>
            <th style="border:1px solid #ddd;">Jumlah</th>
            <th style="border:1px solid #ddd;">Tipe</th>
            <th style="border:1px solid #ddd;">S/N</th>
          </tr>
        </thead>
        <tbody>
          ${
            items.length === 0
            ? `<tr><td colspan="5" style="text-align:center;">Tidak ada barang</td></tr>`
            : items.map((it, i) => `
              <tr>
                <td style="border:1px solid #ddd;">${i + 1}</td>
                <td style="border:1px solid #ddd;">${it.nama}</td>
                <td style="border:1px solid #ddd;">${it.jumlah}</td>
                <td style="border:1px solid #ddd;">${it.tipe}</td>
                <td style="border:1px solid #ddd;">${it.sn}</td>
              </tr>
            `).join("")
          }
        </tbody>
      </table>
      <p style="font-size:14px; text-align:Left;">Demikian Berita Acara Serah Terima Barang Ini Dibuat Dengan Sebenar - Benarnya: </p>
<div style="display:flex; justify-content:space-around; margin-top:30px;">
  <div style="text-align:center; width:30%;">
    <b>Yang Menyerahkan</b><br><br>
  <div style="display:flex; justify-content:center;">
    <img src="${ttdPenyerah}" height="70" />
  </div>
    <u>${penyerah.nama}</u><br>${penyerah.asal}
  </div>

  <div style="text-align:center; width:30%;">
    <b>Yang Menerima</b><br><br>
    <img src="${ttdPenerima}" height="70"/><br>
    <u>${penerima.nama}</u><br>${penerima.asal}
  </div>
</div>

<div style="display:flex; justify-content:center; margin-top:30px;">
  <div style="text-align:center; width:30%;">
    <b>Mengetahui</b><br><br>
    <img src="${ttdMengetahui}" height="70"/><br>
    <u>Djefli Dalita</u><br>Building Manager
  </div>
</div>

  `;

  // ====== SweetAlert Preview  ======
const previewPDF = async () => {
  const html = buildPDFContent();
  const container = document.createElement("div");
  container.innerHTML = html; 

  Swal.fire({
    title: "Preview Dokumen",
    width: "950px",
    html: container,
    confirmButtonText: "Export PDF",
    showCancelButton: true,
    preConfirm: () => exportPDF()
  });
};


 const exportPDF = async () => {
  try {
if (!ttdPenyerah || !ttdPenerima || !ttdMengetahui) {
  Swal.fire("TTD belum lengkap", "Semua pihak wajib tanda tangan", "warning");
  return;
        }

              const payloadHeader = {
                ...form,

                pihakA: {
                  nama: penyerah.nama,
                  jabatan: penyerah.asal,
                },

                pihakB: {
                  nama: penerima.nama,
                  jabatan: penerima.asal,
                },

                ttd_penyerah: ttdPenyerah,
                ttd_penerima: ttdPenerima,
                ttd_mengetahui: ttdMengetahui,
              };
       


    const saveBerita = await fetch(
      "http://localhost/BA_barang_in-out/api/save_berita.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadHeader)
      }
    );

    const resBerita = await saveBerita.json();

    if (resBerita.status !== "success") {
      Swal.fire("Gagal", resBerita.message, "error");
      return;
    }

    const id_berita = resBerita.id_berita; // 

    const payloadBarang = {
      id_berita: id_berita,
      nomor: form.nomor,
      barang: items
    };

    const saveBarang = await fetch(
      "http://localhost/BA_barang_in-out/api/save_barang.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBarang)
      }
    );

    const resBarang = await saveBarang.json();

    if (resBarang.status !== "success") {
      Swal.fire("Gagal", resBarang.message, "error");
      return;
    }

    //   GENERATE PDF
    const area = document.createElement("div");
    area.style.width = "210mm";
    area.style.padding = "20px";
    area.innerHTML = buildPDFContent();
    document.body.appendChild(area);
    const canvas = await html2canvas(area, { scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");

    const img = canvas.toDataURL("image/png");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Berita_Acara_${form.nomor || "Dokumen"}.pdf`);

    area.remove();

    Swal.fire("Berhasil", "Berita acara & barang berhasil disimpan + PDF jadi", "success");

  } catch (err) {
    console.error("ERROR EXPORT:", err);
    Swal.fire("Error", "Gagal menyimpan data & PDF", "error");
  }
};




  // ====== RENDER UI ======
  
  return (
    <div className="page">
    <div className="wrapper">
      <h1 className="wrapper h1">BERITA ACARA BARANG</h1>
    

      {/* FORM UTAMA */}
      <div className="form-group">
        <label className="form-label">
          <span>Nomor Berita Acara</span>
        </label>
        <input
          name="nomor"
          value={form.nomor}
          readOnly
          style={{ width:180, background:"#f3f4f6", cursor:"not-allowed" }}
        />
        <div className="form-group"></div>
         <label className="form-label">
          <span>Tanggal</span>
          </label>
            <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
          />
          <div className="form-group"></div>
         <label className="form-label">
          <span>Jenis</span>
          </label>
        <select name="jenis" value={form.jenis} onChange={handleChange}>
          <option value="MASUK">MASUK</option>
          <option value="KELUAR">KELUAR</option>
        </select>
      </div>

      <div className="form-group">
          <label className="form-label">
          <span>Keterangan</span>
          </label>
        <textarea name="keterangan" value={form.keterangan} onChange={handleChange} style={{ width:200 }} />
      </div>

      {/* BARANG */}
      <h2 className="section-title">
    <label className="form-label">
          <span>Tambah Barang</span>
          </label>
      </h2>

      <div className="row">
        <input name="nama" placeholder="Nama Barang" value={newItem.nama} onChange={handleNewItem} style={{ flex:2 }} />
       <input
            name="jumlah"
            placeholder="Jumlah"
            type="text"
            value={newItem.jumlah}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
              setNewItem((prev) => ({ ...prev, jumlah: onlyNumber }));
            }}
            style={{ width: 120 }}
          />
        <input name="tipe" placeholder="Tipe" value={newItem.tipe} onChange={handleNewItem} style={{ flex:1 }} />
        <input name="sn" placeholder="S/N" value={newItem.sn} onChange={handleNewItem} style={{ flex:1 }} />
        <button 
                type="button"
                className="tambahitem"
                onClick={addItem}

                >Tambah</button>
      </div>
      
      {/* TABLE BARANG */}
      
      <div className="table-wrapper">
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th><th>Nama</th><th>Jumlah</th><th>Tipe</th><th>S/N</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan="5" style={{textAlign:"center"}}>Belum ada barang</td></tr>
          ) : items.map((it, i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{it.nama}</td>
              <td>{it.jumlah}</td>
              <td>{it.tipe}</td>
              <td>{it.sn}</td>
              <td><button className=".btn-hapus" onClick={() => removeItem(i)}>Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>

{/* TTD PENYERAH */}
<span className="form-grup"><b>Tanda Tangan Penyerah</b></span>

<div className="sig-form">
  <input
    placeholder="Nama"
    value={penyerah.nama}
    onChange={(e) =>
      setPenyerah({ ...penyerah, nama: e.target.value })
    }
  />
  <input
    placeholder="Asal / Jabatan"
    value={penyerah.asal}
    onChange={(e) =>
      setPenyerah({ ...penyerah, asal: e.target.value })
    }
  />
</div>

<div className="sig-wrapper">
    <SignatureCanvas
      ref={sigPenyerah}
      penColor="black"
      canvasProps={{
        width: 320,      
        height: 140,     
        className: "sig-canvas"
      }}
      onEnd={() => {
        setTtdPenyerah(sigPenyerah.current.toDataURL("image/png"));
      }}
    />
  <button
    type="button"
    className="sig-clear"
    onClick={() => {
      sigPenyerah.current.clear();
      setTtdPenyerah("");
    }}
  >
    Hapus
  </button>
</div>

{/* TTD PENERIMA */}
<span className="form-grup"><b>Tanda Tangan Penerima</b></span>

<div className="sig-form">
  <input
    placeholder="Nama"
    value={penerima.nama}
    onChange={(e) =>
      setPenerima({ ...penerima, nama: e.target.value })
    }
  />
  <input
    placeholder="Asal / Jabatan"
    value={penerima.asal}
    onChange={(e) =>
      setPenerima({ ...penerima, asal: e.target.value })
    }
  />
</div>

<div className="sig-wrapper">
  <SignatureCanvas
    ref={sigPenerima}
    penColor="black"
      canvasProps={{
        width: 320,      
        height: 140,     
        className: "sig-canvas"
      }}
    onEnd={() =>
      setTtdPenerima(sigPenerima.current.toDataURL())
    }
  />

  <button
    type="button"
    className="sig-clear"
    onClick={() => {
      sigPenerima.current.clear();
      setTtdPenerima("");
    }}
  >
    Hapus
  </button>
</div>

{/* TTD MENGETAHUI */}
<span className="form-grup"><b>Tanda Tangan Mengetahui</b></span>

<div className="sig-form">
  <input
    placeholder="Nama"
    value={mengetahui.nama}
    onChange={(e) =>
      setMengetahui({ ...mengetahui, nama: e.target.value })
    }
  />
  <input
    placeholder="Asal / Jabatan"
    value={mengetahui.asal}
    onChange={(e) =>
      setMengetahui({ ...mengetahui, asal: e.target.value })
    }
  />
</div>

<div className="sig-wrapper">
  <SignatureCanvas
    ref={sigMengetahui}
    penColor="black"
      canvasProps={{
        width: 320,      
        height: 140,     
        className: "sig-canvas"
      }}
    onEnd={() =>
      setTtdMengetahui(sigMengetahui.current.toDataURL())
    }
  />

  <button
    type="button"
    className="sig-clear"
    onClick={() => {
      sigMengetahui.current.clear();
      setTtdMengetahui("");
    }}
  >
    Hapus
  </button>
</div>

      {/* PREVIEW PDF */}
      <div style={{ marginTop:25 }}>
        <button className="btn btn-primary" onClick={previewPDF}>
          Preview & Export PDF
        </button>
      </div>
    </div>
    </div>
  );
}
