-- Script to add ONLY the missing PortfolioImage table to MySQL production database
-- (Since PortfolioProject table already exists with data)

-- 1. Create PortfolioImage table
CREATE TABLE IF NOT EXISTS `PortfolioImage` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `portfolioProjectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Add foreign key relation to the existing PortfolioProject table
ALTER TABLE `PortfolioImage` 
    ADD CONSTRAINT `PortfolioImage_portfolioProjectId_fkey` 
    FOREIGN KEY (`portfolioProjectId`) REFERENCES `PortfolioProject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
