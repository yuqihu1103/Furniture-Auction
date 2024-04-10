import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to send a message to another user by their username
router.post("/send_message", (req, res) => {
  const { receiverUsername, content } = req.body;
  const senderId = req.session.userId; // Retrieve sender's user ID from the session

  // Check if receiver username and message content are provided
  if (!receiverUsername || !content) {
    return res
      .status(400)
      .json({ error: "Receiver username and message content are required" });
  }

  const connection = connectToDatabase();

  // Query to retrieve receiver user ID
  const query = "SELECT user_id FROM users WHERE username = ?";
  connection.query(query, [receiverUsername], (error, results) => {
    if (error) {
      console.error("Error retrieving receiver user ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length !== 1) {
      return res.status(404).json({ error: "Receiver username not found" });
    }

    const receiverId = results[0].user_id;

    // Insert the message into the database
    const insertQuery =
      "INSERT INTO message (content, sender_id, receiver_id) VALUES (?, ?, ?)";
    connection.query(insertQuery, [content, senderId, receiverId], (error) => {
      if (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(200).json({ message: "Message sent successfully" });
    });
  });
});

// Route to get chat history between the logged-in user and another user by their username
router.get("/chat_history", (req, res) => {
  const { receiverUsername } = req.body;
  const senderId = req.session.userId; // Retrieve sender's user ID from the session

  // Check if receiver username is provided
  if (!receiverUsername) {
    return res.status(400).json({ error: "Receiver username is required" });
  }

  const connection = connectToDatabase();

  // Query to retrieve receiver user ID
  const query = "SELECT user_id FROM users WHERE username = ?";
  connection.query(query, [receiverUsername], (error, results) => {
    if (error) {
      console.error("Error retrieving receiver user ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length !== 1) {
      return res.status(404).json({ error: "Receiver username not found" });
    }

    const receiverId = results[0].user_id;

    // Query to retrieve chat history between the sender and receiver
    const chatQuery =
      "SELECT * FROM message WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)";
    connection.query(
      chatQuery,
      [senderId, receiverId, receiverId, senderId],
      (error, results) => {
        if (error) {
          console.error("Error retrieving chat history:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(200).json(results);
      }
    );
  });
});

export default router;
