import React, { useEffect, useRef, useState } from "react";

function dataUrlToFile(dataUrl, filename = "capture.jpg") {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export default function CameraModal({ open, onClose, onSubmitFile, title, facingMode = "environment" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [supported, setSupported] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  const stop = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const start = async () => {
    setError("");
    setStarting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setSupported(true);
    } catch (e) {
      setSupported(false);
      setError("Kamera tidak bisa diakses.");
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    start();
    return () => stop();
  }, [open]);

  const captureAndSubmit = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    setFlash(true);
    setTimeout(() => setFlash(false), 120);

    const file = dataUrlToFile(canvas.toDataURL("image/jpeg", 0.9));
    await onSubmitFile(file);
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, width: "min(560px,100%)" }} onClick={(e) => e.stopPropagation()}>
        <div className="p-3 border-bottom d-flex">
          <strong>{title}</strong>
          <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={onClose}>Tutup</button>
        </div>

        <div className="p-3">
          {supported ? (
            <>
              <video ref={videoRef} playsInline muted style={{ width: "100%", borderRadius: 10 }} />
              <button className="btn btn-primary mt-3 w-100" onClick={captureAndSubmit} disabled={starting}>
                Capture & Simpan
              </button>
            </>
          ) : (
            <>
              <div>{error}</div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await onSubmitFile(file);
                  onClose();
                }
              }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}