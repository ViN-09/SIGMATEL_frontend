// src/auth.js
import axios from 'axios';
import { HOST, getSITE } from '../auth';


export const fetchBeritaAcara = async (params = {}) => {
  const site = getSITE();
  console.log("site=", site)
  try {
    const defaultParams = {
      per_page: 10,
      page: 1
    };

    const response = await axios.post(`${HOST}/api/${site}/ba_barang/aproved_ba`, {
      ...defaultParams,
      ...params
    });

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      meta: response.data.meta
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Terjadi kesalahan',
      details: error.response?.data?.errors || {}
    };
  }
};

// FUNGSI BARU: fetchPendingBa untuk list BA yang belum approved
export const fetchPendingBa = async (id = null, jabatan = null, params = {}) => {
  const site = getSITE();
  try {
    const defaultParams = {
      per_page: 10,
      page: 1
    };

    // Base request body
    const requestBody = {
      ...defaultParams,
      ...params
    };

    // Tambah id ke body jika ada
    if (id) {
      requestBody.username = id;
    }

    // Tambah jabatan ke body jika ada
    if (jabatan) {
      requestBody.jabatan = jabatan;
    }

    console.log('Request Body:', requestBody); // Untuk debugging

    const response = await axios.post(`${HOST}/api/${site}/ba_barang/pending`, requestBody);

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      meta: response.data.meta
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Terjadi kesalahan',
      details: error.response?.data?.errors || {}
    };
  }
};

// FUNGSI BARU: approve BA
export const approveBA = async (id, user) => {
  const site = getSITE();
  try {

    const requestBody = {
      id: id,
      jabatan: user.jabatan,
      userId: user.id
    };

    const response = await axios.post(
      `${HOST}/api/${site}/ba_barang/approval`,
      requestBody
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Terjadi kesalahan",
      details: error.response?.data?.errors || {}
    };
  }
};


export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const getStatusBadge = (status) => {
  console.log
  if (status === 'pending') {
    return {
      class: 'ba-badge-warning',
      icon: 'bi-clock',
      text: 'Pending'
    };
  }

  // Status selain pending → hanya text indikator
  const statusText = {
    approved: 'Disetujui',
    rejected: 'Ditolak'
  }[status] || status; // fallback jika ada status baru

  return {
    class: status === 'approved' ? 'ba-badge-success' : 'ba-badge-danger',
    icon: '', // kosong, tidak ada icon
    text: statusText
  };
};

