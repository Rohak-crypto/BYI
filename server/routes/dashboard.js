// const express = require("express");
// const { pool } = require("../config/db");
// const { requireAuth } = require("../middleware/auth");
// const router = express.Router();

// router.get("/", requireAuth, async (req, res) => {
//   const uid = req.user.id;
//   const [[stats]] = await pool.query(`
//     SELECT
//       (SELECT COUNT(*) FROM bids WHERE bidder_id=?) AS total_bids,
//       (SELECT COUNT(*) FROM auctions WHERE seller_id=?) AS my_auctions,
//       (SELECT COUNT(*) FROM wishlists WHERE user_id=?) AS wishlist_count,
//       (SELECT COALESCE(SUM(amount),0) FROM transactions WHERE user_id=? AND type='credit' AND status='completed') -
//       (SELECT COALESCE(SUM(amount),0) FROM transactions WHERE user_id=? AND type='debit' AND status='completed') AS wallet_balance
//   `, [uid, uid, uid, uid, uid]);

//   const [bids] = await pool.query(`
//     SELECT a.id, a.title AS name, a.category, a.current_bid AS current,
//            b.amount AS your, a.end_at, a.image_url AS img,
//            CASE WHEN b.amount = a.current_bid THEN 'leading' ELSE 'outbid' END AS status
//     FROM bids b JOIN auctions a ON a.id=b.auction_id
//     WHERE b.bidder_id=?
//       AND b.id=(SELECT b2.id FROM bids b2 WHERE b2.auction_id=b.auction_id AND b2.bidder_id=? ORDER BY b2.created_at DESC LIMIT 1)
//     ORDER BY a.end_at ASC LIMIT 50
//   `, [uid, uid]);

//   const [wishlist] = await pool.query(`
//     SELECT a.id, a.title AS name, a.category, a.current_bid AS current, a.image_url AS img, a.end_at
//     FROM wishlists w JOIN auctions a ON a.id=w.auction_id WHERE w.user_id=? ORDER BY w.created_at DESC
//   `, [uid]);

//   const [myAuctions] = await pool.query(`
//     SELECT a.*, (SELECT COUNT(*) FROM bids b WHERE b.auction_id=a.id) AS bid_count
//     FROM auctions a WHERE a.seller_id=? ORDER BY a.created_at DESC LIMIT 50
//   `, [uid]);

//   res.json({ success: true, stats, bids, wishlist, myAuctions });
// });

// module.exports = router;


const express = require("express");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

/*
 * GET /api/dashboard
 * Returns all data required by the buyer dashboard.
 */
