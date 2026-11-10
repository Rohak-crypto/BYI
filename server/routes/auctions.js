const express = require("express");
const { pool } = require("../config/db");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();


// =====================================================
// MAP AUCTION DATA
// =====================================================

function mapAuction(row) {
    return {
        id: row.id,
        name: row.title,
        title: row.title,

        category: row.category,
        description: row.description,

        startingPrice: Number(row.starting_price),
        starting_price: Number(row.starting_price),

        price: Number(row.current_bid),
        currentBid: Number(row.current_bid),
        current_bid: Number(row.current_bid),

        image: row.image_url,
        image_url: row.image_url,
        img: row.image_url,

        sellerId: row.seller_id,
        seller_id: row.seller_id,
        sellerName: row.seller_name,

        startAt: row.start_at,
        start_at: row.start_at,

        endAt: row.end_at,
        end_at: row.end_at,

        status: row.status,
        auction_status: row.status,

        bidCount: Number(row.bid_count || 0),
        bid_count: Number(row.bid_count || 0),

        tags: row.tags
            ? String(row.tags).split(",").filter(Boolean)
            : row.status === "live"
                ? ["Trending", "Live Now"]
                : [],

        secondsRemaining: Math.max(
            0,
            Math.floor(
                (new Date(row.end_at).getTime() - Date.now()) / 1000
            )
        )
    };
}


// =====================================================
// COMMON AUCTION SELECT QUERY
// =====================================================

const baseSelect = `
    SELECT
        a.*,
        u.name AS seller_name,
        (
            SELECT COUNT(*)
            FROM bids b
            WHERE b.auction_id = a.id
        ) AS bid_count
    FROM auctions a
    JOIN users u ON u.id = a.seller_id
`;


// =====================================================
// GET ALL AUCTIONS
// =====================================================

router.get("/", optionalAuth, async (req, res) => {
    try {
        const params = [];
        const where = [];

        const {
            category,
            search,
            status,
            maxPrice,
            limit = 50,
            offset = 0
        } = req.query;

        if (category) {
            where.push("a.category = ?");
            params.push(category);
        }

        if (search) {
            where.push(
                "(a.title LIKE ? OR a.category LIKE ? OR a.description LIKE ?)"
            );

            const query = `%${search}%`;

            params.push(query, query, query);
        }

        if (
            status &&
            ["draft", "scheduled", "live", "ended", "cancelled"].includes(status)
        ) {
            where.push("a.status = ?");
            params.push(status);
        } else {
            where.push("a.status = 'live'");
            where.push("a.start_at <= NOW()");
            where.push("a.end_at > NOW()");
        }

        if (maxPrice && Number.isFinite(Number(maxPrice))) {
            where.push("a.current_bid <= ?");
            params.push(Number(maxPrice));
        }

        const safeLimit = Math.min(
            Math.max(Number(limit) || 50, 1),
            100
        );

        const safeOffset = Math.max(Number(offset) || 0, 0);

        const sql = `
            ${baseSelect}
            WHERE ${where.join(" AND ")}
            ORDER BY a.end_at ASC
            LIMIT ${safeLimit}
            OFFSET ${safeOffset}
        `;

        const [rows] = await pool.query(sql, params);

        res.json({
            success: true,
            auctions: rows.map(mapAuction)
        });

    } catch (error) {
        console.error("Get auctions error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load auctions."
        });
    }
});


// =====================================================
// GET SINGLE AUCTION
// =====================================================

router.get("/:id", optionalAuth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `${baseSelect} WHERE a.id = ?`,
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Auction not found."
            });
        }

        res.json({
            success: true,
            auction: mapAuction(rows[0])
        });

    } catch (error) {
        console.error("Get auction error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load auction."
        });
    }
});


// =====================================================
// PLACE BID - SINGLE CORRECTED ROUTE
// =====================================================

