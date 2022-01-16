-- CreateEnum
CREATE TYPE "cli_status_status" AS ENUM ('Started', 'Completed');

-- CreateEnum
CREATE TYPE "integrations_integration_name" AS ENUM ('SLACK');

-- CreateEnum
CREATE TYPE "job_reports_status" AS ENUM ('PASSED', 'FAILED', 'MANUAL_REVIEW_REQUIRED', 'RUNNING');

-- CreateEnum
CREATE TYPE "jobs_build_trigger" AS ENUM ('MANUAL', 'CLI', 'CRON');

-- CreateEnum
CREATE TYPE "jobs_status" AS ENUM ('CREATED', 'QUEUED', 'RUNNING', 'FINISHED', 'TIMEOUT', 'ABORTED');

-- CreateEnum
CREATE TYPE "teams_tier" AS ENUM ('FREE', 'STARTER', 'PRO');

-- CreateEnum
CREATE TYPE "test_instance_result_sets_conclusion" AS ENUM ('PASSED', 'FAILED', 'MANUAL_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "test_instance_result_sets_status" AS ENUM ('WAITING_FOR_TEST_EXECUTION', 'RUNNING_CHECKS', 'FINISHED_RUNNING_CHECKS');

-- CreateEnum
CREATE TYPE "test_instance_results_status" AS ENUM ('PASSED', 'FAILED', 'MANUAL_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "test_instances_browser" AS ENUM ('CHROME', 'FIREFOX', 'SAFARI');

-- CreateEnum
CREATE TYPE "test_instances_status" AS ENUM ('QUEUED', 'RUNNING', 'FINISHED', 'TIMEOUT', 'ABORTED');

-- CreateEnum
CREATE TYPE "user_project_roles_role" AS ENUM ('ADMIN', 'REVIEWER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "user_provider_connections_provider" AS ENUM ('GITHUB', 'GITLAB');

-- CreateEnum
CREATE TYPE "user_team_roles_role" AS ENUM ('MEMBER', 'ADMIN');

-- CreateTable
CREATE TABLE "alerting" (
    "user_id" BIGINT NOT NULL,
    "github_code" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "cli_status" (
    "status" "cli_status_status" DEFAULT E'Started',
    "user_id" INTEGER,
    "team_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "token" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "comments" (
    "id" INTEGER NOT NULL,
    "user_id" BIGINT NOT NULL,
    "result_id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "replied_to" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "browser" JSON NOT NULL,
    "vars" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "user_id" BIGINT NOT NULL,
    "host" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "git_integrations" (
    "id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "repo_name" VARCHAR(200),
    "repo_link" VARCHAR(200),
    "installation_id" VARCHAR(200),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repo_id" VARCHAR(200),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_app_installations" (
    "owner_name" VARCHAR(255) NOT NULL,
    "repo_name" VARCHAR(255) NOT NULL,
    "installation_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "integration_alerting" (
    "id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "integration_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "config" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "integration_name" "integrations_integration_name" NOT NULL,
    "meta" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_reports" (
    "id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "reference_job_id" INTEGER,
    "total_test_count" INTEGER,
    "passed_test_count" INTEGER,
    "failed_test_count" INTEGER,
    "review_required_test_count" INTEGER,
    "project_id" INTEGER NOT NULL,
    "status" "job_reports_status" NOT NULL DEFAULT E'RUNNING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status_explanation" TEXT,
    "meta" JSON,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" INTEGER NOT NULL,
    "latest_report_id" INTEGER,
    "pr_id" VARCHAR(255),
    "commit_id" VARCHAR(50),
    "repo_name" VARCHAR(255),
    "branch_name" VARCHAR(200),
    "commit_name" TEXT,
    "status" "jobs_status" NOT NULL DEFAULT E'CREATED',
    "host" VARCHAR(255) NOT NULL,
    "build_trigger" "jobs_build_trigger" NOT NULL DEFAULT E'MANUAL',
    "meta" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "check_run_id" VARCHAR(100),
    "browser" JSON NOT NULL,
    "installation_id" VARCHAR(255),
    "user_id" BIGINT,
    "project_id" INTEGER,
    "config" JSON NOT NULL,
    "is_draft_job" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitorings" (
    "id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "environment_id" INTEGER NOT NULL,
    "last_cron_run" TIMESTAMPTZ(6) DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone,
    "test_interval" INTEGER DEFAULT 86400,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_hosts" (
    "id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "host_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER NOT NULL,
    "user_id" BIGINT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "baseline_job_id" INTEGER,
    "meta" TEXT,
    "visual_baseline" INTEGER NOT NULL DEFAULT 5,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "team_email" VARCHAR(255),
    "tier" "teams_tier" NOT NULL DEFAULT E'FREE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" VARCHAR(100),
    "meta" TEXT,
    "uuid" VARCHAR(50),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" INTEGER NOT NULL,
    "events" TEXT,
    "user_id" BIGINT,
    "project_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(200) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_instance_action_results" (
    "instance_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "actions_result" JSON NOT NULL,
    "has_instance_passed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "test_instance_result_sets" (
    "id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,
    "instance_id" INTEGER NOT NULL,
    "target_instance_id" INTEGER NOT NULL,
    "status" "test_instance_result_sets_status" NOT NULL DEFAULT E'WAITING_FOR_TEST_EXECUTION',
    "conclusion" "test_instance_result_sets_conclusion",
    "failed_reason" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_instance_results" (
    "id" INTEGER NOT NULL,
    "screenshot_id" INTEGER NOT NULL,
    "target_screenshot_id" INTEGER NOT NULL,
    "instance_result_set_id" INTEGER NOT NULL,
    "diff_delta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "diff_image_url" TEXT,
    "status" "test_instance_results_status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_instance_screenshots" (
    "id" INTEGER NOT NULL,
    "instance_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_index" VARCHAR(50) NOT NULL DEFAULT E'0',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_instances" (
    "id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "status" "test_instances_status" NOT NULL DEFAULT E'QUEUED',
    "code" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "host" VARCHAR(255),
    "browser" "test_instances_browser" NOT NULL DEFAULT E'CHROME',
    "recorded_video_url" TEXT,
    "recorded_clip_video_url" TEXT,
    "meta" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "events" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT NOT NULL,
    "featured_video_url" TEXT,
    "featured_screenshot_url" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "meta" TEXT,
    "draft_job_id" INTEGER,
    "featured_clip_video_url" TEXT,
    "tags" VARCHAR(20),
    "run_after" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_meta" (
    "user_id" BIGINT NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" VARCHAR(400) NOT NULL
);

-- CreateTable
CREATE TABLE "user_project_roles" (
    "user_id" BIGINT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "role" "user_project_roles_role" NOT NULL DEFAULT E'VIEWER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_provider_connections" (
    "id" INTEGER NOT NULL,
    "user_id" BIGINT NOT NULL,
    "provider" "user_provider_connections_provider" NOT NULL,
    "access_token" VARCHAR(255) NOT NULL,
    "provider_user_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_team_roles" (
    "user_id" BIGINT NOT NULL,
    "team_id" INTEGER NOT NULL,
    "role" "user_team_roles_role" NOT NULL DEFAULT E'MEMBER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "team_id" INTEGER,
    "email" VARCHAR(50) NOT NULL,
    "meta" TEXT,
    "is_oss" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "name" VARCHAR(30) NOT NULL,
    "uuid" VARCHAR(50),
    "github_user_id" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alerting.user_id_unique" ON "alerting"("user_id");

-- CreateIndex
CREATE INDEX "idx_24704_comments_comments_id_fk" ON "comments"("replied_to");

-- CreateIndex
CREATE INDEX "idx_24704_comments_job_reports_id_fk" ON "comments"("report_id");

-- CreateIndex
CREATE INDEX "idx_24704_comments_test_instance_results_id_fk" ON "comments"("result_id");

-- CreateIndex
CREATE INDEX "idx_24704_comments_users_id_fk" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "idx_24712_environments_projects_id_fk" ON "environments"("project_id");

-- CreateIndex
CREATE INDEX "idx_24712_environments_users_id_fk" ON "environments"("user_id");

-- CreateIndex
CREATE INDEX "idx_24719_git_integrations_projects_id_fk" ON "git_integrations"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24727_github_app_installations_ownername_reponame_index" ON "github_app_installations"("owner_name", "repo_name");

-- CreateIndex
CREATE INDEX "idx_24735_integration_alerting_projects_id_fk" ON "integration_alerting"("project_id");

-- CreateIndex
CREATE INDEX "idx_24751_job_reports_jobs_id_fk_2" ON "job_reports"("reference_job_id");

-- CreateIndex
CREATE INDEX "idx_24751_job_reports_projects_id_fk" ON "job_reports"("job_id");

-- CreateIndex
CREATE INDEX "idx_24751_job_reports_projects_id_fk_1" ON "job_reports"("project_id");

-- CreateIndex
CREATE INDEX "idx_24760_build_search_index" ON "jobs"("commit_name", "repo_name", "host");

-- CreateIndex
CREATE INDEX "idx_24760_jobs_job_reports_id_fk" ON "jobs"("latest_report_id");

-- CreateIndex
CREATE INDEX "idx_24760_jobs_projects_id_fk" ON "jobs"("project_id");

-- CreateIndex
CREATE INDEX "idx_24760_jobs_users_id_fk" ON "jobs"("user_id");

-- CreateIndex
CREATE INDEX "idx_24771_monitoring_settings_projects_id_fk" ON "monitorings"("project_id");

-- CreateIndex
CREATE INDEX "idx_24778_project_hosts_projects_id_fk" ON "project_hosts"("project_id");

-- CreateIndex
CREATE INDEX "idx_24778_project_hosts_user_id_fk" ON "project_hosts"("user_id");

-- CreateIndex
CREATE INDEX "idx_24786_projects_jobs_id_fk" ON "projects"("baseline_job_id");

-- CreateIndex
CREATE INDEX "idx_24786_projects_team_id_fk" ON "projects"("team_id");

-- CreateIndex
CREATE INDEX "idx_24804_templates_projects_id_fk" ON "templates"("project_id");

-- CreateIndex
CREATE INDEX "idx_24804_templates_users_id_fk" ON "templates"("user_id");

-- CreateIndex
CREATE INDEX "idx_24820_test_instance_result_sets_job_reports_id_fk" ON "test_instance_result_sets"("report_id");

-- CreateIndex
CREATE INDEX "idx_24820_test_instance_result_sets_test_instances_id_fk" ON "test_instance_result_sets"("instance_id");

-- CreateIndex
CREATE INDEX "idx_24820_test_instance_result_sets_test_instances_id_fk_2" ON "test_instance_result_sets"("target_instance_id");

-- CreateIndex
CREATE INDEX "idx_24829_test_instance_results_test_instance_result_sets_id_fk" ON "test_instance_results"("instance_result_set_id");

-- CreateIndex
CREATE INDEX "idx_24829_test_instance_results_test_instance_screenshots_id_fk" ON "test_instance_results"("target_screenshot_id");

-- CreateIndex
CREATE INDEX "idx_24838_test_instance_screenshots_test_instance_id_fk" ON "test_instance_screenshots"("instance_id");

-- CreateIndex
CREATE INDEX "idx_24847_test_instance_jobs_id_fk" ON "test_instances"("job_id");

-- CreateIndex
CREATE INDEX "idx_24847_test_instance_tests_id_fk" ON "test_instances"("test_id");

-- CreateIndex
CREATE INDEX "idx_24857_tests_jobs_id_fk" ON "tests"("draft_job_id");

-- CreateIndex
CREATE INDEX "idx_24857_tests_projects_id_fk" ON "tests"("project_id");

-- CreateIndex
CREATE INDEX "idx_24857_tests_users_id_fk" ON "tests"("user_id");

-- CreateIndex
CREATE INDEX "idx_24866_user_meta___fk__user" ON "user_meta"("user_id");

-- CreateIndex
CREATE INDEX "idx_24872_user_project_roles_projects_id_fk" ON "user_project_roles"("project_id");

-- CreateIndex
CREATE INDEX "idx_24872_user_project_roles_users_id_fk" ON "user_project_roles"("user_id");

-- CreateIndex
CREATE INDEX "idx_24878_user_provider_connections_users_id_fk" ON "user_provider_connections"("user_id");

-- CreateIndex
CREATE INDEX "idx_24886_user_team_roles_teams_id_fk" ON "user_team_roles"("team_id");

-- CreateIndex
CREATE INDEX "idx_24886_user_team_roles_users_id_fk" ON "user_team_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_24894_user___fk_team_id" ON "users"("team_id");

-- AddForeignKey
ALTER TABLE "alerting" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("replied_to") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("report_id") REFERENCES "job_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("result_id") REFERENCES "test_instance_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "git_integrations" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_alerting" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_reports" ADD FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_reports" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_reports" ADD FOREIGN KEY ("reference_job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD FOREIGN KEY ("latest_report_id") REFERENCES "job_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitorings" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hosts" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hosts" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD FOREIGN KEY ("baseline_job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_result_sets" ADD FOREIGN KEY ("instance_id") REFERENCES "test_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_result_sets" ADD FOREIGN KEY ("report_id") REFERENCES "job_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_result_sets" ADD FOREIGN KEY ("target_instance_id") REFERENCES "test_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_results" ADD FOREIGN KEY ("instance_result_set_id") REFERENCES "test_instance_result_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_results" ADD FOREIGN KEY ("screenshot_id") REFERENCES "test_instance_screenshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_results" ADD FOREIGN KEY ("target_screenshot_id") REFERENCES "test_instance_screenshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_screenshots" ADD FOREIGN KEY ("instance_id") REFERENCES "test_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instances" ADD FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instances" ADD FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD FOREIGN KEY ("draft_job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meta" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project_roles" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_provider_connections" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_roles" ADD FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
