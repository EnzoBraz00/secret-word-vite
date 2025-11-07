function sanitizePtWord(raw) {
  if (!raw || typeof raw !== "string") return "";
  const lower = raw.toLowerCase();
  const noAccents = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const onlyLetters = noAccents.replace(/[^a-z]/g, "");
  return onlyLetters;
}

export async function fetchRandomWordPt() {
  let lastError;

  // Dicionário Aberto
  try {
    const res = await fetch("https://api.dicionario-aberto.net/random");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    let candidate = "";
    if (typeof data === "string") candidate = data;
    else if (Array.isArray(data)) {
      const obj = data[0] || {};
      candidate = obj.word || obj.entry || obj.term || obj.key || "";
    } else if (data && typeof data === "object") {
      candidate = data.word || data.entry || data.term || data.key || "";
    }
    const word = sanitizePtWord(candidate);
    if (word && word.length >= 3) return word;
  } catch (e) {
    lastError = e;
  }

  const fallbacks = [
    "https://random-word-api.herokuapp.com/word?number=1",
    "https://random-word-api.vercel.app/api?words=1",
  ];
  for (const url of fallbacks) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const candidate = Array.isArray(data) ? data[0] : (data?.[0] || data?.word || "");
      const word = sanitizePtWord(candidate);
      if (word && word.length >= 3) return word;
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error("Falha ao obter palavra da API");
}


