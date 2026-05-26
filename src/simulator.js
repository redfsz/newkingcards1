import {
  bossMoveLibrary,
  bossPersonaLibrary,
  cardLibrary,
  defaultCustomMoves,
  initialBuffLibrary,
  itemLibrary,
  levelPresets,
  requiredDeckCards,
  sequenceDamageByLength
} from "./gameData.js";

const byId = new Map(cardLibrary.map((card) => [card.id, card]));
const itemById = new Map(itemLibrary.map((item) => [item.id, item]));
const buffById = new Map(initialBuffLibrary.map((buff) => [buff.id, buff]));
const personaById = new Map(bossPersonaLibrary.map((persona) => [persona.id, persona]));

let nextInstance = 1;

export function createInitialState(levelConfig = levelPresets[0]) {
  return createStateFromConfig(normalizeLevelConfig(levelConfig));
}

export function createStateFromConfig(config) {
  nextInstance = 1;
  const normalized = normalizeLevelConfig(config);
  const effective = applyInitialBuffs(normalized);
  const bossHand = createCards(normalized.bossDeck, "b");
  const buffNames = normalized.initialBuffs.map((id) => buffById.get(id)?.name).filter(Boolean).join("、") || "无";
  const persona = personaById.get(normalized.bossPersona) ?? bossPersonaLibrary[0];

  return {
    currentLevelId: normalized.id,
    currentLevelName: normalized.name,
    bossPersona: persona,
    basePlayerMaxHp: normalized.playerMaxHp,
    baseBossMaxHp: normalized.bossMaxHp,
    baseRevealCount: normalized.revealCount,
    playerHp: effective.playerMaxHp,
    playerMaxHp: effective.playerMaxHp,
    bossHp: effective.bossMaxHp,
    bossMaxHp: effective.bossMaxHp,
    weather: normalized.weather,
    playerHand: createCards(normalized.playerDeck, "p"),
    playerDiscard: [],
    bossHand,
    bossDiscard: [],
    revealedBossCardKeys: bossHand.slice(0, effective.revealCount).map((card) => card.key),
    playerLastCardKey: null,
    bossLastCardKey: null,
    playerPattern: [],
    bossPattern: [],
    playerCollapseStacks: 0,
    bossCollapseStacks: 0,
    bossPressure: 0,
    customMoves: normalized.customMoves,
    selectedBossMoves: normalized.selectedBossMoves,
    ownedItems: normalized.ownedItems,
    initialBuffs: normalized.initialBuffs,
    activeItemId: "",
    revealCount: effective.revealCount,
    round: 1,
    winner: null,
    logs: [
      { id: 0, tone: "info", text: `载入关卡：${normalized.name}。Boss：${persona.name}（${persona.style}）。初始 Buff：${buffNames}。` }
    ]
  };
}

export function stateToLevelConfig(state) {
  return normalizeLevelConfig({
    id: state.currentLevelId || "custom_level",
    name: state.currentLevelName || "自定义关卡",
    playerMaxHp: state.basePlayerMaxHp ?? state.playerMaxHp,
    bossMaxHp: state.baseBossMaxHp ?? state.bossMaxHp,
    weather: state.weather,
    bossPersona: state.bossPersona?.id ?? state.bossPersona ?? "gatekeeper",
    revealCount: state.baseRevealCount ?? state.revealCount,
    initialBuffs: state.initialBuffs ?? [],
    playerDeck: collectDeckIds(state.playerHand, state.playerDiscard),
    bossDeck: collectDeckIds(state.bossHand, state.bossDiscard),
    customMoves: state.customMoves,
    selectedBossMoves: state.selectedBossMoves,
    ownedItems: state.ownedItems
  });
}

