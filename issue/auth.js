import { HOST } from "../auth";
import { getSITE,getUSER } from "../auth";


export async function updateIssue(issue) {
  const host = HOST;
  const ttc = getSITE() || TTC_CODE;
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");

  const res = await fetch(`${host}/api/${ttc}/issue/update/${issue.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Info": JSON.stringify(userinfo),
    },
    body: JSON.stringify({
      status: issue.status,
      keterangan: issue.keterangan,
    }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal update issue");
  }

  return data;
}

export async function fetchIssues() {
  const host = HOST;
  const ttc = getSITE() || TTC_CODE;

  const res = await fetch(`${host}/api/${ttc}/issue/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // kalau butuh session
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal fetch issue list");
  }

  return data.data || []; // selalu return array
}

export async function addIssue(issue) {
  const host = HOST;
  const ttc = getSITE() || TTC_CODE;
  const userinfo = getUSER();

  const res = await fetch(`${host}/api/${ttc}/issue/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Info": JSON.stringify(userinfo),
    },
    body: JSON.stringify(issue),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal menambahkan issue");
  }

  return data;
}