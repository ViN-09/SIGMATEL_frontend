<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "koneksi.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
  echo json_encode(["status"=>"error","message"=>"Input kosong"]);
  exit;
}

/* ===== TEST SITE ===== */
$site = "TTC Teling"; // ganti jika mau Paniki

$nomor = $input['nomor'] ?? "";
$tanggal = $input['tanggal'] ?? ""; 
$jenis = $input['jenis'] ?? "";
$keterangan = $input['keterangan'] ?? "";

$pihakA_nama = $input['pihakA']['nama'] ?? "";
$pihakA_jabatan = $input['pihakA']['jabatan'] ?? "";
$pihakB_nama = $input['pihakB']['nama'] ?? "";
$pihakB_jabatan = $input['pihakB']['jabatan'] ?? "";

$ttd_penyerah = $input['ttd_penyerah'] ?? "";
$ttd_penerima = $input['ttd_penerima'] ?? "";

$insert = mysqli_query($koneksi, "
    INSERT INTO berita_acara (
        nomor,
        tanggal,
        jenis,
        keterangan,
        pihakA_nama,
        pihakA_jabatan,
        pihakB_nama,
        pihakB_jabatan,
        ttd_penyerah,
        ttd_penerima,
        approval_status,
        Site
    ) VALUES (
        '$nomor',
        '$tanggal',
        '$jenis',
        '$keterangan',
        '$pihakA_nama',
        '$pihakA_jabatan',
        '$pihakB_nama',
        '$pihakB_jabatan',
        '$ttd_penyerah',
        '$ttd_penerima',
        'pending',
        '$site'
    )
");

if ($insert) {
  echo json_encode([
    "status"=>"success",
    "id_berita"=>mysqli_insert_id($koneksi)
  ]);
} else {
  echo json_encode(["status"=>"error","message"=>"Gagal simpan"]);
}