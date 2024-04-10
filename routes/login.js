import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Route to handle user login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Connect to the database
  const connection = connectToDatabase();

  // Query to retrieve user information based on the provided username
  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], (error, results, fields) => {
    if (error) {
      console.error("Error retrieving user information:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if a user with the provided username exists
    if (results.length === 0) {
      return res.status(401).json({ error: "Wrong username or password" });
    }

    // Retrieve user information
    const user = results[0];
    if (password == user.password) {
      // Store the user ID in the session
      req.session.userId = user.user_id;
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  });

  // Close the database connection
  connection.end();
});

export default router;
