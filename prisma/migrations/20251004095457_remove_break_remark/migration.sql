/*
  Warnings:

  - You are about to drop the `Remarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Remarks" DROP CONSTRAINT "Remarks_scheduleId_fkey";

-- DropTable
DROP TABLE "public"."Remarks";
