export const cardLibrary = [
  { id: "king", name: "国王", level: 3, type: "基础卡", note: "高等级核心牌，会被平民克制" },
  { id: "minister", name: "大臣", level: 2, type: "基础卡", note: "稳定中位牌" },
  { id: "commoner", name: "平民", level: 1, type: "基础卡", note: "特殊克制国王" },
  { id: "guard", name: "护卫", level: 2.5, type: "补充基础卡", note: "高位补充牌" },
  { id: "maid", name: "侍女", level: 1.5, type: "补充基础卡", note: "中低位补充牌" },
  { id: "thief", name: "盗贼", level: 0.5, type: "补充基础卡", note: "打赢本回合时，额外扣对方 5 点生命" },
  { id: "noble", name: "贵族", level: 2.3, type: "补充基础卡", note: "高位补充牌" },
  { id: "queen", name: "王后", level: 2.9, type: "补充基础卡", note: "接近国王的高位牌" },
  { id: "regicide", name: "弑君者", level: 1, type: "补充基础卡", note: "手牌中没有国王时，视为国王" },
  { id: "rebel", name: "乱党", level: 1, type: "补充基础卡", note: "手牌中没有大臣时，视为大臣" },
  { id: "beggar", name: "乞丐", level: 1, type: "补充基础卡", note: "手牌中没有平民时，视为平民" },
  { id: "assassin", name: "刺客", level: 0, type: "额外功能卡", note: "强制双方失败" },
  { id: "false_god", name: "伪神", level: 0, type: "额外功能卡", note: "本次必胜，赢了也进弃牌堆，下回合自动失败" },
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
  { id: "boss_bait", name: "诱敌", pattern: ["loss", "win"], damage: 2, note: "先输后反击" },
  { id: "boss_triple", name: "三连压制", pattern: ["win", "win", "win"], damage: 5, note: "连续三次胜利后的高压招式" },
  { id: "boss_counter_chain", name: "诱敌连击", pattern: ["loss", "win", "win"], damage: 4, note: "先输后连续反打" },
  { id: "boss_comeback", name: "逆势处刑", pattern: ["loss", "loss", "win"], damage: 4, note: "连续失利后反扑" },
  { id: "boss_grind", name: "消耗战", pattern: ["win", "any", "win"], damage: 5, note: "胜后无论中间结果如何，再胜一次即可压血" },
  { id: "boss_execution", name: "处刑序列", pattern: ["win", "win", "loss", "win"], damage: 7, note: "高阶 Boss 的压迫序列" },
  { id: "boss_ritual", name: "仪式回响", pattern: ["loss", "win", "loss", "win"], damage: 7, note: "组合型 Boss 的节奏招式" },
  { id: "boss_final", name: "终局王令", pattern: ["loss", "win", "win", "win"], damage: 9, note: "最终 Boss 先改写规则，再连续反打" },
  { id: "boss_probe_chain", name: "试探刺击", pattern: ["win", "loss"], damage: 2, note: "前期 Boss 用于制造节奏变化" },
  { id: "boss_wall", name: "盾墙反扑", pattern: ["loss", "loss", "win"], damage: 5, note: "防守型 Boss 承受压力后的反击" },
  { id: "boss_frost_lock", name: "冰封读牌", pattern: ["loss", "win", "loss"], damage: 4, note: "控制型 Boss 打断玩家节奏后造成伤害" },
  { id: "boss_symbol_lock", name: "四象合围", pattern: ["win", "loss", "win", "win"], damage: 8, note: "四象 Boss 的组合爆发" },
  { id: "boss_gamble_swing", name: "豪赌翻盘", pattern: ["win", "loss", "loss", "win"], damage: 8, note: "赌徒先赢造势，再连续亏牌攒压力，最后赢回一手爆发" },
  { id: "boss_crown_check", name: "王权审判", pattern: ["loss", "win", "loss", "win", "win"], damage: 10, note: "最终 Boss 围绕规则反转形成的长线招式" }
];

