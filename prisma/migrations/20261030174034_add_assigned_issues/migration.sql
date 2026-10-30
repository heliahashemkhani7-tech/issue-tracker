-- AlterTable
ALTER TABLE `issue` ADD COLUMN `assignedToUserID` VARCHAR(225) NULL;

-- AddForeignKey
ALTER TABLE `Issue` ADD CONSTRAINT `Issue_assignedToUserID_fkey` FOREIGN KEY (`assignedToUserID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
