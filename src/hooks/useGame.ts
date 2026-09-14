"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadGame, saveGame, clearGame } from "@/lib/storage";
import {
  createInitialState,
  acceptQuest,
  completeQuest,
  travelTo,
  gatherAtNode,
  restAtNode,
  beginNodeCombat,
  recordKills,
  recordTalk,
  recordTrialComplete,
  addItem,
  syncQuestProgress,
  xpForLevel,
  maxHpForLevel,
  attackForLevel,
} from "@/lib/gameLogic";
import {
  applyPlayerSkill,
  runEnemyTurn,
  recordPeek,
  canPeek,
} from "@/lib/combat";
import { getSkill, getQuest, getNode, skills } from "@/lib/data";
import type { DialogueLine, GameState, Screen } from "@/lib/types";

interface GameContextValue {
  state: GameState | null;
  ready: boolean;
  createCharacter: (name: string) => void;
  resetGame: () => void;
  startCreate: () => void;
  go: (screen: Screen) => void;
  moveTo: (nodeId: string) => void;
  openNode: () => void;
  startCombatHere: () => void;
  startTrial: () => void;
  castSkill: (skillId: string) => void;
  selectTarget: (instanceId: string) => void;
  finishCombat: () => void;
  fleeCombat: () => void;
  onPeek: () => boolean;
  acceptQuestAt: (questId: string) => void;
  turnInQuest: (questId: string) => void;
  startDialogue: (lines: DialogueLine[], context: string) => void;
  closeDialogue: () => void;
  gather: () => void;
  rest: () => void;
  talkToNpc: (npc: string) => void;
  dismissLevelUp: () => void;
  dismissLoot: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const emptyTitle: GameState = {
  created: false,
  name: "",
  classId: "剑客",
  level: 1,
  xp: 0,
  literacyXp: 0,
  xpToLevel: 50,
  gold: 0,
  hp: 80,
  maxHp: 80,
  attack: 8,
  currentNode: "plaza",
  inventory: [],
  quests: [],
  unlockedSkills: [],
  killedCounts: {},
  screen: "title",
  combat: null,
  dialogue: null,
  dialogueContext: null,
  pendingLoot: null,
  totalPeeks: 0,
  noPeekActions: 0,
  gatherCounts: {},
  version: 1,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    setState(saved ?? emptyTitle);
    setReady(true);
  }, []);

  useEffect(() => {
    if (state?.created) saveGame(state);
  }, [state]);

  const update = useCallback((fn: (s: GameState) => GameState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      ready,
      createCharacter: (name: string) => {
        setState(createInitialState(name.trim() || "旅人"));
      },
      resetGame: () => {
        clearGame();
        setState(emptyTitle);
      },
      startCreate: () => {
        clearGame();
        setState({ ...emptyTitle, screen: "create" });
      },
      go: (screen) => update((s) => ({ ...s, screen })),
      moveTo: (nodeId) => update((s) => travelTo(s, nodeId)),
      openNode: () => update((s) => ({ ...s, screen: "node" })),
      startCombatHere: () =>
        update((s) => {
          const node = getNode(s.currentNode);
          const ids = node?.enemyIds ?? ["wolf"];
          return beginNodeCombat(s, ids);
        }),
      startTrial: () =>
        update((s) => {
          const quest = getQuest("q8_trial");
          const maxPeeks = quest?.trial?.maxPeeks ?? 3;
          const enemyId = quest?.trial?.enemyId ?? "wolf_boss";
          return beginNodeCombat(s, [enemyId], {
            isTrial: true,
            maxPeeks,
          });
        }),
      castSkill: (skillId) =>
        update((s) => {
          if (!s.combat) return s;
          const skill = getSkill(skillId);
          if (!skill) return s;
          let combat = applyPlayerSkill(s.combat, skill, s.attack);
          if (combat.phase === "enemy") {
            combat = runEnemyTurn(combat);
          }
          return { ...s, combat, hp: combat.playerHp };
        }),
      selectTarget: (instanceId) =>
        update((s) => {
          if (!s.combat) return s;
          return {
            ...s,
            combat: { ...s.combat, selectedTarget: instanceId },
          };
        }),
      finishCombat: () =>
        update((s) => {
          if (!s.combat || s.combat.phase !== "victory") return s;
          const c = s.combat;
          let next: GameState = { ...s };
          next.gold += c.goldGained;
          next.xp += c.xpGained;
          next.literacyXp += c.literacyGained;
          next.hp = c.playerHp;
          next.inventory = [...next.inventory.map((i) => ({ ...i }))];
          for (const item of c.loot) {
            next.inventory = addItem(
              next.inventory,
              item.id,
              item.name,
              item.qty
            );
          }
          const killMap: Record<string, number> = {};
          for (const e of c.enemies) {
            killMap[e.id] = (killMap[e.id] ?? 0) + 1;
          }
          for (const [id, n] of Object.entries(killMap)) {
            next = recordKills(next, id, n);
          }
          if (c.isTrial) {
            next = recordTrialComplete(next);
          }
          if (c.noPeekBonus) {
            next.noPeekActions += 1;
          }
          next.pendingLoot = c.loot;
          next.combat = null;
          next.screen = c.loot.length > 0 ? "loot" : "node";
          while (next.xp >= next.xpToLevel) {
            next.xp -= next.xpToLevel;
            next.level += 1;
            next.xpToLevel = xpForLevel(next.level);
            next.maxHp = maxHpForLevel(next.level);
            next.hp = next.maxHp;
            next.attack = attackForLevel(next.level);
            for (const sk of skills) {
              if (
                sk.unlockLevel <= next.level &&
                !next.unlockedSkills.includes(sk.id)
              ) {
                next.unlockedSkills = [...next.unlockedSkills, sk.id];
              }
            }
            next.screen = "levelup";
          }
          return syncQuestProgress(next);
        }),
      fleeCombat: () =>
        update((s) => ({
          ...s,
          combat: null,
          hp: Math.max(1, Math.floor(s.hp * 0.7)),
          screen: "map",
        })),
      onPeek: () => {
        let allowed = true;
        setState((prev) => {
          if (!prev?.combat) return prev;
          if (!canPeek(prev.combat)) {
            allowed = false;
            return prev;
          }
          return {
            ...prev,
            combat: recordPeek(prev.combat),
            totalPeeks: prev.totalPeeks + 1,
          };
        });
        return allowed;
      },
      acceptQuestAt: (questId) =>
        update((s) => {
          const q = getQuest(questId);
          if (!q) return s;
          let next = acceptQuest(s, questId);
          if (q.dialogue) {
            next = {
              ...next,
              dialogue: q.dialogue,
              dialogueContext: `accept:${questId}`,
              screen: "dialogue",
            };
          }
          return next;
        }),
      turnInQuest: (questId) =>
        update((s) => {
          const q = getQuest(questId);
          if (!q) return s;
          let next = completeQuest(s, questId);
          if (q.turnInDialogue) {
            next = {
              ...next,
              dialogue: q.turnInDialogue,
              dialogueContext: `turnin:${questId}`,
              screen: "dialogue",
            };
          }
          return next;
        }),
      startDialogue: (lines, context) =>
        update((s) => ({
          ...s,
          dialogue: lines,
          dialogueContext: context,
          screen: "dialogue",
        })),
      closeDialogue: () =>
        update((s) => ({
          ...s,
          dialogue: null,
          dialogueContext: null,
          screen: "node",
        })),
      gather: () => update((s) => gatherAtNode(s)),
      rest: () => update((s) => restAtNode(s)),
      talkToNpc: (npc) =>
        update((s) => {
          const available = s.quests.find((qp) => {
            if (qp.status !== "available") return false;
            const q = getQuest(qp.questId);
            return q?.giver === npc && q.giverNode === s.currentNode;
          });
          if (available) {
            const q = getQuest(available.questId)!;
            let next = acceptQuest(s, available.questId);
            if (q.dialogue) {
              next = {
                ...next,
                dialogue: q.dialogue,
                dialogueContext: `accept:${q.id}`,
                screen: "dialogue",
              };
            }
            return next;
          }
          const turnIn = s.quests.find((qp) => {
            if (qp.status !== "ready") return false;
            const q = getQuest(qp.questId);
            const turnNpc = q?.turnInNpc ?? q?.giver;
            const turnNode = q?.turnInNode ?? q?.giverNode;
            return turnNpc === npc && turnNode === s.currentNode;
          });
          if (turnIn) {
            const q = getQuest(turnIn.questId)!;
            let next = completeQuest(s, turnIn.questId);
            if (q.turnInDialogue) {
              next = {
                ...next,
                dialogue: q.turnInDialogue,
                dialogueContext: `turnin:${q.id}`,
                screen: "dialogue",
              };
            }
            return next;
          }
          let next = recordTalk(s, npc);
          next = {
            ...next,
            dialogue: [
              { speaker: npc, text: "你好，剑客。祝你冒险顺利。" },
            ],
            dialogueContext: "chat",
            screen: "dialogue",
          };
          return next;
        }),
      dismissLevelUp: () => update((s) => ({ ...s, screen: "node" })),
      dismissLoot: () =>
        update((s) => ({
          ...s,
          pendingLoot: null,
          screen: "node",
        })),
    }),
    [state, ready, update]
  );

  return React.createElement(GameContext.Provider, { value }, children);
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame outside provider");
  return ctx;
}
