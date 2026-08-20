import {
  and,
  asc,
  desc,
  eq,
  gte,
  lt,
  or,
  sql,
} from "drizzle-orm";

import { dbWrite, dbRead } from "../../db/client.js";
import { logs as logsTable } from "../../db/schema.js";
import {
  AggregateLogsRequest,
  GetLogsRequest,
} from "./log.types.js";
import { decodeCursor } from "./log.cursor.js";

export const insertLogs = async (
  logs: typeof logsTable.$inferInsert[]
) => {
  if (logs.length === 0) {
    return;
  }

  return dbWrite
    .insert(logsTable)
    .values(logs);
};

export const getLogsFromDatabase = async (
  input: GetLogsRequest
) => {
  const conditions = [];

  if (input.service) {
    conditions.push(
      eq(
        logsTable.service,
        input.service
      )
    );
  }

  if (input.level) {
    conditions.push(
      eq(
        logsTable.level,
        input.level
      )
    );
  }

  if (input.since) {
    conditions.push(
      gte(
        logsTable.timestamp,
        new Date(input.since)
      )
    );
  }

  if (input.until) {
    conditions.push(
      lt(
        logsTable.timestamp,
        new Date(input.until)
      )
    );
  }

  if (input.q) {
    conditions.push(
      sql`
        lower(${logsTable.message})
        LIKE
        ${`%${input.q.toLowerCase()}%`}
      `
    );
  }

  if (
    input.attributes &&
    Object.keys(input.attributes).length > 0
  ) {
    for (
      const [key, value]
      of Object.entries(input.attributes)
    ) {
      conditions.push(
        sql`
          ${logsTable.attributes}->>${key}
          =
          ${String(value)}
        `
      );
    }
  }

  if (input.cursor) {
    const cursor = decodeCursor(
      input.cursor
    );

    const cursorTimestamp =
      new Date(cursor.timestamp);

    if (
      Number.isNaN(
        cursorTimestamp.getTime()
      )
    ) {
      throw new Error(
        "Invalid cursor timestamp"
      );
    }

    conditions.push(
      or(
        lt(
          logsTable.timestamp,
          cursorTimestamp
        ),
        and(
          eq(
            logsTable.timestamp,
            cursorTimestamp
          ),
          lt(
            logsTable.id,
            cursor.id
          )
        )
      )
    );
  }

  return dbRead
    .select({
      id: logsTable.id,
      timestamp: logsTable.timestamp,
      level: logsTable.level,
      service: logsTable.service,
      message: logsTable.message,
      attributes: logsTable.attributes,
    })
    .from(logsTable)
    .where(
      conditions.length > 0
        ? and(...conditions)
        : undefined
    )
    .orderBy(
      desc(logsTable.timestamp),
      desc(logsTable.id)
    )
    .limit(
      input.limit + 1
    );
};


export const aggregateLogsFromDatabase = (
  input: AggregateLogsRequest
) => {
  const conditions = [
    gte(
      logsTable.timestamp,
      new Date(input.since)
    ),

    lt(
      logsTable.timestamp,
      new Date(input.until)
    ),
  ];

  if (input.service) {
    conditions.push(
      eq(
        logsTable.service,
        input.service
      )
    );
  }

  if (input.level) {
    conditions.push(
      eq(
        logsTable.level,
        input.level
      )
    );
  }

  if (input.q) {
    conditions.push(
      sql`
        lower(${logsTable.message})
        LIKE
        ${`%${input.q.toLowerCase()}%`}
      `
    );
  }

  if (
    input.attributes &&
    Object.keys(input.attributes).length > 0
  ) {
    for (
      const [key, value]
      of Object.entries(input.attributes)
    ) {
      conditions.push(
        sql`
          ${logsTable.attributes}->>${key}
          =
          ${String(value)}
        `
      );
    }
  }

  const bucketIntervals = {
    "1m": sql`INTERVAL '1 minute'`,
    "5m": sql`INTERVAL '5 minutes'`,
    "1h": sql`INTERVAL '1 hour'`,
    "1d": sql`INTERVAL '1 day'`,
  } as const;

  const bucketInterval =
    bucketIntervals[input.bucket];

  const bucketStart = sql`
    date_bin(
      ${bucketInterval},
      ${logsTable.timestamp},
      TIMESTAMPTZ '1970-01-01'
    )
  `;

  if (!input.group_by) {
    return dbRead
      .select({
        start: bucketStart,

        group:
          sql<string | null>`NULL`,

        count:
          sql<number>`
            COUNT(*)::int
          `,
      })
      .from(logsTable)
      .where(
        and(...conditions)
      )
      .groupBy(
        bucketStart
      )
      .orderBy(
        asc(bucketStart)
      );
  }

  if (
    input.group_by === "service"
  ) {
    return dbRead
      .select({
        start: bucketStart,

        group:
          logsTable.service,

        count:
          sql<number>`
            COUNT(*)::int
          `,
      })
      .from(logsTable)
      .where(
        and(...conditions)
      )
      .groupBy(
        bucketStart,
        logsTable.service
      )
      .orderBy(
        asc(bucketStart)
      );
  }

  return dbRead
    .select({
      start: bucketStart,

      group:
        logsTable.level,

      count:
        sql<number>`
          COUNT(*)::int
        `,
    })
    .from(logsTable)
    .where(
      and(...conditions)
    )
    .groupBy(
      bucketStart,
      logsTable.level
    )
    .orderBy(
      asc(bucketStart)
    );
};