export function normalizeLevelConfig(config) {
  const fallback = levelPresets[0];
  const source = config ?? fallback;
  return {
    id: String(source.id || "custom_level"),
    name: String(source.name || "自定义关卡"),
    playerMaxHp: clampNumber(source.playerMaxHp, 1, 99, fallback.playerMaxHp),
    bossMaxHp: clampNumber(source.bossMaxHp, 1, 99, fallback.bossMaxHp),
    weather: source.weather || "clear",
    bossPersona: personaById.has(source.bossPersona) ? source.bossPersona : fallback.bossPersona ?? "gatekeeper",
    revealCount: clampNumber(source.revealCount, 0, 10, fallback.revealCount),
    initialBuffs: sanitizeIds(source.initialBuffs, initialBuffLibrary, [], initialBuffLibrary.length, true),
    playerDeck: sanitizeDeck(source.playerDeck, "player"),
    bossDeck: sanitizeDeck(source.bossDeck, "boss"),
    customMoves: sanitizeCustomMoves(source.customMoves, source.selectedMoves),
    selectedBossMoves: sanitizeIds(source.selectedBossMoves, bossMoveLibrary, fallback.selectedBossMoves, 6),
    ownedItems: sanitizeIds(source.ownedItems, itemLibrary, fallback.ownedItems, itemLibrary.length)
  };
}

export function createCards(ids, owner) {
  return sanitizeDeck(ids, owner === "b" ? "boss" : "player").map((id) => ({
    ...byId.get(id),
    key: `${owner}-${nextInstance++}-${id}`
  }));
}

export function toggleInitialBuff(state, buffId) {
  if (!buffById.has(buffId)) return state;
  const current = new Set(state.initialBuffs ?? []);
  if (current.has(buffId)) current.delete(buffId);
  else current.add(buffId);
  return createStateFromConfig({ ...stateToLevelConfig(state), initialBuffs: [...current] });
}

export function toggleCardInDeck(state, side, cardId) {
  const card = byId.get(cardId);
  if (!card) return state;
  if (side === "boss" && isOneTimeCard(card)) return addLog(state, "warn", "Boss 不能携带一次性牌。一次性牌是给玩家使用的道具。");
  if (requiredDeckCards.includes(cardId)) return addLog(state, "warn", "国王和平民是固定核心牌，不能从任意一方卡组中移除。");

  const handKey = side === "player" ? "playerHand" : "bossHand";
  const discardKey = side === "player" ? "playerDiscard" : "bossDiscard";
  const cards = [...state[handKey], ...state[discardKey]];
  const existing = cards.find((entry) => entry.id === cardId);

  if (existing) {
    const next = { ...state, [handKey]: state[handKey].filter((entry) => entry.id !== cardId), [discardKey]: state[discardKey].filter((entry) => entry.id !== cardId) };
    return side === "boss" ? syncRevealedBossCards(next) : next;
  }
  if (cards.length >= 10) return addLog(state, "warn", "出战牌最多 10 张，先移除一张再添加。");

  const prefix = side === "player" ? "p" : "b";
  const next = { ...state, [handKey]: [...state[handKey], ...createCards([cardId], prefix)] };
  return side === "boss" ? syncRevealedBossCards(next) : next;
}

export function toggleMove(state, moveId, side = "player") {
  if (side === "player") return state;
  const key = side === "player" ? "selectedMoves" : "selectedBossMoves";
  const selected = state[key];
  if (selected.includes(moveId)) return { ...state, [key]: selected.filter((id) => id !== moveId) };
  if (selected.length >= 6) return addLog(state, "warn", "最多携带 6 个招式。");
  return { ...state, [key]: [...selected, moveId] };
}

export function setCustomMoveStep(state, moveId, index, outcome) {
  const customMoves = sanitizeCustomMoves(state.customMoves).map((move) => {
    if (move.id !== moveId) return move;
    const pattern = [...move.pattern];
    pattern[index] = outcome;
    return { ...move, pattern: pattern.slice(0, 6) };
  });
  return { ...state, customMoves };
}

export function setCustomMoveLength(state, moveId, length) {
  const customMoves = sanitizeCustomMoves(state.customMoves).map((move) => {
    if (move.id !== moveId) return move;
    const nextLength = clampNumber(length, 1, 6, move.pattern.length || 1);
    const pattern = [...move.pattern];
    while (pattern.length < nextLength) pattern.push("win");
    return { ...move, pattern: pattern.slice(0, nextLength) };
  });
  return { ...state, customMoves };
}

export function toggleItem(state, itemId) {
  const owned = state.ownedItems;
  if (owned.includes(itemId)) {
    return { ...state, ownedItems: owned.filter((id) => id !== itemId), activeItemId: state.activeItemId === itemId ? "" : state.activeItemId };
  }
  return { ...state, ownedItems: [...owned, itemId] };
}

