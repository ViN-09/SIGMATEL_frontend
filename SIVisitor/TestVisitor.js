export const API_HOST = "http://127.0.0.1:8000";

export function getSiteConfig() {
  const raw = sessionStorage.getItem("userinfo");
  let user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  if (!user) {
    return {
      username: "unknown",
      ttc: "ttc_paniki",
      label: "Default",
    };
  }

  if (user.site === "TTC Teling") {
    return {
      username: user.name,
      ttc: "ttc_teling",
      label: "TTC Teling",
    };
  }

  if (user.site === "TTC Paniki") {
    return {
      username: user.name,
      ttc: "ttc_paniki",
      label: "TTC Paniki",
    };
  }

  // fallback
  return {
    username: user.name,
    ttc: "ttc_paniki",
    label: "TTC Paniki",
  };
}

async function safeReadJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`
    );
  }
  return res.json();
}

export async function fetchDoneVisitorsRaw(mode = "month") {
  const SITE = getSiteConfig();
  const ttc = SITE.ttc;

  let url = `${API_HOST}/api/${ttc}/visitor/visitors/completed`;

  // jika ambil semua data
  if (mode === "all") {
    url = `${API_HOST}/api/${ttc}/visitor/visitors/completed-all`;
  }

  try {
    console.log("fetchDoneVisitorsRaw SITE:", SITE);
    console.log("fetchDoneVisitorsRaw MODE:", mode);
    console.log("fetchDoneVisitorsRaw URL:", url);

    const res = await fetch(url, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await safeReadJson(res);

    console.log("fetchDoneVisitorsRaw response:", json);

    if (json.success) {
      return Array.isArray(json.data) ? json.data : [];
    }

    console.error("Gagal ambil data:", json.message);
    return [];
  } catch (err) {
    console.error("fetchDoneVisitorsRaw error:", err);
    return [];
  }
}
export async function updateStatusVisitor(id, type, file, userID) {
  const SITE = getSiteConfig();
  const ttc = SITE.ttc;
  const updateURL = `${API_HOST}/api/${ttc}/visitor/visitors/${id}/update-status`;

  const formData = new FormData();
  if (type === "in") formData.append("dokumentasi_in", file);
  if (type === "out") formData.append("dokumentasi_out", file);
  formData.append("status", type === "in" ? "approved" : "selesai");

  const res = await fetch(updateURL, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      userid: String(userID),
      Accept: "application/json",
    },
  });

  return res.json();
}

export async function fetchTamu() {
  const SITE = getSiteConfig();
  const ttc = SITE.ttc;
  const listURL = `${API_HOST}/api/${ttc}/visitor/waiting`;

  try {
    console.log("fetchTamu SITE:", SITE);
    console.log("fetchTamu URL:", listURL);

    const res = await fetch(listURL, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await safeReadJson(res);

    if (json?.success) {
      return json.data || [];
    }

    throw new Error(json?.message || "Gagal ambil data");
  } catch (err) {
    console.error("fetchTamu error:", err);
    return [];
  }
}


export function mapVisitorData(rawData) {
  return (rawData || [])
    .map((item) => {
      const created = new Date(item.created_at);

      return {
        id: item.id,
        hari: Number.isNaN(created.getTime())
          ? "-"
          : created.toLocaleDateString("id-ID", { weekday: "long" }),
        tanggal: Number.isNaN(created.getTime())
          ? "-"
          : created.toLocaleDateString("id-ID"),
        tanggalRaw: created,
        nama: item.name || "-",
        instansi: item.company || "-",
        noTelp: item.phone || "-",
        aktivitas: item.activity || "-",
        jamMasuk: item.created_at || "",
        jamKeluar: item.updated_at || "",
        dokumentasi_in: item.dokumentasi_in || "-",
        dokumentasi_out: item.dokumentasi_out || "-",
        ruangKerja: item.ruang_kerja || "-",
        keterangan: item.visit_id || "-",
        status: item.status || "-",
        raw: item,
      };
    })
    .sort((a, b) => b.tanggalRaw - a.tanggalRaw);
}

export function applyFilter(data, keyword, startDate, endDate) {
  let result = [...data];

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    result = result.filter((item) => {
      return item.tanggalRaw >= start && item.tanggalRaw <= end;
    });
  }

  const key = keyword.trim().toLowerCase();

  if (key) {
    result = result.filter((item) =>
      [
        item.hari,
        item.tanggal,
        item.nama,
        item.instansi,
        item.noTelp,
        item.aktivitas,
        item.ruangKerja,
        item.keterangan,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(key)
    );
  }

  return result;
}

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export function exportExcel(data, ttc) {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  const dataToExport = data.map((r) => ({
    Hari: r.hari,
    Tanggal: r.tanggal,
    Nama: r.nama,
    Perusahaan: r.instansi,
    "Nomor Telepon": r.noTelp,
    Aktivitas: r.aktivitas,
    "Waktu Masuk": r.jamMasuk
      ? new Date(r.jamMasuk).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-",
    "Waktu Keluar": r.jamKeluar
      ? new Date(r.jamKeluar).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-",
    "Ruang Kerja": r.ruangKerja,
    "No. VISIT/E SIK": r.keterangan,
    Status: r.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "BukuTamu");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, `BukuTamu_${ttc}.xlsx`);
}