<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

require "koneksi.php";

$input = json_decode(file_get_contents("php://input"), true);

$user_id = $input['user_id'] ?? '';
$id_ba   = intval($input['id_ba'] ?? 0);

if (!$user_id || !$id_ba) {
    echo json_encode(["status"=>"error","message"=>"Data tidak valid"]);
    exit;
}

/* Ambil user */
$qUser = mysqli_query($koneksi,"
    SELECT Nama, jabatan, ttd_staff
    FROM user_bio
    WHERE id='$user_id'
");

if (!$qUser || mysqli_num_rows($qUser) === 0) {
    echo json_encode(["status"=>"error","message"=>"User tidak ditemukan"]);
    exit;
}

$data_user = mysqli_fetch_assoc($qUser);

/* Pastikan TTD ada */
if (empty($data_user['ttd_staff'])) {
    echo json_encode(["status"=>"error","message"=>"TTD belum diupload"]);
    exit;
}

/* Format path TTD */
$ttd = $data_user['ttd_staff'];
if (strpos($ttd, '/ttd/') === false) {
    $ttd = '/ttd/' . $ttd;
}

/* ========================= */
/* LOGIC BERDASARKAN JABATAN */
/* ========================= */

if ($data_user['jabatan'] === 'BM') {

    // APPROVE BM
    $update = mysqli_query($koneksi,"
        UPDATE berita_acara
        SET 
            approval_status='approved',
            ttd_approval='$ttd',
            bm_nama='{$data_user['Nama']}'
        WHERE id=$id_ba
    ");

} else {

    // APPROVE STAFF
    $update = mysqli_query($koneksi,"
        UPDATE berita_acara
        SET 
            staff_ttd_approval='$ttd',
            staff_nama='{$data_user['Nama']}'
        WHERE id=$id_ba
    ");
}

if ($update) {
    echo json_encode(["status"=>"success"]);
} else {
    echo json_encode([
        "status"=>"error",
        "message"=>mysqli_error($koneksi)
    ]);
}