import React, { useState } from "react";
import "../styles/beritaAcara.css";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BeritaAcaraTable({ data }) {
  console.log(data);

  const [loading, setLoading] = useState(false);

  const getHari = (tanggal) => {
    if (!tanggal) return "";
    const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    return hari[new Date(tanggal).getDay()];
  };

  /* ================= APPROVE ================= */
const approveBerita = async (id) => {
  const res = await fetch(
    "http://localhost/BA_barang_in-out/api/approve_berita.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    }
  );

  const data = await res.json();

  if (data.status === "success") {
    Swal.fire("Berhasil", "Berita acara disetujui", "success");
    return true;
  } else {
    Swal.fire("Gagal", data.message, "error");
    return false;
  }
};

const [detailData, setDetailData] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 4;

  /* ================= BUILD PDF HTML ================= */
const buildPDFHTML = (d, page = 1) => {

  if (page === 1) {
    return `
  <div style="font-family:Inter; font-size:14px; color:#111">

    <div style="display:flex; justify-content:space-between;">
      <img src="/logo.png" height="50"/>
      <img src="/Logo Kanan.png" height="50"/>
    </div>

    <h2 style="text-align:center; margin:20px 0;">
      BERITA ACARA SERAH TERIMA BARANG
    </h2>

  <p style="text-align:center">
    Pada Hari <b>${getHari(d.tanggal)}</b>, tanggal <b>${d.tanggal}</b><br/>
    Dari <b>${d.pihakA_jabatan}</b> kepada <b>${d.pihakB_jabatan}</b><br/>
    Telah dilakukan serah terima barang berikut:
  </p>
  
    <table style="width:100%; border-collapse:collapse; margin-top:20px;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:8px">No</th>
          <th style="border:1px solid #000; padding:8px">Nama</th>
          <th style="border:1px solid #000; padding:8px">Jumlah</th>
          <th style="border:1px solid #000; padding:8px">Tipe</th>
          <th style="border:1px solid #000; padding:8px">S/N</th>
        </tr>
      </thead>
      <tbody>
        ${
          d.barang.map((b,i)=>`
            <tr>
              <td style="border:1px solid #000; padding:8px; text-align:center">${i+1}</td>
              <td style="border:1px solid #000; padding:8px">${b.nama_barang}</td>
              <td style="border:1px solid #000; padding:8px; text-align:center">${b.jumlah}</td>
              <td style="border:1px solid #000; padding:8px">${b.tipe}</td>
              <td style="border:1px solid #000; padding:8px">${b.sn}</td>
            </tr>
          `).join("")
        }
      </tbody>
    </table>

    <div style="display:flex; justify-content:space-around; margin-top:50px">

      <div style="text-align:center; width:30%">
        <b>Yang Menyerahkan</b><br/><br/>
        <img src="${d.ttd_penyerah}" height="70"/><br/>
        <u>${d.pihakA_nama}</u><br/>
        ${d.pihakA_jabatan}
      </div>

      <div style="text-align:center; width:30%">
        <b>Yang Menerima</b><br/><br/>
        <img src="${d.ttd_penerima}" height="70"/><br/>
        <u>${d.pihakB_nama}</u><br/>
        ${d.pihakB_jabatan}
      </div>
    </div>

  </div>

          <!-- MENGETAHUI -->
  <div style="text-align:center; margin-top:40px">
    <b>Mengetahui</b><br/><br/>

    ${
      d.approval_status === "approved"
        ? `<img src="${d.ttd_approval}" height="80"/><br/>`
        : `<button id="btn-approve"
            style="padding:8px 16px; background:#28a745; color:#fff; border:none; border-radius:6px; cursor:pointer;">
            Approve
          </button>`
    }

    <br/>
    <u>Djefli Dalita</u><br/>
    Building Manager
  </div>

    `;
  }

if (page === 2) {
  return `
    <div style="font-family:Inter; padding:20px">
      <h2 style="text-align:center; margin-bottom:20px;">
        DOKUMENTASI
      </h2>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:20px;
      ">
        ${
          d.barang
            .filter(b => b.foto)
            .map(b => `
              <div style="
                border:1px solid #ccc;
                padding:10px;
                text-align:center;
                border-radius:8px;
              ">
                <img 
                  src="${b.foto}" 
                  style="
                    width:100%;
                    height:220px;
                    object-fit:cover;
                    border-radius:6px;
                  "
                />
                
                <div style="
                  margin-top:8px;
                  font-weight:600;
                ">
                  ${b.nama_barang}
                </div>

                <div style="
                  font-size:12px;
                  color:#555;
                ">
                  Jumlah: ${b.jumlah} | Tipe: ${b.tipe}
                </div>
              </div>
            `).join("")
        }
      </div>
    </div>
  `;
}

}


  /* ================= EXPORT PDF ================= */
const exportPDF = async (detail) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const page1 = document.createElement("div");
  page1.style.width = "210mm";
  page1.style.padding = "20px";
  page1.innerHTML = buildPDFHTML(detail, 1);
  document.body.appendChild(page1);

  const canvas1 = await html2canvas(page1, { scale: 2 });
  const img1 = canvas1.toDataURL("image/png");
  pdf.addImage(img1, "PNG", 0, 0, 210, (canvas1.height * 210) / canvas1.width);
  page1.remove();

  pdf.addPage();

  const page2 = document.createElement("div");
  page2.style.width = "210mm";
  page2.style.padding = "20px";
  page2.innerHTML = buildPDFHTML(detail, 2);
  document.body.appendChild(page2);

  const canvas2 = await html2canvas(page2, { scale: 2 });
  const img2 = canvas2.toDataURL("image/png");
  pdf.addImage(img2, "PNG", 0, 0, 210, (canvas2.height * 210) / canvas2.width);
  page2.remove();

  pdf.save(`Berita_Acara_${detail.nomor}.pdf`);
};


