import { HOST } from "../../Auth/Property";

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

export async function fetchDoneVisitors(ttc) {
  const safeTtc = String(ttc || "").trim();
  const apiHost = HOST;

  if (!safeTtc) {
    console.error("fetchDoneVisitors: ttc kosong");
    return [];
  }

  const url = `${apiHost}/api/${safeTtc}/visitor/completed`;

  try {
    console.log("fetchDoneVisitors HOST:", apiHost);
    console.log("fetchDoneVisitors TTC:", safeTtc);
    console.log("fetchDoneVisitors URL:", url);

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await safeReadJson(res);
    console.log("fetchDoneVisitors response:", json);

    if (json?.success) {
      const data = Array.isArray(json.data) ? json.data : [];

      data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return data;
    }

    console.error("Gagal ambil data:", json?.message || "Unknown error");
    return [];
  } catch (err) {
    console.error("fetchDoneVisitors error:", err);
    return [];
  }
}

export async function updateStatusVisitor(id, type, file, userID, ttc) {
  const safeTtc = String(ttc || "").trim();
  const apiHost = HOST;
  const updateURL = `${apiHost}/api/${safeTtc}/visitor/visitors/${id}/update-status`;

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
    headers: {
      userid: String(userID),
      Accept: "application/json",
    },
  });

  return res.json();
}

export async function fetchTamu(ttc) {
  const safeTtc = String(ttc || "").trim();
  const apiHost = HOST;
  const listURL = `${apiHost}/api/${safeTtc}/visitor/waiting`;

  try {
    console.log("fetchTamu HOST:", apiHost);
    console.log("fetchTamu TTC:", safeTtc);
    console.log("fetchTamu URL:", listURL);

    const res = await fetch(listURL, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const json = await safeReadJson(res);

    if (json?.success) {
      return Array.isArray(json.data) ? json.data : [];
    }

    throw new Error(json?.message || "Gagal ambil data");
  } catch (err) {
    console.error("fetchTamu error:", err);
    return [];
  }
}