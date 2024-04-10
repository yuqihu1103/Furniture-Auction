// Import required modules
import express from "express";
import { connectToDatabase } from "../db/db.js"; // Adjust the path as per your project structure

const router = express.Router();

// Register Route
router.post("/register", (req, res) => {
  // Extract data from the request body
  const { username, password, phone, admin } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const connection = connectToDatabase();

  // Check if the username already exists
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error checking username:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // If username already exists, return an error
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Begin transaction
      connection.beginTransaction((err) => {
        if (err) {
          console.error("Error beginning transaction:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Insert user into the users table
        const userQuery =
          "INSERT INTO users (username, password, phone) VALUES (?, ?, ?)";
        connection.query(
          userQuery,
          [username, password, phone],
          (error, results, fields) => {
            if (error) {
              console.error("Error creating user:", error);
              connection.rollback(() => {
                res.status(500).json({ error: "Internal server error" });
              });
            }

            // Get the user ID of the inserted user
            const userId = results.insertId;

            if (admin == "Admin") {
              const adminQuery = "INSERT INTO admins (user_id) VALUES (?)";
              connection.query(adminQuery, [userId], (err, results) => {
                if (err) {
                  console.error("Error creating admin:", err);
                  connection.rollback(() => {
                    res.status(500).json({ error: "Internal server error" });
                  });
                }
                connection.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    connection.rollback(() => {
                      res.status(500).json({ error: "Internal server error" });
                    });
                  }

                  // Transaction successful
                  res
                    .status(200)
                    .json({ message: "Admin user registered successfully" });
                });
              });
            } else {
              // Insert user as both bidder and seller
              const bidderQuery = "INSERT INTO bidder (user_id) VALUES (?)";
              const sellerQuery = "INSERT INTO seller (user_id) VALUES (?)";
              connection.query(bidderQuery, [userId], (err, results) => {
                if (err) {
                  console.error("Error creating bidder:", err);
                  connection.rollback(() => {
                    res.status(500).json({ error: "Internal server error" });
                  });
                }
                connection.query(sellerQuery, [userId], (err, results) => {
                  if (err) {
                    console.error("Error creating seller:", err);
                    connection.rollback(() => {
                      res.status(500).json({ error: "Internal server error" });
                    });
                  }

                  // Commit transaction
                  connection.commit((err) => {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      connection.rollback(() => {
                        res
                          .status(500)
                          .json({ error: "Internal server error" });
                      });
                    }

                    // Transaction successful
                    res
                      .status(200)
                      .json({ message: "User registered successfully" });
                  });
                });
              });
            }
          }
        );
      });
    }
  );
});

export default router;
