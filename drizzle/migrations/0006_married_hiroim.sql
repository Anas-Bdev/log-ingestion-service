ALTER TABLE "log_minute_rollups" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "log_rollup_state" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "log_minute_rollups" CASCADE;--> statement-breakpoint
DROP TABLE "log_rollup_state" CASCADE;--> statement-breakpoint
ALTER TABLE "logs" RENAME COLUMN "service_name" TO "service";--> statement-breakpoint
DROP INDEX "ix_logs_indexed_attributes_gin";--> statement-breakpoint
DROP INDEX "ix_logs_message_trgm";--> statement-breakpoint
DROP INDEX "ix_logs_service_timestamp_id";--> statement-breakpoint
CREATE INDEX "ix_logs_service_timestamp_id" ON "logs" USING btree ("service","timestamp" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "logs" DROP COLUMN "indexed_attributes";