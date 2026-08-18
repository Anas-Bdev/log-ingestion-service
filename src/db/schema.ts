import { sql } from "drizzle-orm";
import {
  pgTable,
  bigint,
  timestamp,
  text,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const logs = pgTable(
  "logs",
  {
    id:bigint("id",{mode:"number"}).primaryKey().generatedAlwaysAsIdentity(),

    timestamp: timestamp("timestamp", {
      withTimezone: true,
    }).notNull(),

    level: text("level").notNull(),

    service: text("service_name").notNull(),

    message: text("message").notNull(),

    attributes: jsonb("attributes"),
  },
  (table) => [
    
    index("ix_logs_timestamp_id")
      .on(table.timestamp.desc(), table.id.desc()),

    index("ix_logs_service_timestamp_id")
      .on(table.service, table.timestamp.desc(), table.id.desc()),
  ],
);