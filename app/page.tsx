"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  createDefaultChild,
  DEFAULT_DATA,
  normalizeChild,
  normalizeHabit,
  STORAGE_KEY,
  TEMPLATE_LIBRARY,
  type AppData,
  type ChildProfile,
  type HistoryItem,
  type Habit,
  type Reward,
} from "../lib/habits-data";

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function levelOf(points: number): number {
  return Math.floor(points / 20) + 1;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const FOCUS_MINUTES_PER_COMPLETE = 10;
type FocusRange = "day" | "week" | "month" | "year";

type FocusPoint = {
  label: string;
  hours: number;
};

type FocusWindow = {
  start: Date;
  end: Date;
  label: string;
};

function toDate(value: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date();
  return d;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function two(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
}

function formatMd(date: Date): string {
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

function formatHours(minutes: number): string {
  return `${(minutes / 60).toFixed(1)}h`;
}

function getFocusWindow(range: FocusRange, offset: number, now = new Date()): FocusWindow {
  if (range === "day") {
    const start = addDays(startOfDay(now), offset);
    const end = addDays(start, 1);
    return {
      start,
      end,
      label: formatMd(start),
    };
  }

  if (range === "week") {
    const start = addDays(startOfWeek(now), offset * 7);
    const end = addDays(start, 7);
    return {
      start,
      end,
      label: `${formatMd(start)} ~ ${formatMd(addDays(end, -1))}`,
    };
  }

  if (range === "month") {
    const base = startOfMonth(now);
    const start = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return {
      start,
      end,
      label: `${start.getFullYear()}.${start.getMonth() + 1}`,
    };
  }

  const base = startOfYear(now);
  const start = new Date(base.getFullYear() + offset, 0, 1);
  const end = new Date(start.getFullYear() + 1, 0, 1);
  return {
    start,
    end,
    label: `${start.getFullYear()}年`,
  };
}

function buildTrendPoints(range: FocusRange, start: Date, end: Date, records: HistoryItem[]): FocusPoint[] {
  if (range === "day") {
    const buckets = Array.from({ length: 24 }, (_, i) => ({
      label: `${two(i)}:00`,
      count: 0,
    }));
    records.forEach((item) => {
      const hour = toDate(item.ts).getHours();
      if (hour >= 0 && hour < 24) buckets[hour].count += 1;
    });
    return buckets.map((bucket) => ({
      label: bucket.label,
      hours: (bucket.count * FOCUS_MINUTES_PER_COMPLETE) / 60,
    }));
  }

  if (range === "week") {
    const buckets = Array.from({ length: 7 }, (_, i) => ({
      label: formatMd(addDays(start, i)),
      count: 0,
    }));
    records.forEach((item) => {
      const d = toDate(item.ts);
      const index = Math.floor((startOfDay(d).getTime() - start.getTime()) / 86400000);
      if (index >= 0 && index < 7) buckets[index].count += 1;
    });
    return buckets.map((bucket) => ({
      label: bucket.label,
      hours: (bucket.count * FOCUS_MINUTES_PER_COMPLETE) / 60,
    }));
  }

  if (range === "month") {
    const dayCount = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000));
    const buckets = Array.from({ length: dayCount }, (_, i) => ({
      label: `${i + 1}`,
      count: 0,
    }));
    records.forEach((item) => {
      const d = toDate(item.ts);
      const index = Math.floor((startOfDay(d).getTime() - start.getTime()) / 86400000);
      if (index >= 0 && index < dayCount) buckets[index].count += 1;
    });
    return buckets.map((bucket) => ({
      label: bucket.label,
      hours: (bucket.count * FOCUS_MINUTES_PER_COMPLETE) / 60,
    }));
  }

  const buckets = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    count: 0,
  }));
  records.forEach((item) => {
    const d = toDate(item.ts);
    const index = d.getMonth();
    if (index >= 0 && index < 12) buckets[index].count += 1;
  });
  return buckets.map((bucket) => ({
    label: bucket.label,
    hours: (bucket.count * FOCUS_MINUTES_PER_COMPLETE) / 60,
  }));
}