export function chooseItem(state, itemId) {
  if (!state.ownedItems.includes(itemId)) return state;
  return { ...state, activeItemId: state.activeItemId === itemId ? "" : itemId };
}

export function playRound(state, playerCardKey) {
  if (state.winner) return state;
  const legalCards = getLegalPlayerCards(state);
  const selectedPlayerCardKey = hasBuff(state, "chaotic_battlefield") && legalCards.length > 0
    ? pickChaoticPlayerCard(legalCards, state.round).key
    : playerCardKey;
  const playerCard = state.playerHand.find((card) => card.key === selectedPlayerCardKey);
  if (!playerCard) return state;
  if (!legalCards.some((card) => card.key === playerCardKey)) return addLog(state, "warn", "不能连续两次出同一张牌，除非可出牌只剩一张。");

  const bossCard = chooseBossCard(state);
  if (!bossCard) return handleCollapse(state, "boss", ["Boss 没有可出牌，进入崩溃状态。"]);

  let next = { ...state, playerHand: state.playerHand.filter((card) => card.key !== playerCard.key), bossHand: state.bossHand.filter((card) => card.key !== bossCard.key), activeItemId: "" };
  const item = itemById.get(state.activeItemId);
  const result = compareCards(playerCard, bossCard, state.weather, item, {
    playerHandBeforePlay: state.playerHand,
    bossHandBeforePlay: state.bossHand,
    activeBuffs: state.initialBuffs ?? []
  });
  const logs = [formatRoundLog(state.round, playerCard, bossCard, result, item)];
  if (selectedPlayerCardKey !== playerCardKey) logs.push(`混乱战场生效：本回合随机改为打出【${playerCard.name}】。`);

  if (result.player === "win") {
    next.playerHand = [...next.playerHand, playerCard];
    next.bossDiscard = [...next.bossDiscard, bossCard];
  } else if (result.player === "loss") {
    next.bossHand = [...next.bossHand, bossCard];
    if (item?.id === "save") {
      next.playerHand = [...next.playerHand, playerCard];
      logs.push("续命牌生效：本回合输掉的牌回到手牌。");
    } else next.playerDiscard = [...next.playerDiscard, playerCard];
  } else {
    next.playerDiscard = [...next.playerDiscard, playerCard];
    next.bossDiscard = [...next.bossDiscard, bossCard];
  }

  next.playerLastCardKey = playerCard.key;
  next.bossLastCardKey = bossCard.key;
  next.playerPattern = trimPattern([...next.playerPattern, result.player]);
  next.bossPattern = trimPattern([...next.bossPattern, result.boss]);
  next.bossPressure = nextBossPressure(state, result.boss, logs);
  next = applyMoves(next, "player", logs);
  next = applyMoves(next, "boss", logs);

  if (next.bossHp <= 0) { next.winner = "player"; logs.push("Boss 生命归零，玩家获胜。"); }
  else if (next.playerHp <= 0) { next.winner = "boss"; logs.push("玩家生命归零，Boss 获胜。"); }
  if (!next.winner && next.playerHand.length === 0) next = handleCollapse(next, "player", logs);
  if (!next.winner && next.bossHand.length === 0) next = handleCollapse(next, "boss", logs);

  next.round += 1;
  return addLogs(next, logs);
}

export function setWeather(state, weather) { return addLog({ ...state, weather }, "info", `天气切换为：${weatherName(weather)}。`); }
export function setRevealCount(state, revealCount) { return createStateFromConfig({ ...stateToLevelConfig(state), revealCount: clampNumber(revealCount, 0, 10, 0) }); }
export function setMaxHp(state, side, value) {
  const config = stateToLevelConfig(state);
  if (side === "player") config.playerMaxHp = clampNumber(value, 1, 99, 1);
  else config.bossMaxHp = clampNumber(value, 1, 99, 1);
  return createStateFromConfig(config);
}
export function resetBattle(state) { return createStateFromConfig(stateToLevelConfig(state)); }
export function getLegalPlayerCards(state) { return state.playerHand.length <= 1 ? state.playerHand : state.playerHand.filter((card) => card.key !== state.playerLastCardKey); }
export function getVisibleBossCards(state) {
  const revealed = new Set(state.revealedBossCardKeys ?? []);
  const planned = getBossPlannedCard(state);
  return getAllBossCards(state).filter((card) => revealed.has(card.key)).map((card) => ({ ...card, status: getBossCardStatus(state, card.key), willPlay: planned?.key === card.key }));
}
export function getPredictedBossCard(state) { return state.activeItemId === "peek" ? chooseBossCard(state) : null; }
export function getBossPlannedCard(state) { return chooseBossCard(state); }
export function canSeeBossPlannedCard(state) { const planned = getBossPlannedCard(state); return Boolean(planned && (state.revealedBossCardKeys ?? []).includes(planned.key)); }

