// InfoTamu.jsx
import React, { useEffect } from "react";
import "./InfoTamu.css";

export default function InfoTamu({ open = false, onClose = () => {}, data = {} }) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="it-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div
        className="it-modal show"
        onMouseDown={(e) => e.stopPropagation()} // biar klik di dalam modal nggak close
        tabIndex={-1}
      >
        <header className="it-header">
          <h3>Info Tamu Lengkap</h3>
          <button className="it-close" onClick={onClose} aria-label="Tutup">
            &times;
          </button>
        </header>

        <div className="it-body">
          {Object.entries(data).map(([key, value]) => {
            const formattedKey = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            const isImageKey =
              key.toLowerCase() === "fotomasuk" ||
              key.toLowerCase() === "foto masuk" ||
              key.toLowerCase() === "foto keluar" ||
              key.toLowerCase() === "fotokeluar";

            const isValidImage =
              value && value !== "-" && value !== "NULL" && value !== "null";

            return (
              <div key={key} className="it-row">
                <span className="it-label">{formattedKey}</span>
                <span className="it-value">
                  {isImageKey ? (
                    isValidImage ? (
                      <img
                        src={value}
                        alt={formattedKey}
                        className="it-image"
                        loading="lazy"
                      />
                    ) : (
                      "-"
                    )
                  ) : value !== null && value !== undefined && value !== "" ? (
                    String(value)
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <footer className="it-footer">
          <button className="it-btn it-btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </footer>
      </div>
    </div>
  );
}
