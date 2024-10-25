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
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing token",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = decoded.user;
    next();
  });
};
