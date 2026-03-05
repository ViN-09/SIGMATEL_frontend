<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require "koneksi.php";

$input = $_POST;


// $id = intval($input['id'] ?? 0);
$user_id = $input['user_id'] ?? '';
$jabatan = $input['jabatan'] ?? '';
$ttd_staff = $input['ttd_staff'] ?? '';
$id_ba = $input['id_ba'] ?? 0;
  
if (!$user_id) {
  echo json_encode(["status"=>"error","message"=>"Data tidak valid"]);
  exit;
}


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
echo "qUser to data user Complite";

// $user = mysqli_fetch_assoc($qUser);

/* Pastikan bukan BM */
if ($jabatan === 'BM') {
  echo json_encode(["status"=>"error","message"=>"BM gunakan approve BM"]);
  exit;
}

/* Pastikan TTD ada */
if (empty($data_user['ttd_staff'])) {
  echo json_encode(["status"=>"error","message"=>"TTD staff belum diupload"]);
  exit;
}
echo "Kondisional Jabatan Komplit";

/* Path */
$ttd = '/ttd/' . $data_user['ttd_staff'];

$update = mysqli_query($koneksi,"
  UPDATE berita_acara
  SET 
    staff_ttd_approval='$ttd',
    staff_nama='{$data_user['Nama']}'
  WHERE id=$id_ba
");

echo "ttd Komplit";

if ($update) {
  echo json_encode(["status"=>"success"]);
} else {
  echo "LOLO";
  echo json_encode(["status"=>"error","message"=>mysqli_error($koneksi)]);
}