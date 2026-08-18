ALTER TABLE "logs" ADD COLUMN "indexed_attributes" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "ix_logs_indexed_attributes_gin" ON "logs" USING gin ("indexed_attributes" jsonb_path_ops);--> statement-breakpoint
CREATE INDEX "ix_logs_message_trgm" ON "logs" USING gin (lower("message") gin_trgm_ops);