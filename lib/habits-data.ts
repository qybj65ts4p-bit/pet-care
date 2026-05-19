export const STORAGE_KEY = "child_habit_points_v1";

export type Habit = {
  id: string;
  emoji: string;
  name: string;
  points: number;
  completedDate: string;
};

export type Reward = {
  id: string;
  name: string;
  cost: number;
};

export type HistoryItem = {
  ts: string;
  text?: string;
  kind?: "complete" | "other";
  status?: "完成";
  date?: string;
  time?: string;
  habitName?: string;
  emoji?: string;
  points?: number;
};

export type AppData = {
  activeChildId: string;
  children: ChildProfile[];
  rewards: Reward[];
};

export type ChildProfile = {
  id: string;
  childName: string;
  points: number;
  streak: number;
  lastCheckDate: string;
  habits: Habit[];
  history: HistoryItem[];
};

export type TemplateItem = {
  emoji: string;
  name: string;
  points: number;
};

export type TemplateCategory = {
  desc: string;
  items: TemplateItem[];
};

export type TemplateLibrary = Record<string, TemplateCategory>;

export const TEMPLATE_LIBRARY: TemplateLibrary = {
  "热门": {
    desc: "从高频实用习惯开始，最容易坚持。",
    items: [
      { emoji: "🌞", name: "8点前起床", points: 6 },
      { emoji: "🏃", name: "1小时运动", points: 10 },
      { emoji: "📖", name: "10页阅读", points: 8 },
      { emoji: "🥬", name: "健康饮食", points: 7 },
      { emoji: "📝", name: "记录进度", points: 6 }
    ]
  },
  "生活": {
    desc: "生活自理，培养独立能力。",
    items: [
      { emoji: "🌞", name: "7点早起", points: 6 },
      { emoji: "🧹", name: "整理房间", points: 7 },
      { emoji: "🧺", name: "洗衣服", points: 8 },
      { emoji: "💧", name: "一天5杯水", points: 6 },
      { emoji: "🍎", name: "吃水果", points: 5 },
      { emoji: "🍳", name: "下厨做饭", points: 9 },
      { emoji: "🚶", name: "散步20分钟", points: 6 },
      { emoji: "🖊️", name: "写日记", points: 7 }
    ]
  },
  "学习": {
    desc: "学习成长，提升自己的好习惯。",
    items: [
      { emoji: "📚", name: "刷题备考1h", points: 10 },
      { emoji: "📗", name: "学英语30min", points: 8 },
      { emoji: "📖", name: "阅读30min", points: 8 },
      { emoji: "🎙️", name: "听播客", points: 6 },
      { emoji: "✒️", name: "练字书法", points: 7 },
      { emoji: "🍅", name: "番茄25min", points: 6 }
    ]
  },
  "健康": {
    desc: "照顾身体，身心都更有能量。",
    items: [
      { emoji: "👀", name: "眼保健操", points: 5 },
      { emoji: "🧘", name: "冥想5分钟", points: 6 },
      { emoji: "😴", name: "午休20分钟", points: 5 },
      { emoji: "👣", name: "睡前泡脚", points: 6 },
      { emoji: "💊", name: "按时吃药", points: 7 },
      { emoji: "🧴", name: "睡前护手霜", points: 5 }
    ]
  },
  "坏习惯": {
    desc: "减少坏习惯，每进步一点都值得奖励。",
    items: [
      { emoji: "🌙", name: "不熬夜(12点前睡)", points: 9 },
      { emoji: "🍰", name: "少吃甜食", points: 7 },
      { emoji: "🧋", name: "少喝奶茶", points: 7 },
      { emoji: "🍿", name: "少吃零食", points: 6 },
      { emoji: "🎮", name: "少玩游戏", points: 8 },
      { emoji: "🛍️", name: "不冲动消费", points: 8 }
    ]
  },
  "运动": {
    desc: "运动拉满，体能和专注力一起提高。",
    items: [
      { emoji: "🧘", name: "瑜伽拉伸", points: 7 },
      { emoji: "🏋️", name: "力量训练", points: 9 },
      { emoji: "🤸", name: "健身操10min", points: 6 },
      { emoji: "🏃", name: "跑步20min", points: 8 },
      { emoji: "🏊", name: "游泳锻炼", points: 10 },
      { emoji: "🚴", name: "骑行", points: 8 }
    ]
  },
  "兴趣": {
    desc: "兴趣爱好，让生活更有创造力。",
    items: [
      { emoji: "🎨", name: "画画创作", points: 8 },
      { emoji: "🎹", name: "练钢琴1h", points: 10 },
      { emoji: "🧩", name: "拼图游戏", points: 7 },
      { emoji: "📷", name: "拍照记录", points: 6 },
      { emoji: "🩰", name: "舞蹈课", points: 9 },
      { emoji: "🧵", name: "做手工", points: 8 }
    ]
  },
  "自我成长": {
    desc: "向内成长，情绪和表达都更成熟。",
    items: [
      { emoji: "🙏", name: "写下感恩3件事", points: 8 },
      { emoji: "📓", name: "记录今日心情", points: 7 },
      { emoji: "🤗", name: "夸奖一个他人", points: 6 },
      { emoji: "🪞", name: "反思今日得失", points: 8 },
      { emoji: "💡", name: "学到一个新观点", points: 7 },
      { emoji: "🎯", name: "写下明日计划", points: 7 }
    ]
  },
  "社交": {
    desc: "社交沟通，与他人建立良好关系。",
    items: [
      { emoji: "📞", name: "联系朋友", points: 6 },
      { emoji: "👥", name: "与好友聚会", points: 7 },
      { emoji: "💌", name: "给朋友发消息", points: 5 },
      { emoji: "👵", name: "每周家庭电话", points: 8 },
      { emoji: "🎁", name: "给家人准备礼物", points: 9 },
      { emoji: "🤝", name: "表达感谢", points: 6 }
    ]
  },
  "护理": {
    desc: "个人护理，从细节养成精致习惯。",
    items: [
      { emoji: "🧴", name: "护肤保养", points: 6 },
      { emoji: "🦷", name: "刷牙漱口", points: 5 },
      { emoji: "💅", name: "修剪指甲", points: 6 },
      { emoji: "🧕", name: "洗头护发", points: 7 },
      { emoji: "🧢", name: "涂防晒", points: 6 },
      { emoji: "🪥", name: "每月换牙刷", points: 8 }
    ]
  }
};

