const API = "http://localhost/BA_barang_in-out/api";

export const getBeritaAcara = async () => {
  const res = await fetch(`${API}/get_berita_acara.php`);
  const json = await res.json();
  console.log(json);

  if (json.status !== "success") {
    throw new Error(json.message || "Gagal ambil data BA");
  }

  return json.data;
  
};
