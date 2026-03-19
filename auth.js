// ==============================
// CONFIG
// ==============================
export const HOST = "http://127.0.0.1:8000";

const UserPaniki = {
  id: "MND24074312019",
  nama: "Hendry Kantohe",
  jabatan: "ME",
  site: "TTC Paniki",
  gambar: null,
  ttd: null,
}
const UserTeling = {
  id: "MND24074311051",
  Nama: "Franco Gino Bawiling",
  jabatan: "ME",
  site: "TTC Teling",
  gambar: null,
  ttd: null,
}
const UserTelingBM = {
  id: "MND24074311051",
  Nama: "Djefli",
  jabatan: "BM",
  site: "TTC Teling",
  gambar: null,
  ttd: null,
}

const UserPanikiBM = {
  id: "MND24074311051",
  Nama: "Didit",
  jabatan: "BM",
  site: "TTC Paniki",
  gambar: null,
  ttd: null,
}

// ==============================
// SITE HANDLER
// ==============================
export const getUSER = (type) => {
  const stored = sessionStorage.getItem("userinfo");

  // Jika sudah ada di sessionStorage, langsung return
  if (!type && stored) {
    return JSON.parse(stored);
  }

  let userValue = null;
  switch (type) {
    case "paniki":
      userValue = UserPaniki;
      break;
    case "teling":
      userValue = UserTeling;
      break;
    case "panikiBM":
      userValue = UserPanikiBM;
      break;
    case "telingBM":
      userValue = UserTelingBM;
      break;
    default:
      // Jika sessionStorage kosong, return null
      return stored ? JSON.parse(stored) : null;
  }

  // Simpan ke sessionStorage hanya kalau parameter valid
  if (userValue) {
    sessionStorage.setItem("userinfo", JSON.stringify(userValue));
  }

  return JSON.parse(sessionStorage.getItem("userinfo"));
};

export function sitesaperator(site) {
  const normalized = String(site || "")
    .trim()
    .toLowerCase();

  const map = {
    "TTC Teling": "ttc_teling",
    "TTC Paniki": "ttc_paniki",
  };

  //   console.log("sitesaperator input:", site, "normalized:", normalized, "mapped to:", map[normalized] || normalized.replace(/\s+/g, "_"));

  return map[normalized] || normalized.replace(/\s+/g, "_");
}

export const getSITE = () => {
  clearAllSession("site"); // DEV MODE: paksa refresh
  clearAllSession("ttc");

  try {
    const cachedSite = sessionStorage.getItem("site");
    const cachedTtc = sessionStorage.getItem("ttc");

    if (cachedSite && cachedSite.trim() !== "") {
      return cachedSite.trim().toLowerCase();
    }

    const raw = sessionStorage.getItem("userinfo");
    const user = raw ? JSON.parse(raw) : null;
    const site = user?.site;


    if (!site || String(site).trim() === "") {
      console.warn("SITE tidak ditemukan dari userinfo");
      return null;
    }

    const normalized = sitesaperator(site);
    sessionStorage.setItem("site", normalized);
    sessionStorage.setItem("ttc", normalized);

    return normalized;

  } catch (error) {
    console.error("Error getSITE:", error);
    return null;
  }
};

export const clearAllSession = (key = null) => {
  if (key) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.clear();
  }
};