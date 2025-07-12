/*
  Warnings:

  - Added the required column `context` to the `test_instances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monitorings" ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;

-- AlterTable
ALTER TABLE "test_instances" ADD COLUMN     "context" JSON NOT NULL;
