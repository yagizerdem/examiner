import mongoose from "mongoose";

import { dbUri } from "../config";

export default async () => {
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(dbUri, {})
    .then(() => {
      console.log("Mongodb Connection");
    })
    .catch((err) => {
      console.log(err);
    });
};
