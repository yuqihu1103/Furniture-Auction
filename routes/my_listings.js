import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to get all furniture listed by the current user
router.get("/my_listing", (req, res) => {
  const userId = req.session.userId; // Retrieve user ID from session

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const connection = connectToDatabase();

  // Query to retrieve the seller ID based on the user ID
  const sellerQuery = "SELECT seller_id FROM seller WHERE user_id = ?";
  connection.query(sellerQuery, [userId], (sellerError, sellerResults) => {
    if (sellerError) {
      console.error("Error retrieving seller ID:", sellerError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (sellerResults.length === 0) {
      return res.status(404).json({ error: "User is not a seller" });
    }

    const sellerId = sellerResults[0].seller_id;

    // Query to retrieve all furniture listed by the current user (seller)
    const furnitureQuery = "SELECT * FROM furniture WHERE seller_id = ?";
    connection.query(
      furnitureQuery,
      [sellerId],
      (furnitureError, furnitureResults) => {
        if (furnitureError) {
          console.error("Error retrieving furniture:", furnitureError);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(200).json(furnitureResults);
      }
    );
  });
});

export default router;
