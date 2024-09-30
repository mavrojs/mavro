import { StatusCode } from "../../types";

const statusCodes: Record<string, StatusCode> = {
  "100": {
    code: 100,
    message: "Continue",
    timestamp: new Date().toISOString(),
  },
  "101": {
    code: 101,
    message: "Switching Protocols",
    timestamp: new Date().toISOString(),
  },
  "200": { code: 200, message: "OK", timestamp: new Date().toISOString() },
  "201": { code: 201, message: "Created", timestamp: new Date().toISOString() },
  "202": {
    code: 202,
    message: "Accepted",
    timestamp: new Date().toISOString(),
  },
  "204": {
    code: 204,
    message: "No Content",
    timestamp: new Date().toISOString(),
  },
  "301": {
    code: 301,
    message: "Moved Permanently",
    timestamp: new Date().toISOString(),
  },
  "302": { code: 302, message: "Found", timestamp: new Date().toISOString() },
  "304": {
    code: 304,
    message: "Not Modified",
    timestamp: new Date().toISOString(),
  },
  "400": {
    code: 400,
    message: "Bad Request",
    timestamp: new Date().toISOString(),
  },
  "401": {
    code: 401,
    message: "Unauthorized",
    timestamp: new Date().toISOString(),
  },
  "403": {
    code: 403,
    message: "Forbidden",
    timestamp: new Date().toISOString(),
  },
  "404": {
    code: 404,
    message: "Not Found",
    timestamp: new Date().toISOString(),
  },
  "405": {
    code: 405,
    message: "Method Not Allowed",
    timestamp: new Date().toISOString(),
  },
  "409": {
    code: 409,
    message: "Conflict",
    timestamp: new Date().toISOString(),
  },
  "410": { code: 410, message: "Gone", timestamp: new Date().toISOString() },
  "415": {
    code: 415,
    message: "Unsupported Media Type",
    timestamp: new Date().toISOString(),
  },
  "429": {
    code: 429,
    message: "Too Many Requests",
    timestamp: new Date().toISOString(),
  },
  "500": {
    code: 500,
    message: "Internal Server Error",
    timestamp: new Date().toISOString(),
  },
  "501": {
    code: 501,
    message: "Not Implemented",
    timestamp: new Date().toISOString(),
  },
  "502": {
    code: 502,
    message: "Bad Gateway",
    timestamp: new Date().toISOString(),
  },
  "503": {
    code: 503,
    message: "Service Unavailable",
    timestamp: new Date().toISOString(),
  },
  "504": {
    code: 504,
    message: "Gateway Timeout",
    timestamp: new Date().toISOString(),
  },
  "505": {
    code: 505,
    message: "HTTP Version Not Supported",
    timestamp: new Date().toISOString(),
  },
};

export { statusCodes };
