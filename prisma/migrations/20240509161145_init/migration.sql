-- CreateTable
CREATE TABLE `listing` (
    `title` VARCHAR(300) NULL,
    `description` VARCHAR(300) NULL,
    `id` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `locationId` INTEGER NULL,
    `priceId` INTEGER NULL,
    `typeId` INTEGER NULL,

    INDEX `locationId`(`locationId`),
    INDEX `priceId`(`priceId`),
    INDEX `typeId`(`typeId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `locationId` INTEGER NOT NULL,
    `location` TINYTEXT NULL,

    PRIMARY KEY (`locationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price` (
    `priceId` INTEGER NOT NULL,
    `price` DECIMAL(10, 0) NULL,

    PRIMARY KEY (`priceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `sid` VARCHAR(36) NOT NULL,
    `expires` DATETIME(0) NULL,
    `data` TEXT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type` (
    `typeId` INTEGER NOT NULL,
    `type` TINYTEXT NULL,

    PRIMARY KEY (`typeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userId` INTEGER NOT NULL,
    `username` TINYTEXT NULL,
    `password` CHAR(60) NULL,
    `firstName` VARCHAR(100) NULL,
    `middleName` VARCHAR(100) NULL,
    `emails` VARCHAR(100) NULL,
    `phoneNumber` TINYTEXT NULL,
    `photo` BLOB NULL,
    `salt` VARCHAR(255) NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_ibfk_3` FOREIGN KEY (`locationId`) REFERENCES `location`(`locationId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_ibfk_4` FOREIGN KEY (`priceId`) REFERENCES `price`(`priceId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_ibfk_5` FOREIGN KEY (`typeId`) REFERENCES `type`(`typeId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `listing`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `price` ADD CONSTRAINT `price_ibfk_1` FOREIGN KEY (`priceId`) REFERENCES `listing`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `type` ADD CONSTRAINT `type_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `listing`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
