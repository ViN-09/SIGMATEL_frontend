import React, { useMemo, useState, useEffect } from "react";

/* ===================== Utils (dipindah ikut component) ===================== */
function formatTanggalWaktu(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("id-ID");
}

function buildCandidates(apiHost, fileName) {
  if (!fileName || fileName === "-") return [];
  const clean = String(fileName).trim();
  if (!clean) return [];

  const base = apiHost.replace(/\/$/, "");
  const bust = `?t=${Date.now()}`;

  return [
    `${base}/storage/visitors/${clean}${bust}`,
    `${base}/storage/visitor/${clean}${bust}`,
    `${base}/storage/dokumentasi/${clean}${bust}`,
    `${base}/storage/uploads/${clean}${bust}`,
    `${base}/storage/${clean}${bust}`,
  ];
}

function ImageWithFallback({ apiHost, fileName, alt }) {
  const candidates = useMemo(() => buildCandidates(apiHost, fileName), [apiHost, fileName]);
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [fileName]);

  if (!fileName || fileName === "-" || candidates.length === 0) return <span>-</span>;

  const src = candidates[idx];

  return (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: "100%",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
      onError={() => {
        if (idx < candidates.length - 1) setIdx((p) => p + 1);
      }}
    />
  );
}

/* ===================== Component ===================== */
export default function ModalInfo({ open, onClose, apiHost, tamu }) {
  if (!open) return null;

  const fotoMasukName = tamu?.dokumentasi_in || "";
  const fotoKeluarName = tamu?.dokumentasi_out || "";
  const signName = tamu?.signature || "";
  const signatureUrl = signName
    ? `${apiHost.replace(/\/$/, "")}/storage/signatures/${signName}?t=${Date.now()}`
    : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
        padding: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: "min(820px, 100%)",
          maxHeight: "85vh",
          overflow: "auto",
          padding: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center mb-2">
          <h5 className="mb-0">Info Tamu</h5>
          <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div className="row g-2" style={{ fontSize: 14 }}>
          <div className="col-md-6">
            <div className="p-2 border rounded">
              <div><b>Nama</b>: {tamu?.name || "-"}</div>
              <div><b>Perusahaan</b>: {tamu?.company || "-"}</div>
              <div><b>Telepon</b>: {tamu?.phone || "-"}</div>
              <div><b>Jenis ID</b>: {tamu?.id_type || "-"}</div>
              <div><b>No ID</b>: {tamu?.id_number || "-"}</div>
              <div><b>Aktivitas</b>: {tamu?.activity || "-"}</div>
              <div><b>Ruang Kerja</b>: {tamu?.ruang_kerja || "-"}</div>
              <div><b>No VISIT / E-SIK</b>: {tamu?.visit_id || "-"}</div>
              <div><b>Status</b>: {tamu?.status || "-"}</div>
              <div><b>Dibuat</b>: {formatTanggalWaktu(tamu?.created_at)}</div>
              <div><b>Update</b>: {formatTanggalWaktu(tamu?.updated_at)}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-2 border rounded mb-2">
              <div><b>Tanda Tangan</b></div>
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  alt="Tanda Tangan"
                  style={{ maxWidth: "100%", borderRadius: 10 }}
                />
              ) : <div>-</div>}
            </div>

            <div className="p-2 border rounded mb-2">
              <div><b>Foto Masuk</b></div>
              <ImageWithFallback apiHost={apiHost} fileName={fotoMasukName} />
            </div>

            <div className="p-2 border rounded">
              <div><b>Foto Keluar</b></div>
              <ImageWithFallback apiHost={apiHost} fileName={fotoKeluarName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}