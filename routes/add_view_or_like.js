import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to add a view for a furniture item
router.post("/view", (req, res) => {
  const userId = req.session.userId; // Retrieve user ID from session
  const { furnitureId } = req.body;

  if (!userId || !furnitureId) {
    return res
      .status(400)
      .json({ error: "User ID and furniture ID are required" });
  }

  const connection = connectToDatabase();

  // Check if the user has already viewed the furniture item
  const checkViewQuery =
    "SELECT * FROM view_history WHERE user_id = ? AND furniture_id = ?";
  connection.query(checkViewQuery, [userId, furnitureId], (error, results) => {
    if (error) {
      console.error("Error checking view:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // If the user has already viewed the furniture item, update the view time
      const updateViewQuery =
        "UPDATE view_history SET view_time = CURRENT_TIMESTAMP() WHERE user_id = ? AND furniture_id = ?";
      connection.query(
        updateViewQuery,
        [userId, furnitureId],
        (error, results) => {
          if (error) {
            console.error("Error updating view time:", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          res.status(200).json({ message: "View time updated successfully" });
        }
      );
    } else {
      // If the user has not viewed the furniture item, insert a new view entry
      const insertViewQuery =
        "INSERT INTO view_history (user_id, furniture_id) VALUES (?, ?)";
      connection.query(
        insertViewQuery,
        [userId, furnitureId],
        (error, results) => {
          if (error) {
            console.error("Error adding view:", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          res.status(201).json({ message: "View added successfully" });
        }
      );
    }
  });
});

// Route to add a like for a furniture item
router.post("/like", (req, res) => {
  const userId = req.session.userId; // Retrieve user ID from session
  const { furnitureId } = req.body;

  if (!userId || !furnitureId) {
    return res
      .status(400)
      .json({ error: "User ID and furniture ID are required" });
  }

  const connection = connectToDatabase();

  // Check if the user has already liked the furniture item
  const checkLikeQuery =
    "SELECT * FROM `like` WHERE user_id = ? AND furniture_id = ?";
  connection.query(checkLikeQuery, [userId, furnitureId], (error, results) => {
    if (error) {
      console.error("Error checking like:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res
        .status(201)
        .json({ message: "You have already liked this furniture item" });
    } else {
      // If the user has not liked the furniture item, insert a new like entry
      const insertLikeQuery =
        "INSERT INTO `like` (user_id, furniture_id) VALUES (?, ?)";
      connection.query(
        insertLikeQuery,
        [userId, furnitureId],
        (error, results) => {
          if (error) {
            console.error("Error adding like:", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          res.status(201).json({ message: "Like added successfully" });
        }
      );
    }
  });
});

export default router;
