import express from "express";
import { getCategoriesSummaryByUser, getSummary, getSummaryByUser, getCategoriesSummary } from "../controllers/summaryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Summary (all roles allowed)
router.get("/getsummary", authMiddleware, getSummary);
router.get("/get-summary-by-user", authMiddleware, getSummaryByUser);

router.get("/get-categories-summary-by-user", authMiddleware, getCategoriesSummaryByUser);
router.get("/get-categories-summary", authMiddleware, getCategoriesSummary);

export default router;