import { HOST, getSITE, getUSER } from "../auth";

export async function fetchDoneVisitors(filters = {}) {
  const user = getUSER();
  const apiHost = HOST;
  const ttc = getSITE();

  const params = new URLSearchParams();
  if (filters?.q) params.set("q", String(filters.q));
  if (filters?.searchBy) params.set("searchBy", String(filters.searchBy));
  if (filters?.dateFrom) params.set("dateFrom", String(filters.dateFrom));
  if (filters?.dateTo) params.set("dateTo", String(filters.dateTo));

  if (filters?.all) params.set("all", "1");

  const qs = params.toString();
  const listURL = `${apiHost}/api/${ttc}/visitor/visitors/completed${qs ? `?${qs}` : ""}`;

  const safeReadJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(
        `Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`
      );
    }
    return res.json();
  };

  try {
    const res = await fetch(listURL, { credentials: "include" });
    const json = await safeReadJson(res);
    if (!json?.success) throw new Error(json?.message || "Gagal ambil data");

    const all = Array.isArray(json.data) ? json.data : [];
    const done = all.filter((t) => {
      const okStatus = String(t?.status || "").toLowerCase() === "selesai";
      const hasIn = !!String(t?.dokumentasi_in || "").trim();
      const hasOut = !!String(t?.dokumentasi_out || "").trim();
      return okStatus && hasIn && hasOut;
    });

    done.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return done;
  } catch (err) {
    console.error("fetchDoneVisitors error:", err);
    return [];
  }
}

export async function updateStatusVisitor(id, type, file, userID) {
  const apiHost = HOST;
  const ttc = getSITE();
  const updateURL = `${apiHost}/api/${ttc}/visitor/visitors/${id}/update-status`;

  const formData = new FormData();
  if (type === "in") formData.append("dokumentasi_in", file);
  if (type === "out") formData.append("dokumentasi_out", file);

  formData.append(
    "status",
    type === "in" ? "approved" : type === "out" ? "selesai" : "rejected"
  );

  const res = await fetch(updateURL, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: { userid: String(userID) },
  });

  return res.json();
}

export async function fetchTamu() {
  const apiHost = HOST;
  const ttc = getSITE();
  const listURL = `${apiHost}/api/${ttc}/visitor/waiting`;

  const safeReadJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(
        `Bukan JSON. status=${res.status}. body awal: ${text.slice(0, 120)}`
      );
    }
    return res.json();
  };

  try {
    const res = await fetch(listURL, { credentials: "include" });
    const json = await safeReadJson(res);

    if (json.success) return json.data || [];
    throw new Error(json.message || "Gagal ambil data");
  } catch (err) {
    console.error("fetchTamu error:", err);
    return [];
  }
}