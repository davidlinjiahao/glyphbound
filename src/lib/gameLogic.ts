import { quests, getQuest, getNode, skills } from "./data";
import { startCombat } from "./combat";
import type {
  GameState,
  InventoryItem,
  QuestProgress,
  Screen,
} from "./types";

export function xpForLevel(level: number): number {
  return 50 + level * 40;
}

export function maxHpForLevel(level: number): number {
  return 80 + (level - 1) * 15;
}

export function attackForLevel(level: number): number {
  return 8 + (level - 1) * 3;
}

export function createInitialState(name: string): GameState {
  const first = quests.find((q) => q.id === "q1_welcome")!;
  return {
    created: true,
    name,
    classId: "剑客",
    level: 1,
    xp: 0,
    literacyXp: 0,
    xpToLevel: xpForLevel(1),
    gold: 0,
    hp: maxHpForLevel(1),
    maxHp: maxHpForLevel(1),
    attack: attackForLevel(1),
    currentNode: "plaza",
    inventory: [],
    quests: [
      {
        questId: first.id,
        status: "available",
        progress: {},
      },
    ],
    unlockedSkills: skills.filter((s) => s.unlockLevel <= 1).map((s) => s.id),
    killedCounts: {},
    screen: "map",
    combat: null,
    dialogue: null,
    dialogueContext: null,
    pendingLoot: null,
    totalPeeks: 0,
    noPeekActions: 0,
    gatherCounts: {},
    version: 1,
  };
}

export function addItem(
  inv: InventoryItem[],
  id: string,
  name: string,
  qty = 1
): InventoryItem[] {
  const copy = inv.map((i) => ({ ...i }));
  const existing = copy.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else copy.push({ id, name, qty });
  return copy;
}

export function removeItem(
  inv: InventoryItem[],
  id: string,
  qty = 1
): InventoryItem[] {
  const copy = inv.map((i) => ({ ...i }));
  const existing = copy.find((i) => i.id === id);
  if (!existing) return copy;
  existing.qty -= qty;
  return copy.filter((i) => i.qty > 0);
}

export function itemCount(inv: InventoryItem[], id: string): number {
  return inv.find((i) => i.id === id)?.qty ?? 0;
}

function objKey(qId: string, idx: number) {
  return `${qId}_${idx}`;
}

export function syncQuestProgress(state: GameState): GameState {
  const questsCopy = state.quests.map((q) => ({
    ...q,
    progress: { ...q.progress },
  }));

  for (const qp of questsCopy) {
    if (qp.status !== "active" && qp.status !== "ready") continue;
    const quest = getQuest(qp.questId);
    if (!quest) continue;

    let allDone = true;
    quest.objectives.forEach((obj, idx) => {
      const key = objKey(qp.questId, idx);
      let current = qp.progress[key] ?? 0;

      if (obj.type === "kill" && obj.enemyId) {
        current = Math.min(
          obj.count,
          state.killedCounts[obj.enemyId] ?? 0
        );
        // Use quest-local kill tracking stored in progress when started
        // Actually better: track kills since quest accepted in progress only
      }
      if (obj.type === "collect" && obj.itemId) {
        current = Math.min(obj.count, itemCount(state.inventory, obj.itemId));
      }
      if (obj.type === "deliver" && obj.itemId) {
        current = Math.min(obj.count, itemCount(state.inventory, obj.itemId));
      }
      qp.progress[key] = current;
      if (current < obj.count) allDone = false;
    });

    if (allDone && qp.status === "active") {
      qp.status = "ready";
    }
  }

  return { ...state, quests: questsCopy };
}

