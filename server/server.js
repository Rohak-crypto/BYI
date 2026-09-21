require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { testConnection } = require("./config/db");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const app = express();
const PORT = Number(process.env.PORT || 3000);
const clientPath = path.join(__dirname, "../client");

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || `http://localhost:${PORT}`)
  .split(",").map(s => s.trim()).filter(Boolean);

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com"
        ],

        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com"
        ],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:"
        ],

        connectSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],

        objectSrc: ["'none'"],

        baseUri: ["'self'"],

        formAction: ["'self'"]
      }
    }
  })
);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") return callback(null, true);
    return callback(new Error("CORS origin not allowed."));
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false });
app.use("/api/auth", authLimiter);

app.get("/api/health", async (_req, res) => {
  try {
    await testConnection();
    res.json({ success: true, status: "ok", database: "connected", time: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ success: false, status: "degraded", database: "unavailable", message: "Database connection failed." });
  }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/auctions", require("./routes/auctions"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/support", require("./routes/support"));
app.use("/api/stats", require("./routes/stats"));

app.use(express.static(clientPath));

app.get("/", (req, res) => res.sendFile(path.join(clientPath, "index.html")));

app.get("/*splat", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(clientPath, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Something went wrong." : err.message
  });
});

async function start() {
  try {
    await testConnection();
    console.log("MySQL connection successful.");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    console.error("Configure server/.env and run database/schema.sql before starting the app.");
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`Bid Your Item running at http://localhost:${PORT}`));
}

start();
