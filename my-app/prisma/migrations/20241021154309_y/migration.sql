/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `note` DROP FOREIGN KEY `Note_authorId_fkey`;

-- DropTable
DROP TABLE `user`;
