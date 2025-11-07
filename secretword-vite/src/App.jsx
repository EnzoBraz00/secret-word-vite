import { useCallback, useEffect, useState } from "react";
import { fetchRandomWordPt } from "./services/wordsApi";

// components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// styles
import "./App.css";

// data
import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("easy"); // easy=5, hard=2
  const [useApi, setUseApi] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const getMaxLives = useCallback((diff) => (diff === "hard" ? 2 : 5), []);

  // Escolhe uma palavra e categoria aleatoriamente
  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * categories.length)];

    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word };
  }, [words]);

  // Inicia o jogo
  const startGame = useCallback(async (options) => {
    setIsStarting(true);
    const chosenDifficulty = options?.difficulty;
    const chosenUseApi = options?.useApi;

    if (typeof chosenUseApi === "boolean") {
      setUseApi(chosenUseApi);
    }

    const effectiveDifficulty = chosenDifficulty || difficulty;
    setDifficulty(effectiveDifficulty);
    setGuesses(getMaxLives(effectiveDifficulty));

    setGuessedLetters([]);
    setWrongLetters([]);

    let category = "";
    let word = "";
    if (chosenUseApi || (typeof chosenUseApi === "undefined" && useApi)) {
      try {
        word = await fetchRandomWordPt();
        category = "aleatório";
      } catch (_) {
        const picked = pickWordAndCategory();
        category = picked.category;
        word = picked.word;
      }
    } else {
      const picked = pickWordAndCategory();
      category = picked.category;
      word = picked.word;
    }

    let wordLetters = word.split("").map((l) => l.toLowerCase());

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
    setIsStarting(false);
  }, [pickWordAndCategory, getMaxLives, difficulty, useApi]);

  // Verifica a letra digitada
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  // Reinicia o jogo
  const retry = () => {
    setScore(0);
    setGuesses(getMaxLives(difficulty));
    setGameStage(stages[0].name);
  };

  // Condição de derrota + salvamento de highscore
  useEffect(() => {
    if (guesses === 0) {
      const currentHighScore = parseInt(localStorage.getItem("highscore")) || 0;

      if (score > currentHighScore) {
        localStorage.setItem("highscore", score);
      }

      setGuessedLetters([]);
      setWrongLetters([]);
      setGameStage(stages[2].name);
    }
  }, [guesses, score]);

  // Condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (letters.length > 0 && guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore + 100);
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} isStarting={isStarting} />}

      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}

      {gameStage === "end" && <GameOver score={score} word={pickedWord} retry={retry} />}
    </div>
  );
}

export default App;
