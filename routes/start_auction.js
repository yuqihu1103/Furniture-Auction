import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to start an auction on furniture listed by the logged-in user
router.post("/start_auction", (req, res) => {
  let { furnitureId, startPrice } = req.body;
  const userId = req.session.userId; // Retrieve seller's user ID from the session
  // Check if furniture ID is provided
  if (!furnitureId) {
    return res.status(400).json({ error: "Furniture ID is required" });
  }

  if (!startPrice) {
    startPrice = 0;
  }

  const connection = connectToDatabase();

  // Check if the furniture is already auctioned
  const checkAuctionQuery = "SELECT * FROM auction WHERE furniture_id = ?";
  connection.query(checkAuctionQuery, [furnitureId], (error, results) => {
    if (error) {
      console.error("Error checking existing auction:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Furniture is already auctioned" });
    }

    // get seller id first
    const sellerIdQuery = `
    SELECT seller_id
    FROM seller
    WHERE user_id = ? `;
    connection.query(sellerIdQuery, [userId],  (error, results) => {
      if (error) {
        console.error("Error retrieving users:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      const sellerId = results[0].seller_id;
      // Start a new auction
      const startDate = new Date(); // Current date
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 3); // Set end date to 3 days after start date

      const startAuctionQuery =
          "INSERT INTO auction (start_date, end_date, start_price, seller_id, furniture_id, status, max_bid_price) VALUES (?, ?, ?, ?, ?, ?, ?)";
      connection.query(
          startAuctionQuery,
          [
            startDate,
            endDate,
            startPrice,
            sellerId,
            furnitureId,
            "pending",
            startPrice,
          ],
          (error, results) => {
            if (error) {
              console.error("Error starting auction:", error);
              return res.status(500).json({ error: sellerId });
            }

            res.status(200).json({ message: "Auction started successfully" });
          }
      );
    });
  });
});

export default router;
