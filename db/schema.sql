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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;

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
-- Table structure for table `draft_instance_results`
--

DROP TABLE IF EXISTS `draft_instance_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `draft_instance_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instance_id` int NOT NULL,
  `logs` text,
  `images` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `video_uri` text,
  PRIMARY KEY (`id`),
  KEY `draft_instance_results_draft_instance_id_fk` (`instance_id`),
  CONSTRAINT `draft_instance_results_draft_instance_id_fk` FOREIGN KEY (`instance_id`) REFERENCES `draft_instances` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1837 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `draft_instances`
--

DROP TABLE IF EXISTS `draft_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `draft_instances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `draft_id` int NOT NULL,
  `status` enum('QUEUED','RUNNING','FINISHED','TIMEOUT','ABORTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'QUEUED',
  `code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `platform` enum('FIREFOX','CHROME','WEBKIT') NOT NULL DEFAULT 'CHROME',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `draft_instance_tests_id_fk` (`draft_id`),
  CONSTRAINT `draft_instance_tests_id_fk` FOREIGN KEY (`draft_id`) REFERENCES `drafts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2464 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `drafts`
--

DROP TABLE IF EXISTS `drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drafts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  `events` longtext,
  `code` longtext NOT NULL,
  `user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `drafts_projects_id_fk` (`project_id`),
  CONSTRAINT `drafts_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2419 DEFAULT CHARSET=utf8mb3;
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
  `project_id` int DEFAULT NULL,
  `integration_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `config` varchar(600) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `integration_alerting_projects_id_fk` (`project_id`),
  CONSTRAINT `integration_alerting_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
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
  `status` enum('PASSED','FAILED','MANUAL_REVIEW_REQUIRED','RUNNING_CHECKS') NOT NULL DEFAULT 'RUNNING_CHECKS',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status_explanation` longtext,
  `project_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_reports_jobs_id_fk_2` (`reference_job_id`),
  KEY `job_reports_projects_id_fk` (`job_id`),
  KEY `job_reports_projects_id_fk_1` (`project_id`),
  CONSTRAINT `job_reports_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `job_reports_jobs_id_fk_2` FOREIGN KEY (`reference_job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `job_reports_projects_id_fk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8348 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `pr_id` varchar(255) DEFAULT NULL,
  `commit_id` varchar(50) DEFAULT NULL,
  `repo_name` varchar(255) DEFAULT NULL,
  `branch_name` varchar(200) DEFAULT NULL,
  `commit_name` text,
  `status` enum('CREATED','QUEUED','RUNNING','FINISHED','TIMEOUT','ABORTED') NOT NULL DEFAULT 'CREATED',
  `host` varchar(255) DEFAULT NULL,
  `trigger` enum('MANUAL','CLI','CRON') NOT NULL DEFAULT 'MANUAL',
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `check_run_id` varchar(100) DEFAULT NULL,
  `platform` enum('CHROME','FIREFOX','SAFARI','ALL') DEFAULT 'CHROME',
  `installation_id` varchar(255) DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_projects_id_fk` (`project_id`),
  KEY `jobs_users_id_fk` (`user_id`),
  CONSTRAINT `jobs_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `jobs_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9532 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `monitoring_settings`
--

DROP TABLE IF EXISTS `monitoring_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitoring_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `test_interval` int DEFAULT '86400',
  `platform` enum('FIREFOX','CHROME','SAFARI','ALL') DEFAULT 'CHROME',
  `target_host` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_cron_run` datetime DEFAULT '1970-01-02 12:59:40',
  `user_id` int unsigned DEFAULT NULL,
  `tags` text,
  PRIMARY KEY (`id`),
  KEY `monitoring_settings_project_hosts_id_fk` (`target_host`),
  KEY `monitoring_settings_projects_id_fk` (`project_id`),
  KEY `monitoring_settings_users_id_fk` (`user_id`),
  CONSTRAINT `monitoring_settings_project_hosts_id_fk` FOREIGN KEY (`target_host`) REFERENCES `project_hosts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `monitoring_settings_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `monitoring_settings_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=latin1;
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
  PRIMARY KEY (`id`),
  KEY `projects_team_id_fk` (`team_id`),
  CONSTRAINT `projects_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=latin1;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_instance_recordings`
--

DROP TABLE IF EXISTS `test_instance_recordings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_instance_recordings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_instance_id` int NOT NULL,
  `video_uri` text NOT NULL,
  `test_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_instance_recordings_test_instances_id_fk` (`test_instance_id`),
  KEY `test_instance_recordings_tests_id_fk` (`test_id`),
  CONSTRAINT `test_instance_recordings_test_instances_id_fk` FOREIGN KEY (`test_instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_recordings_tests_id_fk` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2303 DEFAULT CHARSET=latin1;
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
  `status` enum('RUNNING_CHECKS','FINISHED_RUNNING_CHECKS','ERROR_RUNNING_CHECKS','TIMEOUT') NOT NULL DEFAULT 'RUNNING_CHECKS',
  `conclusion` enum('PASSED','FAILED','MANUAL_REVIEW_REQUIRED') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_instance_result_sets_test_instances_id_fk` (`instance_id`),
  KEY `test_instance_result_sets_test_instances_id_fk_2` (`target_instance_id`),
  KEY `test_instance_result_sets_job_reports_id_fk` (`report_id`),
  CONSTRAINT `test_instance_result_sets_job_reports_id_fk` FOREIGN KEY (`report_id`) REFERENCES `job_reports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_result_sets_test_instances_id_fk` FOREIGN KEY (`instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_result_sets_test_instances_id_fk_2` FOREIGN KEY (`target_instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8399 DEFAULT CHARSET=latin1;
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
  `status` enum('PASSED','FAILED','ERROR_CREATING_DIFF','MANUAL_REVIEW_REQUIRED') NOT NULL DEFAULT 'MANUAL_REVIEW_REQUIRED',
  `action_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_instance_results_test_instance_screenshots_id_fk` (`screenshot_id`),
  KEY `test_instance_results_test_instance_screenshots_id_fk_2` (`target_screenshot_id`),
  KEY `test_instance_results_users_id_fk` (`action_by`),
  KEY `test_instance_results_test_instance_result_sets_id_fk` (`instance_result_set_id`),
  CONSTRAINT `test_instance_results_test_instance_result_sets_id_fk` FOREIGN KEY (`instance_result_set_id`) REFERENCES `test_instance_result_sets` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_results_test_instance_screenshots_id_fk` FOREIGN KEY (`screenshot_id`) REFERENCES `test_instance_screenshots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_results_test_instance_screenshots_id_fk_2` FOREIGN KEY (`target_screenshot_id`) REFERENCES `test_instance_screenshots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_results_users_id_fk` FOREIGN KEY (`action_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9879 DEFAULT CHARSET=latin1;
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
  PRIMARY KEY (`id`),
  KEY `test_instance_screenshots_test_instance_id_fk` (`instance_id`),
  CONSTRAINT `test_instance_screenshots_test_instance_id_fk` FOREIGN KEY (`instance_id`) REFERENCES `test_instances` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12127 DEFAULT CHARSET=latin1;
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
  `code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` enum('CHROME','FIREFOX','SAFARI','ALL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHROME',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `test_instance_tests_id_fk` (`test_id`),
  KEY `test_instance_jobs_id_fk` (`job_id`),
  CONSTRAINT `test_instance_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_tests_id_fk` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20434 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) NOT NULL,
  `code` longtext NOT NULL,
  `events` longtext NOT NULL,
  `framework` enum('PLAYWRIGHT','PUPPETEER','SELENIUM') NOT NULL DEFAULT 'PLAYWRIGHT',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int unsigned NOT NULL,
  `featured_video_uri` mediumtext,
  `draft_id` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tests_projects_id_fk` (`project_id`),
  KEY `tests_users_id_fk` (`user_id`),
  KEY `tests_drafts_id_fk` (`draft_id`),
  CONSTRAINT `tests_drafts_id_fk` FOREIGN KEY (`draft_id`) REFERENCES `drafts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tests_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tests_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=584 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_integrations`
--

DROP TABLE IF EXISTS `user_integrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_integrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `integration_name` enum('SLACK') DEFAULT NULL,
  `label` char(40) DEFAULT NULL COMMENT ' Required for slack team and channel',
  `access_token` varchar(500) DEFAULT NULL,
  `webhook_url` varchar(500) DEFAULT NULL,
  `meta_info` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COMMENT='This table and user_provider_connections should merge';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_meta`
--

DROP TABLE IF EXISTS `user_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_meta` (
  `user_id` int unsigned NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(400) NOT NULL,
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
  `role` enum('ADMIN','REVIEWER','EDITOR','VIEWER') NOT NULL DEFAULT 'VIEWER',
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
  `role` enum('MEMBER','ADMIN') NOT NULL DEFAULT 'MEMBER',
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
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_oss` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user___fk_team_id` (`team_id`),
  CONSTRAINT `user___fk_team_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
