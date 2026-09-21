const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const { seedAuctionsForUser } = require("../utils/seed");

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar || null,
    createdAt: user.created_at
  };
}

function signUser(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must contain at least 6 characters." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);
  if (existing.length) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'buyer')",
    [String(name).trim(), normalizedEmail, phone ? String(phone).trim() : null, passwordHash]
  );

  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
  const user = rows[0];
  await seedAuctionsForUser(user.id);
  const token = signUser(user);

  res.status(201).json({ success: true, message: "Registration successful.", token, user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [String(email).trim().toLowerCase()]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
    return res.status(401).json({ success: false, message: "Incorrect email or password." });
  }

  const user = rows[0];
  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [user.id]);
  res.json({ success: true, message: "Login successful.", token: signUser(user), user: publicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
  if (!rows.length) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, user: publicUser(rows[0]) });
});

router.put("/me", requireAuth, async (req, res) => {
  const { name, phone, location, address, avatar } = req.body;
  await pool.query(
    "UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), location = COALESCE(?, location), address = COALESCE(?, address), avatar = COALESCE(?, avatar) WHERE id = ?",
    [name || null, phone || null, location || null, address || null, avatar || null, req.user.id]
  );
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
  res.json({ success: true, user: publicUser(rows[0]) });
});

router.put("/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Current password and a new password of at least 6 characters are required." });
  }
  const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ?", [req.user.id]);
  if (!rows.length || !(await bcrypt.compare(currentPassword, rows[0].password_hash))) {
    return res.status(400).json({ success: false, message: "Current password is incorrect." });
  }
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.user.id]);
  res.json({ success: true, message: "Password changed successfully." });
});

router.post("/forgot-password", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ success: false, message: "Email is required." });
  // This endpoint deliberately does not reveal whether an account exists.
  res.json({ success: true, message: "If an account exists for this email, password-reset instructions can be sent." });
});

module.exports = router;
