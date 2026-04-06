import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Create new user
    const user = await User.create({
      name,
      email,
      password: hashed
    });

    // 4. Return created user (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid password" });

  res.json({
    token: generateToken(user)
  });
};



export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Get logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // 3. Check if new password is same as old password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password cannot be the same as old password" });
    }

    // 4. Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // 5. Update password
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getRole = (req, res) => {
  try {
    // req.user is set by authMiddleware from the token
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ role: req.user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getMyInfo = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user from DB, exclude password
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
