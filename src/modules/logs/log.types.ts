export type LogLevel = "debug" | "info" | "warn" | "error";
import { GetLogsQuery } from "./log.validation.js";
export interface LogRequest {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  attributes?: Record<string, string | number | boolean>;
}

export type IngestLogsRequest = {
  logs: LogRequest[];
};

export type GetLogsRequest=GetLogsQuery & {
  attributes:Record<string,string>
};


