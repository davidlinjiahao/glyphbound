import lexiconData from "../../data/lexicon.json";
import skillsData from "../../data/skills.json";
import enemiesData from "../../data/enemies.json";
import nodesData from "../../data/nodes.json";
import questsData from "../../data/quests.json";
import type { Enemy, LexiconEntry, MapNode, Quest, Skill } from "./types";

export const lexicon = lexiconData as Record<string, LexiconEntry>;
export const skills = skillsData as Skill[];
export const enemies = enemiesData as Enemy[];
export const nodes = nodesData as MapNode[];
export const quests = questsData as Quest[];

export function getSkill(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

export function getEnemy(id: string): Enemy | undefined {
  return enemies.find((e) => e.id === id);
}

export function getNode(id: string): MapNode | undefined {
  return nodes.find((n) => n.id === id);
}

export function getQuest(id: string): Quest | undefined {
  return quests.find((q) => q.id === id);
}

export function lookupGloss(phrase: string): LexiconEntry | null {
  if (lexicon[phrase]) return lexicon[phrase];
  // try longest match for substrings later in component
  return null;
}

/** Sort lexicon keys longest-first for tokenization */
export const lexiconKeys = Object.keys(lexicon).sort(
  (a, b) => b.length - a.length
);
