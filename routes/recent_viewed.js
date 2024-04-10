import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to get all furniture viewed by a user, ranked by time
router.get("/viewed", (req, res) => {
  // Get the user ID from the session (assuming it's stored as req.session.userId)
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const connection = connectToDatabase();

  // Query to retrieve all furniture viewed by the user, ranked by time
  const query = `
    SELECT f.*
    FROM furniture f
    JOIN view_history vh ON f.furniture_id = vh.furniture_id
    WHERE vh.user_id = ?
    ORDER BY vh.view_time DESC
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving viewed furniture:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send the retrieved furniture items back to the client
    res.status(200).json({ results });
  });
});

export default router;
