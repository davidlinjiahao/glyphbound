export type SkillType = "attack" | "defend" | "heal";

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  power: number;
  unlockLevel: number;
  color: string;
}

export interface LexiconEntry {
  pinyin: string;
  en: string;
}

export interface LootDrop {
  id: string;
  name: string;
  chance: number;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  attack: number;
  xp: number;
  gold: number;
  loot: LootDrop[];
  color: string;
  shape: string;
}

export interface MapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  connections: string[];
  npc?: string;
  description: string;
  enemyIds?: string[];
}

export interface QuestObjective {
  type: "kill" | "collect" | "deliver" | "talk" | "trial";
  target: string;
  count: number;
  label: string;
  enemyId?: string;
  itemId?: string;
  gatherNode?: string;
  deliverNode?: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface QuestReward {
  xp: number;
  literacyXp: number;
  gold: number;
  items: { id: string; name: string }[];
}

export interface Quest {
  id: string;
  title: string;
  type: string;
  giver: string;
  giverNode: string;
  description: string;
  objectives: QuestObjective[];
  dialogue?: DialogueLine[];
  turnInNode?: string;
  turnInNpc?: string;
  turnInDialogue?: DialogueLine[];
  startItems?: { id: string; name: string }[];
  rewards: QuestReward;
  unlocks: string[];
  requiredLevel: number;
  requires?: string[];
  trial?: {
    maxPeeks: number;
    prompt: string;
    enemyId: string;
    requiredSkillReads: boolean;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  qty: number;
}

export interface QuestProgress {
  questId: string;
  status: "available" | "active" | "ready" | "completed";
  progress: Record<string, number>;
}

export interface CombatEnemy {
  id: string;
  instanceId: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  xp: number;
  gold: number;
  loot: LootDrop[];
  color: string;
  shape: string;
}

export interface CombatState {
  enemies: CombatEnemy[];
  playerHp: number;
  playerMaxHp: number;
  blocking: boolean;
  log: string[];
  selectedTarget: string | null;
  phase: "player" | "enemy" | "victory" | "defeat";
  peeksUsed: number;
  maxPeeks: number | null;
  isTrial: boolean;
  noPeekBonus: boolean;
  loot: InventoryItem[];
  goldGained: number;
  xpGained: number;
  literacyGained: number;
}

export type Screen =
  | "title"
  | "create"
  | "map"
  | "node"
  | "combat"
  | "dialogue"
  | "loot"
  | "quests"
  | "inventory"
  | "levelup";

export interface GameState {
  created: boolean;
  name: string;
  classId: string;
  level: number;
  xp: number;
  literacyXp: number;
  xpToLevel: number;
  gold: number;
  hp: number;
  maxHp: number;
  attack: number;
  currentNode: string;
  inventory: InventoryItem[];
  quests: QuestProgress[];
  unlockedSkills: string[];
  killedCounts: Record<string, number>;
  screen: Screen;
  combat: CombatState | null;
  dialogue: DialogueLine[] | null;
  dialogueContext: string | null;
  pendingLoot: InventoryItem[] | null;
  totalPeeks: number;
  noPeekActions: number;
  gatherCounts: Record<string, number>;
  version: number;
}
