export const cardLibrary = [
  { id: "king", name: "国王", level: 3, type: "基础", note: "高等级核心牌，会被平民克制" },
  { id: "minister", name: "大臣", level: 2, type: "基础", note: "稳定中位牌" },
  { id: "commoner", name: "平民", level: 1, type: "基础", note: "特殊克制国王" },
  { id: "guard", name: "护卫", level: 2.5, type: "补充", note: "高位补充牌" },
  { id: "queen", name: "王后", level: 2.9, type: "补充", note: "接近国王的高位牌" },
  { id: "noble", name: "贵族", level: 2.3, type: "补充", note: "压制中位牌" },
  { id: "maid", name: "侍女", level: 1.5, type: "补充", note: "中低位补充牌" },
  { id: "thief", name: "盗贼", level: 0.5, type: "补充", note: "低位诱导牌" },
  { id: "regicide", name: "弑君者", level: 1, type: "功能", note: "手中没有国王时视为国王" },
  { id: "assassin", name: "刺客", level: 0, type: "功能", note: "强制双输" },
  { id: "oracle", name: "占卜师", level: 0, type: "功能", note: "本次必输，下次必赢" },
  { id: "sword", name: "挥剑", level: 4, type: "功能", note: "初始高点，适合验证数值压制" }
];

export const defaultPlayerDeck = [
  "king",
  "minister",
  "commoner",
  "guard",
  "maid",
  "thief",
  "noble",
  "queen",
  "assassin",
  "regicide"
];

export const defaultBossDeck = [
  "king",
  "minister",
  "commoner",
  "guard",
  "maid",
  "thief",
  "noble",
  "sword",
  "oracle",
  "queen"
];

export const moveLibrary = [
  { id: "single_win", name: "一胜", pattern: ["win"], damage: 1, price: 0, note: "固有招式" },
  { id: "double_win", name: "胜胜", pattern: ["win", "win"], damage: 3, price: 20, note: "稳定爆发" },
  { id: "win_win_loss", name: "胜胜负", pattern: ["win", "win", "loss"], damage: 5, price: 20, note: "高风险高收益" },
  { id: "counter", name: "负胜", pattern: ["loss", "win"], damage: 2, price: 20, note: "反击型招式" },
  { id: "comeback", name: "负负胜", pattern: ["loss", "loss", "win"], damage: 4, price: 25, note: "逆风反打" }
];

export const bossMoveLibrary = [
  { id: "boss_single", name: "压制", pattern: ["win"], damage: 1, note: "Boss 固有招式" },
  { id: "boss_double", name: "连压", pattern: ["win", "win"], damage: 3, note: "连续胜利造成爆发" },
  { id: "boss_bait", name: "诱敌", pattern: ["loss", "win"], damage: 2, note: "先输后反击" }
];

export const itemLibrary = [
  { id: "peek", name: "预见牌", price: 100, note: "显示 Boss 下一张候选牌，本模拟器中显示 Boss 最高优先选择" },
  { id: "plus_half", name: "加 0.5 牌", price: 100, note: "本回合自己的牌等级 +0.5" },
  { id: "plus_one", name: "加 1 牌", price: 130, note: "本回合自己的牌等级 +1" },
  { id: "minus_half", name: "减 0.5 牌", price: 100, note: "本回合 Boss 的牌等级 -0.5" },
  { id: "save", name: "续命牌", price: 120, note: "本回合自己输掉的牌不进弃牌堆" }
];

export const weatherLibrary = [
  { id: "clear", name: "晴朗", note: "无特殊效果" },
  { id: "rain", name: "雨季", note: "经济天气，本战斗模拟中不改变胜负" },
  { id: "sun", name: "烈日", note: "所有 .5 牌等级 -0.5" },
  { id: "hail", name: "冰雹", note: "所有 .5 牌等级 +0.5" },
  { id: "warm", name: "暖风", note: "崩溃触发的终极招式直接击败目标" }
];

export const resultLabels = {
  win: "胜",
  loss: "负",
  draw: "双输"
};
