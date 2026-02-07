import { Router } from "express";
import {
    getUserController,
    getProfileController,
    updateProfileController,
    getPreferencesController,
    updatePreferencesController,
    deleteAccountController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { UpdateProfileSchema } from "../validators/user/UpdateProfile.schema";
import { UpdatePreferencesSchema } from "../validators/user/UpdatePreferences.schema";

const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfileController);
router.put("/profile", validate(UpdateProfileSchema), updateProfileController);

router.get("/preferences", getPreferencesController);
router.put("/preferences", validate(UpdatePreferencesSchema), updatePreferencesController);

router.delete("/account", deleteAccountController);

router.get("/:id", getUserController);

export default router;

