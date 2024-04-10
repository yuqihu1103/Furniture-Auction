import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectToDatabase } from "./db/db.js";
import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import furnitureRouter from "./routes/furniture.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

//test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test success!" });
});

app.post("/login", loginRouter);
app.post("/register", registerRouter);
app.get("/furniture", furnitureRouter);

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectToDatabase();
console.log("Connected to MySQL database");
export default app;
