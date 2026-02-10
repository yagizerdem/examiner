import mongoose from "mongoose";
import { Log } from "../models/index";
import { ResultCode } from "./helpers/codes";
import ipHelper from "./helpers/ip-helper";
import { Types } from "mongoose";

export default async (
  code: ResultCode,
  userId: Types.ObjectId | null,
  errorMessage: string,
  level: string,
  req: any,
) => {
  let ip: string | undefined = "no-ip";
  if (req !== "") ip = ipHelper(req);
  let log = new Log({
    resultCode: code,
    level: level,
    errorMessage: errorMessage,
    ip: ip,
  });

  if (userId !== undefined && userId !== null) log.userId = userId;

  await log.save().catch((err) => {
    console.log("Logging is failed: " + err);
  });
};
