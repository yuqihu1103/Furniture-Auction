import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to add new furniture
router.post("/add_furniture", (req, res) => {
  const { type, description, picture_urls, condition } = req.body;

  // Get the user ID from the session (assuming it's stored as req.session.userId)
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const connection = connectToDatabase();

  // Query the seller table to get the seller_id based on the user_id
  const query = "SELECT seller_id FROM seller WHERE user_id = ?";
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving seller ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Seller not found for user" });
    }

    const sellerId = results[0].seller_id;

    // Insert new furniture record into the database
    const insertQuery =
      "INSERT INTO furniture (type, description, picture_urls, seller_id, `condition`) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      insertQuery,
      [type, description, picture_urls, sellerId, condition],
      (error, results) => {
        if (error) {
          console.error("Error adding new furniture:", error);
          return res.status(500).json({ error: "Error adding new furniture" });
        }

        return res
          .status(201)
          .json({ message: "Furniture added successfully" });
      }
    );
  });
});

export default router;