/** Increment kill progress only for active kill objectives */
export function recordKills(
  state: GameState,
  enemyId: string,
  count: number
): GameState {
  const killedCounts = {
    ...state.killedCounts,
    [enemyId]: (state.killedCounts[enemyId] ?? 0) + count,
  };
  let next = { ...state, killedCounts };
  const questsCopy = next.quests.map((q) => ({
    ...q,
    progress: { ...q.progress },
  }));

  for (const qp of questsCopy) {
    if (qp.status !== "active") continue;
    const quest = getQuest(qp.questId);
    if (!quest) continue;
    quest.objectives.forEach((obj, idx) => {
      if (obj.type === "kill" && obj.enemyId === enemyId) {
        const key = objKey(qp.questId, idx);
        qp.progress[key] = Math.min(
          obj.count,
          (qp.progress[key] ?? 0) + count
        );
      }
    });
  }
  next = { ...next, quests: questsCopy };
  return syncQuestProgress(next);
}

export function recordTalk(state: GameState, npc: string): GameState {
  const questsCopy = state.quests.map((q) => ({
    ...q,
    progress: { ...q.progress },
  }));
  for (const qp of questsCopy) {
    if (qp.status !== "active" && qp.status !== "available") continue;
    const quest = getQuest(qp.questId);
    if (!quest) continue;
    if (qp.status === "available" && quest.giver === npc) {
      // accepting handled elsewhere
      continue;
    }
    quest.objectives.forEach((obj, idx) => {
      if (obj.type === "talk" && obj.target === npc && qp.status === "active") {
        const key = objKey(qp.questId, idx);
        qp.progress[key] = obj.count;
      }
    });
  }
  return syncQuestProgress({ ...state, quests: questsCopy });
}

export function recordTrialComplete(state: GameState): GameState {
  const questsCopy = state.quests.map((q) => ({
    ...q,
    progress: { ...q.progress },
  }));
  for (const qp of questsCopy) {
    if (qp.status !== "active") continue;
    const quest = getQuest(qp.questId);
    if (!quest) continue;
    quest.objectives.forEach((obj, idx) => {
      if (obj.type === "trial") {
        const key = objKey(qp.questId, idx);
        qp.progress[key] = obj.count;
      }
    });
  }
  return syncQuestProgress({ ...state, quests: questsCopy });
}

export function acceptQuest(state: GameState, questId: string): GameState {
  const quest = getQuest(questId);
  if (!quest) return state;
  let inv = state.inventory;
  if (quest.startItems) {
    for (const it of quest.startItems) {
      inv = addItem(inv, it.id, it.name, 1);
    }
  }
  const questsCopy = state.quests.map((q) => {
    if (q.questId === questId) {
      const progress: Record<string, number> = {};
      quest.objectives.forEach((_, idx) => {
        progress[objKey(questId, idx)] = 0;
      });
      return { ...q, status: "active" as const, progress };
    }
    return q;
  });
  // talk quests with dialogue: mark talk on accept if giver talk
  let next: GameState = { ...state, inventory: inv, quests: questsCopy };
  if (quest.type === "talk") {
    next = recordTalk(next, quest.giver);
  }
  return syncQuestProgress(next);
}