function defaultHabits(): Habit[] {
  return [
    { id: "h1", emoji: "🌞", name: "按时起床", points: 5, completedDate: "" },
    { id: "h2", emoji: "📖", name: "阅读20分钟", points: 8, completedDate: "" },
    { id: "h3", emoji: "🧸", name: "自己整理玩具", points: 6, completedDate: "" }
  ];
}

function defaultRewards(): Reward[] {
  return [
    { id: "r1", name: "周末去公园", cost: 30 },
    { id: "r2", name: "看一部动画电影", cost: 50 },
    { id: "r3", name: "小礼物盲盒", cost: 80 }
  ];
}

export function createDefaultChild(id = "c1", childName = "小朋友"): ChildProfile {
  return {
    id,
    childName,
    points: 0,
    streak: 0,
    lastCheckDate: "",
    habits: defaultHabits(),
    history: []
  };
}

export const DEFAULT_DATA: AppData = {
  activeChildId: "c1",
  children: [createDefaultChild()],
  rewards: defaultRewards()
};

export function normalizeHabit(raw: Partial<Habit> & { name?: string }): Habit {
  return {
    id: raw.id || `h${Date.now()}`,
    emoji: raw.emoji || "⭐",
    name: String(raw.name || "未命名习惯").trim(),
    points: Math.min(50, Math.max(1, Math.floor(Number(raw.points) || 5))),
    completedDate: raw.completedDate || ""
  };
}

export function normalizeChild(raw: Partial<ChildProfile> & { childName?: string }): ChildProfile {
  const name = String(raw.childName || "小朋友").trim() || "小朋友";
  const habits = Array.isArray(raw.habits) ? raw.habits.map((h) => normalizeHabit(h as Partial<Habit>)) : defaultHabits();

  return {
    id: raw.id || `c${Date.now()}`,
    childName: name,
    points: Math.max(0, Math.floor(Number(raw.points) || 0)),
    streak: Math.max(0, Math.floor(Number(raw.streak) || 0)),
    lastCheckDate: typeof raw.lastCheckDate === "string" ? raw.lastCheckDate : "",
    habits,
    history: Array.isArray(raw.history) ? raw.history : []
  };
}
