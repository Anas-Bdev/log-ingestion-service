export type LogLevel = "debug" | "info" | "warn" | "error";

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