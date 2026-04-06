import express from "express";
import { register, login, changePassword, getRole, getMyInfo} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", authMiddleware, changePassword);
router.get("/getrole", authMiddleware, getRole);
router.get("/getmyinfo", authMiddleware, getMyInfo);


export default router;