ALTER TABLE "log_hourly_rollups" RENAME TO "log_minute_rollups";--> statement-breakpoint
DROP INDEX "ix_log_hourly_rollups_bucket";--> statement-breakpoint
DROP INDEX "ix_log_hourly_rollups_service_bucket";--> statement-breakpoint
DROP INDEX "ix_log_hourly_rollups_level_bucket";--> statement-breakpoint
ALTER TABLE "log_minute_rollups" DROP CONSTRAINT "pk_log_hourly_rollups";--> statement-breakpoint
ALTER TABLE "log_minute_rollups" ADD CONSTRAINT "pk_log_minute_rollups" PRIMARY KEY("bucket_start","service_name","level");--> statement-breakpoint
CREATE INDEX "ix_log_minute_rollups_bucket" ON "log_minute_rollups" USING btree ("bucket_start");--> statement-breakpoint
CREATE INDEX "ix_log_minute_rollups_service_bucket" ON "log_minute_rollups" USING btree ("service_name","bucket_start");--> statement-breakpoint
CREATE INDEX "ix_log_minute_rollups_level_bucket" ON "log_minute_rollups" USING btree ("level","bucket_start");