<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

require "koneksi.php";

/* =============================
   AMBIL SITE (sementara hardcode)
   Nanti bisa dari login/session
============================= */
$site = "TTC Teling"; // ganti sesuai kebutuhan

/* =============================
   PREFIX BERDASARKAN SITE
============================= */
$prefixMap = [
  "TTC Teling" => "MDO018",
  "TTC Paniki" => "MDO002"
];

$prefix = $prefixMap[$site] ?? "MDO000";

/* =============================
   BULAN ROMAWI
============================= */
$bulanRomawi = [
  "I","II","III","IV","V","VI",
  "VII","VIII","IX","X","XI","XII"
];

$bulan = $bulanRomawi[date("n") - 1];
$tahun = date("Y");

/* =============================
   AMBIL ID TERAKHIR DI SITE TERSEBUT
============================= */
$q = mysqli_query($koneksi, "
  SELECT id
  FROM berita_acara
  WHERE site='$site'
  ORDER BY id DESC
  LIMIT 1
");

$lastId = 0;

if ($q && mysqli_num_rows($q) > 0) {
  $row = mysqli_fetch_assoc($q);
  $lastId = intval($row['id']);
}

$nextId = $lastId + 1;

/* =============================
   FORMAT NOMOR
============================= */
$nomorBaru = "$prefix/$bulan/$tahun/$nextId";

echo json_encode([
  "status" => "success",
  "nomor" => $nomorBaru
]);

exit;