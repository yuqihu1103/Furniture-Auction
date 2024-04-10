// db/db.js

import mysql from "mysql";

// Function to connect to the MySQL database
export function connectToDatabase() {
  const connection = mysql.createConnection({
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
    console.log("Connected to MySQL database");
  });

  // Export the connection object for use in other modules
  return connection;
}
