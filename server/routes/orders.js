const express = require("express");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", requireAuth, async (req,res) => {
  const [rows] = await pool.query(`
    SELECT o.*, a.title, a.category, a.image_url
    FROM orders o JOIN auctions a ON a.id=o.auction_id
    WHERE o.buyer_id=? ORDER BY o.created_at DESC`, [req.user.id]);
  res.json({success:true,orders:rows});
});

router.get("/won", requireAuth, async (req,res) => {
  const [rows] = await pool.query(`
    SELECT o.*, a.title, a.category, a.image_url
    FROM orders o JOIN auctions a ON a.id=o.auction_id
    WHERE o.buyer_id=? AND o.status IN ('pending_payment','paid','completed')
    ORDER BY o.created_at DESC`, [req.user.id]);
  res.json({success:true,orders:rows});
});

router.get("/:id", requireAuth, async (req,res) => {
  const [rows] = await pool.query(`
    SELECT o.*, a.title, a.category, a.image_url, a.seller_id, u.name AS seller_name
    FROM orders o JOIN auctions a ON a.id=o.auction_id JOIN users u ON u.id=a.seller_id
    WHERE o.id=? AND o.buyer_id=?`, [req.params.id, req.user.id]);
  if(!rows.length) return res.status(404).json({success:false,message:"Order not found."});
  res.json({success:true,order:rows[0]});
});

module.exports = router;
