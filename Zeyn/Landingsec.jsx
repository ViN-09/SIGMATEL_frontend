import { useState, useEffect } from "react";
import "./Landingsec.css";
import "./landing.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import telkomselImg2 from "../assets/Telkomsel Logo.png";
import telkomselImg1 from "../assets/telkom.png";
import { Link } from "react-router-dom";
import InfoTamu from "../component/InfoTamu";

export default function Dashboard() {
  const apiHost = sessionStorage.getItem("host");
  const user = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
  const userID = user?.id;

  const [tamu, setTamu] = useState([]);
  const [uploading, setUploading] = useState({});
  const [notif, setNotif] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState({});

  useEffect(() => {
    if (!apiHost) return;
    fetchTamu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiHost]);

  const fetchTamu = async () => {
    try {
      // ✅ endpoint list waiting (sesuai routes/api.php kamu)
      const res = await fetch(`${apiHost}/api/ttc_paniki/visitors/waiting`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) setTamu(json.data);
      else console.error("Gagal ambil data:", json.message);
    } catch (err) {
      console.error("Error fetch:", err);
    }
  };

  const handleApproveClick = (id) => {
    setUploading((prev) => ({ ...prev, [id]: "in" }));
  };

  const handleUploadFoto = async (file, id, type) => {
    if (!file) return;

    const formData = new FormData();

    // ✅ field sesuai controller: dokumentasi_in / dokumentasi_out
    if (type === "in") formData.append("dokumentasi_in", file);
    else if (type === "out") formData.append("dokumentasi_out", file);

    formData.append("status", type === "in" ? "approved" : "selesai");

    try {
      const res = await fetch(
        // ✅ endpoint sesuai routes/api.php
        `${apiHost}/api/ttc_paniki/visitors/${id}/update-status`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            userid: userID,
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        if (type === "in") {
          setTamu((prev) =>
            prev.map((t) =>
              t.id === id
                ? { ...t, status: "approved", dokumentasi_in: file.name }
                : t
            )
          );
          setUploading((prev) => ({ ...prev, [id]: false }));
          showToast("Tamu berhasil Approved", "success");
        } else if (type === "out") {
          setTamu((prev) => prev.filter((t) => t.id !== id));
          setUploading((prev) => ({ ...prev, [id]: false }));
          showToast("Tamu Out", "success");
        }
      } else {
        alert("Gagal update status: " + (json.message || "Unknown error"));
        setUploading((prev) => ({ ...prev, [id]: false }));
      }
    } catch (err) {
      console.error("Error upload foto:", err);
      alert("Upload gagal, cek koneksi atau server API!");
      setUploading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `${apiHost}/api/ttc_paniki/visitors/${id}/update-status`,
        {
          method: "POST",
          body: new URLSearchParams({ status: "rejected" }),
          credentials: "include",
          headers: {
            userid: userID,
          },
        }
      );

      const json = await res.json();
      if (json.success) {
        setTamu((prev) => prev.filter((t) => t.id !== id));
        showToast("Tamu berhasil ditolak", "success");
      } else {
        console.error("Gagal reject:", json.message);
        showToast("Gagal reject: " + (json.message || "Unknown error"), "error");
      }
    } catch (err) {
      console.error("Error reject:", err);
      showToast("Error reject: cek server/koneksi", "error");
    }
  };

  const showToast = (message, type = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h3 className="security-title">Approval Tamu</h3>

        <section className="summary-section">
          <div className="summary-card bg-red">
            <i className="bi bi-person summary-icon text-white"></i>
            <div className="summary-text">
              <div className="summary-title">Waiting Approval</div>
              <div className="summary-value">
                {tamu.filter((t) => t.status === "pending").length}
              </div>
            </div>
          </div>

          <div className="summary-card bg-green">
            <i className="bi bi-check-circle summary-icon text-white"></i>
            <div className="summary-text">
              <div className="summary-title">Tamu Approved</div>
              <div className="summary-value">
                {tamu.filter((t) => t.status === "approved").length}
              </div>
            </div>
          </div>
        </section>

        <section className="table-section" id="aproval-list">
          <table>
            <thead>
              <tr>
                <th>Hari</th>
                <th>Tanggal</th>
                <th>Nama Lengkap</th>
                <th>Perusahaan</th>
                <th>No. Telepon</th>
                <th>Aktivitas</th>
                <th>Jam</th>
                <th>Ruang Kerja</th>
                <th>No. VISIT/E SIK</th>
                <th>Status</th>
                <th>Info</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {tamu.map((t) => (
                <tr key={t.id}>
                  <td>
                    {new Date(t.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                    })}
                  </td>
                  <td>{new Date(t.created_at).toLocaleDateString("id-ID")}</td>
                  <td>{t.name}</td>
                  <td>{t.company}</td>
                  <td>{t.phone}</td>
                  <td>{t.activity}</td>
                  <td>
                    {new Date(t.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{t.ruang_kerja}</td>
                  <td>{t.visit_id}</td>
                  <td>{t.status}</td>

                  <td>
                    <button
                      className="btn btn-outline-info btn-sm me-1"
                      onClick={() => {
                        const fotoMasuk = t.dokumentasi_in
                          ? `${apiHost}/storage/visitors/${t.dokumentasi_in}`
                          : "-";
                        const fotoKeluar = t.dokumentasi_out
                          ? `${apiHost}/storage/visitors/${t.dokumentasi_out}`
                          : "-";

                        setSelectedTamu({
                          Nama: t.name,
                          Perusahaan: t.company,
                          Telepon: t.phone,
                          Aktivitas: t.activity,
                          "Ruang Kerja": t.ruang_kerja,
                          "No VISIT / E-SIK": t.visit_id,
                          Status: t.status,
                          "Foto Masuk": fotoMasuk,
                          "Foto Keluar": fotoKeluar,
                          "Dibuat Pada": t.created_at,
                          "Diperbarui Pada": t.updated_at,
                        });
                        setShowPopup(true);
                      }}
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </td>

                  <td>
                    {t.status === "pending" && !uploading[t.id] && (
                      <>
                        <button
                          className="btn btn-success btn-sm d-flex align-items-center"
                          onClick={() => handleApproveClick(t.id)}
                          title="Approve (Upload Foto Masuk)"
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm d-flex align-items-center"
                          onClick={() => handleReject(t.id)}
                          title="Reject"
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </>
                    )}

                    {uploading[t.id] === "in" && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUploadFoto(e.target.files[0], t.id, "in")
                        }
                      />
                    )}

                    {t.status === "approved" && !uploading[t.id] && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          setUploading((prev) => ({ ...prev, [t.id]: "out" }))
                        }
                        title="Tamu Keluar (Upload Foto Keluar)"
                      >
                        <i className="bi-box-arrow-right"></i>
                      </button>
                    )}

                    {uploading[t.id] === "out" && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUploadFoto(e.target.files[0], t.id, "out")
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <InfoTamu
        open={showPopup}
        onClose={() => setShowPopup(false)}
        data={selectedTamu}
      />
    </div>
  );
}
