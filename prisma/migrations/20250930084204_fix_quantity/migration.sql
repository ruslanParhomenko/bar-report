/*
  Warnings:

  - You are about to drop the column `quntity` on the `Inventory` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inventory" DROP COLUMN "quntity",
ADD COLUMN     "quantity" TEXT NOT NULL;