const openDetail = async (id) => {
  setLoading(true);

  const res = await fetch(
    `http://localhost/BA_barang_in-out/api/get_berita_acara_detail.php?id=${id}`
  );

  const json = await res.json();
  setLoading(false);

  if (json.status !== "success") {
    Swal.fire("Error", json.message, "error");
    return;
  }

  showModal(json.data, 1);
};


const showModal = (detail, page = 1) => {
  Swal.fire({
  width: "900px",
  html: buildPDFHTML(detail, page),
  showCancelButton: true,
  confirmButtonText: "Export PDF",
  cancelButtonText: "Tutup",
  preConfirm: () => exportPDF(detail),
    footer: `
      ${page === 1 ? '<button id="nextPage" class="swal2-confirm swal2-styled">Dokumentasi</button>' : ''}
      ${page === 2 ? '<button id="prevPage" class="swal2-confirm swal2-styled">Kembali</button>' : ''}
    `,
    didOpen: () => {
      const next = document.getElementById("nextPage");
      const prev = document.getElementById("prevPage");
      const exportBtn = document.getElementById("btn-export");
      const approveBtn = document.getElementById("btn-approve");

      if (next) next.onclick = () => showModal(detail, 2);
      if (prev) prev.onclick = () => showModal(detail, 1);

      if (exportBtn) {
        exportBtn.onclick = () => exportPDF(detail);
      }

      if (approveBtn) {
        approveBtn.onclick = async () => {
          const ok = await approveBerita(detail.id);
          if (ok) {
            openDetail(detail.id); // reload data + modal
          }
        };
      }
    }
  });
};





  /* ================= TABLE ================= */
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
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id}
              className="clickable-row"
              onClick={() => openDetail(row.id_berita)}
            >
              <td>{i+1}</td>
              <td>{row.nomor}</td>
              <td>{row.tanggal}</td>
              <td>{row.jenis}</td>
              <td>{row.keterangan}</td>
              <td>{row.pihakA_nama}</td>
              <td>{row.pihakB_nama}</td>
              <td>{row.created_at}</td>
              <td>
              <span className={`badge ${row.approval_status}`}>
                {row.approval_status === "approved" ? "Approved" : "Pending"}
              </span>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p>Loading...</p>}
    </div>
  );
}
