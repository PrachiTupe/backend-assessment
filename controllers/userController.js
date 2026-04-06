import User from "../models/User.js";
import ViewerAccess from "../models/ViewerAccess.js";

export const addViewer = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find viewer by email
    const viewer = await User.findOne({ email });

    if (!viewer) {
      return res.status(404).json({ message: "Viewer not found" });
    }

    // 🔥 NEW CONDITION → block USER role
    if (viewer.role === "USER") {
      return res.status(400).json({ 
        message: "Users cannot be added as viewers" 
      });
    }

    // 2. Prevent self-adding
    if (viewer._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot add yourself as viewer" });
    }

    // 3. Check if already added
    const existing = await ViewerAccess.findOne({
      userId: req.user.id,
      viewerId: viewer._id
    });

    if (existing) {
      return res.status(400).json({ message: "Viewer already added" });
    }

    // 4. Create access
    const access = await ViewerAccess.create({
      userId: req.user.id,
      viewerId: viewer._id
    });

    res.json({
      message: "Viewer added successfully",
      access
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getViewers = async (req, res) => {
  try {
    let userIds = [];

    // 👤 USER → only their viewers
    if (req.user.role === "USER") {
      userIds = [req.user.id];
    }

    // 👨‍💼 MANAGER → viewers of assigned users
    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      userIds = users.map(u => u._id);
    }

    // 👑 ADMIN → all users
    else if (req.user.role === "ADMIN") {
      const users = await User.find({});
      userIds = users.map(u => u._id);
    }

    // 🔍 Fetch viewer access
    const accessList = await ViewerAccess.find({
      userId: { $in: userIds }
    }).populate("viewerId", "name email role");

    // 📦 Group by user
    const result = {};

    accessList.forEach(a => {
      const userId = a.userId.toString();

      if (!result[userId]) {
        result[userId] = [];
      }

      result[userId].push(a.viewerId);
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const deleteViewer = async (req, res) => {
  try {
    const { viewerId } = req.params;

    let allowedUserIds = [];

    // 👤 USER → can delete only their own viewers
    if (req.user.role === "USER") {
      allowedUserIds = [req.user.id];
    }

    // 👨‍💼 MANAGER → can delete viewers of assigned users
    else if (req.user.role === "MANAGER") {
      const users = await User.find({ managerId: req.user.id });
      allowedUserIds = users.map(u => u._id.toString());
    }

    // 👑 ADMIN → can delete from any user
    else if (req.user.role === "ADMIN") {
      const users = await User.find({});
      allowedUserIds = users.map(u => u._id.toString());
    }

    // 🔍 Find access entry
    const access = await ViewerAccess.findOne({
      viewerId
    });

    if (!access) {
      return res.status(404).json({ message: "Viewer access not found" });
    }

    // 🔒 Check permission
    if (!allowedUserIds.includes(access.userId.toString())) {
      return res.status(403).json({ message: "Not authorized to delete this viewer" });
    }

    // ❌ Delete access
    await ViewerAccess.deleteOne({ _id: access._id });

    res.json({ message: "Viewer removed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAssignedUsersForViewer = async (req, res) => {
  try {
    const { id, role } = req.user;

    let accessList;

    if (role === "VIEWER") {
      // Viewer → get users who gave access
      accessList = await ViewerAccess.find({ viewerId: id })
        .populate("userId", "name email");
      
      const users = accessList.map((entry) => entry.userId);

      return res.status(200).json({
        message: "Assigned users fetched successfully (Viewer)",
        count: users.length,
        users
      });
    }

    if (role === "USER") {
      // USER → get viewers they added (optional but useful)
      accessList = await ViewerAccess.find({ userId: id })
        .populate("viewerId", "name email");

      const viewers = accessList.map((entry) => entry.viewerId);

      return res.status(200).json({
        message: "Viewers fetched successfully (User)",
        count: viewers.length,
        viewers
      });
    }

    return res.status(403).json({
      message: "Access denied"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching data",
      error: error.message
    });
  }
};









