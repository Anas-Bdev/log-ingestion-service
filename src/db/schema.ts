import {
  pgTable,
  uuid,
  timestamp,
  text,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const logs = pgTable(
  "logs",
  {
    id: uuid("id").primaryKey(),

    timestamp: timestamp("timestamp", {
      withTimezone: true,
    }).notNull(),

    level: text("level").notNull(),

    serviceName: text("service_name").notNull(),

    message: text("message").notNull(),

    attributes: jsonb("attributes").notNull(),
  },
  (table) => ({
    attributesGinIndex: index("ix_logs_attributes")
      .using("gin", table.attributes),

    timestampIdIndex: index("ix_logs_timestamp_id")
      .on(table.timestamp, table.id),

    serviceTimestampIdIndex: index("ix_logs_service_timestamp_id")
      .on(table.serviceName, table.timestamp, table.id),

    levelTimestampIdIndex: index("ix_logs_level_timestamp_id")
      .on(table.level, table.timestamp, table.id),
  }),
);