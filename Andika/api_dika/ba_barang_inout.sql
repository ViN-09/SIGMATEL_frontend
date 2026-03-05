-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 05, 2026 at 07:08 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ba_barang_inout`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang_list`
--

CREATE TABLE `barang_list` (
  `id` int NOT NULL,
  `id_berita` int NOT NULL,
  `nomor_berita` varchar(50) DEFAULT NULL,
  `nama_barang` varchar(100) DEFAULT NULL,
  `jumlah` int DEFAULT NULL,
  `tipe` varchar(100) DEFAULT NULL,
  `sn` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `barang_list`
--

INSERT INTO `barang_list` (`id`, `id_berita`, `nomor_berita`, `nama_barang`, `jumlah`, `tipe`, `sn`, `created_at`, `foto`) VALUES
(187, 263, 'MDO018/III/2026/1', 'Wooden Box', 17, 'BOX', '-', '2026-03-04 03:18:17', 'uploads/barang/barang_69a7a478e7614.jpeg'),
(188, 263, 'MDO018/III/2026/1', 'HIDRANT', 1, 'BUAH', '-', '2026-03-04 03:18:17', 'uploads/barang/barang_69a7a478ef6ec.jpeg'),
(189, 263, 'MDO018/III/2026/1', 'TABUNG POMPA', 1, 'BUAH', '-', '2026-03-04 03:18:17', 'uploads/barang/barang_69a7a478f3fb4.jpeg'),
(190, 263, 'MDO018/III/2026/1', 'MESIN HYDRANT', 1, 'BUAH', '-', '2026-03-04 03:18:17', 'uploads/barang/barang_69a7a47904e9c.jpeg'),
(191, 264, 'MDO018/III/2026/264', 'MODUL RECTIFIER', 1, 'MODUL', '-', '2026-03-04 03:19:35', 'uploads/barang/barang_69a7a4c70852d.jpeg'),
(192, 265, 'MDO018/III/2026/265', 'Apar Lithium 6 KG', 10, 'PCS', '-', '2026-03-04 03:21:37', 'uploads/barang/barang_69a7a541d25c1.jpeg'),
(193, 265, 'MDO018/III/2026/265', 'Box Apar', 10, 'PCS', '-', '2026-03-04 03:21:37', 'uploads/barang/barang_69a7a541d7c3c.jpeg'),
(194, 266, 'MDO018/III/2026/266', 'Laptop', 2, 'Laptop Asus', '-', '2026-03-04 03:49:31', 'uploads/barang/barang_69a7abcb30878.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `berita_acara`
--

CREATE TABLE `berita_acara` (
  `id` int NOT NULL,
  `nomor` varchar(50) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `jenis` varchar(50) DEFAULT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `pihakA_nama` varchar(100) DEFAULT NULL,
  `pihakA_jabatan` varchar(100) DEFAULT NULL,
  `pihakB_nama` varchar(100) DEFAULT NULL,
  `pihakB_jabatan` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ttd_penyerah` longtext,
  `ttd_penerima` longtext,
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approved_at` datetime DEFAULT NULL,
  `ttd_approval` longtext,
  `site` varchar(100) DEFAULT NULL,
  `bm_nama` varchar(150) DEFAULT NULL,
  `staff_approval_status` varchar(20) DEFAULT 'pending',
  `staff_ttd_approval` varchar(255) DEFAULT NULL,
  `staff_nama` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `berita_acara`
--

INSERT INTO `berita_acara` (`id`, `nomor`, `tanggal`, `jenis`, `keterangan`, `pihakA_nama`, `pihakA_jabatan`, `pihakB_nama`, `pihakB_jabatan`, `created_at`, `ttd_penyerah`, `ttd_penerima`, `approval_status`, `approved_at`, `ttd_approval`, `site`, `bm_nama`, `staff_approval_status`, `staff_ttd_approval`, `staff_nama`) VALUES
(263, 'MDO018/III/2026/1', '2026-03-10', 'MASUK', 'Barang Vendor PT. CIS', 'ONAL ', 'PT. CIS', '', '', '2026-03-04 03:18:16', 'data:image/png;base64,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', '', 'pending', NULL, NULL, 'TTC Teling', NULL, 'pending', '/ttd/rizky_ttd.png', 'Rizky Walangadi'),
(264, 'MDO018/III/2026/264', '2026-03-05', 'KELUAR', 'MODUL RECTIFIER KE TTC PANIKI', '', '', 'Yoel', 'TTC Paniki', '2026-03-04 03:19:35', '', 'data:image/png;base64,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', 'pending', NULL, NULL, 'TTC Teling', NULL, 'pending', '/ttd/rizky_ttd.png', 'Rizky Walangadi'),
(265, 'MDO018/III/2026/265', '2026-03-05', 'MASUK', 'Hydrant Masuk Dari GSD', 'I MADE WIJAYA', 'PT. GSD', '', '', '2026-03-04 03:21:37', 'data:image/png;base64,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', '', 'approved', NULL, '/ttd/djefli_ttd.png', 'TTC Teling', 'Djefli', 'pending', '/ttd/rizky_ttd.png', 'Rizky Walangadi'),
(266, 'MDO018/III/2026/266', '2026-03-04', 'KELUAR', 'Tes Barang Keluar', '', '', 'Naula', 'Paniki', '2026-03-04 03:49:31', '', 'data:image/png;base64,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', 'approved', NULL, '/ttd/djefli_ttd.png', 'TTC Teling', 'Djefli', 'pending', '/ttd/rizky_ttd.png', 'Rizky Walangadi');

-- --------------------------------------------------------

--
-- Stand-in structure for view `berita_acara_clean`
-- (See below for the actual view)
--
CREATE TABLE `berita_acara_clean` (
`approval_status` enum('pending','approved','rejected')
,`asal_staff` varchar(100)
,`asal_tamu` varchar(100)
,`id` int
,`jenis` varchar(50)
,`nomor` varchar(50)
,`staff_nama` varchar(255)
,`tamu_nama` varchar(100)
,`tanggal` date
);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `auth` int DEFAULT NULL,
  `password` varchar(190) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `auth`, `password`) VALUES
('22074311002', NULL, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('22074311004', NULL, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('7220004350', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND220743109', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311001', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311005', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311006', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311007', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311012', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074311014', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND2207431102', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074312026', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22074312053', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND220743124', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22084311043', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22084311045', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND22084311046', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24014311047', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24014311048', 1, '$2y$12$p7VPxckaOE4SIlkljnuM6OycELf7cbcU7.WM.VUlYcPSXm0fL1HC.'),
('MND24014312055', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24024311049', 0, '$2y$12$OKI.UOhdKrd79BRtDZBzCuwt0woWHnjiMLakHPPGiqTwMVwSYDcda'),
('MND24074311051', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074311060', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312015', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312019', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312021', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312033', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312040', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312046', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312050', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND24074312058', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25054312059', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25054312060', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25094311054', 1, '$2y$12$qDV./0fQ0JmrVSCh6FxFu.Py2pnVo0RnDjgpwMChhgT.qVD0/Mr2G'),
('MND25094312061', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25094312062', 0, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('MND25104311055', 1, '$2y$10$mSelp.HLd7BTAuw15ZOm9.tijUhqHf2l4WqYLPYiEMNBTWx9Lz.ru'),
('TEMP-PANIKI', 0, '$2y$12$QGuOiyEXVQVOgEbfMEbfdubCFbVwYxLcGDe7P/X5/iwOd13e5uVIW');

-- --------------------------------------------------------

--
-- Table structure for table `user_bio`
--

CREATE TABLE `user_bio` (
  `id` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nama` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `site` varchar(99) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tl` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Alamat` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `noTELP` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gambar` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `idx` tinyint(1) DEFAULT NULL,
  `ttd_staff` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_bio`
--

INSERT INTO `user_bio` (`id`, `Nama`, `jabatan`, `site`, `tl`, `Alamat`, `noTELP`, `email`, `gambar`, `idx`, `ttd_staff`) VALUES
('22074311002', 'Fikri bualo', 'HK', 'TTC Teling', '1984-10-15', 'Sea', '82189223084', 'ttc1telingmanado@gmail.com', '0', NULL, NULL),
('22074311004', 'Laurin Maria Kalalo', 'HK', 'TTC Teling', '1997-06-04', 'Paniki Bawah', '85236366886', 'laurinkalalo28@gmail.com', 'C55CE736-D975-40CF-94F0-4D93E58BB351 - Laurin Kalalo.jpeg', NULL, NULL),
('7220004350', 'Alfian Arifin', 'ME', 'TTC Teling', '2000-08-28', 'Perum paniki', '82187663782', 'fianarifin20@gmail.com', 'WhatsApp Image 2024-10-12 at 19.55.35.jpeg', NULL, NULL),
('MND220743109', 'Yusri Radjaku', 'Security', 'TTC Teling', '1976-09-14', 'Banjer lingkungan 3', '82297528803', 'yusrimaldini02@gmail.com', '0', NULL, NULL),
('MND22074311001', 'Djefli', 'BM', 'TTC Teling', '1976-07-12', 'Jl.14.Februari 06 Teling Bawah', '8124419276', 'djefli76@gmail.com', '0', NULL, 'djefli_ttd.png'),
('MND22074311005', 'Diyan', 'ME', 'TTC Teling', NULL, 'Permataklabat 2 paniki atas,minahasa utara', '81335993665', 'iyanz.dm3@gmail.com', '1609914588666 - Diyan Wahyu.jpg', NULL, NULL),
('MND22074311006', 'Dwi Rizky Irawan', 'ME', 'TTC Teling', '1993-05-25', 'Bumi beringin', '85298610099', 'dwirizkyirawan@gmail.com', '0', NULL, NULL),
('MND22074311007', 'Beni Riusdian Kusiandana', 'ME', 'TTC Teling', '1984-10-14', 'Jl. Tololiu Supit, Lingkungan 2, Kelurahan Tingkulu Kec. Wanea, Manado, Sulawesi Utara', '81359335975', 'rusdianbeni84@gmail.com', '0', NULL, NULL),
('MND22074311012', 'Kadriansah yusuf', 'Security', 'TTC Teling', '27/06/1985', 'Banjer lingkungan 1.kec tikala kota Manado Sulawesi Utara', '82292009922', 'kadriansah.jusuf@gmail.com', 'IMG_20250206_125155 - Ryant Joesuf.jpg', NULL, NULL),
('MND22074311014', 'Leonard Adi Saputra Mangensihi', 'Security', 'TTC Teling', '1992-05-22', 'Malalayang satu timur lingkungan dua', '82346160655', 'mangensihileonard@gmail.com', '0', NULL, NULL),
('MND2207431102', 'Patricio Alinski Rantung', 'Security', 'TTC Teling', '26/09/2001', 'Mahakeret Timur lingkungan 2', '81914248445', 'cioorantung@gmail.com', '1763114958219. - Cioo Rantung.jpg', NULL, NULL),
('MND22074312026', 'Safrudin Mahmud', 'Security', 'TTC Teling', '18/10/1969', 'Lawangirung Lingk 3 no 79 RT 009 RW 04 wenang, 2207Manado Sulit', '85179611869', 'safrudinmahmud189@gmail.com', '1762829981517325708635139195892 - Rudi M.jpg', NULL, NULL),
('MND22074312053', 'Dea Viorella Esterlita Lenzun', 'Security', 'TTC Teling', '2002-11-11', 'Desa Batu Jaga I Kecamatan Likupang Selatan', '82296367944', 'viorelladea11@gmail.com', 'IMG-20241216-WA0017 - dea viorella.jpg', NULL, NULL),
('MND220743124', 'Lukman djamil', 'Security', 'TTC Teling', '1972-06-30', 'Jl Brawijaya Rt 04 Mongkonai Kotamobagu Barat..', '85397688700', 'lukman.djamil1@gmail.com', '0', NULL, NULL),
('MND22084311043', 'Carla Paulina Umpenawany', 'ME', 'TTC Teling', '1987-01-21', 'Kelurahan Tingkulu link 4.kec wanea.Manado', '82249451122', 'carla.umpenawany21@gmail.com', 'IMG_9538 - Carla Umpenawany.JPG', NULL, NULL),
('MND22084311045', 'Rivo Rurut', 'ME', 'TTC Teling', '1988-01-24', 'Tampusu', '82187733313', 'amoremorte69@gmail.com', '1764122972_WhatsApp Image 2025-11-26 at 10.06.26.jpeg', NULL, NULL),
('MND22084311046', 'Imam Safei', 'ME', 'TTC Teling', '1984-04-01', 'Paniki bawah', '81242618588', 'oktavianinur668@gmail.com', '1763652288_WhatsApp Image 2025-11-20 at 22.23.15.jpeg', NULL, NULL),
('MND24014311047', 'Brian Alfonso Mamuaja', 'ME', 'TTC Teling', '24/04/1992', 'Kalasey 1 kec.mandolang kab.minahasa', '85240308086', 'brianmamuaja9@gmail.com', 'IMG-20240828-WA0284 - Brian Mamuaja.jpg', NULL, NULL),
('MND24014311048', 'Muhamad Akbar Paputungan', 'ME', 'TTC Teling', '2024-09-28', 'Jl kanaan politeknik', '82395782947', 'akbarpaputungan5@gmail.com', 'IMG_9482 - TL 2 D3 Muhamad Akbar Paputungan.JPG', NULL, NULL),
('MND24014312055', 'Rayhan Aslah', 'ME', 'TTC Paniki', '31-12-2000', 'Malalayang 1 Link 11', '85398567193', 'rayhanaslah@gmail.com', 'ME-rayhan.png', NULL, NULL),
('MND24024311049', 'Vinci S. F. Tampubolon', 'User', 'TTC Teling', '2000-05-09', 'Tatelu, Jaga III, Kec. Dimembe', '85240534296', 'vincitampubolon090500@gmail.com', '1769659970_31568-removebg-preview.png', NULL, NULL),
('MND24074311051', 'Franco Gino Bawiling', 'ME', 'TTC Teling', '2000-11-17', 'Kombos timur lingkungan 5', '82258443822', 'francobawiling17@gmail.com', 'IMG-20241114-WA0003 - Franco Bawiling.jpg', NULL, NULL),
('MND24074311060', 'Hernike Papendang', 'ME', 'TTC Teling', '1986-07-30', 'Taas', '82129706267', 'Hernike.ddsm@gmail.com', '1768644707_WhatsApp Image 2026-01-17 at 18.11.10.jpeg', NULL, NULL),
('MND24074312015', 'Fredrith Bernad Heydemans', 'BM', 'TTC Paniki', '26-09-1979', 'Malalayang 1', '082348851526', 'diditheydemans@gmail.com', 'BM-pakdidit.png', NULL, NULL),
('MND24074312019', 'Hendry Kantohe', 'ME', 'TTC Paniki', '19-09-1985', 'Perum Citra Regency 1 Blok A 73', '81356019019', 'hendry.kantohe19@gmail.com', 'ME-hendry.png', NULL, NULL),
('MND24074312021', 'Jonny Lapian Alow', 'ME', 'TTC Paniki', '31-12-1987', 'Bengkol Lingk. V Kec. Mapanget Manado', '85256654324', 'Dhoni.alow31@gmail.com', 'ME-doni.png', NULL, NULL),
('MND24074312033', 'Yusni Mokodongan', 'ME', 'TTC Paniki', '25-02-1998', 'Tudu Aog Kec. Bilalang ', '82135932073', 'yusnimokodongan768@gmail.com', 'ME-yusni.png', NULL, NULL),
('MND24074312040', 'Riki Narua', 'ME', 'TTC Paniki', '09-07-1986', 'Perum GPI JL FLAMBOYAN D no 2', '85340179196', 'rikynarua@gmail.com', 'ME-riki.png', NULL, NULL),
('MND24074312046', 'Danu Mardani', 'ME', 'TTC Paniki', '18-02-1994', 'Kombos Timur Kec. Singkil Manado', '81355040194', 'danucisco94@gmail.com', 'ME-danu.png', NULL, NULL),
('MND24074312050', 'Yeltsin Swars Rori', 'ME', 'TTC Paniki', '19-11-1994', 'karombasan selatan lingkungan 2', '85399067723', 'yeltsin.rori@gmail.com', 'ME-yelsin.png', NULL, NULL),
('MND24074312058', 'Muhammad Atthariq Z. Safii', 'ME', 'TTC Paniki', '02-07-2002', 'Jl. Pumorouw No. 54 Lingkungan II', '81354871151', 'atariksafii@gmail.com', 'ME-atar.png', NULL, NULL),
('MND25054312059', 'Adjie Chandra Arbie', 'ME', 'TTC Paniki', '05-08-2002', 'Jaga V Kecamatan Kalawat', '82191786987', 'adjiearbie6@gmail.com', 'ME-adjie.png', NULL, NULL),
('MND25054312060', 'Muzayin Musri', 'ME', 'TTC Paniki', '19-12-1997', 'BTN. Bukit Gojeng Permai D 17 Kelurahan Biringere Kec. Sinjai Utara', '82112756254', 'muzayinmusri@gmail.com', 'ME-zayin.png', NULL, NULL),
('MND25094311054', 'Rizky Walangadi', 'ME', 'TTC Teling', '2004-01-01', 'Maasing Lingkungan 3', '82197231636', 'rizky.walangadi1@gmail.com', '1767804551_Screenshot 2026-01-08 004746.jpg', NULL, 'rizky_ttd.png'),
('MND25094312061', 'Yoel Jonathan Saisab', 'ME', 'TTC Paniki', '05-07-2003', 'Karombasan Selatan Lingkungan IV', '81342173232', 'yoeljonathan07@gmail.com', 'ME-yoel.png', NULL, NULL),
('MND25094312062', 'Amanda Tessa Anang', 'ME', 'TTC Paniki', '06-11-2002', 'Pineleng 1 Jaga IV', '82188573624', 'amandaanang6@gmail.com', 'ME-amanda.png', NULL, NULL),
('MND25104311055', 'Andika Maulana Alamsyah', 'ME', 'TTC Teling', '1999-06-11', 'Borong Raya', '85159538665', 'andika.maulana001@gmail.com', '', NULL, NULL),
('TEMP-PANIKI', 'Rayhan', 'ME', 'TTC Teling', NULL, '', NULL, NULL, '', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang_list`
--
ALTER TABLE `barang_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_berita` (`id_berita`);

--
-- Indexes for table `berita_acara`
--
ALTER TABLE `berita_acara`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_bio`
--
ALTER TABLE `user_bio`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang_list`
--
ALTER TABLE `barang_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `berita_acara`
--
ALTER TABLE `berita_acara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

-- --------------------------------------------------------

--
-- Structure for view `berita_acara_clean`
--
DROP TABLE IF EXISTS `berita_acara_clean`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `berita_acara_clean`  AS SELECT `berita_acara`.`id` AS `id`, `berita_acara`.`nomor` AS `nomor`, `berita_acara`.`tanggal` AS `tanggal`, `berita_acara`.`jenis` AS `jenis`, (case when (`berita_acara`.`jenis` = 'MASUK') then `berita_acara`.`pihakA_nama` when (`berita_acara`.`jenis` = 'KELUAR') then `berita_acara`.`pihakB_nama` end) AS `tamu_nama`, (case when (`berita_acara`.`jenis` = 'MASUK') then `berita_acara`.`pihakA_jabatan` when (`berita_acara`.`jenis` = 'KELUAR') then `berita_acara`.`pihakB_jabatan` end) AS `asal_tamu`, `berita_acara`.`staff_nama` AS `staff_nama`, `berita_acara`.`site` AS `asal_staff`, `berita_acara`.`approval_status` AS `approval_status` FROM `berita_acara` ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang_list`
--
ALTER TABLE `barang_list`
  ADD CONSTRAINT `barang_list_ibfk_1` FOREIGN KEY (`id_berita`) REFERENCES `berita_acara` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
