// db/db.js

import mysql from "mysql";

let connection;

// Function to connect to the MySQL database
export function connectToDatabase() {
  connection = mysql.createConnection({
    host: "localhost",
    user: "group13",
    password: "",
    database: "project",
  });

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err);
      return;
    }
  });

  // Handle unexpected errors and close the connection
  connection.on("error", (err) => {
    console.error("MySQL database connection error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connectToDatabase();
    } else {
      throw err;
    }
  });

  // Export the connection object for use in other modules
  return connection;
}
