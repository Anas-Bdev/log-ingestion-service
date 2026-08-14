import {Router} from "express";
import { ingestLogsController } from "./log.controller.js";

const router=Router();

router.post("/logs", ingestLogsController)

export default router;