export const playerUltimateLibrary = [
  { level: 1, name: "终极招式 I", text: "对手崩溃时，造成对手最大生命 50% 的伤害。" },
  { level: 2, name: "终极招式 II", text: "对手崩溃时，造成对手最大生命 50% + 3 的伤害。" },
  { level: 3, name: "终极招式 III", text: "对手崩溃时，造成对手最大生命 75% 的伤害。" },
  { level: 4, name: "终极招式 IV", text: "对手崩溃时，造成对手最大生命 100% 的伤害。" }
];

export const itemLibrary = [
  { id: "peek", name: "预见牌", price: 100, note: "显示 Boss 下一张倾向出牌" },
  { id: "regret", name: "后悔牌", price: 120, note: "本回合出牌后，从自己的弃牌堆拿回 1 张牌" },
  { id: "plus_half", name: "加0.5牌", price: 100, note: "本回合自己的牌等级 +0.5" },
  { id: "plus_one", name: "加1牌", price: 130, note: "本回合自己的牌等级 +1" },
  { id: "minus_half", name: "减0.5牌", price: 100, note: "本回合 Boss 的牌等级 -0.5" },
  { id: "minus_one", name: "减1牌", price: 130, note: "本回合 Boss 的牌等级 -1" },
  { id: "disable_function", name: "功能失效牌", price: 150, note: "如果 Boss 本回合打出额外功能卡，只结算胜负，不发动后续功能" },
  { id: "disable_ability", name: "能力失效牌", price: 150, note: "如果 Boss 本回合打出能力卡，该牌等级按 0 结算且不发动后续效果" },
  { id: "save", name: "续命牌", price: 120, note: "本回合自己输掉的牌不进弃牌堆" }
];

export const wagerLibrary = [
  { id: "fast_win", name: "速战速决", text: "战斗在 6 回合内结束。", settle: "end" },
  { id: "long_fight", name: "拉锯战", text: "战斗至少进入第 10 回合。", settle: "instant" },
  { id: "player_round_3_win", name: "第三回合取胜", text: "第 3 回合玩家赢下本回合。", settle: "timed" },
  { id: "boss_round_3_win", name: "第三回合失手", text: "第 3 回合 Boss 赢下本回合。", settle: "timed" },
  { id: "player_big_move", name: "一式重创", text: "玩家单回合招式总伤害达到 5 点或以上。", settle: "instant" },
  { id: "boss_big_move", name: "对手爆发", text: "Boss 单回合招式总伤害达到 5 点或以上。", settle: "instant" },
  { id: "boss_first_collapse", name: "先破敌阵", text: "Boss 比玩家更早进入崩溃。", settle: "instant" },
  { id: "no_player_ability", name: "禁用能力", text: "本局玩家不会使用能力卡。", settle: "end" },
  { id: "no_player_item", name: "禁用道具", text: "本局玩家不会使用道具卡。", settle: "end" },
  { id: "king_not_discarded", name: "护住国王", text: "本局玩家的国王不会进入弃牌堆。", settle: "end" },
  { id: "commoner_not_discarded", name: "护住平民", text: "本局玩家的平民不会进入弃牌堆。", settle: "end" }
];

