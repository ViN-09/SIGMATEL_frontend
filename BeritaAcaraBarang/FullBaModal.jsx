// src/FullBaModal.jsx
import React from 'react';
import { formatDate, getStatusBadge } from './auth';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FullBaModal = ({ selectedBerita, onClose, onApprove, onReject, currentUser }) => {
    if (!selectedBerita) return null;

    const staffBadge = getStatusBadge(selectedBerita.staff_approval);
    const bmBadge = getStatusBadge(selectedBerita.bm_approval);

    // Cek apakah masih ada yang pending
    const hasPending = selectedBerita.staff_approval === 'pending' || selectedBerita.bm_approval === 'pending';

    return (
        <div className="ba-modal-overlay" onClick={onClose}>
            <div className="ba-modal" onClick={e => e.stopPropagation()}>
                <div className="ba-modal-header">
                    <h3 className="ba-modal-title">
                        <i className="bi bi-file-text me-2"></i>
                        Detail Berita Acara
                    </h3>
                    <button className="ba-modal-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="ba-modal-body">
                    {/* Informasi Detail */}
                    <div className="ba-field">
                        <span className="ba-field-label">Nomor Berita</span>
                        <span className="ba-field-value">{selectedBerita.nomor}</span>
                    </div>
                    <div className="ba-field">
                        <span className="ba-field-label">Tanggal</span>
                        <span className="ba-field-value">{formatDate(selectedBerita.tanggal)}</span>
                    </div>
                    <div className="ba-field">
                        <span className="ba-field-label">Jenis</span>
                        <span className="ba-field-value">{selectedBerita.jenis}</span>
                    </div>
                    <div className="ba-field">
                        <span className="ba-field-label">Keterangan</span>
                        <span className="ba-field-value">{selectedBerita.keterangan}</span>
                    </div>

                    {/* Status Approval */}
                    <div className="ba-approval-grid" style={{ marginTop: '1rem' }}>
                        <div className="ba-approval-item">
                            <span className="ba-field-label">Staff Approval</span>
                            <span className={`ba-badge ${staffBadge.class}`}>
                                <i className={`bi ${staffBadge.icon}`}></i>
                                {staffBadge.text}
                            </span>
                        </div>
                        <div className="ba-approval-item">
                            <span className="ba-field-label">BM Approval</span>
                            <span className={`ba-badge ${bmBadge.class}`}>
                                <i className={`bi ${bmBadge.icon}`}></i>
                                {bmBadge.text}
                            </span>
                        </div>
                    </div>

                    {/* Tanda Tangan */}
                    {selectedBerita.ttd_tamu && selectedBerita.ttd_tamu !== 'txt' && (
                        <div style={{ marginTop: '1rem' }}>
                            <span className="ba-field-label">Tanda Tangan</span>
                            <div style={{ marginTop: '0.25rem' }}>
                                {selectedBerita.ttd_tamu.startsWith('data:image') ? (
                                    <img
                                        src={selectedBerita.ttd_tamu}
                                        alt="Tanda Tangan"
                                        style={{ maxWidth: '100%', maxHeight: '100px' }}
                                    />
                                ) : (
                                    <span className="ba-field-value">{selectedBerita.ttd_tamu}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Daftar Barang */}
                    <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1rem' }}>
                        <i className="bi bi-box me-2"></i>
                        Daftar Barang ({selectedBerita.total_barang})
                    </h4>

                    <table className="ba-table">
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>Jumlah</th>
                                <th>Tipe</th>
                                <th>SN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBerita.barang_list.map(barang => (
                                <tr key={barang.id}>
                                    <td>{barang.nama_barang}</td>
                                    <td>{barang.jumlah}</td>
                                    <td>{barang.tipe}</td>
                                    <td>{barang.sn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tombol Approve & Reject jika masih pending */}
                {hasPending && (
                    <div className="ba-modal-footer">
                        <button
                            className="ba-btn-approve"
                            onClick={() => onApprove(selectedBerita.id, currentUser)}
                        >
                            <i className="bi bi-check-circle"></i>
                            Approve
                        </button>
                        <button
                            className="ba-btn-reject"
                            onClick={() => onReject(selectedBerita.id, currentUser)}
                        >
                            <i className="bi bi-x-circle"></i>
                            Reject
                        </button>
                        <button className="ba-btn-secondary" onClick={onClose}>
                            Tutup
                        </button>
                    </div>
                )}

                {/* Jika sudah selesai semua approval */}
                {!hasPending && (
                    <div className="ba-modal-footer">
                        <button className="ba-btn-secondary" onClick={onClose}>
                            Tutup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullBaModal;