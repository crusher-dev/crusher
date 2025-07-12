-- AlterTable
ALTER TABLE "monitorings" ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "test_folder" INTEGER;

-- CreateTable
CREATE TABLE "tests_folder" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "tests_folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_tests_folder_projects_id_fk" ON "tests_folder"("project_id");

-- CreateIndex
CREATE INDEX "idx_tests_folder_id_fk" ON "tests"("test_folder");

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_test_folder_fkey" FOREIGN KEY ("test_folder") REFERENCES "tests_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests_folder" ADD CONSTRAINT "tests_folder_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
