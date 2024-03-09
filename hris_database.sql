-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2024 at 06:17 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hris_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `attendance_group_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `day` int(11) NOT NULL,
  `hours` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `attendance_group_id`, `employee_id`, `type`, `day`, `hours`, `date_created`) VALUES
(1, 3, 4, 0, 17, 1, '2024-02-22 00:21:09'),
(2, 3, 4, 0, 19, 2, '2024-02-22 00:21:09'),
(3, 3, 4, 0, 21, 3, '2024-02-22 00:21:09'),
(4, 3, 4, 0, 17, 1, '2024-02-22 00:40:00'),
(5, 3, 4, 0, 19, 2, '2024-02-22 00:40:00'),
(6, 3, 4, 0, 21, 3, '2024-02-22 00:40:00'),
(7, 3, 4, 1, 23, 4, '2024-02-22 00:40:00'),
(8, 3, 4, 0, 17, 1, '2024-02-22 00:41:33'),
(9, 3, 4, 0, 19, 2, '2024-02-22 00:41:33'),
(10, 3, 4, 0, 21, 3, '2024-02-22 00:41:33'),
(11, 3, 4, 1, 23, 4, '2024-02-22 00:41:33'),
(12, 3, 4, 1, 24, 2, '2024-02-22 00:41:33'),
(13, 3, 4, 0, 17, 1, '2024-02-22 00:41:44'),
(14, 3, 4, 0, 19, 2, '2024-02-22 00:41:44'),
(15, 3, 4, 0, 21, 3, '2024-02-22 00:41:44'),
(16, 3, 4, 1, 23, 4, '2024-02-22 00:41:44'),
(17, 3, 4, 1, 24, 2, '2024-02-22 00:41:44'),
(18, 3, 4, 1, 25, 3, '2024-02-22 00:41:44'),
(19, 3, 4, 0, 17, 1, '2024-02-22 00:43:36'),
(20, 3, 4, 0, 19, 2, '2024-02-22 00:43:36'),
(21, 3, 4, 0, 20, 1, '2024-02-22 00:43:36'),
(22, 3, 4, 0, 21, 3, '2024-02-22 00:43:36'),
(23, 3, 4, 1, 23, 4, '2024-02-22 00:43:36'),
(24, 3, 4, 1, 24, 2, '2024-02-22 00:43:36'),
(25, 3, 4, 1, 25, 3, '2024-02-22 00:43:36'),
(26, 3, 4, 0, 17, 1, '2024-02-22 00:43:50'),
(27, 3, 4, 0, 19, 2, '2024-02-22 00:43:50'),
(28, 3, 4, 0, 20, 1, '2024-02-22 00:43:50'),
(29, 3, 4, 0, 21, 3, '2024-02-22 00:43:50'),
(30, 3, 4, 1, 23, 4, '2024-02-22 00:43:50'),
(31, 3, 4, 1, 24, 2, '2024-02-22 00:43:50'),
(32, 3, 4, 1, 25, 3, '2024-02-22 00:43:50'),
(33, 3, 9, 1, 18, 1, '2024-02-22 00:43:50'),
(34, 3, 4, 0, 17, 1, '2024-02-22 03:33:32'),
(35, 3, 4, 0, 19, 2, '2024-02-22 03:33:32'),
(36, 3, 4, 0, 20, 1, '2024-02-22 03:33:32'),
(37, 3, 4, 0, 21, 3, '2024-02-22 03:33:32'),
(38, 3, 4, 1, 23, 4, '2024-02-22 03:33:32'),
(39, 3, 4, 1, 24, 2, '2024-02-22 03:33:32'),
(40, 3, 4, 1, 25, 3, '2024-02-22 03:33:32'),
(41, 3, 4, 1, 27, 1, '2024-02-22 03:33:32'),
(42, 3, 4, 1, 30, 8, '2024-02-22 03:33:32'),
(43, 3, 9, 1, 18, 1, '2024-02-22 03:33:32'),
(44, 3, 4, 0, 16, 8, '2024-02-23 11:26:22'),
(45, 3, 4, 0, 17, 8, '2024-02-23 11:26:22'),
(46, 3, 4, 0, 18, 8, '2024-02-23 11:26:22'),
(47, 3, 4, 0, 19, 8, '2024-02-23 11:26:22'),
(48, 3, 4, 0, 20, 8, '2024-02-23 11:26:22'),
(49, 3, 4, 0, 21, 8, '2024-02-23 11:26:22'),
(50, 3, 4, 0, 22, 8, '2024-02-23 11:26:22'),
(51, 3, 4, 0, 23, 8, '2024-02-23 11:26:22'),
(52, 3, 4, 0, 24, 8, '2024-02-23 11:26:22'),
(53, 3, 4, 1, 16, 8, '2024-02-23 11:26:22'),
(54, 3, 4, 1, 17, 8, '2024-02-23 11:26:22'),
(55, 3, 4, 1, 18, 8, '2024-02-23 11:26:22'),
(56, 3, 4, 1, 19, 8, '2024-02-23 11:26:22'),
(57, 3, 4, 1, 20, 8, '2024-02-23 11:26:22'),
(58, 3, 4, 1, 21, 8, '2024-02-23 11:26:22'),
(59, 3, 4, 1, 22, 8, '2024-02-23 11:26:22'),
(60, 3, 4, 1, 23, 8, '2024-02-23 11:26:22'),
(61, 3, 4, 1, 25, 3, '2024-02-23 11:26:22'),
(62, 3, 4, 1, 27, 1, '2024-02-23 11:26:22'),
(63, 3, 4, 1, 30, 8, '2024-02-23 11:26:22'),
(64, 3, 4, 2, 16, 8, '2024-02-23 11:26:22'),
(65, 3, 4, 2, 17, 8, '2024-02-23 11:26:22'),
(66, 3, 4, 2, 18, 8, '2024-02-23 11:26:22'),
(67, 3, 4, 2, 19, 8, '2024-02-23 11:26:22'),
(68, 3, 4, 2, 20, 8, '2024-02-23 11:26:22'),
(69, 3, 4, 2, 22, 8, '2024-02-23 11:26:22'),
(70, 3, 4, 2, 23, 8, '2024-02-23 11:26:22'),
(71, 3, 4, 2, 24, 8, '2024-02-23 11:26:22'),
(72, 3, 4, 2, 25, 3, '2024-02-23 11:26:22'),
(73, 3, 4, 2, 28, 3, '2024-02-23 11:26:22'),
(74, 3, 4, 3, 16, 8, '2024-02-23 11:26:22'),
(75, 3, 4, 3, 17, 8, '2024-02-23 11:26:22'),
(76, 3, 4, 3, 18, 8, '2024-02-23 11:26:22'),
(77, 3, 4, 3, 19, 8, '2024-02-23 11:26:22'),
(78, 3, 4, 3, 20, 8, '2024-02-23 11:26:22'),
(79, 3, 4, 3, 21, 8, '2024-02-23 11:26:22'),
(80, 3, 4, 3, 22, 8, '2024-02-23 11:26:22'),
(81, 3, 4, 3, 23, 8, '2024-02-23 11:26:22'),
(82, 3, 4, 4, 16, 8, '2024-02-23 11:26:22'),
(83, 3, 4, 4, 17, 8, '2024-02-23 11:26:22'),
(84, 3, 4, 4, 18, 8, '2024-02-23 11:26:22'),
(85, 3, 4, 4, 19, 8, '2024-02-23 11:26:22'),
(86, 3, 4, 4, 20, 8, '2024-02-23 11:26:22'),
(87, 3, 4, 4, 21, 8, '2024-02-23 11:26:22'),
(88, 3, 4, 4, 22, 8, '2024-02-23 11:26:22'),
(89, 3, 4, 4, 23, 8, '2024-02-23 11:26:22'),
(90, 3, 4, 4, 24, 8, '2024-02-23 11:26:22'),
(91, 3, 4, 7, 19, 0, '2024-02-23 11:26:22'),
(92, 3, 4, 7, 20, 0, '2024-02-23 11:26:22'),
(93, 3, 4, 7, 21, 0, '2024-02-23 11:26:22'),
(94, 3, 4, 7, 22, 0, '2024-02-23 11:26:22'),
(95, 3, 4, 7, 23, 0, '2024-02-23 11:26:22'),
(96, 3, 4, 7, 24, 0, '2024-02-23 11:26:22'),
(97, 3, 4, 7, 25, 0, '2024-02-23 11:26:22'),
(98, 3, 4, 7, 26, 0, '2024-02-23 11:26:22'),
(99, 3, 4, 7, 27, 0, '2024-02-23 11:26:22'),
(100, 3, 4, 7, 28, 0, '2024-02-23 11:26:22'),
(101, 3, 4, 7, 29, 0, '2024-02-23 11:26:22'),
(102, 3, 4, 7, 30, 0, '2024-02-23 11:26:22'),
(103, 3, 9, 1, 18, 1, '2024-02-23 11:26:22');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_groups`
--

