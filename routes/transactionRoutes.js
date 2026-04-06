import express from "express";
import { createTransaction, updateTransaction, getTransactions, getTransactionsPaginated } from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("USER"), createTransaction);
router.put("/:id", authMiddleware, allowRoles("USER"), updateTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/paginated", authMiddleware, getTransactionsPaginated);

export default router;