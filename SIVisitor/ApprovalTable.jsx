import React from "react";

export default function ApprovalTable({
  tamu,
  loading,
  onOpenInfo,
  onApprove,
  onReject,
  onKeluar,
}) {
  const pendingCount = tamu.filter((t) => t.status === "pending").length;
  const approvedCount = tamu.filter((t) => t.status === "approved").length;

  return (
    <>
      {/* SUMMARY */}
      <section className="summary-section">
        <div className="summary-card bg-red">
          <i className="bi bi-person summary-icon text-white"></i>
          <div className="summary-text">
            <div className="summary-title">Waiting Approval</div>
            <div className="summary-value">{pendingCount}</div>
          </div>
        </div>

        <div className="summary-card bg-green">
          <i className="bi bi-check-circle summary-icon text-white"></i>
          <div className="summary-text">
            <div className="summary-title">Tamu Approved</div>
            <div className="summary-value">{approvedCount}</div>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="table-section" id="approval-list">
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
  {tamu.length === 0 && !loading && (
    <tr>
      <td colSpan={12} style={{ textAlign: "center", padding: 18, opacity: 0.7 }}>
        Data kosong / belum ada tamu.
      </td>
    </tr>
  )}

  {tamu.map((t) => (
    <tr key={t.id}>
      <td data-label="Hari">
        {new Date(t.created_at).toLocaleDateString("id-ID", {
          weekday: "long",
        })}
      </td>

      <td data-label="Tanggal">
        {new Date(t.created_at).toLocaleDateString("id-ID")}
      </td>

      <td data-label="Nama Lengkap">{t.name}</td>

      <td data-label="Perusahaan">{t.company}</td>

      <td data-label="No. Telepon">{t.phone}</td>

      <td data-label="Aktivitas">{t.activity}</td>

      <td data-label="Jam">
        {new Date(t.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>

      <td data-label="Ruang Kerja">{t.ruang_kerja}</td>

      <td data-label="No. VISIT/E SIK">{t.visit_id}</td>

      <td data-label="Status">
        <span className={`status-badge status-${t.status}`}>
          {t.status}
        </span>
      </td>

      <td data-label="Info">
        <button
          className="btn btn-outline-info btn-sm"
          onClick={() => onOpenInfo(t)}
        >
          <i className="bi bi-info-circle"></i>
        </button>
      </td>

      <td data-label="Aksi">
        {t.status === "pending" && (
          <div className="d-flex gap-1">
            <button
              className="btn btn-success btn-sm"
              onClick={() => onApprove(t.id)}
            >
              <i className="bi bi-check-circle"></i>
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onReject(t.id)}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        )}

        {t.status === "approved" && (
          <button
            className="btn btn-warning btn-sm"
            onClick={() => onKeluar(t.id)}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        )}

        {t.status === "selesai" && (
          <span style={{ fontSize: 12, opacity: 0.7 }}>—</span>
        )}
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </section>
    </>
  );
}