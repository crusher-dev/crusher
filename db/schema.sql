-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: crusher
-- ------------------------------------------------------
-- Server version	8.0.27-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerting`
--

DROP TABLE IF EXISTS `alerting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerting` (
  `user_id` int unsigned NOT NULL,
  `github_code` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `alerting_user_id_uindex` (`user_id`),
  CONSTRAINT `alerting_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cli_status`
--

DROP TABLE IF EXISTS `cli_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cli_status` (
  `status` enum('Started','Completed') DEFAULT 'Started',
  `user_id` int DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `result_id` int NOT NULL,
  `report_id` int NOT NULL,
  `message` text NOT NULL,
  `replied_to` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comments_comments_id_fk` (`replied_to`),
  KEY `comments_users_id_fk` (`user_id`),
  KEY `comments_job_reports_id_fk` (`report_id`),
  KEY `comments_test_instance_results_id_fk` (`result_id`),
  CONSTRAINT `comments_comments_id_fk` FOREIGN KEY (`replied_to`) REFERENCES `comments` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_job_reports_id_fk` FOREIGN KEY (`report_id`) REFERENCES `job_reports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_test_instance_results_id_fk` FOREIGN KEY (`result_id`) REFERENCES `test_instance_results` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `environments`
--

DROP TABLE IF EXISTS `environments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `environments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `browser` json NOT NULL,
  `vars` longtext NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int unsigned NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `environments_projects_id_fk` (`project_id`),
  KEY `environments_users_id_fk` (`user_id`),
  CONSTRAINT `environments_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `environments_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `git_integrations`
--

DROP TABLE IF EXISTS `git_integrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `git_integrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `repo_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `repo_link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `installation_id` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `repo_id` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `git_integrations_projects_id_fk` (`project_id`),
  CONSTRAINT `git_integrations_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `github_app_installations`
--

DROP TABLE IF EXISTS `github_app_installations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `github_app_installations` (
  `owner_name` varchar(255) NOT NULL,
  `repo_name` varchar(255) NOT NULL,
  `installation_id` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `github_app_installations_ownerName_repoName_index` (`owner_name`,`repo_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `integration_alerting`
--

DROP TABLE IF EXISTS `integration_alerting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `integration_alerting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `integration_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `config` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `integration_alerting_projects_id_fk` (`project_id`),
  CONSTRAINT `integration_alerting_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `integrations`
--

