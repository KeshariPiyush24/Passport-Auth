import { Router } from "express";
import User from "../models/user.model.js";
import passport from "../utils/passport.util.js";
import { generateToken } from '../utils/jwt.util.js';

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = generateToken(req.user);

  res.json({
    message: "Login successful",
    token: token  // Only sending JWT token
  });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    // 2. Clear session cookie
    req.session.destroy();
    res.clearCookie('connect.sid');

    // 3. For JWT, we can't invalidate the token on server side
    // Client needs to remove the token themselves
    // Optionally, we could maintain a blacklist of invalid tokens

    res.json({
      message: "Logout successful",
      note: "Please remove JWT token from client storage"
    });
  });
});

export default router;
