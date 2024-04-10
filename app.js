import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectToDatabase } from "./db/db.js";
import loginRouter from "./routes/login.js";
import logoutRouter from "./routes/logout.js";
import registerRouter from "./routes/register.js";
import furnitureRouter from "./routes/all_furniture.js";
import addFurnitureRouter from "./routes/add_furniture.js";
import furnitureByLikesRouter from "./routes/furniture_by_likes.js";
import furnitureByTypeRouter from "./routes/furniture_by_type.js";
import viewedRouter from "./routes/recent_viewed.js";
import viewAndLikeRouter from "./routes/add_view_or_like.js";
import myListingRouter from "./routes/my_listings.js";
import allUserRouter from "./routes/all_users.js";
import chatRouter from "./routes/chat.js";
import startAuctionRouter from "./routes/start_auction.js";
import ongoingAuctionsRouter from "./routes/ongoing_auctions.js";
import placeBidRouter from "./routes/place_bid.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

//test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test success!" });
});

//logs the user in
//need username and password
app.post("/login", loginRouter);

//logs the current user out
//no request body
app.get("/logout", logoutRouter);

//register new user
//need username and password (phone optional)
app.post("/register", registerRouter);

//record a user's view on a furniture
//need the furnitureID
app.post("/view", viewAndLikeRouter);

//record a user's like on a furniture
//need the furnitureID
app.post("/like", viewAndLikeRouter);

//get all of user's viewed furniture, ordered by view time
//no request body
app.get("/viewed", viewedRouter);

//get all furniture
//no request body
app.get("/furniture", furnitureRouter);

//add a new furniture
//need type, description, picture_urls, condition
app.post("/add_furniture", addFurnitureRouter);

//get all furniture, ranked by likes
//no request body
app.get("/furniture_likes", furnitureByLikesRouter);

//get all furniture of a certain type
//need type (such as "desk")
app.get("/furniture_type", furnitureByTypeRouter);

//get all furniture listed by current user
//no request body
app.get("/my_listing", myListingRouter);

//get all users (for chat)
//no request body
app.get("/users", allUserRouter);

//sends a message from current user to another
//need receiverUsername and content
app.post("/send_message", chatRouter);

//gets all messages betwwen current user and another
//need receiverUsername
app.get("/chat_history", chatRouter);

//starts an auction for a furniture listed by current user
//need furnitureID, startPrice
app.post("/start_auction", startAuctionRouter);

//gets info of all ongoing auctions
//no request body
app.get("/ongoing_auctions", ongoingAuctionsRouter);

//places a bid for an ongoing auction
//need auctionID and bidPrice
app.post("/place_bid", placeBidRouter);

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectToDatabase();
console.log("Connected to MySQL database");
export default app;
