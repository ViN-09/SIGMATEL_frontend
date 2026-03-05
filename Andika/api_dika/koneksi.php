<?php
$koneksi = mysqli_connect("localhost", "root", "", "ba_barang_inout");

if (!$koneksi) {
  echo json_encode([
    "status" => "error",
    "message" => "Koneksi database gagal"
  ]);
  exit;
}
