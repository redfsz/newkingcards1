import {
  bossMoveLibrary,
  bossPersonaLibrary,
  cardLibrary,
  defaultCustomMoves,
  initialBuffLibrary,
  itemLibrary,
  levelPresets,
  playerUltimateLibrary,
  requiredDeckCards,
  sequenceDamageByLength,
  wagerLibrary
} from "./gameData.js";

const byId = new Map(cardLibrary.map((card) => [card.id, card]));
const itemById = new Map(itemLibrary.map((item) => [item.id, item]));
const wagerById = new Map(wagerLibrary.map((wager) => [wager.id, wager]));
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
    floor: normalized.floor,
    battleType: normalized.battleType,
    battleRule: normalized.battleRule,
    bossSkills: normalized.bossSkills,
    usedBossSkillRounds: [],
    bossDamageReduction: 0,
    bossWinBonus: 0,
    bossMoveDamageBonus: 0,
    fourSymbolBonus: 0,
    fourSymbolRitual: 0,
    ignoreNextBossLossSequence: false,
    sentinelCollapseShieldUsed: false,
    playerTriggeredMoveLengths: [],
    bossPersona: persona,
    basePlayerMaxHp: normalized.playerMaxHp,
    baseBossMaxHp: normalized.bossMaxHp,
    baseRevealCount: normalized.revealCount,
    playerUltimateLevel: normalized.playerUltimateLevel,
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
    playerForcedLoss: false,
    bossForcedLoss: false,
    playerForcedWin: false,
    bossForcedWin: false,
    levelOrderReversed: false,
    playerCivilized: false,
    bossCivilized: false,
    playerWarmDay: false,
    bossWarmDay: false,
    playerSnowflake: false,
    bossSnowflake: false,
    playerEvenForm: false,
    bossEvenForm: false,
    playerOddForm: false,
    bossOddForm: false,
    playerExponentialForm: false,
    bossExponentialForm: false,
    playerDaydream: false,
    bossDaydream: false,
    playerFourWins: [],
    bossFourWins: [],
    playerPattern: [],
    bossPattern: [],
    playerRoundDamage: 0,
    bossRoundDamage: 0,
    firstCollapseSide: null,
    playerCollapseStacks: 0,
    bossCollapseStacks: 0,
    bossPressure: 0,
    wagerChoices: pickWagerChoices(normalized.id),
    selectedWagerId: "",
    resolvedWagerIds: [],
    customMoves: normalized.customMoves,
    selectedBossMoves: normalized.selectedBossMoves,
    ownedItems: normalized.ownedItems,
    initialBuffs: normalized.initialBuffs,
    activeItemId: "",
    revealCount: effective.revealCount,
    round: 1,
    winner: null,
    logs: [
      { id: 0, tone: "info", text: `载入战斗：${normalized.name}。对手：${persona.name}（${persona.style}）。初始 Buff：${buffNames}。${normalized.battleRule ? `规则：${normalized.battleRule.name}，${normalized.battleRule.text}` : ""}` }
    ]
  };
}

export function stateToLevelConfig(state) {
  return normalizeLevelConfig({
    id: state.currentLevelId || "custom_level",
    name: state.currentLevelName || "自定义关卡",
    floor: state.floor ?? 1,
    battleType: state.battleType ?? "boss",
    playerMaxHp: state.basePlayerMaxHp ?? state.playerMaxHp,
    playerUltimateLevel: state.playerUltimateLevel ?? 1,
    bossMaxHp: state.baseBossMaxHp ?? state.bossMaxHp,
    weather: state.weather,
    bossPersona: state.bossPersona?.id ?? state.bossPersona ?? "gatekeeper",
    revealCount: state.baseRevealCount ?? state.revealCount,
    initialBuffs: state.initialBuffs ?? [],
    playerDeck: collectDeckIds(state.playerHand, state.playerDiscard),
    bossDeck: collectDeckIds(state.bossHand, state.bossDiscard),
    customMoves: state.customMoves,
    selectedBossMoves: state.selectedBossMoves,
    battleRule: state.battleRule,
    bossSkills: state.bossSkills,
    levelOrderReversed: state.levelOrderReversed ?? false,
    ownedItems: state.ownedItems
  });
}

export function normalizeLevelConfig(config) {
  const fallback = levelPresets[0];
  const source = config ?? fallback;
  return {
    id: String(source.id || "custom_level"),
    name: String(source.name || "自定义关卡"),
    floor: clampNumber(source.floor, 1, 7, fallback.floor ?? 1),
    battleType: ["npc", "duel", "boss"].includes(source.battleType) ? source.battleType : "boss",
    playerMaxHp: clampNumber(source.playerMaxHp, 1, 99, fallback.playerMaxHp),
    playerUltimateLevel: clampNumber(source.playerUltimateLevel, 1, 4, defaultUltimateLevel(source.floor ?? fallback.floor ?? 1)),
    bossMaxHp: clampNumber(source.bossMaxHp, 1, 99, fallback.bossMaxHp),
    weather: source.weather || "clear",
    bossPersona: personaById.has(source.bossPersona) ? source.bossPersona : fallback.bossPersona ?? "gatekeeper",
    revealCount: clampNumber(source.revealCount, 0, 10, fallback.revealCount),
    initialBuffs: sanitizeIds(source.initialBuffs, initialBuffLibrary, [], initialBuffLibrary.length, true),
    playerDeck: sanitizeDeck(source.playerDeck, "player"),
    bossDeck: sanitizeDeck(source.bossDeck, "boss"),
    customMoves: sanitizeCustomMoves(source.customMoves, source.selectedMoves),
    selectedBossMoves: sanitizeIds(source.selectedBossMoves, bossMoveLibrary, fallback.selectedBossMoves, 10),
    battleRule: sanitizeBattleRule(source.battleRule),
    bossSkills: sanitizeBossSkills(source.bossSkills),
    levelOrderReversed: Boolean(source.levelOrderReversed),
    ownedItems: sanitizeIds(source.ownedItems, itemLibrary, fallback.ownedItems, itemLibrary.length)
  };
}

