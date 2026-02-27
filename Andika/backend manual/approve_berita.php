<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "koneksi.php";

$input = json_decode(file_get_contents("php://input"), true);

$id = isset($input['id']) ? intval($input['id']) : 0;

if ($id <= 0) {
  echo json_encode([
    "status" => "error",
    "message" => "ID tidak valid"
  ]);
  exit;
}

/* path TTD tetap */
$ttdPath = "/ttd/ttd_manager.png";

$update = mysqli_query($koneksi, "
  UPDATE berita_acara
  SET 
    approval_status = 'approved',
    ttd_approval = '$ttdPath'
  WHERE id = $id
");

if ($update) {
  echo json_encode([
    "status" => "success"
  ]);
} else {
  echo json_encode([
    "status" => "error",
    "message" => "Gagal approve"
  ]);
}
