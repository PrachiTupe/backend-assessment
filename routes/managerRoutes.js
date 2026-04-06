import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getMyUsers } from "../controllers/managerController.js";

const router = express.Router();

router.get("/getmyusers", authMiddleware, allowRoles("MANAGER"), getMyUsers);



export default router;