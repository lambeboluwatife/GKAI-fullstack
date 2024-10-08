const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./src/config/config.env" });

exports.generateToken = async (req, res) => {
  jwt.sign(
    { user: req.user },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Token generation failed",
        });
      }

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    }
  );
};

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    if (bearer.length === 2) {
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "Malformed token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing Authorization header",
    });
  }
};