export const initialBuffLibrary = [
  { id: "rich_second_gen", name: "富二代", side: "玩家", note: "金币增加 50%。模拟器中作为经济 Buff 展示，不改变战斗结算" },
  { id: "unlimited_supply", name: "无限供应", side: "玩家", note: "商店卡牌不会售罄。模拟器中作为经济 Buff 展示，不改变战斗结算" },
  { id: "random_commoner", name: "随机平民", side: "玩家", note: "玩家平民牌每次对弈等级随机变为 0~2" },
  { id: "random_king", name: "随机国王", side: "玩家", note: "玩家国王牌每次对弈等级随机变为 0~4" },
  { id: "surprise_pack", name: "惊喜卡包", side: "玩家", note: "获得卡牌数量在 0~3 中随机。模拟器中作为奖励 Buff 展示，不改变战斗结算" },
  { id: "xray_boost", name: "透视增强", side: "玩家", note: "开局至少可看穿敌人 2 张牌" },
  { id: "chaotic_battlefield", name: "混乱战场", side: "玩家", note: "前两回合会随机从可出牌里替你出牌" },
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

export const resultLabels = { win: "胜", loss: "负", any: "全", draw: "双输" };

export const bossPersonaLibrary = [
  { id: "gatekeeper", name: "守门人", style: "偷血试探型", pressureRules: ["优先用侍女、盗贼这类低风险牌试探，盗贼赢了会偷 5 血。", "开始用大臣和护卫稳定换牌，继续保留国王和平民。", "如果能赢，会优先打赢并触发短招式；否则保留核心牌拖节奏。", "打出当前最高等级牌，用压力爆发收尾。"], fullPressure: "压力达到 3 时，守门人会放弃试探，直接打最高等级牌。" },
  { id: "sentinel", name: "巡逻队长", style: "防守反击型", pressureRules: ["优先打低位和中位牌，目标是拖到玩家先露出核心牌。", "继续保留国王和平民，用护卫、贵族顶住玩家连胜。", "如果连续被压，会寻找一次能赢的牌触发反击招式。", "打出最高等级的非平民牌，尽量把平民留给玩家国王。"], fullPressure: "压力达到 3 时，巡逻队长会从守势切到反击，但仍重视保留克制牌。" },
  { id: "strategist", name: "雪花谋士", style: "透视干扰型", pressureRules: ["优先打雪花、占卜师等控制牌，削弱 .5 牌并制造下一回合威胁。", "优先隐藏信息和清除玩家序列，让玩家难以规划招式。", "如果玩家正在连胜，会优先用能打断序列的牌。", "打出最能赢的牌，配合冰雾规则压制玩家透视。"], fullPressure: "压力达到 3 时，谋士不再单纯控场，会用最高收益牌抢一回合胜利。" },
  { id: "four_symbols", name: "四象门主", style: "仪式组合型", pressureRules: ["优先打四象牌，目标是积累四象获胜和仪式层数。", "继续轮换不同四象牌，避免只靠一张牌消耗。", "四象牌不足时，改用护卫、贵族、王后来维持胜负序列。", "优先打高等级四象牌或最高等级牌，尝试完成组合爆发。"], fullPressure: "压力达到 3 时，四象门主会把仪式计划转成直接压制。" },
  { id: "gambler", name: "伪神赌徒", style: "波动豪赌型", pressureRules: ["优先打命运、刺客、影子这类波动牌，接受双方失败和短期亏损。", "用伪神、命运、影子制造不可预测回合，寻找豪赌翻盘点。", "压力中段会倾向打能扰乱玩家序列的牌，而不是单纯打最高等级。", "从高收益牌里选择，可能是伪神，也可能是高等级牌。"], fullPressure: "压力达到 3 时，赌徒会在高牌和高波动牌里冒险，不保证稳定最优。" },
  { id: "executioner", name: "暖风裁决者", style: "崩溃处刑型", pressureRules: ["优先打高等级牌和挥剑，尽快打空玩家手牌。", "继续追求连续胜利，逼玩家进入崩溃。", "如果玩家弃牌堆成型，会用最终时刻或断罪削弱重洗质量。", "打出最高等级牌，配合暖风和处刑台争取崩溃秒杀。"], fullPressure: "压力达到 3 时，裁决者会强行压制，核心目标是让玩家崩溃。" },
  { id: "king", name: "王座之影", style: "终局统治型", pressureRules: ["优先保留国王和平民，先用贵族、王后、铸剑试探玩家资源。", "中段会准备文明或天作之合，让规则突然转向。", "如果玩家依赖固定招式，会清空序列或降低重复招式收益。", "打出当前最强牌，但尽量留下能克制玩家国王的平民。"], fullPressure: "压力达到 3 时，王座之影会强攻，同时尽量保留平民作为终局反制。" }
];
export const levelPresets = [
  { id: "floor_1_npc", floor: 1, battleType: "npc", name: "第一层：原住民试手", bossPersona: "gatekeeper", playerMaxHp: 18, bossMaxHp: 10, weather: "clear", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "minus_half", "save"] },
  { id: "floor_1_duel", floor: 1, battleType: "duel", name: "第一层：主角切磋", bossPersona: "gatekeeper", playerMaxHp: 18, bossMaxHp: 12, weather: "clear", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "minus_half", "save"] },
  { id: "floor_1_boss", floor: 1, battleType: "boss", name: "第一层 Boss：守门人", bossPersona: "gatekeeper", playerMaxHp: 18, bossMaxHp: 16, weather: "clear", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief"], selectedBossMoves: ["boss_single", "boss_probe_chain"], battleRule: { id: "none", name: "入塔试炼场", text: "无特殊规则。守门人的核心玩法是用盗贼偷血和短招式教玩家读牌。" }, bossSkills: [{ round: 3, name: "收紧门禁", effect: "bossWinBonus", value: 1, text: "Boss 下一次胜利额外造成 1 点伤害。" }, { round: 6, name: "稳住阵脚", effect: "pressureDown", value: 1, text: "Boss 压力 -1，避免过早爆发。" }], ownedItems: ["peek", "plus_half", "minus_half", "save"] },

  { id: "floor_2_npc", floor: 2, battleType: "npc", name: "第二层：巡逻士兵", bossPersona: "sentinel", playerMaxHp: 18, bossMaxHp: 14, weather: "rain", revealCount: 1, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "maid"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "minus_half", "plus_one"] },
  { id: "floor_2_duel", floor: 2, battleType: "duel", name: "第二层：防守切磋", bossPersona: "sentinel", playerMaxHp: 18, bossMaxHp: 16, weather: "rain", revealCount: 1, initialBuffs: ["player_hp_plus"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "maid", "noble"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "plus_half", "minus_half", "plus_one"] },
  { id: "floor_2_boss", floor: 2, battleType: "boss", name: "第二层 Boss：巡逻队长", bossPersona: "sentinel", playerMaxHp: 18, bossMaxHp: 21, weather: "rain", revealCount: 1, initialBuffs: ["player_hp_plus"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "maid", "noble"], selectedBossMoves: ["boss_single", "boss_bait", "boss_wall"], battleRule: { id: "sentinel_first_collapse_shield", name: "城墙防线", text: "Boss 第一次崩溃不受终极招式伤害，只重洗弃牌并获得崩溃负面状态。巡逻队长会先守住，再靠负负胜反击。" }, bossSkills: [{ round: 2, name: "列阵", effect: "pressureDown", value: 1, text: "Boss 清除 1 点压力，维持防守节奏。" }, { round: 5, name: "盾墙", effect: "bossDamageReduction", value: 3, text: "本回合 Boss 受到的玩家招式伤害 -3，最低为 1。" }, { round: 8, name: "反击号令", effect: "bossMoveDamageBonus", value: 2, text: "Boss 下一次招式伤害 +2。" }], ownedItems: ["peek", "plus_half", "minus_half", "plus_one"] },

  { id: "floor_3_npc", floor: 3, battleType: "npc", name: "第三层：雪地旅人", bossPersona: "strategist", playerMaxHp: 20, bossMaxHp: 16, weather: "hail", revealCount: 2, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief", "snowflake"], selectedBossMoves: ["boss_single"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_3_duel", floor: 3, battleType: "duel", name: "第三层：冷读切磋", bossPersona: "strategist", playerMaxHp: 20, bossMaxHp: 20, weather: "hail", revealCount: 2, initialBuffs: ["xray_boost"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief", "noble", "fortune_teller"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_3_boss", floor: 3, battleType: "boss", name: "第三层 Boss：雪花谋士", bossPersona: "strategist", playerMaxHp: 20, bossMaxHp: 25, weather: "hail", revealCount: 2, initialBuffs: ["xray_boost"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "maid", "thief", "noble", "snowflake", "fortune_teller"], selectedBossMoves: ["boss_single", "boss_bait", "boss_counter_chain", "boss_frost_lock"], battleRule: { id: "ice_hide_every_3", name: "冰雾棋盘", text: "每 3 回合开始时，隐藏 1 张已透视的 Boss 牌。雪花谋士会围绕透视干扰、占卜预告和序列清除来打乱玩家计划。" }, bossSkills: [{ round: 2, name: "雪幕", effect: "hideRevealed", value: 1, text: "隐藏 1 张已透视 Boss 牌。" }, { round: 5, name: "冷读", effect: "clearPlayerPattern", value: 2, text: "清除玩家最近 2 个胜负记录。" }, { round: 8, name: "冰封读牌", effect: "clearPlayerPattern", value: 1, text: "清除玩家最近 1 个胜负记录。" }], ownedItems: ["peek", "plus_half", "plus_one", "save"] },

  { id: "floor_4_npc", floor: 4, battleType: "npc", name: "第四层：青龙弟子", bossPersona: "four_symbols", playerMaxHp: 22, bossMaxHp: 18, weather: "sun", revealCount: 2, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "four_qinglong", "four_xuanwu"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "minus_half", "plus_one", "save"] },
  { id: "floor_4_duel", floor: 4, battleType: "duel", name: "第四层：破阵切磋", bossPersona: "four_symbols", playerMaxHp: 22, bossMaxHp: 22, weather: "sun", revealCount: 2, initialBuffs: ["collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "four_qinglong", "four_baihu", "four_zhuque"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "minus_half", "plus_one", "save"] },
  { id: "floor_4_boss", floor: 4, battleType: "boss", name: "第四层 Boss：四象门主", bossPersona: "four_symbols", playerMaxHp: 22, bossMaxHp: 29, weather: "sun", revealCount: 2, initialBuffs: ["collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "four_qinglong", "four_baihu", "four_zhuque", "four_xuanwu"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait", "boss_counter_chain", "boss_ritual", "boss_symbol_lock"], battleRule: { id: "four_symbols_ritual", name: "四象阵", text: "Boss 用四象牌战胜玩家时获得 1 层仪式；4 层时玩家受到 12 点伤害，仪式清零。四象牌全部赢过一次时也会直接结束战斗。" }, bossSkills: [{ round: 3, name: "青龙起势", effect: "fourSymbolBonus", value: 0.5, text: "Boss 下一张四象牌等级 +0.5。" }, { round: 6, name: "白虎压阵", effect: "fourSymbolBonus", value: 0.75, text: "Boss 下一张四象牌等级 +0.75。" }, { round: 9, name: "四象回环", effect: "recoverFourSymbol", value: 1, text: "Boss 从弃牌堆洗回 1 张四象牌。" }], ownedItems: ["peek", "minus_half", "plus_one", "save"] },

  { id: "floor_5_npc", floor: 5, battleType: "npc", name: "第五层：赌桌客", bossPersona: "gambler", playerMaxHp: 24, bossMaxHp: 20, weather: "clear", revealCount: 3, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "queen", "assassin", "fate"], selectedBossMoves: ["boss_single", "boss_bait"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_5_duel", floor: 5, battleType: "duel", name: "第五层：风险切磋", bossPersona: "gambler", playerMaxHp: 24, bossMaxHp: 26, weather: "clear", revealCount: 3, initialBuffs: ["random_commoner"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "queen", "noble", "false_god", "fate", "shadow"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_5_boss", floor: 5, battleType: "boss", name: "第五层 Boss：伪神赌徒", bossPersona: "gambler", playerMaxHp: 24, bossMaxHp: 33, weather: "clear", revealCount: 3, initialBuffs: ["random_commoner"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "queen", "noble", "false_god", "assassin", "fate", "shadow", "thief"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait", "boss_grind", "boss_comeback", "boss_gamble_swing"], battleRule: { id: "gambler_draw_pressure", name: "赌神牌桌", text: "双方失败时，Boss 压力 +1。伪神赌徒会用刺客、命运、伪神制造双方失败和高波动回合。" }, bossSkills: [{ round: 2, name: "开局压注", effect: "bossMoveDamageBonus", value: 2, text: "Boss 下一次招式伤害 +2。" }, { round: 5, name: "强行加注", effect: "bossMoveDamageBonus", value: 3, text: "Boss 下一次招式伤害 +3。" }, { round: 8, name: "伪神降桌", effect: "ignoreNextBossLossSequence", value: 1, text: "Boss 下一次失败不增加玩家胜负序列。" }], ownedItems: ["peek", "plus_one", "minus_half", "save"] },

  { id: "floor_6_npc", floor: 6, battleType: "npc", name: "第六层：暖风信徒", bossPersona: "executioner", playerMaxHp: 26, bossMaxHp: 22, weather: "warm", revealCount: 3, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "queen", "strike_blade", "rebel"], selectedBossMoves: ["boss_single", "boss_double"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_6_duel", floor: 6, battleType: "duel", name: "第六层：极限切磋", bossPersona: "executioner", playerMaxHp: 26, bossMaxHp: 30, weather: "warm", revealCount: 3, initialBuffs: ["player_move_plus"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "final_moment", "rebel"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], ownedItems: ["peek", "plus_half", "plus_one", "save"] },
  { id: "floor_6_boss", floor: 6, battleType: "boss", name: "第六层 Boss：暖风裁决者", bossPersona: "executioner", playerMaxHp: 26, bossMaxHp: 37, weather: "warm", revealCount: 3, initialBuffs: ["player_move_plus", "random_king"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "civilization", "final_moment", "rebel"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait", "boss_triple", "boss_counter_chain", "boss_execution", "boss_wall"], battleRule: { id: "execution_player_collapse_plus", name: "处刑台", text: "玩家进入崩溃时，受到的终极招式伤害 +3。暖风天气会让崩溃伤害按最大生命结算，所以裁决者会尽量打空玩家手牌。" }, bossSkills: [{ round: 2, name: "审判", effect: "bossWinBonus", value: 2, text: "Boss 下一次胜利额外造成 2 点伤害。" }, { round: 5, name: "断罪", effect: "removePlayerDiscard", value: 1, text: "玩家弃牌堆 1 张牌本场不能洗回。" }, { round: 8, name: "处刑宣告", effect: "bossMoveDamageBonus", value: 4, text: "Boss 下一次招式伤害 +4。" }], ownedItems: ["peek", "plus_half", "plus_one", "save"] },

  { id: "floor_7_npc", floor: 7, battleType: "npc", name: "第七层：王座侍从", bossPersona: "king", playerMaxHp: 30, bossMaxHp: 26, weather: "clear", revealCount: 4, initialBuffs: [], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "rebel", "beggar"], selectedBossMoves: ["boss_single", "boss_double"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_7_duel", floor: 7, battleType: "duel", name: "第七层：主角之影", bossPersona: "king", playerMaxHp: 30, bossMaxHp: 34, weather: "clear", revealCount: 4, initialBuffs: ["collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "minister", "commoner", "guard", "noble", "queen", "strike_blade", "forge_blade", "false_god"], selectedBossMoves: ["boss_single", "boss_double", "boss_bait"], ownedItems: ["peek", "plus_one", "minus_half", "save"] },
  { id: "floor_7_boss", floor: 7, battleType: "boss", name: "第七层 Boss：王座之影", bossPersona: "king", playerMaxHp: 30, bossMaxHp: 44, weather: "clear", revealCount: 4, initialBuffs: ["chaotic_battlefield", "collapse_guard"], playerDeck: ["king", "minister", "commoner"], bossDeck: ["king", "commoner", "perfect_match", "thief", "beggar", "rebel", "maid", "forge_blade", "assassin", "fortune_teller"], selectedBossMoves: ["boss_single", "boss_bait", "boss_counter_chain", "boss_comeback", "boss_grind", "boss_final", "boss_crown_check"], battleRule: { id: "king_repeat_length_penalty", name: "王座法则", text: "王座之影第一次行动会打出天作之合，之后等级排序反转，低等级牌获胜。玩家连续触发同长度招式时，从第二次开始该招式伤害 -1，最低为 1。" }, bossSkills: [{ round: 3, name: "王权凝视", effect: "reduceReveal", value: 1, text: "玩家透视数量 -1，最低为 0。" }, { round: 6, name: "旧律重申", effect: "clearBothPatterns", value: 1, text: "清空双方胜负序列，打断玩家招式积累。" }, { round: 9, name: "终局加冕", effect: "finalCoronation", value: 3, text: "清空双方胜负序列，Boss 下一次招式伤害 +3。" }], ownedItems: ["peek", "plus_one", "minus_half", "save"] }
];


