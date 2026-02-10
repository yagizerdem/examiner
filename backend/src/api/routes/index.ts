import { Router } from "express";
import auth from "./auth";
const router = Router();

router.use("/user", auth);

export default router;
