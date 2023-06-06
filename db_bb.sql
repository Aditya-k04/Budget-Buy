-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2023 at 04:26 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bb`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` bigint(20) NOT NULL,
  `category` varchar(300) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`id`, `category`, `created_at`, `modified_at`) VALUES
(1, 'Books', '2023-04-09 08:30:11', NULL),
(2, 'Bags', '2023-04-09 08:51:19', NULL),
(3, 'Notes', '2023-04-09 08:51:45', NULL),
(4, 'Art Works', '2023-04-09 08:52:08', '2023-04-09 11:42:38'),
(9, 'Pouch', '2023-04-09 14:54:17', '2023-04-09 15:23:06');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_orders`
--

CREATE TABLE `tbl_orders` (
  `id` bigint(20) NOT NULL,
  `seller_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `product_name` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `price` double DEFAULT NULL,
  `fulfillment_status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_orders`
--

INSERT INTO `tbl_orders` (`id`, `seller_id`, `user_id`, `product_id`, `product_name`, `images`, `price`, `fulfillment_status`, `created_at`, `modified_at`) VALUES
(1, 2, 3, 2, 'Test1', 'cooking_essentials.jpg,oil_and_ghee.jpg', 4, 1, '2023-05-26 09:43:02', '2023-05-26 09:45:15'),
(2, 3, 4, 6, 'Pens Stand', 'sub-buzz-1719-1623395706-3.jpg', 150, 0, '2023-05-26 10:42:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `id` bigint(20) NOT NULL,
  `stud_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `title` text NOT NULL,
  `images` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `tags` text NOT NULL,
  `use_time` timestamp NULL DEFAULT NULL,
  `price` double NOT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`id`, `stud_id`, `category_id`, `title`, `images`, `description`, `tags`, `use_time`, `price`, `status`, `created_at`, `modified_at`) VALUES
(2, 2, 1, 'Test1', 'cooking_essentials.jpg,oil_and_ghee.jpg', 'assdgdfg', 'Test, Test1', '2021-04-11 07:30:00', 4, 1, '2023-04-29 14:48:44', NULL),
(3, 2, 1, 'Books', 'trending_towels_and_curtains.jpg', 'vcvbgdfb', 'study', '2023-01-31 18:30:00', 37, 0, '2023-05-10 17:35:57', NULL),
(6, 3, 9, 'Pens Stand', 'sub-buzz-1719-1623395706-3.jpg', 'gfdgfhg', 'storage', '2023-05-09 18:30:00', 150, 1, '2023-05-26 09:28:50', NULL),
(7, 3, 3, 'Ball pens', 'img1.jpg', '', 'study', '2023-05-19 18:30:00', 120, 0, '2023-05-29 17:19:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_profile`
--

CREATE TABLE `tbl_profile` (
  `id` bigint(20) NOT NULL,
  `stud_id` bigint(20) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `photo` text DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `dob` timestamp NULL DEFAULT NULL,
  `address` text DEFAULT NULL,
  `landmark` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(200) DEFAULT NULL,
  `pincode` varchar(50) DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `prn` varchar(100) DEFAULT NULL,
  `document` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_profile`
--

INSERT INTO `tbl_profile` (`id`, `stud_id`, `is_verified`, `photo`, `gender`, `dob`, `address`, `landmark`, `city`, `state`, `pincode`, `phone`, `prn`, `document`, `created_at`, `modified_at`) VALUES
(1, 2, 1, NULL, '', NULL, '', '', '', '', '', 7584546687, 'DSDASDSD', NULL, '2023-04-22 18:02:24', '2023-05-29 14:48:25'),
(2, 3, 1, NULL, 'Male', NULL, 'Jawahar nagar , Kolhapur', 'KMT Workd', 'Kolhapur', 'Maharashatra', '416012', 9865236589, 'AOIOHDOOQ', NULL, '2023-05-16 01:46:40', '2023-05-26 10:41:47'),
(3, 4, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9532346546, 'WQKVBSKJA', NULL, '2023-05-26 07:05:47', NULL),
(4, 5, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9856457864, 'SKAHKDB', NULL, '2023-05-30 14:14:57', NULL),
(5, 6, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7865646446, 'SKAHKSGWWQ', NULL, '2023-05-30 14:16:29', NULL),
(6, 7, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7894656456, 'FDSFSDFDS', NULL, '2023-05-30 17:07:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_auth`
--

CREATE TABLE `tbl_user_auth` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NULL DEFAULT NULL,
  `last_logged_in` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_user_auth`
--

INSERT INTO `tbl_user_auth` (`id`, `first_name`, `last_name`, `email`, `password`, `created_at`, `modified_at`, `last_logged_in`, `is_admin`) VALUES
(1, 'Admin', 'User', 'admin@gmail.com', 'Admin@123', '2023-04-22 17:58:29', '2023-05-30 13:33:54', NULL, 1),
(2, 'Vinayak', 'Bhosale', 'vinayak@gmail.com', 'Vinayak@123', '2023-04-22 18:02:22', '2023-05-29 14:48:25', NULL, 0),
(3, 'Sourabh', 'Shinde', 'sourabh99@gmail.com', 'Sourabh@123', '2023-05-16 01:46:39', '2023-05-26 10:41:47', NULL, 0),
(4, 'Shiva', 'Shinde', 'shiva@gmail.com', 'd5f7b68ba6682a691cb19351685f3757', '2023-05-26 07:05:47', NULL, NULL, 0),
(5, 'Nishant', 'Kamat', 'nishi@gmail.com', '00df7fae106612f81c2c08d685708327', '2023-05-30 14:14:57', NULL, NULL, 0),
(6, 'Pravin', 'Kamble', 'pravin@gmail.com', '4ddcde9be70b9d82a134b213213a6466', '2023-05-30 14:16:29', NULL, NULL, 0),
(7, 'Aniket', 'Kamble', 'aniket@gmail.com', '19ef44acddcb9d44a3033330b6ecdf25', '2023-05-30 17:07:26', NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_profile`
--
ALTER TABLE `tbl_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_verified` (`stud_id`);

--
-- Indexes for table `tbl_user_auth`
--
ALTER TABLE `tbl_user_auth`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_profile`
--
ALTER TABLE `tbl_profile`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tbl_user_auth`
--
ALTER TABLE `tbl_user_auth`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
