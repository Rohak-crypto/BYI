const express=require("express");
const {pool}=require("../config/db");
const router=express.Router();
router.get("/",async(_req,res)=>{
 const [[users]]=await pool.query("SELECT COUNT(*) AS count FROM users");
 const [[live]]=await pool.query("SELECT COUNT(*) AS count FROM auctions WHERE status='live' AND end_at>NOW()");
 const [[auctions]]=await pool.query("SELECT COUNT(*) AS count FROM auctions");
 res.json({success:true,stats:{users:Number(users.count),liveAuctions:Number(live.count),auctions:Number(auctions.count)}});
});
module.exports=router;
