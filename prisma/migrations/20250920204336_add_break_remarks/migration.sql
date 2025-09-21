/*
  Warnings:

  - You are about to drop the column `reportId` on the `Remark` table. All the data in the column will be lost.
  - You are about to drop the `BreakeList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RemarkReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Remark" DROP CONSTRAINT "Remark_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Row" DROP CONSTRAINT "Row_scheduleId_fkey";

-- AlterTable
ALTER TABLE "public"."Remark" DROP COLUMN "reportId",
ADD COLUMN     "scheduleId" INTEGER;

-- DropTable
DROP TABLE "public"."BreakeList";

-- DropTable
DROP TABLE "public"."RemarkReport";

-- CreateTable
CREATE TABLE "public"."BreakRemarks" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreakRemarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BreakRemarks_date_key" ON "public"."BreakRemarks"("date");

-- CreateIndex
CREATE INDEX "BreakRemarks_date_idx" ON "public"."BreakRemarks"("date");

-- AddForeignKey
ALTER TABLE "public"."Remark" ADD CONSTRAINT "Remark_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."BreakRemarks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Row" ADD CONSTRAINT "Row_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."BreakRemarks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
