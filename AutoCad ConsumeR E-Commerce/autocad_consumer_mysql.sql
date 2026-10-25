-- ==============================================================================
-- AutoCad ConsumeR — Official E-Commerce SQL Database Dump
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, phpMyAdmin, XAMPP, Laragon, cPanel
-- Brand: AutoCad ConsumeR
-- Official Recipient Numbers: bKash (01878205459), Nagad (01878205459), Rocket (01878205459)
-- Currency: BDT (৳)
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autocad_consumer`
--
CREATE DATABASE IF NOT EXISTS `autocad_consumer` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `autocad_consumer`;

-- --------------------------------------------------------
-- Table structure for table `cad_settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cad_settings`;
CREATE TABLE `cad_settings` (
  `setting_key` varchar(64) NOT NULL,
  `setting_value` text NOT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cad_settings` (`setting_key`, `setting_value`) VALUES
('brand_name', 'AutoCad ConsumeR'),
('phone_number', '+880 1878-205459'),
('whatsapp_number', '01878205459'),
('email_address', 'support@autocadconsumer.com'),
('office_address', 'Engineering Tower, Level 4, Panthapath, Dhaka-1205, Bangladesh'),
('currency', 'BDT'),
('currency_symbol', '৳'),
('bkash_account', '01878205459'),
('nagad_account', '01878205459'),
('rocket_account', '01878205459');

