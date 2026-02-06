-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 06, 2026 at 02:37 AM
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `barang_list`
--

INSERT INTO `barang_list` (`id`, `id_berita`, `nomor_berita`, `nama_barang`, `jumlah`, `tipe`, `sn`, `created_at`) VALUES
(104, 144, 'MDO018/II/2026/001', 'Laptop Termahal', 1, 'Asus', 'XSD-122', '2026-02-05 18:47:56'),
(105, 145, 'MDO018/II/2026/002', 'Suntikan', 3, 'Air', 'CRT', '2026-02-06 02:32:12');

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
  `ttd_penyerah` varchar(255) DEFAULT NULL,
  `ttd_penerima` varchar(255) DEFAULT NULL,
  `ttd_mengetahui` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `berita_acara`
--

INSERT INTO `berita_acara` (`id`, `nomor`, `tanggal`, `jenis`, `keterangan`, `pihakA_nama`, `pihakA_jabatan`, `pihakB_nama`, `pihakB_jabatan`, `created_at`, `ttd_penyerah`, `ttd_penerima`, `ttd_mengetahui`) VALUES
(144, 'MDO018/II/2026/001', '2026-02-06', 'KELUAR', 'Ini Adalah Sebuah Percobaan', 'Jupri', 'Indonesia', 'Jupe', 'Amerika', '2026-02-05 18:47:56', NULL, NULL, NULL),
(145, 'MDO018/II/2026/002', '2026-02-28', 'KELUAR', 'Cairan', 'Dika', 'Duda', 'Thai', 'Janda', '2026-02-06 02:32:12', NULL, NULL, NULL);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang_list`
--
ALTER TABLE `barang_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `berita_acara`
--
ALTER TABLE `berita_acara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

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
