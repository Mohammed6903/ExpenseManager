import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { exportJSONController, exportCSVController } from "../controllers/export.controller";
import { ExportOptionsSchema } from "../validators/export/ExportOptions.schema";

const router = Router();

router.use(authMiddleware);

router.get("/json", validate(ExportOptionsSchema), exportJSONController);
router.get("/csv", validate(ExportOptionsSchema), exportCSVController);

export default router;
