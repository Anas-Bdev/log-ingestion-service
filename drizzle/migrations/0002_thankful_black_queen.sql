DROP INDEX "ix_logs_attributes";--> statement-breakpoint
DROP INDEX "ix_logs_level_timestamp_id";--> statement-breakpoint
DROP INDEX "ix_logs_timestamp_id";--> statement-breakpoint
DROP INDEX "ix_logs_service_timestamp_id";--> statement-breakpoint
ALTER TABLE "logs" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "logs" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1);--> statement-breakpoint
CREATE INDEX "ix_logs_timestamp_id" ON "logs" USING btree ("timestamp" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "ix_logs_service_timestamp_id" ON "logs" USING btree ("service_name","timestamp" DESC NULLS LAST,"id" DESC NULLS LAST);