-- Database setup for Traffic Fine System

CREATE TABLE IF NOT EXISTS `fines` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reference_number` VARCHAR(50) NOT NULL,
  `category_id` INT NOT NULL,
  `officer_id` INT NOT NULL,
  `driver_license_no` VARCHAR(50) NOT NULL,
  `vehicle_no` VARCHAR(20) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
  `paid_at` DATETIME DEFAULT NULL,
  `payment_channel` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_fines_reference_number` (`reference_number`),
  KEY `idx_fines_category_id` (`category_id`),
  KEY `idx_fines_status` (`status`),
  KEY `idx_fines_officer_id` (`officer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `fines` (`reference_number`, `category_id`, `officer_id`, `driver_license_no`, `vehicle_no`, `status`, `paid_at`, `payment_channel`) VALUES
('TESTREF001', 1, 1, 'B1234567', 'ABC-1234', 'UNPAID', NULL, NULL);