DROP TABLE IF EXISTS `integrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `integrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `integration_name` enum('SLACK') NOT NULL,
  `meta` json NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1 COMMENT='This table and user_provider_connections should merge';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_reports`
--

DROP TABLE IF EXISTS `job_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `reference_job_id` int DEFAULT NULL,
  `total_test_count` int DEFAULT NULL,
  `passed_test_count` int DEFAULT NULL,
  `failed_test_count` int DEFAULT NULL,
  `review_required_test_count` int DEFAULT NULL,
  `project_id` int NOT NULL,
  `status` enum('PASSED','FAILED','MANUAL_REVIEW_REQUIRED','RUNNING') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'RUNNING',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_explanation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `meta` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_reports_jobs_id_fk_2` (`reference_job_id`),
  KEY `job_reports_projects_id_fk` (`job_id`),
  KEY `job_reports_projects_id_fk_1` (`project_id`),
  CONSTRAINT `job_reports_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `job_reports_jobs_id_fk_2` FOREIGN KEY (`reference_job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `job_reports_projects_id_fk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9814 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `latest_report_id` int DEFAULT NULL,
  `pr_id` varchar(255) DEFAULT NULL,
  `commit_id` varchar(50) DEFAULT NULL,
  `repo_name` varchar(255) DEFAULT NULL,
  `branch_name` varchar(200) DEFAULT NULL,
  `commit_name` text,
  `status` enum('CREATED','QUEUED','RUNNING','FINISHED','TIMEOUT','ABORTED') NOT NULL DEFAULT 'CREATED',
  `host` varchar(255) NOT NULL,
  `build_trigger` enum('MANUAL','CLI','CRON') NOT NULL DEFAULT 'MANUAL',
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `check_run_id` varchar(100) DEFAULT NULL,
  `browser` json NOT NULL,
  `installation_id` varchar(255) DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `config` json NOT NULL,
  `is_draft_job` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `jobs_projects_id_fk` (`project_id`),
  KEY `jobs_users_id_fk` (`user_id`),
  KEY `jobs_job_reports_id_fk` (`latest_report_id`),
  FULLTEXT KEY `build_search_index` (`commit_name`,`repo_name`,`host`),
  CONSTRAINT `jobs_job_reports_id_fk` FOREIGN KEY (`latest_report_id`) REFERENCES `job_reports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `jobs_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `jobs_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11026 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `monitorings`
--

DROP TABLE IF EXISTS `monitorings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitorings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `environment_id` int NOT NULL,
  `last_cron_run` datetime DEFAULT '1970-01-02 12:59:40',
  `test_interval` int DEFAULT '86400',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `monitoring_settings_projects_id_fk` (`project_id`),
  CONSTRAINT `monitoring_settings_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project_hosts`
--

DROP TABLE IF EXISTS `project_hosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_hosts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `host_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `project_id` int NOT NULL,
  `user_id` int unsigned NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_hosts_projects_id_fk` (`project_id`),
  KEY `project_hosts_user_id_fk` (`user_id`),
  CONSTRAINT `project_hosts_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `project_hosts_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `team_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `baseline_job_id` int DEFAULT NULL,
  `meta` text,
  `visual_baseline` int NOT NULL DEFAULT '5',
  PRIMARY KEY (`id`),
  KEY `projects_team_id_fk` (`team_id`),
  KEY `projects_jobs_id_fk` (`baseline_job_id`),
  CONSTRAINT `projects_jobs_id_fk` FOREIGN KEY (`baseline_job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `projects_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=279 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `team_email` varchar(255) DEFAULT NULL,
  `tier` enum('FREE','STARTER','PRO') NOT NULL DEFAULT 'FREE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `stripe_customer_id` varchar(100) DEFAULT NULL,
  `meta` text,
  `uuid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `events` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `user_id` int unsigned DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `templates_projects_id_fk` (`project_id`),
  KEY `templates_users_id_fk` (`user_id`),
  CONSTRAINT `templates_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `templates_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_instance_action_results`
--

DROP TABLE IF EXISTS `test_instance_action_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_instance_action_results` (
  `instance_id` int NOT NULL,
  `project_id` int NOT NULL,
  `actions_result` json NOT NULL,
  `has_instance_passed` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_instance_result_sets`
--

DROP TABLE IF EXISTS `test_instance_result_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_instance_result_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `instance_id` int NOT NULL,
  `target_instance_id` int NOT NULL,
  `status` enum('WAITING_FOR_TEST_EXECUTION','RUNNING_CHECKS','FINISHED_RUNNING_CHECKS') NOT NULL DEFAULT 'WAITING_FOR_TEST_EXECUTION',
  `conclusion` enum('PASSED','FAILED','MANUAL_REVIEW_REQUIRED') DEFAULT NULL,
  `failed_reason` text,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_instance_result_sets_test_instances_id_fk` (`instance_id`),
  KEY `test_instance_result_sets_test_instances_id_fk_2` (`target_instance_id`),
  KEY `test_instance_result_sets_job_reports_id_fk` (`report_id`),
  CONSTRAINT `test_instance_result_sets_job_reports_id_fk` FOREIGN KEY (`report_id`) REFERENCES `job_reports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_result_sets_test_instances_id_fk` FOREIGN KEY (`instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_result_sets_test_instances_id_fk_2` FOREIGN KEY (`target_instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11185 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_instance_results`
--

DROP TABLE IF EXISTS `test_instance_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_instance_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `screenshot_id` int NOT NULL,
  `target_screenshot_id` int NOT NULL,
  `instance_result_set_id` int NOT NULL,
  `diff_delta` float(5,2) NOT NULL DEFAULT '0.00',
  `diff_image_url` text,
  `status` enum('PASSED','FAILED','MANUAL_REVIEW_REQUIRED') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_instance_results_test_instance_screenshots_id_fk` (`screenshot_id`),
  KEY `test_instance_results_test_instance_screenshots_id_fk_2` (`target_screenshot_id`),
  KEY `test_instance_results_test_instance_result_sets_id_fk` (`instance_result_set_id`),
  CONSTRAINT `test_instance_results_test_instance_result_sets_id_fk` FOREIGN KEY (`instance_result_set_id`) REFERENCES `test_instance_result_sets` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_results_test_instance_screenshots_id_fk` FOREIGN KEY (`screenshot_id`) REFERENCES `test_instance_screenshots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_results_test_instance_screenshots_id_fk_2` FOREIGN KEY (`target_screenshot_id`) REFERENCES `test_instance_screenshots` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13676 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_instance_screenshots`
--

DROP TABLE IF EXISTS `test_instance_screenshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_instance_screenshots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instance_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `action_index` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `test_instance_screenshots_test_instance_id_fk` (`instance_id`),
  CONSTRAINT `test_instance_screenshots_test_instance_id_fk` FOREIGN KEY (`instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16137 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_instances`
--

DROP TABLE IF EXISTS `test_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_instances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `test_id` int NOT NULL,
  `status` enum('QUEUED','RUNNING','FINISHED','TIMEOUT','ABORTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'QUEUED',
  `code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` enum('CHROME','FIREFOX','SAFARI') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHROME',
  `recorded_video_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `recorded_clip_video_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `test_instance_tests_id_fk` (`test_id`),
  KEY `test_instance_jobs_id_fk` (`job_id`),
  CONSTRAINT `test_instance_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_tests_id_fk` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `events` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int unsigned NOT NULL,
  `featured_video_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `featured_screenshot_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `meta` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `draft_job_id` int DEFAULT NULL,
  `featured_clip_video_url` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tags` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `run_after` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tests_projects_id_fk` (`project_id`),
  KEY `tests_users_id_fk` (`user_id`),
  KEY `tests_jobs_id_fk` (`draft_job_id`),
  FULLTEXT KEY `test_search_index` (`name`),
  CONSTRAINT `tests_jobs_id_fk` FOREIGN KEY (`draft_job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tests_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tests_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1769 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_meta`
--

DROP TABLE IF EXISTS `user_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_meta` (
  `user_id` int unsigned NOT NULL,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  KEY `user_meta___fk__user` (`user_id`),
  CONSTRAINT `user_meta___fk__user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Table to store user related info';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_project_roles`
--

DROP TABLE IF EXISTS `user_project_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_project_roles` (
  `user_id` int unsigned NOT NULL,
  `project_id` int NOT NULL,
  `role` enum('ADMIN','REVIEWER','EDITOR','VIEWER') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'VIEWER',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `user_project_roles_projects_id_fk` (`project_id`),
  KEY `user_project_roles_users_id_fk` (`user_id`),
  CONSTRAINT `user_project_roles_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `user_project_roles_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_provider_connections`
--

DROP TABLE IF EXISTS `user_provider_connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_provider_connections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `provider` enum('GITHUB','GITLAB') NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `provider_user_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_provider_connections_users_id_fk` (`user_id`),
  CONSTRAINT `user_provider_connections_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_team_roles`
--

DROP TABLE IF EXISTS `user_team_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_team_roles` (
  `user_id` int unsigned NOT NULL,
  `team_id` int NOT NULL,
  `role` enum('MEMBER','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'MEMBER',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `user_team_roles_teams_id_fk` (`team_id`),
  KEY `user_team_roles_users_id_fk` (`user_id`),
  CONSTRAINT `user_team_roles_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `user_team_roles_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `meta` text,
  `is_oss` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `password` text,
  `name` varchar(30) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_uindex` (`email`),
  KEY `user___fk_team_id` (`team_id`),
  CONSTRAINT `user___fk_team_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-04  3:05:49
