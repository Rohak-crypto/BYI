const express=require("express");
const {pool}=require("../config/db");
const {requireAuth}=require("../middleware/auth");
const router=express.Router();

router.get("/",requireAuth,async(req,res)=>{
 const [rows]=await pool.query(`
   SELECT m.*, s.name AS sender_name, r.name AS receiver_name
   FROM messages m JOIN users s ON s.id=m.sender_id JOIN users r ON r.id=m.receiver_id
   WHERE m.sender_id=? OR m.receiver_id=? ORDER BY m.created_at DESC LIMIT 200`,
   [req.user.id,req.user.id]);
 res.json({success:true,messages:rows});
});

router.post("/",requireAuth,async(req,res)=>{
 const {receiverId,subject,body}=req.body;
 if(!receiverId || !body) return res.status(400).json({success:false,message:"Receiver and message are required."});
 const [result]=await pool.query("INSERT INTO messages(sender_id,receiver_id,subject,body) VALUES(?,?,?,?)",
   [req.user.id,receiverId,subject||null,String(body).trim()]);
 res.status(201).json({success:true,id:result.insertId});
});
module.exports=router;
