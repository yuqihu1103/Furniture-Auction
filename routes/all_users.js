import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to get a list of all users
router.get("/users", (req, res) => {
  const connection = connectToDatabase();

  // Query to retrieve all users
  const query = "SELECT * FROM users";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json(results);
  });
});

export default router;
