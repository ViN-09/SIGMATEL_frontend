import { useEffect, useMemo, useRef, useState } from "react";
import "./Landingsec.css";
import "./landing.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ApprovalTable from "./ApprovalTable";
import ModalInfo from "./ModalInfo";
import CameraModal from "./CameraModal";
import {
  formatTanggalWaktu,
  buildCandidates,
  dataUrlToFile,
  pickSavedFilename,
} from "./Helper";
import ImageWithFallback from "./ImageWithFallback";
import { getSITE, getUSER, HOST } from "../auth"
import { fetchTamu, updateStatusVisitor } from "./Visitor";

/* ===================== Main ===================== */
export default function Landingsec() {
  const userInfo = getUSER('teling');
  const username = userInfo.id ? userInfo.id : "unknown_user";
  const ttc = getSITE();
  const apiHost = HOST;

  useEffect(() => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("ttc", ttc);
    sessionStorage.setItem("host", apiHost);
  }, [username, ttc, apiHost]);

  let userID = 0;
  try {
    const u = JSON.parse(sessionStorage.getItem("userinfo"));
    if (u?.id != null) userID = u.id;
  } catch {
    userID = 0;
  }

  const [tamu, setTamu] = useState([]);
  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState(null);

  // modal kamera state
  const [cam, setCam] = useState({ open: false, id: null, type: "in" });


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

  const safeReadJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`);
    }
    return res.json();
  };

  useEffect(() => {
    const loadTamu = async () => {
      setLoading(true);
      const data = await fetchTamu();
      setTamu(data);
      setLoading(false);
    };
    loadTamu();
  }, [ttc]);


  // ✅ Approve: langsung buka modal kamera (type in)
  const handleApproveClick = (id) => {
    setUploading((prev) => ({ ...prev, [id]: "in" }));
    setCam({ open: true, id, type: "in" });
  };

  // ✅ Keluar: langsung buka modal kamera (type out)
  const handleKeluarClick = (id) => {
    setUploading((prev) => ({ ...prev, [id]: "out" }));
    setCam({ open: true, id, type: "out" });
  };


  const handleUploadFoto = async (file, id, type) => {
    if (!file) return;
    try {
      const json = await updateStatusVisitor(id, type, file, userID, ttc);

      if (!json.success) {
        showToast("Gagal update status: " + (json.message || "unknown"), "error");
        return;
      }

      const savedName = pickSavedFilename(json, type) || file.name;

      if (type === "in") {
        setTamu((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, status: "approved", dokumentasi_in: savedName }
              : t
          )
        );
        setUploading((prev) => ({ ...prev, [id]: false }));
        showToast("Tamu Berhasil Approved", "success");
      }

      if (type === "out") {
        setTamu((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, status: "selesai", dokumentasi_out: savedName } : t
          )
        );
        setTamu((prev) => prev.filter((t) => t.id !== id));
        setUploading((prev) => ({ ...prev, [id]: false }));
        showToast("Tamu Out", "success");
      }
    } catch (err) {
      console.error("Error upload foto:", err);
      showToast("Upload gagal, cek koneksi atau server API!", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(updateURL(id), {
        method: "POST",
        body: new URLSearchParams({ status: "rejected" }),
        credentials: "include",
        headers: {
          userid: String(userID),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const json = await safeReadJson(res);

      if (json.success) {
        setTamu((prev) => prev.filter((t) => t.id !== id));
        showToast("Tamu rejected", "success");
      } else {
        showToast(json.message || "Gagal reject", "error");
      }
    } catch (err) {
      console.error("Error reject:", err);
      showToast("Error reject", "error");
    }
  };

  const openInfo = (t) => {
    setSelectedTamu(t);
    setShowPopup(true);
  };

  const pendingCount = tamu.filter((t) => t.status === "pending").length;
  const approvedCount = tamu.filter((t) => t.status === "approved").length;

  return (
    <div className="vis-container">

      <ApprovalTable
        tamu={tamu}
        loading={loading}
        onOpenInfo={openInfo}
        onApprove={handleApproveClick}
        onReject={handleReject}
        onKeluar={handleKeluarClick}
      />


      {/* Modal Info */}
      <ModalInfo open={showPopup} onClose={() => setShowPopup(false)} apiHost={apiHost} tamu={selectedTamu} />

      {/* Modal Camera */}
      <CameraModal
        open={cam.open}
        onClose={() => {
          if (cam.id != null) setUploading((prev) => ({ ...prev, [cam.id]: false }));
          setCam({ open: false, id: null, type: "in" });
        }}
        title={cam.type === "in" ? "Foto Masuk (Approve)" : "Foto Keluar (Selesai)"}
        facingMode="environment"
        onSubmitFile={async (file) => {
          if (!cam.id) return;
          await handleUploadFoto(file, cam.id, cam.type);
        }}
      />
    </div>
  );
}