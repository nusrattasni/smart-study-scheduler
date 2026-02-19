import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerUser, getUsers } from "../controllers/userController.js";
import User from "../models/User.js"; // make sure your User model path is correct

const router = express.Router();

// ✅ Register
router.post("/register", registerUser);

// ✅ Get all users
router.get("/", getUsers);

// ✅ Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // 🔹 Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Send token + user info to frontend
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
