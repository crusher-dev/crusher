-- AlterTable
ALTER TABLE "monitorings" ALTER COLUMN "last_cron_run" SET DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone;

-- CreateTable
CREATE TABLE "draft_tests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "events" TEXT,
    "user_id" BIGINT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "draft_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_draft_tests_projects_id_fk" ON "draft_tests"("project_id");

-- CreateIndex
CREATE INDEX "idx_draft_tests_users_id_fk" ON "draft_tests"("user_id");

-- AddForeignKey
ALTER TABLE "draft_tests" ADD CONSTRAINT "draft_tests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_tests" ADD CONSTRAINT "draft_tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
