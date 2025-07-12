-- AlterTable
ALTER TABLE "monitorings" ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;

-- AlterTable
ALTER TABLE "test_instance_results" ADD COLUMN     "meta" JSON;
