const Game = require("../models/Game");

exports.gameStart = async (req, res) => {
  const randomNumbers = generateUniqueRandomNumbers();
  const game = new Game({ playerId: req.user._id, randomNumbers });

  try {
    const savedGame = await game.save();
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

    if (killed === 4) {
      game.status = "completed";
    }

    await game.save();
    res.json({ killed, injured, status: game.status, moves: game.moves });
  } catch (error) {
    res.status(500).json({ message: "Error processing move", error });
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
