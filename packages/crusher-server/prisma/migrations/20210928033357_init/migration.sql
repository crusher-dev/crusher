-- CreateTable
CREATE TABLE `alerting` (
    `user_id` INTEGER UNSIGNED NOT NULL,
    `github_code` VARCHAR(255),
    `created_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `alerting.user_id_unique`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cli_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('Started', 'Completed') DEFAULT 'Started',
    `user_id` INTEGER,
    `team_id` INTEGER,
    `created_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `token` VARCHAR(255),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `result_id` INTEGER NOT NULL,
    `report_id` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `replied_to` INTEGER,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `comments_comments_id_fk`(`replied_to`),
    INDEX `comments_job_reports_id_fk`(`report_id`),
    INDEX `comments_test_instance_results_id_fk`(`result_id`),
    INDEX `comments_users_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `environments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `browser` ENUM('ALL', 'SAFARI', 'CHROME', 'FIREFOX') NOT NULL DEFAULT 'CHROME',
    `vars` LONGTEXT NOT NULL,
    `created_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0),

    INDEX `environments_projects_id_fk`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `github_app_installations` (
    `owner_name` VARCHAR(255) NOT NULL,
    `repo_name` VARCHAR(255) NOT NULL,
    `installation_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `github_app_installations_ownerName_repoName_index`(`owner_name`, `repo_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integration_alerting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER,
    `integration_id` INTEGER,
    `user_id` INTEGER,
    `config` VARCHAR(600),
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `integration_alerting_projects_id_fk`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `reference_job_id` INTEGER,
    `total_test_count` INTEGER,
    `passed_test_count` INTEGER,
    `failed_test_count` INTEGER,
    `review_required_test_count` INTEGER,
    `project_id` INTEGER NOT NULL,
    `status` ENUM('PASSED', 'FAILED', 'MANUAL_REVIEW_REQUIRED', 'RUNNING') NOT NULL DEFAULT 'RUNNING',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `status_explanation` LONGTEXT,

    INDEX `job_reports_jobs_id_fk_2`(`reference_job_id`),
    INDEX `job_reports_projects_id_fk`(`job_id`),
    INDEX `job_reports_projects_id_fk_1`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latest_report_id` INTEGER,
    `pr_id` VARCHAR(255),
    `commit_id` VARCHAR(50),
    `repo_name` VARCHAR(255),
    `branch_name` VARCHAR(200),
    `commit_name` TEXT,
    `status` ENUM('CREATED', 'QUEUED', 'RUNNING', 'FINISHED', 'TIMEOUT', 'ABORTED') NOT NULL DEFAULT 'CREATED',
    `host` VARCHAR(255) NOT NULL,
    `build_trigger` ENUM('MANUAL', 'CLI', 'CRON') NOT NULL DEFAULT 'MANUAL',
    `meta` LONGTEXT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `check_run_id` VARCHAR(100),
    `browser` ENUM('CHROME', 'FIREFOX', 'SAFARI', 'ALL') DEFAULT 'CHROME',
    `installation_id` VARCHAR(255),
    `user_id` INTEGER UNSIGNED NOT NULL,
    `project_id` INTEGER,
    `config` JSON NOT NULL,
    `is_draft_job` BOOLEAN NOT NULL DEFAULT false,

    INDEX `jobs_job_reports_id_fk`(`latest_report_id`),
    INDEX `jobs_projects_id_fk`(`project_id`),
    INDEX `jobs_users_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monitorings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `environment_id` INTEGER NOT NULL,
    `last_cron_run` DATETIME(0) DEFAULT "1970-01-02 12:59:40",
    `test_interval` INTEGER DEFAULT 86400,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `monitoring_settings_projects_id_fk`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_hosts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` TEXT NOT NULL,
    `host_name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `project_id` INTEGER NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `project_hosts_projects_id_fk`(`project_id`),
    INDEX `project_hosts_user_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `team_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `baseline_job_id` INTEGER,
    `meta` TEXT,

    INDEX `projects_jobs_id_fk`(`baseline_job_id`),
    INDEX `projects_team_id_fk`(`team_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `team_email` VARCHAR(255),
    `tier` ENUM('FREE', 'STARTER', 'PRO') NOT NULL DEFAULT 'FREE',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `stripe_customer_id` VARCHAR(100),
    `meta` TEXT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_instance_result_sets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `instance_id` INTEGER NOT NULL,
    `target_instance_id` INTEGER NOT NULL,
    `status` ENUM('WAITING_FOR_TEST_EXECUTION', 'RUNNING_CHECKS', 'FINISHED_RUNNING_CHECKS') NOT NULL DEFAULT 'WAITING_FOR_TEST_EXECUTION',
    `conclusion` ENUM('PASSED', 'FAILED', 'MANUAL_REVIEW_REQUIRED'),
    `failed_reason` TEXT,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `test_instance_result_sets_job_reports_id_fk`(`report_id`),
    INDEX `test_instance_result_sets_test_instances_id_fk`(`instance_id`),
    INDEX `test_instance_result_sets_test_instances_id_fk_2`(`target_instance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_instance_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `screenshot_id` INTEGER NOT NULL,
    `target_screenshot_id` INTEGER NOT NULL,
    `instance_result_set_id` INTEGER NOT NULL,
    `diff_delta` FLOAT NOT NULL DEFAULT 0.00,
    `diff_image_url` TEXT,
    `status` ENUM('PASSED', 'FAILED', 'MANUAL_REVIEW_REQUIRED') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `test_instance_results_test_instance_result_sets_id_fk`(`instance_result_set_id`),
    INDEX `test_instance_results_test_instance_screenshots_id_fk`(`screenshot_id`),
    INDEX `test_instance_results_test_instance_screenshots_id_fk_2`(`target_screenshot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_instance_screenshots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instance_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `url` TEXT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `action_index` INTEGER NOT NULL DEFAULT 0,

    INDEX `test_instance_screenshots_test_instance_id_fk`(`instance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_instances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `status` ENUM('QUEUED', 'RUNNING', 'FINISHED', 'TIMEOUT', 'ABORTED') NOT NULL DEFAULT 'QUEUED',
    `code` LONGTEXT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `host` VARCHAR(255),
    `browser` ENUM('CHROME', 'FIREFOX', 'SAFARI') NOT NULL DEFAULT 'CHROME',
    `recorded_video_url` VARCHAR(200),

    INDEX `test_instance_jobs_id_fk`(`job_id`),
    INDEX `test_instance_tests_id_fk`(`test_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `events` LONGTEXT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` INTEGER UNSIGNED NOT NULL,
    `featured_video_url` MEDIUMTEXT,
    `featured_screenshot_url` MEDIUMTEXT,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `meta` TEXT,
    `draft_job_id` INTEGER,

    INDEX `test_search_index`(`name`),
    INDEX `tests_jobs_id_fk`(`draft_job_id`),
    INDEX `tests_projects_id_fk`(`project_id`),
    INDEX `tests_users_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_integrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER,
    `integration_name` ENUM('SLACK'),
    `label` CHAR(40),
    `access_token` VARCHAR(500),
    `webhook_url` VARCHAR(500),
    `meta_info` TEXT NOT NULL,
    `created_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_meta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(400) NOT NULL,

    INDEX `user_meta___fk__user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_project_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `project_id` INTEGER NOT NULL,
    `role` ENUM('ADMIN', 'REVIEWER', 'EDITOR', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_project_roles_projects_id_fk`(`project_id`),
    INDEX `user_project_roles_users_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_provider_connections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `provider` ENUM('GITHUB', 'GITLAB') NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `provider_user_id` VARCHAR(255),
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_provider_connections_users_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_team_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `team_id` INTEGER NOT NULL,
    `role` ENUM('MEMBER', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_team_roles_teams_id_fk`(`team_id`),
    INDEX `user_team_roles_users_id_fk`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `team_id` INTEGER,
    `email` VARCHAR(50) NOT NULL,
    `meta` TEXT,
    `is_oss` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `password` TEXT,
    `name` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `users.email_unique`(`email`),
    INDEX `user___fk_team_id`(`team_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alerting` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD FOREIGN KEY (`replied_to`) REFERENCES `comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD FOREIGN KEY (`report_id`) REFERENCES `job_reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD FOREIGN KEY (`result_id`) REFERENCES `test_instance_results`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `environments` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `integration_alerting` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_reports` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_reports` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_reports` ADD FOREIGN KEY (`reference_job_id`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD FOREIGN KEY (`latest_report_id`) REFERENCES `job_reports`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monitorings` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_hosts` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_hosts` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD FOREIGN KEY (`baseline_job_id`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_result_sets` ADD FOREIGN KEY (`instance_id`) REFERENCES `test_instances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_result_sets` ADD FOREIGN KEY (`report_id`) REFERENCES `job_reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_result_sets` ADD FOREIGN KEY (`target_instance_id`) REFERENCES `test_instances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_results` ADD FOREIGN KEY (`instance_result_set_id`) REFERENCES `test_instance_result_sets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_results` ADD FOREIGN KEY (`screenshot_id`) REFERENCES `test_instance_screenshots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_results` ADD FOREIGN KEY (`target_screenshot_id`) REFERENCES `test_instance_screenshots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instance_screenshots` ADD FOREIGN KEY (`instance_id`) REFERENCES `test_instances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instances` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_instances` ADD FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD FOREIGN KEY (`draft_job_id`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meta` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_project_roles` ADD FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_project_roles` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_provider_connections` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_team_roles` ADD FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_team_roles` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
