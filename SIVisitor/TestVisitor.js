const API_HOST = "http://127.0.0.1:8000";

function getSiteConfig() {
  const raw = sessionStorage.getItem("userinfo");
  let user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  if (!user) {
    return {
      username: "unknown",
      ttc: "ttc_paniki",
      label: "Default",
    };
  }

  if (user.site === "TTC Teling") {
    return {
      username: user.name,
      ttc: "ttc_teling",
      label: "TTC Teling",
    };
  }

  if (user.site === "TTC Paniki") {
    return {
      username: user.name,
      ttc: "ttc_paniki",
      label: "TTC Paniki",
    };
  }

  // fallback
  return {
    username: user.name,
    ttc: "ttc_paniki",
    label: "TTC Paniki",
  };
}

async function safeReadJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`
    );
  }
  return res.json();
}

export async function fetchDoneVisitorsRaw() {
  const SITE = getSiteConfig();
  const ttc = SITE.ttc;
  const url = `${API_HOST}/api/${ttc}/visitor/completed`;

  try {
    console.log("fetchDoneVisitorsRaw SITE:", SITE);
    console.log("fetchDoneVisitorsRaw URL:", url);
    console.log("session userinfo:", sessionStorage.getItem("userinfo"));

    const res = await fetch(url, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await safeReadJson(res);
    console.log("fetchDoneVisitorsRaw response:", json);

    if (json.success) {
      return Array.isArray(json.data) ? json.data : [];
    }

    console.error("Gagal ambil data:", json.message);
    return [];
  } catch (err) {
    console.error("fetchDoneVisitorsRaw error:", err);
    return [];
  }
}

export async function updateStatusVisitor(id, type, file, userID) {
  const SITE = getSiteConfig();
  const ttc = SITE.ttc;
  const updateURL = `${API_HOST}/api/${ttc}/visitor/visitors/${id}/update-status`;

  const formData = new FormData();
  if (type === "in") formData.append("dokumentasi_in", file);
  if (type === "out") formData.append("dokumentasi_out", file);
  formData.append("status", type === "in" ? "approved" : "selesai");

  const res = await fetch(updateURL, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      userid: String(userID),
      Accept: "application/json",
    },
  });

  return res.json();
}

export async function fetchTamu() {
  const SITE = getSiteConfig();
  const ttc = SITE.ttc;
  const listURL = `${API_HOST}/api/${ttc}/visitor/waiting`;

  try {
    console.log("fetchTamu SITE:", SITE);
    console.log("fetchTamu URL:", listURL);

    const res = await fetch(listURL, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await safeReadJson(res);

    if (json?.success) {
      return json.data || [];
    }

    throw new Error(json?.message || "Gagal ambil data");
  } catch (err) {
    console.error("fetchTamu error:", err);
    return [];
  }
}