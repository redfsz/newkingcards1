export const cardLibrary = [
  { id: "king", name: "国王", level: 3, type: "基础卡", note: "高等级核心牌，会被平民克制" },
  { id: "minister", name: "大臣", level: 2, type: "基础卡", note: "稳定中位牌" },
  { id: "commoner", name: "平民", level: 1, type: "基础卡", note: "特殊克制国王" },
  { id: "guard", name: "护卫", level: 2.5, type: "补充基础卡", note: "高位补充牌" },
  { id: "maid", name: "侍女", level: 1.5, type: "补充基础卡", note: "中低位补充牌" },
  { id: "thief", name: "盗贼", level: 0.5, type: "补充基础卡", note: "低位诱导牌" },
  { id: "noble", name: "贵族", level: 2.3, type: "补充基础卡", note: "高位补充牌" },
  { id: "queen", name: "王后", level: 2.9, type: "补充基础卡", note: "接近国王的高位牌" },
  { id: "regicide", name: "弑君者", level: 1, type: "补充基础卡", note: "手牌中没有国王时，视为国王" },
  { id: "rebel", name: "乱党", level: 1, type: "补充基础卡", note: "手牌中没有大臣时，视为大臣" },
  { id: "beggar", name: "乞丐", level: 1, type: "补充基础卡", note: "手牌中没有平民时，视为平民" },
  { id: "assassin", name: "刺客", level: 0, type: "额外功能卡", note: "强制双方失败" },
  { id: "false_god", name: "伪神", level: 0, type: "额外功能卡", note: "本次必胜，下回合自动失败" },
  { id: "fortune_teller", name: "占卜师", level: 0, type: "额外功能卡", note: "本次必败，下次必胜" },
  { id: "shadow", name: "影子", level: 0, type: "额外功能卡", note: "复制对手上一张打出的牌" },
  { id: "fate", name: "命运", level: 0, type: "额外功能卡", note: "出牌时等级随机变为 1-3 的整数" },
  { id: "civilization", name: "文明", level: 0, type: "额外功能卡", note: "打出后你的所有手牌视为国王" },
  { id: "all_in", name: "孤注一掷", level: 0, type: "额外功能卡", note: "随机将另一张手牌等级 x2" },
  { id: "hope", name: "希望", level: 0, type: "额外功能卡", note: "将 1 张随机牌从弃牌堆放回手牌" },
  { id: "demon", name: "恶魔", level: 0, type: "额外功能卡", note: "将对方 1 张随机牌移入弃牌堆" },
  { id: "forge_blade", name: "铸剑", level: 0, type: "额外功能卡", note: "每打出一次，这张牌等级永久 +0.1" },
  { id: "strike_blade", name: "挥剑", level: 4, type: "额外功能卡", note: "每打出一次，这张牌等级永久 -0.1" },
  { id: "four_qinglong", name: "四象-青龙", level: 2.6, type: "额外功能卡", note: "四象全部战胜对手一次后直接胜利" },
  { id: "four_baihu", name: "四象-白虎", level: 2, type: "额外功能卡", note: "四象全部战胜对手一次后直接胜利" },
  { id: "four_zhuque", name: "四象-朱雀", level: 1.9, type: "额外功能卡", note: "四象全部战胜对手一次后直接胜利" },
  { id: "four_xuanwu", name: "四象-玄武", level: 1.4, type: "额外功能卡", note: "四象全部战胜对手一次后直接胜利" },
  { id: "warm_day", name: "暖日", level: 0, type: "能力卡", note: "本局我方所有 0.5 级卡 +0.25" },
  { id: "snowflake", name: "雪花", level: 0, type: "能力卡", note: "本局敌方所有 0.5 级卡 -0.25" },
  { id: "final_moment", name: "最终时刻", level: 0, type: "额外功能卡", note: "双方弃掉手牌中除国王/大臣/平民外的所有牌" },
  { id: "even_form", name: "偶数形态", level: 0, type: "能力卡", note: "本局偶数回合等级 +1" },
  { id: "odd_form", name: "奇数形态", level: 0, type: "能力卡", note: "本局奇数回合等级 +1" },
  { id: "exponential_form", name: "指数形态", level: 0, type: "能力卡", note: "每次出牌额外失去 1 张自选牌，牌等级变为平方" },
  { id: "golden_necklace", name: "金色项链", level: 0, type: "能力卡", note: "获胜后金币 x2" },
  { id: "perfect_match", name: "天作之合", level: 0, type: "能力卡", note: "反转本局游戏的等级排序" },
  { id: "daydream", name: "白日梦", level: 0, type: "能力卡", note: "每回合将你的 1 张手牌替换为随机牌" },
  { id: "foresight", name: "预见牌", level: 0, type: "一次性卡牌", note: "开牌前看穿对方出的牌" },
  { id: "regret", name: "后悔牌", level: 0, type: "一次性卡牌", note: "从弃牌堆选择 1 张牌放回手牌" },
  { id: "debuff_half", name: "减0.5牌", level: 0, type: "一次性卡牌", note: "本次对方牌等级 -0.5" },
  { id: "debuff_one", name: "减1牌", level: 0, type: "一次性卡牌", note: "本次对方牌等级 -1" },
  { id: "buff_half", name: "加0.5牌", level: 0, type: "一次性卡牌", note: "本次己方牌等级 +0.5" },
  { id: "buff_one", name: "加1牌", level: 0, type: "一次性卡牌", note: "本次己方牌等级 +1" },
  { id: "disable_function", name: "功能失效牌", level: 0, type: "一次性卡牌", note: "对手本回合功能牌失效" },
  { id: "disable_ability", name: "能力失效牌", level: 0, type: "一次性卡牌", note: "对手本回合能力牌失效" },
  { id: "survive_round", name: "续命牌", level: 0, type: "一次性卡牌", note: "本局游戏回合数上限 +1" }
];

