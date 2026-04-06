import User from "../models/User.js";

export const getMyUsers = async (req, res) => {
  try {
    const users = await User.find({
      managerId: req.user.id,
      role: "USER" // optional but recommended
    }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};