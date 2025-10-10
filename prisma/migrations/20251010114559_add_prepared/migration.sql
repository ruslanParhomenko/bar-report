/*
  Warnings:

  - You are about to drop the `Cutting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreparedDessert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreparedSalad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreparedSecond` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Cutting" DROP CONSTRAINT "Cutting_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PreparedDessert" DROP CONSTRAINT "PreparedDessert_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PreparedSalad" DROP CONSTRAINT "PreparedSalad_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PreparedSecond" DROP CONSTRAINT "PreparedSecond_reportId_fkey";

-- DropTable
DROP TABLE "public"."Cutting";

-- DropTable
DROP TABLE "public"."PreparedDessert";

-- DropTable
DROP TABLE "public"."PreparedSalad";

-- DropTable
DROP TABLE "public"."PreparedSecond";

-- CreateTable
CREATE TABLE "public"."Prepared" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,
    "portions" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "time" TEXT,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "Prepared_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Prepared" ADD CONSTRAINT "Prepared_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."DailyReportCucina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
