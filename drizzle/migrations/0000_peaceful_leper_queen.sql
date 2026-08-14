CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"level" text NOT NULL,
	"service_name" text NOT NULL,
	"message" text NOT NULL,
	"attributes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ix_logs_attributes" ON "logs" USING gin ("attributes");--> statement-breakpoint
CREATE INDEX "ix_logs_timestamp_id" ON "logs" USING btree ("timestamp","id");--> statement-breakpoint
CREATE INDEX "ix_logs_service_timestamp_id" ON "logs" USING btree ("service_name","timestamp","id");--> statement-breakpoint
CREATE INDEX "ix_logs_level_timestamp_id" ON "logs" USING btree ("level","timestamp","id");