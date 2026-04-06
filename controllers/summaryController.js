import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import ViewerAccess from "../models/ViewerAccess.js";

export const getSummary = async (req, res) => {
  try {
    let userIds = [];

    // 👤 USER → only own data
    if (req.user.role === "USER") {
      userIds = [req.user.id];
    }

    // 👁️ VIEWER → assigned users
    else if (req.user.role === "VIEWER") {
      const access = await ViewerAccess.find({ viewerId: req.user.id });
      userIds = access.map(a => a.userId);
    }

    // 👨‍💼 MANAGER → assigned users
    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      userIds = users.map(u => u._id);
    }

    // 👑 ADMIN → all users
    else if (req.user.role === "ADMIN") {
      const users = await User.find({ role: "USER" });
      userIds = users.map(u => u._id);
    }

    // 🔍 Fetch transactions
    const transactions = await Transaction.find({
      userId: { $in: userIds }
    });

    // 📊 Calculate summary
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === "INCOME") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      netBalance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getSummaryByUser = async (req, res) => {
  try {
    let userIds = [];

    // 👤 USER
    if (req.user.role === "USER") {
      userIds = [req.user.id];
    }

    // 👁️ VIEWER
    else if (req.user.role === "VIEWER") {
      const access = await ViewerAccess.find({ viewerId: req.user.id });
      userIds = access.map(a => a.userId);
    }

    // 👨‍💼 MANAGER
    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      userIds = users.map(u => u._id);
    }

    // 👑 ADMIN
    else if (req.user.role === "ADMIN") {
      const users = await User.find({ role: "USER" });
      userIds = users.map(u => u._id);
    }

    const result = [];

    // 🔥 Loop each user
    for (let userId of userIds) {

      // get user details
      const user = await User.findById(userId).select("name email");

      // get transactions
      const transactions = await Transaction.find({ userId });

      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(t => {
        if (t.type === "INCOME") {
          totalIncome += t.amount;
        } else {
          totalExpense += t.amount;
        }
      });

      result.push({
        user,
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
      });
    }

    // 👤 USER → return single object
    if (req.user.role === "USER") {
      return res.json(result[0] || {
        user: null,
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0
      });
    }

    // 👑 Others → return array
    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getCategoriesSummaryByUser = async (req, res) => {
  try {
    let userIds = [];

    // 👤 USER
    if (req.user.role === "USER") {
      userIds = [req.user.id];
    }

    // 👁️ VIEWER
    else if (req.user.role === "VIEWER") {
      const access = await ViewerAccess.find({ viewerId: req.user.id });
      userIds = access.map(a => a.userId);
    }

    // 👨‍💼 MANAGER
    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      userIds = users.map(u => u._id);
    }

    // 👑 ADMIN
    else if (req.user.role === "ADMIN") {
      const users = await User.find({ role: "USER" });
      userIds = users.map(u => u._id);
    }

    const result = [];

    for (let userId of userIds) {

      const user = await User.findById(userId).select("name email");

      // 🔥 FIX → ensure ObjectId
      const categories = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId)
          }
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            total: 1
          }
        }
      ]);

      result.push({
        user,
        categories
      });
    }

    // 👤 USER → single object
    if (req.user.role === "USER") {
      return res.json(result[0] || {
        user: null,
        categories: []
      });
    }

    // 👑 Others → array
    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







export const getCategoriesSummary = async (req, res) => {
  try {
    let userIds = [];

    // 👤 USER
    if (req.user.role === "USER") {
      userIds = [req.user.id];
    }

    // 👁️ VIEWER
    else if (req.user.role === "VIEWER") {
      const access = await ViewerAccess.find({ viewerId: req.user.id });
      userIds = access.map(a => a.userId);
    }

    // 👨‍💼 MANAGER
    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      userIds = users.map(u => u._id);
    }

    // 👑 ADMIN
    else if (req.user.role === "ADMIN") {
      const users = await User.find({ role: "USER" });
      userIds = users.map(u => u._id);
    }

    // 🔥 SAME FIX YOU USED → convert properly
    userIds = userIds.map(id => new mongoose.Types.ObjectId(id));

    // 🔥 SINGLE AGGREGATION (GLOBAL)
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: { $in: userIds }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json(summary);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};