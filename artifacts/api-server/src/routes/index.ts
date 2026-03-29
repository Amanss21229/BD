import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import adminRouter from "./admin";
import profilesRouter from "./profiles";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(adminRouter);
router.use(profilesRouter);
router.use(statsRouter);

export default router;