function applyInitialBuffs(config) {
  const buffs = new Set(config.initialBuffs);
  return {
    playerMaxHp: config.playerMaxHp + (buffs.has("player_hp_plus") ? 3 : 0),
    bossMaxHp: config.bossMaxHp,
    revealCount: buffs.has("xray_boost") ? Math.max(config.revealCount, 2) : config.revealCount
  };
}
function hasBuff(state, id) { return (state.initialBuffs ?? []).includes(id); }
function sanitizeDeck(deck, side) {
  const clean = [...requiredDeckCards];
  for (const id of Array.isArray(deck) ? deck : []) {
    const card = byId.get(id);
    if (!card) continue;
    if (side === "boss" && isOneTimeCard(card)) continue;
    if (!clean.includes(id)) clean.push(id);
    if (clean.length >= 10) break;
  }
  return clean.slice(0, 10);
}
function sanitizeIds(ids, library, fallback, limit, allowEmpty = false) {
  const valid = new Set(library.map((entry) => entry.id));
  const source = Array.isArray(ids) ? ids : fallback;
  const clean = source.filter((id) => valid.has(id)).slice(0, limit);
  return clean.length > 0 || allowEmpty ? clean : fallback;
}
function sanitizeCustomMoves(moves, legacySelectedMoves = null, fallbackMoves = null) {
  const legacyMap = {
    single_win: ["win"],
    double_win: ["win", "win"],
    win_win_loss: ["win", "win", "loss"],
    counter: ["loss", "win"],
    comeback: ["loss", "loss", "win"]
  };
  let source = Array.isArray(moves) ? moves : fallbackMoves;
  if (!Array.isArray(source) && Array.isArray(legacySelectedMoves)) {
    source = legacySelectedMoves.map((id, index) => ({
      id: defaultCustomMoves[index]?.id ?? `custom_${index + 1}`,
      name: defaultCustomMoves[index]?.name ?? `招式 ${index + 1}`,
      pattern: legacyMap[id] ?? ["win"]
    }));
  }
  if (!Array.isArray(source)) source = defaultCustomMoves;
  return Array.from({ length: 6 }, (_, index) => {
    const fallback = defaultCustomMoves[index];
    const move = source[index] ?? fallback;
    const pattern = Array.isArray(move.pattern)
      ? move.pattern.filter((entry) => entry === "win" || entry === "loss").slice(0, 6)
      : fallback.pattern;
    return {
      id: fallback.id,
      name: String(move.name || fallback.name),
      pattern: pattern.length > 0 ? pattern : fallback.pattern
    };
  });
}
function collectDeckIds(hand, discard) { return [...hand, ...discard].map((card) => card.id); }
function isOneTimeCard(card) { return card.type === "一次性卡牌"; }
function clampNumber(value, min, max, fallback) { const n = Number(value); if (!Number.isFinite(n)) return fallback; return Math.max(min, Math.min(max, Math.round(n))); }
function syncRevealedBossCards(state) {
  const count = clampNumber(state.revealCount, 0, 10, 0);
  const allBossCards = getAllBossCards(state);
  const allKeys = new Set(allBossCards.map((card) => card.key));
  const kept = (state.revealedBossCardKeys ?? []).filter((key) => allKeys.has(key));
  for (const card of allBossCards) { if (kept.length >= count) break; if (!kept.includes(card.key)) kept.push(card.key); }
  return { ...state, revealCount: count, revealedBossCardKeys: kept.slice(0, count) };
}
function getAllBossCards(state) { return [...state.bossHand, ...state.bossDiscard]; }
function getBossCardStatus(state, key) { if (state.bossHand.some((card) => card.key === key)) return "hand"; if (state.bossDiscard.some((card) => card.key === key)) return "discard"; return "unknown"; }
function compareCards(playerCard, bossCard, weather, item, context = {}) {
  const playerEffectiveId = effectiveCardId(playerCard, context.playerHandBeforePlay);
  const bossEffectiveId = effectiveCardId(bossCard, context.bossHandBeforePlay);
  const playerLevel = adjustedLevel(playerCard, weather, item, "player", context.playerHandBeforePlay, context.activeBuffs);
  const bossLevel = adjustedLevel(bossCard, weather, item, "boss", context.bossHandBeforePlay);
  if (playerCard.id === "assassin" || bossCard.id === "assassin") return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "刺客强制双方失败" };
  if (playerEffectiveId === "commoner" && bossEffectiveId === "king") return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "平民克制国王" };
  if (bossEffectiveId === "commoner" && playerEffectiveId === "king") return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "平民克制国王" };
  if (playerLevel > bossLevel) return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "高等级获胜" };
  if (playerLevel < bossLevel) return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "高等级获胜" };
  return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "同等级双方失败" };
}
function effectiveCardId(card, handBeforePlay = []) {
  if (card.id === "regicide") return handBeforePlay.some((handCard) => handCard.id === "king") ? card.id : "king";
  if (card.id === "rebel") return handBeforePlay.some((handCard) => handCard.id === "minister") ? card.id : "minister";
  if (card.id === "beggar") return handBeforePlay.some((handCard) => handCard.id === "commoner") ? card.id : "commoner";
  return card.id;
}
function adjustedLevel(card, weather, item, side, handBeforePlay = [], activeBuffs = []) {
  let level = card.level;
  if (side === "player") {
    if (card.id === "commoner" && activeBuffs.includes("random_commoner")) level = deterministicRange(card.key, 0, 2);
    if (card.id === "king" && activeBuffs.includes("random_king")) level = deterministicRange(card.key, 0, 4);
  }
  const effective = effectiveCardId(card, handBeforePlay);
  if (effective === "king" && card.id !== "king") level = 3;
  if (effective === "minister" && card.id !== "minister") level = 2;
  if (effective === "commoner" && card.id !== "commoner") level = 1;
  if (Number.isFinite(level) && Math.abs(level % 1 - 0.5) < 0.01) { if (weather === "sun") level -= 0.5; if (weather === "hail") level += 0.5; }
  if (side === "player" && item?.id === "plus_half") level += 0.5;
  if (side === "player" && item?.id === "plus_one") level += 1;
  if (side === "boss" && item?.id === "minus_half") level -= 0.5;
  return Number(level.toFixed(2));
}
function chooseBossCard(state) {
  const legal = state.bossHand.length <= 1 ? state.bossHand : state.bossHand.filter((card) => card.key !== state.bossLastCardKey);
  if (legal.length === 0) return null;
  return rankBossCardsByPlan(state, legal)[0];
}
function rankBossCardsByPlan(state, legal) {
  const phase = state.bossPressure ?? 0;
  return [...legal].sort((a, b) => {
    const scoreB = scoreBossCard(state, b, phase, legal);
    const scoreA = scoreBossCard(state, a, phase, legal);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.key.localeCompare(b.key);
  });
}
function scoreBossCard(state, card, phase, legal) {
  const personaId = state.bossPersona?.id ?? "gatekeeper";
  const level = adjustedLevel(card, state.weather, null, "boss", state.bossHand);
  const highest = Math.max(...legal.map((entry) => adjustedLevel(entry, state.weather, null, "boss", state.bossHand)));
  const topThree = [...legal]
    .sort((a, b) => adjustedLevel(b, state.weather, null, "boss", state.bossHand) - adjustedLevel(a, state.weather, null, "boss", state.bossHand))
    .slice(0, 3)
    .map((entry) => entry.key);
  let score = 0;

  if (phase >= 3) score += level === highest ? 120 : level * 10;
  if (card.type === "能力卡") score += personaId === "strategist" || phase === 0 ? 90 : 12;

  if (personaId === "gatekeeper") {
    if (phase <= 1) score += 20 - Math.abs(level - 2) * 8;
    if (phase === 2) score += canBeatLikelyPlayerCard(state, card) ? 55 : level * 5;
    if ((card.id === "king" || card.id === "commoner") && phase < 2) score -= 18;
  } else if (personaId === "sentinel") {
    score += phase <= 1 ? (4 - level) * 8 : level * 8;
    if ((card.id === "king" || card.id === "commoner") && phase < 3) score -= 24;
    if (phase === 3 && card.id === "commoner" && legal.length > 1) score -= 20;
  } else if (personaId === "strategist") {
    if (card.id === "commoner" && state.playerHand.some((playerCard) => playerCard.id === "king")) score += phase < 3 ? 35 : 8;
    if (phase === 2 && wouldBreakPlayerPattern(state)) score += cardLikelyWins(state, card) ? 50 : 18;
    score += card.type === "额外功能卡" ? 20 : 0;
  } else if (personaId === "four_symbols") {
    if (card.id.startsWith("four_")) score += phase <= 2 ? 80 : 35;
    score += level * (phase >= 2 ? 10 : 4);
  } else if (personaId === "gambler") {
    if (card.type === "额外功能卡") score += 55;
    if (["false_god", "fate", "assassin"].includes(card.id)) score += 35;
    if (phase >= 3) score += topThree.includes(card.key) ? 70 : 0;
    score += deterministicRange(card.key + state.round, -8, 16);
  } else if (personaId === "executioner") {
    score += level * 14;
    if (cardLikelyWins(state, card)) score += 45;
    if (wouldExtendBossWinPattern(state, card)) score += 30;
  } else if (personaId === "king") {
    score += phase <= 1 ? 22 - Math.abs(level - 2.3) * 6 : level * 10;
    if (card.id === "commoner" && state.playerHand.some((playerCard) => playerCard.id === "king")) score += phase < 3 ? 55 : 18;
    if (card.id === "king" && state.playerHand.some((playerCard) => playerCard.id === "commoner")) score -= 28;
  }

  if (state.bossPattern.at(-1) === "loss") score += level * 4;
  if (state.bossHand.length <= 3) score += level * 2;
  return score;
}
function applyMoves(state, side, logs) {
  const isPlayer = side === "player";
  const selected = isPlayer ? sanitizeCustomMoves(state.customMoves) : state.selectedBossMoves;
  const pattern = isPlayer ? state.playerPattern : state.bossPattern;
  let next = state;
  for (const selectedMove of selected) {
    const move = isPlayer ? selectedMove : bossMoveLibrary.find((entry) => entry.id === selectedMove);
    if (!move || !endsWithPattern(pattern, move.pattern)) continue;
    const buffBonus = isPlayer && hasBuff(state, "player_move_plus") ? 1 : 0;
    const baseDamage = isPlayer ? sequenceDamageByLength[move.pattern.length] ?? 0 : move.damage;
    const damage = baseDamage + buffBonus + (isPlayer ? state.bossCollapseStacks : state.playerCollapseStacks);
    if (isPlayer) { next = { ...next, bossHp: Math.max(0, next.bossHp - damage) }; logs.push(`玩家触发招式【${move.name}】，Boss 受到 ${damage} 点伤害。`); }
    else { next = { ...next, playerHp: Math.max(0, next.playerHp - damage) }; logs.push(`Boss 触发招式【${move.name}】，玩家受到 ${damage} 点伤害。`); }
  }
  return next;
}
function handleCollapse(state, side, logs) {
  const isPlayer = side === "player";
  const targetName = isPlayer ? "玩家" : "Boss";
  const maxHp = isPlayer ? state.playerMaxHp : state.bossMaxHp;
  let damage = state.weather === "warm" ? maxHp : Math.ceil(maxHp / 2);
  if (isPlayer && hasBuff(state, "collapse_guard")) damage = Math.max(1, damage - 3);
  let next = { ...state };
  if (isPlayer) {
    next.playerHp = Math.max(0, next.playerHp - damage);
    logs.push(`${targetName}牌组被打空，进入崩溃状态，受到终极招式 ${damage} 点伤害。`);
    if (next.playerHp <= 0) { next.winner = "boss"; logs.push("玩家在崩溃伤害中倒下，Boss 获胜。"); return next; }
    next.playerCollapseStacks += 1; next.playerHand = shuffleLike([...next.playerDiscard]); next.playerDiscard = []; next.playerLastCardKey = null;
    logs.push("玩家未被击败，重洗弃牌继续战斗，并获得 1 层崩溃负面状态。");
  } else {
    next.bossHp = Math.max(0, next.bossHp - damage);
    logs.push(`${targetName}牌组被打空，进入崩溃状态，受到终极招式 ${damage} 点伤害。`);
    if (next.bossHp <= 0) { next.winner = "player"; logs.push("Boss 在崩溃伤害中倒下，玩家获胜。"); return next; }
    next.bossCollapseStacks += 1; next.bossHand = shuffleLike([...next.bossDiscard]); next.bossDiscard = []; next.bossLastCardKey = null; next = syncRevealedBossCards(next);
    logs.push("Boss 未被击败，重洗弃牌继续战斗，并获得 1 层崩溃负面状态。");
  }
  return next;
}
function nextBossPressure(state, bossResult, logs) {
  const current = state.bossPressure ?? 0;
  if (current >= 3) {
    logs.push("Boss 压力爆发：本回合按满压力规则出牌，压力清零。");
    return 0;
  }
  if (bossResult === "loss") return Math.min(3, current + 1);
  if (bossResult === "win") return Math.max(0, current - 1);
  return current;
}
function cardLikelyWins(state, bossCard) {
  return state.playerHand.some((playerCard) => compareCards(playerCard, bossCard, state.weather, null, { playerHandBeforePlay: state.playerHand, bossHandBeforePlay: state.bossHand, activeBuffs: state.initialBuffs ?? [] }).boss === "win");
}
function canBeatLikelyPlayerCard(state, bossCard) {
  const visible = state.playerHand.filter((card) => card.key !== state.playerLastCardKey);
  return visible.some((playerCard) => compareCards(playerCard, bossCard, state.weather, null, { playerHandBeforePlay: state.playerHand, bossHandBeforePlay: state.bossHand, activeBuffs: state.initialBuffs ?? [] }).boss === "win");
}
function wouldBreakPlayerPattern(state) {
  const pattern = state.playerPattern ?? [];
  return pattern.at(-1) === "win" || pattern.slice(-2).every((entry) => entry === "win");
}
function wouldExtendBossWinPattern(state, card) {
  return state.bossPattern.at(-1) === "win" || cardLikelyWins(state, card);
}
function trimPattern(pattern) { return pattern.slice(-6); }
function pickChaoticPlayerCard(cards, round) {
  const index = Math.abs((round * 37 + cards.length * 11) % cards.length);
  return cards[index];
}
function deterministicRange(key, min, max) {
  const text = String(key ?? "");
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return min + (hash % (max - min + 1));
}
function endsWithPattern(history, pattern) { return history.length >= pattern.length && pattern.every((entry, index) => history[history.length - pattern.length + index] === entry); }
function shuffleLike(cards) { return cards.map((card, index) => ({ card, rank: (index * 37 + 11) % 97 })).sort((a, b) => a.rank - b.rank).map((entry) => entry.card); }
function addLog(state, tone, text) { return addLogs(state, [text], tone); }
function addLogs(state, entries, tone = "info") { const start = state.logs.length; const logs = entries.map((entry, index) => ({ id: start + index, tone, text: entry })); return { ...state, logs: [...logs, ...state.logs].slice(0, 80) }; }
function formatRoundLog(round, playerCard, bossCard, result, item) { const itemText = item ? `，使用【${item.name}】` : ""; return `第 ${round} 回合：玩家出【${playerCard.name}】(${result.playerLevel})，Boss 出【${bossCard.name}】(${result.bossLevel})${itemText}，结果：${outcomeText(result.player)}。${result.reason}。`; }
function outcomeText(outcome) { if (outcome === "win") return "玩家胜"; if (outcome === "loss") return "玩家负"; return "双方失败"; }
function weatherName(weather) { const names = { clear: "晴朗", rain: "雨季", sun: "烈日", hail: "冰雹", warm: "暖风" }; return names[weather] ?? weather; }


