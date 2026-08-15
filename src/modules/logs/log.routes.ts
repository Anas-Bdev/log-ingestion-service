import {Router} from "express";
import { aggregateLogsController, getLogsController, ingestLogsController } from "./log.controller.js";

const router=Router();

router.post("/logs", ingestLogsController)

router.get("/logs",getLogsController);

router.get("/logs/aggregate",aggregateLogsController);

export default router;