export function createCards(ids, owner) {
  return (Array.isArray(ids) ? ids : [])
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((card) => ({
      ...card,
      key: `${owner}-${nextInstance++}-${card.id}`
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
  return setCardCountInDeck(state, side, cardId, countCardsById([...state[side === "player" ? "playerHand" : "bossHand"], ...state[side === "player" ? "playerDiscard" : "bossDiscard"]], cardId) > 0 ? 0 : 1);
}

export function setCardCountInDeck(state, side, cardId, count) {
  const card = byId.get(cardId);
  if (!card) return state;
  if (isOneTimeCard(card)) return addLog(state, "warn", "一次性牌属于道具牌，请在道具栏配置数量，不进入战斗卡组。");
  const nextCount = requiredDeckCards.includes(cardId) ? 1 : clampNumber(count, 0, 9, 0);

  const handKey = side === "player" ? "playerHand" : "bossHand";
  const discardKey = side === "player" ? "playerDiscard" : "bossDiscard";
  const others = [...state[handKey], ...state[discardKey]].filter((entry) => entry.id !== cardId);
  if (others.length + nextCount > 10) return addLog(state, "warn", "出战牌最多 10 张，先减少其他牌的数量。");
  const prefix = side === "player" ? "p" : "b";
  const next = { ...state, [handKey]: [...others, ...createCards(Array.from({ length: nextCount }, () => cardId), prefix)], [discardKey]: [] };
  return side === "boss" ? syncRevealedBossCards(next) : next;
}

export function toggleMove(state, moveId, side = "player") {
  if (side === "player") return state;
  const key = side === "player" ? "selectedMoves" : "selectedBossMoves";
  const selected = state[key];
  if (selected.includes(moveId)) return { ...state, [key]: selected.filter((id) => id !== moveId) };
  if (selected.length >= 10) return addLog(state, "warn", "Boss 最多携带 10 个招式。");
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
  return setItemCount(state, itemId, countItems(state.ownedItems, itemId) > 0 ? 0 : 1);
}

export function setItemCount(state, itemId, count) {
  if (!itemById.has(itemId)) return state;
  const nextCount = clampNumber(count, 0, 9, 0);
  const others = (state.ownedItems ?? []).filter((id) => id !== itemId);
  const ownedItems = [...others, ...Array.from({ length: nextCount }, () => itemId)];
  return { ...state, ownedItems, activeItemId: nextCount === 0 && state.activeItemId === itemId ? "" : state.activeItemId };
}

export function chooseItem(state, itemId) {
  if (!state.ownedItems.includes(itemId)) return state;
  return { ...state, activeItemId: state.activeItemId === itemId ? "" : itemId };
}

export function chooseWager(state, wagerId) {
  const wager = wagerById.get(wagerId);
  if (!wager || !(state.wagerChoices ?? []).includes(wagerId)) return state;
  if (state.round > 1 || state.selectedWagerId || state.winner) return state;
  return addLog({ ...state, selectedWagerId: wagerId }, "info", `额外赌局开始：【${wager.name}】。`);
}

export function playRound(state, playerCardKey) {
  if (state.winner) return state;
  let prepared = applyRoundStartEffects(state);
  const legalCards = getLegalPlayerCards(prepared);
  const selectedPlayerCardKey = hasBuff(state, "chaotic_battlefield") && state.round <= 2 && legalCards.length > 0
    ? pickChaoticPlayerCard(legalCards, state.round).key
    : playerCardKey;
  const rawPlayerCard = prepared.playerHand.find((card) => card.key === selectedPlayerCardKey);
  if (!rawPlayerCard) return prepared;
  if (!legalCards.some((card) => card.key === playerCardKey)) return addLog(prepared, "warn", "不能连续两次出同一张牌，除非可出牌只剩一张。");

  const rawBossCard = chooseBossCard(prepared);
  if (!rawBossCard) return handleCollapse(prepared, "boss", ["Boss 没有可出牌，进入崩溃状态。"]);
  const item = itemById.get(prepared.activeItemId);
  const playerCard = resolvePlayedCard(rawPlayerCard, "player", prepared);
  const bossCard = bossCardDisabledByItem(rawBossCard, item)
    ? { ...rawBossCard, id: "disabled_card", name: `${rawBossCard.name}(失效)`, level: 0, levelOverride: 0, type: rawBossCard.type }
    : resolvePlayedCard(rawBossCard, "boss", prepared);

  let next = { ...prepared, playerHand: prepared.playerHand.filter((card) => card.key !== rawPlayerCard.key), bossHand: prepared.bossHand.filter((card) => card.key !== rawBossCard.key), activeItemId: "", ownedItems: consumeItem(prepared.ownedItems, prepared.activeItemId), playerRoundDamage: 0, bossRoundDamage: 0 };
  const result = compareCards(playerCard, bossCard, prepared.weather, item, {
    playerHandBeforePlay: prepared.playerHand,
    bossHandBeforePlay: prepared.bossHand,
    playerCivilized: prepared.playerCivilized,
    bossCivilized: prepared.bossCivilized,
    playerWarmDay: prepared.playerWarmDay,
    bossWarmDay: prepared.bossWarmDay,
    playerSnowflake: prepared.playerSnowflake,
    bossSnowflake: prepared.bossSnowflake,
    playerEvenForm: prepared.playerEvenForm,
    bossEvenForm: prepared.bossEvenForm,
    playerOddForm: prepared.playerOddForm,
    bossOddForm: prepared.bossOddForm,
    playerExponentialForm: prepared.playerExponentialForm,
    bossExponentialForm: prepared.bossExponentialForm,
    activeBuffs: prepared.initialBuffs ?? [],
    bossFourSymbolBonus: prepared.fourSymbolBonus,
    playerForcedLoss: prepared.playerForcedLoss,
    bossForcedLoss: prepared.bossForcedLoss,
    playerForcedWin: prepared.playerForcedWin,
    bossForcedWin: prepared.bossForcedWin,
    round: prepared.round,
    levelOrderReversed: prepared.levelOrderReversed
  });
  const logs = [];
  if (prepared.pendingLogs?.length) logs.push(...prepared.pendingLogs);
  logs.push(formatRoundLog(prepared.round, playerCard, bossCard, result, item));
  if (selectedPlayerCardKey !== playerCardKey) logs.push(`混乱战场生效：本回合随机改为打出【${playerCard.name}】。`);

  if (result.player === "win") {
    if (rawPlayerCard.id === "false_god") {
      next.playerDiscard = [...next.playerDiscard, rawPlayerCard];
      logs.push("玩家【伪神】虽然获胜，但仍进入弃牌堆。");
    } else {
      next.playerHand = [...next.playerHand, rawPlayerCard];
    }
    next.bossDiscard = [...next.bossDiscard, rawBossCard];
  } else if (result.player === "loss") {
    if (rawBossCard.id === "false_god" && result.boss === "win") {
      next.bossDiscard = [...next.bossDiscard, rawBossCard];
      logs.push("Boss【伪神】虽然获胜，但仍进入弃牌堆。");
    } else {
      next.bossHand = [...next.bossHand, rawBossCard];
    }
    if (item?.id === "save") {
      next.playerHand = [...next.playerHand, rawPlayerCard];
      logs.push("续命牌生效：本回合输掉的牌回到手牌。");
    } else next.playerDiscard = [...next.playerDiscard, rawPlayerCard];
  } else {
    next.playerDiscard = [...next.playerDiscard, rawPlayerCard];
    next.bossDiscard = [...next.bossDiscard, rawBossCard];
  }

  next.playerLastCardKey = rawPlayerCard.key;
  next.bossLastCardKey = rawBossCard.key;
  if (prepared.playerForcedLoss) {
    next.playerForcedLoss = false;
    logs.push("玩家伪神反噬：本回合自动失败。");
  }
  if (prepared.bossForcedLoss) {
    next.bossForcedLoss = false;
    logs.push("Boss 伪神反噬：本回合自动失败。");
  }
  if (prepared.playerForcedWin) {
    next.playerForcedWin = false;
    logs.push("玩家占卜师预言兑现：本回合自动胜利。");
  }
  if (prepared.bossForcedWin) {
    next.bossForcedWin = false;
    logs.push("Boss 占卜师预言兑现：本回合自动胜利。");
  }
  if (rawPlayerCard.id === "false_god" && !prepared.playerForcedLoss) {
    next.playerForcedLoss = true;
    logs.push("玩家打出【伪神】：本次必胜，下回合自动失败。");
  }
  if (rawBossCard.id === "false_god" && !prepared.bossForcedLoss) {
    next.bossForcedLoss = true;
    logs.push("Boss 打出【伪神】：本次必胜，下回合自动失败。");
  }
  if (rawPlayerCard.id === "fortune_teller") {
    next.playerForcedWin = true;
    logs.push("玩家打出【占卜师】：本次自动失败，下回合自动胜利。");
  }
  if (rawBossCard.id === "fortune_teller") {
    next.bossForcedWin = true;
    logs.push("Boss 打出【占卜师】：本次自动失败，下回合自动胜利。");
  }
  if (rawPlayerCard.id === "perfect_match" || rawBossCard.id === "perfect_match") {
    next.levelOrderReversed = !prepared.levelOrderReversed;
    logs.push(next.levelOrderReversed
      ? "【天作之合】生效：等级排序反转，之后低等级牌会战胜高等级牌。"
      : "【天作之合】再次生效：等级排序恢复，之后高等级牌会战胜低等级牌。");
  }
  if (rawPlayerCard.id === "civilization") {
    next.playerCivilized = true;
    logs.push("玩家打出【文明】：本场之后，玩家所有手牌视为国王。");
  }
  if (rawBossCard.id === "civilization") {
    next.bossCivilized = true;
    logs.push("Boss 打出【文明】：本场之后，Boss 所有手牌视为国王。");
  }
  if (rawPlayerCard.id === "thief" && result.player === "win") {
    next.bossHp = Math.max(0, next.bossHp - 5);
    next.playerRoundDamage += 5;
    logs.push("玩家【盗贼】获胜：Boss 额外受到 5 点伤害。");
  }
  if (rawBossCard.id === "thief" && result.boss === "win") {
    next.playerHp = Math.max(0, next.playerHp - 5);
    next.bossRoundDamage += 5;
    logs.push("Boss【盗贼】获胜：玩家额外受到 5 点伤害。");
  }
  if (item?.id === "regret") {
    next = recoverPlayerCard(next, rawPlayerCard.key, logs);
  }
  next = checkRestrictionWagers(next, rawPlayerCard, item, logs);
  if (bossCardDisabledByItem(rawBossCard, item)) logs.push(`${item.name}生效：Boss 的【${rawBossCard.name}】本回合失效。`);
  else next = applyCardAfterPlay(next, rawBossCard, "boss", result.boss, logs);
  next = applyCardAfterPlay(next, rawPlayerCard, "player", result.player, logs);
  const playerResultForPattern = next.ignoreNextBossLossSequence && result.boss === "loss" ? null : result.player;
  if (next.ignoreNextBossLossSequence && result.boss === "loss") {
    next.ignoreNextBossLossSequence = false;
    logs.push("伪神降桌生效：Boss 本次失败不增加玩家胜负序列。");
  }
  next.playerPattern = trimPattern(playerResultForPattern ? [...next.playerPattern, playerResultForPattern] : next.playerPattern);
  next.bossPattern = trimPattern([...next.bossPattern, result.boss]);
  next = applyRuleAfterResult(next, result, bossCard, logs);
  next = checkRoundWagers(next, result, logs);
  next.bossPressure = nextBossPressure(next, result.boss, logs);
  next = applyMoves(next, "player", logs);
  next = applyMoves(next, "boss", logs);
  next = checkDamageWagers(next, logs);
  next.bossDamageReduction = 0;

  if (next.bossHp <= 0) { next.winner = "player"; logs.push("Boss 生命归零，玩家获胜。"); }
  else if (next.playerHp <= 0) { next.winner = "boss"; logs.push("玩家生命归零，Boss 获胜。"); }
  if (!next.winner && next.playerHand.length === 0) next = handleCollapse(next, "player", logs);
  if (!next.winner && next.bossHand.length === 0) next = handleCollapse(next, "boss", logs);
  next = checkRestrictionWagers(next, null, null, logs);

  next = checkEndWagers(next, logs);
  next.round += 1;
  return addLogs(next, logs);
}

export function setWeather(state, weather) { return addLog({ ...state, weather }, "info", `天气切换为：${weatherName(weather)}。`); }
export function setRevealCount(state, revealCount) {
  return syncRevealedBossCards({ ...state, baseRevealCount: clampNumber(revealCount, 0, 10, 0), revealCount: clampNumber(revealCount, 0, 10, 0) });
}
export function setMaxHp(state, side, value) {
  const nextMax = clampNumber(value, 1, 99, 1);
  if (side === "player") {
    const delta = nextMax - state.playerMaxHp;
    return { ...state, basePlayerMaxHp: nextMax, playerMaxHp: nextMax, playerHp: Math.max(1, Math.min(nextMax, state.playerHp + delta)) };
  }
  const delta = nextMax - state.bossMaxHp;
  return { ...state, baseBossMaxHp: nextMax, bossMaxHp: nextMax, bossHp: Math.max(1, Math.min(nextMax, state.bossHp + delta)) };
}
export function setPlayerUltimateLevel(state, value) {
  return { ...state, playerUltimateLevel: clampNumber(value, 1, 4, state.playerUltimateLevel ?? 1) };
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
    if (requiredDeckCards.includes(id)) continue;
    clean.push(id);
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
function sanitizeBattleRule(rule) {
  if (!rule || typeof rule !== "object") return null;
  return {
    id: String(rule.id || "custom_rule"),
    name: String(rule.name || "特殊规则"),
    text: String(rule.text || "")
  };
}
function sanitizeBossSkills(skills) {
  if (!Array.isArray(skills)) return [];
  return skills.slice(0, 3).map((skill, index) => ({
    round: clampNumber(skill.round, 1, 99, index + 2),
    name: String(skill.name || `Boss 技能 ${index + 1}`),
    effect: String(skill.effect || "none"),
    value: Number.isFinite(Number(skill.value)) ? Number(skill.value) : 1,
    text: String(skill.text || "")
  }));
}
function defaultUltimateLevel(floor) { return Math.max(1, Math.min(4, Math.ceil(Number(floor || 1) / 2))); }
function playerUltimateInfo(level) { return playerUltimateLibrary.find((entry) => entry.level === level) ?? playerUltimateLibrary[0]; }
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
      ? move.pattern.filter(isPatternStep).slice(0, 6)
      : fallback.pattern;
    return {
      id: fallback.id,
      name: String(move.name || fallback.name),
      pattern: pattern.length > 0 ? pattern : fallback.pattern
    };
  });
}
function collectDeckIds(hand, discard) { return [...hand, ...discard].map((card) => card.id); }
function countCardsById(cards, cardId) { return cards.filter((card) => card.id === cardId).length; }
function countItems(items, itemId) { return (items ?? []).filter((id) => id === itemId).length; }
function consumeItem(items, itemId) {
  if (!itemId) return items;
  let consumed = false;
  return (items ?? []).filter((id) => {
    if (!consumed && id === itemId) {
      consumed = true;
      return false;
    }
    return true;
  });
}
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
function bossCardDisabledByItem(card, item) {
  return (item?.id === "disable_function" && card.type === "额外功能卡")
    || (item?.id === "disable_ability" && card.type === "能力卡");
}
function resolvePlayedCard(card, side, state) {
  if (!card) return card;
  const opponentLastKey = side === "player" ? state.bossLastCardKey : state.playerLastCardKey;
  const opponentCards = side === "player"
    ? [...state.bossHand, ...state.bossDiscard]
    : [...state.playerHand, ...state.playerDiscard];
  if (card.id === "shadow") {
    const copied = opponentCards.find((entry) => entry.key === opponentLastKey);
    if (copied) return { ...card, id: copied.id, name: `影子(${copied.name})`, level: copied.level, copiedFrom: copied.id };
  }
  if (card.id === "fate") {
    const level = deterministicRange(`${card.key}-${state.round}`, 1, 3);
    return { ...card, name: `命运(${level})`, levelOverride: level };
  }
  if (card.id === "daydream") {
    const replacement = randomPlayableCard(`${card.key}-${state.round}`);
    return { ...card, id: replacement.id, name: `白日梦(${replacement.name})`, level: replacement.level, daydreamAs: replacement.id };
  }
  return card;
}
function compareCards(playerCard, bossCard, weather, item, context = {}) {
  const playerEffectiveId = effectiveCardId(playerCard, context.playerHandBeforePlay, context.playerCivilized);
  const bossEffectiveId = effectiveCardId(bossCard, context.bossHandBeforePlay, context.bossCivilized);
  const playerLevel = adjustedLevel(playerCard, weather, item, "player", context.playerHandBeforePlay, context.activeBuffs, context);
  const bossLevel = adjustedLevel(bossCard, weather, item, "boss", context.bossHandBeforePlay, [], context) + (bossCard.id.startsWith("four_") ? context.bossFourSymbolBonus ?? 0 : 0);
  const playerForcedWin = playerCard.id === "false_god" && !context.playerForcedLoss;
  const bossForcedWin = bossCard.id === "false_god" && !context.bossForcedLoss;
  if (context.playerForcedLoss && context.bossForcedLoss) return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "双方伪神反噬，双方失败" };
  if (context.playerForcedLoss) return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "玩家伪神反噬，自动失败" };
  if (context.bossForcedLoss) return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "Boss 伪神反噬，自动失败" };
  if (context.playerForcedWin && context.bossForcedWin) return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "双方占卜预言同时兑现，双方失败" };
  if (context.playerForcedWin) return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "玩家占卜预言兑现，自动胜利" };
  if (context.bossForcedWin) return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "Boss 占卜预言兑现，自动胜利" };
  if (playerCard.id === "fortune_teller" && bossCard.id === "fortune_teller") return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "双方都打出占卜师，本次双方失败" };
  if (playerCard.id === "fortune_teller") return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "占卜师本次自动失败" };
  if (bossCard.id === "fortune_teller") return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "Boss 占卜师本次自动失败" };
  if (playerForcedWin && bossForcedWin) return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "双方都打出伪神，双方失败" };
  if (playerForcedWin) return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "玩家伪神生效，本次必胜" };
  if (bossForcedWin) return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "Boss 伪神生效，本次必胜" };
  if (playerCard.id === "assassin" || bossCard.id === "assassin") return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "刺客强制双方失败" };
  if (playerEffectiveId === "commoner" && bossEffectiveId === "king") return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "平民克制国王" };
  if (bossEffectiveId === "commoner" && playerEffectiveId === "king") return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "平民克制国王" };
  if (context.levelOrderReversed) {
    if (playerLevel < bossLevel) return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "天作之合生效，低等级获胜" };
    if (playerLevel > bossLevel) return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "天作之合生效，低等级获胜" };
  } else {
    if (playerLevel > bossLevel) return { player: "win", boss: "loss", playerLevel, bossLevel, reason: "高等级获胜" };
    if (playerLevel < bossLevel) return { player: "loss", boss: "win", playerLevel, bossLevel, reason: "高等级获胜" };
  }
  return { player: "draw", boss: "draw", playerLevel, bossLevel, reason: "同等级双方失败" };
}
function effectiveCardId(card, handBeforePlay = [], civilized = false) {
  if (civilized) return "king";
  if (card.id === "regicide") return handBeforePlay.some((handCard) => handCard.id === "king") ? card.id : "king";
  if (card.id === "rebel") return handBeforePlay.some((handCard) => handCard.id === "minister") ? card.id : "minister";
  if (card.id === "beggar") return handBeforePlay.some((handCard) => handCard.id === "commoner") ? card.id : "commoner";
  return card.id;
}
function adjustedLevel(card, weather, item, side, handBeforePlay = [], activeBuffs = [], context = {}) {
  let level = card.levelOverride ?? card.level;
  const civilized = side === "player" ? context.playerCivilized : context.bossCivilized;
  if (side === "player") {
    if (card.id === "commoner" && activeBuffs.includes("random_commoner")) level = deterministicRange(card.key, 0, 2);
    if (card.id === "king" && activeBuffs.includes("random_king")) level = deterministicRange(card.key, 0, 4);
  }
  const effective = effectiveCardId(card, handBeforePlay, civilized);
  if (effective === "king" && card.id !== "king") level = 3;
  if (effective === "minister" && card.id !== "minister") level = 2;
  if (effective === "commoner" && card.id !== "commoner") level = 1;
  if (Number.isFinite(level) && Math.abs(level % 1 - 0.5) < 0.01) { if (weather === "sun") level -= 0.5; if (weather === "hail") level += 0.5; }
  if (Number.isFinite(level) && Math.abs(level % 1 - 0.5) < 0.01) {
    if (side === "player" && context.playerWarmDay) level += 0.25;
    if (side === "boss" && context.bossWarmDay) level += 0.25;
    if (side === "player" && context.bossSnowflake) level -= 0.25;
    if (side === "boss" && context.playerSnowflake) level -= 0.25;
  }
  if (side === "player" && context.playerEvenForm && context.round % 2 === 0) level += 1;
  if (side === "boss" && context.bossEvenForm && context.round % 2 === 0) level += 1;
  if (side === "player" && context.playerOddForm && context.round % 2 === 1) level += 1;
  if (side === "boss" && context.bossOddForm && context.round % 2 === 1) level += 1;
  if (side === "player" && context.playerExponentialForm) level *= level;
  if (side === "boss" && context.bossExponentialForm) level *= level;
  if (side === "player" && item?.id === "plus_half") level += 0.5;
  if (side === "player" && item?.id === "plus_one") level += 1;
  if (side === "boss" && item?.id === "minus_half") level -= 0.5;
  if (side === "boss" && item?.id === "minus_one") level -= 1;
  return Number(level.toFixed(2));
}
function applyCardAfterPlay(state, card, side, outcome, logs) {
  let next = state;
  const isPlayer = side === "player";
  const sideName = isPlayer ? "玩家" : "Boss";
  const handKey = isPlayer ? "playerHand" : "bossHand";
  const discardKey = isPlayer ? "playerDiscard" : "bossDiscard";
  const opponentHandKey = isPlayer ? "bossHand" : "playerHand";
  const opponentDiscardKey = isPlayer ? "bossDiscard" : "playerDiscard";
  const flagPrefix = isPlayer ? "player" : "boss";

  if (card.id === "warm_day") {
    next = { ...next, [`${flagPrefix}WarmDay`]: true };
    logs.push(`${sideName}打出【暖日】：本场之后己方所有 .5 等级牌 +0.25。`);
  } else if (card.id === "snowflake") {
    next = { ...next, [`${flagPrefix}Snowflake`]: true };
    logs.push(`${sideName}打出【雪花】：本场之后敌方所有 .5 等级牌 -0.25。`);
  } else if (card.id === "even_form") {
    next = { ...next, [`${flagPrefix}EvenForm`]: true };
    logs.push(`${sideName}打出【偶数形态】：本场之后己方偶数回合等级 +1。`);
  } else if (card.id === "odd_form") {
    next = { ...next, [`${flagPrefix}OddForm`]: true };
    logs.push(`${sideName}打出【奇数形态】：本场之后己方奇数回合等级 +1。`);
  } else if (card.id === "exponential_form") {
    next = { ...next, [`${flagPrefix}ExponentialForm`]: true };
    logs.push(`${sideName}打出【指数形态】：本场之后己方出牌等级变为平方，并会额外弃掉 1 张手牌。`);
  } else if (card.id === "daydream") {
    next = { ...next, [`${flagPrefix}Daydream`]: true };
    logs.push(`${sideName}打出【白日梦】：本场之后每回合开始时，将 1 张手牌替换为随机牌。`);
  } else if (card.id === "all_in") {
    next = doubleOneHandCard(next, handKey, logs, sideName);
  } else if (card.id === "hope") {
    next = recoverOwnDiscard(next, handKey, discardKey, logs, sideName);
  } else if (card.id === "demon") {
    next = discardOpponentCard(next, opponentHandKey, opponentDiscardKey, logs, sideName);
  } else if (card.id === "forge_blade") {
    next = updateCardLevel(next, card.key, 0.1);
    logs.push(`${sideName}打出【铸剑】：这张牌等级永久 +0.1。`);
  } else if (card.id === "strike_blade") {
    next = updateCardLevel(next, card.key, -0.1);
    logs.push(`${sideName}打出【挥剑】：这张牌等级永久 -0.1。`);
  } else if (card.id === "final_moment") {
    next = keepCoreCardsOnly(next);
    logs.push(`${sideName}打出【最终时刻】：双方弃掉手牌中除国王、大臣、平民外的所有牌。`);
  } else if (card.id === "golden_necklace") {
    logs.push(`${sideName}打出【金色项链】：这是经济效果，当前模拟器不改变战斗结算。`);
  }

  if (card.id.startsWith("four_") && outcome === "win") {
    const winsKey = isPlayer ? "playerFourWins" : "bossFourWins";
    const wins = new Set(next[winsKey] ?? []);
    wins.add(card.id);
    next = { ...next, [winsKey]: [...wins] };
    logs.push(`${sideName}四象进度：${wins.size}/4。`);
    if (wins.size >= 4) {
      next = { ...next, winner: side };
      logs.push(`${sideName}四象全部获胜一次，直接获得战斗胜利。`);
    }
  }

  if ((isPlayer ? next.playerExponentialForm : next.bossExponentialForm) && card.id !== "exponential_form") {
    next = discardExtraHandCard(next, handKey, discardKey, logs, sideName);
  }
  if (!isPlayer) next = syncRevealedBossCards(next);
  return next;
}
function doubleOneHandCard(state, handKey, logs, sideName) {
  const target = state[handKey].find((entry) => entry.type !== "一次性卡牌");
  if (!target) return state;
  const nextHand = state[handKey].map((entry) => entry.key === target.key ? { ...entry, levelOverride: Number(((entry.levelOverride ?? entry.level) * 2).toFixed(2)) } : entry);
  logs.push(`${sideName}打出【孤注一掷】：【${target.name}】等级翻倍。`);
  return { ...state, [handKey]: nextHand };
}
function recoverOwnDiscard(state, handKey, discardKey, logs, sideName) {
  const target = state[discardKey][0];
  if (!target) return state;
  logs.push(`${sideName}打出【希望】：【${target.name}】从弃牌堆回到手牌。`);
  return { ...state, [discardKey]: state[discardKey].slice(1), [handKey]: [...state[handKey], target] };
}
function discardOpponentCard(state, handKey, discardKey, logs, sideName) {
  const target = state[handKey][0];
  if (!target) return state;
  logs.push(`${sideName}打出【恶魔】：对方【${target.name}】被移入弃牌堆。`);
  return { ...state, [handKey]: state[handKey].slice(1), [discardKey]: [...state[discardKey], target] };
}
function updateCardLevel(state, cardKey, delta) {
  const update = (cards) => cards.map((entry) => entry.key === cardKey ? { ...entry, level: Math.max(0, Number((entry.level + delta).toFixed(2))) } : entry);
  return {
    ...state,
    playerHand: update(state.playerHand),
    playerDiscard: update(state.playerDiscard),
    bossHand: update(state.bossHand),
    bossDiscard: update(state.bossDiscard)
  };
}
function keepCoreCardsOnly(state) {
  const isCore = (card) => ["king", "minister", "commoner"].includes(card.id);
  const playerMoved = state.playerHand.filter((card) => !isCore(card));
  const bossMoved = state.bossHand.filter((card) => !isCore(card));
  return syncRevealedBossCards({
    ...state,
    playerHand: state.playerHand.filter(isCore),
    playerDiscard: [...state.playerDiscard, ...playerMoved],
    bossHand: state.bossHand.filter(isCore),
    bossDiscard: [...state.bossDiscard, ...bossMoved]
  });
}
function discardExtraHandCard(state, handKey, discardKey, logs, sideName) {
  const target = state[handKey][0];
  if (!target) return state;
  logs.push(`${sideName}指数形态代价：【${target.name}】额外进入弃牌堆。`);
  return { ...state, [handKey]: state[handKey].slice(1), [discardKey]: [...state[discardKey], target] };
}
function recoverPlayerCard(state, justPlayedKey, logs) {
  const target = state.playerDiscard.find((card) => card.key !== justPlayedKey);
  if (!target) return state;
  logs.push(`后悔牌生效：【${target.name}】从弃牌堆回到手牌。`);
  return { ...state, playerDiscard: state.playerDiscard.filter((card) => card.key !== target.key), playerHand: [...state.playerHand, target] };
}
function randomPlayableCard(key) {
  const pool = cardLibrary.filter((card) => !isOneTimeCard(card) && card.id !== "daydream");
  return pool[deterministicRange(key, 0, pool.length - 1)] ?? byId.get("commoner");
}
function applyDaydreamReplacement(state, side, logs) {
  const isPlayer = side === "player";
  const handKey = isPlayer ? "playerHand" : "bossHand";
  const sideName = isPlayer ? "玩家" : "Boss";
  const candidates = state[handKey].filter((card) => !requiredDeckCards.includes(card.id));
  const target = candidates[0];
  if (!target) return state;
  const replacement = {
    ...randomPlayableCard(`${target.key}-${state.round}`),
    key: target.key,
    levelOverride: undefined
  };
  logs.push(`${sideName}白日梦生效：【${target.name}】变为【${replacement.name}】。`);
  const next = { ...state, [handKey]: state[handKey].map((card) => card.key === target.key ? replacement : card) };
  return isPlayer ? next : syncRevealedBossCards(next);
}
function chooseBossCard(state) {
  const legal = state.bossHand.length <= 1 ? state.bossHand : state.bossHand.filter((card) => card.key !== state.bossLastCardKey);
  if (legal.length === 0) return null;
  if ((state.currentLevelId === "floor_7_boss" || state.bossPersona?.id === "king") && state.round === 1) {
    const perfectMatch = legal.find((card) => card.id === "perfect_match");
    if (perfectMatch) return perfectMatch;
  }
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
  const bossContext = {
    round: state.round,
    bossCivilized: state.bossCivilized,
    bossWarmDay: state.bossWarmDay,
    bossSnowflake: state.bossSnowflake,
    playerSnowflake: state.playerSnowflake,
    bossEvenForm: state.bossEvenForm,
    bossOddForm: state.bossOddForm,
    bossExponentialForm: state.bossExponentialForm
  };
  const level = adjustedLevel(resolvePlayedCard(card, "boss", state), state.weather, null, "boss", state.bossHand, [], bossContext);
  const highest = Math.max(...legal.map((entry) => adjustedLevel(resolvePlayedCard(entry, "boss", state), state.weather, null, "boss", state.bossHand, [], bossContext)));
  const topThree = [...legal]
    .sort((a, b) => adjustedLevel(resolvePlayedCard(b, "boss", state), state.weather, null, "boss", state.bossHand, [], bossContext) - adjustedLevel(resolvePlayedCard(a, "boss", state), state.weather, null, "boss", state.bossHand, [], bossContext))
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
    if (state.levelOrderReversed) score += (4 - level) * (phase >= 2 ? 14 : 9);
    else score += phase <= 1 ? 22 - Math.abs(level - 2.3) * 6 : level * 10;
    if (card.id === "commoner" && state.playerHand.some((playerCard) => playerCard.id === "king")) score += phase < 3 ? 55 : 18;
    if (card.id === "king" && state.playerHand.some((playerCard) => playerCard.id === "commoner")) score -= 28;
    if (state.levelOrderReversed && ["thief", "beggar", "rebel", "maid"].includes(card.id)) score += 20;
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
    let damage = baseDamage + buffBonus + (isPlayer ? state.bossCollapseStacks : state.playerCollapseStacks);
    if (isPlayer) {
      damage = applyPlayerMoveRuleDamage(next, move, damage);
      damage = Math.max(1, damage - (next.bossDamageReduction ?? 0));
      next = { ...next, bossHp: Math.max(0, next.bossHp - damage), playerRoundDamage: (next.playerRoundDamage ?? 0) + damage, playerTriggeredMoveLengths: [...(next.playerTriggeredMoveLengths ?? []), move.pattern.length] };
      logs.push(`玩家触发招式【${move.name}】，Boss 受到 ${damage} 点伤害。`);
    } else {
      damage += next.bossMoveDamageBonus ?? 0;
      next = { ...next, playerHp: Math.max(0, next.playerHp - damage), bossRoundDamage: (next.bossRoundDamage ?? 0) + damage, bossMoveDamageBonus: 0 };
      logs.push(`Boss 触发招式【${move.name}】，玩家受到 ${damage} 点伤害。`);
    }
  }
  return next;
}
function applyPlayerMoveRuleDamage(state, move, damage) {
  if (state.battleRule?.id !== "king_repeat_length_penalty") return damage;
  const lengths = state.playerTriggeredMoveLengths ?? [];
  return lengths.includes(move.pattern.length) ? Math.max(1, damage - 1) : damage;
}
function handleCollapse(state, side, logs) {
  const isPlayer = side === "player";
  const targetName = isPlayer ? "玩家" : "Boss";
  const maxHp = isPlayer ? state.playerMaxHp : state.bossMaxHp;
  let damage = isPlayer ? collapseDamage(maxHp, 1, state.weather) : collapseDamage(maxHp, state.playerUltimateLevel ?? 1, state.weather);
  if (isPlayer && state.battleRule?.id === "execution_player_collapse_plus") damage += 3;
  if (isPlayer && hasBuff(state, "collapse_guard")) damage = Math.max(1, damage - 3);
  let next = { ...state };
  if (!next.firstCollapseSide) next.firstCollapseSide = side;
  if (isPlayer) {
    next.playerHp = Math.max(0, next.playerHp - damage);
    logs.push(`${targetName}牌组被打空，进入崩溃状态，受到终极招式 ${damage} 点伤害。`);
    if (next.playerHp <= 0) { next.winner = "boss"; logs.push("玩家在崩溃伤害中倒下，Boss 获胜。"); return next; }
    next.playerCollapseStacks += 1; next.playerHand = shuffleLike([...next.playerDiscard]); next.playerDiscard = []; next.playerLastCardKey = null;
    logs.push("玩家未被击败，重洗弃牌继续战斗，并获得 1 层崩溃负面状态。");
  } else {
    if (state.battleRule?.id === "sentinel_first_collapse_shield" && !state.sentinelCollapseShieldUsed) {
      next.sentinelCollapseShieldUsed = true;
      next.bossCollapseStacks += 1; next.bossHand = shuffleLike([...next.bossDiscard]); next.bossDiscard = []; next.bossLastCardKey = null; next = syncRevealedBossCards(next);
      logs.push("城墙防线生效：Boss 第一次崩溃不受终极招式伤害，只重洗弃牌并获得 1 层崩溃负面状态。");
      return next;
    }
    next.bossHp = Math.max(0, next.bossHp - damage);
    logs.push(`${targetName}牌组被打空，进入崩溃状态，受到玩家${playerUltimateInfo(state.playerUltimateLevel ?? 1).name} ${damage} 点伤害。`);
    if (next.bossHp <= 0) { next.winner = "player"; logs.push("Boss 在崩溃伤害中倒下，玩家获胜。"); return next; }
    next.bossCollapseStacks += 1; next.bossHand = shuffleLike([...next.bossDiscard]); next.bossDiscard = []; next.bossLastCardKey = null; next = syncRevealedBossCards(next);
    logs.push("Boss 未被击败，重洗弃牌继续战斗，并获得 1 层崩溃负面状态。");
  }
  return next;
}
function collapseDamage(maxHp, ultimateLevel, weather) {
  if (weather === "warm") return maxHp;
  if (ultimateLevel >= 4) return maxHp;
  if (ultimateLevel >= 3) return Math.ceil(maxHp * 0.75);
  if (ultimateLevel >= 2) return Math.ceil(maxHp / 2) + 3;
  return Math.ceil(maxHp / 2);
}
function applyRoundStartEffects(state) {
  const logs = [];
  let next = { ...state, pendingLogs: [] };
  if (next.playerDaydream) next = applyDaydreamReplacement(next, "player", logs);
  if (next.bossDaydream) next = applyDaydreamReplacement(next, "boss", logs);
  if (next.battleRule?.id === "ice_hide_every_3" && next.round > 1 && next.round % 3 === 0) {
    next = hideRevealedBossCards(next, 1);
    logs.push("冰雾棋盘生效：隐藏 1 张已透视 Boss 牌。");
  }
  for (const skill of next.bossSkills ?? []) {
    if (skill.round !== next.round || (next.usedBossSkillRounds ?? []).includes(skill.round)) continue;
    next = applyBossSkill(next, skill, logs);
    next.usedBossSkillRounds = [...(next.usedBossSkillRounds ?? []), skill.round];
  }
  return { ...next, pendingLogs: logs };
}
function applyBossSkill(state, skill, logs) {
  let next = { ...state };
  logs.push(`Boss 技能【${skill.name}】发动：${skill.text}`);
  if (skill.effect === "pressureDown") next.bossPressure = Math.max(0, (next.bossPressure ?? 0) - skill.value);
  else if (skill.effect === "bossDamageReduction") next.bossDamageReduction = skill.value;
  else if (skill.effect === "bossWinBonus") next.bossWinBonus = (next.bossWinBonus ?? 0) + skill.value;
  else if (skill.effect === "bossMoveDamageBonus") next.bossMoveDamageBonus = (next.bossMoveDamageBonus ?? 0) + skill.value;
  else if (skill.effect === "fourSymbolBonus") next.fourSymbolBonus = (next.fourSymbolBonus ?? 0) + skill.value;
  else if (skill.effect === "hideRevealed") next = hideRevealedBossCards(next, skill.value);
  else if (skill.effect === "clearPlayerPattern") next.playerPattern = next.playerPattern.slice(0, Math.max(0, next.playerPattern.length - skill.value));
  else if (skill.effect === "recoverFourSymbol") next = recoverBossCard(next, (card) => card.id.startsWith("four_"));
  else if (skill.effect === "ignoreNextBossLossSequence") next.ignoreNextBossLossSequence = true;
  else if (skill.effect === "removePlayerDiscard") next = removePlayerDiscard(next);
  else if (skill.effect === "reduceReveal") next = syncRevealedBossCards({ ...next, revealCount: Math.max(0, next.revealCount - skill.value), baseRevealCount: Math.max(0, (next.baseRevealCount ?? next.revealCount) - skill.value) });
  else if (skill.effect === "clearBothPatterns") next = { ...next, playerPattern: [], bossPattern: [] };
  else if (skill.effect === "finalCoronation") next = { ...next, playerPattern: [], bossPattern: [], bossMoveDamageBonus: (next.bossMoveDamageBonus ?? 0) + skill.value };
  return next;
}
function applyRuleAfterResult(state, result, bossCard, logs) {
  let next = state;
  if (next.battleRule?.id === "gambler_draw_pressure" && result.player === "draw") {
    next = { ...next, bossPressure: Math.min(3, (next.bossPressure ?? 0) + 1) };
    logs.push("赌神牌桌生效：双方失败，Boss 压力 +1。");
  }
  if (next.battleRule?.id === "four_symbols_ritual" && result.boss === "win" && bossCard.id.startsWith("four_")) {
    const ritual = (next.fourSymbolRitual ?? 0) + 1;
    if (ritual >= 4) {
      next = { ...next, fourSymbolRitual: 0, playerHp: Math.max(0, next.playerHp - 12) };
      logs.push("四象阵爆发：仪式达到 4 层，玩家受到 12 点伤害。");
    } else {
      next = { ...next, fourSymbolRitual: ritual };
      logs.push(`四象阵生效：Boss 获得 ${ritual}/4 层仪式。`);
    }
  }
  if (result.boss === "win" && (next.bossWinBonus ?? 0) > 0) {
    next = { ...next, playerHp: Math.max(0, next.playerHp - next.bossWinBonus), bossWinBonus: 0 };
    logs.push(`Boss 胜利追加伤害生效：玩家额外受到 ${state.bossWinBonus} 点伤害。`);
  }
  if (next.fourSymbolBonus && bossCard.id.startsWith("four_")) next = { ...next, fourSymbolBonus: 0 };
  return next;
}
function hideRevealedBossCards(state, count) {
  const removeCount = Math.max(0, Math.round(count));
  return { ...state, revealedBossCardKeys: (state.revealedBossCardKeys ?? []).slice(0, Math.max(0, (state.revealedBossCardKeys ?? []).length - removeCount)) };
}
function recoverBossCard(state, predicate) {
  const card = state.bossDiscard.find(predicate);
  if (!card) return state;
  return syncRevealedBossCards({ ...state, bossDiscard: state.bossDiscard.filter((entry) => entry.key !== card.key), bossHand: [...state.bossHand, card] });
}
function removePlayerDiscard(state) {
  if (state.playerDiscard.length === 0) return state;
  return { ...state, playerDiscard: state.playerDiscard.slice(1) };
}
function pickWagerChoices(seed) {
  const choices = [];
  let offset = deterministicRange(seed, 0, wagerLibrary.length - 1);
  while (choices.length < 3 && choices.length < wagerLibrary.length) {
    const wager = wagerLibrary[offset % wagerLibrary.length];
    if (!choices.includes(wager.id)) choices.push(wager.id);
    offset += 3;
  }
  return choices;
}
function resolveWager(state, wagerId, logs, success = true) {
  if (!state.selectedWagerId || state.selectedWagerId !== wagerId || (state.resolvedWagerIds ?? []).includes(wagerId)) return state;
  const wager = wagerById.get(wagerId);
  if (!wager) return state;
  if (success) {
    logs.push(`额外赌局成功：【${wager.name}】。`);
    return { ...state, resolvedWagerIds: [...(state.resolvedWagerIds ?? []), wagerId] };
  }
  logs.push(`额外赌局失败：【${wager.name}】。`);
  return { ...state, resolvedWagerIds: [...(state.resolvedWagerIds ?? []), wagerId] };
}
function failSelectedWager(state, logs) {
  if (!state.selectedWagerId || (state.resolvedWagerIds ?? []).includes(state.selectedWagerId)) return state;
  return resolveWager(state, state.selectedWagerId, logs, false);
}
function checkRoundWagers(state, result, logs) {
  let next = state;
  if (state.round === 3 && result.player === "win") next = resolveWager(next, "player_round_3_win", logs);
  if (state.round === 3 && result.boss === "win") next = resolveWager(next, "boss_round_3_win", logs);
  if (state.round > 3 && ["player_round_3_win", "boss_round_3_win"].includes(state.selectedWagerId)) next = failSelectedWager(next, logs);
  if (state.round >= 10) next = resolveWager(next, "long_fight", logs);
  return next;
}
function checkDamageWagers(state, logs) {
  let next = state;
  if ((state.playerRoundDamage ?? 0) >= 5) next = resolveWager(next, "player_big_move", logs);
  if ((state.bossRoundDamage ?? 0) >= 5) next = resolveWager(next, "boss_big_move", logs);
  if (state.firstCollapseSide === "boss") next = resolveWager(next, "boss_first_collapse", logs);
  if (state.firstCollapseSide === "player" && state.selectedWagerId === "boss_first_collapse") next = failSelectedWager(next, logs);
  return next;
}
function checkRestrictionWagers(state, playerCard, item, logs) {
  let next = state;
  if (playerCard?.type === "能力卡") next = failSpecificWager(next, "no_player_ability", logs);
  if (item) next = failSpecificWager(next, "no_player_item", logs);
  if (next.playerDiscard.some((card) => card.id === "king")) next = failSpecificWager(next, "king_not_discarded", logs);
  if (next.playerDiscard.some((card) => card.id === "commoner")) next = failSpecificWager(next, "commoner_not_discarded", logs);
  return next;
}
function failSpecificWager(state, wagerId, logs) {
  if (state.selectedWagerId !== wagerId || (state.resolvedWagerIds ?? []).includes(wagerId)) return state;
  return resolveWager(state, wagerId, logs, false);
}
function checkEndWagers(state, logs) {
  if (!state.winner) return state;
  let next = state;
  if (state.round <= 6) next = resolveWager(next, "fast_win", logs);
  if (["no_player_ability", "no_player_item", "king_not_discarded", "commoner_not_discarded"].includes(state.selectedWagerId)) {
    next = resolveWager(next, state.selectedWagerId, logs);
  }
  if (["fast_win", "long_fight", "player_big_move", "boss_big_move", "boss_first_collapse"].includes(state.selectedWagerId)) {
    next = failSelectedWager(next, logs);
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
  return state.playerHand.some((playerCard) => compareCards(resolvePlayedCard(playerCard, "player", state), resolvePlayedCard(bossCard, "boss", state), state.weather, null, comparisonContext(state)).boss === "win");
}
function canBeatLikelyPlayerCard(state, bossCard) {
  const visible = state.playerHand.filter((card) => card.key !== state.playerLastCardKey);
  return visible.some((playerCard) => compareCards(resolvePlayedCard(playerCard, "player", state), resolvePlayedCard(bossCard, "boss", state), state.weather, null, comparisonContext(state)).boss === "win");
}
function comparisonContext(state) {
  return {
    playerHandBeforePlay: state.playerHand,
    bossHandBeforePlay: state.bossHand,
    playerCivilized: state.playerCivilized,
    bossCivilized: state.bossCivilized,
    playerWarmDay: state.playerWarmDay,
    bossWarmDay: state.bossWarmDay,
    playerSnowflake: state.playerSnowflake,
    bossSnowflake: state.bossSnowflake,
    playerEvenForm: state.playerEvenForm,
    bossEvenForm: state.bossEvenForm,
    playerOddForm: state.playerOddForm,
    bossOddForm: state.bossOddForm,
    playerExponentialForm: state.playerExponentialForm,
    bossExponentialForm: state.bossExponentialForm,
    activeBuffs: state.initialBuffs ?? [],
    bossFourSymbolBonus: state.fourSymbolBonus,
    playerForcedLoss: state.playerForcedLoss,
    bossForcedLoss: state.bossForcedLoss,
    playerForcedWin: state.playerForcedWin,
    bossForcedWin: state.bossForcedWin,
    levelOrderReversed: state.levelOrderReversed,
    round: state.round
  };
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
function isPatternStep(entry) { return entry === "win" || entry === "loss" || entry === "any"; }
function endsWithPattern(history, pattern) { return history.length >= pattern.length && pattern.every((entry, index) => entry === "any" || history[history.length - pattern.length + index] === entry); }
function shuffleLike(cards) { return cards.map((card, index) => ({ card, rank: (index * 37 + 11) % 97 })).sort((a, b) => a.rank - b.rank).map((entry) => entry.card); }
function addLog(state, tone, text) { return addLogs(state, [text], tone); }
function addLogs(state, entries, tone = "info") { const start = state.logs.length; const logs = entries.map((entry, index) => ({ id: start + index, tone, text: entry })); return { ...state, logs: [...logs, ...state.logs].slice(0, 80) }; }
function formatRoundLog(round, playerCard, bossCard, result, item) { const itemText = item ? `，使用【${item.name}】` : ""; return `第 ${round} 回合：玩家出【${playerCard.name}】(${result.playerLevel})，Boss 出【${bossCard.name}】(${result.bossLevel})${itemText}，结果：${outcomeText(result.player)}。${result.reason}。`; }
function outcomeText(outcome) { if (outcome === "win") return "玩家胜"; if (outcome === "loss") return "玩家负"; return "双方失败"; }
function weatherName(weather) { const names = { clear: "晴朗", rain: "雨季", sun: "烈日", hail: "冰雹", warm: "暖风" }; return names[weather] ?? weather; }


