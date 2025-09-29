-- CreateTable
CREATE TABLE "public"."Inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quntity" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Inventory" ADD CONSTRAINT "Inventory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."DailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
