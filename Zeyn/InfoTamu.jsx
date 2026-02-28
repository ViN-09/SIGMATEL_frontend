// InfoTamu.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./InfoTamu.css";

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[\s_]+/g, "");
}

function isProbablyUrl(v) {
  const s = String(v || "").trim();
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:");
}

function buildImageCandidates(apiHost, value, keyNorm) {
  if (!value || value === "-" || value === "NULL" || value === "null") return [];
  const v = String(value).trim();
  if (!v) return [];

  if (isProbablyUrl(v)) return [v];

  const base = String(apiHost || "").replace(/\/$/, "");
  if (!base) return [];

  const bust = `?t=${Date.now()}`;

  const preferredFolders = [];

  if (keyNorm.includes("tandatangan") || keyNorm.includes("signature") || keyNorm === "ttd") {
    preferredFolders.push("signatures", "signature", "ttd");
  }

  if (keyNorm.includes("foto") || keyNorm.includes("dokumentasi") || keyNorm.includes("image")) {
    preferredFolders.push("visitors", "visitor", "dokumentasi", "uploads");
  }

  const commonFolders = ["visitors", "visitor", "dokumentasi", "uploads", "signatures", "signature", "ttd"];
  const folders = Array.from(new Set([...preferredFolders, ...commonFolders]));

  const candidates = folders.map((folder) => `${base}/storage/${folder}/${v}${bust}`);
  candidates.push(`${base}/storage/${v}${bust}`);

  return candidates;
}

function ImageWithFallback({ apiHost, value, alt, keyNorm, className }) {
  const candidates = useMemo(() => buildImageCandidates(apiHost, value, keyNorm), [apiHost, value, keyNorm]);
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [value]);

  if (!value || value === "-" || candidates.length === 0) return <span>-</span>;

  return (
    <img
      src={candidates[idx]}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) setIdx((p) => p + 1);
      }}
    />
  );
}

export default function InfoTamu({ open = false, onClose = () => {}, data = {}, apiHost = "" }) {
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
      <div className="it-modal show" onMouseDown={(e) => e.stopPropagation()} tabIndex={-1}>
        <header className="it-header">
          <h3>Info Tamu Lengkap</h3>
          <button className="it-close" onClick={onClose} aria-label="Tutup">
            &times;
          </button>
        </header>

        <div className="it-body">
          {Object.entries(data).map(([key, value]) => {
            const formattedKey = String(key).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const k = normalizeKey(key);

            const isImageKey =
              k.includes("foto") ||
              k.includes("image") ||
              k.includes("dokumentasi") ||
              k.includes("tandatangan") ||
              k.includes("signature") ||
              k === "ttd";

            const hasValue =
              value !== null &&
              value !== undefined &&
              String(value).trim() !== "" &&
              value !== "-" &&
              value !== "NULL" &&
              value !== "null";

            return (
              <div key={key} className="it-row">
                <span className="it-label">{formattedKey}</span>
                <span className="it-value">
                  {isImageKey ? (
                    hasValue ? (
                      <ImageWithFallback apiHost={apiHost} value={value} keyNorm={k} alt={formattedKey} className="it-image" />
                    ) : (
                      "-"
                    )
                  ) : hasValue ? (
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