function toCompleteHistory(habit: Habit, now = new Date()): HistoryItem {
  return {
    ts: now.toISOString(),
    kind: "complete",
    status: "完成",
    date: formatDate(now),
    time: formatTime(now),
    habitName: habit.name,
    emoji: habit.emoji || "⭐",
    points: habit.points,
  };
}

function normalizeHistoryItem(raw: HistoryItem): HistoryItem | null {
  if (raw.kind === "complete") {
    if (raw.date && raw.time) {
      return {
        ...raw,
        status: "完成",
        emoji: raw.emoji || "⭐",
        points: Math.min(50, Math.max(1, Math.floor(Number(raw.points) || 5))),
      };
    }
    const d = raw.ts ? new Date(raw.ts) : new Date();
    return {
      ...raw,
      kind: "complete",
      status: "完成",
      date: formatDate(d),
      time: formatTime(d),
      emoji: raw.emoji || "⭐",
      points: Math.min(50, Math.max(1, Math.floor(Number(raw.points) || 5))),
    };
  }

  if (raw.text && raw.text.includes("完成习惯")) {
    const d = raw.ts ? new Date(raw.ts) : new Date();
    return {
      ts: raw.ts,
      kind: "complete",
      status: "完成",
      date: formatDate(d),
      time: formatTime(d),
      emoji: "⭐",
      points: 5,
    };
  }

  return null;
}

function scoreLabel(count: number): string {
  const safeCount = Math.max(0, Math.floor(count));
  return `⭐ +${safeCount}`;
}

function ScoreBadge({ count }: { count: number }) {
  const safeCount = Math.max(0, Math.floor(count));
  return (
    <span className="score-badge" aria-label={`${safeCount}星`} title={`${safeCount}星`}>
      <span className="score-star" aria-hidden="true" />
      <span className="score-value">+{safeCount}</span>
    </span>
  );
}

function normalizeRewards(raw: unknown, fallback: Reward[]): Reward[] {
  if (!Array.isArray(raw)) return fallback;
  return raw
    .map((item) => ({
      id: String((item as Partial<Reward>).id || `r${Date.now()}${Math.floor(Math.random() * 1000)}`),
      name: String((item as Partial<Reward>).name || "未命名奖励").trim(),
      cost: Math.max(1, Math.floor(Number((item as Partial<Reward>).cost) || 10)),
    }))
    .filter((item) => item.name);
}

function normalizeHistoryList(raw: unknown): HistoryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeHistoryItem(item as HistoryItem))
    .filter((item): item is HistoryItem => Boolean(item));
}

