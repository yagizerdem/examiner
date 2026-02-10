import mongooseLoader from "./mongoose";
import expressLoader from "./express";
import { Application } from "express";

export default async (app: Application) => {
  await mongooseLoader();
  expressLoader(app);
};
