CREATE TABLE `cards` (
	`id` integer PRIMARY KEY NOT NULL,
	`nid` integer NOT NULL,
	`did` integer NOT NULL,
	`ord` integer NOT NULL,
	`mod` integer NOT NULL,
	`usn` integer NOT NULL,
	`type` integer NOT NULL,
	`queue` integer NOT NULL,
	`due` integer NOT NULL,
	`ivl` integer NOT NULL,
	`factor` integer NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`left` integer NOT NULL,
	`odue` integer NOT NULL,
	`odid` integer NOT NULL,
	`flags` integer NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `col` (
	`id` integer PRIMARY KEY NOT NULL,
	`crt` integer NOT NULL,
	`mod` integer NOT NULL,
	`scm` integer NOT NULL,
	`ver` integer NOT NULL,
	`dty` integer NOT NULL,
	`usn` integer NOT NULL,
	`ls` integer NOT NULL,
	`conf` text NOT NULL,
	`models` text NOT NULL,
	`decks` text NOT NULL,
	`dconf` text NOT NULL,
	`tags` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`usn` integer NOT NULL,
	`mtime_secs` integer NOT NULL,
	`val` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deck_config` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mtime_secs` integer NOT NULL,
	`usn` integer NOT NULL,
	`config` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `decks` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mtime_secs` integer NOT NULL,
	`usn` integer NOT NULL,
	`common` blob NOT NULL,
	`kind` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fields` (
	`ntid` integer NOT NULL,
	`ord` integer NOT NULL,
	`name` text NOT NULL,
	`config` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `graves` (
	`oid` integer NOT NULL,
	`type` integer NOT NULL,
	`usn` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY NOT NULL,
	`guid` text NOT NULL,
	`mid` integer NOT NULL,
	`mod` integer NOT NULL,
	`usn` integer NOT NULL,
	`tags` text NOT NULL,
	`flds` text NOT NULL,
	`sfld` integer NOT NULL,
	`csum` integer NOT NULL,
	`flags` integer NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notetypes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mtime_secs` integer NOT NULL,
	`usn` integer NOT NULL,
	`config` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `revlog` (
	`id` integer PRIMARY KEY NOT NULL,
	`cid` integer NOT NULL,
	`usn` integer NOT NULL,
	`ease` integer NOT NULL,
	`ivl` integer NOT NULL,
	`lastIvl` integer NOT NULL,
	`factor` integer NOT NULL,
	`time` integer NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`tag` text PRIMARY KEY NOT NULL,
	`usn` integer NOT NULL,
	`collapsed` integer NOT NULL,
	`config` blob
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`ntid` integer NOT NULL,
	`ord` integer NOT NULL,
	`name` text NOT NULL,
	`mtime_secs` integer NOT NULL,
	`usn` integer NOT NULL,
	`config` blob NOT NULL
);
