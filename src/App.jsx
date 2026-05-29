import {
  Activity,
  BadgeDollarSign,
  Download,
  Eye,
  Flame,
  HeartPulse,
  HelpCircle,
  History,
  RotateCcw,
  Settings,
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
  playerUltimateLibrary,
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
  setPlayerUltimateLevel,
  setRevealCount,
  setWeather,
  setCardCountInDeck,
  stateToLevelConfig,
  toggleInitialBuff,
  toggleItem,
  toggleMove
} from "./simulator.js";

export function App() {
  const [game, setGame] = useState(() => createInitialState(levelPresets[0]));
  const [logCollapsed, setLogCollapsed] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
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
  const ultimateInfo = playerUltimateLibrary.find((entry) => entry.level === game.playerUltimateLevel) ?? playerUltimateLibrary[0];
  const bossPressureTitle = `当前 Boss：${game.bossPersona?.name ?? "Boss"}（${game.bossPersona?.style ?? "默认"}）\n压力 ${bossPressure}/3\n压力越高，Boss 越容易进入激进状态。`;
  const battleTypeText = { npc: "NPC 战斗", duel: "主角切磋", boss: "Boss 战" }[game.battleType] ?? "战斗";
  const activeAbilities = getActiveAbilities(game);

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
          <button className="iconButton" onClick={() => setRulesOpen(true)}><HelpCircle size={18} />规则说明</button>
          <button className="iconButton" onClick={exportLevel}><Download size={18} />导出关卡</button>
          <button className="iconButton" onClick={() => fileInputRef.current?.click()}><Upload size={18} />上传关卡</button>
          <input ref={fileInputRef} className="hiddenInput" type="file" accept="application/json,.json" onChange={importLevel} />
          <button className="iconButton primary" onClick={() => setGame((state) => resetBattle(state))}><RotateCcw size={18} />重开本场</button>
        </div>
      </header>
      {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}

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
          <p className="decisionText"><strong>性格：</strong>{game.bossPersona?.style}</p>
          <p className="decisionText hint">压力越高，Boss 越危险，但界面不会透露 Boss 的具体出牌决策。</p>
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
            <InfoPill label="终极招式" value={`${ultimateInfo.name}`} />
          </div>
          <div className="abilityBoard">
            <AbilityColumn title="玩家已生效能力" abilities={activeAbilities.player} />
            <AbilityColumn title="Boss 已生效能力" abilities={activeAbilities.boss} />
          </div>
          <div className="pileBoard">
            <Pile title="我的手牌" cards={game.playerHand} visible />
            <Pile title="我的弃牌堆" cards={game.playerDiscard} visible emptyText="暂无弃牌" />
            <Pile title="Boss 手牌" cards={game.bossHand} revealedKeys={game.revealedBossCardKeys ?? []} emptyText="Boss 手牌已空" />
            <Pile title="Boss 弃牌堆" cards={game.bossDiscard} visible emptyText="暂无弃牌" />
          </div>
        </section>
        <section className="panel settingsPanel">
          <div className="panelTitle"><Settings size={18} /><h2>战斗配置</h2></div>
          <div className="configBand compact">
            <label><span>玩家最大生命</span><input type="number" min="1" max="99" value={game.basePlayerMaxHp ?? game.playerMaxHp} onChange={(event) => setGame((state) => setMaxHp(state, "player", event.target.value))} /></label>
            <label><span>对手最大生命</span><input type="number" min="1" max="99" value={game.baseBossMaxHp ?? game.bossMaxHp} onChange={(event) => setGame((state) => setMaxHp(state, "boss", event.target.value))} /></label>
            <label><span>基础透视</span><input type="number" min="0" max="5" value={game.baseRevealCount ?? game.revealCount} onChange={(event) => setGame((state) => setRevealCount(state, event.target.value))} /></label>
            <label><span>终极招式等级</span><input type="number" min="1" max="4" value={game.playerUltimateLevel ?? 1} onChange={(event) => setGame((state) => setPlayerUltimateLevel(state, event.target.value))} /></label>
          </div>
          <p className="configHint">{ultimateInfo.text}</p>
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
          <h3>Boss 携带（{game.selectedBossMoves.length}/10）</h3><div className="moveList">{bossMoveLibrary.map((move) => <ToggleRow key={move.id} active={game.selectedBossMoves.includes(move.id)} title={move.name} meta={`${move.pattern.map((p) => resultLabels[p]).join(" ")} / ${move.damage} 伤害`} note={move.note} onClick={() => setGame((state) => toggleMove(state, move.id, "boss"))} />)}</div>
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
            <DeckToggles title="玩家卡组" side="player" cards={game.playerHand.concat(game.playerDiscard)} onCount={(id, count) => setGame((state) => setCardCountInDeck(state, "player", id, count))} />
            <DeckToggles title="Boss 卡组" side="boss" cards={game.bossHand.concat(game.bossDiscard)} onCount={(id, count) => setGame((state) => setCardCountInDeck(state, "boss", id, count))} />
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
function RulesModal({ onClose }) {
  return (
    <div className="modalBackdrop" role="presentation" onClick={onClose}>
      <section className="rulesModal" role="dialog" aria-modal="true" aria-label="规则说明" onClick={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <h2>规则说明</h2>
          <button className="collapseButton" onClick={onClose}>关闭</button>
        </div>
        <div className="rulesContent">
          <h3>目标</h3>
          <p>选择手牌与对手对弈，通过胜负序列触发招式，把对手生命打到 0。每层有 NPC 战、主角切磋和 Boss 战，Boss 战会有专属规则与技能。</p>
          <h3>比牌</h3>
          <p>通常等级高的牌获胜。国王 3，大臣 2，平民 1，但平民克制国王。同等级双方失败。弑君者、乱党、乞丐会在缺少对应核心牌时临时视为国王、大臣、平民。</p>
          <h3>出牌限制</h3>
          <p>不能连续两次打出同一张具体手牌，除非你当前可出牌只剩一张。卡组里可以携带多张同名牌；国王和平民固定各 1 张，其他牌可以重复携带。</p>
          <h3>透视</h3>
          <p>透视能看到一部分对手手牌。如果对手本回合要出的牌在透视范围内，会显示“本回合已知”。透视牌会显示还在手牌或已进弃牌。后期 Boss 可能隐藏透视牌或减少透视数量。</p>
          <h3>招式</h3>
          <p>你可以配置 6 个玩家招式，每个招式是一串“胜/负”。最近结果符合序列时触发伤害。同回合可触发多个招式，同一招式每回合最多触发一次。Boss 也有自己的招式，前期较少，后期 Boss 会携带更多更长的招式。</p>
          <h3>伤害</h3>
          <p>1 位 1 点，2 位 3 点，3 位 5 点，4 位 7 点，5 位 15 点，6 位 30 点。</p>
          <h3>崩溃</h3>
          <p>一方手牌被打空会进入崩溃，受到终极招式伤害；如果没死，会重洗弃牌继续战斗并获得 1 层崩溃负面状态。崩溃负面状态会让之后受到的招式伤害增加。</p>
          <h3>玩家终极招式</h3>
          <p>当你把对手打到崩溃时，会触发玩家终极招式。等级 1 造成对手最大生命 50% 伤害；等级 2 为 50% + 3；等级 3 为 75%；等级 4 为 100%。暖风天气下，崩溃伤害会直接按最大生命结算。</p>
          <h3>Boss</h3>
          <p>Boss 有压力、性格倾向、招式、技能和专属地形。Boss 输牌通常会增加压力，压力高时会更激进。Boss 技能会在指定回合自动发动，通常对 Boss 有利，例如减伤、清空玩家序列、隐藏透视牌、提高压力或增加伤害。</p>
          <h3>Boss 地形</h3>
          <p>只有 Boss 战有地形规则。比如巡逻队长第一次崩溃免伤、雪花谋士隐藏透视、四象门主积累仪式、伪神赌徒让双方失败也增加压力、暖风裁决者提高玩家崩溃伤害、王座之影削弱重复同长度招式。</p>
          <h3>道具和天气</h3>
          <p>道具牌是给玩家用的一次性工具，比如预见牌、加等级、减 Boss 等级、续命牌。Boss 默认不携带一次性牌。天气会影响部分牌或崩溃效果，例如烈日/冰雹改变 .5 等级牌，暖风强化崩溃伤害。</p>
          <h3>能力牌</h3>
          <p>能力牌可以多次打出，具体效果按每次打出的规则结算。比如天作之合每打出一次都会切换等级排序：第一次变成低等级获胜，第二次会恢复为高等级获胜。</p>
          <h3>上手建议</h3>
          <p>先从第一层 NPC 战开始。不要急着改配置，先理解国王、大臣、平民，再尝试“胜”“胜胜”“负胜”等短招式。</p>
        </div>
      </section>
    </div>
  );
}
function StatCard({ icon, label, value, danger = false, highlight = false, title = "" }) { return <div className={`statCard ${danger ? "danger" : ""} ${highlight ? "highlight" : ""}`} title={title}>{icon}<span>{label}</span><strong>{value}</strong></div>; }
function InfoPill({ label, value }) { return <div className="infoPill"><span>{label}</span><strong>{value}</strong></div>; }
function AbilityColumn({ title, abilities }) {
  return (
    <div className="abilityColumn">
      <h3>{title}</h3>
      <div className="abilityTags">
        {abilities.length === 0 && <span className="emptyAbility">无</span>}
        {abilities.map((ability) => <span key={ability} className="abilityTag">{ability}</span>)}
      </div>
    </div>
  );
}
function getActiveAbilities(game) {
  const player = [];
  const boss = [];
  if (game.levelOrderReversed) { player.push("天作之合：低等级获胜"); boss.push("天作之合：低等级获胜"); }
  if (game.playerCivilized) player.push("文明：己方牌视为国王");
  if (game.bossCivilized) boss.push("文明：己方牌视为国王");
  if (game.playerWarmDay) player.push("暖日：己方 .5 牌 +0.25");
  if (game.bossWarmDay) boss.push("暖日：己方 .5 牌 +0.25");
  if (game.playerSnowflake) boss.push("雪花：己方 .5 牌 -0.25");
  if (game.bossSnowflake) player.push("雪花：己方 .5 牌 -0.25");
  if (game.playerEvenForm) player.push("偶数形态：偶数回合 +1");
  if (game.bossEvenForm) boss.push("偶数形态：偶数回合 +1");
  if (game.playerOddForm) player.push("奇数形态：奇数回合 +1");
  if (game.bossOddForm) boss.push("奇数形态：奇数回合 +1");
  if (game.playerExponentialForm) player.push("指数形态：等级平方，额外弃牌");
  if (game.bossExponentialForm) boss.push("指数形态：等级平方，额外弃牌");
  if (game.playerDaydream) player.push("白日梦：每回合替换手牌");
  if (game.bossDaydream) boss.push("白日梦：每回合替换手牌");
  if (game.playerForcedLoss) player.push("伪神反噬：本回合必败");
  if (game.bossForcedLoss) boss.push("伪神反噬：本回合必败");
  if (game.playerForcedWin) player.push("占卜预言：本回合必胜");
  if (game.bossForcedWin) boss.push("占卜预言：本回合必胜");
  if ((game.playerCollapseStacks ?? 0) > 0) player.push(`崩溃负面：${game.playerCollapseStacks} 层`);
  if ((game.bossCollapseStacks ?? 0) > 0) boss.push(`崩溃负面：${game.bossCollapseStacks} 层`);
  if ((game.bossDamageReduction ?? 0) > 0) boss.push(`本回合减伤：-${game.bossDamageReduction}`);
  if ((game.bossWinBonus ?? 0) > 0) boss.push(`胜利追加伤害：+${game.bossWinBonus}`);
  if ((game.bossMoveDamageBonus ?? 0) > 0) boss.push(`下次招式伤害：+${game.bossMoveDamageBonus}`);
  if ((game.fourSymbolBonus ?? 0) > 0) boss.push(`下一张四象等级：+${game.fourSymbolBonus}`);
  if ((game.fourSymbolRitual ?? 0) > 0) boss.push(`四象仪式：${game.fourSymbolRitual}/4`);
  if ((game.playerFourWins ?? []).length > 0) player.push(`四象获胜：${game.playerFourWins.length}/4`);
  if ((game.bossFourWins ?? []).length > 0) boss.push(`四象获胜：${game.bossFourWins.length}/4`);
  if (game.ignoreNextBossLossSequence) boss.push("伪神降桌：下一次失败不送玩家序列");
  return { player, boss };
}
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
function DeckToggles({ title, side, cards, onCount }) {
  const counts = cards.reduce((map, card) => map.set(card.id, (map.get(card.id) ?? 0) + 1), new Map());
  return (
    <div>
      <h3>{title}（{cards.length}/10）</h3>
      <div className="libraryGrid">
        {cardLibrary.map((card) => {
          const count = counts.get(card.id) ?? 0;
          const disabled = side === "boss" && card.type === "一次性卡牌";
          const locked = card.id === "king" || card.id === "commoner";
          return (
            <div key={card.id} className={`deckCardControl ${count > 0 ? "active" : ""} ${disabled ? "disabled" : ""}`} title={disabled ? "Boss 不使用一次性牌" : card.note}>
              <strong>{card.name}</strong>
              <span>Lv {card.level}</span>
              <div className="countControls">
                <button disabled={disabled || locked || count <= 0} onClick={() => onCount(card.id, count - 1)}>-</button>
                <em>{count}</em>
                <button disabled={disabled || locked || cards.length >= 10} onClick={() => onCount(card.id, count + 1)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function statusText(status) { if (status === "hand") return "还在手牌"; if (status === "discard") return "已进弃牌"; return "未知状态"; }





