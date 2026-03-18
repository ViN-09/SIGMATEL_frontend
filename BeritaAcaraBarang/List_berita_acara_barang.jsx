// src/List_berita_acara_barang.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { fetchBeritaAcara, formatDate, getStatusBadge } from './auth';
import FullBaModal from './FullBaModal';
import './List_berita_acara_barang.css';


const List_berita_acara_barang = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1, per_page: 3, total: 0, total_pages: 0,
        has_next_page: false, has_prev_page: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (page = 1) => {
        setLoading(true);
        setError(null);

        const result = await fetchBeritaAcara({ page });

        if (result.success) {
            setData(result.data);
            setPagination(result.pagination);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            loadData(newPage);
        }
    };

    const handleViewDetail = (berita) => {
        setSelectedBerita(berita);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBerita(null);
    };

    if (loading && data.length === 0) {
        return (
            <div className="ba-loading">
                <div className="ba-spinner"></div>
            </div>
        );
    }

    return (
        <div className="ba-container">
            {/* Header */}
            <div className="ba-header">
                <h1 className="ba-title">
                    <i className="bi bi-file-text me-2"></i>
                    Daftar Berita Acara
                </h1>
                <button onClick={() => loadData(pagination.current_page)} className="ba-btn-refresh">
                    <i className="bi bi-arrow-repeat"></i>
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="ba-error">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {/* Info Pagination */}
            {pagination.total > 0 && (
                <div className="ba-info-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} data
                </div>
            )}

            {/* Grid Cards */}
            <div className="ba-grid">
                {data.map((berita) => {
                    const staffBadge = getStatusBadge(berita.staff_approval);
                    const bmBadge = getStatusBadge(berita.bm_approval);

                    return (
                        <div key={berita.id} className="ba-card">
                            <div className="ba-card-header">
                                <div className="ba-card-header-content">
                                    <div className="ba-nomor-wrapper">
                                        <span className="ba-nomor-label">No. Berita</span>
                                        <span className="ba-nomor-text">{berita.nomor}</span>
                                    </div>
                                    <span className={`ba-jenis-badge ${berita.jenis === 'MASUK' ? 'ba-jenis-masuk' : 'ba-jenis-keluar'}`}>
                                        {berita.jenis}
                                    </span>
                                </div>
                            </div>

                            <div className="ba-card-body">
                                <div className="ba-field">
                                    <span className="ba-field-label">Tanggal</span>
                                    <span className="ba-field-value">{formatDate(berita.tanggal)}</span>
                                </div>

                                <div className="ba-field">
                                    <span className="ba-field-label">Keterangan</span>
                                    <span className="ba-field-value ba-field-value-line-clamp">
                                        {berita.keterangan}
                                    </span>
                                </div>

                                <div className="ba-approval-grid">
                                    <div className="ba-approval-item">
                                        <span className="ba-field-label">Staff</span>
                                        <span className={`ba-badge ${staffBadge.class}`}>
                                            <i className={`bi ${staffBadge.icon}`}></i>
                                            {staffBadge.text}
                                        </span>
                                    </div>
                                    <div className="ba-approval-item">
                                        <span className="ba-field-label">BM</span>
                                        <span className={`ba-badge ${bmBadge.class}`}>
                                            <i className={`bi ${bmBadge.icon}`}></i>
                                            {bmBadge.text}
                                        </span>
                                    </div>
                                </div>

                                <div className="ba-footer-card">
                                    <span className="ba-total-barang">
                                        <i className="bi bi-box"></i>
                                        {berita.total_barang} Barang
                                    </span>
                                    <button
                                        className="ba-btn-detail"
                                        onClick={() => handleViewDetail(berita)}
                                    >
                                        <i className="bi bi-eye"></i>
                                        Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="ba-pagination">
                    <button
                        className="ba-pagination-btn"
                        onClick={() => handlePageChange(pagination.prev_page)}
                        disabled={!pagination.has_prev_page}
                    >
                        <i className="bi bi-chevron-left"></i>
                        Previous
                    </button>

                    <span className="ba-pagination-info">
                        Halaman {pagination.current_page} dari {pagination.total_pages}
                    </span>

                    <button
                        className="ba-pagination-btn"
                        onClick={() => handlePageChange(pagination.next_page)}
                        disabled={!pagination.has_next_page}
                    >
                        Next
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <FullBaModal
                    selectedBerita={selectedBerita}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default List_berita_acara_barang;