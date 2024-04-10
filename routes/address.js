import express from "express";
import { connectToDatabase } from "../db/db.js";

const router = express.Router();

// Route to add an address for a user
router.post("/add_address", (req, res) => {
  const userId = req.session.userId;
  const { description, isPrimary } = req.body;

  // Check if userId, description, and isPrimary are provided
  if (!userId) {
    return res.status(400).json({ error: "login first" });
  }
  if (!description || !isPrimary) {
    return res
      .status(400)
      .json({ error: "description and isPrimary are required" });
  }

  // Connect to the database
  const connection = connectToDatabase();

  // Insert the address into the address table
  const insertAddressQuery = `
    INSERT INTO address (description, user_id, is_primary) 
    VALUES (?, ?, ?)
  `;
  connection.query(
    insertAddressQuery,
    [description, userId, isPrimary],
    (error, results) => {
      if (error) {
        console.error("Error adding address:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.status(200).json({ message: "Address added successfully" });
    }
  );
});

export default router;
