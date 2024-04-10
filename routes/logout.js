import express from "express";

const router = express.Router();

// Logout route
router.get("/logout", (req, res) => {
  // Clear the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

export default router;
