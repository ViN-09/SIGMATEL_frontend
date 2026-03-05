import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/beritaAcaraSelesai.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getUser, HOST } from "../auth";

/* ================= TEST MODE ================= */

const user=getUser()
const host = HOST

const TEST_MODE = false;


export default function BeritaAcaraSelesai() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [jenis, setJenis] = useState("");

// const user_id = TEST_MODE
//   ? user.id
//   : localStorage.getItem("user_id");

// const jabatan = `TEST_MODE`
//   ? user.jabatan
//   : localStorage.getItem("user_jabatan");
// console.log("USER ID:", user_id);
// console.log("JABATAN:", jabatan);

useEffect(() => {
  loadData();
}, [dari, sampai, jenis]);
  /* ================= GET HARI ================= */
  const getHari = (tanggal) => {
    const hari = new Date(tanggal).getDay();
    const namaHari = [
      "Minggu","Senin","Selasa","Rabu",
      "Kamis","Jumat","Sabtu"
    ];
    return namaHari[hari];
  };

  /* ================= LOAD DATA ================= */
const loadData = async () => {
  try {
    setLoading(true);

    let params = new URLSearchParams();

    if (dari) params.append("dari", dari);
    if (sampai) params.append("sampai", sampai);
    if (jenis) params.append("jenis", jenis);

    let url = `${host}/get_berita_selesai.php`;

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    const json = await res.json();

    if (json.status === "success") {
      setData(json.data);
    } else {
      Swal.fire("Error", json.message, "error");
    }
  } catch (err) {
    Swal.fire("Error", "Gagal mengambil data", "error");
  } finally {
    setLoading(false);
  }
};
  /* ================= APPROVE ================= */
  const approve = async (id) => {
    try {
      const payload = {
        user_id: user_id,
        id_ba: id
      };

      const res = await fetch(
        `${host}/approve.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const json = await res.json();

      if (json.status === "success") {
        Swal.fire("Success", "Berhasil approve", "success");
        loadData();
      } else {
        Swal.fire("Error", json.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Gagal approve", "error");
    }
  };

  /* ================= BUILD PDF HTML ================= */
const buildPDFHTML = (d, page = 1) => {

  const isMasuk = d.jenis === "MASUK";
  const isKeluar = d.jenis === "KELUAR";

  const ttdTamu = isMasuk ? d.ttd_penyerah : d.ttd_penerima;
  const ttdStaff = d.staff_ttd_approval;

  const namaTamu = isMasuk ? d.pihakA_nama : d.pihakB_nama;
  const jabatanTamu = isMasuk ? d.pihakA_jabatan : d.pihakB_jabatan;

  const namaStaff = d.staff_nama || "Staff Site";


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

  <div style="display:flex; justify-content:space-around; margin-top:60px">

    <!-- PENYERAH -->
    <div style="text-align:center; width:30%">
      <b>Yang Menyerahkan</b><br/><br/>

      ${
        isMasuk
          ? `
              <img src="${ttdTamu || ''}" height="70"/><br/>
              <u>${namaTamu}</u><br/>
              ${jabatanTamu}
            `
          : `
              ${
                ttdStaff
                  ? `<img src="${ttdStaff}" height="70"/><br/>`
                  : `<button id="btn-approve-staff"
                      style="padding:6px 14px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer">
                      Approve Staff
                    </button>`
              }
              <br/>
              <u>${namaStaff}</u><br/>
              ${d.asal_staff || ""}
            `
      }
    </div>

    <!-- PENERIMA -->
    <div style="text-align:center; width:30%">
      <b>Yang Menerima</b><br/><br/>

      ${
        isMasuk
          ? `
              ${
                ttdStaff
                  ? `<img src="${ttdStaff}" height="70"/><br/>`
                  : `<button id="btn-approve-staff"
                      style="padding:6px 14px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer">
                      Approve Staff
                    </button>`
              }
              <br/>
              <u>${namaStaff}</u><br/>
              ${d.asal_staff || ""}
            `
          : `
              <img src="${ttdTamu || ''}" height="70"/><br/>
              <u>${namaTamu}</u><br/>
              ${jabatanTamu}
            `
      }
    </div>

  </div>

  <!-- MENGETAHUI -->
  <div style="text-align:center; margin-top:50px">
    <b>Mengetahui</b><br/><br/>

    ${
      d.approval_status === "approved"
        ? `<img src="${d.ttd_approval}" height="80"/><br/>`
        : !ttdStaff
          ? `<button
                style="padding:8px 16px; background:#ccc; color:#666; border:none; border-radius:6px; cursor:not-allowed;"
                disabled>
                Menunggu Approve Staff
             </button>`
          : `<button id="btn-approve"
                style="padding:8px 16px; background:#28a745; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                Approve
             </button>`
    }

    <br/>
    <u>${d.bm_nama || ""}</u><br/>
    Building Manager
  </div>

</div>
`;
  }

  /* ===== PAGE 2 ===== */
  if (page === 2) {
    return `
<div style="font-family:Inter; padding:20px">
  <h2 style="text-align:center; margin-bottom:20px;">
    DOKUMENTASI
  </h2>

  <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
    ${
      d.barang
        .filter(b => b.foto)
        .map(b => `
          <div style="border:1px solid #ccc; padding:10px; text-align:center; border-radius:8px;">
            <img 
              src="${b.foto}" 
              style="width:100%; height:220px; object-fit:cover; border-radius:6px;"
            />
            <div style="margin-top:8px; font-weight:600;">
              ${b.nama_barang}
            </div>
            <div style="font-size:12px; color:#555;">
              Jumlah: ${b.jumlah} | Tipe: ${b.tipe}
            </div>
          </div>
        `).join("")
    }
  </div>
</div>
`;
  }
};


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
    `${host}/get_berita_acara_detail.php?id=${id}`
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
    _didOpen: () => {
      const next = document.getElementById("nextPage");
      const prev = document.getElementById("prevPage");
      const exportBtn = document.getElementById("btn-export");
      const approveBtn = document.getElementById("btn-approve");
      const approveStaffBtn = document.getElementById("btn-approve-staff");
      const jabatan = TEST_MODE ? user.jabatan : localStorage.getItem("user_jabatan");
      if (next) next.onclick = () => showModal(detail, 2);
      if (prev) prev.onclick = () => showModal(detail, 1);

      if (exportBtn) {
        exportBtn.onclick = () => exportPDF(detail);
      }

        if (approveBtn && jabatan === "BM") {
          approveBtn.onclick = async () => {
            await approve(detail.id);
          };
        }

        if (approveStaffBtn && jabatan !== "BM") {
          approveStaffBtn.onclick = async () => {
            await approve(detail.id);
          };
        }
    },
    get didOpen() {
      return this._didOpen;
    },
    set didOpen(value) {
      this._didOpen = value;
    },
  });
};

  /* ================= EXPORT EXCEL ================= */
  const exportExcel = () => {
    if (data.length === 0) {
      Swal.fire("Tidak ada data");
      return;
    }

    const exportData = data.map((row) => ({
      Nomor: row.nomor,
      Tanggal: row.tanggal,
      Jenis: row.jenis,
      Staff: row.staff_nama,
      Status: row.approval_status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Berita Acara ");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(blob, `BA_Selesai.xlsx`);
  };

  /* ================= RENDER ================= */
return (
  <div className="table-wrapper">
    <div className="ba-page">
  <h2 className="ba-tittle">Berita Acara Selesai</h2>

{/* ===== FILTER SECTION ===== */}
<div className="ba-filter-wrapper">
  <div className="ba-filter-left">
    <label>Dari:</label>
    <input
      type="date"
      value={dari}
      onChange={(e) => setDari(e.target.value)}
    />

      <label>Sampai:</label>
      <input
        type="date"
        value={sampai}
        onChange={(e) => setSampai(e.target.value)}
      />

  
    <label>Jenis:</label>
    <select
      value={jenis}
      onChange={(e) => setJenis(e.target.value)}
    >
      <option value="">Semua</option>
      <option value="MASUK">MASUK</option>
      <option value="KELUAR">KELUAR</option>
    </select>
   </div> 

  <div className="ba-filter-left">
    <button className="btn-filter" onClick={loadData}>
      Filter
    </button>

    <button
      className="btn-reset"
      onClick={() => {
        setDari("");
        setSampai("");
        setJenis("");
        loadData();
      }}
    >
      Reset
    </button>

    <button className="btn-export" onClick={exportExcel}>
      Export
    </button>
  </div>
</div>
</div>
      <table className="ba-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor</th>
            <th>Nama Barang</th>
            <th>Keterangan</th>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Nama Tamu</th>
            <th>Asal Tamu</th>
            <th>Staff</th>
            <th>Status</th>
          </tr>
        </thead>

<tbody>
  {data.map((row, i) => {
    const tamuNama =
      row.jenis === "MASUK"
        ? row.pihakA_nama
        : row.pihakB_nama;

    const tamuAsal =
      row.jenis === "MASUK"
        ? row.pihakA_jabatan
        : row.pihakB_jabatan;

    return (
      <tr
        key={row.id}
        className="clickable-row"
        onClick={() => openDetail(row.id_berita || row.id)}
      >
        <td>{i + 1}</td>
        <td>{row.nomor}</td>
        <td>
          {JSON.parse(row.barang).map((b, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div><b>{i + 1}. {b.nama}</b></div>
              <div style={{ fontStyle: "italic" }}>
                JUMLAH: {b.jumlah}
              </div>
            </div>
          ))}
        </td>
        <td>{row.keterangan}</td>
        <td>{row.tanggal}</td>
        <td>{row.jenis}</td>
        <td>{tamuNama}</td>
        <td>{tamuAsal}</td>
        <td>{row.staff_nama}</td>
        <td>
          <span className={`badge ${row.approval_status}`}>
            {row.approval_status}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>
      </table>

      {loading && <p>Loading...</p>}
    </div>
  );
}