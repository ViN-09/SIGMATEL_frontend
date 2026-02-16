<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
error_reporting(0);
require "koneksi.php";

// ✅ AMBIL JSON DARI REACT
$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

// ✅ CEK JSON VALID
if (!$input) {
  echo json_encode([
    "status" => "error",
    "message" => "Data JSON kosong atau tidak valid"
  ]);
  exit;
}

$nomor       = $input["nomor"] ?? "";
$tanggal     = $input["tanggal"] ?? "";
$jenis       = $input["jenis"] ?? "";
$keterangan  = $input["keterangan"] ?? "";

$pihakA_nama = $input["pihakA"]["nama"] ?? "";
$pihakA_jab  = $input["pihakA"]["jabatan"] ?? "";

$pihakB_nama = $input["pihakB"]["nama"] ?? "";
$pihakB_jab  = $input["pihakB"]["jabatan"] ?? "";

// ✅ VALIDASI WAJIB
if ($nomor == "" || $tanggal == "") {
  echo json_encode([
    "status" => "error",
    "message" => "Nomor atau Tanggal kosong"
  ]);
  exit;
}

// ✅ INSERT KE DATABASE
$sql = "INSERT INTO berita_acara
(nomor, tanggal, jenis, keterangan, pihakA_nama, pihakA_jabatan, pihakB_nama, pihakB_jabatan)
VALUES (
'$nomor',
'$tanggal',
'$jenis',
'$keterangan',
'$pihakA_nama',
'$pihakA_jab',
'$pihakB_nama',
'$pihakB_jab'
)";

$result = mysqli_query($koneksi, $sql);

if ($result) {
  $id_berita = mysqli_insert_id($koneksi);

  echo json_encode([
    "status" => "success",
    "id_berita" => $id_berita
  ]);
} else {
  echo json_encode([
    "status" => "error",
    "message" => mysqli_error($koneksi)
  ]);
}

