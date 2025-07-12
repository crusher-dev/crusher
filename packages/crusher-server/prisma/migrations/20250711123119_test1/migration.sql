-- AlterTable
CREATE SEQUENCE comments_id_seq;
ALTER TABLE "comments" ALTER COLUMN "id" SET DEFAULT nextval('comments_id_seq');
ALTER SEQUENCE comments_id_seq OWNED BY "comments"."id";

-- AlterTable
CREATE SEQUENCE environments_id_seq;
ALTER TABLE "environments" ALTER COLUMN "id" SET DEFAULT nextval('environments_id_seq');
ALTER SEQUENCE environments_id_seq OWNED BY "environments"."id";

-- AlterTable
CREATE SEQUENCE git_integrations_id_seq;
ALTER TABLE "git_integrations" ALTER COLUMN "id" SET DEFAULT nextval('git_integrations_id_seq');
ALTER SEQUENCE git_integrations_id_seq OWNED BY "git_integrations"."id";

-- AlterTable
CREATE SEQUENCE integration_alerting_id_seq;
ALTER TABLE "integration_alerting" ALTER COLUMN "id" SET DEFAULT nextval('integration_alerting_id_seq');
ALTER SEQUENCE integration_alerting_id_seq OWNED BY "integration_alerting"."id";

-- AlterTable
CREATE SEQUENCE integrations_id_seq;
ALTER TABLE "integrations" ALTER COLUMN "id" SET DEFAULT nextval('integrations_id_seq');
ALTER SEQUENCE integrations_id_seq OWNED BY "integrations"."id";

-- AlterTable
CREATE SEQUENCE job_reports_id_seq;
ALTER TABLE "job_reports" ALTER COLUMN "id" SET DEFAULT nextval('job_reports_id_seq');
ALTER SEQUENCE job_reports_id_seq OWNED BY "job_reports"."id";

-- AlterTable
CREATE SEQUENCE jobs_id_seq;
ALTER TABLE "jobs" ALTER COLUMN "id" SET DEFAULT nextval('jobs_id_seq');
ALTER SEQUENCE jobs_id_seq OWNED BY "jobs"."id";

-- AlterTable
CREATE SEQUENCE monitorings_id_seq;
ALTER TABLE "monitorings" ALTER COLUMN "id" SET DEFAULT nextval('monitorings_id_seq'),
ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;
ALTER SEQUENCE monitorings_id_seq OWNED BY "monitorings"."id";

-- AlterTable
CREATE SEQUENCE project_hosts_id_seq;
ALTER TABLE "project_hosts" ALTER COLUMN "id" SET DEFAULT nextval('project_hosts_id_seq');
ALTER SEQUENCE project_hosts_id_seq OWNED BY "project_hosts"."id";

-- AlterTable
CREATE SEQUENCE projects_id_seq;
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT nextval('projects_id_seq');
ALTER SEQUENCE projects_id_seq OWNED BY "projects"."id";

-- AlterTable
CREATE SEQUENCE teams_id_seq;
ALTER TABLE "teams" ALTER COLUMN "id" SET DEFAULT nextval('teams_id_seq');
ALTER SEQUENCE teams_id_seq OWNED BY "teams"."id";

-- AlterTable
CREATE SEQUENCE templates_id_seq;
ALTER TABLE "templates" ALTER COLUMN "id" SET DEFAULT nextval('templates_id_seq');
ALTER SEQUENCE templates_id_seq OWNED BY "templates"."id";

-- AlterTable
CREATE SEQUENCE test_instance_result_sets_id_seq;
ALTER TABLE "test_instance_result_sets" ALTER COLUMN "id" SET DEFAULT nextval('test_instance_result_sets_id_seq');
ALTER SEQUENCE test_instance_result_sets_id_seq OWNED BY "test_instance_result_sets"."id";

-- AlterTable
CREATE SEQUENCE test_instance_results_id_seq;
ALTER TABLE "test_instance_results" ALTER COLUMN "id" SET DEFAULT nextval('test_instance_results_id_seq');
ALTER SEQUENCE test_instance_results_id_seq OWNED BY "test_instance_results"."id";

-- AlterTable
CREATE SEQUENCE test_instance_screenshots_id_seq;
ALTER TABLE "test_instance_screenshots" ALTER COLUMN "id" SET DEFAULT nextval('test_instance_screenshots_id_seq');
ALTER SEQUENCE test_instance_screenshots_id_seq OWNED BY "test_instance_screenshots"."id";

-- AlterTable
CREATE SEQUENCE test_instances_id_seq;
ALTER TABLE "test_instances" ALTER COLUMN "id" SET DEFAULT nextval('test_instances_id_seq');
ALTER SEQUENCE test_instances_id_seq OWNED BY "test_instances"."id";

-- AlterTable
CREATE SEQUENCE tests_id_seq;
ALTER TABLE "tests" ALTER COLUMN "id" SET DEFAULT nextval('tests_id_seq');
ALTER SEQUENCE tests_id_seq OWNED BY "tests"."id";

-- AlterTable
CREATE SEQUENCE user_provider_connections_id_seq;
ALTER TABLE "user_provider_connections" ALTER COLUMN "id" SET DEFAULT nextval('user_provider_connections_id_seq');
ALTER SEQUENCE user_provider_connections_id_seq OWNED BY "user_provider_connections"."id";
