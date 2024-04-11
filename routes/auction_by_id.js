import express from "express";
import { connectToDatabase } from "../db/db.js"; // Import your database connection module

const router = express.Router();

router.get('/auctions/:id', (req, res) => {
    const auctionId = req.params.id;
    // Connect to the database
    const connection = connectToDatabase();

    const query = `
    SELECT 
        *
    FROM 
        auction
    INNER JOIN 
        furniture ON auction.furniture_id = furniture.furniture_id
    WHERE 
        auction.auction_id = ?;
  `;

    // Execute the query
    connection.query(query, [auctionId], (error, results) => {
        if (error) {
            console.error("Error retrieving bids:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        // Send the retrieved bids as a JSON response
        res.status(200).json({ auction: results[0] });
    });

    // Close the database connection
    connection.end();
});

export default router;
