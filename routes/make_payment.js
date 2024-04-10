import express from "express";
import { connectToDatabase } from "../db/db.js";

const router = express.Router();

// Route to make a payment for a won auction
router.post("/make_payment", (req, res) => {
  const userId = req.session.userId;
  const { auctionId, sender_account, receiver_account, amount, is_by_check } =
    req.body;
  const paymentDetails = {
    sender_account,
    receiver_account,
    amount,
    is_by_check,
  };
  // Check if userId, auctionId, and paymentDetails are provided
  if (!userId) {
    return res.status(400).json({ error: "Login first" });
  }
  if (!auctionId || !paymentDetails) {
    return res
      .status(400)
      .json({ error: "AuctionId and paymentDetails are required" });
  }

  // Connect to the database
  const connection = connectToDatabase();

  // Query to check if the user has won the auction
  const checkWinningBidQuery =
    "SELECT * FROM auction WHERE auction_id = ? AND winning_bid IN (SELECT bid_id FROM bid WHERE bidder_id = ?)";
  connection.query(
    checkWinningBidQuery,
    [auctionId, userId],
    (error, results) => {
      if (error) {
        console.error("Error checking winning bid:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Auction not found or user did not win the auction" });
      }

      const auction = results[0];

      // Insert payment details into the payment table
      const insertPaymentQuery =
        "INSERT INTO payment (sender_account, payment_time, auction_id, amount, receiver_account, is_by_check) VALUES (?, ?, ?, ?, ?, ?)";
      const { sender_account, receiver_account, amount, is_by_check } =
        paymentDetails;
      connection.query(
        insertPaymentQuery,
        [
          sender_account,
          new Date(),
          auctionId,
          amount,
          receiver_account,
          is_by_check,
        ],
        (error, results) => {
          if (error) {
            console.error("Error making payment:", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          return res.status(200).json({ message: "Payment made successfully" });
        }
      );
    }
  );
});

export default router;
