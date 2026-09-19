CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL
);
