import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Function to get current date in MySQL format (YYYY-MM-DD)
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Route to get all ongoing auctions
router.get("/ongoing_auctions", (req, res) => {
  const connection = connectToDatabase();
  const currentDate = getCurrentDate(); // Get current date

  // Query to retrieve ongoing auctions based on current date
  const query = "SELECT * FROM auction WHERE start_date <= ? AND end_date >= ?";
  connection.query(query, [currentDate, currentDate], (error, results) => {
    if (error) {
      console.error("Error retrieving ongoing auctions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ auctions: results });
  });
});

export default router;
