import { getUser, HOST } from "../auth";

const host = HOST;

export const getBeritaAcara = async (jabatan) => {


console.log("jabatan user:", jabatan);

const res = await fetch(`${host}/get_berita_acara.php`, {
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded",
},
body: new URLSearchParams({
jabatan: jabatan || ""
})
});

if (!res.ok) {
throw new Error("Network error");
}

const json = await res.json();

if (json.status !== "success") {
throw new Error(json.message || "Gagal ambil data BA");
}

return json.data ?? [];
};


export const getBeritaSelesai = async () => {
  const res = await fetch(
    `${host}/get_berita_selesai.php`
  );

  const json = await res.json();

  if (json.status !== "success") {
    throw new Error("Gagal ambil BA selesai");
  }

  return json.data ?? [];
};