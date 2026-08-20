CREATE TABLE "log_hourly_rollups" (
	"bucket_start" timestamp with time zone NOT NULL,
	"service_name" text NOT NULL,
	"level" text NOT NULL,
	"count" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "pk_log_hourly_rollups" PRIMARY KEY("bucket_start","service_name","level")
);
--> statement-breakpoint
CREATE INDEX "ix_log_hourly_rollups_bucket" ON "log_hourly_rollups" USING btree ("bucket_start");--> statement-breakpoint
CREATE INDEX "ix_log_hourly_rollups_service_bucket" ON "log_hourly_rollups" USING btree ("service_name","bucket_start");--> statement-breakpoint
CREATE INDEX "ix_log_hourly_rollups_level_bucket" ON "log_hourly_rollups" USING btree ("level","bucket_start");