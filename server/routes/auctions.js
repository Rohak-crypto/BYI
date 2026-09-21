const express = require("express");
const { pool } = require("../config/db");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

function mapAuction(row) {
  return {
    id: row.id,
    name: row.title,
    category: row.category,
    description: row.description,
    startingPrice: Number(row.starting_price),
    price: Number(row.current_bid),
    currentBid: Number(row.current_bid),
    image: row.image_url,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    startAt: row.start_at,
    endAt: row.end_at,
    status: row.status,
    bidCount: Number(row.bid_count || 0),
    tags: row.tags ? String(row.tags).split(",").filter(Boolean) : (row.status === "live" ? ["Trending", "Live Now"] : []),
    secondsRemaining: Math.max(0, Math.floor((new Date(row.end_at).getTime() - Date.now()) / 1000))
  };
}

const baseSelect = `
  SELECT a.*, u.name AS seller_name,
         (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) AS bid_count
  FROM auctions a
  JOIN users u ON u.id = a.seller_id
`;

router.get("/", optionalAuth, async (req, res) => {
  const params = [];
  const where = [];
  const { category, search, status, maxPrice, limit = 50, offset = 0 } = req.query;

  if (category) { where.push("a.category = ?"); params.push(category); }
  if (search) {
    where.push("(a.title LIKE ? OR a.category LIKE ? OR a.description LIKE ?)");
    const q = `%${search}%`; params.push(q, q, q);
  }
  if (status && ["draft", "scheduled", "live", "ended", "cancelled"].includes(status)) {
    where.push("a.status = ?"); params.push(status);
  } else {
    where.push("a.status = 'live'");
  }
  if (maxPrice && Number.isFinite(Number(maxPrice))) { where.push("a.current_bid <= ?"); params.push(Number(maxPrice)); }

  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const sql = `${baseSelect} WHERE ${where.join(" AND ")} ORDER BY a.end_at ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
  const [rows] = await pool.query(sql, params);
  res.json({ success: true, auctions: rows.map(mapAuction) });
});

router.get("/:id", optionalAuth, async (req, res) => {
  const [rows] = await pool.query(`${baseSelect} WHERE a.id = ?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ success: false, message: "Auction not found." });
  res.json({ success: true, auction: mapAuction(rows[0]) });
});

router.post("/", requireAuth, async (req, res) => {
  const { title, category, description, startingPrice, imageUrl, startAt, endAt } = req.body;
  if (!title || !category || !startingPrice || !endAt) {
    return res.status(400).json({ success: false, message: "Title, category, starting price and end time are required." });
  }
  if (Number(startingPrice) <= 0 || new Date(endAt) <= new Date(startAt || Date.now())) {
    return res.status(400).json({ success: false, message: "Invalid price or auction dates." });
  }

  const start = startAt ? new Date(startAt) : new Date();
  const status = start <= new Date() ? "live" : "scheduled";
  const [result] = await pool.query(
    `INSERT INTO auctions
      (seller_id, title, category, description, starting_price, current_bid, image_url, start_at, end_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, title.trim(), category.trim(), description || null, Number(startingPrice), Number(startingPrice), imageUrl || null, start, new Date(endAt), status]
  );

  const [rows] = await pool.query(`${baseSelect} WHERE a.id = ?`, [result.insertId]);
  res.status(201).json({ success: true, auction: mapAuction(rows[0]) });
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, category, description, imageUrl, endAt } = req.body;
  const [result] = await pool.query(
    `UPDATE auctions SET title=COALESCE(?,title), category=COALESCE(?,category),
      description=COALESCE(?,description), image_url=COALESCE(?,image_url),
      end_at=COALESCE(?,end_at)
     WHERE id=? AND seller_id=? AND status IN ('draft','scheduled','live')`,
    [title || null, category || null, description || null, imageUrl || null, endAt ? new Date(endAt) : null, req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ success: false, message: "Auction not found or cannot be edited." });
  const [rows] = await pool.query(`${baseSelect} WHERE a.id = ?`, [req.params.id]);
  res.json({ success: true, auction: mapAuction(rows[0]) });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const [result] = await pool.query(
    "UPDATE auctions SET status='cancelled' WHERE id=? AND seller_id=? AND status IN ('draft','scheduled','live')",
    [req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ success: false, message: "Auction not found or already closed." });
  res.json({ success: true, message: "Auction cancelled." });
});

router.post("/:id/bids", requireAuth, async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "Enter a valid bid amount." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query("SELECT * FROM auctions WHERE id=? FOR UPDATE", [req.params.id]);
    if (!rows.length) throw Object.assign(new Error("Auction not found."), { status: 404 });
    const auction = rows[0];

    const now = new Date();
    if (auction.status !== "live" || new Date(auction.end_at) <= now) {
      await connection.query("UPDATE auctions SET status='ended' WHERE id=?", [auction.id]);
      throw Object.assign(new Error("This auction is closed."), { status: 409 });
    }
    // if (auction.seller_id === req.user.id) {
    //   throw Object.assign(new Error("You cannot bid on your own auction."), { status: 400 });
    // }
    if (amount <= Number(auction.current_bid)) {
      throw Object.assign(new Error(`Your bid must be higher than ₹${Number(auction.current_bid).toLocaleString("en-IN")}.`), { status: 400 });
    }

    await connection.query("INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)", [auction.id, req.user.id, amount]);
    await connection.query("UPDATE auctions SET current_bid=? WHERE id=?", [amount, auction.id]);

    await connection.query(
      "INSERT INTO notifications (user_id, type, title, message) VALUES (?, 'bid', 'New bid activity', ?)",
      [auction.seller_id, `A new bid was placed on "${auction.title}".`]
    );

    await connection.commit();
    res.status(201).json({ success: true, message: "Bid placed successfully.", currentBid: amount });
  } catch (error) {
    await connection.rollback();
    res.status(error.status || 500).json({ success: false, message: error.message || "Could not place bid." });
  } finally {
    connection.release();
  }
});

router.get("/:id/bids", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.amount, b.created_at, u.id AS bidder_id, u.name AS bidder_name
     FROM bids b JOIN users u ON u.id=b.bidder_id
     WHERE b.auction_id=? ORDER BY b.amount DESC, b.created_at DESC`,
    [req.params.id]
  );
  res.json({ success: true, bids: rows });
});

module.exports = router;
