<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "koneksi.php";

if (!$koneksi) {
  echo json_encode([
    "status" => "error",
    "message" => "Koneksi database gagal"
  ]);
  exit;
}

/*
  Ambil:
  - berita acara
  - serial number dari barang_list
*/
$sql = "
  SELECT
    ba.id AS id_berita,
    ba.nomor,
    ba.tanggal,
    ba.jenis,
    ba.keterangan,
    ba.pihakA_nama,
    ba.pihakA_jabatan,
    ba.pihakB_nama,
    ba.pihakB_jabatan,
    ba.created_at,
    GROUP_CONCAT(bl.sn SEPARATOR ', ') AS sn
  FROM berita_acara ba
  LEFT JOIN barang_list bl ON bl.id_berita = ba.id
  GROUP BY ba.id
  ORDER BY ba.created_at DESC
";

$query = mysqli_query($koneksi, $sql);

if (!$query) {
  echo json_encode([
    "status" => "error",
    "message" => mysqli_error($koneksi)
  ]);
  exit;
}

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
  $data[] = $row;
}

echo json_encode([
  "status" => "success",
  "data" => $data
]);
