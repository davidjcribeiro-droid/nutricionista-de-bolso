CREATE TABLE `daily_consumption` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` date NOT NULL,
	`consumed` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_consumption_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `food_consumption` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`foodId` int NOT NULL,
	`date` date NOT NULL,
	`quantity` int DEFAULT 1,
	`calories` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `food_consumption_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(10) DEFAULT '🍽️',
	`caloriesPer100g` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `foods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`age` int,
	`height` int,
	`currentWeight` int,
	`targetWeight` int,
	`dailyCalorieGoal` int DEFAULT 2000,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `daily_consumption` ADD CONSTRAINT `daily_consumption_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `food_consumption` ADD CONSTRAINT `food_consumption_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `food_consumption` ADD CONSTRAINT `food_consumption_foodId_foods_id_fk` FOREIGN KEY (`foodId`) REFERENCES `foods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_date_idx` ON `daily_consumption` (`userId`,`date`);--> statement-breakpoint
CREATE INDEX `user_date_food_idx` ON `food_consumption` (`userId`,`date`);--> statement-breakpoint
CREATE INDEX `food_idx` ON `food_consumption` (`foodId`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_profiles` (`userId`);