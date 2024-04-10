import express from "express";
import { connectToDatabase } from "../db/db.js";

const router = express.Router();

// Route to rate a seller after winning an auction
router.post("/rate", (req, res) => {
  const userId = req.session.userId;
  const { auctionId, rating } = req.body;

  // Check if userId, auctionId, and rating are provided
  if (!userId) {
    return res.status(400).json({ error: "Login first" });
  }
  if (!auctionId || !rating) {
    return res.status(400).json({ error: "AuctionId and rating are required" });
  }

  // Connect to the database
  const connection = connectToDatabase();

  // Query to retrieve the bidder ID associated with the user ID
  const getBidderIdQuery = "SELECT bidder_id FROM bidder WHERE user_id = ?";
  connection.query(getBidderIdQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving bidder ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Bidder not found for this user" });
    }

    const bidderId = results[0].bidder_id;

    // Query to check if the user has won the auction
    const checkWinningBidQuery =
      "SELECT * FROM auction WHERE auction_id = ? AND winning_bid IN (SELECT bid_id FROM bid WHERE bidder_id = ?)";
    connection.query(
      checkWinningBidQuery,
      [auctionId, bidderId],
      (error, results) => {
        if (error) {
          console.error("Error checking winning bid:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({
            error: "Auction not found or user did not win the auction",
          });
        }

        // Get the seller ID associated with the auction
        const sellerId = results[0].seller_id;

        // Insert the rating into the rating table
        const insertRatingQuery =
          "INSERT INTO rating (bidder_id, seller_id, auction_id, rate) VALUES (?, ?, ?, ?)";
        connection.query(
          insertRatingQuery,
          [bidderId, sellerId, auctionId, rating],
          (error, results) => {
            if (error) {
              console.error("Error rating seller:", error);
              return res.status(500).json({ error: "Internal server error" });
            }

            return res
              .status(200)
              .json({ message: "Seller rated successfully" });
          }
        );
      }
    );
  });
});

export default router;
