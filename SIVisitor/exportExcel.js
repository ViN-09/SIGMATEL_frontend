import * as XLSX from "xlsx";

export function exportBukuTamuXLSX(filtered, toast) {
  if (!filtered || filtered.length === 0) {
    if (toast) toast("Tidak ada data untuk di-export", "info");
    return;
  }

  const data = filtered.map((t) => {
    const created = new Date(t?.created_at);
    const invalidDate = Number.isNaN(created.getTime());

    const hari = invalidDate
      ? ""
      : created.toLocaleDateString("id-ID", { weekday: "long" });

    const tanggal = invalidDate ? "" : created.toLocaleDateString("id-ID");

    const jam = invalidDate
      ? ""
      : created.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    return {
      Hari: hari,
      Tanggal: tanggal,
      Jam: jam,
      Nama: t?.name ?? "",
      Perusahaan: t?.company ?? "",
      Telepon: t?.phone ?? "",
      Aktivitas: t?.activity ?? "",
      Ruang: t?.ruang_kerja ?? "",
      "VISIT/E-SIK": t?.visit_id ?? "",
      Status: t?.status ?? "",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BukuTamu");

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  XLSX.writeFile(wb, `buku_tamu_${y}-${m}-${d}_${hh}${mm}.xlsx`);

  if (toast) toast("Export Excel berhasil");
}