router.get("/", requireAuth, async (req, res) => {
  const uid = req.user.id;

  try {
    /*
     * ---------------------------------------------------------
     * USER PROFILE
     * ---------------------------------------------------------
     */
    const [userRows] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        avatar,
        location,
        address,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [uid]
    );

    if (!userRows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const user = userRows[0];

    /*
     * ---------------------------------------------------------
     * DASHBOARD STATISTICS
     * ---------------------------------------------------------
     */

    // Active auctions where the user currently has a bid.
    const [[activeBidStats]] = await pool.query(
      `
      SELECT COUNT(*) AS active_bids
      FROM (
        SELECT b.auction_id
        FROM bids b
        JOIN auctions a ON a.id = b.auction_id
        WHERE b.bidder_id = ?
          AND a.status = 'live'
          AND a.end_at > NOW()
        GROUP BY b.auction_id
      ) AS active
      `,
      [uid]
    );

    // Won auctions = orders belonging to this user.
    const [[wonStats]] = await pool.query(
      `
      SELECT COUNT(*) AS won_auctions
      FROM orders
      WHERE buyer_id = ?
        AND status NOT IN ('cancelled')
      `,
      [uid]
    );

    // Wishlist/watch count.
    const [[wishlistStats]] = await pool.query(
      `
      SELECT COUNT(*) AS wishlist_count
      FROM wishlists
      WHERE user_id = ?
      `,
      [uid]
    );

    // Wallet balance.
    const [[walletStats]] = await pool.query(
      `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN type = 'credit' AND status = 'completed'
              THEN amount
              WHEN type = 'debit' AND status = 'completed'
              THEN -amount
              ELSE 0
            END
          ),
          0
        ) AS wallet_balance
      FROM transactions
      WHERE user_id = ?
      `,
      [uid]
    );

    // Number of auctions created by this user.
    const [[myAuctionStats]] = await pool.query(
      `
      SELECT COUNT(*) AS my_auctions
      FROM auctions
      WHERE seller_id = ?
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * USER'S ACTIVE / RECENT BIDS
     * ---------------------------------------------------------
     *
     * Returns the user's latest bid for every auction.
     */
    const [bids] = await pool.query(
      `
      SELECT
        a.id,
        a.title AS name,
        a.category,
        a.current_bid AS current,
        latest.amount AS your,
        a.starting_price,
        a.description,
        a.image_url AS img,
        a.start_at,
        a.end_at,
        a.status AS auction_status,

        CASE
          WHEN a.status = 'ended' THEN 'ended'
          WHEN a.end_at <= NOW() THEN 'ended'
          WHEN latest.amount >= a.current_bid THEN 'leading'
          ELSE 'outbid'
        END AS bid_status

      FROM auctions a

      JOIN (
        SELECT
          b1.auction_id,
          b1.amount
        FROM bids b1
        INNER JOIN (
          SELECT
            auction_id,
            MAX(id) AS latest_bid_id
          FROM bids
          WHERE bidder_id = ?
          GROUP BY auction_id
        ) latest_bid
          ON latest_bid.latest_bid_id = b1.id
      ) latest
        ON latest.auction_id = a.id

      ORDER BY a.end_at ASC
      LIMIT 100
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * WISHLIST
     * ---------------------------------------------------------
     */
    const [wishlist] = await pool.query(
      `
      SELECT
        a.id,
        a.title AS name,
        a.category,
        a.current_bid AS current,
        a.starting_price,
        a.description,
        a.image_url AS img,
        a.start_at,
        a.end_at,
        a.status
      FROM wishlists w
      JOIN auctions a
        ON a.id = w.auction_id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
      LIMIT 100
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * USER'S AUCTIONS
     * ---------------------------------------------------------
     */
    const [myAuctions] = await pool.query(
      `
      SELECT
        a.id,
        a.title,
        a.category,
        a.description,
        a.starting_price,
        a.current_bid,
        a.image_url,
        a.start_at,
        a.end_at,
        a.status,
        a.created_at,
        (
          SELECT COUNT(*)
          FROM bids b
          WHERE b.auction_id = a.id
        ) AS bid_count
      FROM auctions a
      WHERE a.seller_id = ?
      ORDER BY a.created_at DESC
      LIMIT 100
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * NOTIFICATIONS
     * ---------------------------------------------------------
     */
    const [notifications] = await pool.query(
      `
      SELECT
        id,
        type,
        title,
        message,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * MESSAGES
     * ---------------------------------------------------------
     */
    const [messages] = await pool.query(
      `
      SELECT
        m.id,
        m.subject,
        m.body,
        m.is_read,
        m.created_at,
        m.sender_id,
        m.receiver_id,
        u.name AS sender_name,
        u.email AS sender_email
      FROM messages m
      JOIN users u
        ON u.id = m.sender_id
      WHERE m.receiver_id = ?
      ORDER BY m.created_at DESC
      LIMIT 50
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * RECENT TRANSACTIONS
     * ---------------------------------------------------------
     */
    const [transactions] = await pool.query(
      `
      SELECT
        id,
        type,
        amount,
        reference_type,
        reference_id,
        description,
        status,
        created_at
      FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [uid]
    );

    /*
     * ---------------------------------------------------------
     * FINAL RESPONSE
     * ---------------------------------------------------------
     */
    res.json({
      success: true,

      user,

      stats: {
        active_bids: Number(activeBidStats.active_bids || 0),
        won_auctions: Number(wonStats.won_auctions || 0),
        watching: Number(wishlistStats.wishlist_count || 0),
        saved_items: Number(wishlistStats.wishlist_count || 0),
        wallet_balance: Number(walletStats.wallet_balance || 0),
        my_auctions: Number(myAuctionStats.my_auctions || 0)
      },

      bids,
      wishlist,
      myAuctions,
      notifications,
      messages,
      transactions
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data."
    });
  }
});

module.exports = router;
