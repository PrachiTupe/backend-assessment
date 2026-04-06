import express from "express";
import { addViewer, getViewers, deleteViewer} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.post("/add-viewer", authMiddleware, allowRoles("USER"), addViewer);
router.delete("/delete-viewer/:viewerId", authMiddleware, allowRoles("USER"), deleteViewer);
router.get("/viewers", authMiddleware, allowRoles("USER", "MANAGER", "ADMIN"), getViewers);




export default router;