import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rechargeRouter from "./recharge";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rechargeRouter);
router.use(adminRouter);

export default router;
