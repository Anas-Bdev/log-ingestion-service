CREATE TABLE "logs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"timestamp" timestamp with time zone NOT NULL,
	"level" text NOT NULL,
	"service_name" text NOT NULL,
	"message" text NOT NULL,
	"attributes" jsonb
);
--> statement-breakpoint
CREATE INDEX "ix_logs_timestamp_id" ON "logs" USING btree ("timestamp" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "ix_logs_service_timestamp_id" ON "logs" USING btree ("service_name","timestamp" DESC NULLS LAST,"id" DESC NULLS LAST);