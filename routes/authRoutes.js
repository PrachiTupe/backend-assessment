import express from "express";
import { register, login, changePassword, getRole, getMyInfo} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerValidation } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", authLimiter, login);
router.put("/change-password", authMiddleware, changePassword);
router.get("/getrole", authMiddleware, getRole);
router.get("/getmyinfo", authMiddleware, getMyInfo);


export default router;