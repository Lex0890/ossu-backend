/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `OsuUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OsuUser" ADD COLUMN     "hoursPlayed" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OsuUser_username_key" ON "OsuUser"("username");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "OsuUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
