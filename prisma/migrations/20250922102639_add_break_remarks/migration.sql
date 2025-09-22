-- CreateTable
CREATE TABLE "public"."Remarks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "dayHours" TEXT NOT NULL DEFAULT '',
    "nightHours" TEXT NOT NULL DEFAULT '',
    "reason" TEXT NOT NULL DEFAULT '',
    "penality" TEXT NOT NULL DEFAULT '',
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "Remarks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Remarks" ADD CONSTRAINT "Remarks_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."BreakeList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
