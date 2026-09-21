// const express=require("express");
// const {pool}=require("../config/db");
// const {requireAuth,optionalAuth}=require("../middleware/auth");
// const router=express.Router();

// router.post("/",optionalAuth,async(req,res)=>{
//  const {name,email,topic,message}=req.body;
//  if(!name || !email || !message) return res.status(400).json({success:false,message:"Name, email and message are required."});
//  await pool.query("INSERT INTO support_messages(user_id,name,email,topic,message) VALUES(?,?,?,?,?)",
//    [req.user?.id || null,name,email,topic||null,message]);
//  res.status(201).json({success:true,message:"Support request submitted."});
// });
// module.exports=router;

const express = require("express");
const { pool } = require("../config/db");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", optionalAuth, async (req, res) => {
    try {
        const { name, email, topic, message } = req.body;

        const cleanName = String(name || "").trim();
        const cleanEmail = String(email || "").trim().toLowerCase();
        const cleanTopic = String(topic || "").trim();
        const cleanMessage = String(message || "").trim();

        if (!cleanName || !cleanEmail || !cleanMessage) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required."
            });
        }

        if (cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name is too long."
            });
        }

        if (cleanEmail.length > 190) {
            return res.status(400).json({
                success: false,
                message: "Email address is too long."
            });
        }

        if (cleanMessage.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Message must be 2000 characters or less."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO support_messages
            (user_id, name, email, topic, message)
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.user?.id || null,
                cleanName,
                cleanEmail,
                cleanTopic || null,
                cleanMessage
            ]
        );

        res.status(201).json({
            success: true,
            message: "Support request submitted successfully.",
            supportId: result.insertId
        });

    } catch (error) {
        console.error("Support request error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit your support request."
        });
    }
});

module.exports = router;