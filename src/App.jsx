import {
  Activity,
  BadgeDollarSign,
  Download,
  Eye,
  Flame,
  HeartPulse,
  History,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords,
  Upload
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import {
  bossMoveLibrary,
  cardLibrary,
  initialBuffLibrary,
  itemLibrary,
  levelPresets,
  resultLabels,
  sequenceDamageByLength,
  weatherLibrary
} from "./gameData.js";
import {
  canSeeBossPlannedCard,
  chooseItem,
  createInitialState,
  createStateFromConfig,
  getLegalPlayerCards,
  getPredictedBossCard,
  getVisibleBossCards,
  playRound,
  resetBattle,
  setCustomMoveLength,
  setCustomMoveStep,
  setMaxHp,
  setRevealCount,
  setWeather,
  stateToLevelConfig,
  toggleCardInDeck,
  toggleInitialBuff,
  toggleItem,
  toggleMove
} from "./simulator.js";

export function App() {
  const [game, setGame] = useState(() => createInitialState(levelPresets[0]));
  const [logCollapsed, setLogCollapsed] = useState(false);
  const fileInputRef = useRef(null);
  const legalCards = useMemo(() => getLegalPlayerCards(game), [game]);
  const legalKeys = new Set(legalCards.map((card) => card.key));
  const visibleBossCards = getVisibleBossCards(game);
  const predictedBossCard = getPredictedBossCard(game);
  const plannedCardVisible = canSeeBossPlannedCard(game);
  const plannedVisibleCard = visibleBossCards.find((card) => card.willPlay);
  const playerPatternText = game.playerPattern.map((entry) => resultLabels[entry]).join(" ");
  const bossPatternText = game.bossPattern.map((entry) => resultLabels[entry]).join(" ");
  const bossPressure = game.bossPressure ?? 0;
  const bossTendencyText = game.bossPersona?.pressureRules?.[Math.min(3, bossPressure)] ?? "按当前性格选择出牌。";
  const bossPressureTitle = `当前 Boss：${game.bossPersona?.name ?? "Boss"}（${game.bossPersona?.style ?? "默认"}）\n压力 ${bossPressure}/3\n行为倾向：${bossTendencyText}\n满压力：${game.bossPersona?.fullPressure ?? "打出当前最高等级牌，然后压力清零。"}`;
  const battleTypeText = { npc: "NPC 战斗", duel: "主角切磋", boss: "Boss 战" }[game.battleType] ?? "战斗";

  function applyLevel(levelId) {
    const level = levelPresets.find((entry) => entry.id === levelId);
    if (level) setGame(createStateFromConfig(level));
  }

  function exportLevel() {
    const config = stateToLevelConfig(game);
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.id || "king-cards-level"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importLevel(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      setGame(createStateFromConfig(config));
    } catch {
      setGame((state) => ({
        ...state,
        logs: [{ id: state.logs.length + 1, tone: "warn", text: "导入失败：请选择合法的关卡 JSON 文件。" }, ...state.logs]
      }));
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">King Cards 新版玩法验证</p>
          <h1>关卡模拟器</h1>
        </div>
        <div className="topActions">
          <button className="iconButton" onClick={exportLevel}><Download size={18} />导出关卡</button>
          <button className="iconButton" onClick={() => fileInputRef.current?.click()}><Upload size={18} />上传关卡</button>
          <input ref={fileInputRef} className="hiddenInput" type="file" accept="application/json,.json" onChange={importLevel} />
          <button className="iconButton primary" onClick={() => setGame((state) => resetBattle(state))}><RotateCcw size={18} />重开本场</button>
        </div>
      </header>

      <section className="levelBand">
        <label>
          <span>当前关卡</span>
          <select value={game.currentLevelId} onChange={(event) => applyLevel(event.target.value)}>
            {levelPresets.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}
            {!levelPresets.some((level) => level.id === game.currentLevelId) && <option value={game.currentLevelId}>{game.currentLevelName}</option>}
          </select>
        </label>
        <strong>{battleTypeText}：{game.currentLevelName}</strong>
      </section>

      <section className="statusBand">
        <StatCard icon={<HeartPulse />} label="玩家生命" value={`${game.playerHp}/${game.playerMaxHp}`} danger={game.playerHp <= 6} />
        <StatCard icon={<ShieldAlert />} label="Boss 生命" value={`${game.bossHp}/${game.bossMaxHp}`} danger={game.bossHp <= 8} />
        <StatCard icon={<Activity />} label="当前回合" value={game.round} />
        <StatCard icon={<Flame />} label="天气" value={weatherLibrary.find((w) => w.id === game.weather)?.name ?? game.weather} />
        <StatCard icon={<Sparkles />} label="Boss 压力" value={`${bossPressure}/3`} title={bossPressureTitle} highlight />
      </section>

      <section className="configBand">
        <label><span>玩家基础生命</span><input type="number" min="1" max="99" value={game.basePlayerMaxHp ?? game.playerMaxHp} onChange={(event) => setGame((state) => setMaxHp(state, "player", event.target.value))} /></label>
        <label><span>Boss 基础生命</span><input type="number" min="1" max="99" value={game.baseBossMaxHp ?? game.bossMaxHp} onChange={(event) => setGame((state) => setMaxHp(state, "boss", event.target.value))} /></label>
      </section>

      {game.winner && <section className={`resultBanner ${game.winner === "player" ? "win" : "loss"}`}>{game.winner === "player" ? "玩家胜利：Boss 已被击败" : "战斗失败：玩家已经倒下"}</section>}

      <div className="workspace">
        <section className="panel bossIntentPanel">
          <div className="panelTitle"><ShieldAlert size={18} /><h2>对手规则</h2></div>
          <div className="pressureBox" title={bossPressureTitle}>
            <div>
              <span>{game.bossPersona?.style}</span>
              <strong>{game.bossPersona?.name}</strong>
            </div>
            <div className="pressureDots" aria-label={`压力 ${bossPressure}/3`}>
              {[0, 1, 2].map((dot) => <i key={dot} className={dot < bossPressure ? "active" : ""} />)}
            </div>
          </div>
          <p className="decisionText"><strong>当前倾向：</strong>{bossTendencyText}</p>
          <p className="decisionText muted"><strong>满压力倾向：</strong>{game.bossPersona?.fullPressure}</p>
          <p className="decisionText hint">这里显示的是性格倾向，不代表 Boss 本回合一定出哪张牌。</p>
          {game.battleRule && (
            <div className="ruleBox">
              <strong>{game.battleRule.name}</strong>
              <span>{game.battleRule.text}</span>
            </div>
          )}
          {game.bossSkills?.length > 0 && (
            <div className="skillTimeline">
              {game.bossSkills.map((skill) => (
                <div key={`${skill.round}-${skill.name}`} className={(game.usedBossSkillRounds ?? []).includes(skill.round) ? "used" : ""}>
                  <em>第 {skill.round} 回合</em>
                  <strong>{skill.name}</strong>
                  <span>{skill.text}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel battlePanel">
          <div className="panelTitle"><Swords size={18} /><h2>出牌区</h2></div>
          <div className="duelGrid">
            <div>
              <h3>我的手牌</h3>
              <div className="cardGrid">
                {game.playerHand.map((card) => (
                  <button key={card.key} className={`playCard ${legalKeys.has(card.key) ? "" : "disabled"}`} disabled={!legalKeys.has(card.key) || Boolean(game.winner)} onClick={() => setGame((state) => playRound(state, card.key))} title={card.note}>
                    <span className="cardType">{card.type}</span><strong>{card.name}</strong><span className="level">Lv {card.level}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="sectionHeader">
                <h3>Boss 透视牌</h3>
                <label className="revealControl"><span>基础透视 {game.baseRevealCount ?? game.revealCount} 张</span><input type="range" min="0" max="5" value={game.baseRevealCount ?? game.revealCount} onChange={(event) => setGame((state) => setRevealCount(state, event.target.value))} /></label>
              </div>
              <div className="bossPeek">
                {visibleBossCards.map((card) => <div className={`miniCard ${card.willPlay ? "willPlay" : ""}`} key={card.key}><span><strong>{card.name}</strong><small>{statusText(card.status)}</small></span><em>Lv {card.level}</em></div>)}
                {game.revealCount === 0 && <div className="miniCard faceDown">当前没有透视任何 Boss 手牌</div>}
              </div>
              <div className={plannedCardVisible ? "peekResult" : "peekResult unknown"}><Eye size={16} />{plannedCardVisible ? `本回合已知：Boss 将出【${plannedVisibleCard?.name}】` : "本回合未知：Boss 要出的牌不在透视范围内"}</div>
              {predictedBossCard && <div className="peekResult"><Eye size={16} />{`预见牌：Boss 倾向出【${predictedBossCard.name}】`}</div>}
            </div>
          </div>
          <div className="battleInfo">
            <InfoPill label="玩家弃牌" value={game.playerDiscard.length} />
            <InfoPill label="Boss 弃牌" value={game.bossDiscard.length} />
            <InfoPill label="玩家序列" value={playerPatternText || "无"} />
            <InfoPill label="Boss 序列" value={bossPatternText || "无"} />
          </div>
          <div className="pileBoard">
            <Pile title="我的手牌" cards={game.playerHand} visible />
            <Pile title="我的弃牌堆" cards={game.playerDiscard} visible emptyText="暂无弃牌" />
            <Pile title="Boss 手牌" cards={game.bossHand} revealedKeys={game.revealedBossCardKeys ?? []} emptyText="Boss 手牌已空" />
            <Pile title="Boss 弃牌堆" cards={game.bossDiscard} visible emptyText="暂无弃牌" />
          </div>
        </section>
        <section className="panel">
          <div className="panelTitle"><Sparkles size={18} /><h2>初始 Buff</h2></div>
          <div className="buffGrid">
            {initialBuffLibrary.map((buff) => (
              <button key={buff.id} className={`buffButton ${(game.initialBuffs ?? []).includes(buff.id) ? "active" : ""}`} onClick={() => setGame((state) => toggleInitialBuff(state, buff.id))} title={buff.note}>
                <span>{buff.side}</span><strong>{buff.name}</strong><small>{buff.note}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelTitle"><Sparkles size={18} /><h2>招式</h2></div>
          <h3>玩家自定义招式</h3>
          <div className="customMoveList">
            {game.customMoves.map((move) => (
              <CustomMoveEditor
                key={move.id}
                move={move}
                damage={sequenceDamageByLength[move.pattern.length] ?? 0}
                onStep={(index, outcome) => setGame((state) => setCustomMoveStep(state, move.id, index, outcome))}
                onLength={(length) => setGame((state) => setCustomMoveLength(state, move.id, length))}
              />
            ))}
          </div>
          <h3>Boss 携带</h3><div className="moveList">{bossMoveLibrary.map((move) => <ToggleRow key={move.id} active={game.selectedBossMoves.includes(move.id)} title={move.name} meta={`${move.pattern.map((p) => resultLabels[p]).join(" ")} / ${move.damage} 伤害`} note={move.note} onClick={() => setGame((state) => toggleMove(state, move.id, "boss"))} />)}</div>
        </section>

        <section className="panel">
          <div className="panelTitle"><BadgeDollarSign size={18} /><h2>道具与天气</h2></div>
          <h3>天气</h3><div className="segmented">{weatherLibrary.map((weather) => <button key={weather.id} className={game.weather === weather.id ? "active" : ""} onClick={() => setGame((state) => setWeather(state, weather.id))} title={weather.note}>{weather.name}</button>)}</div>
          <h3>一次性道具牌</h3>
          <div className="itemList">
            {itemLibrary.map((item) => {
              const owned = game.ownedItems.includes(item.id);
              const armed = game.activeItemId === item.id;
              return <div className={`itemRow ${owned ? "" : "muted"}`} key={item.id}><button className={owned ? "toggle active" : "toggle"} onClick={() => setGame((state) => toggleItem(state, item.id))}>{owned ? "已买" : "未买"}</button><button className={`armButton ${armed ? "armed" : ""}`} disabled={!owned || Boolean(game.winner)} onClick={() => setGame((state) => chooseItem(state, item.id))}>{armed ? "本回合使用" : "准备使用"}</button><div><strong>{item.name}</strong><span>{item.price}$ / {item.note}</span></div></div>;
            })}
          </div>
        </section>

        <section className="panel deckPanel">
          <div className="panelTitle"><Swords size={18} /><h2>卡组开关</h2></div>
          <div className="deckColumns">
            <DeckToggles title="玩家卡组" side="player" cards={game.playerHand.concat(game.playerDiscard)} onToggle={(id) => setGame((state) => toggleCardInDeck(state, "player", id))} />
            <DeckToggles title="Boss 卡组" side="boss" cards={game.bossHand.concat(game.bossDiscard)} onToggle={(id) => setGame((state) => toggleCardInDeck(state, "boss", id))} />
          </div>
        </section>

                <section className={`panel logPanel ${logCollapsed ? "collapsed" : ""}`}>
          <div className="panelTitle logTitle">
            <span><History size={18} /><h2>战斗日志</h2></span>
            <button className="collapseButton" onClick={() => setLogCollapsed((value) => !value)}>{logCollapsed ? "展开" : "隐藏"}</button>
          </div>
          {!logCollapsed && <div className="logs">{game.logs.map((log) => <p key={log.id} className={`log ${log.tone}`}>{log.text}</p>)}</div>}
        </section>
      </div>
    </main>
  );
}

function Pile({ title, cards, visible = false, revealedKeys = [], emptyText = "空" }) {
  const revealed = new Set(revealedKeys);
  return (
    <div className="pile">
      <h3>{title} <span>{cards.length}</span></h3>
      <div className="pileCards">
        {cards.length === 0 && <em>{emptyText}</em>}
        {cards.map((card) => {
          const show = visible || revealed.has(card.key);
          return <span key={card.key} className={show ? "pileCard" : "pileCard hidden"}>{show ? card.name : "牌背"}</span>;
        })}
      </div>
    </div>
  );
}
function StatCard({ icon, label, value, danger = false, highlight = false, title = "" }) { return <div className={`statCard ${danger ? "danger" : ""} ${highlight ? "highlight" : ""}`} title={title}>{icon}<span>{label}</span><strong>{value}</strong></div>; }
function InfoPill({ label, value }) { return <div className="infoPill"><span>{label}</span><strong>{value}</strong></div>; }
function ToggleRow({ active, title, meta, note, onClick }) { return <button className={`toggleRow ${active ? "active" : ""}`} onClick={onClick} title={note}><span><strong>{title}</strong><small>{note}</small></span><em>{meta}</em></button>; }
function CustomMoveEditor({ move, damage, onStep, onLength }) {
  return (
    <div className="customMoveRow">
      <div className="customMoveHead">
        <strong>{move.name}</strong>
        <span>{move.pattern.map((entry) => resultLabels[entry]).join(" ")} / {damage} 伤害</span>
      </div>
      <div className="customMoveControls">
        <label>
          <span>长度</span>
          <input type="number" min="1" max="6" value={move.pattern.length} onChange={(event) => onLength(event.target.value)} />
        </label>
        <div className="sequenceButtons">
          {move.pattern.map((entry, index) => (
            <button key={`${move.id}-${index}`} className={entry === "win" ? "win" : "loss"} onClick={() => onStep(index, entry === "win" ? "loss" : "win")}>
              {resultLabels[entry]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function DeckToggles({ title, side, cards, onToggle }) {
  const ownedIds = new Set(cards.map((card) => card.id));
  return <div><h3>{title}（{cards.length}/10）</h3><div className="libraryGrid">{cardLibrary.map((card) => { const disabled = side === "boss" && card.type === "一次性卡牌"; return <button key={card.id} className={ownedIds.has(card.id) ? "active" : ""} disabled={disabled} onClick={() => onToggle(card.id)} title={disabled ? "Boss 不使用一次性牌" : card.note}><strong>{card.name}</strong><span>Lv {card.level}</span></button>; })}</div></div>;
}
function statusText(status) { if (status === "hand") return "还在手牌"; if (status === "discard") return "已进弃牌"; return "未知状态"; }





