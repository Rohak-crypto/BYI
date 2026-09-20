const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Bid Your Item backend is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Bid Your Item server running at http://localhost:${PORT}`);
});