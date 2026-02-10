import { config } from "dotenv";
import { join } from "path";
config({ path: join(process.cwd(), ".env") });

const { PORT, DB_URI, PREFIX, JWT_SECRET_KEY } = process.env;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT key is not defined in environment variables");
}

export const port = PORT || 3000;
export const dbUri = DB_URI || "mongodb://localhost:27017/examinor";
export const prefix = PREFIX || "/api/v1";
export const jwtSecretKey = JWT_SECRET_KEY;
