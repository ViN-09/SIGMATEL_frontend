<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "koneksi.php";

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
  echo json_encode([
    "status" => "error",
    "message" => "ID tidak valid"
  ]);
  exit;
}

/* ===== HEADER ===== */
$q = mysqli_query($koneksi, "
  SELECT 
    id,
    nomor,
    tanggal,
    jenis,
    keterangan,
    pihakA_nama,
    pihakA_jabatan,
    pihakB_nama,
    pihakB_jabatan,
    created_at,
    ttd_penyerah,
    ttd_penerima,
    ttd_approval,
    bm_nama,
    staff_ttd_approval,
    staff_nama,
    approval_status
  FROM berita_acara
  WHERE id = $id
");

if (!$q || mysqli_num_rows($q) === 0) {
  echo json_encode([
    "status" => "error",
    "message" => "Data tidak ditemukan"
  ]);
  exit;
}

$header = mysqli_fetch_assoc($q);

/* ===== BARANG ===== */
$qBarang = mysqli_query($koneksi, "
  SELECT nama_barang, jumlah, tipe, sn,foto
  FROM barang_list
  WHERE id_berita = $id
");

$barang = [];
while ($b = mysqli_fetch_assoc($qBarang)) {
  $barang[] = $b;
}

/* ===== GABUNG DATA ===== */
$header["barang"] = $barang;

/* ===== RESPONSE ===== */
echo json_encode([
  "status" => "success",
  "data" => $header
]);
