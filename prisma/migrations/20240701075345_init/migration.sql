-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(20) NOT NULL,
    `description` VARCHAR(191) NULL,
    `flags` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `minecraft_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(20) NOT NULL,
    `main` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `minecraft_accounts` ADD CONSTRAINT `minecraft_accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
