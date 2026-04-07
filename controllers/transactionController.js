import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import ViewerAccess from "../models/ViewerAccess.js";

export const createTransaction = async (req, res) => {
  const txn = await Transaction.create({
    ...req.body,
    userId: req.user.id
  });

  res.json(txn);
};


export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params; // transaction ID from URL
    const userId = req.user.id; // logged-in user

    const txn = await Transaction.findById(id);
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    // Ownership check
    if (txn.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own transactions" });
    }

    // Only allow specific fields to be updated
    const { amount, type, category, note, date } = req.body;
    if (amount !== undefined) txn.amount = amount;
    if (type !== undefined) txn.type = type;
    if (category !== undefined) txn.category = category;
    if (note !== undefined) txn.note = note;
    if (date !== undefined) txn.date = date;

    await txn.save();

    res.json(txn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getTransactions = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "USER") {
      filter.userId = req.user.id;
      filter.deleted = false;
    }

    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      const ids = users.map(u => u._id);
      filter.userId = { $in: ids };
    }

    else if (req.user.role === "VIEWER") {
      const access = await ViewerAccess.find({ viewerId: req.user.id });
      const ids = access.map(a => a.userId);
      filter.userId = { $in: ids };
    }

    else if (req.user.role === "ADMIN") {
      filter = {};
    }

    // 🔥 ONLY CHANGE HERE
    const data = await Transaction.find(filter).populate(
      "userId",
      "name email"
    );

    console.log("Token user:", req.user);
    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTransactionsPaginated = async (req, res) => {
  try {
    let filter = {};


    if (req.user.role === "USER") {
      filter.userId = req.user.id;
    }

    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      const ids = users.map(u => u._id);
      filter.userId = { $in: ids };
    }

    else if (req.user.role === "VIEWER") {
      const access = await ViewerAccess.find({ viewerId: req.user.id });
      const ids = access.map(a => a.userId);
      filter.userId = { $in: ids };
    }

    else if (req.user.role === "ADMIN") {
      filter = {};
    }

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Total count
    const totalRecords = await Transaction.countDocuments(filter);

    // Fetch paginated data
    const data = await Transaction.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    // Send structured response
    res.json({
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const txn = await Transaction.findById(id);
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    // Only the owner can delete
    if (txn.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own transactions" });
    }

    // Check if already deleted
    if (txn.deleted) {
      return res.status(400).json({ message: "Transaction is already deleted" });
    }

    txn.deleted = true;
    txn.deletedAt = new Date();
    await txn.save();

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getDeletedTransactions = async (req, res) => {
  try {
    //Only fetch deleted transactions
    let filter = { deleted: true };

    if (req.user.role === "MANAGER") {
      // Manager: only see deleted transactions of assigned users
      const users = await User.find({ managerId: req.user.id });
      const ids = users.map(u => u._id);
      filter.userId = { $in: ids };
    } 
    else if (req.user.role === "ADMIN") {
      // Admin: can see all deleted transactions
      filter = { deleted: true };
    } 
    else {
      // Other roles: no access
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedTxns = await Transaction.find(filter)
      .populate("userId", "name email") // include user info
      .sort({ deletedAt: -1 }); // latest deleted first

    res.json({ count: deletedTxns.length, data: deletedTxns });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};