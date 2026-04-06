import User from "../models/User.js";
import bcrypt from "bcryptjs";




export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "USER" })
      .select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersWithoutManager = async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { managerId: null },
        { managerId: { $exists: false } }
      ],
      role: "USER" // optional but recommended
    }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const manager = await User.create({
      name,
      email,
      password: hashed,
      role: "MANAGER"
    });

    res.json({
      message: "Manager created successfully",
      manager
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignManager = async (req, res) => {
  try {
    const { userId, managerId } = req.body;

    // 1. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if already has manager
    if (user.managerId) {
      return res.status(400).json({
        message: "User already has a manager"
      });
    }

    // 3. Check manager exists
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "MANAGER") {
      return res.status(400).json({
        message: "Invalid manager"
      });
    }

    // 4. Assign manager
    user.managerId = managerId;
    await user.save();

    res.json({
      message: "Manager assigned successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "MANAGER" })
      .select("-password");

    res.json(managers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getManagersWithUsers = async (req, res) => {
  try {
    // 1. Get all managers
    const managers = await User.find({ role: "MANAGER" })
      .select("-password");

    // 2. Attach users to each manager
    const result = await Promise.all(
      managers.map(async (manager) => {
        const users = await User.find({
          managerId: manager._id,
          role: "USER"
        }).select("-password");

        return {
          ...manager.toObject(),
          users
        };
      })
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // ❗ If no query provided
    if (!query) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    // 🔥 Regex for partial + case-insensitive search
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};