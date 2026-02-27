const API_HOST = "http://127.0.0.1:8000";
const TTC_CODE = "ttc_paniki";

export async function fetchDapot() {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;
  const urlTest = `${host}/api/${ttc}/data_potensi2/fullDapot`;
  console.log("Fetching Dapot from URL:", urlTest);
  const res = await fetch(`${host}/api/${ttc}/data_potensi2/fullDapot`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) throw new Error(data.message || "Gagal fetch data potensi");

  return {
    data_potesi_list: data.data_potesi_list || [],
    datapotensi: data.datapotensi || {},
  };
}


export async function crudDapot(payload) {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

  try {
    const res = await fetch(`${host}/api/${ttc}/data_potensi2/crudDapot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data.message || `Gagal melakukan operasi CRUD (status ${res.status})`);
    }

    return data;
  } catch (err) {

    throw err;
  }
}