/*
  Warnings:

  - You are about to drop the column `map` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "map",
ADD COLUMN     "maps" TEXT[];
