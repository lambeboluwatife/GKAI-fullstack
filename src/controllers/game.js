const Game = require("../models/Game");
const User = require("../models/User");

const { ObjectId } = require("mongodb");

exports.gameStart = async (req, res) => {
  const { difficulty, gameType } = req.body;
  const randomNumbers = generateUniqueRandomNumbers();
  const game = new Game({
    playerId: req.user._id,
    randomNumbers,
    difficulty,
    gameType,
  });

  try {
    const savedGame = await game.save();
    const user = await User.findById(req.user._id);

    const newGame = {
      gameId: savedGame._id,
      difficulty: savedGame.difficulty,
      gameType: savedGame.gameType,
      endResult: savedGame.endResult,
      status: savedGame.status,
    };

    user.gamesInitiated.push(newGame);
    await user.save();

    res
      .status(201)
      .json({ gameId: savedGame._id, message: "Game started successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error starting game", error });
  }
};

exports.gameMove = async (req, res) => {
  const { gameId } = req.params;
  const { guess } = req.body;

  try {
    const game = await Game.findById(gameId);
    const user = await User.findOne({
      _id: req.user._id,
      "gamesInitiated.gameId": new ObjectId(gameId),
    });

    if (!game) {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    if (game.status === "completed") {
      return res.status(400).json({ message: "Game already completed" });
    }

    const { killed, injured } = calculateKilledAndInjured(
      game.randomNumbers,
      guess
    );

    game.moves.push({ guess, killed, injured });
    game.lastUpdated = new Date();

    if (
      (game.difficulty === "normal" && game.moves.length === 15) ||
      (game.difficulty === "hard" && game.moves.length === 10) ||
      (game.difficulty === "bossman" && game.moves.length === 7)
    ) {
      game.endResult = "lost";
      game.status = "completed";
    } else if (killed === 4) {
      game.endResult = "won";
      game.status = "completed";
    }

    await game.save();

    if (game.status === "completed") {
      await User.updateOne(
        { _id: req.user._id, "gamesInitiated.gameId": new ObjectId(gameId) },
        {
          $set: {
            "gamesInitiated.$.endResult": game.endResult,
            "gamesInitiated.$.status": game.status,
          },
        }
      );
    }

    res.json({ killed, injured, status: game.status, moves: game.moves });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error processing move", error });
  }
};

exports.getOngoingGame = async (req, res) => {
  try {
    const games = await Game.find({
      status: "in-progress",
      playerId: req.user._id,
    });

    if (!games) {
      return res.status(200).json({ message: "No ongoing game(s)" });
    }

    return res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching game",
      error,
    });
  }
};

exports.resumeGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.status === "completed") {
      return res.status(400).json({ message: "Game already completed" });
    }

    res.json({ game });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving game", error });
  }
};

function calculateKilledAndInjured(randomNumbers, guess) {
  let killed = 0,
    injured = 0;

  for (let i = 0; i < 4; i++) {
    if (guess[i] === randomNumbers[i]) {
      killed++;
    } else if (randomNumbers.includes(guess[i])) {
      injured++;
    }
  }
  return { killed, injured };
}

function generateUniqueRandomNumbers() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return Array.from(
    { length: 4 },
    () => items.splice(Math.floor(Math.random() * items.length), 1)[0]
  );
}
