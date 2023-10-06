/*
  Warnings:

  - You are about to alter the column `prize` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `prize` INTEGER NULL,
    MODIFY `timestamp` BIGINT NULL;
