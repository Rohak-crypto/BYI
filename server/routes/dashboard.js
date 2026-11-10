const express = require("express");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const [userRows] = await pool.query(
            `SELECT id, name, email, phone, role, avatar, location, address, created_at
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [userId]
        );

        if (!userRows.length) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = userRows[0];

        const [[stats]] = await pool.query(
            `SELECT
                (
                    SELECT COUNT(DISTINCT b.auction_id)
                    FROM bids b
                    JOIN auctions a ON a.id = b.auction_id
                    WHERE b.bidder_id = ?
                    AND a.status = 'live'
                    AND a.end_at > NOW()
                ) AS active_bids,

                (
                    SELECT COUNT(*)
                    FROM orders
                    WHERE buyer_id = ?
                    AND status <> 'cancelled'
                ) AS won_auctions,

                (
                    SELECT COUNT(*)
                    FROM wishlists
                    WHERE user_id = ?
                ) AS watching,

                (
                    SELECT COALESCE(SUM(
                        CASE
                            WHEN type = 'credit' AND status = 'completed'
                                THEN amount
                            WHEN type = 'debit' AND status = 'completed'
                                THEN -amount
                            ELSE 0
                        END
                    ), 0)
                    FROM transactions
                    WHERE user_id = ?
                ) AS wallet_balance,

                (
                    SELECT COUNT(*)
                    FROM auctions
                    WHERE seller_id = ?
                ) AS my_auctions`,
            [userId, userId, userId, userId, userId]
        );

        const [bids] = await pool.query(
            `SELECT
                latest.id AS bid_id,
                a.id AS id,
                a.id AS auction_id,
                a.title AS name,
                a.title AS title,
                a.category,
                a.description,
                a.starting_price,
                a.current_bid AS current,
                a.current_bid AS current_bid,
                latest.amount AS your,
                latest.amount AS your_bid,
                latest.amount AS amount,
                a.image_url AS img,
                a.image_url AS image_url,
                a.start_at,
                a.end_at,
                a.status AS auction_status,
                CASE
                    WHEN a.status IN ('ended', 'cancelled')
                         OR a.end_at <= NOW()
                        THEN 'ended'
                    WHEN latest.amount >= a.current_bid
                        THEN 'leading'
                    ELSE 'outbid'
                END AS bid_status,
                CASE
                    WHEN a.status IN ('ended', 'cancelled')
                         OR a.end_at <= NOW()
                        THEN 'ended'
                    WHEN latest.amount >= a.current_bid
                        THEN 'leading'
                    ELSE 'outbid'
                END AS status
            FROM bids latest
            JOIN auctions a ON a.id = latest.auction_id
            JOIN (
                SELECT auction_id, MAX(id) AS latest_bid_id
                FROM bids
                WHERE bidder_id = ?
                GROUP BY auction_id
            ) latest_ids ON latest_ids.latest_bid_id = latest.id
            WHERE latest.bidder_id = ?
            ORDER BY latest.created_at DESC
            LIMIT 100`,
            [userId, userId]
        );

        const [wishlist] = await pool.query(
            `SELECT
                a.id,
                a.id AS auction_id,
                a.title AS name,
                a.title AS title,
                a.category,
                a.description,
                a.current_bid AS current,
                a.current_bid AS current_bid,
                a.starting_price,
                a.image_url AS img,
                a.image_url AS image_url,
                a.start_at,
                a.end_at,
                a.status
            FROM wishlists w
            JOIN auctions a ON a.id = w.auction_id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
            LIMIT 100`,
            [userId]
        );

        const [myAuctions] = await pool.query(
            `SELECT
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
            LIMIT 100`,
            [userId]
        );

        const [notifications] = await pool.query(
            `SELECT id, type, title, message, is_read, created_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC
             LIMIT 50`,
            [userId]
        );

        const [messages] = await pool.query(
            `SELECT
                m.id,
                m.subject,
                m.body,
                m.body AS message,
                m.is_read,
                m.created_at,
                m.sender_id,
                m.receiver_id,
                u.name AS sender_name,
                u.email AS sender_email
            FROM messages m
            JOIN users u ON u.id = m.sender_id
            WHERE m.receiver_id = ?
            ORDER BY m.created_at DESC
            LIMIT 50`,
            [userId]
        );

        const [transactions] = await pool.query(
            `SELECT
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
            LIMIT 50`,
            [userId]
        );

        res.json({
            success: true,
            user,
            stats: {
                active_bids: Number(stats.active_bids || 0),
                won_auctions: Number(stats.won_auctions || 0),
                watching: Number(stats.watching || 0),
                saved_items: Number(stats.watching || 0),
                wallet_balance: Number(stats.wallet_balance || 0),
                my_auctions: Number(stats.my_auctions || 0)
            },
            bids,
            wishlist,
            myAuctions,
            notifications,
            messages,
            transactions
        });

    } catch (error) {
        console.error("Dashboard API error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard data."
        });
    }
});

module.exports = router;