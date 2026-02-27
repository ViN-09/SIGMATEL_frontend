import React, { useState, useEffect, useRef } from "react";
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
  background: #ff2c2c;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
  .btn-hapus {
  background: #ff2c2c;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
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
  .form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #111;
}

/* ===== INPUT ===== */
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  box-sizing: border-box;
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
const [newItem, setNewItem] = useState({
  
  nama: "",
  jumlah: "",
  tipe: "",
  sn: "",
  foto: null,
  fotoPreview: "" 
})


  // ====== SIGNATURE ======
const sigPenyerah = useRef();
const sigPenerima = useRef();


const [ttdPenyerah, setTtdPenyerah] = useState("");
const [ttdPenerima, setTtdPenerima] = useState("");


const [penyerah, setPenyerah] = useState({ nama: "", asal: "" });
const [penerima, setPenerima] = useState({ nama: "", asal: "" });


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

  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));


 const saveBerita = async () => {
  if (!form.tanggal) {
    Swal.fire("Gagal", "Tanggal wajib diisi", "warning");
    return;
  }

if (form.jenis === "MASUK" && !ttdPenerima) {
  Swal.fire("TTD belum lengkap", "TTD Penerima wajib diisi", "warning");
  return;
}

if (form.jenis === "KELUAR" && !ttdPenyerah) {
  Swal.fire("TTD belum lengkap", "TTD Penyerah wajib diisi", "warning");
  return;
}

  try {
    // 1️⃣ Simpan header
    const resHeader = await fetch("http://localhost/BA_barang_in-out/api/save_berita.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomor: form.nomor,
        tanggal: form.tanggal,
        jenis: form.jenis,
        keterangan: form.keterangan,
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
      })
    }).then(r => r.json());

    if (resHeader.status !== "success") {
      Swal.fire("Gagal", resHeader.message, "error");
      return;
    }

    // 2️⃣ Simpan barang + foto
    const barangFinal = [];

    for (const b of items) {
      let fotoPath = "";

      if (b.foto) {
        const up = await uploadFoto(b.foto);
        fotoPath = up.path;
      }

      barangFinal.push({
        nama: b.nama,
        jumlah: b.jumlah,
        tipe: b.tipe,
        sn: b.sn,
        foto: fotoPath
      });
    }

    await fetch("http://localhost/BA_barang_in-out/api/save_barang.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_berita: resHeader.id_berita,
        nomor: form.nomor,
        barang: barangFinal
      })
    });

    Swal.fire("Berhasil", "Data berhasil disimpan", "success");
    resetForm();

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Terjadi kesalahan server", "error");
  }
};
      const resetForm = () => {
        setForm({
          nomor: "",
          tanggal: "",
          jenis: "MASUK",
          keterangan: "",
          pihakA: { nama: "", jabatan: "" },
          pihakB: { nama: "", jabatan: "" }
        });

        setItems([]);
        setTtdPenyerah("");
        setTtdPenerima("");


        sigPenyerah.current?.clear();
        sigPenerima.current?.clear();

      };


