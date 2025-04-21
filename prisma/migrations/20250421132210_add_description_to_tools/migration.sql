/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "tools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);
