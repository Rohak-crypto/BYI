const express = require("express");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", requireAuth, async (req,res) => {
  const [rows] = await pool.query(`
    SELECT a.id, a.title AS name, a.category, a.current_bid AS current,
           a.image_url AS img, a.end_at, a.status
    FROM wishlists w JOIN auctions a ON a.id=w.auction_id
    WHERE w.user_id=? ORDER BY w.created_at DESC`, [req.user.id]);
  res.json({ success:true, wishlist:rows });
});

router.post("/:auctionId", requireAuth, async (req,res) => {
  await pool.query("INSERT IGNORE INTO wishlists (user_id, auction_id) VALUES (?,?)", [req.user.id, req.params.auctionId]);
  res.status(201).json({success:true,message:"Added to wishlist."});
});

router.delete("/:auctionId", requireAuth, async (req,res) => {
  await pool.query("DELETE FROM wishlists WHERE user_id=? AND auction_id=?", [req.user.id, req.params.auctionId]);
  res.json({success:true,message:"Removed from wishlist."});
});

module.exports = router;