const uploadFoto = async (file) => {
  const fd = new FormData();
  fd.append("foto", file);

  const res = await fetch("http://localhost/BA_barang_in-out/api/upload_foto_barang.php", {
    method: "POST",
    body: fd
  });

  return res.json();
};
const [editIndex, setEditIndex] = useState(null);
const addItem = () => {
  if (!newItem.nama || !newItem.jumlah) {
    Swal.fire("Gagal", "Data barang belum lengkap", "warning");
    return;
  }

  if (editIndex !== null) {
    // MODE EDIT
    const updated = [...items];
    updated[editIndex] = newItem;
    setItems(updated);
    setEditIndex(null);
  } else {
    // MODE TAMBAH
    setItems(prev => [...prev, newItem]);
  }

  // reset form
  setNewItem({
    nama: "",
    jumlah: "",
    tipe: "",
    sn: "",
    foto: null,
    fotoPreview: ""
  });
};



  // ====== RENDER UI ======
  
  return (
    <div className="page">
    <div className="wrapper">
      <h1 className="wrapper h1">BERITA ACARA BARANG</h1>
    

      {/* FORM UTAMA */}
      <div className="form-group">
        <label className="form-label"/>
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
        <b className="form-group">Tambah Barang</b>

        <div className="form-group">
          <label>Nama Barang</label>
          <input
            type="text"
            name="nama"
            value={newItem.nama}
            onChange={handleNewItem}
          />
        </div>

        <div className="form-group">
          <label>Jumlah</label>
          <input
            type="number"
            name="jumlah"
            value={newItem.jumlah}
            onChange={handleNewItem}
          />
        </div>

        <div className="form-group">
          <label>Tipe</label>
          <input
            type="text"
            name="tipe"
            value={newItem.tipe}
            onChange={handleNewItem}
          />
        </div>
          <div className="form-group">
            <label>Foto Barang</label>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setNewItem(p => ({
                  ...p,
                  foto: file,
                  fotoPreview: URL.createObjectURL(file)
                }));
              }}
            />

            {newItem.fotoPreview && (
              <img
                src={newItem.fotoPreview}
                alt="preview"
                style={{
                  marginTop: 8,
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8
                }}
              />
            )}
          </div>

        <div className="form-group">
          <label>S/N</label>
          <input
            type="text"
            name="sn"
            value={newItem.sn}
            onChange={handleNewItem}
          />
        </div>

        <button
          type="button"
          className="btn-tambah"
          onClick={addItem}
        >
          Tambah
        </button>
      
      {/* TABLE BARANG */}
      
      <div className="table-wrapper">
      </div>
      <table>
       <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Jumlah</th>
          <th>Tipe</th>
          <th>S/N</th>
          <th>Foto</th>
          <th>Aksi</th>
        </tr>
      </thead>
<tbody>
  {items.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        Belum ada barang
      </td>
    </tr>
  ) : (
    items.map((it, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{it.nama}</td>
        <td>{it.jumlah}</td>
        <td>{it.tipe}</td>
        <td>{it.sn}</td>

        {/* FOTO */}
          <td>
            {it.foto ? (
              <img
                src={URL.createObjectURL(it.foto)}
                alt="foto barang"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 6
                }}
              />
            ) : (
              "-"
            )}
          </td>

        {/* AKSI */}
        <td>
          <button
            className="btn-hapus"
            onClick={() => removeItem(i)}
          >
            Hapus
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>

{form.jenis === "KELUAR" && (
  <>
    <span><b>Tanda Tangan Penyerah</b></span>

    <div className="sig-form">
      <input
        placeholder="Nama"
        value={penyerah.nama}
        onChange={(e)=>setPenyerah({...penyerah,nama:e.target.value})}
      />
      <input
        placeholder="Jabatan"
        value={penyerah.asal}
        onChange={(e)=>setPenyerah({...penyerah,asal:e.target.value})}
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
        onEnd={()=>setTtdPenyerah(sigPenyerah.current.toDataURL())}
      />
    </div>
  </>
)}

{form.jenis === "KELUAR" && (
  <>
    <span><b>Tanda Tangan Penyerah</b></span>

    <div className="sig-form">
      <input
        placeholder="Nama"
        value={penyerah.nama}
        onChange={(e)=>setPenyerah({...penyerah,nama:e.target.value})}
      />
      <input
        placeholder="Jabatan"
        value={penyerah.asal}
        onChange={(e)=>setPenyerah({...penyerah,asal:e.target.value})}
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
        onEnd={()=>setTtdPenyerah(sigPenyerah.current.toDataURL())}
      />
    </div>
  </>
)}

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
    setTtdPenerima(sigPenerima.current.toDataURL("image/png"))
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


      {/* PREVIEW PDF */}
      <div className="d-grid gap-2 col-6 mx-auto">
      <button className="btn btn-primary" onClick={saveBerita}>
        Simpan
      </button>
      </div>
    </div>
    </div>
  );
}
