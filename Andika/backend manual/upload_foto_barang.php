<?php
// ===== CORS =====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ===== HANDLE PREFLIGHT =====
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ===== VALIDASI FILE =====
if (!isset($_FILES['foto'])) {
    echo json_encode([
        "status" => "error",
        "message" => "File foto tidak ditemukan"
    ]);
    exit;
}

$folder = "../uploads/barang/";
if (!is_dir($folder)) {
    mkdir($folder, 0777, true);
}

$ext = pathinfo($_FILES["foto"]["name"], PATHINFO_EXTENSION);
$filename = "barang_" . uniqid() . "." . $ext;
$path = $folder . $filename;

if (!move_uploaded_file($_FILES["foto"]["tmp_name"], $path)) {
    echo json_encode([
        "status" => "error",
        "message" => "Upload gagal"
    ]);
    exit;
}

echo json_encode([
    "status" => "success",
    "path" => "uploads/barang/" . $filename
]);
