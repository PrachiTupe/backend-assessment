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

    // 1. Find the transaction
    const txn = await Transaction.findById(id);

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 2. Check ownership
    if (txn.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own transactions" });
    }

    // 3. Update transaction with new data
    Object.assign(txn, req.body); // merge new data
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