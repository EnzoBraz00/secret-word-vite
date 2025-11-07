import "./StartScreen.css";

const StartScreen = ({ startGame, isStarting }) => {
  const handleStart = (e) => {
    const form = e.currentTarget.closest(".start");
    const difficulty = form?.querySelector("select[name=difficulty]")?.value || "easy";
    const useApi = !!form?.querySelector("input[name=apiMode]")?.checked;
    startGame({ difficulty, useApi });
  };

  return (
    <div className="start">
      Secret Word 🤫 Clique no botão abaixo para começar a jogar 👇
      <div style={{ margin: "12px 0" }}>
        <label htmlFor="difficulty" style={{ marginRight: 8 }}>Dificuldade:</label>
        <select id="difficulty" name="difficulty" defaultValue="easy" disabled={isStarting}>
          <option value="easy">Fácil (5 vidas)</option>
          <option value="hard">Difícil (2 vidas)</option>
        </select>
      </div>
      <div style={{ margin: "8px 0 16px" }}>
        <label>
          <input type="checkbox" name="apiMode" disabled={isStarting} /> Palavras infinitas (API)
        </label>
      </div>
      <button onClick={handleStart} disabled={isStarting}>
        {isStarting ? "Carregando..." : "Começar jogo"}
      </button>{" "}
    </div>
  );
};
export default StartScreen;
