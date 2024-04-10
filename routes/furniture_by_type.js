// Import required modules
import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to get all furniture details ranked by likes from highest to lowest
router.get("/furniture_type", (req, res) => {
  // Connect to the database
  const connection = connectToDatabase();
  const { type } = req.body;

  // Query to retrieve all furniture details ranked by likes
  const query = `
    SELECT * FROM furniture
    WHERE type = "${type}";
  `;

  // Execute the query
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error retrieving furniture details:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send the retrieved furniture details ranked by likes as JSON response
    res.status(200).json(results);
  });

  // Close the database connection
  connection.end();
});

export default router;
