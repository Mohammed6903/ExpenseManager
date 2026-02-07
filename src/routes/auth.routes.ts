import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import { CreateUserSchema } from "../validators/user/CreateUser.schema";
import {
  loginController,
  registerController,
  refreshController,
  logoutController,
} from "../controllers/auth.controller";
import { LoginSchema } from "../validators/auth/Login.schema";
import { RefreshTokenSchema } from "../validators/auth/RefreshToken.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(CreateUserSchema), registerController);
router.post("/login", validate(LoginSchema), loginController);
router.post("/refresh", validate(RefreshTokenSchema), refreshController);
router.post("/logout", authMiddleware, validate(RefreshTokenSchema), logoutController);

export default router;

