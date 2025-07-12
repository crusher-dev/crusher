-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "is_local_job" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "monitorings" ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;
