import "./GameOver.css";

const GameOver = ({ retry, score, word }) => {
  const highScore = parseInt(localStorage.getItem("highscore")) || 0;

  return (
    <div className="gameover">
      <h2>Fim de jogo! 😵</h2>
      <p>
        Sua pontuação: <span className="highlight">{score}</span>
      </p>
      <p>
        Pontuação máxima: <span className="highlight">{highScore}</span> 👑
      </p>
      {word && (
        <p className="word-info">
          A palavra era: <span className="word">{word}</span>
        </p>
      )}
      <button onClick={retry}>Tentar Novamente 🔄</button>
    </div>
  );
};

export default GameOver;
