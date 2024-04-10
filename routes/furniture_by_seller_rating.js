import express from "express";
import { connectToDatabase } from "../db/db.js";

const router = express.Router();

// Route to get all furniture ranked by seller's average rating
router.get("/furniture_ranked_by_rating", (req, res) => {
  // Connect to the database
  const connection = connectToDatabase();

  // SQL query to calculate average rating for each seller
  const query = `
    SELECT 
      f.furniture_id, 
      f.type, 
      f.description, 
      f.picture_urls, 
      f.seller_id, 
      f.condition,
      COALESCE(AVG(r.rate), 0) AS seller_rating
    FROM 
      furniture f
    LEFT JOIN 
      seller s ON f.seller_id = s.seller_id
    LEFT JOIN 
      rating r ON s.seller_id = r.seller_id
    GROUP BY 
      f.furniture_id, f.type, f.description, f.picture_urls, f.seller_id, f.condition
    ORDER BY 
    seller_rating DESC;
  `;

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching furniture ranked by rating:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send the results as a response
    res.status(200).json(results);
  });
});

export default router;