export const requiredDeckCards = ["king", "commoner"];

export const moveLibrary = [
  { id: "single_win", name: "一胜", pattern: ["win"], damage: 1, price: 0, note: "固有招式" },
  { id: "double_win", name: "胜胜", pattern: ["win", "win"], damage: 3, price: 20, note: "稳定爆发" },
  { id: "win_win_loss", name: "胜胜负", pattern: ["win", "win", "loss"], damage: 5, price: 20, note: "高风险高收益" },
  { id: "counter", name: "负胜", pattern: ["loss", "win"], damage: 2, price: 20, note: "反击型招式" },
  { id: "comeback", name: "负负胜", pattern: ["loss", "loss", "win"], damage: 4, price: 25, note: "逆风反打" }
];


export const sequenceDamageByLength = {
  1: 1,
  2: 3,
  3: 5,
  4: 7,
  5: 15,
  6: 30
};

export const defaultCustomMoves = [
  { id: "custom_1", name: "招式 1", pattern: ["win"] },
  { id: "custom_2", name: "招式 2", pattern: ["win", "win"] },
  { id: "custom_3", name: "招式 3", pattern: ["loss", "win"] },
  { id: "custom_4", name: "招式 4", pattern: ["loss", "loss", "win"] },
  { id: "custom_5", name: "招式 5", pattern: ["win", "loss", "win"] },
  { id: "custom_6", name: "招式 6", pattern: ["win", "win", "win", "win", "win", "win"] }
];
export const bossMoveLibrary = [
  { id: "boss_single", name: "压制", pattern: ["win"], damage: 1, note: "Boss 固有招式" },
  { id: "boss_double", name: "连压", pattern: ["win", "win"], damage: 3, note: "连续胜利造成爆发" },
  { id: "boss_bait", name: "诱敌", pattern: ["loss", "win"], damage: 2, note: "先输后反击" }
];

export const itemLibrary = [
  { id: "peek", name: "预见牌", price: 100, note: "显示 Boss 下一张倾向出牌" },
  { id: "plus_half", name: "加0.5牌", price: 100, note: "本回合自己的牌等级 +0.5" },
  { id: "plus_one", name: "加1牌", price: 130, note: "本回合自己的牌等级 +1" },
  { id: "minus_half", name: "减0.5牌", price: 100, note: "本回合 Boss 的牌等级 -0.5" },
  { id: "save", name: "续命牌", price: 120, note: "本回合自己输掉的牌不进弃牌堆" }
];

