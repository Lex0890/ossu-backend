/*
  Warnings:

  - Added the required column `Title` to the `FeedItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeedItem" ADD COLUMN     "Title" TEXT NOT NULL;
