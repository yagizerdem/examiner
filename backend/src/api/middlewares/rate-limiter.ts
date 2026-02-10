import mongoose from "mongoose";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { dbUri } from "../../config/index.js";
// import { errorHelper } from "../../utils/index.js";
import { NextFunction, Request, Response } from "express";
import ipHelper from "../../utils/helpers/ip-helper.js";

mongoose.set("strictQuery", false);
const mongoConn = mongoose.createConnection(dbUri, {});

const opts = {
  storeClient: mongoConn,
  tableName: "rateLimits",
  points: 100, // x requests
  duration: 60, // per y second by IP
};

export default (req: Request, res: Response, next: NextFunction) => {
  const rateLimiterMongo = new RateLimiterMongo(opts);
  rateLimiterMongo
    .consume(ipHelper(req) || "")
    .then(() => {
      next();
    })
    .catch((err) => {
      //   return res.status(429).json(errorHelper("00024", req, err.message));

      return res.status(429).json("error occured");
    });
};
