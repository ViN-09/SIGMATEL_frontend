/* ===================== Utils ===================== */

export function formatTanggalWaktu(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("id-ID");
}

export function buildCandidates(apiHost, fileName) {
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

export function dataUrlToFile(dataUrl, filename = "capture.jpg") {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export function pickSavedFilename(json, type) {
  const key = type === "in" ? "dokumentasi_in" : "dokumentasi_out";

  const v =
    json?.data?.[key] ??
    json?.visitor?.[key] ??
    json?.data?.visitor?.[key] ??
    json?.data?.data?.[key];

  return typeof v === "string" && v.trim() ? v.trim() : "";
}