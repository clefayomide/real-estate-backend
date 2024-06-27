/*
  Warnings:

  - You are about to drop the column `otp` on the `otp` table. All the data in the column will be lost.
  - Added the required column `hash` to the `otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp` DROP COLUMN `otp`,
    ADD COLUMN `hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `salt` VARCHAR(191) NOT NULL;
