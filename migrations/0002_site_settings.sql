CREATE TABLE IF NOT EXISTS "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label" text,
	"type" text DEFAULT 'text' NOT NULL
);
