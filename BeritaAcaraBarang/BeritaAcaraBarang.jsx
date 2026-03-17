import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import SignatureCanvas from "react-signature-canvas";
import { HOST } from "../auth";
import "./formBA.css";
import TambahBarangModal from "./TambahBarangModal";
import ListBarangModal from "./ListBarangModal";

// ====== CONSTANTS & CONFIG ======
const API_ENDPOINT = `${HOST}/api/ttc_teling/ba_barang/store`;

const INITIAL_FORM = {
  tanggal: "",
  jenis: "MASUK",
  keterangan: "",
  nama_tamu: "",
  asal_tamu: ""
  // TTD DIHAPUS DARI SINI!
};

const INITIAL_ITEM = {
  nama: "",
  jumlah: "",
  tipe: "",
  sn: "",
  foto: null,
  previewUrl: ""
};

export default function BeritaAcaraBarang() {
  // ====== STATE ======
  const [form, setForm] = useState(INITIAL_FORM);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState(INITIAL_ITEM);
  const [editIndex, setEditIndex] = useState(null);

  // Modal states
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  // Signature ref
  const sigTamu = useRef();

  // ====== HANDLERS ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 5MB sesuai backend)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Ukuran file maksimal 5MB", "error");
      return;
    }

    // Validasi tipe file
    if (!file.type.match('image.*')) {
      Swal.fire("Error", "File harus berupa gambar", "error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setNewItem(prev => ({
      ...prev,
      foto: file,
      previewUrl: previewUrl
    }));
  };

  const addItem = () => {
    if (!newItem.nama || !newItem.jumlah) {
      Swal.fire("Gagal", "Nama dan jumlah barang wajib diisi", "warning");
      return;
    }

    const itemToAdd = {
      id: Date.now(),
      nama: newItem.nama,
      jumlah: newItem.jumlah,
      tipe: newItem.tipe || "",
      sn: newItem.sn || "",
      foto: newItem.foto,
      previewUrl: newItem.previewUrl
    };

    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = itemToAdd;
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      setItems(prev => [...prev, itemToAdd]);
    }

    setNewItem(INITIAL_ITEM);
    setShowTambahModal(false);
  };

  const removeItem = (index) => {
    const item = items[index];

    Swal.fire({
      title: 'Hapus Barang?',
      text: `Yakin ingin menghapus ${item.nama}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(prev => prev.filter((_, idx) => idx !== index));
        Swal.fire('Terhapus!', 'Barang berhasil dihapus.', 'success');
      }
    });
  };

  const editItem = (index) => {
    const itemToEdit = items[index];
    setNewItem(itemToEdit);
    setEditIndex(index);
    setShowTambahModal(true);
    setShowListModal(false);
  };

  const clearSignature = () => {
    if (sigTamu.current) {
      sigTamu.current.clear();
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setItems([]);
    if (sigTamu.current) {
      sigTamu.current.clear();
    }
  };

  const saveBerita = async () => {
    // Validation
    if (!form.tanggal) {
      Swal.fire("Gagal", "Tanggal wajib diisi", "warning");
      return;
    }

    if (!form.nama_tamu) {
      Swal.fire("Gagal", "Nama tamu wajib diisi", "warning");
      return;
    }

    if (!form.asal_tamu) {
      Swal.fire("Gagal", "Asal tamu wajib diisi", "warning");
      return;
    }

    if (!sigTamu.current || sigTamu.current.isEmpty()) {
      Swal.fire("Gagal", "Tanda tangan tamu wajib diisi", "warning");
      return;
    }

    if (items.length === 0) {
      Swal.fire("Gagal", "Minimal satu barang harus ditambahkan", "warning");
      return;
    }

    try {
      Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // ✅ BUAT FORMDATA
      const formData = new FormData();

      // ✅ APPEND FORM FIELDS
      formData.append('tanggal', form.tanggal);
      formData.append('jenis', form.jenis);
      formData.append('keterangan', form.keterangan || '');
      formData.append('nama_tamu', form.nama_tamu);
      formData.append('asal_tamu', form.asal_tamu);

      // ✅ APPEND TTD SEBAGAI FILE
      const signatureBlob = await new Promise((resolve) => {
        sigTamu.current.getCanvas().toBlob(resolve, 'image/png');
      });
      formData.append('ttd_tamu', signatureBlob, 'signature.png');

      // ✅ APPEND BARANG SATU PER SATU (sesuai format backend)
      items.forEach((item, index) => {
        formData.append(`barang[${index}][nama]`, item.nama);
        formData.append(`barang[${index}][jumlah]`, item.jumlah);
        formData.append(`barang[${index}][tipe]`, item.tipe || '');
        formData.append(`barang[${index}][sn]`, item.sn || '');

        // ✅ APPEND FOTO BARANG
        if (item.foto) {
          formData.append(`barang[${index}][foto]`, item.foto);
        }
      });

      // ✅ SEND REQUEST
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData // TANPA CONTENT-TYPE HEADER!
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data berita acara berhasil disimpan',
          timer: 2000
        });
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: result.message || 'Terjadi kesalahan'
        });
      }

    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Terjadi kesalahan server'
      });
    }
  };

  // ====== RENDER ======
  return (
    <div className="page-form-ba">
      <div className="wrapper">
        <h1>BERITA ACARA BARANG</h1>

        {/* Form Utama */}
        <div className="form-group">
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Jenis</label>
          <select name="jenis" value={form.jenis} onChange={handleChange}>
            <option value="MASUK">MASUK</option>
            <option value="KELUAR">KELUAR</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Keterangan</label>
          <textarea
            name="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            placeholder="Masukkan keterangan (opsional)"
          />
        </div>

        {/* Data Tamu */}
        <div className="form-group">
          <label className="form-label">Nama Tamu</label>
          <input
            name="nama_tamu"
            value={form.nama_tamu}
            onChange={handleChange}
            placeholder="Masukkan nama tamu"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Asal Tamu</label>
          <input
            name="asal_tamu"
            value={form.asal_tamu}
            onChange={handleChange}
            placeholder="Masukkan asal tamu (perusahaan/instansi)"
            required
          />
        </div>

        {/* Tombol Barang */}
        <div className="barang-actions">
          <button
            type="button"
            className="btn-tambah-barang"
            onClick={() => {
              setEditIndex(null);
              setNewItem(INITIAL_ITEM);
              setShowTambahModal(true);
            }}
          >
            + Tambah Barang
          </button>

          <button
            type="button"
            className="btn-list-barang"
            onClick={() => setShowListModal(true)}
          >
            📋 List Barang {items.length > 0 && `(${items.length})`}
          </button>
        </div>

        {/* Signature Section */}
        <div className="signature-section">
          <span className="sig-title">Tanda Tangan Tamu</span>
          <SignatureCanvas
            ref={sigTamu}
            penColor="black"
            canvasProps={{
              width: 320,
              height: 140,
              className: "sig-canvas"
            }}
          />
          <button
            type="button"
            className="sig-clear"
            onClick={clearSignature}
          >
            Hapus Tanda Tangan
          </button>
        </div>

        {/* Save Button */}
        <button
          className="btn-simpan"
          onClick={saveBerita}
        >
          Simpan Berita Acara
        </button>
      </div>

      {/* Modals */}
      {showTambahModal && (
        <TambahBarangModal
          newItem={newItem}
          setNewItem={setNewItem}
          editIndex={editIndex}
          onClose={() => {
            setShowTambahModal(false);
            setEditIndex(null);
            setNewItem(INITIAL_ITEM);
          }}
          onSave={addItem}
          handleFileChange={handleFileChange}
        />
      )}

      {showListModal && (
        <ListBarangModal
          items={items}
          onClose={() => setShowListModal(false)}
          onEdit={(index) => {
            editItem(index);
            setShowListModal(false);
          }}
          onDelete={removeItem}
        />
      )}
    </div>
  );
}