-- DropForeignKey
ALTER TABLE "alerting" DROP CONSTRAINT "alerting_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_report_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_result_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "environments" DROP CONSTRAINT "environments_project_id_fkey";

-- DropForeignKey
ALTER TABLE "environments" DROP CONSTRAINT "environments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "git_integrations" DROP CONSTRAINT "git_integrations_project_id_fkey";

-- DropForeignKey
ALTER TABLE "integration_alerting" DROP CONSTRAINT "integration_alerting_project_id_fkey";

-- DropForeignKey
ALTER TABLE "job_reports" DROP CONSTRAINT "job_reports_job_id_fkey";

-- DropForeignKey
ALTER TABLE "job_reports" DROP CONSTRAINT "job_reports_project_id_fkey";

-- DropForeignKey
ALTER TABLE "monitorings" DROP CONSTRAINT "monitorings_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_hosts" DROP CONSTRAINT "project_hosts_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_hosts" DROP CONSTRAINT "project_hosts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_team_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_result_sets" DROP CONSTRAINT "test_instance_result_sets_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_result_sets" DROP CONSTRAINT "test_instance_result_sets_report_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_result_sets" DROP CONSTRAINT "test_instance_result_sets_target_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_results" DROP CONSTRAINT "test_instance_results_instance_result_set_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_results" DROP CONSTRAINT "test_instance_results_screenshot_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_results" DROP CONSTRAINT "test_instance_results_target_screenshot_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instance_screenshots" DROP CONSTRAINT "test_instance_screenshots_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instances" DROP CONSTRAINT "test_instances_job_id_fkey";

-- DropForeignKey
ALTER TABLE "test_instances" DROP CONSTRAINT "test_instances_test_id_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_project_id_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_meta" DROP CONSTRAINT "user_meta_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_project_roles" DROP CONSTRAINT "user_project_roles_project_id_fkey";

-- DropForeignKey
ALTER TABLE "user_project_roles" DROP CONSTRAINT "user_project_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_provider_connections" DROP CONSTRAINT "user_provider_connections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_team_roles" DROP CONSTRAINT "user_team_roles_team_id_fkey";

-- DropForeignKey
ALTER TABLE "user_team_roles" DROP CONSTRAINT "user_team_roles_user_id_fkey";

-- AlterTable
ALTER TABLE "monitorings" ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;

-- AddForeignKey
ALTER TABLE "alerting" ADD CONSTRAINT "alerting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "job_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "test_instance_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "git_integrations" ADD CONSTRAINT "git_integrations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_alerting" ADD CONSTRAINT "integration_alerting_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_reports" ADD CONSTRAINT "job_reports_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_reports" ADD CONSTRAINT "job_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitorings" ADD CONSTRAINT "monitorings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hosts" ADD CONSTRAINT "project_hosts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hosts" ADD CONSTRAINT "project_hosts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_result_sets" ADD CONSTRAINT "test_instance_result_sets_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "test_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_result_sets" ADD CONSTRAINT "test_instance_result_sets_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "job_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_result_sets" ADD CONSTRAINT "test_instance_result_sets_target_instance_id_fkey" FOREIGN KEY ("target_instance_id") REFERENCES "test_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_results" ADD CONSTRAINT "test_instance_results_instance_result_set_id_fkey" FOREIGN KEY ("instance_result_set_id") REFERENCES "test_instance_result_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_results" ADD CONSTRAINT "test_instance_results_screenshot_id_fkey" FOREIGN KEY ("screenshot_id") REFERENCES "test_instance_screenshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_results" ADD CONSTRAINT "test_instance_results_target_screenshot_id_fkey" FOREIGN KEY ("target_screenshot_id") REFERENCES "test_instance_screenshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instance_screenshots" ADD CONSTRAINT "test_instance_screenshots_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "test_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instances" ADD CONSTRAINT "test_instances_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_instances" ADD CONSTRAINT "test_instances_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meta" ADD CONSTRAINT "user_meta_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project_roles" ADD CONSTRAINT "user_project_roles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project_roles" ADD CONSTRAINT "user_project_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_provider_connections" ADD CONSTRAINT "user_provider_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_roles" ADD CONSTRAINT "user_team_roles_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_roles" ADD CONSTRAINT "user_team_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "alerting.user_id_unique" RENAME TO "alerting_user_id_key";

-- RenameIndex
ALTER INDEX "idx_24727_github_app_installations_ownername_reponame_index" RENAME TO "github_app_installations_owner_name_repo_name_key";

-- RenameIndex
ALTER INDEX "users.email_unique" RENAME TO "users_email_key";