export function completeQuest(state: GameState, questId: string): GameState {
  const quest = getQuest(questId);
  if (!quest) return state;

  let inv = [...state.inventory.map((i) => ({ ...i }))];
  // remove turn-in items for collect/deliver
  for (const obj of quest.objectives) {
    if (
      (obj.type === "collect" || obj.type === "deliver") &&
      obj.itemId
    ) {
      inv = removeItem(inv, obj.itemId, obj.count);
    }
  }
  for (const it of quest.rewards.items) {
    inv = addItem(inv, it.id, it.name, 1);
  }

  let xp = state.xp + quest.rewards.xp;
  const literacyXp = state.literacyXp + quest.rewards.literacyXp;
  const gold = state.gold + quest.rewards.gold;
  let level = state.level;
  let xpToLevel = state.xpToLevel;
  let maxHp = state.maxHp;
  let hp = state.hp;
  let attack = state.attack;
  const unlockedSkills = [...state.unlockedSkills];
  let leveled = false;

  while (xp >= xpToLevel) {
    xp -= xpToLevel;
    level += 1;
    xpToLevel = xpForLevel(level);
    maxHp = maxHpForLevel(level);
    hp = maxHp;
    attack = attackForLevel(level);
    leveled = true;
    for (const s of skills) {
      if (s.unlockLevel <= level && !unlockedSkills.includes(s.id)) {
        unlockedSkills.push(s.id);
      }
    }
  }

  const questsCopy = state.quests.map((q) =>
    q.questId === questId ? { ...q, status: "completed" as const } : q
  );

  // unlock next quests
  for (const nextId of quest.unlocks) {
    const nq = getQuest(nextId);
    if (!nq) continue;
    if (questsCopy.some((q) => q.questId === nextId)) continue;
    const reqs = nq.requires ?? [];
    const ok = reqs.every((r) =>
      questsCopy.some((q) => q.questId === r && q.status === "completed")
    );
    if (ok || reqs.length === 0) {
      questsCopy.push({
        questId: nextId,
        status: "available",
        progress: {},
      });
    }
  }

  // also check any quest whose requires are now met
  for (const nq of quests) {
    if (questsCopy.some((q) => q.questId === nq.id)) continue;
    const reqs = nq.requires ?? [];
    if (reqs.length === 0) continue;
    const ok = reqs.every((r) =>
      questsCopy.some((q) => q.questId === r && q.status === "completed")
    );
    if (ok) {
      questsCopy.push({
        questId: nq.id,
        status: "available",
        progress: {},
      });
    }
  }

  return {
    ...state,
    inventory: inv,
    xp,
    literacyXp,
    gold,
    level,
    xpToLevel,
    maxHp,
    hp,
    attack,
    unlockedSkills,
    quests: questsCopy,
    screen: leveled ? "levelup" : state.screen,
  };
}

export function travelTo(state: GameState, nodeId: string): GameState {
  const current = getNode(state.currentNode);
  if (!current?.connections.includes(nodeId)) return state;
  return { ...state, currentNode: nodeId, screen: "node" };
}

export function gatherAtNode(state: GameState): GameState {
  const node = getNode(state.currentNode);
  if (!node || node.type !== "gather") return state;
  // herb gather for quest
  const gatherCounts = {
    ...state.gatherCounts,
    herb: (state.gatherCounts.herb ?? 0) + 1,
  };
  const inv = addItem(state.inventory, "herb", "药草", 1);
  return syncQuestProgress({ ...state, inventory: inv, gatherCounts });
}

export function restAtNode(state: GameState): GameState {
  const node = getNode(state.currentNode);
  if (!node || node.type !== "rest") return state;
  return { ...state, hp: state.maxHp };
}

export function beginNodeCombat(
  state: GameState,
  enemyIds: string[],
  opts?: { isTrial?: boolean; maxPeeks?: number }
): GameState {
  const combat = startCombat(enemyIds, state.hp, state.maxHp, opts);
  return { ...state, combat, screen: "combat" };
}

export function setScreen(state: GameState, screen: Screen): GameState {
  return { ...state, screen };
}

export function getActiveQuests(state: GameState): QuestProgress[] {
  return state.quests.filter(
    (q) => q.status === "active" || q.status === "ready"
  );
}

export function getAvailableAtNode(
  state: GameState,
  nodeId: string
): QuestProgress[] {
  return state.quests.filter((qp) => {
    if (qp.status !== "available") return false;
    const q = getQuest(qp.questId);
    return q?.giverNode === nodeId;
  });
}

export function getTurnInAtNode(
  state: GameState,
  nodeId: string
): QuestProgress[] {
  return state.quests.filter((qp) => {
    if (qp.status !== "ready") return false;
    const q = getQuest(qp.questId);
    const turnNode = q?.turnInNode ?? q?.giverNode;
    return turnNode === nodeId;
  });
}

export function objectiveProgressLabel(
  state: GameState,
  questId: string,
  idx: number
): string {
  const qp = state.quests.find((q) => q.questId === questId);
  const quest = getQuest(questId);
  if (!qp || !quest) return "";
  const obj = quest.objectives[idx];
  const cur = qp.progress[objKey(questId, idx)] ?? 0;
  return `${obj.label} (${cur}/${obj.count})`;
}
