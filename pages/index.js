import Head from "next/head";
import { useState, useEffect } from "react";

const PLAYERS = ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"];

const STATEMENTS = [
  { text: "Polvos têm três corações.", truth: true, fact: "Dois corações bombeiam sangue para as brânquias, e um para o resto do corpo." },
  { text: "A Grande Muralha da China é visível do espaço a olho nu.", truth: false, fact: "É um mito! A muralha é estreita demais para ser vista do espaço sem equipamentos." },
  { text: "Mel nunca estraga se guardado corretamente.", truth: true, fact: "Arqueólogos já encontraram mel de 3000 anos em tumbas egípcias, ainda comestível!" },
  { text: "Os humanos usam apenas 10% do cérebro.", truth: false, fact: "Usamos praticamente todas as partes do cérebro, e a maioria está ativa quase o tempo todo." },
  { text: "Bananas são tecnicamente ervas, não frutas.", truth: true, fact: "A bananeira não tem um tronco lenhoso, logo é classificada botanicamente como erva gigante." },
  { text: "Raios nunca caem no mesmo lugar duas vezes.", truth: false, fact: "Raios caem frequentemente nos mesmos lugares — arranha-céus são atingidos dezenas de vezes por ano." },
  { text: "Golfinhos dormem com um olho aberto.", truth: true, fact: "Metade do cérebro dorme enquanto a outra fica acordada para respirar e detectar perigos." },
  { text: "Água quente pode congelar mais rápido que água fria.", truth: true, fact: "É o Efeito Mpemba! Ainda gera debate científico, mas foi observado em experimentos." },
  { text: "Um caracol pode dormir por 3 anos.", truth: true, fact: "Em períodos de seca ou frio extremo, caracóis entram em hibernação profunda por anos." },
  { text: "O cérebro humano para de se desenvolver aos 18 anos.", truth: false, fact: "O cérebro continua se desenvolvendo até os 25 anos, especialmente o córtex pré-frontal." },
  { text: "Formigas não têm pulmões.", truth: true, fact: "Elas respiram por pequenos buracos no exoesqueleto chamados espiráculos." },
  { text: "Cenouras melhoram sua visão noturna.", truth: false, fact: "É propaganda britânica da 2ª Guerra! Cenouras têm vitamina A, mas não dão supervista." },
  { text: "Polvos são daltônicos mas podem 'ver' cores pela pele.", truth: true, fact: "Pesquisadores descobriram fotorreceptores na pele dos polvos que podem detectar luz." },
  { text: "O coração humano pode bater fora do corpo.", truth: true, fact: "Ele tem seu próprio sistema elétrico e pode bater por um breve período com oxigênio suficiente." },
  { text: "Girafa é o único mamífero sem cordas vocais.", truth: false, fact: "Girafas têm cordas vocais e podem mugir, ronronar e até assobiar, apenas são bem quietas." },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [screen, setScreen] = useState("start");
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [showFact, setShowFact] = useState(false);
  const [burst, setBurst] = useState(false);

  function startGame() {
    setQuestions(shuffle(STATEMENTS).slice(0, 10));
    setQIndex(0);
    setScores(Array(4).fill(0));
    setCurrentPlayer(0);
    setAnswered(null);
    setShowFact(false);
    setBurst(false);
    setScreen("game");
  }

  function handleAnswer(choice) {
    if (answered) return;
    const q = questions[qIndex];
    const correct = (choice === "verdade") === q.truth;
    setAnswered(correct ? "correct" : "wrong");
    if (correct) {
      const ns = [...scores];
      ns[currentPlayer] += 1;
      setScores(ns);
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }
    setShowFact(true);
  }

  function nextQuestion() {
    const next = qIndex + 1;
    if (next >= questions.length) { setScreen("result"); return; }
    setQIndex(next);
    setCurrentPlayer((currentPlayer + 1) % numPlayers);
    setAnswered(null);
    setShowFact(false);
  }

  const names = playerNames.slice(0, numPlayers).map((n, i) => n.trim() || PLAYERS[i]);

  function getWinner() {
    const max = Math.max(...scores.slice(0, numPlayers));
    const winners = scores.slice(0, numPlayers).map((s, i) => s === max ? i : -1).filter(i => i >= 0);
    return { winners, max };
  }

  return (
    <>
      <Head>
        <title>Verdade ou Mito?</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&display=swap" rel="stylesheet" />
      </Head>

      <div className={`app ${burst ? "app--burst" : ""}`}>

        {/* ══ START ══ */}
        {screen === "start" && (
          <div className="screen">
            <div className="emoji-hero">🧠</div>
            <h1 className="big-title">Verdade<br /><span className="yellow">ou Mito?</span></h1>
            <p className="subtitle">Quiz de curiosidades absurdas para jogar com os amigos. Quem sabe mais?</p>
            <button className="btn btn-yellow" onClick={() => setScreen("setup")}>Jogar Agora →</button>
            <div className="chips">
              <span className="chip">10 rodadas</span>
              <span className="chip">até 4 jogadores</span>
              <span className="chip">fatos incríveis</span>
            </div>
          </div>
        )}

        {/* ══ SETUP ══ */}
        {screen === "setup" && (
          <div className="screen">
            <button className="back" onClick={() => setScreen("start")}>← voltar</button>
            <h2 className="screen-title">Quem vai jogar?</h2>
            <div className="count-row">
              {[2, 3, 4].map(n => (
                <button key={n} className={`count-btn ${numPlayers === n ? "active" : ""}`} onClick={() => setNumPlayers(n)}>
                  {n} jogadores
                </button>
              ))}
            </div>
            <div className="input-list">
              {Array.from({ length: numPlayers }, (_, i) => (
                <div key={i} className="input-row">
                  <span className="input-emoji">{["🎮","🕹️","🎯","🎲"][i]}</span>
                  <input
                    className="name-input"
                    placeholder={PLAYERS[i]}
                    value={playerNames[i]}
                    onChange={e => { const ns = [...playerNames]; ns[i] = e.target.value; setPlayerNames(ns); }}
                    maxLength={16}
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-yellow" onClick={startGame}>Começar! 🚀</button>
          </div>
        )}

        {/* ══ GAME ══ */}
        {screen === "game" && questions.length > 0 && (
          <div className="screen screen-game">
            <div className="top-bar">
              <div className="prog-wrap">
                <div className="prog-fill" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
              </div>
              <div className="top-meta">
                <span className="q-num">{qIndex + 1} / {questions.length}</span>
                <span className="turn-tag">Vez de <strong>{names[currentPlayer]}</strong></span>
              </div>
            </div>

            <div className="score-row">
              {names.map((name, i) => (
                <div key={i} className={`score-chip ${i === currentPlayer ? "score-chip-active" : ""}`}>
                  <span className="chip-name">{name}</span>
                  <span className="chip-pts">{scores[i]}</span>
                </div>
              ))}
            </div>

            <div className={`q-card ${answered === "correct" ? "q-card-ok" : answered === "wrong" ? "q-card-err" : ""}`}>
              <p className="q-text">{questions[qIndex].text}</p>
              {showFact && (
                <div className="fact">
                  <span className="fact-icon">{answered === "correct" ? "✅" : "❌"}</span>
                  <div>
                    <strong className={answered === "correct" ? "green" : "red"}>
                      {questions[qIndex].truth ? "VERDADE!" : "MITO!"}
                    </strong>
                    <p className="fact-text">{questions[qIndex].fact}</p>
                  </div>
                </div>
              )}
            </div>

            {!answered ? (
              <div className="ans-btns">
                <button className="ans-btn ans-green" onClick={() => handleAnswer("verdade")}>✅ Verdade</button>
                <button className="ans-btn ans-red" onClick={() => handleAnswer("mito")}>❌ Mito</button>
              </div>
            ) : (
              <button className="btn btn-yellow" onClick={nextQuestion}>
                {qIndex + 1 >= questions.length ? "Ver Resultado 🏆" : "Próxima →"}
              </button>
            )}
          </div>
        )}

        {/* ══ RESULT ══ */}
        {screen === "result" && (
          <div className="screen">
            <div className="emoji-hero">🏆</div>
            <h2 className="screen-title">Fim de Jogo!</h2>
            {(() => {
              const { winners, max } = getWinner();
              return <p className="winner-line">
                {winners.length > 1
                  ? `Empate entre ${winners.map(w => names[w]).join(" e ")}!`
                  : `${names[winners[0]]} venceu com ${max} ponto${max !== 1 ? "s" : ""}!`}
              </p>;
            })()}
            <div className="final-list">
              {names.map((name, i) => ({ name, score: scores[i], i }))
                .sort((a, b) => b.score - a.score)
                .map(({ name, score }, rank) => (
                  <div key={rank} className={`final-row ${rank === 0 ? "final-row-first" : ""}`}>
                    <span className="rank-icon">{["🥇","🥈","🥉","4️⃣"][rank]}</span>
                    <span className="final-name">{name}</span>
                    <span className="final-pts">{score} pts</span>
                  </div>
                ))}
            </div>
            <div className="result-btns">
              <button className="btn btn-yellow" onClick={startGame}>Jogar de Novo 🔄</button>
              <button className="btn btn-ghost" onClick={() => setScreen("start")}>Início</button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0f0e17;
          --card: #1a1828;
          --border: rgba(255,255,255,0.08);
          --yellow: #FFE566;
          --green: #6BFFB8;
          --red: #FF6B6B;
          --text: #f2f0ff;
          --muted: rgba(242,240,255,0.45);
          --f: 'Syne', sans-serif;
          --fm: 'Syne Mono', monospace;
        }
        html, body { height: 100%; }
        body { background: var(--bg); color: var(--text); font-family: var(--f); -webkit-font-smoothing: antialiased; }

        .app {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(107,181,255,0.1), transparent),
                      radial-gradient(ellipse 60% 40% at 90% 100%, rgba(107,255,184,0.07), transparent),
                      var(--bg);
          transition: background 0.2s;
        }
        .app--burst { animation: shake 0.3s ease; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }

        .screen {
          width: 100%; max-width: 500px;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
          animation: up 0.35s ease;
        }
        .screen-game { gap: 14px; }
        @keyframes up { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform:translateY(0); } }

        /* START */
        .emoji-hero { font-size: 64px; animation: bob 3s ease-in-out infinite; }
        @keyframes bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        .big-title { font-size: clamp(52px,11vw,84px); font-weight:800; line-height:0.95; text-align:center; letter-spacing:-0.03em; }
        .yellow { color: var(--yellow); }
        .green  { color: var(--green); }
        .red    { color: var(--red); }
        .subtitle { font-size:16px; color:var(--muted); text-align:center; line-height:1.6; max-width:360px; }
        .chips { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
        .chip { font-family:var(--fm); font-size:11px; letter-spacing:.06em; border:1px solid var(--border); padding:5px 12px; border-radius:20px; color:var(--muted); }

        /* SETUP */
        .screen-title { font-size:30px; font-weight:800; text-align:center; }
        .back { align-self:flex-start; font-family:var(--fm); font-size:12px; color:var(--muted); background:none; border:none; cursor:pointer; transition:color .2s; }
        .back:hover { color:var(--text); }
        .count-row { display:flex; gap:8px; }
        .count-btn { font-family:var(--f); font-weight:700; font-size:13px; padding:10px 18px; border-radius:12px; border:2px solid var(--border); background:transparent; color:var(--muted); cursor:pointer; transition:all .2s; }
        .count-btn.active { border-color:var(--yellow); color:var(--yellow); background:rgba(255,229,102,.08); }
        .input-list { width:100%; display:flex; flex-direction:column; gap:10px; }
        .input-row { display:flex; align-items:center; gap:12px; background:var(--card); border:1px solid var(--border); border-radius:14px; padding:12px 16px; }
        .input-emoji { font-size:20px; }
        .name-input { flex:1; background:none; border:none; outline:none; font-family:var(--f); font-size:16px; font-weight:700; color:var(--text); }
        .name-input::placeholder { color:var(--muted); font-weight:400; }

        /* GAME */
        .top-bar { width:100%; }
        .prog-wrap { width:100%; height:4px; background:var(--border); border-radius:4px; overflow:hidden; margin-bottom:10px; }
        .prog-fill  { height:100%; background:var(--yellow); border-radius:4px; transition:width .5s ease; }
        .top-meta   { display:flex; justify-content:space-between; align-items:center; }
        .q-num      { font-family:var(--fm); font-size:12px; color:var(--muted); }
        .turn-tag   { font-size:14px; color:var(--muted); }
        .turn-tag strong { color:var(--yellow); }

        .score-row { width:100%; display:flex; gap:8px; }
        .score-chip { flex:1; min-width:70px; display:flex; justify-content:space-between; align-items:center; background:var(--card); border:1px solid var(--border); border-radius:10px; padding:8px 12px; transition:all .3s; }
        .score-chip-active { border-color:var(--yellow); background:rgba(255,229,102,.08); }
        .chip-name { font-size:12px; font-weight:700; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:65px; }
        .score-chip-active .chip-name { color:var(--yellow); }
        .chip-pts  { font-family:var(--fm); font-size:20px; font-weight:700; }

        .q-card { width:100%; background:var(--card); border:1px solid var(--border); border-radius:20px; padding:28px; display:flex; flex-direction:column; gap:18px; transition:border-color .4s, background .4s; min-height:160px; }
        .q-card-ok  { border-color:var(--green); background:rgba(107,255,184,.06); }
        .q-card-err { border-color:var(--red);   background:rgba(255,107,107,.06); }
        .q-text { font-size:clamp(19px,4vw,25px); font-weight:700; line-height:1.3; letter-spacing:-.02em; }

        .fact { display:flex; gap:12px; align-items:flex-start; background:rgba(255,255,255,.04); border-radius:12px; padding:14px; animation:up .3s ease; }
        .fact-icon { font-size:20px; flex-shrink:0; }
        .fact strong { display:block; font-size:12px; letter-spacing:.07em; margin-bottom:5px; }
        .fact-text { font-size:13px; color:var(--muted); line-height:1.6; }

        .ans-btns { width:100%; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .ans-btn { font-family:var(--f); font-size:18px; font-weight:800; padding:20px 12px; border-radius:16px; border:2px solid transparent; cursor:pointer; transition:all .15s; }
        .ans-btn:active { transform:scale(.96); }
        .ans-green { background:rgba(107,255,184,.12); border-color:rgba(107,255,184,.3); color:var(--green); }
        .ans-green:hover { background:rgba(107,255,184,.22); border-color:var(--green); }
        .ans-red   { background:rgba(255,107,107,.12); border-color:rgba(255,107,107,.3); color:var(--red); }
        .ans-red:hover   { background:rgba(255,107,107,.22); border-color:var(--red); }

        /* RESULT */
        .winner-line { font-size:19px; font-weight:700; text-align:center; color:var(--yellow); }
        .final-list  { width:100%; display:flex; flex-direction:column; gap:8px; }
        .final-row   { display:flex; align-items:center; gap:14px; background:var(--card); border:1px solid var(--border); border-radius:14px; padding:14px 18px; }
        .final-row-first { border-color:var(--yellow); background:rgba(255,229,102,.07); }
        .rank-icon   { font-size:22px; }
        .final-name  { flex:1; font-size:17px; font-weight:700; }
        .final-pts   { font-family:var(--fm); font-size:20px; color:var(--yellow); }
        .result-btns { width:100%; display:flex; gap:10px; }
        .result-btns .btn { flex:1; }

        /* BUTTONS */
        .btn { font-family:var(--f); font-size:16px; font-weight:800; padding:15px 28px; border-radius:14px; border:none; cursor:pointer; transition:all .15s; text-align:center; width:100%; }
        .btn:active { transform:scale(.97); }
        .btn-yellow { background:var(--yellow); color:#0f0e17; }
        .btn-yellow:hover { background:#ffe033; }
        .btn-ghost  { background:var(--card); color:var(--text); border:1px solid var(--border); }
        .btn-ghost:hover { border-color:rgba(255,255,255,.2); }

        @media(max-width:400px){
          .big-title { font-size:44px; }
          .ans-btns  { grid-template-columns:1fr; }
        }
      `}</style>
    </>
  );
}
