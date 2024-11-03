const express = require("express");
const router = express.Router();

const {
  gameStart,
  gameMove,
  resumeGame,
  getOngoingGame,
} = require("../controllers/game");
const { verifyToken } = require("../middlewares/jwt");

router.route("/start").post(verifyToken, gameStart);
router.route("/ongoing-game").get(verifyToken, getOngoingGame);
router.route("/:gameId/move").post(verifyToken, gameMove);
router.route("/:gameId/resume").get(verifyToken, resumeGame);

module.exports = router;
