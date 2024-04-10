import express from "express";
import { connectToDatabase } from "../db/db.js"; // Import your database connection module

const router = express.Router();

// Route to get all bids in an auction
router.get("/get_bids", (req, res) => {
  const { auctionId } = req.body;

  // Connect to the database
  const connection = connectToDatabase();

  // SQL query to retrieve all bids in the specified auction with the usernames of the bidders
  const query = `
    SELECT 
        bid.bid_id,
        bid.bid_price,
        bid.bid_time,
        bid.bidder_id,
        users.username
    FROM 
        bid
    INNER JOIN 
        users ON bid.bidder_id = users.user_id
    WHERE 
        bid.auction_id = ?;
  `;

  // Execute the query
  connection.query(query, [auctionId], (error, results) => {
    if (error) {
      console.error("Error retrieving bids:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send the retrieved bids as a JSON response
    res.status(200).json({ bids: results });
  });

  // Close the database connection
  connection.end();
});

export default router;
