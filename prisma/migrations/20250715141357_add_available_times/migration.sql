/*
  Warnings:

  - You are about to drop the column `end_time` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "available_times" TEXT[];
