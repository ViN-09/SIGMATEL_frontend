<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require "koneksi.php";

$input = $_POST;


$user_id = $input['user_id'] ?? '';
$jabatan = $input['jabatan'] ?? '';
$ttd_staff = $input['ttd_staff'] ?? '';
$id_ba = $input['id_ba'] ?? 0;


if (!$user_id) {
  echo json_encode(["status"=>"error","message"=>"Data tidak valid"]);
  exit;
}


/* Ambil user */
$qUser = mysqli_query($koneksi,"
  SELECT Nama, jabatan, ttd_staff
  FROM user_bio
  WHERE id='$user_id'
");

$data_user = mysqli_fetch_assoc($qUser);
// var_dump($data_user);
echo "Ambil Untuk TTD Complite";

if (!$qUser || mysqli_num_rows($qUser) === 0) {
  echo json_encode(["status"=>"error","message"=>"User tidak ditemukan"]);
  exit;
}




if ($data_user['jabatan'] !== 'BM') {
  echo json_encode(["status"=>"error","message"=>"Hanya BM yang bisa approve"]);
  exit;
}

/* Path TTD */
// $ttd = '/ttd/' . $data_user['ttd_staff'];

$ttd = $data_user['ttd_staff'];
if (strpos($ttd, '/ttd/') === false) {
  $ttd = '/ttd/' . $ttd;
}
/* Update */
mysqli_query($koneksi,"
  UPDATE berita_acara
  SET 
    approval_status='approved',
    ttd_approval='$ttd',
    bm_nama='{$data_user['Nama']}'
  WHERE id=$id_ba
");

echo json_encode(["status"=>"success"]);