-- --------------------------------------------------------
-- Table structure for table `cad_categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cad_categories`;
CREATE TABLE `cad_categories` (
  `cat_id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_slug` varchar(64) NOT NULL,
  `cat_name` varchar(128) NOT NULL,
  `description` text DEFAULT NULL,
  `item_count` int(11) DEFAULT 0,
  PRIMARY KEY (`cat_id`),
  UNIQUE KEY `cat_slug` (`cat_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cad_categories` (`cat_id`, `cat_slug`, `cat_name`, `description`, `item_count`) VALUES
(1, 'cad-blocks', 'CAD Blocks & Symbols', '1,500+ Furniture, electrical, plumbing, sanitary, and mechanical 2D blocks.', 45),
(2, 'templates', 'DWG/DXF Templates', 'Standardized drawing sheets, title blocks (A0 to A4), and CTB plot styles.', 18),
(3, 'architectural', 'Architectural Drafting', 'Full residential & commercial drawings: floor plans, elevations, sections.', 32),
(4, 'structural', 'Structural Drawing Resources', 'RC column/beam rebar details, foundation layouts, and steel connections.', 24),
(5, 'boq-tools', 'BOQ & Estimation Tools', 'Dynamic Excel spreadsheets with automated rate analysis for Bangladesh.', 12),
(6, 'services', 'Custom CAD Design Services', 'Turnkey 2D drafting, PDF-to-CAD conversion, redline cleanups, and plotting.', 6);

-- --------------------------------------------------------
-- Table structure for table `cad_products`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cad_products`;
CREATE TABLE `cad_products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category_slug` varchar(64) NOT NULL,
  `regular_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `rating` decimal(3,1) DEFAULT 5.0,
  `reviews_count` int(11) DEFAULT 0,
  `in_stock` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `image_url` varchar(255) NOT NULL,
  `download_archive` varchar(255) NOT NULL,
  `download_name` varchar(255) NOT NULL,
  `file_size` varchar(32) NOT NULL,
  `cad_format` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `specs_json` text DEFAULT NULL,
  `variations_json` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `fk_category` (`category_slug`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_slug`) REFERENCES `cad_categories` (`cat_slug`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cad_products` (`product_id`, `title`, `category_slug`, `regular_price`, `sale_price`, `rating`, `reviews_count`, `in_stock`, `is_featured`, `image_url`, `download_archive`, `download_name`, `file_size`, `cad_format`, `description`, `specs_json`, `variations_json`) VALUES
(101, 'Master Architectural CAD Block Bundle (1,500+ Blocks)', 'cad-blocks', 1200.00, 899.00, 4.9, 38, 1, 1, '/theme/assets/images/placeholders/cad-blocks.svg', 'cad-blocks-bundle.zip', 'AutoCad-ConsumeR-Master-Blocks-1500.zip', '3.2 MB', '.DWG / .DXF / Dynamic Blocks', 'Extensive 2D collection: living room furniture, commercial sanitary fixtures, kitchen modules, landscaping, electrical symbols, dynamic doors & windows.', '{\"format\":\".DWG (AutoCAD 2007–2025) + .DXF\",\"scale\":\"1:1 Metric (mm) & Imperial\",\"layers\":\"AIA Standard Color-Coded Layers\",\"delivery\":\"Instant ZIP Archive Download (3.2 MB)\"}', '[{\"name\":\"Starter Pack (250 Basic Blocks)\",\"price\":499},{\"name\":\"Professional Pack (750 Blocks)\",\"price\":899},{\"name\":\"Master Bureau Suite (1,500+ Blocks + Commercial License)\",\"price\":1450}]'),
(102, 'Standard DWG/DXF Title Block & Sheet Templates (A0 to A4)', 'templates', 650.00, 499.00, 5.0, 24, 1, 1, '/theme/assets/images/placeholders/dwg-template.svg', 'dwg-sheet-templates.zip', 'AutoCad-ConsumeR-Title-Sheets-A0-A4.zip', '2.6 MB', '.DWG / .DXF / CTB Plot Styles', 'Standardized drawing sheets compliant with ISO and ANSI specifications. Includes dynamic viewports and calibrated monochrome CTB plot files.', '{\"format\":\".DWG, .DXF, .DWT Template File\",\"scale\":\"A0, A1, A2, A3, A4 Sheet Sizes\",\"layers\":\"ISO Standard Drawing Borders\",\"delivery\":\"Instant ZIP with CTB Pen Plot Styles (2.6 MB)\"}', '[{\"name\":\"Single Sheet Template (A3/A4)\",\"price\":299},{\"name\":\"Full ISO Metric Suite (A0-A4 + CTB Styles)\",\"price\":499},{\"name\":\"Corporate Enterprise Kit\",\"price\":850}]'),
(103, 'Residential Villa Multi-Story Architectural Drawing Set', 'architectural', 2500.00, 1850.00, 4.8, 19, 1, 1, '/theme/assets/images/placeholders/architectural-plans.svg', 'architectural-villa-plans.zip', 'AutoCad-ConsumeR-Duplex-Villa-Architectural-Set.zip', '2.5 MB', '.DWG / .DXF / Vector PDF Sheets', 'Complete residential design: ground & typical floor plans, 4-side elevations, sectional details, staircase layouts, and roof drainage details.', '{\"format\":\".DWG + Layered Vector PDF Sheets\",\"scale\":\"1:100 Metric Scale\",\"sheets\":\"12 Full Working Drawing Sheets\",\"delivery\":\"Instant Download ZIP (2.5 MB)\"}', '[{\"name\":\"Floor Plans Only (Ground + First)\",\"price\":950},{\"name\":\"Complete 12-Sheet Architectural Set\",\"price\":1850},{\"name\":\"Architectural + Structural Framing Bundle\",\"price\":2800}]'),
(104, 'Reinforced Concrete Structural Detailing DWG Library', 'structural', 1800.00, 1350.00, 4.9, 42, 1, 1, '/theme/assets/images/placeholders/structural-steel.svg', 'structural-rebar-library.zip', 'AutoCad-ConsumeR-RC-Structural-Rebar-Library.zip', '2.0 MB', '.DWG / .DXF / BNBC & ACI Details', 'Rebar detailing standards: column schedules, continuous beam cross-sections, isolated footings, shear walls, and steel gusset connections.', '{\"format\":\".DWG (BNBC & ACI 318 Standard Details)\",\"scale\":\"1:20 & 1:50 Detailing Scale\",\"delivery\":\"Instant ZIP Download (2.0 MB)\"}', '[{\"name\":\"Foundation & Footing Details Pack\",\"price\":650},{\"name\":\"Complete Rebar Detailing Library\",\"price\":1350},{\"name\":\"Structural Detailing + Excel BBS Bar Bending Tool\",\"price\":1950}]'),
(105, 'Building Construction BOQ & Rate Analysis Estimator', 'boq-tools', 950.00, 750.00, 4.7, 15, 1, 0, '/theme/assets/images/placeholders/boq-estimator.svg', 'boq-rate-analysis-bangladesh.zip', 'AutoCad-ConsumeR-BOQ-Estimator-PWD-LGED.zip', '1.2 MB', '.CSV / .XLSX / Formulas Included', 'Automated Excel sheet with linked formulas, material quantity takeoffs, and rate analysis according to Bangladesh PWD/LGED schedules.', '{\"format\":\".XLSX Matrix Spreadsheet + .DWG Takeoff Guide\",\"standards\":\"PWD / LGED Bangladesh Compatible\",\"delivery\":\"Instant Spreadsheet & Documentation (1.2 MB)\"}', '[{\"name\":\"Residential BOQ Template Only\",\"price\":450},{\"name\":\"Complete Master BOQ & Rate Analysis Tool\",\"price\":750},{\"name\":\"Master BOQ + Material Specification Handbook\",\"price\":1100}]'),
(106, '2D CAD Drafting & PDF-to-CAD Conversion Service (Per Sheet)', 'services', 1800.00, 1500.00, 5.0, 57, 1, 0, '/theme/assets/images/placeholders/drafting-service.svg', 'cad-drafting-service-brief.zip', 'AutoCad-ConsumeR-Drafting-Service-Brief.zip', '930 KB', '.DWG / .DXF / Service Brief', 'Order professional 2D drafting for your architectural or structural sheet. Includes up to 2 revisions and delivery in both native .DWG and vector .PDF.', '{\"turnaround\":\"24 to 48 Hours Standard Delivery\",\"revisions\":\"2 Free Iterative Revisions Included\",\"delivery\":\"Digital Transfer via Download Link\"}', '[{\"name\":\"Simple Drawing / Conversion (1 Sheet)\",\"price\":800},{\"name\":\"Standard Working Drawing Sheet (1 Sheet)\",\"price\":1500},{\"name\":\"Complex Detailing / Large Format A0 Sheet\",\"price\":2500}]');

-- --------------------------------------------------------
-- Table structure for table `cad_orders`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cad_orders`;
CREATE TABLE `cad_orders` (
  `order_id` varchar(32) NOT NULL,
  `customer_name` varchar(128) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `company` varchar(128) DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `items_summary` text NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(64) NOT NULL,
  `trx_id` varchar(64) NOT NULL,
  `sender_number` varchar(32) NOT NULL,
  `order_status` varchar(64) NOT NULL DEFAULT 'Pending Verification',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cad_orders` (`order_id`, `customer_name`, `phone`, `email`, `company`, `delivery_address`, `items_summary`, `total_amount`, `payment_method`, `trx_id`, `sender_number`, `order_status`, `is_verified`, `created_at`) VALUES
('CAD-9842', 'Engr. Tanvir Ahmed', '01878205459', 'tanvir@engineers.com', 'Design Studio Architects', 'House 12, Road 4, Dhanmondi, Dhaka', 'Master Architectural CAD Block Bundle (1,500+ Blocks)', 899.00, 'bKash Send Money', '9J583KFA1', '01878205459', 'Pending Verification', 0, NOW());

-- --------------------------------------------------------
-- Table structure for table `cad_order_items`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cad_order_items`;
CREATE TABLE `cad_order_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(32) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `variation_name` varchar(128) DEFAULT 'Standard Package',
  `price` decimal(10,2) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  `download_archive` varchar(255) NOT NULL,
  `download_name` varchar(255) NOT NULL,
  `file_size` varchar(32) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `fk_order` (`order_id`),
  CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `cad_orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cad_order_items` (`item_id`, `order_id`, `product_id`, `product_title`, `variation_name`, `price`, `qty`, `download_archive`, `download_name`, `file_size`) VALUES
(1, 'CAD-9842', 101, 'Master Architectural CAD Block Bundle (1,500+ Blocks)', 'Professional Pack (750 Blocks)', 899.00, 1, 'cad-blocks-bundle.zip', 'AutoCad-ConsumeR-Master-Blocks-1500.zip', '3.2 MB');

-- --------------------------------------------------------
-- Table structure for table `cad_quotes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cad_quotes`;
CREATE TABLE `cad_quotes` (
  `quote_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `service` varchar(128) NOT NULL,
  `scope` text NOT NULL,
  `file_attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`quote_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
