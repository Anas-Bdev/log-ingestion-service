export type LogLevel = "debug" | "info" | "warn" | "error";
import z from "zod";
import { aggregateLogsQuerySchema, getLogsQuerySchema } from "./log.validation.js";
export interface LogRequest {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  attributes?: Record<string, string | number | boolean>;
}

export type GetLogsQuery = z.infer<typeof getLogsQuerySchema>;

export type IngestLogsRequest = {
  logs: LogRequest[];
};

export type GetLogsRequest=GetLogsQuery & {
  attributes:Record<string,string>
};

export type AggregateLogsRequest =
    z.infer<typeof aggregateLogsQuerySchema> & {
        attributes: Record<string, string>;
    };

