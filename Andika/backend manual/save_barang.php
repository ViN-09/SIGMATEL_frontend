<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "koneksi.php";

$raw = file_get_contents("php://input");
$input = json_decode($raw, true);


if (
  !$input ||
  !isset($input["id_berita"]) ||
  !isset($input["nomor"]) ||
  !isset($input["barang"])
) {
  echo json_encode([
    "status" => "error",
    "message" => "Data barang, ID berita, atau nomor berita kosong"
  ]);
  exit;
}

$id_berita = $input["id_berita"];
$nomor     = $input["nomor"];
$barangList = $input["barang"];


foreach ($barangList as $b) {
  $nama   = $b["nama"] ?? "";
  $jumlah = $b["jumlah"] ?? 0;
  $tipe   = $b["tipe"] ?? "";
  $sn     = $b["sn"] ?? "";

  mysqli_query($koneksi, "
    INSERT INTO barang_list
    (id_berita, nomor_berita, nama_barang, jumlah, tipe, sn)
    VALUES (
      '$id_berita',
      '$nomor',
      '$nama',
      '$jumlah',
      '$tipe',
      '$sn'
    )
  ");
}

echo json_encode([
  "status" => "success"
]);
