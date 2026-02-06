<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
error_reporting(0);

require "koneksi.php";

$bulanRomawi = [
  "I","II","III","IV","V","VI",
  "VII","VIII","IX","X","XI","XII"
];

$bulan = $bulanRomawi[date("n") - 1];
$tahun = date("Y");

$query = "
  SELECT nomor 
  FROM berita_acara
  WHERE nomor LIKE '%/$bulan/$tahun/%'
  ORDER BY id DESC 
  LIMIT 1
";

$result = mysqli_query($koneksi, $query);

$urutan = 1;

if ($result && mysqli_num_rows($result) > 0) {
  $row = mysqli_fetch_assoc($result);
  $pecah = explode("/", $row["nomor"]);
  $urutan = intval(end($pecah)) + 1;
}

$urutanFormatted = str_pad($urutan, 3, "0", STR_PAD_LEFT);
$nomorBaru = "MDO018/$bulan/$tahun/$urutanFormatted";

echo json_encode([
  "status" => "success",
  "nomor" => $nomorBaru
]);
exit;
