/*
  Warnings:

  - You are about to drop the `BreakeList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Row" DROP CONSTRAINT "Row_scheduleId_fkey";

-- DropTable
DROP TABLE "public"."BreakeList";

-- CreateTable
CREATE TABLE "public"."BreakList" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreakList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BreakList_date_key" ON "public"."BreakList"("date");

-- CreateIndex
CREATE INDEX "BreakList_date_idx" ON "public"."BreakList"("date");

-- AddForeignKey
ALTER TABLE "public"."Row" ADD CONSTRAINT "Row_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."BreakList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
