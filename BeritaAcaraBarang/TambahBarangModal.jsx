import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2"; // Tambah ini untuk validasi

export default function TambahBarangModal({
    newItem,
    setNewItem,
    editIndex,
    onClose,
    onSave,
    handleFileChange  // Dari parent
}) {
    const fileInputRef = useRef(null);

    // Disable scroll + ESC close
    useEffect(() => {
        document.body.style.overflow = "hidden";

        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    // Cleanup preview saat modal ditutup atau preview berubah
    useEffect(() => {
        return () => {
            // Cleanup URL object jika ada
            if (newItem?.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(newItem.previewUrl);
            }
            // Backward compatibility
            if (newItem?.fotoPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(newItem.fotoPreview);
            }
        };
    }, [newItem?.previewUrl, newItem?.fotoPreview]);

    const handleRemovePreview = () => {
        // 🔴 HAPUS CLEANUP DI SINI JUGA!
        // if (newItem?.previewUrl?.startsWith('blob:')) {
        //   URL.revokeObjectURL(newItem.previewUrl);
        // }

        setNewItem((prev) => ({
            ...prev,
            foto: null,
            previewUrl: "",
            fotoPreview: ""
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Validasi sebelum save (tambahan)
    const handleSave = () => {
        if (!newItem.nama || !newItem.jumlah) {
            Swal.fire("Gagal", "Nama dan jumlah wajib diisi", "warning");
            return;
        }
        onSave();
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>
                        {editIndex !== null ? "Edit Barang" : "Tambah Barang Baru"}
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label>Nama Barang *</label>
                        <input
                            type="text"
                            value={newItem.nama || ""}
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    nama: e.target.value
                                }))
                            }
                            placeholder="Masukkan nama barang"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Jumlah *</label>
                        <input
                            type="number"
                            min="1"
                            value={newItem.jumlah || ""}
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    jumlah: e.target.value
                                }))
                            }
                            placeholder="0"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Tipe</label>
                            <input
                                type="text"
                                value={newItem.tipe || ""}
                                onChange={(e) =>
                                    setNewItem((prev) => ({
                                        ...prev,
                                        tipe: e.target.value
                                    }))
                                }
                                placeholder="Contoh: Elektronik"
                            />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>S/N</label>
                            <input
                                type="text"
                                value={newItem.sn || ""}
                                onChange={(e) =>
                                    setNewItem((prev) => ({
                                        ...prev,
                                        sn: e.target.value
                                    }))
                                }
                                placeholder="Serial Number"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Foto Barang</label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                            onChange={handleFileChange}
                        />

                        {/* Gunakan previewUrl, dengan fallback ke fotoPreview */}
                        {(newItem?.previewUrl || newItem?.fotoPreview) && (
                            <div className="preview-container">
                                <p className="preview-title">Preview:</p>
                                <img
                                    src={newItem.previewUrl || newItem.fotoPreview}
                                    alt="Preview Barang"
                                    className="foto-preview-modal"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginTop: '10px'
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn-hapus-preview"
                                    onClick={handleRemovePreview}
                                    style={{
                                        position: 'absolute',
                                        top: '30px',
                                        right: '10px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Ganti Gambar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn-batal"
                        onClick={onClose}
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        className="btn-simpan-modal"
                        onClick={handleSave}
                    >
                        {editIndex !== null ? "Update" : "Tambah"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}