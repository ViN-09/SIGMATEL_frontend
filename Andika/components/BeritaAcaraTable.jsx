import React, { useState } from "react";
import "../styles/beritaAcara.css";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BeritaAcaraTable({ data = [] }) {
  const [loading, setLoading] = useState(false);

  /* ================= UTIL ================= */

  const getHari = (tanggal) => {
    if (!tanggal) return "";
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return hari[new Date(tanggal).getDay()];
  };

  /* ================= HTML BUILDER ================= */

  const buildPDFHTML = (d) => `
    <div style="font-family:Inter, Arial; color:#111; font-size:14px; padding:20px">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px">
        <img src="/logo.png" style="height:50px" />
        <img src="/Logo Kanan.png" style="height:50px" />
      </div>

      <p style="text-align:center">
        Pada Hari <b>${getHari(d.tanggal)}</b>, tanggal <b>${d.tanggal}</b><br/>
        Dari <b>${d.pihakA_jabatan}</b> kepada <b>${d.pihakB_jabatan}</b><br/>
        Telah dilakukan serah terima barang berikut:
      </p>

      <table style="width:100%; border-collapse:collapse; margin-top:12px">
        <thead>
          <tr style="background:#f1f5f9">
            <th style="border:1px solid #ccc">No</th>
            <th style="border:1px solid #ccc">Nama Barang</th>
            <th style="border:1px solid #ccc">Jumlah</th>
            <th style="border:1px solid #ccc">Tipe</th>
            <th style="border:1px solid #ccc">S/N</th>
          </tr>
        </thead>
        <tbody>
          ${
            !Array.isArray(d.barang) || d.barang.length === 0
              ? `<tr><td colspan="5" align="center">Tidak ada barang</td></tr>`
              : d.barang
                  .map(
                    (b, i) => `
                  <tr>
                    <td style="border:1px solid #ccc">${i + 1}</td>
                    <td style="border:1px solid #ccc">${b.nama_barang}</td>
                    <td style="border:1px solid #ccc">${b.jumlah}</td>
                    <td style="border:1px solid #ccc">${b.tipe}</td>
                    <td style="border:1px solid #ccc">${b.sn}</td>
                  </tr>
                `
                  )
                  .join("")
          }
        </tbody>
      </table>

      <p style="margin-top:12px">
        Demikian Berita Acara Serah Terima Barang ini dibuat dengan sebenar-benarnya.
      </p>

      <div style="display:flex; justify-content:space-around; margin-top:30px">
        <div style="text-align:center; width:30%">
          <b>Yang Menyerahkan</b><br/><br/>
          <img src="${d.ttd_penyerah}" height="70"/><br/>
          <u>${d.pihakA_nama}</u><br/>${d.pihakA_jabatan}
        </div>

        <div style="text-align:center; width:30%">
          <b>Yang Menerima</b><br/><br/>
          <img src="${d.ttd_penerima}" height="70"/><br/>
          <u>${d.pihakB_nama}</u><br/>${d.pihakB_jabatan}
        </div>
      </div>

      <div style="text-align:center; margin-top:25px">
        <b>Mengetahui</b><br/><br/>
        <img src="${d.ttd_mengetahui}" height="80"/><br/>
        <u>Djefli Dalita</u><br/>Building Manager
      </div>
    </div>
  `;

  /* ================= PDF EXPORT ================= */

  const exportPDF = async (data) => {
    const container = document.createElement("div");
    container.innerHTML = buildPDFHTML(data);
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Berita_Acara_${data.nomor}.pdf`);

    document.body.removeChild(container);
  };

  /* ================= DETAIL ================= */

  const openDetail = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost/BA_barang_in-out/api/get_berita_acara_detail.php?id=${id}`
      );
      const json = await res.json();
      console.log(json);

      setLoading(false);

      if (json.status !== "success") {
        Swal.fire("Error", json.message, "error");
        return;
      }

      Swal.fire({
        title: "Detail Berita Acara",
        width: "900px",
        html: buildPDFHTML(json.data),
        showCancelButton: true,
        confirmButtonText: "Export PDF",
        cancelButtonText: "Tutup",
        preConfirm: () => exportPDF(json.data),
      });
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", err.message, "error");
      console.error(err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="table-wrapper">
      <table className="ba-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor</th>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Keterangan</th>
            <th>Penyerah</th>
            <th>Penerima</th>
            <th>Dibuat Pada</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {!Array.isArray(data) || data.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={`ba-${row.id_berita}`}>
                <td>{i + 1}</td>
                <td>{row.nomor}</td>
                <td>{row.tanggal}</td>
                <td>{row.jenis}</td>
                <td>{row.keterangan}</td>
                <td>{row.pihakA_nama}</td>
                <td>{row.pihakB_nama}</td>
                <td>{row.created_at ?? "-"}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => openDetail(row.id_berita)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {loading && <p>Loading detail...</p>}
    </div>
  );
}
