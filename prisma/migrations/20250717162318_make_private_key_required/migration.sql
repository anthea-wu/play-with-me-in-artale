/*
  Warnings:

  - Made the column `private_key` on table `groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "private_key" SET NOT NULL;