export const initialBuffLibrary = [
  { id: "rich_second_gen", name: "富二代", side: "玩家", note: "金币增加 50%。模拟器中作为经济 Buff 展示，不改变战斗结算" },
  { id: "unlimited_supply", name: "无限供应", side: "玩家", note: "商店卡牌不会售罄。模拟器中作为经济 Buff 展示，不改变战斗结算" },
  { id: "random_commoner", name: "随机平民", side: "玩家", note: "玩家平民牌每次对弈等级随机变为 0~2" },
  { id: "random_king", name: "随机国王", side: "玩家", note: "玩家国王牌每次对弈等级随机变为 0~4" },
  { id: "surprise_pack", name: "惊喜卡包", side: "玩家", note: "获得卡牌数量在 0~3 中随机。模拟器中作为奖励 Buff 展示，不改变战斗结算" },
  { id: "xray_boost", name: "透视增强", side: "玩家", note: "开局至少可看穿敌人 2 张牌" },
  { id: "chaotic_battlefield", name: "混乱战场", side: "玩家", note: "模拟器中会随机从可出牌里替你出牌" },
  { id: "player_hp_plus", name: "坚韧", side: "玩家", note: "玩家开局最大生命 +3" },
  { id: "player_move_plus", name: "锋芒", side: "玩家", note: "玩家招式伤害 +1" },
  { id: "collapse_guard", name: "稳固", side: "玩家", note: "玩家受到崩溃伤害时 -3" }
];

export const weatherLibrary = [
  { id: "clear", name: "晴朗", note: "无特殊效果" },
  { id: "rain", name: "雨季", note: "经济天气，本模拟器暂不改变胜负" },
  { id: "sun", name: "烈日", note: "所有 .5 牌等级 -0.5" },
  { id: "hail", name: "冰雹", note: "所有 .5 牌等级 +0.5" },
  { id: "warm", name: "暖风", note: "崩溃触发的终极招式直接击败目标" }
];

export const resultLabels = { win: "胜", loss: "负", draw: "双输" };

