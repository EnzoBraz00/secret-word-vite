import { useState, useRef } from "react";
import "./Game.css";

const Game = ({
  verifyLetter,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  const [letter, setLetter] = useState("");
  const letterInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    setLetter("");
    letterInputRef.current.focus();
  };

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const handleVirtualKey = (ch) => {
    verifyLetter(ch);
    setLetter("");
    letterInputRef.current?.focus();
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação:</span> {score}
      </p>

      <h1>Advinhe a palavra:</h1>

      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>

      <p>Você ainda tem {guesses} tentativa(s).</p>

      <div className="wordContainer">
        {letters.map((letterItem, i) =>
          guessedLetters.includes(letterItem) ? (
            <span className="letter" key={i}>
              {letterItem}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>

      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            onChange={(e) => setLetter(e.target.value)}
            required
            value={letter}
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div>

      <div className="letterContainer" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {alphabet.map((ch) => {
            const used = guessedLetters.includes(ch) || wrongLetters.includes(ch);
            return (
              <button
                key={ch}
                type="button"
                onClick={() => handleVirtualKey(ch)}
                disabled={used}
                style={{ width: 32, height: 32, textTransform: "uppercase" }}
              >
                {ch}
              </button>
            );
          })}
        </div>
      </div>

      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        {wrongLetters.map((wrongLetter, i) => (
          <span key={i}>{wrongLetter}{i < wrongLetters.length - 1 ? ", " : ""}</span>
        ))}
      </div>
    </div>
  );
};

export default Game;
