import {Router} from "express";
import { getLogsController, ingestLogsController } from "./log.controller.js";

const router=Router();

router.post("/logs", ingestLogsController)

router.get("/logs",getLogsController);

export default router;