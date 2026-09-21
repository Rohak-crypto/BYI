const express = require("express");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/history", requireAuth, async (req,res)=>{
  const [rows] = await pool.query(
    "SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC LIMIT 100",
    [req.user.id]
  );
  res.json({success:true,transactions:rows});
});

router.post("/checkout", requireAuth, async (req,res)=>{
  const auctionId = Number(req.body.auctionId);
  if(!auctionId) return res.status(400).json({success:false,message:"Auction is required."});

  const [rows] = await pool.query(`
    SELECT a.*, 
      (SELECT bidder_id FROM bids WHERE auction_id=a.id ORDER BY amount DESC, created_at ASC LIMIT 1) AS winner_id
    FROM auctions a WHERE a.id=?`, [auctionId]);
  if(!rows.length) return res.status(404).json({success:false,message:"Auction not found."});
  const a=rows[0];
  if(a.status !== "ended") return res.status(409).json({success:false,message:"Auction has not ended."});
  if(Number(a.winner_id) !== Number(req.user.id)) return res.status(403).json({success:false,message:"Only the winning bidder can checkout."});

  const [existing] = await pool.query("SELECT * FROM orders WHERE auction_id=? LIMIT 1",[auctionId]);
  if(existing.length) return res.json({success:true,order:existing[0]});

  const [result] = await pool.query(
    "INSERT INTO orders (auction_id,buyer_id,amount,status) VALUES (?,?,?,'pending_payment')",
    [auctionId,req.user.id,a.current_bid]
  );
  const [order] = await pool.query("SELECT * FROM orders WHERE id=?",[result.insertId]);
  res.status(201).json({success:true,order:order[0],message:"Checkout created. Connect a payment gateway before accepting real money."});
});

module.exports = router;
