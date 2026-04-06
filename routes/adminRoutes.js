import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getAllUsers, getUsersWithoutManager } from "../controllers/adminController.js";
import { createManager, assignManager, getAllManagers, getManagersWithUsers, searchUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/getallusers", authMiddleware, allowRoles("ADMIN"), getAllUsers);
router.get("/get-users-without-manager", authMiddleware, allowRoles("ADMIN"), getUsersWithoutManager);

router.post("/create-manager", authMiddleware, allowRoles("ADMIN"), createManager);
router.put("/assign-manager", authMiddleware, allowRoles("ADMIN"), assignManager);
router.get("/getallmanagers", authMiddleware, allowRoles("ADMIN"), getAllManagers);
router.get("/get-managers-with-users", authMiddleware, allowRoles("ADMIN"), getManagersWithUsers);

router.get("/search-users", authMiddleware, allowRoles("ADMIN"), searchUsers);



export default router;