CREATE TABLE `attendance_groups` (
  `attendance_group_id` int(11) NOT NULL,
  `period` varchar(100) NOT NULL,
  `year` varchar(100) NOT NULL,
  `client_id` int(11) NOT NULL,
  `active` int(11) NOT NULL,
  `finished` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance_groups`
--

INSERT INTO `attendance_groups` (`attendance_group_id`, `period`, `year`, `client_id`, `active`, `finished`, `date_created`) VALUES
(1, 'January 1 to 15', '1990', 1, 0, 0, '2024-02-21 06:30:32'),
(2, 'February 16 to 29', '2024', 1, 0, 0, '2024-02-21 08:14:19'),
(3, 'January 16 to 31', '1991', 1, 0, 0, '2024-02-21 22:43:49');

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `bank_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `banks`
--

INSERT INTO `banks` (`bank_id`, `name`, `branch`, `date_created`) VALUES
(1, 'BPI', 'Caloocan', '2024-02-21 06:59:18');

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `bank_account_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `bank` varchar(100) NOT NULL,
  `account_number` varchar(100) NOT NULL,
  `active` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bank_accounts`
--

INSERT INTO `bank_accounts` (`bank_account_id`, `employee_id`, `bank`, `account_number`, `active`, `date_created`) VALUES
(1, 6, 'Hatdog', '23', 0, '2024-02-07 08:52:58'),
(2, 7, 'Ban4', '1235', 0, '2024-02-12 10:00:47');

-- --------------------------------------------------------

--
-- Table structure for table `beneficiaries`
--

CREATE TABLE `beneficiaries` (
  `beneficiary_id` int(11) NOT NULL,
  `mortuary_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `type` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `beneficiaries`
--

INSERT INTO `beneficiaries` (`beneficiary_id`, `mortuary_id`, `employee_id`, `type`, `name`, `date_created`) VALUES
(1, 3, 4, 'B', '23', '2024-02-12 06:25:26'),
(2, 4, 4, 'B', 'Alpha De Mary hugas', '2024-02-12 07:23:15'),
(3, -1, 7, 'A', 'Jean Dee', '2024-02-15 04:02:12'),
(4, 5, 7, 'B', '123', '2024-02-15 04:02:43'),
(5, 6, 7, 'B', 'Jean Dee', '2024-02-16 05:13:23'),
(6, 0, 7, 'B', 'a', '2024-02-23 10:23:43');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `branch` varchar(200) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `name`, `branch`, `date_created`) VALUES
(1, 'BPI', 'Caloocan', '2024-02-15 04:19:28'),
(2, 'SPS', 'Valuenzuela', '2024-02-12 08:27:05');

-- --------------------------------------------------------

--
-- Table structure for table `deployed_employees`
--

CREATE TABLE `deployed_employees` (
  `deployed_employee_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `deployed_employees`
--

INSERT INTO `deployed_employees` (`deployed_employee_id`, `employee_id`, `client_id`, `date_from`, `date_to`, `date_created`) VALUES
(3, 4, 1, '2021-02-12', '2024-02-13', '2024-02-12 10:01:37'),
(4, 7, 2, '2021-06-12', '2024-02-09', '2024-02-12 10:02:12'),
(5, 9, 2, '2024-02-08', '2024-02-16', '2024-02-15 04:50:44'),
(6, 9, 1, '2024-02-09', '2024-02-29', '2024-02-21 08:16:08');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `employee_no` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `middlename` varchar(100) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `civil_status` varchar(100) NOT NULL,
  `telephone` varchar(100) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `sss` text NOT NULL,
  `phil` text NOT NULL,
  `pagibig` text NOT NULL,
  `tin` text NOT NULL,
  `ctc` text NOT NULL,
  `rfid` text NOT NULL,
  `gsis` text NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `employee_no`, `firstname`, `lastname`, `middlename`, `gender`, `civil_status`, `telephone`, `mobile`, `email`, `address`, `sss`, `phil`, `pagibig`, `tin`, `ctc`, `rfid`, `gsis`, `date_created`) VALUES
(4, '123', 'Jhon Orlan', 'Tero', 'Gene', 'Male', 'Married', '', '', '', 'awdwawa', '', '', '', '', '', '', '', '2024-02-07 08:51:25'),
(7, '123456', 'Eman', 'Gumayagay', 'B', 'Male', 'Single', '09566706905', '09566706905', 'jhonorlantero@gmail.com', 'R10 Sitio santo Ninio NBBS Navotas City', '1234', '123', '1234555566', '45', '34', '67', '56', '2024-02-12 10:00:47'),
(9, '123', 'Doe', 'John', 'G', 'Male', 'Single', '', '', '', 'wadwa s', '', '', '', '', '', '', '', '2024-02-15 03:16:59');

-- --------------------------------------------------------

--
-- Table structure for table `employments`
--

CREATE TABLE `employments` (
  `employment_id` int(11) NOT NULL,
  `date_hired` date NOT NULL,
  `date_end` date NOT NULL,
  `employee_id` int(11) NOT NULL,
  `position` varchar(200) NOT NULL,
  `department` varchar(200) NOT NULL,
  `e_type` varchar(200) NOT NULL,
  `status` varchar(11) NOT NULL,
  `active` int(11) NOT NULL,
  `rest_day_1` varchar(200) NOT NULL,
  `rest_day_2` varchar(200) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employments`
--

INSERT INTO `employments` (`employment_id`, `date_hired`, `date_end`, `employee_id`, `position`, `department`, `e_type`, `status`, `active`, `rest_day_1`, `rest_day_2`, `date_created`) VALUES
(5, '2020-06-12', '2024-02-21', 4, 'Administrator', 'Field', 'Field', 'Contractual', 0, 'Monday', 'Tuesday', '2024-02-22 03:15:01');

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `holiday_id` int(11) NOT NULL,
  `holiday_date` date NOT NULL,
  `holiday` varchar(200) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`holiday_id`, `holiday_date`, `holiday`, `date_created`) VALUES
(1, '2024-02-17', 'Christm', '2024-02-16 06:03:49'),
(2, '2024-02-24', 'Christmaa', '2024-02-16 06:04:57'),
(3, '2024-02-15', '1', '2024-02-16 06:05:48');

-- --------------------------------------------------------

--
-- Table structure for table `mortuaries`
--

CREATE TABLE `mortuaries` (
  `mortuary_id` int(11) NOT NULL,
  `period` varchar(100) NOT NULL,
  `year` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mortuaries`
--

INSERT INTO `mortuaries` (`mortuary_id`, `period`, `year`, `date_created`) VALUES
(6, 'January 1 to 15', '1990', '2024-02-16 05:13:23'),
(7, 'January 1 to 15', '1990', '2024-02-17 01:11:53');

-- --------------------------------------------------------

--
-- Table structure for table `service_deductions`
--

CREATE TABLE `service_deductions` (
  `service_deduction_id` int(11) NOT NULL,
  `price_from` float NOT NULL,
  `price_to` float NOT NULL,
  `msc` float NOT NULL,
  `er` float NOT NULL,
  `ee` float NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `system_types`
--

CREATE TABLE `system_types` (
  `type_id` int(11) NOT NULL,
  `type` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `system_types`
--

INSERT INTO `system_types` (`type_id`, `type`, `category`, `date_created`) VALUES
(4, 'awdwa', 'loan_type', '2024-02-13 14:46:06'),
(5, '1213', 'expense_type', '2024-02-13 14:46:25'),
(6, '12', 'loan_type', '2024-02-16 14:02:02'),
(7, '7', 'loan_type', '2024-02-21 07:59:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `attendance_groups`
--
ALTER TABLE `attendance_groups`
  ADD PRIMARY KEY (`attendance_group_id`);

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`bank_id`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`bank_account_id`);

--
-- Indexes for table `beneficiaries`
--
ALTER TABLE `beneficiaries`
  ADD PRIMARY KEY (`beneficiary_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`);

--
-- Indexes for table `deployed_employees`
--
ALTER TABLE `deployed_employees`
  ADD PRIMARY KEY (`deployed_employee_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `employments`
--
ALTER TABLE `employments`
  ADD PRIMARY KEY (`employment_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`holiday_id`);

--
-- Indexes for table `mortuaries`
--
ALTER TABLE `mortuaries`
  ADD PRIMARY KEY (`mortuary_id`);

--
-- Indexes for table `service_deductions`
--
ALTER TABLE `service_deductions`
  ADD PRIMARY KEY (`service_deduction_id`);

--
-- Indexes for table `system_types`
--
ALTER TABLE `system_types`
  ADD PRIMARY KEY (`type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `attendance_groups`
--
ALTER TABLE `attendance_groups`
  MODIFY `attendance_group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `bank_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `bank_account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `beneficiaries`
--
ALTER TABLE `beneficiaries`
  MODIFY `beneficiary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `deployed_employees`
--
ALTER TABLE `deployed_employees`
  MODIFY `deployed_employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `employments`
--
ALTER TABLE `employments`
  MODIFY `employment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `holiday_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mortuaries`
--
ALTER TABLE `mortuaries`
  MODIFY `mortuary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `service_deductions`
--
ALTER TABLE `service_deductions`
  MODIFY `service_deduction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_types`
--
ALTER TABLE `system_types`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `beneficiaries`
--
ALTER TABLE `beneficiaries`
  ADD CONSTRAINT `beneficiaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `deployed_employees`
--
ALTER TABLE `deployed_employees`
  ADD CONSTRAINT `deployed_employees_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `deployed_employees_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`);

--
-- Constraints for table `employments`
--
ALTER TABLE `employments`
  ADD CONSTRAINT `employments_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
