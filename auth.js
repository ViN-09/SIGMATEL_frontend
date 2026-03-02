// ==============================
// CONFIG
// ==============================
export const HOST = "http://127.0.0.1:8000";

const UserPaniki = {
  nama: "MND24074312019",
  jabatan: "Hendry Kantohe",
  site: "TTC Paniki",
  gambar: null,
  ttd: null,
}
const UserTeling = {
  nama: "MND24074311051",
  jabatan: "Franco Gino Bawiling",
  site: "TTC Teling",
  gambar: null,
  ttd: null,
}

// ==============================
// SITE HANDLER
// ==============================
export const getUSER = (type) => {
    let userValue = null;
    switch (type) {
        case "paniki":
            userValue = UserPaniki;
            break;
        case "teling":
            userValue = UserTeling;
            break;
        default:
            return null;
    }

    // Simpan ke sessionStorage
    sessionStorage.setItem("userinfo", JSON.stringify(userValue));
    // Return dari sessionStorage (biar konsisten)
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

  try {
    const cachedSite = sessionStorage.getItem("site");

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