import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ListBarangModal({
    items,
    onClose,
    onEdit,
    onDelete
}) {
    // Ref untuk menyimpan URL yang sudah dibuat ulang
    const imageUrls = useRef(new Map());

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleEsc);

            // Cleanup semua URL yang dibuat ulang
            imageUrls.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });
            imageUrls.current.clear();
        };
    }, [onClose]);

    // Fungsi untuk mendapatkan URL gambar yang valid
    const getImageUrl = (item) => {
        // Cek apakah sudah pernah bikin URL baru
        if (imageUrls.current.has(item.id)) {
            return imageUrls.current.get(item.id);
        }

        // Pakai URL existing
        return item.previewUrl || item.fotoPreview;
    };

    // Handler untuk error gambar
    const handleImageError = (e, item) => {
        console.log("Gambar error, bikin baru:", item.nama);

        if (item.foto && !imageUrls.current.has(item.id)) {
            // Buat URL baru dari file object
            const newUrl = URL.createObjectURL(item.foto);
            imageUrls.current.set(item.id, newUrl);
            e.target.src = newUrl;
            console.log("URL baru dibuat:", newUrl);
        } else {
            e.target.style.display = 'none';
        }
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Daftar Barang ({items.length})</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {items.length === 0 ? (
                        <div className="empty-list">
                            <p>Belum ada barang ditambahkan</p>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id || index} className="list-item">

                                {/* CEK APAKAH ADA GAMBAR */}
                                {(item.previewUrl || item.fotoPreview || item.foto) && (
                                    <img
                                        src={getImageUrl(item)}
                                        alt={item.nama}
                                        className="list-preview-img"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd'
                                        }}
                                        onError={(e) => handleImageError(e, item)}
                                    />
                                )}

                                <div className="list-info">
                                    <h4>{item.nama || "Tanpa nama"}</h4>
                                    <p>Jumlah: {item.jumlah || "0"}</p>
                                    {item.tipe && <p>Tipe: {item.tipe}</p>}
                                    {item.sn && <p>SN: {item.sn}</p>}
                                </div>

                                <div className="list-actions">
                                    <button onClick={() => onEdit(index)}>Edit</button>
                                    <button onClick={() => onDelete(index)}>Hapus</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-batal" onClick={onClose}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}