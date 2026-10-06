const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const { seedAuctionsForUser } = require("../utils/seed");
const { sendPasswordResetOTP } = require("../utils/email");

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
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });
        }

        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();

        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [normalizedEmail]
        );

        if (existing.length) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await pool.query(
            "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'buyer')",
            [
                String(name).trim(),
                normalizedEmail,
                phone ? String(phone).trim() : null,
                passwordHash
            ]
        );

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [result.insertId]
        );

        const user = rows[0];

        await seedAuctionsForUser(user.id);

        const token = signUser(user);

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user: publicUser(user)
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [normalizedEmail]
        );

        if (
            !rows.length ||
            !(await bcrypt.compare(
                password,
                rows[0].password_hash
            ))
        ) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            });
        }

        const user = rows[0];

        await pool.query(
            "UPDATE users SET last_login_at = NOW() WHERE id = ?",
            [user.id]
        );

        res.json({
            success: true,
            message: "Login successful.",
            token: signUser(user),
            user: publicUser(user)
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
});

router.get("/me", requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [req.user.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user: publicUser(rows[0])
        });

    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get user details."
        });
    }
});

router.put("/me", requireAuth, async (req, res) => {
    try {
        const {
            name,
            phone,
            location,
            address,
            avatar
        } = req.body;

        await pool.query(
            `UPDATE users
             SET
                name = COALESCE(?, name),
                phone = COALESCE(?, phone),
                location = COALESCE(?, location),
                address = COALESCE(?, address),
                avatar = COALESCE(?, avatar)
             WHERE id = ?`,
            [
                name || null,
                phone || null,
                location || null,
                address || null,
                avatar || null,
                req.user.id
            ]
        );

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [req.user.id]
        );

        res.json({
            success: true,
            user: publicUser(rows[0])
        });

    } catch (error) {
        console.error("Update user error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update profile."
        });
    }
});

router.put("/password", requireAuth, async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (
            !currentPassword ||
            !newPassword ||
            newPassword.length < 6
        ) {
            return res.status(400).json({
                success: false,
                message: "Current password and a new password of at least 6 characters are required."
            });
        }

        const [rows] = await pool.query(
            "SELECT password_hash FROM users WHERE id = ?",
            [req.user.id]
        );

        if (
            !rows.length ||
            !(await bcrypt.compare(
                currentPassword,
                rows[0].password_hash
            ))
        ) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hash = await bcrypt.hash(
            newPassword,
            12
        );

        await pool.query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [hash, req.user.id]
        );

        res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to change password."
        });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        const [users] = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        if (!users.length) {
            return res.json({
                success: true,
                message: "If an account exists for this email, an OTP has been sent."
            });
        }

        const user = users[0];

        await pool.query(
            `UPDATE password_reset_otps
             SET used_at = NOW()
             WHERE user_id = ?
             AND used_at IS NULL`,
            [user.id]
        );

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        const otpHash = await bcrypt.hash(
            otp,
            10
        );

        await pool.query(
            `INSERT INTO password_reset_otps
             (
                user_id,
                email,
                otp_hash,
                expires_at
             )
             VALUES
             (
                ?,
                ?,
                ?,
                DATE_ADD(NOW(), INTERVAL 10 MINUTE)
             )`,
            [
                user.id,
                user.email,
                otpHash
            ]
        );

        await sendPasswordResetOTP(
            user.email,
            otp
        );

        res.json({
            success: true,
            message: "If an account exists for this email, an OTP has been sent."
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to send the password reset OTP."
        });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        const otp = String(req.body.otp || "")
            .trim();

        const newPassword =
            String(req.body.newPassword || "");

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required."
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must contain exactly 6 digits."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 6 characters."
            });
        }

        const [rows] = await pool.query(
            `SELECT *
             FROM password_reset_otps
             WHERE email = ?
             AND used_at IS NULL
             ORDER BY created_at DESC
             LIMIT 1`,
            [email]
        );

        if (!rows.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP."
            });
        }

        const resetRequest = rows[0];

        if (
            new Date(resetRequest.expires_at).getTime()
            < Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }

        if (resetRequest.attempts >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many incorrect OTP attempts. Please request a new OTP."
            });
        }

        const validOTP = await bcrypt.compare(
            otp,
            resetRequest.otp_hash
        );

        if (!validOTP) {
            await pool.query(
                `UPDATE password_reset_otps
                 SET attempts = attempts + 1
                 WHERE id = ?`,
                [resetRequest.id]
            );

            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        const passwordHash = await bcrypt.hash(
            newPassword,
            12
        );

        await pool.query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [
                passwordHash,
                resetRequest.user_id
            ]
        );

        await pool.query(
            `UPDATE password_reset_otps
             SET used_at = NOW()
             WHERE id = ?`,
            [resetRequest.id]
        );

        await pool.query(
            `UPDATE password_reset_otps
             SET used_at = NOW()
             WHERE user_id = ?
             AND id != ?
             AND used_at IS NULL`,
            [
                resetRequest.user_id,
                resetRequest.id
            ]
        );

        res.json({
            success: true,
            message: "Password reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to reset your password."
        });
    }
});

module.exports = router;
