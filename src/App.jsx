import {
  Activity,
  BadgeDollarSign,
  Eye,
  Flame,
  HeartPulse,
  History,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  bossMoveLibrary,
  cardLibrary,
  itemLibrary,
  moveLibrary,
  resultLabels,
  weatherLibrary
} from "./gameData.js";
import {
  canSeeBossPlannedCard,
  chooseItem,
  createInitialState,
  getLegalPlayerCards,
  getPredictedBossCard,
  getVisibleBossCards,
  playRound,
  resetBattle,
  setRevealCount,
  setWeather,
  toggleCardInDeck,
  toggleItem,
  toggleMove
} from "./simulator.js";

export function App() {
  const [game, setGame] = useState(() => createInitialState());
  const legalCards = useMemo(() => getLegalPlayerCards(game), [game]);
  const legalKeys = new Set(legalCards.map((card) => card.key));
  const visibleBossCards = getVisibleBossCards(game);
  const predictedBossCard = getPredictedBossCard(game);
  const plannedCardVisible = canSeeBossPlannedCard(game);
  const plannedVisibleCard = visibleBossCards.find((card) => card.willPlay);
  const playerPatternText = game.playerPattern.map((entry) => resultLabels[entry]).join(" ");
  const bossPatternText = game.bossPattern.map((entry) => resultLabels[entry]).join(" ");

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">King Cards 新版玩法验证</p>
          <h1>Boss 血条 + 招式序列模拟器</h1>
        </div>
        <button className="iconButton primary" onClick={() => setGame((state) => resetBattle(state))}>
          <RotateCcw size={18} />
          重开本场
        </button>
      </header>

      <section className="statusBand">
        <StatCard icon={<HeartPulse />} label="玩家生命" value={`${game.playerHp}/${game.playerMaxHp}`} danger={game.playerHp <= 6} />
        <StatCard icon={<ShieldAlert />} label="Boss 生命" value={`${game.bossHp}/${game.bossMaxHp}`} danger={game.bossHp <= 8} />
        <StatCard icon={<Activity />} label="当前回合" value={game.round} />
        <StatCard icon={<Flame />} label="天气" value={weatherLibrary.find((w) => w.id === game.weather)?.name ?? game.weather} />
        <StatCard icon={<Sparkles />} label="崩溃层数" value={`我 ${game.playerCollapseStacks} / Boss ${game.bossCollapseStacks}`} />
      </section>

      {game.winner && (
        <section className={`resultBanner ${game.winner === "player" ? "win" : "loss"}`}>
          {game.winner === "player" ? "玩家胜利：Boss 已被击败" : "战斗失败：玩家已倒下"}
        </section>
      )}

      <div className="workspace">
        <section className="panel battlePanel">
          <div className="panelTitle">
            <Swords size={18} />
            <h2>出牌区</h2>
          </div>

          <div className="duelGrid">
            <div>
              <h3>我的手牌</h3>
              <div className="cardGrid">
                {game.playerHand.map((card) => (
                  <button
                    key={card.key}
                    className={`playCard ${legalKeys.has(card.key) ? "" : "disabled"}`}
                    disabled={!legalKeys.has(card.key) || Boolean(game.winner)}
                    onClick={() => setGame((state) => playRound(state, card.key))}
                    title={card.note}
                  >
                    <span className="cardType">{card.type}</span>
                    <strong>{card.name}</strong>
                    <span className="level">Lv {card.level}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="sectionHeader">
                <h3>Boss 透视牌</h3>
                <label className="revealControl">
                  <span>透视 {game.revealCount} 张</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={game.revealCount}
                    onChange={(event) => setGame((state) => setRevealCount(state, event.target.value))}
                  />
                </label>
              </div>
              <div className="bossPeek">
                {visibleBossCards.map((card) => (
                  <div className={`miniCard ${card.willPlay ? "willPlay" : ""}`} key={card.key}>
                    <span>
                      <strong>{card.name}</strong>
                      <small>{statusText(card.status)}</small>
                    </span>
                    <em>Lv {card.level}</em>
                  </div>
                ))}
                {game.revealCount === 0 && (
                  <div className="miniCard faceDown">当前没有透视任何 Boss 手牌</div>
                )}
              </div>
              <div className={plannedCardVisible ? "peekResult" : "peekResult unknown"}>
                <Eye size={16} />
                {plannedCardVisible
                  ? `本回合已知：Boss 将出【${plannedVisibleCard?.name}】`
                  : "本回合未知：Boss 要出的牌不在透视范围内"}
              </div>
              {predictedBossCard && (
                <div className="peekResult">
                  <Eye size={16} />
                  预见牌：Boss 倾向出【{predictedBossCard.name}】
                </div>
              )}
            </div>
          </div>

          <div className="battleInfo">
            <InfoPill label="玩家弃牌" value={game.playerDiscard.length} />
            <InfoPill label="Boss 弃牌" value={game.bossDiscard.length} />
            <InfoPill label="玩家序列" value={playerPatternText || "无"} />
            <InfoPill label="Boss 序列" value={bossPatternText || "无"} />
          </div>
        </section>

        <section className="panel">
          <div className="panelTitle">
            <Sparkles size={18} />
            <h2>招式</h2>
          </div>
          <h3>玩家携带</h3>
          <div className="moveList">
            {moveLibrary.map((move) => (
              <ToggleRow
                key={move.id}
                active={game.selectedMoves.includes(move.id)}
                title={move.name}
                meta={`${move.pattern.map((p) => resultLabels[p]).join(" ")} / ${move.damage} 伤害`}
                note={move.note}
                onClick={() => setGame((state) => toggleMove(state, move.id, "player"))}
              />
            ))}
          </div>
          <h3>Boss 携带</h3>
          <div className="moveList">
            {bossMoveLibrary.map((move) => (
              <ToggleRow
                key={move.id}
                active={game.selectedBossMoves.includes(move.id)}
                title={move.name}
                meta={`${move.pattern.map((p) => resultLabels[p]).join(" ")} / ${move.damage} 伤害`}
                note={move.note}
                onClick={() => setGame((state) => toggleMove(state, move.id, "boss"))}
              />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelTitle">
            <BadgeDollarSign size={18} />
            <h2>道具与天气</h2>
          </div>
          <h3>天气</h3>
          <div className="segmented">
            {weatherLibrary.map((weather) => (
              <button
                key={weather.id}
                className={game.weather === weather.id ? "active" : ""}
                onClick={() => setGame((state) => setWeather(state, weather.id))}
                title={weather.note}
              >
                {weather.name}
              </button>
            ))}
          </div>

          <h3>一次性道具牌</h3>
          <div className="itemList">
            {itemLibrary.map((item) => {
              const owned = game.ownedItems.includes(item.id);
              const armed = game.activeItemId === item.id;
              return (
                <div className={`itemRow ${owned ? "" : "muted"}`} key={item.id}>
                  <button className={owned ? "toggle active" : "toggle"} onClick={() => setGame((state) => toggleItem(state, item.id))}>
                    {owned ? "已买" : "未买"}
                  </button>
                  <button
                    className={`armButton ${armed ? "armed" : ""}`}
                    disabled={!owned || Boolean(game.winner)}
                    onClick={() => setGame((state) => chooseItem(state, item.id))}
                  >
                    {armed ? "本回合使用" : "准备使用"}
                  </button>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.price}$ / {item.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel deckPanel">
          <div className="panelTitle">
            <Swords size={18} />
            <h2>卡组开关</h2>
          </div>
          <div className="deckColumns">
            <DeckToggles
              title="玩家卡组"
              cards={game.playerHand.concat(game.playerDiscard)}
              onToggle={(id) => setGame((state) => toggleCardInDeck(state, "player", id))}
            />
            <DeckToggles
              title="Boss 卡组"
              cards={game.bossHand.concat(game.bossDiscard)}
              onToggle={(id) => setGame((state) => toggleCardInDeck(state, "boss", id))}
            />
          </div>
        </section>

        <section className="panel logPanel">
          <div className="panelTitle">
            <History size={18} />
            <h2>战斗日志</h2>
          </div>
          <div className="logs">
            {game.logs.map((log) => (
              <p key={log.id} className={`log ${log.tone}`}>
                {log.text}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, danger = false }) {
  return (
    <div className={`statCard ${danger ? "danger" : ""}`}>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="infoPill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ToggleRow({ active, title, meta, note, onClick }) {
  return (
    <button className={`toggleRow ${active ? "active" : ""}`} onClick={onClick} title={note}>
      <span>
        <strong>{title}</strong>
        <small>{note}</small>
      </span>
      <em>{meta}</em>
    </button>
  );
}

function DeckToggles({ title, cards, onToggle }) {
  const ownedIds = new Set(cards.map((card) => card.id));
  return (
    <div>
      <h3>{title}（{cards.length}/10）</h3>
      <div className="libraryGrid">
        {cardLibrary.map((card) => (
          <button
            key={card.id}
            className={ownedIds.has(card.id) ? "active" : ""}
            onClick={() => onToggle(card.id)}
            title={card.note}
          >
            <strong>{card.name}</strong>
            <span>Lv {card.level}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function statusText(status) {
  if (status === "hand") return "还在手牌";
  if (status === "discard") return "已进弃牌";
  return "未知状态";
}
