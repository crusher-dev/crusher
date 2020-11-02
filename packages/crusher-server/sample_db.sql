-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: crusher
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `diff_records`
--

DROP TABLE IF EXISTS `diff_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diff_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `base_images` text NOT NULL,
  `reference_images` text NOT NULL,
  `diff_images` text NOT NULL,
  `delta` int(11) NOT NULL DEFAULT 0,
  `build_id` int(11) NOT NULL,
  `reference_build_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `diff_records_builds_id_fk` (`build_id`),
  KEY `diff_records_builds_id_fk_2` (`reference_build_id`),
  KEY `diff_records_tests_id_fk` (`test_id`),
  CONSTRAINT `diff_records_builds_id_fk` FOREIGN KEY (`build_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `diff_records_builds_id_fk_2` FOREIGN KEY (`reference_build_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `diff_records_tests_id_fk` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diff_records`
--

LOCK TABLES `diff_records` WRITE;
/*!40000 ALTER TABLE `diff_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `diff_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `draft_instance`
--

DROP TABLE IF EXISTS `draft_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `draft_instance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `draft_id` int(11) NOT NULL,
  `deployment_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('CREATED','FINISHED','TIMEOUT','SKIPPED','ABORTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CREATED',
  `host` varchar(255) NOT NULL,
  `code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `platform` enum('FIREFOX','CHROME','WEBKIT') NOT NULL DEFAULT 'CHROME',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `draft_instance_tests_id_fk` (`draft_id`),
  CONSTRAINT `draft_instance_tests_id_fk` FOREIGN KEY (`draft_id`) REFERENCES `drafts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `draft_instance`
--

LOCK TABLES `draft_instance` WRITE;
/*!40000 ALTER TABLE `draft_instance` DISABLE KEYS */;
/*!40000 ALTER TABLE `draft_instance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drafts`
--

DROP TABLE IF EXISTS `drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drafts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(4369) DEFAULT NULL,
  `events` varchar(4369) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `framework` char(10) DEFAULT NULL,
  `test_group_id` int(11) DEFAULT NULL,
  `test_name` tinytext DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `drafts_projects_id_fk` (`project_id`),
  KEY `drafts_test_groups_id_fk` (`test_group_id`),
  CONSTRAINT `drafts_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `drafts_test_groups_id_fk` FOREIGN KEY (`test_group_id`) REFERENCES `test_groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drafts`
--

LOCK TABLES `drafts` WRITE;
/*!40000 ALTER TABLE `drafts` DISABLE KEYS */;
INSERT INTO `drafts` VALUES (30,'const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\nawait browser.close();\n','[]','2020-06-20 03:02:16','PLAYWRIGHT',10,'Test',26,35);
/*!40000 ALTER TABLE `drafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pr_id` varchar(255) DEFAULT NULL,
  `branch_name` varchar(200) DEFAULT NULL,
  `commit_id` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `project_id` int(11) NOT NULL,
  `trigger` enum('MANUAL','CRON','PR') NOT NULL DEFAULT 'MANUAL',
  `status` enum('CREATED','FINISHED','TIMEOUT','SKIPPED','ABORTED') NOT NULL DEFAULT 'CREATED',
  PRIMARY KEY (`id`),
  KEY `jobs_projects_id_fk` (`project_id`),
  CONSTRAINT `jobs_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_team_id_fk` (`team_id`),
  CONSTRAINT `projects_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (17,'hello',19),(18,'hello',19),(19,'test',19),(20,'test',19),(21,'Has',19),(22,'projectTest',19),(23,'Default',22),(24,'Default',23),(25,'Default',24),(26,'Default',25);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `team_email` varchar(255) DEFAULT NULL,
  `tier` enum('FREE','STARTER','PRO') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (16,'Hello','undefined','FREE','2020-05-24 11:40:32','2020-05-24 11:40:32'),(17,'Hudixt','undefined','FREE','2020-05-24 11:42:54','2020-05-24 11:42:54'),(18,'hallo','undefined','FREE','2020-05-24 12:06:42','2020-05-24 12:06:42'),(19,'Lankesh','undefined','FREE','2020-05-24 12:07:40','2020-05-24 12:07:40'),(20,'Test','songsforme97@gmail.com','FREE','2020-05-24 12:29:49','2020-05-24 12:29:49'),(21,'Hello','utkarsh.dixit@headout.com','FREE','2020-05-29 05:48:46','2020-05-29 05:48:46'),(22,'Namastay','utkarsh.19bcon068@jecrcu.edu.in','FREE','2020-06-12 02:49:21','2020-06-12 02:49:21'),(23,'Test','utkarshdix01@gmail.com','FREE','2020-06-14 14:53:57','2020-06-14 14:53:57'),(24,'Test','hudixt@gmail.com','FREE','2020-06-17 16:31:15','2020-06-17 16:31:15'),(25,'Utkarsh','utkarshdix02@gmail.com','FREE','2020-06-19 21:23:30','2020-06-19 21:23:30');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_groups`
--

DROP TABLE IF EXISTS `test_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `test_groups_projects_id_fk` (`project_id`),
  CONSTRAINT `test_groups_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_groups`
--

LOCK TABLES `test_groups` WRITE;
/*!40000 ALTER TABLE `test_groups` DISABLE KEYS */;
INSERT INTO `test_groups` VALUES (1,17,'hello'),(2,17,'shyam'),(3,18,'Shit'),(4,18,'test'),(5,18,'Samosa'),(6,22,'demoTestGroup'),(7,23,'TEST GROUP I'),(8,24,'TEST GROUP I'),(9,25,'TEST GROUP I'),(10,26,'TEST GROUP I');
/*!40000 ALTER TABLE `test_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_instance`
--

DROP TABLE IF EXISTS `test_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_instance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `deployment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('CREATED','FINISHED','TIMEOUT','SKIPPED','ABORTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CREATED',
  `host` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `platform` enum('FIREFOX','CHROME','WEBKIT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHROME',
  PRIMARY KEY (`id`),
  KEY `test_instance_tests_id_fk` (`test_id`),
  KEY `test_instance_jobs_id_fk` (`job_id`),
  CONSTRAINT `test_instance_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `test_instance_tests_id_fk` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_instance`
--

LOCK TABLES `test_instance` WRITE;
/*!40000 ALTER TABLE `test_instance` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_instance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_instance_results`
--

DROP TABLE IF EXISTS `test_instance_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_instance_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `instance_id` int(11) NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `test_instance_results_test_instance_id_fk` (`instance_id`),
  CONSTRAINT `test_instance_results_test_instance_id_fk` FOREIGN KEY (`instance_id`) REFERENCES `test_instance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_instance_results`
--

LOCK TABLES `test_instance_results` WRITE;
/*!40000 ALTER TABLE `test_instance_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_instance_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `group_id` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `events` text NOT NULL,
  `framework` enum('playwright','puppeter') DEFAULT 'playwright',
  `code` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tests_test_groups_id_fk` (`group_id`),
  CONSTRAINT `tests_test_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `test_groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
INSERT INTO `tests` VALUES (17,'Test',1,'2020-06-16 17:00:39','[]','playwright','const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\nawait browser.close();\n'),(18,'Test',1,'2020-06-16 18:11:47','[{\"event_type\":\"NAVIGATE_URL\",\"selector\":\"#gsr\",\"value\":\"https://www.google.com/\"},{\"event_type\":\"PAGE_SCREENSHOT\",\"selector\":\"#gsr\",\"value\":\"Google\"}]','playwright','const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\n  await page.goto(\'https://www.google.com/\');\n  await page.screenshot({path: \'/tmp/images/Google_1.png\'});\nawait browser.close();\n'),(19,'Test',1,'2020-06-16 18:22:18','[{\"event_type\":\"NAVIGATE_URL\",\"selector\":\"#gsr\",\"value\":\"https://www.google.com/\"},{\"event_type\":\"PAGE_SCREENSHOT\",\"selector\":\"#gsr\",\"value\":\"Google\"}]','playwright','const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\n  await page.goto(\'https://www.google.com/\');\n  await page.screenshot({path: \'/tmp/images/Google_1.png\'});\nawait browser.close();\n'),(20,'Test',1,'2020-06-16 18:22:43','[{\"event_type\":\"NAVIGATE_URL\",\"selector\":\"#gsr\",\"value\":\"https://www.google.com/\"},{\"event_type\":\"PAGE_SCREENSHOT\",\"selector\":\"#gsr\",\"value\":\"Google\"}]','playwright','const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\n  await page.goto(\'https://www.google.com/\');\n  await page.screenshot({path: \'/tmp/images/Google_1.png\'});\nawait browser.close();\n'),(21,'Test',2,'2020-06-16 18:23:50','[{\"event_type\":\"NAVIGATE_URL\",\"selector\":\"#gsr\",\"value\":\"https://www.google.com/\"},{\"event_type\":\"PAGE_SCREENSHOT\",\"selector\":\"#gsr\",\"value\":\"Google\"}]','playwright','const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\n  await page.goto(\'https://www.google.com/\');\n  await page.screenshot({path: \'/tmp/images/Google_1.png\'});\nawait browser.close();\n'),(22,'Test',1,'2020-06-16 19:52:08','[]','playwright','const playwright = require(\'playwright\');\n\nconst browser = await playwright[\"chromium\"].launch();\nconst page = await browser.newPage();\n\nawait browser.close();\n');
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int(11) DEFAULT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user___fk_team_id` (`team_id`),
  CONSTRAINT `user___fk_team_id` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (35,25,'Utkarsh','Dixit','utkarshdix02@gmail.com','a5492ab1ce1b84663c7b261524777faf',1,'2020-06-19 21:23:30','2020-06-19 21:23:30');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-20 17:06:10
