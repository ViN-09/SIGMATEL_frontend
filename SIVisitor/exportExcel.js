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