<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require "koneksi.php";

/* OPTIONAL: filter by site */
$site = "TTC Teling"; // bisa dynamic nanti

$where = [];


// kondisi WAJIB (list selesai)
$where[] = "site='$site'";
$where[] = "staff_ttd_approval IS NOT NULL";
$where[] = "ttd_approval IS NOT NULL";
$where[] = "approval_status = 'approved'";

// filter optional
if (!empty($_GET['dari']) && !empty($_GET['sampai'])) {
    $where[] = "tanggal BETWEEN '{$_GET['dari']}' AND '{$_GET['sampai']}'";
}

if (!empty($_GET['jenis'])) {
    $where[] = "jenis = '{$_GET['jenis']}'";
}

// gabungkan semua
$sql = "
SELECT 
  ba.id,
  ba.nomor,
  ba.tanggal,
  ba.jenis,
  ba.keterangan,
  ba.pihakA_nama,
  ba.pihakA_jabatan,
  ba.pihakB_nama,
  ba.pihakB_jabatan,
  ba.staff_nama,
  ba.approval_status,
  ba.site,
JSON_ARRAYAGG(
    JSON_OBJECT(
        'nama', bl.nama_barang,
        'jumlah', bl.jumlah
    )
) AS barang
FROM berita_acara ba
LEFT JOIN barang_list bl ON bl.id_berita = ba.id
";

if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " GROUP BY ba.id ORDER BY ba.id DESC";

$query = mysqli_query($koneksi, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
  $data[] = $row;
}

echo json_encode([
  "status" => "success",
  "data" => $data
]);