function loadData(): AppData {
  if (typeof window === "undefined") {
    return structuredClone(DEFAULT_DATA);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(DEFAULT_DATA);

  try {
    const parsed = JSON.parse(raw) as Partial<AppData> &
      Partial<ChildProfile> & {
        children?: Partial<ChildProfile>[];
      };

    const rewards = normalizeRewards(parsed.rewards, structuredClone(DEFAULT_DATA.rewards));

    if (Array.isArray(parsed.children) && parsed.children.length > 0) {
      const children = parsed.children.map((child, index) => {
        const normalized = normalizeChild({ ...child, id: child.id || `c${index + 1}` });
        return {
          ...normalized,
          history: normalizeHistoryList(child.history),
        };
      });

      const activeChildId =
        typeof parsed.activeChildId === "string" && children.some((child) => child.id === parsed.activeChildId)
          ? parsed.activeChildId
          : children[0].id;

      return {
        activeChildId,
        children,
        rewards,
      };
    }

    const legacyChild = normalizeChild({
      id: "c1",
      childName: parsed.childName,
      points: parsed.points,
      streak: parsed.streak,
      lastCheckDate: parsed.lastCheckDate,
      habits: Array.isArray(parsed.habits)
        ? parsed.habits.map((h) => normalizeHabit(h as Partial<Habit>))
        : undefined,
      history: normalizeHistoryList(parsed.history),
    });

    return {
      activeChildId: legacyChild.id,
      children: [legacyChild],
      rewards,
    };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function doneCountOfToday(child: ChildProfile): number {
  const today = getToday();
  return child.habits.filter((h) => h.completedDate === today).length;
}

export default function HomePage() {
  const categories = useMemo(() => Object.keys(TEMPLATE_LIBRARY), []);
  const [activeCategory, setActiveCategory] = useState<string>("热门");
  const [state, setState] = useState<AppData>(() => loadData());
  const [newChildName, setNewChildName] = useState<string>("");
  const newChildNameRef = useRef<HTMLInputElement | null>(null);
  const [newHabitPoints, setNewHabitPoints] = useState<string>("5");
  const [newRewardName, setNewRewardName] = useState<string>("");
  const [newRewardPoints, setNewRewardPoints] = useState<string>("20");
  const [focusRange, setFocusRange] = useState<FocusRange>("week");
  const [focusOffset, setFocusOffset] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeChild = useMemo(() => {
    return state.children.find((child) => child.id === state.activeChildId) || state.children[0] || createDefaultChild();
  }, [state]);

  const level = levelOf(activeChild.points);
  const currentBase = (level - 1) * 20;
  const toNext = level * 20 - activeChild.points;
  const progress = Math.max(0, Math.min(100, ((activeChild.points - currentBase) / 20) * 100));
  const doneToday = doneCountOfToday(activeChild);

  function updateActiveChild(updater: (child: ChildProfile) => ChildProfile): void {
    setState((prev) => {
      const index = prev.children.findIndex((child) => child.id === prev.activeChildId);
      if (index < 0) return prev;

      const nextChildren = [...prev.children];
      nextChildren[index] = updater(nextChildren[index]);
      return {
        ...prev,
        children: nextChildren,
      };
    });
  }

  function hasHabit(name: string): boolean {
    const n = name.trim().toLowerCase();
    return activeChild.habits.some((h) => h.name.trim().toLowerCase() === n);
  }

  function pushHabit(habit: Partial<Habit> & { name: string }): void {
    const clean = normalizeHabit(habit);
    if (!clean.name) return;
    if (hasHabit(clean.name)) {
      window.alert(`习惯「${clean.name}」已在任务列表里啦～`);
      return;
    }

    clean.id = `h${Date.now()}${Math.floor(Math.random() * 1000)}`;
    updateActiveChild((child) => ({
      ...child,
      habits: [clean, ...child.habits],
    }));
  }

  function updateStreak(child: ChildProfile): ChildProfile {
    const today = getToday();
    const base = new Date(`${today}T00:00:00`);
    base.setDate(base.getDate() - 1);
    const yesterday = base.toISOString().slice(0, 10);

    if (child.lastCheckDate === today) return child;

    return {
      ...child,
      streak: child.lastCheckDate === yesterday ? child.streak + 1 : 1,
      lastCheckDate: today,
    };
  }

  function toggleHabit(id: string): void {
    const today = getToday();
    updateActiveChild((child) => {
      const target = child.habits.find((h) => h.id === id);
      if (!target) return child;

      const done = target.completedDate === today;
      const nextHabits = child.habits.map((h) => {
        if (h.id !== id) return h;
        return { ...h, completedDate: done ? "" : today };
      });

      let next = {
        ...child,
        habits: nextHabits,
        points: done ? Math.max(0, child.points - target.points) : child.points + target.points,
        history: done ? child.history : [toCompleteHistory(target), ...child.history].slice(0, 50),
      };

      if (!done) {
        next = updateStreak(next);
      }
      return next;
    });
  }

  function redeemReward(id: string): void {
    const reward = state.rewards.find((r) => r.id === id);
    if (!reward) return;

    updateActiveChild((child) => {
      if (child.points < reward.cost) {
        window.alert("积分不够，继续努力哦！");
        return child;
      }

      return {
        ...child,
        points: child.points - reward.cost,
      };
    });
  }

  function addReward(e?: FormEvent): void {
    if (e) e.preventDefault();

    const name = newRewardName.trim();
    const cost = Number(newRewardPoints);
    if (!name) {
      window.alert("请输入奖品名称");
      return;
    }
    if (!Number.isFinite(cost) || cost < 1) {
      window.alert("请输入正确积分");
      return;
    }

    const normalizedName = name.toLowerCase();
    const duplicated = state.rewards.some((item) => item.name.trim().toLowerCase() === normalizedName);
    if (duplicated) {
      window.alert(`奖品「${name}」已存在`);
      return;
    }

    const nextReward: Reward = {
      id: `r${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name,
      cost: Math.floor(cost),
    };
    setState((prev) => ({
      ...prev,
      rewards: [nextReward, ...prev.rewards],
    }));
    setNewRewardName("");
    setNewRewardPoints("20");
  }

  function removeReward(id: string): void {
    const reward = state.rewards.find((item) => item.id === id);
    if (!reward) return;
    const ok = window.confirm(`确定删除奖品「${reward.name}」吗？`);
    if (!ok) return;

    setState((prev) => ({
      ...prev,
      rewards: prev.rewards.filter((item) => item.id !== id),
    }));
  }

  function addHabitManually(): void {
    const nameEl = document.getElementById("habitName") as HTMLInputElement | null;
    if (!nameEl) return;

    const name = nameEl.value.trim();
    const points = Number(newHabitPoints);

    if (!name) {
      window.alert("请输入习惯名称");
      return;
    }
    if (!Number.isFinite(points) || points < 1) {
      window.alert("请输入正确积分");
      return;
    }

    pushHabit({ emoji: "⭐", name, points, completedDate: "" });
    nameEl.value = "";
    setNewHabitPoints("5");
  }

  function addFromTemplate(index: number): void {
    const info = TEMPLATE_LIBRARY[activeCategory];
    const tpl = info?.items[index];
    if (!tpl) return;

    const select = document.querySelector(
      `select[data-role='point-select'][data-index='${index}']`
    ) as HTMLSelectElement | null;
    const points = select ? Number(select.value) : tpl.points;

    pushHabit({ emoji: tpl.emoji, name: tpl.name, points, completedDate: "" });
  }

  function goNewDay(): void {
    updateActiveChild((child) => ({
      ...child,
      habits: child.habits.map((h) => ({
        ...h,
        completedDate: h.completedDate === getToday() ? h.completedDate : "",
      })),
    }));
  }

  function onChildNameChange(e: ChangeEvent<HTMLInputElement>): void {
    const name = e.target.value;
    updateActiveChild((child) => ({
      ...child,
      childName: name || "小朋友",
    }));
  }

  function onActiveChildChange(e: ChangeEvent<HTMLSelectElement>): void {
    const childId = e.target.value;
    setState((prev) => {
      if (!prev.children.some((child) => child.id === childId)) return prev;
      return {
        ...prev,
        activeChildId: childId,
      };
    });
  }

  function addChild(e?: FormEvent): void {
    if (e) e.preventDefault();

    const liveValue = newChildNameRef.current?.value ?? newChildName;
    const typedName = liveValue.trim();

    setState((prev) => {
      const baseName = typedName || `小朋友${prev.children.length + 1}`;
      const existingNames = new Set(prev.children.map((child) => child.childName.trim().toLowerCase()));
      let name = baseName;
      let suffix = 2;
      while (existingNames.has(name.toLowerCase())) {
        name = `${baseName}${suffix}`;
        suffix += 1;
      }

      const id = `c${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const newChild = createDefaultChild(id, name);
      return {
        ...prev,
        activeChildId: id,
        children: [...prev.children, newChild],
      };
    });

    setNewChildName("");
    if (newChildNameRef.current) {
      newChildNameRef.current.value = "";
      newChildNameRef.current.focus();
    }
  }

  function removeChild(childId: string): void {
    if (state.children.length <= 1) {
      window.alert("至少保留 1 位孩子");
      return;
    }

    const target = state.children.find((child) => child.id === childId);
    if (!target) return;

    const ok = window.confirm(`确认删除「${target.childName}」吗？该孩子的习惯和记录会一并删除。`);
    if (!ok) return;

    setState((prev) => {
      if (prev.children.length <= 1) return prev;
      const nextChildren = prev.children.filter((child) => child.id !== childId);
      if (nextChildren.length === 0) return prev;
      return {
        ...prev,
        children: nextChildren,
        activeChildId: prev.activeChildId === childId ? nextChildren[0].id : prev.activeChildId,
      };
    });
  }

  const activeInfo = TEMPLATE_LIBRARY[activeCategory];
  const completeHistory = useMemo(
    () => activeChild.history.filter((h) => h.kind === "complete"),
    [activeChild.history]
  );
  const completedTodayItems = completeHistory.filter((h) => h.ts.slice(0, 10) === getToday());
  const focusWindow = useMemo(() => getFocusWindow(focusRange, focusOffset), [focusOffset, focusRange]);
  const focusHistory = useMemo(() => {
    const startMs = focusWindow.start.getTime();
    const endMs = focusWindow.end.getTime();
    return completeHistory.filter((item) => {
      const ts = toDate(item.ts).getTime();
      return ts >= startMs && ts < endMs;
    });
  }, [completeHistory, focusWindow.end, focusWindow.start]);
  const focusTotalMinutes = focusHistory.length * FOCUS_MINUTES_PER_COMPLETE;
  const focusTotalHoursText = formatHours(focusTotalMinutes);
  const focusDaysCount = useMemo(() => {
    const keys = new Set(focusHistory.map((item) => toDateKey(toDate(item.ts))));
    return keys.size;
  }, [focusHistory]);
  const focusTimes = focusHistory.length;
  const focusPoints = useMemo(
    () => buildTrendPoints(focusRange, focusWindow.start, focusWindow.end, focusHistory),
    [focusHistory, focusRange, focusWindow.end, focusWindow.start]
  );
  const focusMaxY = Math.max(0.2, ...focusPoints.map((p) => p.hours));
  const chartWidth = 540;
  const chartHeight = 210;
  const chartPadLeft = 34;
  const chartPadRight = 16;
  const chartPadTop = 16;
  const chartPadBottom = 34;
  const plotWidth = chartWidth - chartPadLeft - chartPadRight;
  const plotHeight = chartHeight - chartPadTop - chartPadBottom;
  const focusLinePoints = focusPoints.map((point, index) => {
    const x =
      chartPadLeft +
      (focusPoints.length <= 1 ? 0 : (index / (focusPoints.length - 1)) * plotWidth);
    const y = chartPadTop + (1 - point.hours / focusMaxY) * plotHeight;
    return { x, y, label: point.label };
  });
  const focusLinePath = focusLinePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const focusAreaPath = focusLinePoints.length
    ? `${focusLinePath} L${focusLinePoints[focusLinePoints.length - 1].x},${chartPadTop + plotHeight} L${focusLinePoints[0].x},${chartPadTop + plotHeight} Z`
    : "";
  const yTicks = [0, 0.05, 0.1, 0.15, 0.2].map((t) => (t <= focusMaxY ? t : focusMaxY));
  const dedupTicks = Array.from(new Set(yTicks.map((v) => Number(v.toFixed(2)))));
  const focusDistribution = useMemo(() => {
    const bucket = new Map<
      string,
      { name: string; emoji: string; points: number; count: number; minutes: number }
    >();
    focusHistory.forEach((item) => {
      const key = item.habitName || "已完成任务";
      const current = bucket.get(key) || {
        name: key,
        emoji: item.emoji || "⭐",
        points: Math.max(1, Math.floor(Number(item.points) || 5)),
        count: 0,
        minutes: 0,
      };
      current.count += 1;
      current.minutes += FOCUS_MINUTES_PER_COMPLETE;
      bucket.set(key, current);
    });
    const list = Array.from(bucket.values()).sort((a, b) => b.minutes - a.minutes).slice(0, 3);
    return list.map((item) => ({
      ...item,
      percent: focusTotalMinutes > 0 ? Math.round((item.minutes / focusTotalMinutes) * 100) : 0,
    }));
  }, [focusHistory, focusTotalMinutes]);

  return (
    <div className="app">
      <section className="card hero">
        <div className="hero-top">
          <div>
            <h1 className="title">孩子习惯养成积分系统</h1>
            <p className="subtitle">可爱打卡，快乐攒分，慢慢养成好习惯</p>
          </div>
          <div className="hero-controls">
            <div className="name-wrap">
              <label htmlFor="activeChild">当前孩子</label>
              <select id="activeChild" className="hero-select" value={activeChild.id} onChange={onActiveChildChange}>
                {state.children.map((child) => (
                  <option value={child.id} key={child.id}>
                    {child.childName}
                  </option>
                ))}
              </select>
            </div>
            <div className="name-wrap">
              <label htmlFor="childName">孩子名</label>
              <input
                id="childName"
                type="text"
                value={activeChild.childName}
                placeholder="例如：小宇"
                onChange={onChildNameChange}
              />
            </div>
            <div className="name-wrap">
              <label htmlFor="newChildName">添加小朋友</label>
              <form onSubmit={addChild}>
                <div className="inline-actions">
                  <input
                    ref={newChildNameRef}
                    id="newChildName"
                    type="text"
                    placeholder="例如：小米"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addChild(e);
                      }
                    }}
                  />
                  <button type="submit" className="btn-primary btn-small">
                    添加
                  </button>
                </div>
                <div className="tiny">已添加 {state.children.length} 位，留空会自动命名，重名会自动加编号</div>
              </form>
            </div>
          </div>
        </div>

        <div className="multi-kids">
          {state.children.map((child) => {
            const childLevel = levelOf(child.points);
            const childDone = doneCountOfToday(child);
            const isActive = child.id === activeChild.id;
            return (
              <div
                key={child.id}
                className={`kid-card-wrap${isActive ? " active" : ""}`}
              >
                <button
                  className={`kid-card${isActive ? " active" : ""}`}
                  onClick={() => setState((prev) => ({ ...prev, activeChildId: child.id }))}
                >
                  <div className="kid-head">
                    <div className="kid-name">{child.childName}</div>
                    <div className="kid-stars" aria-hidden="true">
                      <span className="kid-star" />
                      <span className="kid-star is-dim" />
                    </div>
                  </div>
                  <div className="kid-metrics">
                    <span className="kid-metric">总积分：{child.points}</span>
                    <span className="kid-metric">等级：Lv.{childLevel}</span>
                    <span className="kid-metric">连续：{child.streak}天</span>
                    <span className="kid-metric">今日：{childDone}项</span>
                  </div>
                  <span className="kid-glow-line" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="kid-remove"
                  onClick={() => removeChild(child.id)}
                  disabled={state.children.length <= 1}
                  title={state.children.length <= 1 ? "至少保留 1 位孩子" : `删除 ${child.childName}`}
                >
                  删除
                </button>
              </div>
            );
          })}
        </div>

        <div className="stats">
          <div className="stat">
            <div className="label">总积分</div>
            <div className="value value-stars">
              <ScoreBadge count={activeChild.points} />
            </div>
          </div>
          <div className="stat">
            <div className="label">当前等级</div>
            <div className="value">Lv.{level}</div>
          </div>
          <div className="stat">
            <div className="label">连续天数</div>
            <div className="value">{activeChild.streak}</div>
          </div>
          <div className="stat">
            <div className="label">今日已完成</div>
            <div className="value">{doneToday}</div>
          </div>
        </div>

        <div className="progress-wrap" aria-label="等级进度">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="hint">
          {toNext > 0 ? (
            <>
              距离下一级还需 <ScoreBadge count={toNext} />
            </>
          ) : (
            "已达到新等级，继续保持！"
          )}
        </div>
      </section>

      <section className="card panel">
        <div className="row">
          <h2>模板库</h2>
          <span className="pill-tip">点击模板可快速加入任务</span>
        </div>
        <div className="template-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-chip${cat === activeCategory ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="template-desc">{activeInfo.desc}</p>
        <div className="template-list">
          {activeInfo.items.map((tpl, index) => (
            <div className="tpl-item" key={`${activeCategory}-${tpl.name}`}>
              <div className="tpl-main">
                <div className="emoji">{tpl.emoji}</div>
                <div className="tpl-title">{tpl.name}</div>
              </div>
              <div className="row">
                <span className="chip">
                  默认 <ScoreBadge count={tpl.points} />
                </span>
                <div className="row">
                  <select className="point-select" data-role="point-select" data-index={index} defaultValue={tpl.points}>
                    {[tpl.points, 5, 8, 10, 12].filter((v, i, arr) => arr.indexOf(v) === i).map((v) => (
                      <option value={v} key={v}>{scoreLabel(v)}</option>
                    ))}
                  </select>
                  <button className="btn-primary btn-small" onClick={() => addFromTemplate(index)}>
                    加入任务
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="main">
        <article className="card panel">
          <div className="row">
            <h2>习惯任务</h2>
            <span className="tiny">支持手动新增和模板导入</span>
          </div>
          <div className="habit-add">
            <input id="habitName" type="text" placeholder="新增习惯，例如：整理书包" />
            <div className="habit-point-control">
              <span className="habit-point-star" aria-hidden="true" />
              <select
                id="habitPoints"
                className="point-select habit-point-select"
                value={newHabitPoints}
                onChange={(e) => setNewHabitPoints(e.target.value)}
                aria-label="习惯积分"
              >
                {[3, 5, 6, 8, 10, 12, 15, 20].map((v) => (
                  <option value={v} key={v}>
                    +{v}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary" onClick={addHabitManually}>添加</button>
          </div>

          <div className="habit-list">
            {activeChild.habits.map((h) => {
              const done = h.completedDate === getToday();
              return (
                <div className="item" key={h.id}>
                  <div className="row">
                    <div className="tpl-main">
                      <div className="emoji">{h.emoji || "⭐"}</div>
                      <strong>{h.name}</strong>
                    </div>
                    <span className="chip">
                      <ScoreBadge count={h.points} />
                    </span>
                  </div>
                  <div className="row">
                    <span className="hint">{done ? "今天已完成" : "今天还未完成"}</span>
                    <button className={done ? "btn-warn" : "btn-ok"} onClick={() => toggleHabit(h.id)}>
                      {done ? "撤销打卡" : "完成打卡"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="card panel">
          <h2>奖励兑换</h2>
          <div className="line" />
          <form className="reward-add" onSubmit={addReward}>
            <input
              type="text"
              value={newRewardName}
              onChange={(e) => setNewRewardName(e.target.value)}
              placeholder="新增奖品，例如：去游乐场"
              aria-label="新增奖品名称"
            />
            <div className="habit-point-control reward-point-control">
              <span className="habit-point-star" aria-hidden="true" />
              <select
                className="point-select habit-point-select"
                value={newRewardPoints}
                onChange={(e) => setNewRewardPoints(e.target.value)}
                aria-label="新增奖品所需积分"
              >
                {[10, 15, 20, 30, 50, 80, 100, 120].map((v) => (
                  <option value={v} key={v}>
                    +{v}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary">新增奖品</button>
          </form>
          <div className="reward-list">
            {state.rewards.length === 0 ? (
              <div className="history-empty">还没有奖品，先新增一个吧。</div>
            ) : null}
            {state.rewards.map((r) => {
              const can = activeChild.points >= r.cost;
              return (
                <div className="item" key={r.id}>
                  <div className="row">
                    <strong>{r.name}</strong>
                    <span className="chip">
                      <ScoreBadge count={r.cost} />
                    </span>
                  </div>
                  <div className="row">
                    <span className="hint">{can ? "可以兑换" : "积分不足"}</span>
                    <div className="reward-actions">
                      <button className={can ? "btn-primary" : "btn-ghost"} disabled={!can} onClick={() => redeemReward(r.id)}>
                        立即兑换
                      </button>
                      <button className="btn-danger-ghost btn-small" onClick={() => removeReward(r.id)}>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="card panel">
          <div className="row">
            <h2>完成任务</h2>
            <button className="btn-ghost" onClick={goNewDay}>切到新的一天</button>
          </div>
          <div className="line" />
          <div className="history-list">
            {completedTodayItems.length === 0 ? (
              <div className="history-empty">今天还没有完成任务，先去打卡一个习惯吧。</div>
            ) : (
              completedTodayItems.map((h, idx) => (
                <div className="log-item" key={`${h.ts}-${idx}`}>
                  <div className="row">
                    <div className="tpl-main">
                      <div className="emoji">{h.emoji || "⭐"}</div>
                      <strong>{h.habitName || "已完成任务"}</strong>
                    </div>
                    <span className="chip">
                      <ScoreBadge count={h.points || 5} />
                    </span>
                  </div>
                  <div className="row">
                    <div className="log-status">
                      <span className="log-dot" />
                      <span>完成</span>
                    </div>
                    <div className="log-time">
                      <span className="log-date">{h.date}</span>
                      <span className="log-clock">{h.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="card panel focus-card">
          <div className="focus-head">
            <h2>专注统计</h2>
            <span className="focus-range-label">{focusWindow.label}</span>
          </div>

          <div className="focus-controls">
            <button className="focus-nav-btn" onClick={() => setFocusOffset((v) => v - 1)} aria-label="上一个周期">
              ‹
            </button>
            <div className="focus-tabs">
              {(["day", "week", "month", "year"] as FocusRange[]).map((item) => (
                <button
                  key={item}
                  className={`focus-tab${focusRange === item ? " active" : ""}`}
                  onClick={() => {
                    setFocusRange(item);
                    setFocusOffset(0);
                  }}
                >
                  {item === "day" ? "天" : item === "week" ? "周" : item === "month" ? "月" : "年"}
                </button>
              ))}
            </div>
            <button className="focus-nav-btn" onClick={() => setFocusOffset((v) => v + 1)} aria-label="下一个周期">
              ›
            </button>
          </div>

          <h3 className="focus-subtitle">概览</h3>
          <div className="focus-overview">
            <div className="focus-overview-item">
              <strong>{focusTotalHoursText}</strong>
              <span>专注总时长</span>
            </div>
            <div className="focus-overview-item">
              <strong>{focusDaysCount}</strong>
              <span>专注天数</span>
            </div>
            <div className="focus-overview-item">
              <strong>{focusTimes}</strong>
              <span>专注次数</span>
            </div>
          </div>

          <h3 className="focus-subtitle">趋势</h3>
          <div className="focus-chart-wrap">
            <svg className="focus-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="专注趋势图">
              <defs>
                <linearGradient id="focusAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(21, 212, 68, 0.5)" />
                  <stop offset="100%" stopColor="rgba(21, 212, 68, 0.02)" />
                </linearGradient>
              </defs>
              {dedupTicks.map((tick) => {
                const y = chartPadTop + (1 - tick / focusMaxY) * plotHeight;
                return (
                  <g key={`tick-${tick}`}>
                    <line x1={chartPadLeft} x2={chartPadLeft + plotWidth} y1={y} y2={y} className="focus-grid-line" />
                    <text x={chartPadLeft - 8} y={y + 4} className="focus-y-label">
                      {tick === 0 ? "0" : tick.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {focusAreaPath ? <path d={focusAreaPath} className="focus-area" /> : null}
              {focusLinePath ? <path d={focusLinePath} className="focus-line" /> : null}
              {focusLinePoints.map((point, index) => (
                <circle key={`dot-${index}`} cx={point.x} cy={point.y} r={3.4} className="focus-dot" />
              ))}
              {focusLinePoints.map((point, index) => {
                const mod =
                  focusRange === "year"
                    ? 1
                    : focusLinePoints.length > 12
                      ? 4
                      : focusLinePoints.length > 7
                        ? 2
                        : 1;
                if (index % mod !== 0 && index !== focusLinePoints.length - 1) return null;
                return (
                  <text key={`x-${index}`} x={point.x} y={chartPadTop + plotHeight + 20} className="focus-x-label">
                    {point.label}
                  </text>
                );
              })}
            </svg>
          </div>

          <h3 className="focus-subtitle">使用分布</h3>
          <div className="focus-distribution">
            {focusDistribution.length === 0 ? (
              <div className="history-empty">当前周期暂无完成任务。</div>
            ) : (
              focusDistribution.map((item) => (
                <div key={item.name} className="focus-dist-item">
                  <div className="focus-dist-top">
                    <div className="tpl-main">
                      <div className="emoji">{item.emoji}</div>
                      <strong>{item.name}</strong>
                    </div>
                    <span className="focus-dist-time">{formatHours(item.minutes)}</span>
                  </div>
                  <div className="focus-dist-meta">
                    <span className="focus-dist-points">⭐ {item.points}</span>
                    <span>{item.count}次</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="focus-progress-track">
                    <div className="focus-progress-bar" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
