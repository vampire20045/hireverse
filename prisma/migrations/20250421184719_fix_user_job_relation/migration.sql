/*
  Warnings:

  - You are about to drop the column `discription` on the `Job` table. All the data in the column will be lost.
  - Added the required column `description` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "verified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT NOT NULL;
