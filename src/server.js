const dotenv = require("dotenv");
const express = require("express");
require("colors");
const morgan = require("morgan");
const passport = require("./config/passport");
const session = require("express-session");
const cors = require("cors");

const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

dotenv.config({ path: "./src/config/config.env" });

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://eventful-frontend.vercel.app",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: "GET,POST,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
};

app.use(cors(corsOptions));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

app.use(limiter);

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

const users = require("./routes/users");
const game = require("./routes/game");

app.get("/", (req, res) => {
  res.send("hello, welcome to GKAI");
});

app.use("/api/auth", users);
app.use("/api/game", game);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.all("*", (req, res) => {
  res.status(404).send("404 - route not found");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
