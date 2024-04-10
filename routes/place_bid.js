import express from "express";
import { connectToDatabase } from "../db/db.js";

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const router = express.Router();

// Route to place a bid on an ongoing auction
router.post("/place_bid", (req, res) => {
  const userId = req.session.userId;
  const { auctionId, bidPrice } = req.body;

  // Check if userId, auctionId, and bidPrice are provided
  if (!userId) {
    return res.status(400).json({ error: "login first" });
  }
  if (!auctionId || !bidPrice) {
    return res
      .status(400)
      .json({ error: "auctionId, and bidPrice are required" });
  }

  // Connect to the database
  const connection = connectToDatabase();
  // Query to get the bidder_id associated with the user_id
  const bidderQuery = "SELECT bidder_id FROM bidder WHERE user_id = ?";
  connection.query(bidderQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving bidder_id:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Bidder not found for this user" });
    }

    const bidder_id = results[0].bidder_id;
    // Check if the auction is ongoing
    const currentDate = getCurrentDate();
    const query =
      "SELECT * FROM auction WHERE auction_id = ? AND start_date <= ? AND end_date >= ?";
    connection.query(
      query,
      [auctionId, currentDate, currentDate],
      (error, results) => {
        if (error) {
          console.error("Error checking auction status:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Auction not found or not ongoing" });
        }

        const auction = results[0];

        // Check if the auction is not started by the user
        if (auction.seller_id === userId) {
          return res
            .status(403)
            .json({ error: "Cannot place bid on auction started by self" });
        }

        // Check if bid price is higher than current max bid price
        if (bidPrice <= auction.max_bid_price) {
          return res.status(400).json({
            error: "Bid price must be higher than current max bid price",
          });
        }

        // Insert the bid into the bid table
        const insertBidQuery =
          "INSERT INTO bid (bid_price, bidder_id, auction_id) VALUES (?, ?, ?)";
        connection.query(
          insertBidQuery,
          [bidPrice, bidder_id, auctionId],
          (error, results) => {
            if (error) {
              console.error("Error placing bid:", error);
              return res.status(500).json({ error: "Internal server error" });
            }

            const insertedBidId = results.insertId; // Get the last inserted ID

            // Update the maximum bid price
            const updateMaxBidPriceQuery =
              "UPDATE auction SET max_bid_price = ? WHERE auction_id = ?";
            connection.query(
              updateMaxBidPriceQuery,
              [bidPrice, auctionId],
              (error, results) => {
                if (error) {
                  console.error("Error updating max bid price:", error);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                // Update the winning bid if necessary
                if (!auction.winning_bid || bidPrice > auction.max_bid_price) {
                  const updateWinningBidQuery =
                    "UPDATE auction SET winning_bid = ? WHERE auction_id = ?";
                  connection.query(
                    updateWinningBidQuery,
                    [insertedBidId, auctionId], // Use the correct insertedBidId
                    (error, results) => {
                      if (error) {
                        console.error("Error updating winning bid:", error);
                        return res
                          .status(500)
                          .json({ error: "Internal server error" });
                      }
                    }
                  );
                }

                return res
                  .status(200)
                  .json({ message: "Bid placed successfully" });
              }
            );
          }
        );
      }
    );
  });
});

export default router;