export const bossPersonaLibrary = [
  { id: "gatekeeper", name: "守门人", style: "稳健型", pressureRules: ["优先打中等等级牌试探玩家，避免过早交出国王和平民。", "优先保留国王和平民，用护卫、侍女、贵族等牌维持局面。", "优先打当前最可能赢过玩家的牌，但仍尽量保留克制牌。", "打出当前手牌最高等级牌，然后压力清零。"], fullPressure: "压力达到 3 时，守门人会直接打出当前手牌最高等级牌。" },
  { id: "sentinel", name: "巡逻队长", style: "防守型", pressureRules: ["优先打低风险牌，不主动消耗国王和平民。", "优先保留国王和平民，并尝试用中位牌换掉玩家资源。", "如果手里有能稳定获胜的牌，会优先打出；否则继续防守。", "打出最高等级的非平民牌；如果只能打平民，也会打出。"], fullPressure: "压力达到 3 时，巡逻队长会开始反击，但仍尽量不浪费平民。" },
  { id: "strategist", name: "雪花谋士", style: "控制型", pressureRules: ["优先打能力牌，尽早改变战斗环境。", "优先保留能克制玩家核心牌的牌，尤其是平民。", "优先破坏玩家的招式序列，让玩家难以连续触发伤害。", "打出最能赢下本回合的牌；若没有优势牌，则打最高等级牌。"], fullPressure: "压力达到 3 时，谋士会优先追求本回合胜利，不再保守。" },
  { id: "four_symbols", name: "四象门主", style: "组合型", pressureRules: ["优先打四象牌，尝试启动四象组合。", "继续优先打还没进弃牌的四象牌，保持组合进度。", "如果四象牌不足，改为打能赢的高等级牌。", "打出最高等级牌；四象牌和高等级牌优先。"], fullPressure: "压力达到 3 时，四象门主会把组合计划转为直接压制。" },
  { id: "gambler", name: "伪神赌徒", style: "冒险型", pressureRules: ["优先打功能牌或低等级牌，接受短期失败。", "倾向打波动大的牌，比如伪神、命运、刺客。", "优先打高风险高收益牌，不稳定追求最优解。", "从当前最高的 3 张牌中选择一张打出，然后压力清零。"], fullPressure: "压力达到 3 时，赌徒不会绝对最优，而是在高牌里冒险。" },
  { id: "executioner", name: "暖风裁决者", style: "处刑型", pressureRules: ["优先打高等级牌，尽快推动玩家进入崩溃。", "继续打能赢的牌，不太保留关键牌。", "优先触发 Boss 招式序列，追求连续伤害。", "打出当前手牌最高等级牌；如果因此触发招式，会造成爆发。"], fullPressure: "压力达到 3 时，裁决者会强行压制，目标是尽快打空你的牌组。" },
  { id: "king", name: "王座之影", style: "终局型", pressureRules: ["优先保留国王和平民，观察玩家核心牌。", "优先打能逼出玩家关键牌的中高等级牌。", "优先打能赢的牌，并尽量留下平民克制玩家国王。", "打出当前最强牌；若手中有平民且玩家国王还在，会优先保留平民。"], fullPressure: "压力达到 3 时，王座之影会强攻，但仍会尽量保留平民来克制国王。" }
];
export const levelPresets = [
  { id: "floor_1_npc", floor: 1, battleType: "npc", name: "第一层：原住民试手", bossPersona: "gatekeeper", playerMaxHp: 18, bossMaxHp: 10, weather: "clear", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "minus_half", "save"] },
  { id: "floor_1_duel", floor: 1, battleType: "duel", name: "第一层：主角切磋", bossPersona: "gatekeeper", playerMaxHp: 18, bossMaxHp: 12, weather: "clear", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "minus_half", "save"] },
  { id: "floor_1_boss", floor: 1, battleType: "boss", name: "第一层 Boss：守门人", bossPersona: "gatekeeper", playerMaxHp: 18, bossMaxHp: 16, weather: "clear", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief"], selectedBossMoves: ["boss_single"], battleRule: { id: "none", name: "入塔试炼场", text: "无特殊规则。" }, bossSkills: [{ round: 3, name: "稳住阵脚", effect: "pressureDown", value: 1, text: "Boss 压力 -1。" }, { round: 6, name: "看破破绽", effect: "bossWinBonus", value: 1, text: "Boss 下一次胜利额外造成 1 点伤害。" }], ownedItems: ["peek", "plus_half", "minus_half", "save"] },

  { id: "floor_2_npc", floor: 2, battleType: "npc", name: "第二层：巡逻士兵", bossPersona: "sentinel", playerMaxHp: 18, bossMaxHp: 14, weather: "rain", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "maid"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "minus_half", "plus_one"] },
  { id: "floor_2_duel", floor: 2, battleType: "duel", name: "第二层：防守切磋", bossPersona: "sentinel", playerMaxHp: 18, bossMaxHp: 16, weather: "rain", revealCount: 1, initialBuffs: ["player_hp_plus"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "maid", "noble"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "plus_half", "minus_half", "plus_one"] },
  { id: "floor_2_boss", floor: 2, battleType: "boss", name: "第二层 Boss：巡逻队长", bossPersona: "sentinel", playerMaxHp: 18, bossMaxHp: 20, weather: "rain", revealCount: 1, initialBuffs: ["player_hp_plus"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "maid", "thief"], selectedBossMoves: ["boss_single", "boss_bait"], battleRule: { id: "sentinel_first_collapse_shield", name: "城墙防线", text: "Boss 第一次崩溃不受终极招式伤害，只重洗弃牌并获得崩溃负面状态。" }, bossSkills: [{ round: 2, name: "列阵", effect: "pressureDown", value: 1, text: "Boss 压力 -1。" }, { round: 5, name: "盾墙", effect: "bossDamageReduction", value: 2, text: "本回合 Boss 受到的玩家招式伤害 -2，最低为 1。" }, { round: 8, name: "反击号令", effect: "pressureUp", value: 1, text: "Boss 压力 +1。" }], ownedItems: ["peek", "plus_half", "minus_half", "plus_one"] },

  { id: "floor_3_npc", floor: 3, battleType: "npc", name: "第三层：雪地旅人", bossPersona: "strategist", playerMaxHp: 20, bossMaxHp: 16, weather: "hail", revealCount: 2, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief", "snowflake"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_3_duel", floor: 3, battleType: "duel", name: "第三层：冷读切磋", bossPersona: "strategist", playerMaxHp: 20, bossMaxHp: 20, weather: "hail", revealCount: 2, initialBuffs: ["xray_boost"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief", "noble", "fortune_teller"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_3_boss", floor: 3, battleType: "boss", name: "第三层 Boss：雪花谋士", bossPersona: "strategist", playerMaxHp: 20, bossMaxHp: 24, weather: "hail", revealCount: 2, initialBuffs: ["xray_boost"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief", "noble", "snowflake"], selectedBossMoves: ["boss_single", "boss_bait"], battleRule: { id: "ice_hide_every_3", name: "冰雾棋盘", text: "每 3 回合开始时，隐藏 1 张已透视的 Boss 牌。" }, bossSkills: [{ round: 2, name: "雪幕", effect: "hideRevealed", value: 1, text: "隐藏 1 张已透视 Boss 牌。" }, { round: 5, name: "冷读", effect: "clearPlayerPattern", value: 1, text: "清除玩家最近 1 个胜负记录。" }, { round: 8, name: "谋定", effect: "pressureUp", value: 1, text: "Boss 压力 +1。" }], ownedItems: ["peek", "plus_half", "plus_one", "save"] },

  { id: "floor_4_npc", floor: 4, battleType: "npc", name: "第四层：青龙弟子", bossPersona: "four_symbols", playerMaxHp: 22, bossMaxHp: 18, weather: "sun", revealCount: 2, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "four_qinglong", "four_xuanwu"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "minus_half", "plus_one", "save"] },
  { id: "floor_4_duel", floor: 4, battleType: "duel", name: "第四层：破阵切磋", bossPersona: "four_symbols", playerMaxHp: 22, bossMaxHp: 22, weather: "sun", revealCount: 2, initialBuffs: ["collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "four_qinglong", "four_baihu", "four_zhuque"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "minus_half", "plus_one", "save"] },
  { id: "floor_4_boss", floor: 4, battleType: "boss", name: "第四层 Boss：四象门主", bossPersona: "four_symbols", playerMaxHp: 22, bossMaxHp: 28, weather: "sun", revealCount: 2, initialBuffs: ["collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "four_qinglong", "four_baihu", "four_zhuque", "four_xuanwu"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], battleRule: { id: "four_symbols_ritual", name: "四象阵", text: "Boss 用四象牌战胜玩家时获得 1 层仪式；4 层时玩家受到 12 点伤害，仪式清零。" }, bossSkills: [{ round: 3, name: "青龙起势", effect: "fourSymbolBonus", value: 0.5, text: "Boss 下一张四象牌等级 +0.5。" }, { round: 6, name: "白虎压阵", effect: "pressureUp", value: 1, text: "Boss 压力 +1。" }, { round: 9, name: "四象回环", effect: "recoverFourSymbol", value: 1, text: "Boss 从弃牌堆洗回 1 张四象牌。" }], ownedItems: ["peek", "minus_half", "plus_one", "save"] },

  { id: "floor_5_npc", floor: 5, battleType: "npc", name: "第五层：赌桌客", bossPersona: "gambler", playerMaxHp: 24, bossMaxHp: 20, weather: "clear", revealCount: 3, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "queen", "assassin", "fate"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_5_duel", floor: 5, battleType: "duel", name: "第五层：风险切磋", bossPersona: "gambler", playerMaxHp: 24, bossMaxHp: 26, weather: "clear", revealCount: 3, initialBuffs: ["random_commoner"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "queen", "noble", "false_god", "fate", "shadow"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_5_boss", floor: 5, battleType: "boss", name: "第五层 Boss：伪神赌徒", bossPersona: "gambler", playerMaxHp: 24, bossMaxHp: 32, weather: "clear", revealCount: 3, initialBuffs: ["random_commoner"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "queen", "noble", "false_god", "assassin", "fate", "shadow"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], battleRule: { id: "gambler_draw_pressure", name: "赌神牌桌", text: "双方失败时，Boss 压力 +1。" }, bossSkills: [{ round: 2, name: "下注", effect: "bossMoveDamageBonus", value: 1, text: "Boss 下一次招式伤害 +1。" }, { round: 5, name: "强行加注", effect: "pressureUp", value: 2, text: "Boss 压力 +2。" }, { round: 8, name: "伪神降桌", effect: "ignoreNextBossLossSequence", value: 1, text: "Boss 下一次失败不增加玩家胜负序列。" }], ownedItems: ["peek", "plus_one", "minus_half", "save"] },

  { id: "floor_6_npc", floor: 6, battleType: "npc", name: "第六层：暖风信徒", bossPersona: "executioner", playerMaxHp: 26, bossMaxHp: 22, weather: "warm", revealCount: 3, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "queen", "strike_blade", "rebel"], selectedBossMoves: ["boss_single", "boss_double"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_6_duel", floor: 6, battleType: "duel", name: "第六层：极限切磋", bossPersona: "executioner", playerMaxHp: 26, bossMaxHp: 30, weather: "warm", revealCount: 3, initialBuffs: ["player_move_plus"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "final_moment", "rebel"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_6_boss", floor: 6, battleType: "boss", name: "第六层 Boss：暖风裁决者", bossPersona: "executioner", playerMaxHp: 26, bossMaxHp: 36, weather: "warm", revealCount: 3, initialBuffs: ["player_move_plus", "random_king"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "civilization", "final_moment", "rebel"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], battleRule: { id: "execution_player_collapse_plus", name: "处刑台", text: "玩家进入崩溃时，受到的终极招式伤害 +3。" }, bossSkills: [{ round: 2, name: "审判", effect: "bossWinBonus", value: 1, text: "Boss 下一次胜利额外造成 1 点伤害。" }, { round: 5, name: "断罪", effect: "removePlayerDiscard", value: 1, text: "玩家弃牌堆随机 1 张牌本场不能洗回。" }, { round: 8, name: "处刑宣告", effect: "pressureSet", value: 3, text: "Boss 压力直接变为 3。" }], ownedItems: ["peek", "plus_half", "plus_one", "save"] },

  { id: "floor_7_npc", floor: 7, battleType: "npc", name: "第七层：王座侍从", bossPersona: "king", playerMaxHp: 30, bossMaxHp: 26, weather: "clear", revealCount: 4, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "rebel", "beggar"], selectedBossMoves: ["boss_single", "boss_double"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_7_duel", floor: 7, battleType: "duel", name: "第七层：主角之影", bossPersona: "king", playerMaxHp: 30, bossMaxHp: 34, weather: "clear", revealCount: 4, initialBuffs: ["collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "forge_blade", "false_god"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_7_boss", floor: 7, battleType: "boss", name: "第七层 Boss：王座之影", bossPersona: "king", playerMaxHp: 30, bossMaxHp: 42, weather: "clear", revealCount: 4, initialBuffs: ["chaotic_battlefield", "collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "forge_blade", "civilization", "perfect_match"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], battleRule: { id: "king_repeat_length_penalty", name: "王座法则", text: "玩家连续触发同长度招式时，从第二次开始该招式伤害 -1，最低为 1。" }, bossSkills: [{ round: 3, name: "王权凝视", effect: "reduceReveal", value: 1, text: "玩家透视数量 -1，最低为 0。" }, { round: 6, name: "旧律重申", effect: "clearBothPatterns", value: 1, text: "清空双方胜负序列。" }, { round: 9, name: "终局加冕", effect: "finalCoronation", value: 2, text: "Boss 压力变满，下一次 Boss 招式伤害 +2。" }], ownedItems: ["peek", "plus_one", "minus_half", "save"] }
];

