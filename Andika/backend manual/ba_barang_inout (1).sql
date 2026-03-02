-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 02, 2026 at 06:14 AM
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
(174, 253, 'MDO018/III/2026/1', 'Hp', 2, 'Iphone', '-', '2026-03-02 06:00:05', 'uploads/barang/barang_69a5276560327.jpeg'),
(175, 253, 'MDO018/III/2026/1', 'Tes 2 Barang', 4, '2', '22', '2026-03-02 06:00:05', 'uploads/barang/barang_69a527656387f.jpeg');

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
(253, 'MDO018/III/2026/1', '2026-03-02', 'KELUAR', 'Tes Keluar', '', '', 'Hamid', 'PT.Karsa', '2026-03-02 06:00:05', '', 'data:image/png;base64,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', 'approved', NULL, '/ttd/djefli_ttd.png', 'TTC Teling', 'Djefli', 'pending', '/ttd/rizky_ttd.png', 'Rizky Walangadi');

-- --------------------------------------------------------

--
-- Stand-in structure for view `berita_acara_clean`
-- (See below for the actual view)
--
CREATE TABLE `berita_acara_clean` (
`id` int
,`nomor` varchar(50)
,`tanggal` date
,`jenis` varchar(50)
,`tamu_nama` varchar(100)
,`asal_tamu` varchar(100)
,`staff_nama` varchar(255)
,`asal_staff` varchar(100)
,`approval_status` enum('pending','approved','rejected')
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT for table `berita_acara`
--
ALTER TABLE `berita_acara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

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
