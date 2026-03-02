<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require "koneksi.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["id_berita"], $input["nomor"], $input["barang"])) {
  echo json_encode(["status"=>"error","message"=>"Data tidak lengkap"]);
  exit;
}

foreach ($input["barang"] as $b) {
  mysqli_query($koneksi, "
    INSERT INTO barang_list
    (id_berita, nomor_berita, nama_barang, jumlah, tipe, sn, foto)
    VALUES (
      '{$input["id_berita"]}',
      '{$input["nomor"]}',
      '{$b["nama"]}',
      '{$b["jumlah"]}',
      '{$b["tipe"]}',
      '{$b["sn"]}',
      '{$b["foto"]}'
    )
  ");
}

echo json_encode(["status"=>"success"]);
