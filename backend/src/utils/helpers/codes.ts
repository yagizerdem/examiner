/*
 * business logic realated codes are defined here.
 * these codes are used in the responses to identify the
 * type of the response and to provide more information about the response.
 *
 */

export enum ErrorCode {
  // system / process
  UNCAUGHT_EXCEPTION = "00001",
  UNHANDLED_REJECTION = "00002",
  ENV_ERROR = "00003",

  UNKNOWN = "00008",

  // http
  SERVER_ERROR = "00013",
  NOT_FOUND = "00014",
  BAD_REQUEST = "00015",

  UNAUTHORIZED = "00016",
  FORBIDDEN = "00017",

  // business logics
}

export enum SuccessCode {
  SUCCESS = "00004",
  CREATED = "00005",
  UPDATED = "00006",
  DELETED = "00007",
}

export type ResultCode = ErrorCode | SuccessCode;