router.post("/:id/bids", requireAuth, async (req, res) => {

    const auctionId = Number(req.params.id);
    const amount = Number(req.body.amount);

    if (!Number.isInteger(auctionId) || auctionId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid auction ID."
        });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid bid amount."
        });
    }

    let connection;
    let transactionStarted = false;

    try {

        connection = await pool.getConnection();

        await connection.beginTransaction();
        transactionStarted = true;

        const [rows] = await connection.query(
            `SELECT
                a.*,
                (a.start_at <= NOW()) AS has_started,
                (a.end_at > NOW()) AS has_not_ended
             FROM auctions a
             WHERE a.id = ?
             FOR UPDATE`,
            [auctionId]
        );


        if (!rows.length) {
            throw Object.assign(
                new Error("Auction not found."),
                { status: 404 }
            );
        }

        const auction = rows[0];


        if (
            auction.status === "cancelled" ||
            auction.status === "draft" ||
            auction.status === "ended"
        ) {
            throw Object.assign(
                new Error("This auction is not open for bidding."),
                { status: 409 }
            );
        }

        if (!Number(auction.has_started)) {
            throw Object.assign(
                new Error("This auction has not started yet."),
                { status: 409 }
            );
        }


        // -------------------------------------------------
        // 4. CHECK AUCTION END TIME
        // -------------------------------------------------

        if (!Number(auction.has_not_ended)) {

            await connection.query(
                `UPDATE auctions
                 SET status = 'ended'
                 WHERE id = ?`,
                [auctionId]
            );

            await connection.commit();
            transactionStarted = false;

            return res.status(409).json({
                success: false,
                message: "This auction has ended."
            });
        }


        // -------------------------------------------------
        // 5. UPDATE SCHEDULED AUCTION TO LIVE
        // -------------------------------------------------

        if (auction.status === "scheduled") {

            await connection.query(
                `UPDATE auctions
                 SET status = 'live'
                 WHERE id = ?`,
                [auctionId]
            );

        }


        // -------------------------------------------------
        // 6. PREVENT SELLER FROM BIDDING ON OWN AUCTION
        // -------------------------------------------------

        if (Number(auction.seller_id) === Number(req.user.id)) {
            throw Object.assign(
                new Error("You cannot bid on your own auction."),
                { status: 400 }
            );
        }


        // -------------------------------------------------
        // 7. VALIDATE BID AMOUNT
        // -------------------------------------------------

        const currentBid = Number(auction.current_bid);

        if (amount <= currentBid) {

            throw Object.assign(
                new Error(
                    `Your bid must be higher than ₹${currentBid.toLocaleString("en-IN")}.`
                ),
                { status: 400 }
            );

        }


        // -------------------------------------------------
        // 8. INSERT BID INTO BID HISTORY
        // -------------------------------------------------

        const [bidResult] = await connection.query(
            `INSERT INTO bids
                (auction_id, bidder_id, amount)
             VALUES (?, ?, ?)`,
            [
                auctionId,
                req.user.id,
                amount
            ]
        );


        // -------------------------------------------------
        // 9. UPDATE CURRENT BID IN AUCTIONS TABLE
        // -------------------------------------------------

        await connection.query(
            `UPDATE auctions
             SET current_bid = ?
             WHERE id = ?`,
            [
                amount,
                auctionId
            ]
        );


        // -------------------------------------------------
        // 10. NOTIFY SELLER
        // -------------------------------------------------

        await connection.query(
            `INSERT INTO notifications
                (user_id, type, title, message)
             VALUES (?, 'bid', 'New bid activity', ?)`,
            [
                auction.seller_id,
                `A new bid of ₹${amount.toLocaleString("en-IN")} was placed on "${auction.title}".`
            ]
        );


        // -------------------------------------------------
        // 11. COMMIT TRANSACTION
        // -------------------------------------------------

        await connection.commit();
        transactionStarted = false;


        // -------------------------------------------------
        // 12. SEND SUCCESS RESPONSE
        // -------------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Bid placed successfully.",

            bid: {
                id: bidResult.insertId,
                auction_id: auctionId,
                bidder_id: req.user.id,
                amount: amount,
                created_at: new Date()
            },

            auction: {
                id: auctionId,
                current_bid: amount
            },

            currentBid: amount

        });


    } catch (error) {

        if (connection && transactionStarted) {

            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Bid rollback error:", rollbackError);
            }

        }

        console.error("PLACE BID ERROR:", error);

        return res.status(error.status || 500).json({

            success: false,

            message: error.message || "Unable to place bid."

        });

    } finally {

        if (connection) {
            connection.release();
        }

    }

});


// =====================================================
// UPDATE AUCTION
// =====================================================

router.put("/:id", requireAuth, async (req, res) => {
    try {

        const {
            title,
            category,
            description,
            imageUrl,
            endAt
        } = req.body;

        const [result] = await pool.query(
            `UPDATE auctions
             SET
                title = COALESCE(?, title),
                category = COALESCE(?, category),
                description = COALESCE(?, description),
                image_url = COALESCE(?, image_url),
                end_at = COALESCE(?, end_at)
             WHERE id = ?
             AND seller_id = ?
             AND status IN ('draft', 'scheduled', 'live')`,
            [
                title || null,
                category || null,
                description || null,
                imageUrl || null,
                endAt ? new Date(endAt) : null,
                req.params.id,
                req.user.id
            ]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Auction not found or cannot be edited."
            });
        }

        const [rows] = await pool.query(
            `${baseSelect} WHERE a.id = ?`,
            [req.params.id]
        );

        res.json({
            success: true,
            auction: mapAuction(rows[0])
        });

    } catch (error) {

        console.error("Update auction error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update auction."
        });

    }
});


// =====================================================
// CANCEL AUCTION
// =====================================================

router.delete("/:id", requireAuth, async (req, res) => {
    try {

        const [result] = await pool.query(
            `UPDATE auctions
             SET status = 'cancelled'
             WHERE id = ?
             AND seller_id = ?
             AND status IN ('draft', 'scheduled', 'live')`,
            [
                req.params.id,
                req.user.id
            ]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Auction not found or already closed."
            });
        }

        res.json({
            success: true,
            message: "Auction cancelled."
        });

    } catch (error) {

        console.error("Cancel auction error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to cancel auction."
        });

    }
});


// =====================================================
// GET AUCTION BID HISTORY
// =====================================================

router.get("/:id/bids", optionalAuth, async (req, res) => {
    try {

        const [rows] = await pool.query(
            `SELECT
                b.id,
                b.auction_id,
                b.amount,
                b.created_at,
                u.id AS bidder_id,
                u.name AS bidder_name
             FROM bids b
             JOIN users u ON u.id = b.bidder_id
             WHERE b.auction_id = ?
             ORDER BY b.amount DESC, b.created_at DESC`,
            [req.params.id]
        );

        res.json({
            success: true,
            bids: rows
        });

    } catch (error) {

        console.error("Get auction bids error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load auction bids."
        });

    }
});

module.exports = router;